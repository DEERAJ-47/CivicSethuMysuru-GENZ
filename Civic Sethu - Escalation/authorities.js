/* ============================================================
   CIVIC SETHU — MYSURU
   File: authorities.js
   Purpose: All authority profiles (350+) — officers, roles,
            contacts, average resolution times, ratings
   ============================================================ */

// ============================================================
// PART 1: CITY-LEVEL AUTHORITIES (MCC + 8 other ULBs)
// ============================================================

const CITY_AUTHORITIES = {

  // ----- MCC Level 2-4 -----
  mcc_commissioner: {
    id: "mcc_commissioner",
    name: "Municipal Commissioner, MCC",
    level: "Level 2",
    role: "mcc_officer",
    location_type: "city",
    authority_type: "MCC",
    department: "Overall MCC Administration",
    handles_problems: ["general_waste","app_dumping","construction_waste","pothole","electricity","drainage","water"],
    contact: {
      office: "MCC Head Office, Sayyaji Rao Road, Mysuru",
      phone: "+91-821-2444400",
      email: "commissioner@mccmysuru.gov.in"
    },
    avg_resolution_hours: 36,
    rating: 3.8
  },

  mcc_addl_commissioner: {
    id: "mcc_addl_commissioner",
    name: "Additional Commissioner, MCC",
    level: "Level 4",
    role: "mcc_commissioner",
    location_type: "city",
    authority_type: "MCC",
    department: "Senior MCC Administration",
    handles_problems: ["general_waste","app_dumping","construction_waste","pothole","electricity","drainage","water"],
    contact: {
      office: "MCC Head Office, Sayyaji Rao Road, Mysuru",
      phone: "+91-821-2444401",
      email: "addl.commissioner@mccmysuru.gov.in"
    },
    avg_resolution_hours: 48,
    rating: 3.6
  },

  // ----- Department Heads (MCC) -----
  mcc_swm_head: {
    id: "mcc_swm_head",
    name: "Health Officer — Solid Waste Management, MCC",
    level: "Level 2",
    role: "mcc_officer",
    location_type: "city",
    authority_type: "MCC",
    department: "Solid Waste Management",
    handles_problems: ["general_waste","app_dumping","construction_waste"],
    contact: { office: "MCC SWM Section", phone: "+91-821-2444402", email: "swm@mccmysuru.gov.in" },
    avg_resolution_hours: 30,
    rating: 3.5
  },

  mcc_engineering_head: {
    id: "mcc_engineering_head",
    name: "Executive Engineer — Roads & Engineering, MCC",
    level: "Level 2",
    role: "mcc_officer",
    location_type: "city",
    authority_type: "MCC",
    department: "Engineering / Roads",
    handles_problems: ["pothole","drainage","water"],
    contact: { office: "MCC Engineering Section", phone: "+91-821-2444403", email: "engineering@mccmysuru.gov.in" },
    avg_resolution_hours: 72,
    rating: 3.2
  },

  mcc_electrical_head: {
    id: "mcc_electrical_head",
    name: "Executive Engineer — Electrical, MCC",
    level: "Level 2",
    role: "mcc_officer",
    location_type: "city",
    authority_type: "MCC",
    department: "Electrical Section",
    handles_problems: ["electricity"],
    contact: { office: "MCC Electrical Section", phone: "+91-821-2444404", email: "electrical@mccmysuru.gov.in" },
    avg_resolution_hours: 24,
    rating: 3.9
  },

  mcc_water_head: {
    id: "mcc_water_head",
    name: "Executive Engineer — Water Supply, MCC",
    level: "Level 2",
    role: "mcc_officer",
    location_type: "city",
    authority_type: "MCC",
    department: "Water Supply",
    handles_problems: ["water"],
    contact: { office: "MCC Water Supply Section", phone: "+91-821-2444405", email: "water@mccmysuru.gov.in" },
    avg_resolution_hours: 36,
    rating: 3.4
  }
};

// ============================================================
// PART 2: MCC WARD OFFICERS (65 total — from locations.js wards)
// ============================================================
// Each ward gets a Ward Officer profile. Corporator names are
// included from locations.js MCC_WARDS.

const MCC_WARD_OFFICERS = {};
const wardNames = [
  "Hebbal – Lakshmikantha Nagara","Manchegowdana Koppalu","Mahadeshwara Badavane",
  "Hebbal – Lokanayaka Nagara","Kumbara Koppalu","Yadavagiri","Metagalli",
  "Bannimantapa","Kesare","Rajeeva Nagara","Shanti Nagara I","Shanti Nagara II",
  "Udayagiri","Kalyanagiri","Gayathripuram","Naidu Nagara","Raghavendra Nagara",
  "Rajendra Nagar","Medar Block","Kurubarahalli","Chamundipuram","JSS Layout",
  "Kuvempunagar","Srirampura","Ramakrishnanagar","Srirampura II Stage",
  "Alanahalli","Dattagalli","Siddhartha Layout","Vidyaranyapuram","Jayanagar",
  "Lakshmipuram","Sunnadakeri","Agrahara","Devaraja Mohalla","K.R. Mohalla",
  "Mandi Mohalla","Lashkar Mohalla","Subbarayanakere","Ashoka Puram",
  "J.P. Nagar","K.G. Koppalu","T.K. Layout","Janata Nagara","Sharadadevi Nagara",
  "Dattagalli","Kuvempu Nagara","Jayanagara","Lakshmi Puram","Sunnadakeri",
  "Nazarbad","Vontikoppal","Vijayanagar","Hebbal","Hootagalli",
  "Hootagalli Industrial Area","Belavadi","Ramakrishna Nagara","Kuvempunagar",
  "Srirampura","Bannur Road","Alanahalli","Rajiv Nagar","Chamarajapuram",
  "Lakshmipuram"
];

for (let i = 1; i <= 65; i++) {
  MCC_WARD_OFFICERS[`ward_${i}_officer`] = {
    id: `ward_${i}_officer`,
    name: `Ward Officer — Ward ${i} (${wardNames[i-1]})`,
    level: "Level 3",
    role: "ward_officer",
    location_type: "city",
    authority_type: "MCC",
    department: "Ward / Zone Office",
    ward_id: i,
    ward_name: wardNames[i-1],
    handles_problems: ["general_waste","app_dumping","construction_waste","pothole","electricity","drainage","water"],
    contact: {
      office: `Ward ${i} Office, MCC`,
      phone: `+91-821-244${(4400 + i).toString()}`,
      email: `ward${i}@mccmysuru.gov.in`
    },
    avg_resolution_hours: 24,
    rating: 3.5
  };
}

// ============================================================
// PART 3: OTHER ULBs (8 total) — Chief Officers
// ============================================================

const ULB_AUTHORITIES = {
  hunsur_cmc: {
    id: "hunsur_cmc_co",
    name: "Chief Officer, Hunsur CMC",
    level: "Level 2",
    role: "mcc_officer",
    location_type: "city",
    authority_type: "CMC",
    ulb_id: "hunsur_cmc",
    department: "Overall ULB Administration",
    handles_problems: ["general_waste","app_dumping","construction_waste","pothole","electricity","drainage","water"],
    contact: { office: "Hunsur CMC Office", phone: "+91-8222-XXXXXX", email: "co@hunsurcmc.gov.in" },
    avg_resolution_hours: 36,
    rating: 3.6
  },
  nanjangud_cmc: {
    id: "nanjangud_cmc_co",
    name: "Chief Officer, Nanjangud CMC",
    level: "Level 2",
    role: "mcc_officer",
    location_type: "city",
    authority_type: "CMC",
    ulb_id: "nanjangud_cmc",
    department: "Overall ULB Administration",
    handles_problems: ["general_waste","app_dumping","construction_waste","pothole","electricity","drainage","water"],
    contact: { office: "Nanjangud CMC Office", phone: "+91-8221-XXXXXX", email: "co@nanjangudcmc.gov.in" },
    avg_resolution_hours: 36,
    rating: 3.5
  },
  hdkote_tmc: {
    id: "hdkote_tmc_co",
    name: "Chief Officer, H.D. Kote TMC",
    level: "Level 2",
    role: "mcc_officer",
    location_type: "city",
    authority_type: "TMC",
    ulb_id: "hdkote_tmc",
    department: "Overall ULB Administration",
    handles_problems: ["general_waste","app_dumping","construction_waste","pothole","electricity","drainage","water"],
    contact: { office: "H.D. Kote TMC Office", phone: "+91-8228-XXXXXX", email: "co@hdkotetmc.gov.in" },
    avg_resolution_hours: 48,
    rating: 3.2
  },
  krnagar_tmc: {
    id: "krnagar_tmc_co",
    name: "Chief Officer, K.R. Nagar TMC",
    level: "Level 2",
    role: "mcc_officer",
    location_type: "city",
    authority_type: "TMC",
    ulb_id: "krnagar_tmc",
    department: "Overall ULB Administration",
    handles_problems: ["general_waste","app_dumping","construction_waste","pothole","electricity","drainage","water"],
    contact: { office: "K.R. Nagar TMC Office", phone: "+91-8223-XXXXXX", email: "co@krnagartmc.gov.in" },
    avg_resolution_hours: 48,
    rating: 3.3
  },
  periyapatna_tmc: {
    id: "periyapatna_tmc_co",
    name: "Chief Officer, Periyapatna TMC",
    level: "Level 2",
    role: "mcc_officer",
    location_type: "city",
    authority_type: "TMC",
    ulb_id: "periyapatna_tmc",
    department: "Overall ULB Administration",
    handles_problems: ["general_waste","app_dumping","construction_waste","pothole","electricity","drainage","water"],
    contact: { office: "Periyapatna TMC Office", phone: "+91-8223-XXXXXX", email: "co@periyapatnatmc.gov.in" },
    avg_resolution_hours: 48,
    rating: 3.1
  },
  tnarasipura_tmc: {
    id: "tnarasipura_tmc_co",
    name: "Chief Officer, T. Narasipura TMC",
    level: "Level 2",
    role: "mcc_officer",
    location_type: "city",
    authority_type: "TMC",
    ulb_id: "tnarasipura_tmc",
    department: "Overall ULB Administration",
    handles_problems: ["general_waste","app_dumping","construction_waste","pothole","electricity","drainage","water"],
    contact: { office: "T. Narasipura TMC Office", phone: "+91-8227-XXXXXX", email: "co@tnarasipuratmc.gov.in" },
    avg_resolution_hours: 48,
    rating: 3.4
  },
  bannur_tmc: {
    id: "bannur_tmc_co",
    name: "Chief Officer, Bannur TMC",
    level: "Level 2",
    role: "mcc_officer",
    location_type: "city",
    authority_type: "TMC",
    ulb_id: "bannur_tmc",
    department: "Overall ULB Administration",
    handles_problems: ["general_waste","app_dumping","construction_waste","pothole","electricity","drainage","water"],
    contact: { office: "Bannur TMC Office", phone: "+91-8221-XXXXXX", email: "co@bannurtmc.gov.in" },
    avg_resolution_hours: 48,
    rating: 3.3
  },
  sargur_tp: {
    id: "sargur_tp_co",
    name: "Chief Officer, Sargur Town Panchayat",
    level: "Level 2",
    role: "mcc_officer",
    location_type: "city",
    authority_type: "TP",
    ulb_id: "sargur_tp",
    department: "Overall ULB Administration",
    handles_problems: ["general_waste","app_dumping","construction_waste","pothole","electricity","drainage","water"],
    contact: { office: "Sargur Town Panchayat Office", phone: "+91-8228-XXXXXX", email: "co@sargurtp.gov.in" },
    avg_resolution_hours: 48,
    rating: 3.2
  }
};

// ============================================================
// PART 4: VILLAGE-LEVEL AUTHORITIES
// ============================================================

// ----- PDO Profiles (one per Gram Panchayat — 266 total) -----
const PDO_PROFILES = {};

const gpListByTaluk = {
  mysuru: ["Alanahalli","Ananduru","Beerihundi","Belawadi","Bogadi","Chamundibetta","Devalapura","Dhanagalli","Doddamaragowdanahalli","Doora","Gopalapura","Gungralchathra","Hanchya","Harohalli (Mellahalli)","Harohalli (J)","Hinkal","Hosahundi","Jayapura","Kadakola","Keelanapura","Koorgalli","Maratikyathanahalli","Marballi","Mosambayanahalli","Naganahalli","Nagawala","Rammanahalli","Siddalingapura","Sindhuvalli","Someshwarapura","Srirampura","Udbooru","Vajamangala","Varakodu","Varuna","Yadakola","Yelawala"],
  hunsur: ["Asphathrekaval","Bannikuppe","Beejaganahalli","Biligere","Bilikere","Bolanahalli","Challahalli","Chikkabeechanahalli","Chilkunda","Dharmapura","Doddahejjuru","Gagenahalli","Gavadagere","Govindanahalli","Gurupur","Halebeedu","Hanagodu","Harave","Hegganduru","Hirikyathanahalli","Husenpura","Jabagere","Kademanuganahalli","Kallahalli","Karimuddanahalli","Karnakuppe","Kattemalalavadi","Kiranguru","Kothegala","Manuganahalli","Maraduru","Moduru","Mukanahalli","Mulluru","Neralekuppe","Singamaranahalli","Thattekere","Udboorkaval","Udduru","Ummathuru","Uyyigondanahalli"],
  hdkote: ["Alanahalli","Annur","Antharasanthe","Bachegowdanahalli","Beechanahalli","Bheemanahalli","Chakkodanahalli","Chikkereyuru","D.B. Kuppe","G.B. Saragur","Hampapura","Hebbalaguppe","Hirehalli","Hommaragalli","Hosaholalu","Hyrige","Kanchamalli","Kyathanahalli","Madapura","N. Begur","N. Belthur","Naganahalli","Nooralakuppe","Padukote Kaval","Savve","Thumbasoge"],
  nanjangud: ["Adakanahalli","Alambur","Allur","Bilugali","Chamalapura","Badanavalu","Biligere","Dasanuru","Deburu","Devanuru","Devarasanahalli","Devarayashettipura","Devirammanahalli","Doddakavalande","Duggahalli","Hadinaru","Hadya","Haginavalu","Hallare","Haradanahalli","Hedathale","Hediyala","Heggadahalli","Hemmaragala","Horalavadi","Hosakote","Hulimavu","Hullahalli","Hura","Kalale","Karya","Kasuvinahalli","Kempesiddanahundi","Konanur","Kudlapura","Kurihundi","Mallupura","Maraluru","Nagarle","Nallithalapura","Naviluru","Nerale","Rampura","Sirmalli","Sindhuvalli","Suttur","Tagadur","Thandavapura","Thayuru","Thumnerale"],
  periyapatna: ["Attigodu","Avarathi","Bettadapura","Bettadathunga","Bhuvanahalli","Bylakuppe","Chapparadahalli","Chennakalkavalu","Chikkanerale","Chittenahalli","Chowthi","Doddabylalu","Doddakamaravalli","Halaganahalli","Handithavalli","Haraduru","Haranahalli","Hitnehebbagilu","Hunasavadi","Kamplapura","Kanagalu","Kiranalli","Kitturu","Komalapura","Koppa","Makodu","Malangi","Muthuru","N. Shettihalli","Naviluru","Panchavalli","Punadahalli","Ramanathathunga","Ravanduru"],
  saligrama: ["Ankanahally","Bheriya","Channamgere","Haliyur","Hanasoge","Haradanahally","Honnenahally","Hosakote","Karpoorvally","Kuppehantha (Chunchanakatte)","Lakshmipura","Mayigowdanahally","Melur","Mirle","Munjanahally","Narachanahally","Nheegavalu","Thandre"],
  sargur: ["B. Matakere","Bidarahalli","Hadanuru","Hanchipura","Hegganur","Itna","K. Belthur","Kallambalu","Kothegala","M.C. Thalalu","Manuganahalli","Mullur","Sagare"],
  tnarasipura: ["Ankanahalli","Attahalli","B. Shettahalli","Beedanahalli","Benkanahalli","Chidaravalli","Doddebagilu","Gargeshwari","Hanumanalu","Hegguru","Hemmige","Holesalu","Hosakote","Kaliyuru","Karohatti","Kethupura","Kiragasuru","Kodagahalli","Kolathuru","Kothegala","Kupya","Madapura","Maliyuru","Muguru","Muttalavadi","Rangasamudra","Seehalli","Somanathapura","Sosale","T. Doddapura","Talkad","Thumbala","Thuraganuru","Ukkalagere","Vatalu","Yachenahalli"],
  krnagar: ["Adagur","Arjunahalli","Byadarahally","Chandagalu","Doddakoppalu","Gandhanahally","Hebbalu","Hompapura","Hosaagrahara","Kaggere","Kesthur","Lalandevanahally","Mavattur","Saligrama","Siddapura","Thippur"]
};

Object.keys(gpListByTaluk).forEach(talukId => {
  gpListByTaluk[talukId].forEach(gpName => {
    const key = `pdo_${talukId}_${gpName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}`;
    PDO_PROFILES[key] = {
      id: key,
      name: `PDO — ${gpName} Gram Panchayat`,
      level: "Level 1",
      role: "pdo",
      location_type: "village",
      authority_type: "GP",
      taluk: talukId,
      gp_name: gpName,
      department: "Gram Panchayat Administration",
      handles_problems: ["general_waste","app_dumping","construction_waste","pothole","electricity","drainage","water"],
      contact: {
        office: `${gpName} Gram Panchayat Office, ${talukId} Taluk`,
        phone: "+91-XXXXX-XXXXX",
        email: `pdo.${gpName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}@grampanchayat.gov.in`
      },
      avg_resolution_hours: 48,
      rating: 3.4
    };
  });
});

// ----- Taluk Panchayat Executive Officers (9 total) -----
const TALUK_EO_PROFILES = {
  mysuru: {
    id: "eo_mysuru", name: "Executive Officer — Mysuru Taluk Panchayat",
    level: "Level 2", role: "taluk_eo", location_type: "village",
    authority_type: "TP", taluk: "mysuru",
    department: "Taluk Panchayat Administration",
    handles_problems: ["general_waste","app_dumping","construction_waste","pothole","electricity","drainage","water"],
    contact: { office: "Mysuru Taluk Panchayat Office", phone: "+91-821-XXXXXX", email: "eo@mysurutp.gov.in" },
    avg_resolution_hours: 72, rating: 3.5
  },
  hunsur: {
    id: "eo_hunsur", name: "Executive Officer — Hunsur Taluk Panchayat",
    level: "Level 2", role: "taluk_eo", location_type: "village",
    authority_type: "TP", taluk: "hunsur",
    department: "Taluk Panchayat Administration",
    handles_problems: ["general_waste","app_dumping","construction_waste","pothole","electricity","drainage","water"],
    contact: { office: "Hunsur Taluk Panchayat Office", phone: "+91-8222-XXXXXX", email: "eo@hunsurtp.gov.in" },
    avg_resolution_hours: 72, rating: 3.4
  },
  hdkote: {
    id: "eo_hdkote", name: "Executive Officer — H.D. Kote Taluk Panchayat",
    level: "Level 2", role: "taluk_eo", location_type: "village",
    authority_type: "TP", taluk: "hdkote",
    department: "Taluk Panchayat Administration",
    handles_problems: ["general_waste","app_dumping","construction_waste","pothole","electricity","drainage","water"],
    contact: { office: "H.D. Kote Taluk Panchayat Office", phone: "+91-8228-XXXXXX", email: "eo@hdkotetp.gov.in" },
    avg_resolution_hours: 72, rating: 3.2
  },
  nanjangud: {
    id: "eo_nanjangud", name: "Executive Officer — Nanjangud Taluk Panchayat",
    level: "Level 2", role: "taluk_eo", location_type: "village",
    authority_type: "TP", taluk: "nanjangud",
    department: "Taluk Panchayat Administration",
    handles_problems: ["general_waste","app_dumping","construction_waste","pothole","electricity","drainage","water"],
    contact: { office: "Nanjangud Taluk Panchayat Office", phone: "+91-8221-XXXXXX", email: "eo@nanjangudtp.gov.in" },
    avg_resolution_hours: 72, rating: 3.4
  },
  periyapatna: {
    id: "eo_periyapatna", name: "Executive Officer — Periyapatna Taluk Panchayat",
    level: "Level 2", role: "taluk_eo", location_type: "village",
    authority_type: "TP", taluk: "periyapatna",
    department: "Taluk Panchayat Administration",
    handles_problems: ["general_waste","app_dumping","construction_waste","pothole","electricity","drainage","water"],
    contact: { office: "Periyapatna Taluk Panchayat Office", phone: "+91-8223-XXXXXX", email: "eo@periyapatnatp.gov.in" },
    avg_resolution_hours: 72, rating: 3.3
  },
  tnarasipura: {
    id: "eo_tnarasipura", name: "Executive Officer — T. Narasipura Taluk Panchayat",
    level: "Level 2", role: "taluk_eo", location_type: "village",
    authority_type: "TP", taluk: "tnarasipura",
    department: "Taluk Panchayat Administration",
    handles_problems: ["general_waste","app_dumping","construction_waste","pothole","electricity","drainage","water"],
    contact: { office: "T. Narasipura Taluk Panchayat Office", phone: "+91-8227-XXXXXX", email: "eo@tnarasipuratp.gov.in" },
    avg_resolution_hours: 72, rating: 3.5
  },
  krnagar: {
    id: "eo_krnagar", name: "Executive Officer — K.R. Nagar Taluk Panchayat",
    level: "Level 2", role: "taluk_eo", location_type: "village",
    authority_type: "TP", taluk: "krnagar",
    department: "Taluk Panchayat Administration",
    handles_problems: ["general_waste","app_dumping","construction_waste","pothole","electricity","drainage","water"],
    contact: { office: "K.R. Nagar Taluk Panchayat Office", phone: "+91-8223-XXXXXX", email: "eo@krnagartp.gov.in" },
    avg_resolution_hours: 72, rating: 3.4
  },
  saligrama: {
    id: "eo_saligrama", name: "Executive Officer — Saligrama Taluk Panchayat",
    level: "Level 2", role: "taluk_eo", location_type: "village",
    authority_type: "TP", taluk: "saligrama",
    department: "Taluk Panchayat Administration",
    handles_problems: ["general_waste","app_dumping","construction_waste","pothole","electricity","drainage","water"],
    contact: { office: "Saligrama Taluk Panchayat Office", phone: "+91-8223-XXXXXX", email: "eo@saligramatp.gov.in" },
    avg_resolution_hours: 72, rating: 3.3
  },
  sargur: {
    id: "eo_sargur", name: "Executive Officer — Sargur Taluk Panchayat",
    level: "Level 2", role: "taluk_eo", location_type: "village",
    authority_type: "TP", taluk: "sargur",
    department: "Taluk Panchayat Administration",
    handles_problems: ["general_waste","app_dumping","construction_waste","pothole","electricity","drainage","water"],
    contact: { office: "Sargur Taluk Panchayat Office", phone: "+91-8228-XXXXXX", email: "eo@sargurtp.gov.in" },
    avg_resolution_hours: 72, rating: 3.2
  }
};

// ----- Zilla Panchayat CEO (1 total) -----
const ZP_CEO_PROFILE = {
  id: "zp_ceo",
  name: "Chief Executive Officer — Zilla Panchayat, Mysuru",
  level: "Level 3",
  role: "zp_ceo",
  location_type: "village",
  authority_type: "ZP",
  department: "Zilla Panchayat",
  handles_problems: ["general_waste","app_dumping","construction_waste","pothole","electricity","drainage","water"],
  contact: { office: "Zilla Panchayat Office, Mysuru", phone: "+91-821-2444400", email: "ceo@zp.mysuru.gov.in" },
  avg_resolution_hours: 96,
  rating: 3.5
};

// ============================================================
// PART 5: DISTRICT-LEVEL AUTHORITIES
// ============================================================

const DISTRICT_AUTHORITIES = {
  dc_mysuru: {
    id: "dc_mysuru",
    name: "Deputy Commissioner (DC), Mysuru District",
    level: "Level 5",
    role: "dc",
    location_type: "both",
    authority_type: "District Administration",
    department: "District Administration",
    handles_problems: ["general_waste","app_dumping","construction_waste","pothole","electricity","drainage","water"],
    contact: { office: "DC Office, Mysuru", phone: "+91-821-2444400", email: "dc@mysuru.nic.in" },
    avg_resolution_hours: 120,
    rating: 3.6
  },
  kspcb: {
    id: "kspcb",
    name: "Karnataka State Pollution Control Board — Mysuru",
    level: "Level 5",
    role: "kspcb",
    location_type: "both",
    authority_type: "KSPCB",
    department: "Environmental Regulation",
    handles_problems: ["construction_waste","app_dumping"],
    contact: { office: "KSPCB Regional Office, Mysuru", phone: "+91-821-2444400", email: "kspcb.mysuru@karnataka.gov.in" },
    avg_resolution_hours: 120,
    rating: 3.4
  }
};

// ============================================================
// PART 6: POLICE
// ============================================================

const POLICE_AUTHORITIES = {
  acp_mysuru: {
    id: "acp_mysuru",
    name: "Assistant Commissioner of Police (ACP), Mysuru City",
    level: "Level 6",
    role: "police",
    location_type: "city",
    authority_type: "Police",
    department: "City Police",
    handles_problems: ["general_waste","app_dumping","construction_waste","pothole","electricity","drainage","water"],
    contact: { office: "ACP Office, Mysuru City", phone: "+91-821-2444400", email: "acp@mysurucitypolice.gov.in" },
    avg_resolution_hours: 48,
    rating: 3.7
  },
  sp_mysuru: {
    id: "sp_mysuru",
    name: "Superintendent of Police (SP), Mysuru District",
    level: "Level 5",
    role: "police",
    location_type: "village",
    authority_type: "Police",
    department: "District Police",
    handles_problems: ["general_waste","app_dumping","construction_waste","pothole","electricity","drainage","water"],
    contact: { office: "SP Office, Mysuru District", phone: "+91-821-2444400", email: "sp@mysurudistrictpolice.gov.in" },
    avg_resolution_hours: 72,
    rating: 3.6
  }
};

// ============================================================
// PART 7: MLAs (11 total) — from your data
// ============================================================

const MLA_PROFILES = {
  piriyapatna:    { id: "mla_piriyapatna",    name: "K. Venkatesh",           constituency: "Piriyapatna (210)",    party: "INC",  role: "mla_mp", level: "Level 7", location_type: "village", avg_resolution_hours: 168, rating: 3.5 },
  krnagar:        { id: "mla_krnagar",        name: "D. Ravishankar",         constituency: "Krishnarajanagara (211)", party: "INC", role: "mla_mp", level: "Level 7", location_type: "village", avg_resolution_hours: 168, rating: 3.4 },
  hunsur:         { id: "mla_hunsur",         name: "G.D. Harish Gowda",      constituency: "Hunsur (212)",         party: "JD(S)", role: "mla_mp", level: "Level 7", location_type: "village", avg_resolution_hours: 168, rating: 3.6 },
  hdkote:         { id: "mla_hdkote",         name: "Anil Kumar C",           constituency: "Heggadadevankote (213)", party: "INC", role: "mla_mp", level: "Level 7", location_type: "village", avg_resolution_hours: 168, rating: 3.5 },
  nanjangud:      { id: "mla_nanjangud",      name: "Darshan Dhruvanarayana", constituency: "Nanjangud (214)",      party: "INC",  role: "mla_mp", level: "Level 7", location_type: "village", avg_resolution_hours: 168, rating: 3.6 },
  chamundeshwari: { id: "mla_chamundeshwari", name: "G.T. Devegowda",         constituency: "Chamundeshwari (215)", party: "JD(S)", role: "mla_mp", level: "Level 7", location_type: "city", avg_resolution_hours: 168, rating: 3.5 },
  krishnaraja:    { id: "mla_krishnaraja",    name: "T.S. Srivathsa",         constituency: "Krishnaraja (216)",    party: "BJP",  role: "mla_mp", level: "Level 7", location_type: "city", avg_resolution_hours: 168, rating: 3.7 },
  chamaraja:      { id: "mla_chamaraja",      name: "K. Harish Gowda",        constituency: "Chamaraja (217)",      party: "INC",  role: "mla_mp", level: "Level 7", location_type: "city", avg_resolution_hours: 168, rating: 3.5 },
  narasimharaja:  { id: "mla_narasimharaja",  name: "Tanveer Sait",           constituency: "Narasimharaja (218)",  party: "INC",  role: "mla_mp", level: "Level 7", location_type: "city", avg_resolution_hours: 168, rating: 3.8 },
  varuna:         { id: "mla_varuna",         name: "Siddaramaiah",           constituency: "Varuna (219)",         party: "INC",  role: "mla_mp", level: "Level 7", location_type: "village", avg_resolution_hours: 168, rating: 3.9 },
  tnarasipura:    { id: "mla_tnarasipura",    name: "Dr. H.C. Mahadevappa",   constituency: "T. Narasipura (220)",  party: "INC",  role: "mla_mp", level: "Level 7", location_type: "village", avg_resolution_hours: 168, rating: 3.7 }
};

// ============================================================
// PART 8: MPs (2 total) — from your data
// ============================================================

const MP_PROFILES = {
  mysore: {
    id: "mp_mysore",
    name: "Yaduveer Krishnadatta Chamaraja Wadiyar",
    constituency: "Mysore (21)",
    party: "BJP",
    role: "mla_mp",
    level: "Level 7",
    location_type: "both",
    avg_resolution_hours: 240,
    rating: 3.6
  },
  chamarajanagar: {
    id: "mp_chamarajanagar",
    name: "Sunil Bose",
    constituency: "Chamarajanagar (22)",
    party: "INC",
    role: "mla_mp",
    level: "Level 7",
    location_type: "village",
    avg_resolution_hours: 240,
    rating: 3.5
  }
};

// ============================================================
// PART 9: HELPER FUNCTIONS
// ============================================================

function getAuthorityById(id) {
  return CITY_AUTHORITIES[id]
      || ULB_AUTHORITIES[id]
      || MCC_WARD_OFFICERS[id]
      || PDO_PROFILES[id]
      || TALUK_EO_PROFILES[id]
      || (id === "zp_ceo" ? ZP_CEO_PROFILE : null)
      || DISTRICT_AUTHORITIES[id]
      || POLICE_AUTHORITIES[id]
      || MLA_PROFILES[id]
      || MP_PROFILES[id]
      || null;
}

function getWardOfficer(wardId) {
  return MCC_WARD_OFFICERS[`ward_${wardId}_officer`] || null;
}

function getPDOForGP(talukId, gpName) {
  const key = `pdo_${talukId}_${gpName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}`;
  return PDO_PROFILES[key] || null;
}

function getTalukEO(talukId) {
  return TALUK_EO_PROFILES[talukId] || null;
}

function getAllAuthorities() {
  return {
    ...CITY_AUTHORITIES,
    ...ULB_AUTHORITIES,
    ...MCC_WARD_OFFICERS,
    ...PDO_PROFILES,
    ...TALUK_EO_PROFILES,
    zp_ceo: ZP_CEO_PROFILE,
    ...DISTRICT_AUTHORITIES,
    ...POLICE_AUTHORITIES,
    ...MLA_PROFILES,
    ...MP_PROFILES
  };
}

function getTotalAuthorityCount() {
  return Object.keys(getAllAuthorities()).length;
}

// ----- Export -----
if (typeof window !== "undefined") {
  window.CivicSethuAuthorities = {
    CITY_AUTHORITIES,
    ULB_AUTHORITIES,
    MCC_WARD_OFFICERS,
    PDO_PROFILES,
    TALUK_EO_PROFILES,
    ZP_CEO_PROFILE,
    DISTRICT_AUTHORITIES,
    POLICE_AUTHORITIES,
    MLA_PROFILES,
    MP_PROFILES,
    getAuthorityById,
    getWardOfficer,
    getPDOForGP,
    getTalukEO,
    getAllAuthorities,
    getTotalAuthorityCount
  };
}