console.log("Babel script starting execution...");
const SEEDS = [
  { id: 1, name: "Low Grade Soft Matrix", mk_ppg: 0.30, mk_ppc_cut: 1.50, mk_rough_total: 9.24, mk_cut_total: 231.00, mk_grade: 2, mr_offer: 0.62, mr_ppg_implied: 0.02, mr_grade: 1, wg: 30.8, ct: 154, brightness: "B6", bodyTone: "N7", pattern: "Pinfire", treatmentQuality: "Poor", stabilityRisk: "High", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777163110/LM2_nkylci.jpg" },
  { id: 2, name: "High Saturation Matrix", mk_ppg: 3.00, mk_ppc_cut: null, mk_rough_total: 77.40, mk_cut_total: null, mk_grade: 4, mr_offer: null, mr_ppg_implied: 2.50, mr_grade: 3, wg: 25.8, ct: 129, brightness: "B4", bodyTone: "N5", pattern: "Flash", treatmentQuality: "Standard", stabilityRisk: "Medium", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777163115/1_lkkddr.jpg" },
  { id: 3, name: "Low Grade Colour Concrete Treated", mk_ppg: 0.075, mk_ppc_cut: 0.38, mk_rough_total: 0.90, mk_cut_total: 22.88, mk_grade: 1, mr_offer: 0.24, mr_ppg_implied: 0.02, mr_grade: 1, wg: 12.04, ct: 60.2, brightness: "B7", bodyTone: "N8", pattern: "Pinfire", treatmentQuality: "Poor", stabilityRisk: "High", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777163115/LG1_lqks7p.jpg" },
  { id: 4, name: "Low Grade Matrix", mk_ppg: 1.00, mk_ppc_cut: 7.50, mk_rough_total: 13.58, mk_cut_total: 509.25, mk_grade: 3, mr_offer: 20.00, mr_ppg_implied: 1.47, mr_grade: 2, wg: 13.58, ct: 67.9, brightness: "B6", bodyTone: "N7", pattern: "Pinfire", treatmentQuality: "Standard", stabilityRisk: "Medium", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777163115/IMG_4826_vvo5gb.jpg" },
  { id: 5, name: "High Grade Colour Concrete Treated", mk_ppg: .75, mk_ppc_cut: 7.50, mk_rough_total: 21.51, mk_cut_total: 1072.50, mk_grade: 5, mr_offer: 0.57, mr_ppg_implied: 0.02, mr_grade: 1, wg: 28.60, ct: 143, brightness: "B3", bodyTone: "N4", pattern: "Flash", treatmentQuality: "High", stabilityRisk: "Low", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777219429/IMG_4875_xo12hj.png" },
  { id: 6, name: "Mid Grade Hard Matrix", mk_ppg: 2.50, mk_ppc_cut: 20.00, mk_rough_total: 27.73, mk_cut_total: 1109.00, mk_grade: 4, mr_offer: 500.00, mr_ppg_implied: 45.09, mr_grade: 6, wg: 11.09, ct: 55.45, brightness: "B4", bodyTone: "N5", pattern: "Flash", treatmentQuality: "Standard", stabilityRisk: "Medium", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777163110/IMG_4824_a1cg0h.jpg" },
  { id: 7, name: "Mid Grade High Colour Matrix", mk_ppg: 3.00, mk_ppc_cut: 30.00, mk_rough_total: 17.22, mk_cut_total: 861.00, mk_grade: 5, mr_offer: 600.00, mr_ppg_implied: 104.53, mr_grade: 7, wg: 5.74, ct: 28.7, brightness: "B3", bodyTone: "N4", pattern: "Ribbon", treatmentQuality: "High", stabilityRisk: "Low", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777183367/IMG_4822_jhvoa0.jpg" },
  { id: 8, name: "High Grade Hard Matrix Treated", mk_ppg: 4.00, mk_ppc_cut: 45.00, mk_rough_total: 157.44, mk_cut_total: 8856.90, mk_grade: 6, mr_offer: 900.00, mr_ppg_implied: 22.86, mr_grade: 5, wg: 39.36, ct: 196.82, brightness: "B2", bodyTone: "N2", pattern: "Ribbon", treatmentQuality: "High", stabilityRisk: "Low", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777219431/IMG_4873_y9oofg.png" },
  { id: 9, name: "High Grade Hard Matrix Untreated", mk_ppg: 5.00, mk_ppc_cut: 100.00, mk_rough_total: 920.00, mk_cut_total: 92000.00, mk_grade: 8, mr_offer: 500.00, mr_ppg_implied: 2.72, mr_grade: 3, wg: 184, ct: 920, brightness: "B1", bodyTone: "N1", pattern: "Harlequin", treatmentQuality: "High", stabilityRisk: "Low", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777219429/IMG_4876_r3cl1m.png" },
  { id: 10, name: "Mid Grade Colour Concrete Treated", mk_ppg: 0.20, mk_ppc_cut: 0.75, mk_rough_total: 2.97, mk_cut_total: 55.61, mk_grade: 2, mr_offer: 0.30, mr_ppg_implied: 0.02, mr_grade: 1, wg: 14.83, ct: 74.15, brightness: "B4", bodyTone: "N5", pattern: "Flash", treatmentQuality: "Standard", stabilityRisk: "Medium", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777163112/MGC_s9ap7y.jpg" },
  { id: 11, name: "High Grade Hard Matrix Small", mk_ppg: 3.50, mk_ppc_cut: 45.00, mk_rough_total: 20.65, mk_cut_total: 1327.50, mk_grade: 7, mr_offer: 700.00, mr_ppg_implied: 118.64, mr_grade: 8, wg: 5.9, ct: 29.5, brightness: "B2", bodyTone: "N2", pattern: "Ribbon", treatmentQuality: "High", stabilityRisk: "Low", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777163116/IMG_4816_lzlryn.jpg" },
  { id: 12, name: "High Grade Hard Matrix Large", mk_ppg: 3.50, mk_ppc_cut: 45.00, mk_rough_total: 179.45, mk_cut_total: 11535.75, mk_grade: 7, mr_offer: 300.00, mr_ppg_implied: 5.85, mr_grade: 4, wg: 51.27, ct: 256.35, brightness: "B2", bodyTone: "N2", pattern: "Ribbon", treatmentQuality: "High", stabilityRisk: "Low", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777163110/IMG_4815_w0j9m6.jpg" }
];

const GRADE_COLORS = {
  1: '#5C2015', 2: '#7A3315', 3: '#9C481A', 4: '#B8621A',
  5: '#C88C24', 6: '#96981E', 7: '#4EA832', 8: '#24A86C', 9: '#10C896'
};

const B_SCORE = {B1:100,B2:85,B3:70,B4:55,B5:40,B6:25,B7:10};
const N_SCORE = {N1:100,N2:88,N3:75,N4:62,N5:50,N6:38,N7:25,N8:12};
const STB_INDEX_MAP = {Poor:20, Standard:60, High:95};

const USERS = {
  'mattk': {
    id: 'mattk', name: 'Matt Kathagen', role: 'Miner · Origin Specialist',
    color: 'var(--gold)', initials: 'MK', wallet: 'OPN-MK-GENESIS-001', desc: 'Andamooka · Genesis Mine'
  },
  'mattr': {
    id: 'mattr', name: 'Matt Rogers', role: 'Cutter · Market Specialist',
    color: 'var(--teal)', initials: 'MR', wallet: 'OPN-MR-HAHN-002', desc: 'Hahndorf · Lapidary Studio'
  }
};

const formatCur = (v) => (v === null || v === undefined) ? 'N/A' : '$' + Number(v).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits:2});
const formatNum = (v) => (v === null || v === undefined) ? 'N/A' : Number(v).toLocaleString('en-US', {minimumFractionDigits: 1, maximumFractionDigits:1});

const CUSTODIAN_ASSETS = [
  {
    id: "CC-001",
    type: "CUSTODIAN",
    collection: "Cobra Cuff",
    serialNumber: 1,
    totalEdition: 20,
    name: "Cobra Cuff No. 1 — Genesis Edition",
    owner: "Matt Kathagen",
    ownerRole: "Miner · Cobra Cuff Co-Founder",
    maker: "Cobra Cuff ™ · Lee & Matt",
    retailPrice: 2675,
    currency: "AUD",
    status: "HELD — NOT LISTED",
    genesisAsset: true,
    firstOnOPN: true,
    mediaAppearance: "Outback Opal Hunters",
    
    stone: {
      grade: 9,
      carats: 20,
      type: "Blue/Green Hard Matrix — Treated",
      pattern: "Broadflash",
      brightness: "B1",
      miner: "Matt & Cozza Kathagen",
      mine: "Mooka Boy Mine",
      coordinates: { lat: -30.454699, lng: 137.189437 },
      location: "Andamooka, South Australia",
    },
    
    object: {
      housing: "Reclaimed Andamooka mining steel",
      housingMaker: "Andamooka community blacksmith",
      cord: "Khaki paracord — field-ready",
      clasp: "Military-grade tactical clasp",
      engraving: "Crossed pickaxe marks — Mooka Boys insignia",
      dimensions: "Adjustable wrist cuff",
    },
    
    provenance: [
      { step: 1, label: "Extracted",    detail: "Mooka Boy Mine · Andamooka SA",     coords: "-30.454699, 137.189437" },
      { step: 2, label: "Treated",      detail: "Matt & Cozza Kathagen · Andamooka", date: "2026" },
      { step: 3, label: "Set",          detail: "Community blacksmith · Andamooka",  date: "2026" },
      { step: 4, label: "Assembled",    detail: "Cobra Cuff ™ · Lee & Matt",           date: "2026" },
      { step: 5, label: "Certified",    detail: "AOSA M9 Standard",                  date: "2026" },
      { step: 6, label: "Opal - Cut",   detail: "Matt Rogers",                       date: "2026" },
      { step: 7, label: "Broadcast",    detail: "Outback Opal Hunters — global",     date: "2026" },
      { step: 8, label: "Mint Pending", detail: "OPN · Polygon Network",             date: "2026" },
    ],
    
    nft: false,
    nft_value: 8025,
    nft_image: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777191838/openart-image_s4KRJWDf_1777191340348_raw_yssfes.png",
    img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777219429/IMG_4875_xo12hj.png",
  }
];
