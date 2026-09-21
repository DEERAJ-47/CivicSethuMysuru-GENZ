/* ============================================================
   CIVIC SETHU - MYSURU
   File: app.js
   Purpose: Main controller - intro, login, view switching,
            form flow, dashboard, officers, live updates
   ============================================================ */

(function () {

  var state = {
    currentView: "map",
    locationType: null,
    selectedTaluk: null,
    selectedArea: null,
    selectedProblem: null,
    dashboardFilter: "all",
    currentOfficerId: null,
    mapInitialized: false
  };

  /* ============================================================
     INITIALIZATION
     ============================================================ */

  function init() {
    initMap();
    bindIntro();
    bindTopbar();
    bindLogin();
    bindComplaintForm();
    bindDashboard();
    bindOfficers();
    bindMap();
    CivicSethuFeedback.bindModalEvents();
    CivicSethuFeedback.bindFeedbackButtons();

    restoreSession();
    CivicSethuEscalation.startEngine();
    CivicSethuEscalation.onEvent(handleEscalationEvent);

    updateDemoButton();
    refreshSidebarStats();
  }

  function bindIntro() {
    var enter = document.getElementById("intro-enter");
    var overlay = document.getElementById("intro-overlay");
    if (!enter || !overlay) return;

    enter.addEventListener("click", function () {
      overlay.classList.add("fade-out");
      setTimeout(function () {
        overlay.classList.add("hidden");
        if (!state.mapInitialized) {
          initMap();
        }
      }, 800);
    });
  }

  function initMap() {
    CivicSethuMap.init("map");
    CivicSethuMap.bindLayerButtons();
    CivicSethuMap.on("feature_click", function (payload) {
      // Hook for future analytics
    });
    CivicSethuMap.on("marker_click", function (complaint) {
      openComplaintDetail(complaint.id);
    });
    state.mapInitialized = true;
  }

  function bindMap() {
    var clearBtn = document.getElementById("layer-clear");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        CivicSethuMap.clearAllLayers();
      });
    }
  }

  /* ============================================================
     TOPBAR + VIEW SWITCHING
     ============================================================ */

  function bindTopbar() {
    document.querySelectorAll(".nav-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var view = btn.getAttribute("data-view");
        switchView(view);
      });
    });

    var demoBtn = document.getElementById("demo-toggle");
    if (demoBtn) {
      demoBtn.addEventListener("click", function () {
        var isOn = CivicSethuData.isDemoMode();
        CivicSethuData.setDemoMode(!isOn);
        updateDemoButton();
      });
    }
  }

  function switchView(viewName) {
    document.querySelectorAll(".view").forEach(function (v) {
      v.classList.remove("active");
    });
    var target = document.getElementById("view-" + viewName);
    if (target) target.classList.add("active");

    document.querySelectorAll(".nav-btn").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-view") === viewName);
    });

    state.currentView = viewName;

    if (viewName === "dashboard") renderDashboard();
    if (viewName === "officers") renderOfficers();
    if (viewName === "map" && state.mapInitialized) {
      setTimeout(function () {
        CivicSethuMap.getMap().invalidateSize();
      }, 100);
    }
    if (viewName === "file") renderComplaintForm();
  }

  function updateDemoButton() {
    var stateEl = document.getElementById("demo-state");
    if (stateEl) stateEl.textContent = CivicSethuData.isDemoMode() ? "ON" : "OFF";
  }

  /* ============================================================
     LOGIN
     ============================================================ */

  function bindLogin() {
    var loginBtn = document.getElementById("login-btn");
    var logoutBtn = document.getElementById("logout-btn");
    var form = document.getElementById("login-form");

    if (loginBtn) {
      loginBtn.addEventListener("click", function () {
        var modal = document.getElementById("login-modal");
        if (modal) modal.classList.remove("hidden");
      });
    }

    document.querySelectorAll("[data-close-modal]").forEach(function (el) {
      el.addEventListener("click", function () {
        var modal = document.getElementById("login-modal");
        if (modal) modal.classList.add("hidden");
      });
    });

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var name = document.getElementById("login-name").value.trim();
        var phone = document.getElementById("login-phone").value.trim();
        var area = document.getElementById("login-area").value.trim();
        if (!name || !phone) return;

        var user = { name: name, phone: phone, area: area, loggedInAt: Date.now() };
        localStorage.setItem("civic_sethu_user", JSON.stringify(user));
        applyUserToUI(user);

        var modal = document.getElementById("login-modal");
        if (modal) modal.classList.add("hidden");
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("civic_sethu_user");
        applyUserToUI(null);
      });
    }
  }

  function restoreSession() {
    var user = CivicSethuFeedback && window.CivicSethuFeedback
      ? (function () {
          try {
            var raw = localStorage.getItem("civic_sethu_user");
            return raw ? JSON.parse(raw) : null;
          } catch (e) { return null; }
        })()
      : null;
    applyUserToUI(user);
  }

  function applyUserToUI(user) {
    var chip = document.getElementById("user-chip");
    var nameEl = document.getElementById("user-name");
    var loginBtn = document.getElementById("login-btn");

    if (user) {
      if (chip) chip.classList.remove("hidden");
      if (nameEl) nameEl.textContent = user.name;
      if (loginBtn) loginBtn.classList.add("hidden");
    } else {
      if (chip) chip.classList.add("hidden");
      if (loginBtn) loginBtn.classList.remove("hidden");
    }
    if (state.currentView === "dashboard") renderDashboard();
  }

  function getCurrentUser() {
    try {
      var raw = localStorage.getItem("civic_sethu_user");
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  /* ============================================================
     COMPLAINT FORM
     ============================================================ */

  function renderComplaintForm() {
    renderTalukDropdown();
    renderProblemGrid();

    document.querySelectorAll("#location-type-row .chip").forEach(function (chip) {
      chip.classList.toggle("active", chip.getAttribute("data-value") === state.locationType);
    });

    if (state.selectedProblem) {
      document.querySelectorAll(".problem-btn").forEach(function (b) {
        b.classList.toggle("active", b.getAttribute("data-problem") === state.selectedProblem);
      });
    }
  }

  function renderTalukDropdown() {
    var sel = document.getElementById("taluk-select");
    if (!sel || sel.options.length > 0) return;

    sel.innerHTML = '<option value="">Select Taluk</option>';
    CivicSethuLocations.getTaluks().forEach(function (t) {
      var opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = t.name;
      sel.appendChild(opt);
    });
  }

  function renderAreaDropdown(talukId, locationType) {
    var sel = document.getElementById("area-select");
    if (!sel) return;

    sel.innerHTML = '<option value="">Select Area</option>';

    if (locationType === "city") {
      var ulbs = CivicSethuLocations.getULBsByTaluk(talukId);
      ulbs.forEach(function (u) {
        var opt = document.createElement("option");
        opt.value = "ulb_" + u.id;
        opt.textContent = u.name + " (" + u.type + ")";
        sel.appendChild(opt);
      });

      if (talukId === "mysuru") {
        var wardsGroup = document.createElement("optgroup");
        wardsGroup.label = "MCC Wards";
        CivicSethuLocations.MCC_WARDS.forEach(function (w) {
          var opt = document.createElement("option");
          opt.value = "mcc_ward_" + w.id;
          opt.textContent = "Ward " + w.id + " - " + w.name;
          wardsGroup.appendChild(opt);
        });
        sel.appendChild(wardsGroup);
      }
    } else if (locationType === "village") {
      var gps = CivicSethuLocations.getGramPanchayatsByTaluk(talukId);
      gps.forEach(function (gp) {
        var opt = document.createElement("option");
        opt.value = "gp_" + talukId + "_" + gp;
        opt.textContent = gp + " Gram Panchayat";
        sel.appendChild(opt);
      });
    }
  }

  function renderProblemGrid() {
    var grid = document.getElementById("problem-grid");
    if (!grid || grid.children.length > 0) return;

    CivicSethuProblems.getAllProblems().forEach(function (p) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "problem-btn";
      btn.setAttribute("data-problem", p.id);
      btn.innerHTML =
        '<span class="problem-icon" style="color:' + p.color + '">&#9679;</span>' +
        '<span>' + escapeHtml(p.label) + '</span>';
      grid.appendChild(btn);
    });
  }

  function bindComplaintForm() {
    document.getElementById("location-type-row").addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip) return;
      state.locationType = chip.getAttribute("data-value");
      document.querySelectorAll("#location-type-row .chip").forEach(function (c) {
        c.classList.toggle("active", c === chip);
      });
      var talukSel = document.getElementById("taluk-select");
      if (talukSel && talukSel.value) {
        renderAreaDropdown(talukSel.value, state.locationType);
      }
    });

    document.getElementById("taluk-select").addEventListener("change", function (e) {
      state.selectedTaluk = e.target.value;
      renderAreaDropdown(state.selectedTaluk, state.locationType || "city");
    });

    document.getElementById("area-select").addEventListener("change", function (e) {
      state.selectedArea = e.target.value;
    });

    document.getElementById("problem-grid").addEventListener("click", function (e) {
      var btn = e.target.closest(".problem-btn");
      if (!btn) return;
      state.selectedProblem = btn.getAttribute("data-problem");
      document.querySelectorAll(".problem-btn").forEach(function (b) {
        b.classList.toggle("active", b === btn);
      });
    });

    document.getElementById("complaint-form").addEventListener("submit", function (e) {
      e.preventDefault();
      submitComplaint();
    });
  }

  function submitComplaint() {
    var user = getCurrentUser();
    if (!user) {
      alert("Please login before filing a complaint.");
      var modal = document.getElementById("login-modal");
      if (modal) modal.classList.remove("hidden");
      return;
    }

    if (!state.locationType) { alert("Please select City or Village."); return; }
    if (!state.selectedTaluk) { alert("Please select a Taluk."); return; }
    if (!state.selectedProblem) { alert("Please select a problem type."); return; }

    var areaSel = document.getElementById("area-select");
    var pinEl = document.getElementById("pin-input");
    var descEl = document.getElementById("description-input");

    var input = {
      location_type: state.locationType,
      taluk_id: state.selectedTaluk,
      area_id: areaSel ? areaSel.value : null,
      pin_code: pinEl ? pinEl.value.trim() : null,
      problem_id: state.selectedProblem,
      citizen_name: user.name,
      citizen_phone: user.phone,
      description: descEl ? descEl.value.trim() : "",
      photo_url: null,
      gps: null
    };

    var result = CivicSethuEscalation.createComplaint(input);
    if (!result.success) {
      alert("Could not file complaint: " + (result.message || "Unknown error"));
      return;
    }

    renderRoutingResult(result.complaint);

    document.getElementById("complaint-form").reset();
    state.locationType = null;
    state.selectedTaluk = null;
    state.selectedArea = null;
    state.selectedProblem = null;
    document.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
    document.querySelectorAll(".problem-btn").forEach(function (b) { b.classList.remove("active"); });

    refreshSidebarStats();
  }

  function renderRoutingResult(complaint) {
    var el = document.getElementById("routing-result");
    if (!el) return;

    var a = complaint.routing.level_1_authority;
    el.innerHTML =
      '<h3>Complaint Filed - ' + complaint.id + '</h3>' +
      '<div class="route-row"><span>Problem</span><span>' + escapeHtml(complaint.problem_label) + '</span></div>' +
      '<div class="route-row"><span>Area</span><span>' + escapeHtml(complaint.location.area_name) + '</span></div>' +
      '<div class="route-row"><span>Location Type</span><span>' + capitalize(complaint.location.location_type) + '</span></div>' +
      '<div class="route-row"><span>Assigned To</span><span>' + escapeHtml(a.name) + '</span></div>' +
      '<div class="route-row"><span>Department</span><span>' + escapeHtml(a.department || "-") + '</span></div>' +
      '<div class="route-row"><span>Priority</span><span>' + capitalize(complaint.problem_priority) + '</span></div>' +
      '<div class="route-row"><span>Auto-Escalate In</span><span>' + complaint.timer_hours + ' hours</span></div>' +
      '<div class="route-row"><span>Reason</span><span>' + escapeHtml(complaint.routing.reason) + '</span></div>';

    el.classList.remove("hidden");
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ============================================================
     DASHBOARD
     ============================================================ */

  function bindDashboard() {
    document.querySelectorAll(".filter-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.dashboardFilter = btn.getAttribute("data-filter");
        document.querySelectorAll(".filter-btn").forEach(function (b) {
          b.classList.toggle("active", b === btn);
        });
        renderDashboard();
      });
    });
  }

  function renderDashboard() {
    var list = document.getElementById("dashboard-list");
    if (!list) return;

    var all = CivicSethuEscalation.getAll();

    var user = getCurrentUser();
    var mine = user ? all.filter(function (c) {
      return c.citizen && (c.citizen.phone === user.phone || c.citizen.name === user.name);
    }) : [];

    var display = mine.length > 0 ? mine : all;

    if (state.dashboardFilter !== "all") {
      display = display.filter(function (c) { return c.status === state.dashboardFilter; });
    }

    display.sort(function (a, b) { return b.filed_at - a.filed_at; });

    if (display.length === 0) {
      list.innerHTML = '<div class="empty-state">No complaints to show. File one or load demo data.</div>';
      return;
    }

    list.innerHTML = display.map(renderComplaintCard).join("");

    list.querySelectorAll(".complaint-card").forEach(function (card) {
      card.addEventListener("click", function (e) {
        if (e.target.closest(".feedback-btn")) return;
        var id = card.getAttribute("data-complaint-id");
        openComplaintDetail(id);
      });
    });
  }

  function renderComplaintCard(c) {
    var statusInfo = CivicSethuData.getStatusInfo(c.status);
    var progress = CivicSethuEscalation.getProgressPercent(c);
    var remaining = CivicSethuEscalation.getTimeRemainingMs(c);
    var remainingStr = formatDuration(remaining);
    var tickHtml = CivicSethuTicks.renderWithLabel(c);
    var feedbackBtn = CivicSethuFeedback.renderFeedbackButton(c);

    return '' +
      '<div class="complaint-card status-' + c.status + '" data-complaint-id="' + c.id + '">' +
        '<div class="complaint-card-head">' +
          '<div>' +
            '<div class="complaint-card-title">' + escapeHtml(c.problem_label) + '</div>' +
            '<div class="complaint-card-meta">' +
              '<span>' + c.id + '</span>' +
              '<span>' + escapeHtml(c.location.area_name) + '</span>' +
              '<span>' + capitalize(c.location.location_type) + '</span>' +
            '</div>' +
          '</div>' +
          '<span class="status-badge" style="background:' + statusInfo.color + '">' +
            statusInfo.label +
          '</span>' +
        '</div>' +
        '<div class="complaint-card-desc">' + escapeHtml(c.description || "") + '</div>' +
        '<div class="complaint-card-foot">' +
          '<div class="progress-bar"><div class="progress-bar-fill" style="width:' + progress + '%"></div></div>' +
          '<span style="font-size:0.78rem;color:var(--text-muted)">' + tickHtml + '</span>' +
          (remaining > 0 ? '<span style="font-size:0.76rem;color:var(--text-muted)">Next: ' + remainingStr + '</span>' : '') +
          feedbackBtn +
        '</div>' +
      '</div>';
  }

  function openComplaintDetail(complaintId) {
    var c = CivicSethuEscalation.findById(complaintId);
    if (!c) return;

    var body = document.getElementById("complaint-detail-body");
    if (!body) return;

    var chain = CivicSethuEscalation.getChainForComplaint(c);
    var chainHtml = chain.map(function (step, idx) {
      var level = step.level;
      var isCurrent = level === c.current_level && c.status !== "resolved" && c.status !== "publicly_flagged";
      var isPassed = level < c.current_level;
      var isResolved = c.status === "resolved" && level === c.current_level;
      var isFlagged = c.status === "publicly_flagged";
      var cls = "chain-step";
      if (isCurrent) cls += " current";
      else if (isResolved) cls += " resolved";
      else if (isFlagged) cls += " flagged";
      else if (isPassed) cls += " passed";

      var authority = CivicSethuData.resolveAuthorityForLevel(c, level);
      var authorityName = authority ? authority.name : step.label;

      return '<div class="' + cls + '">' +
        '<div class="chain-level">' + level + '</div>' +
        '<div class="chain-info">' +
          '<div class="chain-authority">' + escapeHtml(authorityName) + '</div>' +
          '<div class="chain-label">' + escapeHtml(step.label) + '</div>' +
        '</div>' +
      '</div>';
    }).join("");

    var feedbackBtn = CivicSethuFeedback.renderFeedbackButton(c);
    var tickHtml = CivicSethuTicks.render(c);

    body.innerHTML = '' +
      '<div class="complaint-detail-header">' +
        '<div>' +
          '<div class="complaint-detail-title">' + escapeHtml(c.problem_label) + ' ' + tickHtml + '</div>' +
          '<div class="complaint-detail-meta">' + c.id + ' - ' + escapeHtml(c.location.area_name) + '</div>' +
        '</div>' +
        (feedbackBtn || '') +
      '</div>' +
      '<p style="color:var(--text-muted);font-size:0.88rem;margin-bottom:14px">' +
        escapeHtml(c.description || "") +
      '</p>' +
      '<h4 style="font-family:var(--font-display);color:var(--gold-primary);margin-bottom:8px">Escalation Chain</h4>' +
      '<div class="escalation-chain">' + chainHtml + '</div>' +
      '<h4 style="font-family:var(--font-display);color:var(--gold-primary);margin-top:20px;margin-bottom:8px">History</h4>' +
      '<div class="history-list">' +
        (c.history || []).slice().reverse().map(function (h) {
          return '<div class="history-item">' +
            '<div>' + escapeHtml(h.authority_name || "") + ' - ' + escapeHtml((h.action || "").replace(/_/g, " ")) + '</div>' +
            (h.note ? '<div style="font-size:0.8rem;color:var(--text-muted);margin-top:3px">' + escapeHtml(h.note) + '</div>' : '') +
            '<div class="history-time">' + new Date(h.at).toLocaleString() + '</div>' +
          '</div>';
        }).join("") +
      '</div>';

    var modal = document.getElementById("complaint-modal");
    if (modal) modal.classList.remove("hidden");

    document.querySelectorAll("[data-close-complaint]").forEach(function (el) {
      el.onclick = function () {
        modal.classList.add("hidden");
      };
    });
  }

  /* ============================================================
     OFFICERS
     ============================================================ */

  function bindOfficers() {
    CivicSethuOfficers.on("officer_click", function (officerId) {
      state.currentOfficerId = officerId;
      showOfficerView(officerId);
    });

    var backBtn = document.getElementById("back-to-officers");
    if (backBtn) {
      backBtn.addEventListener("click", function () {
        switchView("officers");
      });
    }
  }

  function renderOfficers() {
    CivicSethuOfficers.renderOfficersList("officers-list", 40);
  }

  function showOfficerView(officerId) {
    document.querySelectorAll(".view").forEach(function (v) { v.classList.remove("active"); });
    var detail = document.getElementById("view-officer-detail");
    if (detail) detail.classList.add("active");

    CivicSethuOfficers.renderOfficerDetail("officer-detail-body", officerId);
  }

  /* ============================================================
     LIVE UPDATES
     ============================================================ */

  function handleEscalationEvent(eventName, payload) {
    if (eventName === "refresh" || eventName === "tick_complete") {
      refreshSidebarStats();
      if (state.currentView === "dashboard") renderDashboard();
    }
    if (eventName === "complaint_escalated") {
      console.log("Escalated:", payload.complaint.id, "->", payload.to_authority ? payload.to_authority.name : "");
    }
  }

  function refreshSidebarStats() {
    var stats = CivicSethuEscalation.getGlobalStats();
    setText("sidebar-total", stats.total);
    setText("sidebar-escalated", stats.escalated);
    setText("sidebar-flagged", stats.publicly_flagged);
  }

  /* ============================================================
     HELPERS
     ============================================================ */

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function formatDuration(ms) {
    if (ms <= 0) return "now";
    var sec = Math.floor(ms / 1000);
    if (sec < 60) return sec + "s";
    var min = Math.floor(sec / 60);
    if (min < 60) return min + "m";
    var hr = Math.floor(min / 60);
    var remMin = min % 60;
    return hr + "h " + remMin + "m";
  }

  /* ============================================================
     BOOT
     ============================================================ */

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();