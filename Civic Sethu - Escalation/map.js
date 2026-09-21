/* ============================================================
   CIVIC SETHU - MYSURU
   File: map.js
   Purpose: Leaflet map with 11 toggleable admin layers,
            colored polygons, click handlers, and info card
   ============================================================ */

var CivicSethuMap = (function () {

  var map = null;
  var layerRegistry = {};
  var activeLayers = {};
  var geojsonCache = {};

  var LAYER_CONFIG = {
    revenue_divisions:  { label: "Revenue Divisions",        color: "#8B5CF6", weight: 3, fillOpacity: 0.18 },
    taluks:             { label: "Taluks",                   color: "#3B82F6", weight: 2, fillOpacity: 0.15 },
    sub_divisions:      { label: "Sub-Divisions",            color: "#06B6D4", weight: 2, fillOpacity: 0.15 },
    gram_panchayats:    { label: "Gram Panchayats",          color: "#10B981", weight: 1, fillOpacity: 0.12 },
    revenue_villages:   { label: "Revenue Villages",         color: "#84CC16", weight: 1, fillOpacity: 0.10 },
    hoblis:             { label: "Hoblis / Revenue Circles", color: "#F97316", weight: 1.5, fillOpacity: 0.14 },
    pin_codes:          { label: "PIN Codes",                color: "#EC4899", weight: 1, fillOpacity: 0.10 },
    post_offices:       { label: "Post Offices",             color: "#A855F7", weight: 1, fillOpacity: 0.10 },
    zilla_panchayat:    { label: "Zilla Panchayat",          color: "#DC2626", weight: 3, fillOpacity: 0.10 },
    taluk_panchayats:   { label: "Taluk Panchayats",         color: "#0891B2", weight: 2.5, fillOpacity: 0.14 },
    mcc_wards:          { label: "MCC Wards",                color: "#F59E0B", weight: 1.5, fillOpacity: 0.16 }
  };

  var MYSURU_CENTER = [12.2958, 76.6394];
  var DEFAULT_ZOOM = 10;

  function init(containerId) {
    map = L.map(containerId, {
      center: MYSURU_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
      attributionControl: false
    });

    L.tileLayer("https://tiles.openfreemap.org/styles/dark/{z}/{x}/{y}.png", {
    maxZoom: 20
    }).addTo(map);

    L.control.attribution({
      position: "bottomright",
      prefix: false
    }).addAttribution("Civic Sethu - Mysuru").addTo(map);

    return map;
  }

  function getStyle(layerKey) {
    var cfg = LAYER_CONFIG[layerKey];
    return {
      color: cfg.color,
      weight: cfg.weight,
      opacity: 0.85,
      fillColor: cfg.color,
      fillOpacity: cfg.fillOpacity
    };
  }

  function getHighlightStyle(layerKey) {
    var cfg = LAYER_CONFIG[layerKey];
    return {
      color: cfg.color,
      weight: cfg.weight + 2,
      opacity: 1,
      fillColor: cfg.color,
      fillOpacity: cfg.fillOpacity + 0.15
    };
  }

  function loadLayer(layerKey) {
    if (geojsonCache[layerKey]) {
      return Promise.resolve(geojsonCache[layerKey]);
    }
    var url = "data/" + layerKey + ".geojson";
    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("Layer not found: " + layerKey);
        return res.json();
      })
      .then(function (data) {
        geojsonCache[layerKey] = data;
        return data;
      })
      .catch(function (err) {
        console.warn("Could not load " + layerKey + ":", err.message);
        return null;
      });
  }

  function onEachFeature(layerKey, feature, layer) {
    layer.on({
      mouseover: function (e) {
        e.target.setStyle(getHighlightStyle(layerKey));
        e.target.bringToFront();
      },
      mouseout: function (e) {
        if (layerRegistry[layerKey]) {
          layerRegistry[layerKey].resetStyle(e.target);
        }
      },
      click: function (e) {
        L.DomEvent.stopPropagation(e);
        handleFeatureClick(layerKey, feature, e.latlng);
      }
    });
  }

  function handleFeatureClick(layerKey, feature, latlng) {
    var props = feature.properties || {};
    var name = props.name || props.NAME || props.Ward_Name || props.GP_Name ||
               props.Taluk || props.TALUK || props.PIN || props.pincode ||
               props.hobli || props.Hobli || "Unnamed Area";

    var areaId = buildAreaId(layerKey, props, name);

    var payload = {
      layer: layerKey,
      layer_label: LAYER_CONFIG[layerKey].label,
      color: LAYER_CONFIG[layerKey].color,
      area_id: areaId,
      name: name,
      properties: props,
      latlng: latlng
    };

    renderInfoCard(payload);
    CivicSethuMap.emit("feature_click", payload);
  }

  function buildAreaId(layerKey, props, name) {
    if (layerKey === "mcc_wards") {
      var wnum = props.ward_no || props.Ward_No || props.WARD_NO || props.ward_id;
      if (wnum) return "mcc_ward_" + wnum;
      return "mcc_ward_" + sanitize(name);
    }
    if (layerKey === "gram_panchayats") {
      var taluk = props.taluk || props.Taluk || props.TALUK || "unknown";
      return "gp_" + sanitize(taluk) + "_" + sanitize(name);
    }
    return layerKey + "_" + sanitize(name);
  }

  function sanitize(str) {
    return String(str).replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
  }

  function renderInfoCard(payload) {
    var card = document.getElementById("map-info-card");
    if (!card) return;

    var stats = getAreaStats(payload.area_id);
    var stars = renderStars(stats.rating);

    card.innerHTML =
      '<button class="card-close" id="card-close-btn">&times;</button>' +
      '<h3>' + escapeHtml(payload.name) + '</h3>' +
      '<div class="card-sub">' + escapeHtml(payload.layer_label) + '</div>' +
      '<div class="rating-stars">' + stars +
        '<span class="rating-num">' + stats.rating.toFixed(1) + ' / 5</span>' +
      '</div>' +
      '<div class="stat-grid">' +
        '<div class="stat-box"><div class="stat-label">Total Raised</div><div class="stat-value">' + stats.total + '</div></div>' +
        '<div class="stat-box"><div class="stat-label">Resolved</div><div class="stat-value">' + stats.resolved + '</div></div>' +
        '<div class="stat-box"><div class="stat-label">Pending</div><div class="stat-value">' + stats.pending + '</div></div>' +
        '<div class="stat-box"><div class="stat-label">Escalated</div><div class="stat-value">' + stats.escalated + '</div></div>' +
      '</div>';

    card.classList.remove("hidden");

    var closeBtn = document.getElementById("card-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        card.classList.add("hidden");
      });
    }
  }

  function renderStars(rating) {
    var full = Math.floor(rating);
    var partial = rating - full;
    var out = "";
    for (var i = 0; i < 5; i++) {
      if (i < full) out += '<span class="star-icon">&#9733;</span>';
      else if (i === full && partial >= 0.5) out += '<span class="star-icon">&#9733;</span>';
      else out += '<span class="star-icon" style="opacity:0.3">&#9733;</span>';
    }
    return out;
  }

  function getAreaStats(areaId) {
    if (typeof CivicSethuEscalation === "undefined") {
      return { total: 0, resolved: 0, pending: 0, escalated: 0, rating: 0 };
    }
    var stats = CivicSethuEscalation.getStatsForArea(areaId);
    return {
      total: stats.total,
      resolved: stats.resolved,
      pending: stats.pending,
      escalated: stats.escalated,
      rating: stats.rating
    };
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function toggleLayer(layerKey) {
    if (activeLayers[layerKey]) {
      removeLayer(layerKey);
      return Promise.resolve(false);
    }
    return addLayer(layerKey).then(function () { return true; });
  }

  function addLayer(layerKey) {
    if (!LAYER_CONFIG[layerKey]) return Promise.resolve(false);
    if (activeLayers[layerKey]) return Promise.resolve(true);

    return loadLayer(layerKey).then(function (data) {
      if (!data) return false;

      var layerGroup = L.geoJSON(data, {
        style: function () { return getStyle(layerKey); },
        onEachFeature: function (feature, layer) {
          onEachFeature(layerKey, feature, layer);
        }
      });

      layerGroup.addTo(map);
      layerRegistry[layerKey] = layerGroup;
      activeLayers[layerKey] = true;

      updateLayerButton(layerKey, true);
      return true;
    });
  }

  function removeLayer(layerKey) {
    if (layerRegistry[layerKey]) {
      map.removeLayer(layerRegistry[layerKey]);
      delete layerRegistry[layerKey];
    }
    delete activeLayers[layerKey];
    updateLayerButton(layerKey, false);
  }

  function clearAllLayers() {
    Object.keys(layerRegistry).forEach(function (k) {
      map.removeLayer(layerRegistry[k]);
    });
    layerRegistry = {};
    activeLayers = {};
    document.querySelectorAll(".layer-btn").forEach(function (btn) {
      btn.classList.remove("active");
    });
  }

  function updateLayerButton(layerKey, isActive) {
    var btn = document.querySelector('.layer-btn[data-layer="' + layerKey + '"]');
    if (!btn) return;
    if (isActive) btn.classList.add("active");
    else btn.classList.remove("active");
  }

  function bindLayerButtons() {
    document.querySelectorAll(".layer-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var layerKey = btn.getAttribute("data-layer");
        toggleLayer(layerKey);
      });
    });

    var clearBtn = document.getElementById("layer-clear");
    if (clearBtn) {
      clearBtn.addEventListener("click", clearAllLayers);
    }
  }

  function fitToLayer(layerKey) {
    if (layerRegistry[layerKey]) {
      try {
        map.fitBounds(layerRegistry[layerKey].getBounds(), { padding: [40, 40] });
      } catch (e) {}
    }
  }

  function getMap() { return map; }
  function getActiveLayers() { return Object.keys(activeLayers); }

  var eventListeners = {};
  function on(eventName, fn) {
    if (!eventListeners[eventName]) eventListeners[eventName] = [];
    eventListeners[eventName].push(fn);
  }
  function emit(eventName, payload) {
    if (!eventListeners[eventName]) return;
    eventListeners[eventName].forEach(function (fn) {
      try { fn(payload); } catch (e) {}
    });
  }

  function refresh() {
    Object.keys(activeLayers).forEach(function (key) {
      removeLayer(key);
      addLayer(key);
    });
  }

  function addComplaintMarkers(complaints) {
    var markerGroup = L.layerGroup().addTo(map);
    complaints.forEach(function (c) {
      if (!c.gps || !c.gps.lat || !c.gps.lng) return;
      var color = c.status === "resolved" ? "#25D366"
                : c.status === "publicly_flagged" ? "#DC2626"
                : c.status === "escalated" ? "#F59E0B"
                : "#F5D061";
      var marker = L.circleMarker([c.gps.lat, c.gps.lng], {
        radius: 6,
        color: color,
        fillColor: color,
        fillOpacity: 0.85,
        weight: 2
      });
      marker.bindTooltip(c.problem_label + " - " + c.location.area_name, {
        direction: "top",
        className: "complaint-tooltip"
      });
      marker.on("click", function () {
        emit("marker_click", c);
      });
      markerGroup.addLayer(marker);
    });
    return markerGroup;
  }

  return {
    init: init,
    bindLayerButtons: bindLayerButtons,
    toggleLayer: toggleLayer,
    addLayer: addLayer,
    removeLayer: removeLayer,
    clearAllLayers: clearAllLayers,
    fitToLayer: fitToLayer,
    getMap: getMap,
    getActiveLayers: getActiveLayers,
    refresh: refresh,
    addComplaintMarkers: addComplaintMarkers,
    renderInfoCard: renderInfoCard,
    LAYER_CONFIG: LAYER_CONFIG,
    on: on,
    emit: emit
  };
})();

if (typeof window !== "undefined") {
  window.CivicSethuMap = CivicSethuMap;
}