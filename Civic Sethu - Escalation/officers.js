/* ============================================================
   CIVIC SETHU - MYSURU
   File: officers.js
   Purpose: Officer profiles, rankings, statistics, and history
   ============================================================ */

var CivicSethuOfficers = (function () {

  function computeOfficerStats(officerId) {
    var stats = {
      officer_id: officerId,
      total_assigned: 0,
      resolved: 0,
      pending: 0,
      escalated_against: 0,
      publicly_flagged: 0,
      avg_resolution_ms: 0,
      resolution_rate: 0,
      citizen_rating: 0,
      rating_count: 0,
      rank_score: 0,
      rank_band: "D"
    };

    if (typeof CivicSethuEscalation === "undefined") return stats;

    var all = CivicSethuEscalation.getAll();
    var durations = [];
    var ratingSum = 0;

    all.forEach(function (c) {
      var assigned = false;
      var escalatedAgainst = false;

      (c.history || []).forEach(function (h) {
        if (h.authority_id === officerId) {
          assigned = true;
          if (h.action === "escalated") escalatedAgainst = true;
        }
        if (h.action === "rating" && h.authority_id === officerId && h.stars) {
          ratingSum += h.stars;
          stats.rating_count++;
        }
      });

      if (assigned) {
        stats.total_assigned++;
        if (escalatedAgainst) stats.escalated_against++;
      }

      if (c.status === "resolved" && c.resolved_at) {
        var lastAuth = (c.history || []).slice().reverse().find(function (h) {
          return h.action === "resolved" && h.authority_id === officerId;
        });
        if (lastAuth) {
          stats.resolved++;
          durations.push(c.resolved_at - c.filed_at);
        }
      }

      if (c.status === "publicly_flagged") {
        var involved = (c.history || []).some(function (h) {
          return h.authority_id === officerId;
        });
        if (involved) stats.publicly_flagged++;
      }

      if ((c.status === "pending" || c.status === "escalated" || c.status === "in_progress")) {
        var isCurrent = false;
        if (c.history && c.history.length > 0) {
          var last = c.history[c.history.length - 1];
          if (last.authority_id === officerId && last.action !== "escalated") {
            isCurrent = true;
          }
        }
        if (isCurrent) stats.pending++;
      }
    });

    if (durations.length > 0) {
      var sum = durations.reduce(function (a, b) { return a + b; }, 0);
      stats.avg_resolution_ms = Math.round(sum / durations.length);
    }

    if (stats.total_assigned > 0) {
      stats.resolution_rate = stats.resolved / stats.total_assigned;
    }

    if (stats.rating_count > 0) {
      stats.citizen_rating = ratingSum / stats.rating_count;
    }

    stats.rank_score = computeRankScore(stats);
    stats.rank_band = getRankBand(stats.rank_score);

    return stats;
  }

  function computeRankScore(stats) {
    var resolutionPct = stats.resolution_rate * 100;
    var ratingPart = (stats.citizen_rating || 3) * 10;
    var escalationPenalty = stats.escalated_against * 5;
    var flaggedPenalty = stats.publicly_flagged * 10;
    var avgDays = stats.avg_resolution_ms / (1000 * 60 * 60 * 24);
    var timePenalty = avgDays * 0.5;

    var raw = (resolutionPct * 0.5) + ratingPart - escalationPenalty - flaggedPenalty - timePenalty;
    var score = Math.max(0, Math.min(100, raw));
    return Math.round(score * 10) / 10;
  }

  function getRankBand(score) {
    if (score >= 90) return "A+";
    if (score >= 75) return "A";
    if (score >= 60) return "B";
    if (score >= 45) return "C";
    return "D";
  }

  function getRankClass(band) {
    if (band === "A+") return "rank-Ap";
    if (band === "A") return "rank-A";
    if (band === "B") return "rank-B";
    if (band === "C") return "rank-C";
    return "rank-D";
  }

  function getAllOfficersSorted() {
    if (typeof CivicSethuAuthorities === "undefined") return [];
    var all = CivicSethuAuthorities.getAllAuthorities();
    var list = Object.keys(all).map(function (id) {
      var profile = all[id];
      var stats = computeOfficerStats(id);
      return { profile: profile, stats: stats };
    });
    list.sort(function (a, b) { return b.stats.rank_score - a.stats.rank_score; });
    return list;
  }

  function getOfficerProfile(officerId) {
    if (typeof CivicSethuAuthorities === "undefined") return null;
    var profile = CivicSethuAuthorities.getAuthorityById(officerId);
    if (!profile) return null;
    var stats = computeOfficerStats(officerId);
    return { profile: profile, stats: stats };
  }

  function renderOfficerCard(officerId) {
    var data = getOfficerProfile(officerId);
    if (!data) return "";

    var p = data.profile;
    var s = data.stats;
    var rankClass = getRankClass(s.rank_band);

    return '' +
      '<div class="officer-card" data-officer-id="' + escapeAttr(p.id) + '">' +
        '<div class="officer-card-head">' +
          '<div>' +
            '<div class="officer-card-name">' + escapeHtml(p.name) + '</div>' +
            '<div class="officer-card-role">' + escapeHtml(p.department || p.role || "") + '</div>' +
          '</div>' +
          '<div class="rank-badge ' + rankClass + '">' + s.rank_band + '</div>' +
        '</div>' +
        '<div class="officer-card-stats">' +
          '<div class="officer-stat">' +
            '<div class="officer-stat-num">' + s.total_assigned + '</div>' +
            '<div class="officer-stat-label">Assigned</div>' +
          '</div>' +
          '<div class="officer-stat">' +
            '<div class="officer-stat-num">' + s.resolved + '</div>' +
            '<div class="officer-stat-label">Resolved</div>' +
          '</div>' +
          '<div class="officer-stat">' +
            '<div class="officer-stat-num">' + (s.citizen_rating ? s.citizen_rating.toFixed(1) : "-") + '</div>' +
            '<div class="officer-stat-label">Rating</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function renderOfficersList(containerId, limit) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var list = getAllOfficersSorted();
    var showing = list.filter(function (o) {
      return o.stats.total_assigned > 0 || (o.profile && o.profile.role);
    });

    if (limit) showing = showing.slice(0, limit);

    if (showing.length === 0) {
      container.innerHTML = '<div class="empty-state">No officer activity yet. File a complaint or load demo data.</div>';
      return;
    }

    container.innerHTML = showing.map(function (o) {
      return renderOfficerCard(o.profile.id);
    }).join("");

    container.querySelectorAll(".officer-card").forEach(function (card) {
      card.addEventListener("click", function () {
        var id = card.getAttribute("data-officer-id");
        CivicSethuOfficers.emit("officer_click", id);
      });
    });
  }

  function renderOfficerDetail(containerId, officerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var data = getOfficerProfile(officerId);
    if (!data) {
      container.innerHTML = '<div class="empty-state">Officer not found.</div>';
      return;
    }

    var p = data.profile;
    var s = data.stats;
    var rankClass = getRankClass(s.rank_band);
    var avgDays = (s.avg_resolution_ms / (1000 * 60 * 60 * 24)).toFixed(1);
    var stars = renderStars(s.citizen_rating || 0);
    var history = getOfficerHistory(officerId, 20);

    container.innerHTML = '' +
      '<div class="detail-header">' +
        '<div class="detail-header-left">' +
          '<h2>' + escapeHtml(p.name) + '</h2>' +
          '<p>' + escapeHtml(p.department || "") + '</p>' +
          '<p style="margin-top:6px;font-size:0.82rem">' +
            escapeHtml(p.contact && p.contact.office ? p.contact.office : "") +
          '</p>' +
        '</div>' +
        '<div class="rank-badge ' + rankClass + '" style="font-size:1.2rem;padding:10px 18px">' +
          s.rank_band +
        '</div>' +
      '</div>' +

      '<div class="detail-stats">' +
        '<div class="detail-stat-box">' +
          '<div class="detail-stat-label">Rank Score</div>' +
          '<div class="detail-stat-value">' + s.rank_score.toFixed(1) + '</div>' +
        '</div>' +
        '<div class="detail-stat-box">' +
          '<div class="detail-stat-label">Resolution Rate</div>' +
          '<div class="detail-stat-value">' + Math.round(s.resolution_rate * 100) + '%</div>' +
        '</div>' +
        '<div class="detail-stat-box">' +
          '<div class="detail-stat-label">Citizen Rating</div>' +
          '<div class="detail-stat-value">' + (s.citizen_rating ? s.citizen_rating.toFixed(1) : "-") + '</div>' +
          '<div style="margin-top:4px;font-size:0.8rem">' + stars + '</div>' +
        '</div>' +
        '<div class="detail-stat-box">' +
          '<div class="detail-stat-label">Avg Resolution</div>' +
          '<div class="detail-stat-value">' + (s.avg_resolution_ms ? avgDays + "d" : "-") + '</div>' +
        '</div>' +
        '<div class="detail-stat-box">' +
          '<div class="detail-stat-label">Total Assigned</div>' +
          '<div class="detail-stat-value">' + s.total_assigned + '</div>' +
        '</div>' +
        '<div class="detail-stat-box">' +
          '<div class="detail-stat-label">Escalated Against</div>' +
          '<div class="detail-stat-value">' + s.escalated_against + '</div>' +
        '</div>' +
      '</div>' +

      '<h3 class="detail-section-title">Complaint History</h3>' +
      (history.length === 0
        ? '<div class="empty-state">No complaints handled yet.</div>'
        : '<div class="history-list">' + history.map(renderHistoryItem).join("") + '</div>');
  }

  function getOfficerHistory(officerId, limit) {
    if (typeof CivicSethuEscalation === "undefined") return [];
    var all = CivicSethuEscalation.getAll();
    var items = [];

    all.forEach(function (c) {
      var involved = false;
      var lastAction = null;
      var lastTime = 0;

      (c.history || []).forEach(function (h) {
        if (h.authority_id === officerId) {
          involved = true;
          if (h.at > lastTime) {
            lastTime = h.at;
            lastAction = h;
          }
        }
      });

      if (involved) {
        items.push({
          complaint_id: c.id,
          problem_label: c.problem_label,
          area_name: c.location.area_name,
          status: c.status,
          action: lastAction ? lastAction.action : "assigned",
          at: lastTime
        });
      }
    });

    items.sort(function (a, b) { return b.at - a.at; });
    return limit ? items.slice(0, limit) : items;
  }

  function renderHistoryItem(item) {
    var timeStr = timeAgo(item.at);
    var actionLabel = (item.action || "assigned").replace(/_/g, " ");
    return '' +
      '<div class="history-item">' +
        '<div>' +
          '<strong>' + escapeHtml(item.problem_label) + '</strong> &middot; ' +
          escapeHtml(item.area_name) +
        '</div>' +
        '<div class="history-time">' +
          actionLabel + ' &middot; ' + timeStr + ' &middot; ' +
          escapeHtml(item.status.replace(/_/g, " ")) +
        '</div>' +
      '</div>';
  }

  function renderStars(rating) {
    var out = "";
    var full = Math.floor(rating);
    var partial = rating - full;
    for (var i = 0; i < 5; i++) {
      if (i < full) out += '<span style="color:var(--gold-primary)">&#9733;</span>';
      else if (i === full && partial >= 0.5) out += '<span style="color:var(--gold-primary)">&#9733;</span>';
      else out += '<span style="opacity:0.3">&#9733;</span>';
    }
    return out;
  }

  function timeAgo(timestamp) {
    var diff = Date.now() - timestamp;
    var mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return mins + "m ago";
    var hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + "h ago";
    var days = Math.floor(hrs / 24);
    return days + "d ago";
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    return escapeHtml(str);
  }

  var listeners = {};
  function on(eventName, fn) {
    if (!listeners[eventName]) listeners[eventName] = [];
    listeners[eventName].push(fn);
  }
  function emit(eventName, payload) {
    if (!listeners[eventName]) return;
    listeners[eventName].forEach(function (fn) {
      try { fn(payload); } catch (e) {}
    });
  }

  return {
    computeOfficerStats: computeOfficerStats,
    computeRankScore: computeRankScore,
    getRankBand: getRankBand,
    getRankClass: getRankClass,
    getAllOfficersSorted: getAllOfficersSorted,
    getOfficerProfile: getOfficerProfile,
    renderOfficerCard: renderOfficerCard,
    renderOfficersList: renderOfficersList,
    renderOfficerDetail: renderOfficerDetail,
    getOfficerHistory: getOfficerHistory,
    on: on,
    emit: emit
  };
})();

if (typeof window !== "undefined") {
  window.CivicSethuOfficers = CivicSethuOfficers;
}