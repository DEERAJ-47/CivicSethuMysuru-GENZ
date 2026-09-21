/* ============================================================
   CIVIC SETHU - MYSURU
   File: demo.js
   Purpose: Sample complaints and demo runner for judges
   ============================================================ */

var DEMO_COMPLAINTS = [

  {
    location_type: "city",
    taluk_id: "mysuru",
    pin_code: "570001",
    problem_id: "pothole",
    citizen_name: "Ravi Kumar",
    citizen_phone: "+91-9876543210",
    description: "Large pothole near Devaraja Market causing accidents",
    photo_url: "demo/pothole_01.jpg",
    gps: { lat: 12.3051, lng: 76.6551 }
  },

  {
    location_type: "city",
    taluk_id: "mysuru",
    pin_code: "570004",
    problem_id: "general_waste",
    citizen_name: "Anita Shetty",
    citizen_phone: "+91-9876543211",
    description: "Garbage pile not cleared for 3 days on Lashkar Mohalla road",
    photo_url: "demo/waste_01.jpg",
    gps: { lat: 12.3095, lng: 76.6534 }
  },

  {
    location_type: "city",
    taluk_id: "mysuru",
    pin_code: "570008",
    problem_id: "construction_waste",
    citizen_name: "Imran Pasha",
    citizen_phone: "+91-9876543212",
    description: "Construction debris dumped on Lakshmipuram main road at night",
    photo_url: "demo/construction_01.jpg",
    gps: { lat: 12.3012, lng: 76.6489 }
  },

  {
    location_type: "city",
    taluk_id: "mysuru",
    pin_code: "570010",
    problem_id: "electricity",
    citizen_name: "Deepa Rao",
    citizen_phone: "+91-9876543213",
    description: "Streetlight not working near Vijayanagar 4th stage park",
    photo_url: "demo/light_01.jpg",
    gps: { lat: 12.3078, lng: 76.6122 }
  },

  {
    location_type: "city",
    taluk_id: "mysuru",
    pin_code: "570021",
    problem_id: "drainage",
    citizen_name: "Suresh Gowda",
    citizen_phone: "+91-9876543214",
    description: "Blocked drain overflowing near Alanahalli bus stop",
    photo_url: "demo/drain_01.jpg",
    gps: { lat: 12.2871, lng: 76.6183 }
  },

  {
    location_type: "city",
    taluk_id: "mysuru",
    pin_code: "570015",
    problem_id: "water",
    citizen_name: "Lakshmi Devi",
    citizen_phone: "+91-9876543215",
    description: "No water supply in Hebbal since morning",
    photo_url: "demo/water_01.jpg",
    gps: { lat: 12.3489, lng: 76.6118 }
  },

  {
    location_type: "village",
    taluk_id: "mysuru",
    pin_code: "571110",
    problem_id: "pothole",
    citizen_name: "Manjunath H",
    citizen_phone: "+91-9876543216",
    description: "Village road near Varuna has multiple potholes",
    photo_url: "demo/pothole_02.jpg",
    gps: { lat: 12.2345, lng: 76.7123 }
  },

  {
    location_type: "village",
    taluk_id: "hunsur",
    pin_code: "571105",
    problem_id: "general_waste",
    citizen_name: "Nagaraj B",
    citizen_phone: "+91-9876543217",
    description: "Garbage dumped near Halebeedu temple entrance",
    photo_url: "demo/waste_02.jpg",
    gps: { lat: 12.4987, lng: 76.2456 }
  },

  {
    location_type: "village",
    taluk_id: "hunsur",
    pin_code: "571189",
    problem_id: "app_dumping",
    citizen_name: "Rekha M",
    citizen_phone: "+91-9876543218",
    description: "Truck dumping waste on Hanagodu outskirts every night",
    photo_url: "demo/dump_01.jpg",
    gps: { lat: 12.5234, lng: 76.3121 }
  },

  {
    location_type: "village",
    taluk_id: "hdkote",
    pin_code: "571114",
    problem_id: "construction_waste",
    citizen_name: "Kiran S",
    citizen_phone: "+91-9876543219",
    description: "Construction debris blocking road near H.D. Kote town",
    photo_url: "demo/construction_02.jpg",
    gps: { lat: 12.0934, lng: 76.3211 }
  },

  {
    location_type: "village",
    taluk_id: "nanjangud",
    pin_code: "571301",
    problem_id: "drainage",
    citizen_name: "Pooja R",
    citizen_phone: "+91-9876543220",
    description: "Sewage overflow on Nanjangud market road",
    photo_url: "demo/drain_02.jpg",
    gps: { lat: 12.1234, lng: 76.6789 }
  },

  {
    location_type: "village",
    taluk_id: "krnagar",
    pin_code: "571601",
    problem_id: "water",
    citizen_name: "Ganesh K",
    citizen_phone: "+91-9876543221",
    description: "Contaminated water from K.R. Nagar pipeline",
    photo_url: "demo/water_02.jpg",
    gps: { lat: 12.4312, lng: 76.3456 }
  },

  {
    location_type: "village",
    taluk_id: "tnarasipura",
    pin_code: "571124",
    problem_id: "app_dumping",
    citizen_name: "Shwetha N",
    citizen_phone: "+91-9876543222",
    description: "Illegal dumping near T. Narasipura bus stand",
    photo_url: "demo/dump_02.jpg",
    gps: { lat: 12.2123, lng: 76.9123 }
  },

  {
    location_type: "village",
    taluk_id: "periyapatna",
    pin_code: "571107",
    problem_id: "electricity",
    citizen_name: "Vijay L",
    citizen_phone: "+91-9876543223",
    description: "Streetlight pole broken near Bylakuppe settlement",
    photo_url: "demo/light_02.jpg",
    gps: { lat: 12.3521, lng: 76.0234 }
  },

  {
    location_type: "village",
    taluk_id: "sargur",
    pin_code: "571121",
    problem_id: "pothole",
    citizen_name: "Mahesh T",
    citizen_phone: "+91-9876543224",
    description: "Dangerous potholes on Sargur to G.B. Saragur road",
    photo_url: "demo/pothole_03.jpg",
    gps: { lat: 12.0321, lng: 76.4321 }
  }

];

function loadDemoComplaints() {
  if (typeof CivicSethuEscalation === "undefined") {
    console.error("Escalation engine not loaded.");
    return { success: false, count: 0 };
  }

  var created = 0;
  var failed = 0;

  DEMO_COMPLAINTS.forEach(function (input, idx) {
    var result = CivicSethuEscalation.createComplaint(input);
    if (result.success) {
      created++;
    } else {
      failed++;
      console.warn("Demo complaint " + (idx + 1) + " failed:", result.message || result.error);
    }
  });

  return { success: true, count: created, failed: failed };
}

function loadDemoComplaintsFast() {
  CivicSethuData.setDemoMode(true);
  var r = loadDemoComplaints();
  return r;
}

function loadDemoComplaintsNormal() {
  CivicSethuData.setDemoMode(false);
  var r = loadDemoComplaints();
  return r;
}

function clearDemoComplaints() {
  CivicSethuEscalation.clearAll();
}

function autoEscalateAllDemo(levels) {
  var n = levels || 1;
  var all = CivicSethuEscalation.getAll();
  all.forEach(function (c) {
    for (var i = 0; i < n; i++) {
      CivicSethuEscalation.escalateOneStep(c);
    }
  });
  return all.length;
}

function resolveRandomDemo() {
  var all = CivicSethuEscalation.getAll();
  var pending = all.filter(function (c) { return c.status === "pending" || c.status === "escalated"; });
  if (pending.length === 0) return 0;
  var pick = pending[Math.floor(Math.random() * pending.length)];
  CivicSethuEscalation.markResolved(pick.id, "Resolved during demo simulation");
  return 1;
}

function forcePublicFlag() {
  var all = CivicSethuEscalation.getAll();
  var count = 0;
  all.forEach(function (c) {
    if (c.status === "publicly_flagged") return;
    if (c.status === "resolved") return;
    var chain = CivicSethuEscalation.getChainForComplaint(c);
    while (c.current_level < chain.length) {
      CivicSethuEscalation.escalateOneStep(c);
    }
    CivicSethuEscalation.escalateOneStep(c);
    if (c.status === "publicly_flagged") count++;
  });
  return count;
}

function getDemoSummary() {
  var stats = CivicSethuEscalation.getGlobalStats();
  return {
    total: stats.total,
    pending: stats.pending,
    escalated: stats.escalated,
    resolved: stats.resolved,
    flagged: stats.publicly_flagged,
    rating: stats.rating
  };
}

function runDemoSequence() {
  clearDemoComplaints();
  CivicSethuData.setDemoMode(true);
  CivicSethuEscalation.startEngine();
  loadDemoComplaints();
  return getDemoSummary();
}

if (typeof window !== "undefined") {
  window.CivicSethuDemo = {
    DEMO_COMPLAINTS: DEMO_COMPLAINTS,
    loadDemoComplaints: loadDemoComplaints,
    loadDemoComplaintsFast: loadDemoComplaintsFast,
    loadDemoComplaintsNormal: loadDemoComplaintsNormal,
    clearDemoComplaints: clearDemoComplaints,
    autoEscalateAllDemo: autoEscalateAllDemo,
    resolveRandomDemo: resolveRandomDemo,
    forcePublicFlag: forcePublicFlag,
    getDemoSummary: getDemoSummary,
    runDemoSequence: runDemoSequence
  };
}