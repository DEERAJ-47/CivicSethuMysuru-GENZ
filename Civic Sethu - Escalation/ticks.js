/* ============================================================
   CIVIC SETHU - MYSURU
   File: ticks.js
   Purpose: WhatsApp-style tick system for complaint status
            Single grey, double grey, double green, triple glowing
            green, and red alert - with hover tooltips
   ============================================================ */

var CivicSethuTicks = (function () {

  var TICK_STATES = {
    filed: {
      id: "filed",
      label: "Filed",
      description: "Your complaint has been submitted successfully",
      cssClass: "tick-single-grey",
      symbol: "single-grey"
    },
    seen: {
      id: "seen",
      label: "Seen by Authority",
      description: "The concerned authority has viewed your complaint",
      cssClass: "tick-double-grey",
      symbol: "double-grey"
    },
    acknowledged: {
      id: "acknowledged",
      label: "Acknowledged",
      description: "The authority has started working on your complaint",
      cssClass: "tick-double-green",
      symbol: "double-green"
    },
    resolved: {
      id: "resolved",
      label: "Resolved",
      description: "Your complaint has been resolved",
      cssClass: "tick-triple-green",
      symbol: "triple-green"
    },
    escalated: {
      id: "escalated",
      label: "Escalated",
      description: "No response - escalated to the next authority",
      cssClass: "tick-red",
      symbol: "red-single"
    },
    flagged: {
      id: "flagged",
      label: "Publicly Flagged",
      description: "Unresolved at highest level - publicly flagged",
      cssClass: "tick-red",
      symbol: "red-double"
    }
  };

  function getTickState(complaint) {
    if (!complaint) return TICK_STATES.filed;

    if (complaint.status === "resolved") return TICK_STATES.resolved;
    if (complaint.status === "publicly_flagged") return TICK_STATES.flagged;
    if (complaint.status === "rejected") return TICK_STATES.flagged;

    var history = complaint.history || [];
    var hasSeen = history.some(function (h) {
      return h.action === "seen" || h.action === "acknowledged" || h.action === "in_progress";
    });
    var hasAck = history.some(function (h) {
      return h.action === "in_progress" || h.action === "acknowledged";
    });

    if (complaint.current_level > 1) return TICK_STATES.escalated;
    if (hasAck) return TICK_STATES.acknowledged;
    if (hasSeen) return TICK_STATES.seen;
    return TICK_STATES.filed;
  }

  function svgTick(symbol, cssClass) {
    var cls = "tick " + cssClass;
    var tooltip = TICK_STATES[symbolToStateId(symbol)]
      ? TICK_STATES[symbolToStateId(symbol)].description
      : "";

    if (symbol === "single-grey") {
      return '<span class="' + cls + '" title="' + escapeAttr(tooltip) + '">' +
        '<svg viewBox="0 0 24 24"><path class="tick-check" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>' +
        '</span>';
    }

    if (symbol === "double-grey" || symbol === "double-green") {
      return '<span class="' + cls + '" title="' + escapeAttr(tooltip) + '">' +
        '<svg viewBox="0 0 32 24">' +
        '<path class="tick-check" d="M2 12.5l5 5 9-9-1.4-1.4L7 14.7 3.4 11.1z"/>' +
        '<path class="tick-check" d="M12 12.5l5 5 9-9-1.4-1.4L17 14.7 13.4 11.1z"/>' +
        '</svg>' +
        '</span>';
    }

    if (symbol === "triple-green") {
      return '<span class="' + cls + '" title="' + escapeAttr(tooltip) + '">' +
        '<svg viewBox="0 0 44 24">' +
        '<path class="tick-check" d="M2 12.5l5 5 9-9-1.4-1.4L7 14.7 3.4 11.1z"/>' +
        '<path class="tick-check" d="M12 12.5l5 5 9-9-1.4-1.4L17 14.7 13.4 11.1z"/>' +
        '<path class="tick-check" d="M22 12.5l5 5 9-9-1.4-1.4L27 14.7 23.4 11.1z"/>' +
        '</svg>' +
        '</span>';
    }

    if (symbol === "red-single") {
      return '<span class="' + cls + '" title="' + escapeAttr(tooltip) + '">' +
        '<svg viewBox="0 0 24 24">' +
        '<path class="tick-check" d="M12 2L1 21h22z"/>' +
        '<path d="M11 10h2v5h-2zm0 6h2v2h-2z" fill="#fff"/>' +
        '</svg>' +
        '</span>';
    }

    if (symbol === "red-double") {
      return '<span class="' + cls + '" title="' + escapeAttr(tooltip) + '">' +
        '<svg viewBox="0 0 32 24">' +
        '<path class="tick-check" d="M6 2L1 21h10z"/>' +
        '<path d="M5 10h2v5H5zm0 6h2v2H5z" fill="#fff"/>' +
        '<path class="tick-check" d="M22 2L17 21h10z"/>' +
        '<path d="M21 10h2v5h-2zm0 6h2v2h-2z" fill="#fff"/>' +
        '</svg>' +
        '</span>';
    }

    return "";
  }

  function symbolToStateId(symbol) {
    var map = {
      "single-grey": "filed",
      "double-grey": "seen",
      "double-green": "acknowledged",
      "triple-green": "resolved",
      "red-single": "escalated",
      "red-double": "flagged"
    };
    return map[symbol] || "filed";
  }

  function escapeAttr(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function render(complaint) {
    var state = getTickState(complaint);
    return svgTick(state.symbol, state.cssClass);
  }

  function renderWithLabel(complaint) {
    var state = getTickState(complaint);
    return '<span class="tick-wrap">' +
      svgTick(state.symbol, state.cssClass) +
      '<span class="tick-label">' + state.label + '</span>' +
      '</span>';
  }

  function getStateLabel(complaint) {
    return getTickState(complaint).label;
  }

  function getStateDescription(complaint) {
    return getTickState(complaint).description;
  }

  function getAllStates() {
    return Object.keys(TICK_STATES).map(function (k) {
      return TICK_STATES[k];
    });
  }

  return {
    TICK_STATES: TICK_STATES,
    getTickState: getTickState,
    render: render,
    renderWithLabel: renderWithLabel,
    getStateLabel: getStateLabel,
    getStateDescription: getStateDescription,
    getAllStates: getAllStates
  };
})();

if (typeof window !== "undefined") {
  window.CivicSethuTicks = CivicSethuTicks;
}