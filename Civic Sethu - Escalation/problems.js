/* ============================================================
   CIVIC SETHU — MYSURU
   File: problems.js
   Purpose: 7 problem types with department mapping, priority,
            keywords (for auto-detection from ML), and display info
   ============================================================ */

// ----- The 7 Problem Types -----
const PROBLEMS = {

  general_waste: {
    id: "general_waste",
    label: "General Waste on Road",
    description: "Garbage dumped on road, public place, or not collected",
    icon: "🗑️",
    color: "#F59E0B",
    priority: "normal",
    timer_hours: 24,
    city_department: "Solid Waste Management (SWM)",
    village_department: "Gram Panchayat — Sanitation",
    keywords: ["garbage", "waste", "trash", "litter", "bin", "dump", "kachra", "kasa"],
    ml_labels: ["garbage", "trash", "waste_pile", "overflowing_bin"]
  },

  app_dumping: {
    id: "app_dumping",
    label: "Dumping Reported via App",
    description: "Citizen-reported dumping through the mobile app",
    icon: "📱",
    color: "#EF4444",
    priority: "urgent",
    timer_hours: 6,
    city_department: "SWM / Enforcement",
    village_department: "Gram Panchayat — Enforcement",
    keywords: ["app", "reported", "citizen", "photo", "video"],
    ml_labels: ["reported_dump", "citizen_upload"]
  },

  construction_waste: {
    id: "construction_waste",
    label: "Construction Waste Dumping",
    description: "Illegal dumping of construction debris (bricks, cement, metal)",
    icon: "🏗️",
    color: "#8B5CF6",
    priority: "urgent",
    timer_hours: 6,
    city_department: "Health / SWM / Enforcement",
    village_department: "Gram Panchayat — Enforcement",
    keywords: ["construction", "debris", "cement", "bricks", "metal", "rubble", "malba"],
    ml_labels: ["construction_debris", "rubble", "cement_blocks"]
  },

  pothole: {
    id: "pothole",
    label: "Pothole Problem",
    description: "Damaged road, pothole, or unsafe road surface",
    icon: "🕳️",
    color: "#DC2626",
    priority: "normal",
    timer_hours: 24,
    city_department: "Engineering / Roads",
    village_department: "Gram Panchayat — Roads",
    keywords: ["pothole", "road", "damage", "crack", "gaddha", "hole"],
    ml_labels: ["pothole", "road_damage", "crack"]
  },

  electricity: {
    id: "electricity",
    label: "Electricity Problem",
    description: "Streetlight not working, exposed wire, power issue",
    icon: "💡",
    color: "#FBBF24",
    priority: "urgent",
    timer_hours: 6,
    city_department: "Electrical Section",
    village_department: "Gram Panchayat — Electrical",
    keywords: ["light", "streetlight", "wire", "electricity", "power", "shock", "current"],
    ml_labels: ["broken_light", "exposed_wire", "dark_street"]
  },

  drainage: {
    id: "drainage",
    label: "Drainage Problem",
    description: "Blocked drain, overflowing sewage, water stagnation",
    icon: "🚰",
    color: "#06B6D4",
    priority: "urgent",
    timer_hours: 6,
    city_department: "Engineering / Health",
    village_department: "Gram Panchayat — Sanitation",
    keywords: ["drain", "drainage", "sewage", "blocked", "overflow", "gutter", "stagnant"],
    ml_labels: ["blocked_drain", "overflowing_sewage", "water_stagnation"]
  },

  water: {
    id: "water",
    label: "Water Problem",
    description: "No water supply, contaminated water, pipeline leak",
    icon: "💧",
    color: "#3B82F6",
    priority: "urgent",
    timer_hours: 6,
    city_department: "Water Supply",
    village_department: "Gram Panchayat — Water Supply",
    keywords: ["water", "supply", "pipe", "leak", "contaminated", "no water"],
    ml_labels: ["water_leak", "no_supply", "contaminated_water"]
  }
};

// ----- Department map inside MCC (for problem → section routing) -----
const MCC_DEPARTMENT_MAP = {
  general_waste:      "mcc_swm_head",
  app_dumping:        "mcc_swm_head",
  construction_waste: "mcc_swm_head",
  pothole:            "mcc_engineering_head",
  drainage:           "mcc_engineering_head",
  water:              "mcc_water_head",
  electricity:        "mcc_electrical_head"
};

// ----- Priority level definitions -----
const PRIORITY_LEVELS = {
  urgent: {
    id: "urgent",
    label: "Urgent",
    color: "#EF4444",
    timer_hours: 6
  },
  normal: {
    id: "normal",
    label: "Normal",
    color: "#F59E0B",
    timer_hours: 24
  },
  low: {
    id: "low",
    label: "Low",
    color: "#10B981",
    timer_hours: 72
  }
};

// ----- Helper functions -----

function getProblem(problemId) {
  return PROBLEMS[problemId] || null;
}

function getAllProblems() {
  return Object.values(PROBLEMS);
}

function getProblemByKeyword(text) {
  if (!text) return null;
  const lower = text.toLowerCase();
  for (const problem of Object.values(PROBLEMS)) {
    if (problem.keywords.some(k => lower.includes(k))) {
      return problem;
    }
  }
  return null;
}

function getProblemByMLLabel(mlLabel) {
  for (const problem of Object.values(PROBLEMS)) {
    if (problem.ml_labels.includes(mlLabel)) {
      return problem;
    }
  }
  return null;
}

function getTimerHours(problemId) {
  const p = PROBLEMS[problemId];
  return p ? p.timer_hours : 24;
}

function getDepartmentForProblem(problemId, locationType) {
  const p = PROBLEMS[problemId];
  if (!p) return null;
  return locationType === "city" ? p.city_department : p.village_department;
}

function getMCCDepartmentHead(problemId) {
  return MCC_DEPARTMENT_MAP[problemId] || "mcc_commissioner";
}

// ----- Export -----
if (typeof window !== "undefined") {
  window.CivicSethuProblems = {
    PROBLEMS,
    PRIORITY_LEVELS,
    MCC_DEPARTMENT_MAP,
    getProblem,
    getAllProblems,
    getProblemByKeyword,
    getProblemByMLLabel,
    getTimerHours,
    getDepartmentForProblem,
    getMCCDepartmentHead
  };
}