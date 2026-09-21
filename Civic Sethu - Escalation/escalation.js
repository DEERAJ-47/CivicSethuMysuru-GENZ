/* ============================================================
   CIVIC SETHU - MYSURU
   File: escalation.js
   Purpose: The escalation engine - timer, auto-escalation,
            status updates, public flagging, and event handling
   ============================================================ */

var CivicSethuEscalation = (function () {

  var complaints = [];
  var listeners = [];
  var tickIntervalId = null;
  var TICK_MS = 1000;

  function generateId() {
    var now = Date.now();
    var rand = Math.floor(Math.random() * 1000);
    return "CMP-" + now.toString().slice(-7) + "-" + rand;
  }

  function emit(eventName, payload) {
    listeners.forEach(function (fn) {
      try { fn(eventName, payload); } catch (e) {}
    });
  }

  function onEvent(fn) {
    if (typeof fn === "function") listeners.push(fn);
  }

  function getChainForComplaint(complaint) {
    return CivicSethuData.getEscalationChain(
      complaint.problem_id,
      complaint.location.location_type
    );
  }

  function getCurrentAuthority(complaint) {
    return CivicSethuData.resolveAuthorityForLevel(
      complaint,
      complaint.current_level
    );
  }

  function getNextAuthority(complaint) {
    var nextLevel = complaint.current_level + 1;
    var chain = getChainForComplaint(complaint);
    if (nextLevel > chain.length) return null;
    return CivicSethuData.resolveAuthorityForLevel(complaint, nextLevel);
  }

  function isAtLastLevel(complaint) {
    var chain = getChainForComplaint(complaint);
    return complaint.current_level >= chain.length;
  }

  function getTimeRemainingMs(complaint) {
    if (complaint.status === "resolved") return 0;
    if (complaint.status === "publicly_flagged") return 0;
    return Math.max(0, complaint.escalate_at - Date.now());
  }

  function getProgressPercent(complaint) {
    var total = complaint.escalate_at - complaint.filed_at;
    if (total <= 0) return 100;
    var elapsed = Date.now() - complaint.filed_at;
    var pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
    return Math.round(pct);
  }

  function addHistoryEntry(complaint, entry) {
    complaint.history.push(entry);
    if (complaint.history.length > CivicSethuData.MAX_HISTORY_ENTRIES) {
      complaint.history.shift();
    }
  }

  function createComplaint(input) {
    var route = CivicSethuRouting.buildComplaintRoute(input);
    if (!route.success) return route;

    var complaint = route.complaint;
    complaint.id = generateId();
    complaints.push(complaint);
    emit("complaint_created", complaint);
    return { success: true, complaint: complaint };
  }

  function escalateOneStep(complaint) {
    var chain = getChainForComplaint(complaint);
    var nextLevel = complaint.current_level + 1;

    if (nextLevel > chain.length) {
      complaint.status = "publicly_flagged";
      complaint.escalate_at = Number.MAX_SAFE_INTEGER;
      addHistoryEntry(complaint, {
        level: complaint.current_level,
        authority_id: "system",
        authority_name: "System",
        action: "publicly_flagged",
        at: Date.now(),
        note: "No authority responded. Complaint flagged publicly."
      });
      emit("complaint_flagged", complaint);
      return complaint;
    }

    var previousAuthority = getCurrentAuthority(complaint);
    complaint.current_level = nextLevel;

    var step = chain[nextLevel - 1];
    var authority = CivicSethuData.resolveAuthorityForLevel(complaint, nextLevel);
    var priority = complaint.problem_priority || "normal";
    var timerMs = CivicSethuData.getTimerMs(priority);

    complaint.escalate_at = Date.now() + timerMs;
    complaint.status = "escalated";

    addHistoryEntry(complaint, {
      level: nextLevel,
      authority_id: authority ? authority.id : step.authority_key,
      authority_name: authority ? authority.name : step.label,
      action: "escalated",
      at: Date.now(),
      note: "Escalated from " + (previousAuthority ? previousAuthority.name : "previous level")
    });

    emit("complaint_escalated", {
      complaint: complaint,
      from_authority: previousAuthority,
      to_authority: authority
    });

    return complaint;
  }

  function tickComplaint(complaint) {
    if (complaint.status === "resolved") return complaint;
    if (complaint.status === "rejected") return complaint;
    if (complaint.status === "publicly_flagged") return complaint;
    if (Date.now() < complaint.escalate_at) return complaint;
    return escalateOneStep(complaint);
  }

  function tickAll() {
    var escalated = [];
    for (var i = 0; i < complaints.length; i++) {
      var before = complaints[i].current_level;
      var beforeStatus = complaints[i].status;
      tickComplaint(complaints[i]);
      if (
        complaints[i].current_level !== before ||
        complaints[i].status !== beforeStatus
      ) {
        escalated.push(complaints[i]);
      }
    }
    if (escalated.length > 0) {
      emit("tick_complete", { escalated: escalated, total: complaints.length });
    }
    return escalated;
  }

  function startEngine() {
    if (tickIntervalId) return;
    tickIntervalId = setInterval(function () {
      tickAll();
      emit("refresh", { complaints: complaints });
    }, TICK_MS);
    emit("engine_started", {});
  }

  function stopEngine() {
    if (tickIntervalId) {
      clearInterval(tickIntervalId);
      tickIntervalId = null;
      emit("engine_stopped", {});
    }
  }

  function markResolved(complaintId, note) {
    var c = findById(complaintId);
    if (!c) return null;
    if (c.status === "resolved") return c;

    var authority = getCurrentAuthority(c);
    c.status = "resolved";
    c.resolved_at = Date.now();
    c.escalate_at = Number.MAX_SAFE_INTEGER;

    addHistoryEntry(c, {
      level: c.current_level,
      authority_id: authority ? authority.id : "unknown",
      authority_name: authority ? authority.name : "Unknown",
      action: "resolved",
      at: Date.now(),
      note: note || "Complaint resolved by current authority"
    });

    emit("complaint_resolved", c);
    return c;
  }

  function markInProgress(complaintId, note) {
    var c = findById(complaintId);
    if (!c) return null;
    if (c.status === "resolved") return c;

    var authority = getCurrentAuthority(c);
    c.status = "in_progress";

    addHistoryEntry(c, {
      level: c.current_level,
      authority_id: authority ? authority.id : "unknown",
      authority_name: authority ? authority.name : "Unknown",
      action: "in_progress",
      at: Date.now(),
      note: note || "Authority has started work"
    });

    emit("complaint_in_progress", c);
    return c;
  }

  function rejectComplaint(complaintId, note) {
    var c = findById(complaintId);
    if (!c) return null;

    var authority = getCurrentAuthority(c);
    c.status = "rejected";
    c.escalate_at = Number.MAX_SAFE_INTEGER;

    addHistoryEntry(c, {
      level: c.current_level,
      authority_id: authority ? authority.id : "unknown",
      authority_name: authority ? authority.name : "Unknown",
      action: "rejected",
      at: Date.now(),
      note: note || "Complaint rejected as invalid or duplicate"
    });

    emit("complaint_rejected", c);
    return c;
  }

  function findById(complaintId) {
    for (var i = 0; i < complaints.length; i++) {
      if (complaints[i].id === complaintId) return complaints[i];
    }
    return null;
  }

  function getAll() {
    return complaints.slice();
  }

  function getByStatus(statusId) {
    return complaints.filter(function (c) { return c.status === statusId; });
  }

  function getByArea(areaId) {
    return complaints.filter(function (c) {
      return c.location && c.location.area_id === areaId;
    });
  }

  function getByTaluk(talukId) {
    return complaints.filter(function (c) {
      return c.location && c.location.taluk_id === talukId;
    });
  }

  function getByProblem(problemId) {
    return complaints.filter(function (c) {
      return c.problem_id === problemId;
    });
  }

  function getStatsForArea(areaId) {
    var list = getByArea(areaId);
    return buildStats(list);
  }

  function getStatsForTaluk(talukId) {
    var list = getByTaluk(talukId);
    return buildStats(list);
  }

  function getGlobalStats() {
    return buildStats(complaints);
  }

  function buildStats(list) {
    var stats = {
      total: list.length,
      pending: 0,
      in_progress: 0,
      resolved: 0,
      escalated: 0,
      publicly_flagged: 0,
      rejected: 0,
      avg_resolution_ms: 0,
      rating: 0
    };

    var resolvedDurations = [];

    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      if (stats[c.status] !== undefined) stats[c.status]++;
      if (c.status === "resolved" && c.resolved_at) {
        resolvedDurations.push(c.resolved_at - c.filed_at);
      }
    }

    if (resolvedDurations.length > 0) {
      var sum = resolvedDurations.reduce(function (a, b) { return a + b; }, 0);
      stats.avg_resolution_ms = Math.round(sum / resolvedDurations.length);
    }

    if (stats.total > 0) {
      var successRate = stats.resolved / stats.total;
      var penalty = stats.publicly_flagged / stats.total;
      var raw = (successRate * 5) - (penalty * 2);
      stats.rating = Math.max(0, Math.min(5, Math.round(raw * 10) / 10));
    }

    return stats;
  }

  function clearAll() {
    complaints = [];
    emit("cleared", {});
  }

  function getChainLabels(complaint) {
    var chain = getChainForComplaint(complaint);
    return chain.map(function (step) {
      return {
        level: step.level,
        label: step.label,
        role: step.role,
        is_current: step.level === complaint.current_level,
        is_passed: step.level < complaint.current_level
      };
    });
  }

  function toJSON(complaint) {
    return JSON.stringify(complaint, null, 2);
  }

  function loadFromArray(arr) {
    if (!Array.isArray(arr)) return;
    complaints = arr.slice();
    emit("loaded", { count: complaints.length });
  }

  return {
    onEvent: onEvent,
    emit: emit,
    createComplaint: createComplaint,
    escalateOneStep: escalateOneStep,
    tickComplaint: tickComplaint,
    tickAll: tickAll,
    startEngine: startEngine,
    stopEngine: stopEngine,
    markResolved: markResolved,
    markInProgress: markInProgress,
    rejectComplaint: rejectComplaint,
    findById: findById,
    getAll: getAll,
    getByStatus: getByStatus,
    getByArea: getByArea,
    getByTaluk: getByTaluk,
    getByProblem: getByProblem,
    getStatsForArea: getStatsForArea,
    getStatsForTaluk: getStatsForTaluk,
    getGlobalStats: getGlobalStats,
    buildStats: buildStats,
    getCurrentAuthority: getCurrentAuthority,
    getNextAuthority: getNextAuthority,
    isAtLastLevel: isAtLastLevel,
    getTimeRemainingMs: getTimeRemainingMs,
    getProgressPercent: getProgressPercent,
    getChainForComplaint: getChainForComplaint,
    getChainLabels: getChainLabels,
    clearAll: clearAll,
    toJSON: toJSON,
    loadFromArray: loadFromArray
  };
})();

if (typeof window !== "undefined") {
  window.CivicSethuEscalation = CivicSethuEscalation;
}