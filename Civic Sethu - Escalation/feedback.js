/* ============================================================
   CIVIC SETHU - MYSURU
   File: feedback.js
   Purpose: Citizen feedback flow - star rating + escalation
            paragraph. Only complaint owner can submit.
   ============================================================ */

var CivicSethuFeedback = (function () {

  var activeComplaintId = null;
  var selectedStars = 0;

  function openModal(complaintId) {
    if (typeof CivicSethuEscalation === "undefined") return;

    var complaint = CivicSethuEscalation.findById(complaintId);
    if (!complaint) return;

    var user = getCurrentUser();
    if (!user) {
      alert("Please login first.");
      return;
    }

    if (!isOwner(complaint, user)) {
      alert("Only the person who filed this complaint can rate or escalate.");
      return;
    }

    if (complaint.status === "resolved") {
      alert("This complaint is already resolved.");
      return;
    }

    if (complaint.status === "publicly_flagged") {
      alert("This complaint is already publicly flagged.");
      return;
    }

    activeComplaintId = complaintId;
    selectedStars = 0;

    var authority = CivicSethuEscalation.getCurrentAuthority(complaint);
    var nameEl = document.getElementById("feedback-officer-name");
    if (nameEl) {
      nameEl.textContent = "Complaint " + complaint.id +
        " - currently with " + (authority ? authority.name : "Authority");
    }

    var textEl = document.getElementById("feedback-text");
    if (textEl) textEl.value = "";

    updateStarUI(0);

    var modal = document.getElementById("feedback-modal");
    if (modal) modal.classList.remove("hidden");
  }

  function closeModal() {
    var modal = document.getElementById("feedback-modal");
    if (modal) modal.classList.add("hidden");
    activeComplaintId = null;
    selectedStars = 0;
  }

  function updateStarUI(stars) {
    selectedStars = stars;
    var starEls = document.querySelectorAll("#star-row .star");
    starEls.forEach(function (el) {
      var val = parseInt(el.getAttribute("data-star"), 10);
      if (val <= stars) el.classList.add("active");
      else el.classList.remove("active");
    });
  }

  function bindStarRow() {
    var starEls = document.querySelectorAll("#star-row .star");
    starEls.forEach(function (el) {
      el.addEventListener("click", function () {
        var val = parseInt(el.getAttribute("data-star"), 10);
        updateStarUI(val);
      });
      el.addEventListener("mouseenter", function () {
        var val = parseInt(el.getAttribute("data-star"), 10);
        var starEls2 = document.querySelectorAll("#star-row .star");
        starEls2.forEach(function (e2) {
          var v = parseInt(e2.getAttribute("data-star"), 10);
          if (v <= val) e2.style.color = "var(--gold-primary)";
          else e2.style.color = "";
        });
      });
    });

    var row = document.getElementById("star-row");
    if (row) {
      row.addEventListener("mouseleave", function () {
        document.querySelectorAll("#star-row .star").forEach(function (e2) {
          e2.style.color = "";
        });
      });
    }
  }

  function submitFeedback() {
    if (!activeComplaintId) return;

    var complaint = CivicSethuEscalation.findById(activeComplaintId);
    if (!complaint) return;

    var user = getCurrentUser();
    if (!user || !isOwner(complaint, user)) {
      alert("Only the person who filed this complaint can submit feedback.");
      return;
    }

    var textEl = document.getElementById("feedback-text");
    var text = textEl ? textEl.value.trim() : "";

    if (selectedStars === 0) {
      alert("Please select a star rating.");
      return;
    }

    if (text.length < 20) {
      alert("Please write at least 20 characters explaining your feedback.");
      return;
    }

    var authority = CivicSethuEscalation.getCurrentAuthority(complaint);
    var authorityId = authority ? authority.id : "unknown";

    var ratingEntry = {
      level: complaint.current_level,
      authority_id: authorityId,
      authority_name: authority ? authority.name : "Unknown",
      action: "rating",
      stars: selectedStars,
      at: Date.now(),
      note: text
    };

    complaint.history.push(ratingEntry);

    var escalateEntry = {
      level: complaint.current_level,
      authority_id: authorityId,
      authority_name: authority ? authority.name : "Unknown",
      action: "citizen_escalated",
      at: Date.now(),
      note: "Citizen escalated with rating " + selectedStars + " stars"
    };

    complaint.history.push(escalateEntry);

    CivicSethuEscalation.escalateOneStep(complaint);

    CivicSethuEscalation.emit("feedback_submitted", {
      complaint: complaint,
      stars: selectedStars,
      text: text
    });

    closeModal();

    var el = document.getElementById("feedback-success");
    if (el) {
      el.textContent = "Feedback submitted. Complaint escalated to next level.";
      el.classList.remove("hidden");
      setTimeout(function () { el.classList.add("hidden"); }, 4000);
    }
  }

  function isOwner(complaint, user) {
    if (!complaint || !complaint.citizen || !user) return false;
    var cName = (complaint.citizen.name || "").trim().toLowerCase();
    var cPhone = (complaint.citizen.phone || "").trim();
    var uName = (user.name || "").trim().toLowerCase();
    var uPhone = (user.phone || "").trim();
    return cPhone === uPhone || (cName && cName === uName);
  }

  function canRate(complaint) {
    if (!complaint) return false;
    if (complaint.status === "resolved") return false;
    if (complaint.status === "publicly_flagged") return false;
    if (complaint.status === "rejected") return false;

    var user = getCurrentUser();
    if (!user) return false;
    return isOwner(complaint, user);
  }

  function renderFeedbackButton(complaint) {
    if (!canRate(complaint)) return "";
    return '<button class="btn-primary btn-sm feedback-btn" data-complaint-id="' +
      complaint.id + '">Rate & Escalate</button>';
  }

  function bindFeedbackButtons() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".feedback-btn");
      if (btn) {
        e.preventDefault();
        var id = btn.getAttribute("data-complaint-id");
        openModal(id);
      }
    });
  }

  function bindModalEvents() {
    var submitBtn = document.getElementById("feedback-submit");
    if (submitBtn) submitBtn.addEventListener("click", submitFeedback);

    document.querySelectorAll("[data-close-feedback]").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });

    bindStarRow();
  }

  function getCurrentUser() {
    try {
      var raw = localStorage.getItem("civic_sethu_user");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function getFeedbackStatsForOfficer(officerId) {
    if (typeof CivicSethuEscalation === "undefined") {
      return { count: 0, avg: 0, ratings: [] };
    }
    var all = CivicSethuEscalation.getAll();
    var ratings = [];

    all.forEach(function (c) {
      (c.history || []).forEach(function (h) {
        if (h.action === "rating" && h.authority_id === officerId && h.stars) {
          ratings.push(h.stars);
        }
      });
    });

    if (ratings.length === 0) return { count: 0, avg: 0, ratings: [] };

    var sum = ratings.reduce(function (a, b) { return a + b; }, 0);
    return {
      count: ratings.length,
      avg: sum / ratings.length,
      ratings: ratings
    };
  }

  function getAllFeedbackForComplaint(complaintId) {
    if (typeof CivicSethuEscalation === "undefined") return [];
    var complaint = CivicSethuEscalation.findById(complaintId);
    if (!complaint) return [];
    return (complaint.history || []).filter(function (h) {
      return h.action === "rating" || h.action === "citizen_escalated";
    });
  }

  return {
    openModal: openModal,
    closeModal: closeModal,
    submitFeedback: submitFeedback,
    canRate: canRate,
    renderFeedbackButton: renderFeedbackButton,
    bindFeedbackButtons: bindFeedbackButtons,
    bindModalEvents: bindModalEvents,
    getFeedbackStatsForOfficer: getFeedbackStatsForOfficer,
    getAllFeedbackForComplaint: getAllFeedbackForComplaint
  };
})();

if (typeof window !== "undefined") {
  window.CivicSethuFeedback = CivicSethuFeedback;
}