/* ============================================================
   CIVIC SETHU — MYSURU
   File: locations.js
   Purpose: All administrative locations — City/Village, Taluks,
            Gram Panchayats, MCC Wards, ULBs, PIN codes
   ============================================================ */

// ----- TALUKS (9 total) -----
const TALUKS = [
  { id: "mysuru",       name: "Mysuru",       type: "mixed" },   // has city + villages
  { id: "hunsur",       name: "Hunsur",       type: "mixed" },
  { id: "hdkote",       name: "H.D. Kote",    type: "rural" },
  { id: "krnagar",      name: "K.R. Nagar",   type: "mixed" },
  { id: "nanjangud",    name: "Nanjangud",    type: "mixed" },
  { id: "periyapatna",  name: "Periyapatna",  type: "mixed" },
  { id: "tnarasipura",  name: "T. Narasipura",type: "mixed" },
  { id: "sargur",       name: "Sargur",       type: "rural" },
  { id: "saligrama",    name: "Saligrama",    type: "rural" }
];

// ----- URBAN LOCAL BODIES (9 total: 1 MCC + 8 other ULBs) -----
const ULBS = [
  { id: "mcc",          name: "Mysuru City Corporation",           type: "MCC",        taluk: "mysuru" },
  { id: "hunsur_cmc",   name: "Hunsur City Municipal Council",     type: "CMC",        taluk: "hunsur" },
  { id: "nanjangud_cmc",name: "Nanjangud City Municipal Council",  type: "CMC",        taluk: "nanjangud" },
  { id: "hdkote_tmc",   name: "H.D. Kote Town Municipal Council",  type: "TMC",        taluk: "hdkote" },
  { id: "krnagar_tmc",  name: "Krishnarajanagar Town Municipal Council", type: "TMC", taluk: "krnagar" },
  { id: "periyapatna_tmc", name: "Periyapatna Town Municipal Council", type: "TMC",   taluk: "periyapatna" },
  { id: "tnarasipura_tmc", name: "T. Narasipura Town Municipal Council", type: "TMC", taluk: "tnarasipura" },
  { id: "bannur_tmc",   name: "Bannur Town Municipal Council",     type: "TMC",        taluk: "mysuru" },
  { id: "sargur_tp",    name: "Sargur Town Panchayat",             type: "TP",         taluk: "sargur" }
];

// ----- MCC WARDS (65 total) with Corporators -----
const MCC_WARDS = [
  { id: 1,  name: "Hebbal – Lakshmikantha Nagara",     corporator: "B. Lakshmi" },
  { id: 2,  name: "Manchegowdana Koppalu",             corporator: "Prema" },
  { id: 3,  name: "Mahadeshwara Badavane",             corporator: "K.V. Sridhar" },
  { id: 4,  name: "Hebbalu – Lokanayaka Nagara",       corporator: "Pailavan Srinivas" },
  { id: 5,  name: "Kumbara Koppalu",                   corporator: "Usha" },
  { id: 6,  name: "Yadavagiri",                        corporator: "SBM Manju" },
  { id: 7,  name: "Metagalli",                         corporator: "V. Ramesh" },
  { id: 8,  name: "Bannimantapa",                      corporator: "Akmal Pasha" },
  { id: 9,  name: "Kesare",                            corporator: "Samiulla Khan" },
  { id: 10, name: "Rajeeva Nagara",                    corporator: "Anwar Baig" },
  { id: 11, name: "Shanti Nagara I",                   corporator: "Pushpalatha" },
  { id: 12, name: "Shanti Nagara II",                  corporator: "Ayaj Pasha" },
  { id: 13, name: "Udayagiri",                         corporator: "Ayub Khan" },
  { id: 14, name: "Kalyanagiri",                       corporator: "Savud Khan" },
  { id: 15, name: "Gayathripuram",                     corporator: "Pradeep Chandra" },
  { id: 16, name: "Naidu Nagara",                      corporator: "Arif Husen" },
  { id: 17, name: "Raghavendra Nagara",                corporator: "Reshma Bhanu" },
  { id: 18, name: "Rajendra Nagar",                    corporator: "Guru Vinayak" },
  { id: 19, name: "Medar Block",                       corporator: "Bhagya Madesh" },
  { id: 20, name: "Kurubarahalli",                     corporator: "M.U. Subaiah" },
  { id: 21, name: "Chamundipuram",                     corporator: "C. Vedavathi" },
  { id: 22, name: "JSS Layout",                        corporator: "Namratha" },
  { id: 23, name: "Kuvempunagar",                      corporator: "M. Pramila" },
  { id: 24, name: "Srirampura",                        corporator: "C. Ramesh" },
  { id: 25, name: "Ramakrishnanagar",                  corporator: "R. Rangaswamy" },
  { id: 26, name: "Srirampura II Stage",               corporator: "Tasneem" },
  { id: 27, name: "Alanahalli",                        corporator: "Mohamad Raphik" },
  { id: 28, name: "Dattagalli",                        corporator: "Dr. Ashwini" },
  { id: 29, name: "Siddhartha Layout",                 corporator: "Syad Hasarathulla" },
  { id: 30, name: "Vidyaranyapuram",                   corporator: "Usha" },
  { id: 31, name: "Jayanagar",                         corporator: "Shaphi Ahamed" },
  { id: 32, name: "Lakshmipuram",                      corporator: "Shanthakumari" },
  { id: 33, name: "Sunnadakeri",                       corporator: "Bashir Ahamed" },
  { id: 34, name: "Agrahara",                          corporator: "Hajeera Seema" },
  { id: 35, name: "Devaraja Mohalla",                  corporator: "Sathvik" },
  { id: 36, name: "K.R. Mohalla",                      corporator: "Rajani Anaiah" },
  { id: 37, name: "Mandi Mohalla",                     corporator: "Ashwini" },
  { id: 38, name: "Lashkar Mohalla",                   corporator: "C. Sridhar" },
  { id: 39, name: "Subbarayanakere",                   corporator: "Sathyaraj" },
  { id: 40, name: "Ashoka Puram",                      corporator: "M. Sathish" },
  { id: 41, name: "J.P. Nagar",                        corporator: "R. Nagaraj" },
  { id: 42, name: "K.G. Koppalu",                      corporator: "M. Shivakumar" },
  { id: 43, name: "T.K. Layout",                       corporator: "Gopi" },
  { id: 44, name: "Janata Nagara",                     corporator: "Savitha" },
  { id: 45, name: "Sharadadevi Nagara",                corporator: "K. Nirmala" },
  { id: 46, name: "Dattagalli",                        corporator: "M. Lakshmi" },
  { id: 47, name: "Kuvempu Nagara",                    corporator: "Shivakumar" },
  { id: 48, name: "Jayanagara",                        corporator: "M.S. Shobha" },
  { id: 49, name: "Lakshmi Puram",                     corporator: "N. Sowmya" },
  { id: 50, name: "Sunnadakeri",                       corporator: "V. Lokesh" },
  { id: 51, name: "Nazarbad",                          corporator: "B.V. Manjunath" },
  { id: 52, name: "Vontikoppal",                       corporator: "Chayadevi" },
  { id: 53, name: "Vijayanagar",                       corporator: "Roopa" },
  { id: 54, name: "Hebbal",                            corporator: "Puttanigamma" },
  { id: 55, name: "Hootagalli",                        corporator: "M.V. Ramaprasad" },
  { id: 56, name: "Hootagalli Industrial Area",        corporator: "Begum (Palavi)" },
  { id: 57, name: "Belavadi",                          corporator: "M.C. Ramesh" },
  { id: 58, name: "Ramakrishna Nagara",                corporator: "Sharath Kumar" },
  { id: 59, name: "Kuvempunagar",                      corporator: "Sunanda" },
  { id: 60, name: "Srirampura",                        corporator: "Bhuvaneshwari" },
  { id: 61, name: "Bannur Road",                       corporator: "Shobha" },
  { id: 62, name: "Alanahalli",                        corporator: "Shanthamma" },
  { id: 63, name: "Rajiv Nagar",                       corporator: "Sharadamma" },
  { id: 64, name: "Chamarajapuram",                    corporator: "Champaka" },
  { id: 65, name: "Lakshmipuram",                      corporator: "Geetha" }
];

// ----- GRAM PANCHAYATS (266 total, grouped by Taluk) -----
const GRAM_PANCHAYATS = {
  mysuru: [
    "Alanahalli","Ananduru","Beerihundi","Belawadi","Bogadi","Chamundibetta",
    "Devalapura","Dhanagalli","Doddamaragowdanahalli","Doora","Gopalapura",
    "Gungralchathra","Hanchya","Harohalli (Mellahalli)","Harohalli (J)","Hinkal",
    "Hosahundi","Jayapura","Kadakola","Keelanapura","Koorgalli",
    "Maratikyathanahalli","Marballi","Mosambayanahalli","Naganahalli","Nagawala",
    "Rammanahalli","Siddalingapura","Sindhuvalli","Someshwarapura","Srirampura",
    "Udbooru","Vajamangala","Varakodu","Varuna","Yadakola","Yelawala"
  ],
  hunsur: [
    "Asphathrekaval","Bannikuppe","Beejaganahalli","Biligere","Bilikere",
    "Bolanahalli","Challahalli","Chikkabeechanahalli","Chilkunda","Dharmapura",
    "Doddahejjuru","Gagenahalli","Gavadagere","Govindanahalli","Gurupur",
    "Halebeedu","Hanagodu","Harave","Hegganduru","Hirikyathanahalli",
    "Husenpura","Jabagere","Kademanuganahalli","Kallahalli","Karimuddanahalli",
    "Karnakuppe","Kattemalalavadi","Kiranguru","Kothegala","Manuganahalli",
    "Maraduru","Moduru","Mukanahalli","Mulluru","Neralekuppe",
    "Singamaranahalli","Thattekere","Udboorkaval","Udduru","Ummathuru",
    "Uyyigondanahalli"
  ],
  hdkote: [
    "Alanahalli","Annur","Antharasanthe","Bachegowdanahalli","Beechanahalli",
    "Bheemanahalli","Chakkodanahalli","Chikkereyuru","D.B. Kuppe","G.B. Saragur",
    "Hampapura","Hebbalaguppe","Hirehalli","Hommaragalli","Hosaholalu",
    "Hyrige","Kanchamalli","Kyathanahalli","Madapura","N. Begur",
    "N. Belthur","Naganahalli","Nooralakuppe","Padukote Kaval","Savve","Thumbasoge"
  ],
  nanjangud: [
    "Adakanahalli","Alambur","Allur","Bilugali","Chamalapura","Badanavalu",
    "Biligere","Dasanuru","Deburu","Devanuru","Devarasanahalli",
    "Devarayashettipura","Devirammanahalli","Doddakavalande","Duggahalli",
    "Hadinaru","Hadya","Haginavalu","Hallare","Haradanahalli","Hedathale",
    "Hediyala","Heggadahalli","Hemmaragala","Horalavadi","Hosakote","Hulimavu",
    "Hullahalli","Hura","Kalale","Karya","Kasuvinahalli","Kempesiddanahundi",
    "Konanur","Kudlapura","Kurihundi","Mallupura","Maraluru","Nagarle",
    "Nallithalapura","Naviluru","Nerale","Rampura","Sirmalli","Sindhuvalli",
    "Suttur","Tagadur","Thandavapura","Thayuru","Thumnerale"
  ],
  periyapatna: [
    "Attigodu","Avarathi","Bettadapura","Bettadathunga","Bhuvanahalli",
    "Bylakuppe","Chapparadahalli","Chennakalkavalu","Chikkanerale",
    "Chittenahalli","Chowthi","Doddabylalu","Doddakamaravalli","Halaganahalli",
    "Handithavalli","Haraduru","Haranahalli","Hitnehebbagilu","Hunasavadi",
    "Kamplapura","Kanagalu","Kiranalli","Kitturu","Komalapura","Koppa",
    "Makodu","Malangi","Muthuru","N. Shettihalli","Naviluru","Panchavalli",
    "Punadahalli","Ramanathathunga","Ravanduru"
  ],
  saligrama: [
    "Ankanahally","Bheriya","Channamgere","Haliyur","Hanasoge","Haradanahally",
    "Honnenahally","Hosakote","Karpoorvally","Kuppehantha (Chunchanakatte)",
    "Lakshmipura","Mayigowdanahally","Melur","Mirle","Munjanahally",
    "Narachanahally","Nheegavalu","Thandre"
  ],
  sargur: [
    "B. Matakere","Bidarahalli","Hadanuru","Hanchipura","Hegganur","Itna",
    "K. Belthur","Kallambalu","Kothegala","M.C. Thalalu","Manuganahalli",
    "Mullur","Sagare"
  ],
  tnarasipura: [
    "Ankanahalli","Attahalli","B. Shettahalli","Beedanahalli","Benkanahalli",
    "Chidaravalli","Doddebagilu","Gargeshwari","Hanumanalu","Hegguru",
    "Hemmige","Holesalu","Hosakote","Kaliyuru","Karohatti","Kethupura",
    "Kiragasuru","Kodagahalli","Kolathuru","Kothegala","Kupya","Madapura",
    "Maliyuru","Muguru","Muttalavadi","Rangasamudra","Seehalli",
    "Somanathapura","Sosale","T. Doddapura","Talkad","Thumbala",
    "Thuraganuru","Ukkalagere","Vatalu","Yachenahalli"
  ],
  krnagar: [
    "Adagur","Arjunahalli","Byadarahally","Chandagalu","Doddakoppalu",
    "Gandhanahally","Hebbalu","Hompapura","Hosaagrahara","Kaggere","Kesthur",
    "Lalandevanahally","Mavattur","Saligrama","Siddapura","Thippur"
  ]
};

// ----- PIN CODE → AREA MAPPING (simplified, key PINs) -----
// Used for routing: PIN → which ward / GP / taluk
const PIN_CODE_MAP = {
  // Mysuru City
  "570001": { taluk: "mysuru", area: "MCC", ward_id: 35 },   // Devaraja Mohalla
  "570002": { taluk: "mysuru", area: "MCC", ward_id: 21 },   // Chamundipuram
  "570003": { taluk: "mysuru", area: "MCC", ward_id: 33 },   // Sunnadakeri
  "570004": { taluk: "mysuru", area: "MCC", ward_id: 38 },   // Lashkar Mohalla
  "570005": { taluk: "mysuru", area: "MCC", ward_id: 40 },   // Ashoka Puram
  "570006": { taluk: "mysuru", area: "MCC", ward_id: 23 },   // Kuvempunagar
  "570007": { taluk: "mysuru", area: "MCC", ward_id: 25 },   // Ramakrishnanagar
  "570008": { taluk: "mysuru", area: "MCC", ward_id: 32 },   // Lakshmipuram
  "570009": { taluk: "mysuru", area: "MCC", ward_id: 52 },   // Vontikoppal
  "570010": { taluk: "mysuru", area: "MCC", ward_id: 53 },   // Vijayanagar
  "570011": { taluk: "mysuru", area: "MCC", ward_id: 41 },   // J.P. Nagar
  "570012": { taluk: "mysuru", area: "MCC", ward_id: 13 },   // Udayagiri
  "570013": { taluk: "mysuru", area: "MCC", ward_id: 48 },   // Jayanagara
  "570014": { taluk: "mysuru", area: "MCC", ward_id: 42 },   // K.G. Koppalu
  "570015": { taluk: "mysuru", area: "MCC", ward_id: 54 },   // Hebbal
  "570016": { taluk: "mysuru", area: "MCC", ward_id: 6 },    // Yadavagiri
  "570017": { taluk: "mysuru", area: "MCC", ward_id: 7 },    // Metagalli
  "570018": { taluk: "mysuru", area: "MCC", ward_id: 8 },    // Bannimantapa
  "570019": { taluk: "mysuru", area: "MCC", ward_id: 20 },   // Kurubarahalli
  "570020": { taluk: "mysuru", area: "MCC", ward_id: 28 },   // Dattagalli
  "570021": { taluk: "mysuru", area: "MCC", ward_id: 27 },   // Alanahalli
  "570022": { taluk: "mysuru", area: "MCC", ward_id: 55 },   // Hootagalli
  "570023": { taluk: "mysuru", area: "MCC", ward_id: 57 },   // Belavadi
  "570024": { taluk: "mysuru", area: "MCC", ward_id: 30 },   // Vidyaranyapuram
  "570025": { taluk: "mysuru", area: "MCC", ward_id: 31 },   // Jayanagar
  "570026": { taluk: "hdkote", area: "GP",  gp: "Hampapura" },
  "570027": { taluk: "mysuru", area: "MCC", ward_id: 44 },   // Janata Nagara
  "570028": { taluk: "mysuru", area: "MCC", ward_id: 59 },   // Kuvempunagar
  "570029": { taluk: "mysuru", area: "MCC", ward_id: 62 },   // Alanahalli

  // Hunsur
  "571103": { taluk: "hunsur", area: "ULB", ulb_id: "hunsur_cmc" },
  "571105": { taluk: "hunsur", area: "GP",  gp: "Halebeedu" },
  "571134": { taluk: "hunsur", area: "GP",  gp: "Hirikyathanahalli" },
  "571189": { taluk: "hunsur", area: "GP",  gp: "Hanagodu" },
  "571610": { taluk: "hunsur", area: "GP",  gp: "Gurupur" },

  // H.D. Kote
  "571114": { taluk: "hdkote", area: "ULB", ulb_id: "hdkote_tmc" },
  "571116": { taluk: "hdkote", area: "GP",  gp: "Antharasanthe" },
  "571121": { taluk: "hdkote", area: "GP",  gp: "G.B. Saragur" },
  "571125": { taluk: "hdkote", area: "GP",  gp: "Hosaholalu" },

  // Nanjangud
  "571118": { taluk: "nanjangud", area: "GP",  gp: "Hullahalli" },
  "571119": { taluk: "nanjangud", area: "GP",  gp: "Hediyala" },
  "571128": { taluk: "nanjangud", area: "GP",  gp: "Devanuru" },
  "571129": { taluk: "nanjangud", area: "GP",  gp: "Suttur" },
  "571301": { taluk: "nanjangud", area: "ULB", ulb_id: "nanjangud_cmc" },
  "571302": { taluk: "nanjangud", area: "GP",  gp: "Hosakote" },
  "571312": { taluk: "nanjangud", area: "GP",  gp: "Karya" },
  "571314": { taluk: "nanjangud", area: "GP",  gp: "Kasuvinahalli" },
  "571315": { taluk: "nanjangud", area: "GP",  gp: "Thandavapura" },

  // T. Narasipura
  "571101": { taluk: "tnarasipura", area: "GP",  gp: "Sosale" },
  "571110": { taluk: "mysuru",      area: "GP",  gp: "Varuna" },
  "571120": { taluk: "tnarasipura", area: "GP",  gp: "Hemmige" },
  "571122": { taluk: "tnarasipura", area: "GP",  gp: "Talkad" },
  "571124": { taluk: "tnarasipura", area: "ULB", ulb_id: "tnarasipura_tmc" },

  // Periyapatna
  "571102": { taluk: "periyapatna", area: "GP",  gp: "Bettadapura" },
  "571104": { taluk: "periyapatna", area: "ULB", ulb_id: "periyapatna_tmc" },
  "571107": { taluk: "periyapatna", area: "GP",  gp: "Bylakuppe" },
  "571108": { taluk: "periyapatna", area: "GP",  gp: "Koppa" },
  "571187": { taluk: "periyapatna", area: "GP",  gp: "Kitturu" },

  // K.R. Nagar
  "571601": { taluk: "krnagar", area: "ULB", ulb_id: "krnagar_tmc" },
  "571602": { taluk: "krnagar", area: "GP",  gp: "Saligrama" },
  "571603": { taluk: "krnagar", area: "GP",  gp: "Hosaagrahara" },
  "571604": { taluk: "krnagar", area: "GP",  gp: "Kesthur" },
  "571617": { taluk: "krnagar", area: "GP",  gp: "Mirle" }
};

// ----- Helper functions -----
function getTaluks() {
  return TALUKS;
}

function getGramPanchayatsByTaluk(talukId) {
  return GRAM_PANCHAYATS[talukId] || [];
}

function getULBsByTaluk(talukId) {
  return ULBS.filter(u => u.taluk === talukId);
}

function getWardById(wardId) {
  return MCC_WARDS.find(w => w.id === wardId);
}

function getPINInfo(pin) {
  return PIN_CODE_MAP[pin] || null;
}

function getTotalGPCount() {
  return Object.values(GRAM_PANCHAYATS).reduce((sum, arr) => sum + arr.length, 0);
}

// ----- Export (for browser: attach to window) -----
if (typeof window !== "undefined") {
  window.CivicSethuLocations = {
    TALUKS,
    ULBS,
    MCC_WARDS,
    GRAM_PANCHAYATS,
    PIN_CODE_MAP,
    getTaluks,
    getGramPanchayatsByTaluk,
    getULBsByTaluk,
    getWardById,
    getPINInfo,
    getTotalGPCount
  };
}