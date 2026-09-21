/* ============================================================
   CIVIC SETHU - MYSURU
   File: routing.js
   Purpose: Auto-assignment of complaints to correct authority
            based on location type, taluk, area, PIN, and problem
   ============================================================ */

function determineLocationType(locationType, talukId, areaId, pinCode) {
  if (locationType === "city") return "city";
  if (locationType === "village") return "village";

  if (pinCode) {
    const pinInfo = CivicSethuLocations.getPINInfo(pinCode);
    if (pinInfo) {
      if (pinInfo.area === "MCC") return "city";
      if (pinInfo.area === "ULB") return "city";
      if (pinInfo.area === "GP") return "village";
    }
  }

  if (areaId && areaId.startsWith("mcc_")) return "city";
  if (areaId && areaId.startsWith("ulb_")) return "city";
  if (areaId && areaId.startsWith("gp_")) return "village";

  const t = CivicSethuLocations.getTaluks().find(x => x.id === talukId);
  if (t && t.type === "rural") return "village";

  return "village";
}

function resolveArea(locationType, talukId, areaId, pinCode) {
  const result = {
    location_type: locationType,
    taluk_id: talukId,
    area_type: null,
    area_id: null,
    area_name: null,
    ward_id: null,
    gp_name: null,
    ulb_id: null,
    pin_code: pinCode || null,
    resolved_by: null
  };

  if (pinCode) {
    const pinInfo = CivicSethuLocations.getPINInfo(pinCode);
    if (pinInfo) {
      result.taluk_id = pinInfo.taluk;
      if (pinInfo.area === "MCC") {
        result.location_type = "city";
        result.area_type = "MCC";
        result.ward_id = pinInfo.ward_id;
        const w = CivicSethuLocations.getWardById(pinInfo.ward_id);
        result.area_id = "mcc_ward_" + pinInfo.ward_id;
        result.area_name = w ? w.name : "Ward " + pinInfo.ward_id;
        result.resolved_by = "pin_code";
        return result;
      }
      if (pinInfo.area === "ULB") {
        result.location_type = "city";
        result.area_type = "ULB";
        result.ulb_id = pinInfo.ulb_id;
        const u = CivicSethuLocations.ULBS.find(x => x.id === pinInfo.ulb_id);
        result.area_id = "ulb_" + pinInfo.ulb_id;
        result.area_name = u ? u.name : pinInfo.ulb_id;
        result.resolved_by = "pin_code";
        return result;
      }
      if (pinInfo.area === "GP") {
        result.location_type = "village";
        result.area_type = "GP";
        result.gp_name = pinInfo.gp;
        result.area_id = "gp_" + pinInfo.taluk + "_" + pinInfo.gp;
        result.area_name = pinInfo.gp + " Gram Panchayat";
        result.resolved_by = "pin_code";
        return result;
      }
    }
  }

  if (areaId && areaId.startsWith("mcc_ward_")) {
    const wardId = parseInt(areaId.replace("mcc_ward_", ""), 10);
    const w = CivicSethuLocations.getWardById(wardId);
    result.location_type = "city";
    result.area_type = "MCC";
    result.ward_id = wardId;
    result.area_id = areaId;
    result.area_name = w ? w.name : "Ward " + wardId;
    result.resolved_by = "manual_area";
    return result;
  }

  if (areaId && areaId.startsWith("ulb_")) {
    const ulbId = areaId.replace("ulb_", "");
    const u = CivicSethuLocations.ULBS.find(x => x.id === ulbId);
    result.location_type = "city";
    result.area_type = "ULB";
    result.ulb_id = ulbId;
    result.area_id = areaId;
    result.area_name = u ? u.name : ulbId;
    result.resolved_by = "manual_area";
    return result;
  }

  if (areaId && areaId.startsWith("gp_")) {
    const parts = areaId.replace("gp_", "").split("_");
    const tk = parts[0];
    const gpName = parts.slice(1).join("_");
    result.location_type = "village";
    result.area_type = "GP";
    result.gp_name = gpName;
    result.area_id = areaId;
    result.area_name = gpName + " Gram Panchayat";
    result.resolved_by = "manual_area";
    return result;
  }

  result.resolved_by = "unresolved";
  return result;
}

function pickLevel1Authority(resolvedArea, problemId) {
  const problem = CivicSethuProblems.getProblem(problemId);
  if (!problem) return null;

  const loc = resolvedArea.location_type;
  const areaType = resolvedArea.area_type;

  if (loc === "city" && areaType === "MCC") {
    if (resolvedArea.ward_id) {
      const wardOfficer = CivicSethuAuthorities.getWardOfficer(resolvedArea.ward_id);
      if (wardOfficer) {
        return {
          authority: wardOfficer,
          department_head: CivicSethuAuthorities.getAuthorityById(
            CivicSethuProblems.getMCCDepartmentHead(problemId)
          ),
          reason: "Complaint filed within MCC Ward " + resolvedArea.ward_id + ", routed to Ward Officer"
        };
      }
    }
    return {
      authority: CivicSethuAuthorities.getAuthorityById("mcc_commissioner"),
      department_head: CivicSethuAuthorities.getAuthorityById(
        CivicSethuProblems.getMCCDepartmentHead(problemId)
      ),
      reason: "Complaint filed within MCC, routed to Municipal Commissioner"
    };
  }

  if (loc === "city" && areaType === "ULB") {
    const ulbId = resolvedArea.ulb_id;
    const map = {
      hunsur_cmc: "hunsur_cmc_co",
      nanjangud_cmc: "nanjangud_cmc_co",
      hdkote_tmc: "hdkote_tmc_co",
      krnagar_tmc: "krnagar_tmc_co",
      periyapatna_tmc: "periyapatna_tmc_co",
      tnarasipura_tmc: "tnarasipura_tmc_co",
      bannur_tmc: "bannur_tmc_co",
      sargur_tp: "sargur_tp_co"
    };
    return {
      authority: CivicSethuAuthorities.getAuthorityById(map[ulbId]),
      department_head: null,
      reason: "Complaint filed within " + resolvedArea.area_name + ", routed to Chief Officer"
    };
  }

  if (loc === "village" && areaType === "GP") {
    const pdo = CivicSethuAuthorities.getPDOForGP(
      resolvedArea.taluk_id,
      resolvedArea.gp_name
    );
    if (pdo) {
      return {
        authority: pdo,
        department_head: null,
        reason: "Complaint filed within " + resolvedArea.gp_name + " Gram Panchayat, routed to PDO"
      };
    }
    const eo = CivicSethuAuthorities.getTalukEO(resolvedArea.taluk_id);
    return {
      authority: eo,
      department_head: null,
      reason: "Gram Panchayat PDO unavailable, routed to Taluk Executive Officer"
    };
  }

  return {
    authority: CivicSethuAuthorities.getAuthorityById("dc_mysuru"),
    department_head: null,
    reason: "Unable to resolve local authority, routed to Deputy Commissioner"
  };
}

function buildComplaintRoute(input) {
  const {
    location_type,
    taluk_id,
    area_id,
    pin_code,
    problem_id,
    citizen_name,
    citizen_phone,
    description,
    photo_url,
    gps
  } = input;

  const detectedProblem = problem_id
    ? CivicSethuProblems.getProblem(problem_id)
    : CivicSethuProblems.getProblemByKeyword(description);

  if (!detectedProblem) {
    return {
      success: false,
      error: "PROBLEM_NOT_IDENTIFIED",
      message: "Could not identify problem type from input or description"
    };
  }

  const resolvedLocationType = determineLocationType(
    location_type,
    taluk_id,
    area_id,
    pin_code
  );

  const resolvedArea = resolveArea(
    resolvedLocationType,
    taluk_id,
    area_id,
    pin_code
  );

  const level1 = pickLevel1Authority(resolvedArea, detectedProblem.id);

  if (!level1 || !level1.authority) {
    return {
      success: false,
      error: "AUTHORITY_NOT_FOUND",
      message: "Could not determine Level 1 authority for this location"
    };
  }

  const chain = CivicSethuData.getEscalationChain(
  detectedProblem.id,
  resolvedArea.location_type
);

  const now = Date.now();
  const timerHours = detectedProblem.timer_hours;
  const escalateAt = now + timerHours * 3600 * 1000;

  return {
    success: true,
    complaint: {
      id: "CMP-" + now.toString().slice(-8),
      problem_id: detectedProblem.id,
      problem_label: detectedProblem.label,
      problem_priority: detectedProblem.priority,
      timer_hours: timerHours,
      location: resolvedArea,
      citizen: {
        name: citizen_name || "Anonymous",
        phone: citizen_phone || null
      },
      description: description || "",
      photo_url: photo_url || null,
      gps: gps || null,
      routing: {
        level_1_authority: level1.authority,
        department_head: level1.department_head,
        reason: level1.reason,
        chain: chain
      },
      current_level: 1,
      status: "pending",
      filed_at: now,
      escalate_at: escalateAt,
      history: [
        {
          level: 1,
          authority_id: level1.authority.id,
          authority_name: level1.authority.name,
          action: "filed",
          at: now
        }
      ]
    }
  };
}

function reassignComplaint(complaint, newPinCode) {
  const reroute = buildComplaintRoute({
    location_type: complaint.location.location_type,
    taluk_id: complaint.location.taluk_id,
    area_id: complaint.location.area_id,
    pin_code: newPinCode,
    problem_id: complaint.problem_id,
    citizen_name: complaint.citizen.name,
    citizen_phone: complaint.citizen.phone,
    description: complaint.description,
    photo_url: complaint.photo_url,
    gps: complaint.gps
  });

  if (!reroute.success) return complaint;

  complaint.location = reroute.complaint.location;
  complaint.routing = reroute.complaint.routing;
  complaint.current_level = 1;
  complaint.escalate_at = reroute.complaint.escalate_at;
  complaint.history.push({
    level: 1,
    authority_id: reroute.complaint.routing.level_1_authority.id,
    authority_name: reroute.complaint.routing.level_1_authority.name,
    action: "rerouted",
    at: Date.now()
  });

  return complaint;
}

function getRouteSummary(complaint) {
  if (!complaint || !complaint.routing) return null;
  const a = complaint.routing.level_1_authority;
  return {
    area: complaint.location.area_name,
    area_type: complaint.location.area_type,
    location_type: complaint.location.location_type,
    taluk: complaint.location.taluk_id,
    level_1: a.name,
    level_1_role: a.role,
    department: a.department,
    timer_hours: complaint.timer_hours,
    reason: complaint.routing.reason
  };
}

if (typeof window !== "undefined") {
  window.CivicSethuRouting = {
    determineLocationType,
    resolveArea,
    pickLevel1Authority,
    buildComplaintRoute,
    reassignComplaint,
    getRouteSummary
  };
}