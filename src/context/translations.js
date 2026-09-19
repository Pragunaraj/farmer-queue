export const TRANSLATIONS = {
  ENG: {
    // Brand & Sidebar
    brandName: "AgriFlow",
    brandSub: "Mandi Admin Portal",
    procurementOps: "PROCUREMENT OPERATIONS",
    commandCenter: "Command Center",
    commandCenterDesc: "Mandi operations overview",
    tokenScanner: "Token Scanner",
    tokenScannerDesc: "Gate verification",
    qualityAssessment: "Quality Assessment",
    qualityAssessmentDesc: "Weight, grade & pricing",
    inventory: "Inventory",
    inventoryDesc: "Storage & dispatch ledger",
    blockchainSynced: "Blockchain Synced",
    blockMeta: "Block #18,42,209 · 2s ago",
    procurementOfficer: "Procurement Officer",
    mandiCode: "Mandi Code: RJ-JPR-04",

    // Top Header
    headerTitle: "Command Center",
    headerSubtitle: "Real-time Mandi procurement telemetry, throughput metrics, and incoming token flow.",
    mandiBadge: "Mandi: Jaipur Central RJ-04",
    issueTokenBtn: "Issue Token",
    syncDataBtn: "Sync Data",

    // KPI Cards
    todaysIntake: "TODAY'S INTAKE",
    intakeVsYesterday: "+14.2% vs yesterday",
    activePipeline: "ACTIVE PIPELINE",
    tokensCount: "Tokens",
    waitingSub: "waiting",
    gateSub: "gate",
    inTestSub: "in test",
    avgQualityGrade: "AVG QUALITY GRADE",
    gradeAStandard: "Grade A (94%)",
    moistureOptimal: "Avg moisture: 10.9% (Optimal)",
    totalMspDisbursed: "TOTAL MSP DISBURSED",
    escrowSyncedText: "100% Escrow Blockchain Synced",

    // Hourly Throughput Graph
    hourlyThroughputTitle: "Hourly Procurement Throughput",
    hourlyThroughputDesc: "Quintals processed per hour",
    quintalsPill: "Quintals",
    peakTraffic: "Peak traffic",

    // Live Queue Section
    liveQueueTitle: "Live Operations Queue",
    tokensLabel: "tokens",
    updatedText: "Updated",
    secondsAgoText: "s ago",
    searchPlaceholder: "Search token, farmer or crop...",
    
    // Filters
    allTokens: "All Tokens",
    filterWaiting: "Waiting",
    filterGateVerified: "Gate Verified",
    filterInInspection: "In Inspection",
    filterPaid: "Paid",

    // Table Headers
    thTokenId: "TOKEN ID",
    thFarmer: "FARMER / PHONE",
    thCrop: "CROP / QUANTITY",
    thSlot: "APPOINTMENT SLOT",
    thStatus: "STATUS",
    thQuality: "QUALITY & RATE",
    thAction: "ACTION",

    // Table Actions & Statuses
    actionInspect: "Inspect",
    actionVerifyGate: "Gate Verify",
    actionViewReceipt: "View Receipt",
    statusWaiting: "Waiting",
    statusGateVerified: "Gate Verified",
    statusInInspection: "In Inspection",
    statusPaid: "Paid",
    noMatchingTokens: "No matching tokens found in current filter.",

    // Issue Token Modal
    modalIssueTitle: "Issue Procurement Token",
    modalIssueDesc: "Generate appointment & barcode for incoming farmer delivery",
    labelFarmerName: "Farmer Full Name",
    placeholderFarmerName: "e.g. Ramprasad Meena",
    labelPhone: "Mobile Phone Number",
    labelVillage: "Village / Tehsil",
    placeholderVillage: "e.g. Chomu, Jaipur",
    labelCropVariety: "Crop Variety (MSP Assured)",
    labelQuantity: "Estimated Quantity (Quintals)",
    labelAppointmentSlot: "Scheduled Arrival Slot",
    labelInitialStatus: "Initial Entry Status",
    btnCancel: "Cancel",
    btnGenerateToken: "Issue Token & Print",

    // Token Details Modal
    modalDetailsTitle: "Token Telemetry & Ledger Details",
    modalDetailsDesc: "Immutable procurement record & blockchain receipt",
    sectionFarmerInfo: "Farmer & Crop Details",
    labelFarmer: "Farmer",
    labelContact: "Contact",
    labelLocation: "Location",
    labelCommodity: "Commodity",
    labelQuantityQtl: "Quantity",
    labelSlot: "Appointment Slot",
    sectionQualityPricing: "Quality & Valuation",
    labelStatus: "Current Status",
    labelAssessedGrade: "Assessed Grade",
    labelMoisture: "Moisture Content",
    labelMspRate: "Procurement MSP",
    labelEstPayout: "Estimated Payout",
    sectionAudit: "Ledger Audit & Vehicle",
    labelVehicle: "Vehicle No.",
    labelTxHash: "Blockchain TxHash",
    btnPrintSlip: "Print Mandi Slip",
    btnClose: "Close",

    // Token Scanner Page
    scannerTitle: "Gate Token Scanner",
    scannerSubtitle: "Verify farmer QR tokens, check appointment slots, and authorize mandi gate entry.",
    scannerStatTotal: "Tokens Scanned Today",
    scannerStatApproved: "Gate Entries Approved",
    scannerStatRejected: "Rejections / Invalid",

    // Quality Assessment Page
    qualityTitle: "Quality Assessment & Grading Bay",
    qualitySubtitle: "Grain moisture telemetry, digital grade classification, dockage deduction, and MSP valuation calculation.",

    // Inventory Page
    inventoryTitle: "Mandi Storage Silos & Dispatch Ledger",
    inventorySubtitle: "Real-time grain stock inventory, silo capacity utilization, and rail/truck dispatch fulfillment.",
  },

  HIN: {
    // Brand & Sidebar
    brandName: "AgriFlow",
    brandSub: "मंडी व्यवस्थापक पोर्टल",
    procurementOps: "खरीद संचालन",
    commandCenter: "कमांड सेंटर",
    commandCenterDesc: "मंडी संचालन का संपूर्ण विवरण",
    tokenScanner: "टोकन स्कैनर",
    tokenScannerDesc: "गेट सत्यापन और प्रवेश",
    qualityAssessment: "गुणवत्ता मूल्यांकन",
    qualityAssessmentDesc: "वजन, ग्रेडिंग एवं दर निर्धारण",
    inventory: "इन्वेंट्री भंडार",
    inventoryDesc: "गोदाम स्टॉक एवं प्रेषण खाता",
    blockchainSynced: "ब्लॉकचेन सिंक हुआ",
    blockMeta: "ब्लॉक #18,42,209 · 2 से. पहले",
    procurementOfficer: "खरीद अधिकारी",
    mandiCode: "मंडी कोड: RJ-JPR-04",

    // Top Header
    headerTitle: "कमांड सेंटर",
    headerSubtitle: "वास्तविक समय मंडी खरीद टेलीमेट्री, थ्रूपुट मेट्रिक्स और आने वाला टोकन प्रवाह।",
    mandiBadge: "मंडी: जयपुर सेंट्रल RJ-04",
    issueTokenBtn: "टोकन जारी करें",
    syncDataBtn: "डेटा सिंक करें",

    // KPI Cards
    todaysIntake: "आज की कुल आवक",
    intakeVsYesterday: "+14.2% कल की तुलना में",
    activePipeline: "सक्रिय पाइपलाइन",
    tokensCount: "टोकन",
    waitingSub: "प्रतीक्षारत",
    gateSub: "गेट पर",
    inTestSub: "जांच में",
    avgQualityGrade: "औसत गुणवत्ता ग्रेड",
    gradeAStandard: "ग्रेड A (94%)",
    moistureOptimal: "औसत नमी: 10.9% (अनुकूल)",
    totalMspDisbursed: "कुल एमएसपी भुगतान",
    escrowSyncedText: "100% एस्क्रो ब्लॉकचेन सत्यापित",

    // Hourly Throughput Graph
    hourlyThroughputTitle: "प्रति घंटा खरीद थ्रूपुट",
    hourlyThroughputDesc: "प्रति घंटे प्रसंस्कृत क्विंटल की संख्या",
    quintalsPill: "क्विंटल",
    peakTraffic: "उच्चतम आवक",

    // Live Queue Section
    liveQueueTitle: "लाइव संचालन कतार",
    tokensLabel: "टोकन",
    updatedText: "अपडेटेड",
    secondsAgoText: "से. पहले",
    searchPlaceholder: "टोकन नंबर, किसान या फसल खोजें...",
    
    // Filters
    allTokens: "सभी टोकन",
    filterWaiting: "प्रतीक्षारत",
    filterGateVerified: "गेट सत्यापित",
    filterInInspection: "जांच में",
    filterPaid: "भुगतान पूरा",

    // Table Headers
    thTokenId: "टोकन आईडी",
    thFarmer: "किसान / फोन",
    thCrop: "फसल / मात्रा",
    thSlot: "अपॉइंटमेंट समय",
    thStatus: "स्थिति",
    thQuality: "गुणवत्ता एवं दर",
    thAction: "कार्रवाई",

    // Table Actions & Statuses
    actionInspect: "जांचें",
    actionVerifyGate: "गेट सत्यापन",
    actionViewReceipt: "रसीद देखें",
    statusWaiting: "प्रतीक्षारत",
    statusGateVerified: "गेट सत्यापित",
    statusInInspection: "जांच में",
    statusPaid: "भुगतान पूरा",
    noMatchingTokens: "वर्तमान फ़िल्टर में कोई टोकन नहीं मिला।",

    // Issue Token Modal
    modalIssueTitle: "नया खरीद टोकन जारी करें",
    modalIssueDesc: "किसान की उपज आवक हेतु डिजिटल अपॉइंटमेंट एवं बारकोड बनाएं",
    labelFarmerName: "किसान का पूरा नाम",
    placeholderFarmerName: "उदा. रामप्रसाद मीणा",
    labelPhone: "मोबाइल नंबर",
    labelVillage: "गाँव / तहसील",
    placeholderVillage: "उदा. चौमूं, जयपुर",
    labelCropVariety: "फसल की किस्म (एमएसपी निर्धारित)",
    labelQuantity: "अनुमानित मात्रा (क्विंटल)",
    labelAppointmentSlot: "आगमन समय स्लॉट",
    labelInitialStatus: "प्रारंभिक प्रवेश स्थिति",
    btnCancel: "रद्द करें",
    btnGenerateToken: "टोकन बनाएं एवं प्रिंट करें",

    // Token Details Modal
    modalDetailsTitle: "टोकन टेलीमेट्री एवं बहीखाता विवरण",
    modalDetailsDesc: "अपरिवर्तनीय खरीद रिकॉर्ड और ब्लॉकचेन रसीद",
    sectionFarmerInfo: "किसान एवं फसल विवरण",
    labelFarmer: "किसान",
    labelContact: "संपर्क",
    labelLocation: "स्थान",
    labelCommodity: "जिंस (फसल)",
    labelQuantityQtl: "मात्रा",
    labelSlot: "स्लॉट समय",
    sectionQualityPricing: "गुणवत्ता एवं मूल्यांकन",
    labelStatus: "वर्तमान स्थिति",
    labelAssessedGrade: "निर्धारित ग्रेड",
    labelMoisture: "नमी की मात्रा",
    labelMspRate: "खरीद एमएसपी",
    labelEstPayout: "अनुमानित भुगतान",
    sectionAudit: "लेखा परीक्षा एवं वाहन",
    labelVehicle: "वाहन संख्या",
    labelTxHash: "ब्लॉकचेन हैश",
    btnPrintSlip: "मंडी पर्ची प्रिंट करें",
    btnClose: "बंद करें",

    // Token Scanner Page
    scannerTitle: "गेट टोकन स्कैनर",
    scannerSubtitle: "किसान क्यूआर टोकन सत्यापित करें, स्लॉट जांचें और मंडी गेट प्रवेश अधिकृत करें।",
    scannerStatTotal: "आज स्कैन किए गए टोकन",
    scannerStatApproved: "गेट प्रवेश स्वीकृत",
    scannerStatRejected: "अस्वीकृत / अमान्य",

    // Quality Assessment Page
    qualityTitle: "गुणवत्ता मूल्यांकन एवं ग्रेडिंग बे",
    qualitySubtitle: "अनाज की नमी टेलीमेट्री, डिजिटल ग्रेड वर्गीकरण, कटौती और एमएसपी मूल्य निर्धारण।",

    // Inventory Page
    inventoryTitle: "मंडी साइलो भंडारण एवं प्रेषण खाता",
    inventorySubtitle: "वास्तविक समय अनाज भंडार, साइलो क्षमता उपयोग और ट्रेन/ट्रक प्रेषण ट्रैकिंग।",
  },

  KAN: {
    // Brand & Sidebar
    brandName: "AgriFlow",
    brandSub: "ಮಂಡಿ ಆಡಳಿತ ಪೋರ್ಟಲ್",
    procurementOps: "ಖರೀದಿ ಕಾರ್ಯಾಚರಣೆಗಳು",
    commandCenter: "ಕಮಾಂಡ್ ಸೆಂಟರ್",
    commandCenterDesc: "ಮಂಡಿ ಕಾರ್ಯಾಚರಣೆಗಳ ಅವಲೋಕನ",
    tokenScanner: "ಟೋಕನ್ ಸ್ಕ್ಯಾನರ್",
    tokenScannerDesc: "ಗೇಟ್ ಪರಿಶೀಲನೆ ಮತ್ತು ಪ್ರವೇಶ",
    qualityAssessment: "ಗುಣಮಟ್ಟ ಮೌಲ್ಯಮಾಪನ",
    qualityAssessmentDesc: "ತೂಕ, ಗ್ರೇಡಿಂಗ್ ಮತ್ತು ಬೆಲೆ ನಿಗದಿ",
    inventory: "ದಾಸ್ತಾನು ಸಂಗ್ರಹ",
    inventoryDesc: "ಗೋದಾಮು ದಾಸ್ತಾನು ಮತ್ತು ರವಾನೆ ಲೆಡ್ಜರ್",
    blockchainSynced: "ಬ್ಲಾಕ್‌ಚೈನ್ ಸಿಂಕ್ ಆಗಿದೆ",
    blockMeta: "ಬ್ಲಾಕ್ #18,42,209 · 2ಸೆ ಹಿಂದೆ",
    procurementOfficer: "ಖರೀದಿ ಅಧಿಕಾರಿ",
    mandiCode: "ಮಂಡಿ ಕೋಡ್: RJ-JPR-04",

    // Top Header
    headerTitle: "ಕಮಾಂಡ್ ಸೆಂಟರ್",
    headerSubtitle: "ನೈಜ-ಸಮಯದ ಮಂಡಿ ಖರೀದಿ ಟೆಲಿಮೆಟ್ರಿ, ಥ್ರೂಪುಟ್ ಮೆಟ್ರಿಕ್‌ಗಳು ಮತ್ತು ಒಳಬರುವ ಟೋಕನ್ ಹರಿವು.",
    mandiBadge: "ಮಂಡಿ: ಜೈಪುರ ಸೆಂಟ್ರಲ್ RJ-04",
    issueTokenBtn: "ಟೋಕನ್ ನೀಡಿ",
    syncDataBtn: "ಡೇಟಾ ಸಿಂಕ್ ಮಾಡಿ",

    // KPI Cards
    todaysIntake: "ಇಂದಿನ ಒಟ್ಟು ಒಳಹರಿವು",
    intakeVsYesterday: "+14.2% ನಿನ್ನೆಗಿಂತ",
    activePipeline: "ಸಕ್ರಿಯ ಪೈಪ್‌ಲೈನ್",
    tokensCount: "ಟೋಕನ್‌ಗಳು",
    waitingSub: "ಕಾಯುತ್ತಿದೆ",
    gateSub: "ಗೇಟ್‌ನಲ್ಲಿ",
    inTestSub: "ಪರೀಕ್ಷೆಯಲ್ಲಿ",
    avgQualityGrade: "ಸರಾಸರಿ ಗುಣಮಟ್ಟ ಗ್ರೇಡ್",
    gradeAStandard: "ಗ್ರೇಡ್ A (94%)",
    moistureOptimal: "ಸರಾಸರಿ ತೇವಾಂಶ: 10.9% (ಉತ್ತಮ)",
    totalMspDisbursed: "ಒಟ್ಟು ಎಂಎಸ್‌ಪಿ ಪಾವತಿ",
    escrowSyncedText: "100% ಎಸ್ಕ್ರೋ ಬ್ಲಾಕ್‌ಚೈನ್ ಪರಿಶೀಲಿಸಲಾಗಿದೆ",

    // Hourly Throughput Graph
    hourlyThroughputTitle: "ಗಂಟೆಯ ಖರೀದಿ ಥ್ರೂಪುಟ್",
    hourlyThroughputDesc: "ಪ್ರತಿ ಗಂಟೆಗೆ ಸಂಸ್ಕರಿಸಿದ ಕ್ವಿಂಟಾಲ್‌ಗಳು",
    quintalsPill: "ಕ್ವಿಂಟಾಲ್",
    peakTraffic: "ಗರಿಷ್ಠ ಒಳಹರಿವು",

    // Live Queue Section
    liveQueueTitle: "ಲೈವ್ ಕಾರ್ಯಾಚರಣೆಗಳ ಸರತಿ ಸಾಲು",
    tokensLabel: "ಟೋಕನ್‌ಗಳು",
    updatedText: "ನವೀಕರಿಸಲಾಗಿದೆ",
    secondsAgoText: "ಸೆ ಹಿಂದೆ",
    searchPlaceholder: "ಟೋಕನ್, ರೈತ ಅಥವಾ ಬೆಳೆ ಹುಡುಕಿ...",
    
    // Filters
    allTokens: "ಎಲ್ಲಾ ಟೋಕನ್‌ಗಳು",
    filterWaiting: "ಕಾಯುತ್ತಿದೆ",
    filterGateVerified: "ಗೇಟ್ ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    filterInInspection: "ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ",
    filterPaid: "ಪಾವತಿಸಲಾಗಿದೆ",

    // Table Headers
    thTokenId: "ಟೋಕನ್ ಐಡಿ",
    thFarmer: "ರೈತ / ಮೊಬೈಲ್",
    thCrop: "ಬೆಳೆ / ಪ್ರಮಾಣ",
    thSlot: "ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಸಮಯ",
    thStatus: "ಸ್ಥಿತಿ",
    thQuality: "ಗುಣಮಟ್ಟ ಮತ್ತು ದರ",
    thAction: "ಕ್ರಮ",

    // Table Actions & Statuses
    actionInspect: "ಪರಿಶೀಲಿಸಿ",
    actionVerifyGate: "ಗೇಟ್ ದೃಢೀಕರಿಸಿ",
    actionViewReceipt: "ರಶೀದಿ ವೀಕ್ಷಿಸಿ",
    statusWaiting: "ಕಾಯುತ್ತಿದೆ",
    statusGateVerified: "ಗೇಟ್ ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    statusInInspection: "ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ",
    statusPaid: "ಪಾವತಿಸಲಾಗಿದೆ",
    noMatchingTokens: "ಪ್ರಸ್ತುತ ಫಿಲ್ಟರ್‌ನಲ್ಲಿ ಯಾವುದೇ ಟೋಕನ್‌ಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",

    // Issue Token Modal
    modalIssueTitle: "ಹೊಸ ಖರೀದಿ ಟೋಕನ್ ನೀಡಿ",
    modalIssueDesc: "ರೈತರ ಬೆಳೆ ಆಗಮನಕ್ಕಾಗಿ ಡಿಜಿಟಲ್ ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಮತ್ತು ಬಾರ್‌ಕೋಡ್ ರಚಿಸಿ",
    labelFarmerName: "ರೈತನ ಪೂರ್ಣ ಹೆಸರು",
    placeholderFarmerName: "ಉದಾ. ರಾಮಪ್ರಸಾದ್ ಮೀನಾ",
    labelPhone: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    labelVillage: "ಗ್ರಾಮ / ತಾಲೂಕು",
    placeholderVillage: "ಉದಾ. ಚೋಮು, ಜೈಪುರ",
    labelCropVariety: "ಬೆಳೆಯ ತಳಿ (ಖಾತರಿ ಎಂಎಸ್‌ಪಿ)",
    labelQuantity: "ಅಂದಾಜು ಪ್ರಮಾಣ (ಕ್ವಿಂಟಾಲ್)",
    labelAppointmentSlot: "ನಿಗದಿತ ಆಗಮನ ಸಮಯ",
    labelInitialStatus: "ಆರಂಭಿಕ ಪ್ರವೇಶ ಸ್ಥಿತಿ",
    btnCancel: "ರದ್ದುಮಾಡಿ",
    btnGenerateToken: "ಟೋಕನ್ ರಚಿಸಿ ಮತ್ತು ಮುದ್ರಿಸಿ",

    // Token Details Modal
    modalDetailsTitle: "ಟೋಕನ್ ಟೆಲಿಮೆಟ್ರಿ ಮತ್ತು ಲೆಡ್ಜರ್ ವಿವರಗಳು",
    modalDetailsDesc: "ಸ್ಥಿರ ಖರೀದಿ ದಾಖಲೆ ಮತ್ತು ಬ್ಲಾಕ್‌ಚೈನ್ ರಶೀದಿ",
    sectionFarmerInfo: "ರೈತ ಮತ್ತು ಬೆಳೆ ವಿವರಗಳು",
    labelFarmer: "ರೈತ",
    labelContact: "ಸಂಪರ್ಕ",
    labelLocation: "ಸ್ಥಳ",
    labelCommodity: "ಬೆಳೆ",
    labelQuantityQtl: "ಪ್ರಮಾಣ",
    labelSlot: "ಸ್ಲಾಟ್ ಸಮಯ",
    sectionQualityPricing: "ಗುಣಮಟ್ಟ ಮತ್ತು ಮೌಲ್ಯಮಾಪನ",
    labelStatus: "ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ",
    labelAssessedGrade: "ನಿಗದಿಪಡಿಸಿದ ಗ್ರೇಡ್",
    labelMoisture: "ತೇವಾಂಶ ಪ್ರಮಾಣ",
    labelMspRate: "ಖರೀದಿ ಎಂಎಸ್‌ಪಿ",
    labelEstPayout: "ಅಂದಾಜು ಪಾವತಿ",
    sectionAudit: "ಲೆಕ್ಕಪರಿಶೋಧನೆ ಮತ್ತು ವಾಹನ",
    labelVehicle: "ವಾಹನ ಸಂಖ್ಯೆ",
    labelTxHash: "ಬ್ಲಾಕ್‌ಚೈನ್ ಹ್ಯಾಶ್",
    btnPrintSlip: "ಮಂಡಿ ಸ್ಲಿಪ್ ಮುದ್ರಿಸಿ",
    btnClose: "ಮುಚ್ಚಿ",

    // Token Scanner Page
    scannerTitle: "ಗೇಟ್ ಟೋಕನ್ ಸ್ಕ್ಯಾನರ್",
    scannerSubtitle: "ರೈತರ ಕ್ಯೂಆರ್ ಟೋಕನ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಿ, ಸ್ಲಾಟ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಮಂಡಿ ಗೇಟ್ ಪ್ರವೇಶವನ್ನು ಅಧಿಕೃತಗೊಳಿಸಿ.",
    scannerStatTotal: "ಇಂದು ಸ್ಕ್ಯಾನ್ ಮಾಡಲಾದ ಟೋಕನ್‌ಗಳು",
    scannerStatApproved: "ಗೇಟ್ ಪ್ರವೇಶಗಳು ಅನುಮೋದಿಸಲಾಗಿದೆ",
    scannerStatRejected: "ತಿರಸ್ಕರಿಸಲಾಗಿದೆ / ಅಮಾನ್ಯ",

    // Quality Assessment Page
    qualityTitle: "ಗುಣಮಟ್ಟ ಮೌಲ್ಯಮಾಪನ ಮತ್ತು ಗ್ರೇಡಿಂಗ್ ಬೇ",
    qualitySubtitle: "ಧಾನ್ಯ ತೇವಾಂಶ ಟೆಲಿಮೆಟ್ರಿ, ಡಿಜಿಟಲ್ ಗ್ರೇಡ್ ವರ್ಗೀಕರಣ, ಕಡಿತ ಮತ್ತು ಎಂಎಸ್‌ಪಿ ಮೌಲ್ಯಮಾಪನ.",

    // Inventory Page
    inventoryTitle: "ಮಂಡಿ ಸೈಲೋ ಶೇಖರಣೆ ಮತ್ತು ರವಾನೆ ಲೆಡ್ಜರ್",
    inventorySubtitle: "ನೈಜ-ಸಮಯದ ಧಾನ್ಯ ದಾಸ್ತಾನು, ಸೈಲೋ ಸಾಮರ್ಥ್ಯ ಬಳಕೆ ಮತ್ತು ರೈಲು/ಟ್ರಕ್ ರವಾನೆ ಟ್ರ್ಯಾಕಿಂಗ್.",
  },
};
