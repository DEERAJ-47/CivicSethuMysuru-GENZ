/* ============================================================
   CIVIC SETHU - MYSURU
   File: data.js
   Purpose: Escalation chains for all complaint scenarios
   ============================================================ */

var ESCALATION_CHAINS = {

  city_general: [
    { level: 1, authority_key: "ward_officer", role: "ward_officer", label: "Ward / Zone Office" },
    { level: 2, authority_key: "mcc_commissioner", role: "mcc_officer", label: "City Local Body (MCC)" },
    { level: 3, authority_key: "mcc_addl_commissioner", role: "mcc_commissioner", label: "Senior MCC Administration" },
    { level: 4, authority_key: "dc_mysuru", role: "dc", label: "District Administration" },
    { level: 5, authority_key: "acp_mysuru", role: "police", label: "Police (ACP/SP)" },
    { level: 6, authority_key: "mla_mp", role: "mla_mp", label: "MLA / MP" }
  ],

  village_general: [
    { level: 1, authority_key: "pdo", role: "pdo", label: "Gram Panchayat" },
    { level: 2, authority_key: "taluk_eo", role: "taluk_eo", label: "Taluk Panchayat" },
    { level: 3, authority_key: "zp_ceo", role: "zp_ceo", label: "Zilla Panchayat" },
    { level: 4, authority_key: "dc_mysuru", role: "dc", label: "District Administration" },
    { level: 5, authority_key: "sp_mysuru", role: "police", label: "Police (ACP/SP)" },
    { level: 6, authority_key: "mla_mp", role: "mla_mp", label: "MLA / MP" }
  ],

  city_illegal_dumping: [
    { level: 1, authority_key: "ward_officer", role: "ward_officer", label: "Ward / Zone Sanitation" },
    { level: 2, authority_key: "mcc_commissioner", role: "mcc_officer", label: "Local Urban Body (MCC)" },
    { level: 3, authority_key: "mcc_addl_commissioner", role: "mcc_commissioner", label: "Senior Municipal Administration" },
    { level: 4, authority_key: "dc_mysuru", role: "dc", label: "District Administration (DC)" },
    { level: 5, authority_key: "kspcb", role: "kspcb", label: "KSPCB" },
    { level: 6, authority_key: "mla_mp", role: "mla_mp", label: "MLA / MP" }
  ],

  village_illegal_dumping: [
    { level: 1, authority_key: "pdo", role: "pdo", label: "Gram Panchayat" },
    { level: 2, authority_key: "taluk_eo", role: "taluk_eo", label: "Taluk Administration" },
    { level: 3, authority_key: "zp_ceo", role: "zp_ceo", label: "Zilla Panchayat" },
    { level: 4, authority_key: "dc_mysuru", role: "dc", label: "DC / District Administration" },
    { level: 5, authority_key: "kspcb", role: "kspcb", label: "KSPCB" },
    { level: 6, authority_key: "mla_mp", role: "mla_mp", label: "MLA / MP" }
  ]
};

var PROBLEM_TO_CHAIN = {
  general_waste:      { city: "city_general",           village: "village_general" },
  app_dumping:        { city: "city_illegal_dumping",   village: "village_illegal_dumping" },
  construction_waste: { city: "city_illegal_dumping",   village: "village_illegal_dumping" },
  pothole:            { city: "city_general",           village: "village_general" },
  electricity:        { city: "city_general",           village: "village_general" },
  drainage:           { city: "city_general",           village: "village_general" },
  water:              { city: "city_general",           village: "village_general" }
};

var TIMER_CONFIG = {
  normal_hours: 24,
  urgent_hours: 6,
  demo_seconds: 10,
  demo_mode: false
};

var MAX_HISTORY_ENTRIES = 50;

var STATUS_TYPES = {
  pending:          { id: "pending",          label: "Pending",          color: "#F59E0B" },
  in_progress:      { id: "in_progress",      label: "In Progress",      color: "#3B82F6" },
  resolved:         { id: "resolved",         label: "Resolved",         color: "#10B981" },
  escalated:        { id: "escalated",        label: "Escalated",        color: "#EF4444" },
  publicly_flagged: { id: "publicly_flagged", label: "Publicly Flagged", color: "#DC2626" },
  rejected:         { id: "rejected",         label: "Rejected",         color: "#6B7280" }
};

function getEscalationChain(problemId, locationType) {
  var map = PROBLEM_TO_CHAIN[problemId];
  if (!map) return ESCALATION_CHAINS.city_general;
  var chainKey = locationType === "city" ? map.city : map.village;
  return ESCALATION_CHAINS[chainKey] || ESCALATION_CHAINS.city_general;
}

function getChainKey(problemId, locationType) {
  var map = PROBLEM_TO_CHAIN[problemId];
  if (!map) return "city_general";
  return locationType === "city" ? map.city : map.village;
}

function getChainByKey(chainKey) {
  return ESCALATION_CHAINS[chainKey] || null;
}

function getMaxLevel(problemId, locationType) {
  var chain = getEscalationChain(problemId, locationType);
  return chain.length;
}

function resolveAuthorityForLevel(complaint, levelNumber) {
  var chain = CivicSethuEscalation.getChainForComplaint(complaint);
  if (levelNumber < 1 || levelNumber > chain.length) return null;
  var step = chain[levelNumber - 1];
  var key = step.authority_key;

  if (key === "ward_officer") {
    if (complaint.location && complaint.location.ward_id) {
      return CivicSethuAuthorities.getWardOfficer(complaint.location.ward_id);
    }
    return CivicSethuAuthorities.getAuthorityById("mcc_commissioner");
  }

  if (key === "pdo") {
    if (complaint.location && complaint.location.gp_name) {
      return CivicSethuAuthorities.getPDOForGP(
        complaint.location.taluk_id,
        complaint.location.gp_name
      );
    }
    return CivicSethuAuthorities.getTalukEO(complaint.location.taluk_id);
  }

  if (key === "taluk_eo") {
    return CivicSethuAuthorities.getTalukEO(complaint.location.taluk_id);
  }

  if (key === "mla_mp") {
    var talukId = complaint.location.taluk_id;
    var mla = CivicSethuAuthorities.MLA_PROFILES[talukId];
    if (mla) return mla;
    return CivicSethuAuthorities.MP_PROFILES.mysore;
  }

  return CivicSethuAuthorities.getAuthorityById(key);
}

function getStatusInfo(statusId) {
  return STATUS_TYPES[statusId] || STATUS_TYPES.pending;
}

function setDemoMode(enabled) {
  TIMER_CONFIG.demo_mode = !!enabled;
}

function isDemoMode() {
  return TIMER_CONFIG.demo_mode === true;
}

function getTimerMs(priority) {
  if (isDemoMode()) {
    return TIMER_CONFIG.demo_seconds * 1000;
  }
  var hours = priority === "urgent"
    ? TIMER_CONFIG.urgent_hours
    : TIMER_CONFIG.normal_hours;
  return hours * 3600 * 1000;
}

if (typeof window !== "undefined") {
  window.CivicSethuData = {
    ESCALATION_CHAINS: ESCALATION_CHAINS,
    PROBLEM_TO_CHAIN: PROBLEM_TO_CHAIN,
    TIMER_CONFIG: TIMER_CONFIG,
    STATUS_TYPES: STATUS_TYPES,
    MAX_HISTORY_ENTRIES: MAX_HISTORY_ENTRIES,
    getEscalationChain: getEscalationChain,
    getChainKey: getChainKey,
    getChainByKey: getChainByKey,
    getMaxLevel: getMaxLevel,
    resolveAuthorityForLevel: resolveAuthorityForLevel,
    getStatusInfo: getStatusInfo,
    setDemoMode: setDemoMode,
    isDemoMode: isDemoMode,
    getTimerMs: getTimerMs
  };
}