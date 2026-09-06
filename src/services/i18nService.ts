import { IndianLanguageCode } from '../types/user';

export interface SupportedLanguage {
  code: IndianLanguageCode;
  name: string;
  nativeName: string;
  script: string;
  flag: string;
  region: string;
}

export const SUPPORTED_INDIAN_LANGUAGES: SupportedLanguage[] = [
  {
    code: 'en',
    name: 'English (India)',
    nativeName: 'English',
    script: 'Latin',
    flag: '🇮🇳',
    region: 'Pan-India / Official Central'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    flag: '🇮🇳',
    region: 'North & Central India'
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    script: 'Devanagari',
    flag: '🇮🇳',
    region: 'Maharashtra & Goa'
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    flag: '🇮🇳',
    region: 'Tamil Nadu & Puducherry'
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telugu',
    flag: '🇮🇳',
    region: 'Andhra Pradesh & Telangana'
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    flag: '🇮🇳',
    region: 'West Bengal & Tripura'
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    script: 'Gujarati',
    flag: '🇮🇳',
    region: 'Gujarat'
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'Kannada',
    flag: '🇮🇳',
    region: 'Karnataka'
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'Malayalam',
    flag: '🇮🇳',
    region: 'Kerala & Lakshadweep'
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    script: 'Gurmukhi',
    flag: '🇮🇳',
    region: 'Punjab & Chandigarh'
  }
];

export const TRANSLATIONS: Record<IndianLanguageCode, Record<string, string>> = {
  en: {
    // Navigation & App Header
    appName: 'Label Lens AI',
    appSubtitle: 'Legal Metrology & Food Safety Compliance Engine',
    sihBadge: 'SIH 2026',
    adminPanel: 'Admin Panel',
    officesAndLabs: 'Offices & Labs',
    callHelpline: 'Helpline Call',
    chatAssistant: 'Legal AI',
    settings: 'Settings',
    profile: 'Profile',
    signIn: 'Sign In',
    language: 'Language',
    selectLanguage: 'Select Language',
    permissions: 'Permissions',

    // Scanner / Input
    scannerTitle: 'Packaged Commodity Compliance Lens',
    scannerSubtitle: 'Live Camera, Image Upload, Voice Dictation & Barcode Lookup',
    tabCamera: 'Live Camera',
    tabUpload: 'Upload Media',
    tabVoice: 'Voice Dictation',
    tabText: 'Text Description',
    takeSnapshot: 'Capture Photo',
    uploadPrompt: 'Drag & drop packaging photo or PDF',
    pdpAreaLabel: 'Principal Display Panel (PDP) Area (sq. cm)',
    barcodeLabel: 'Barcode / EAN-13',
    voicePrompt: 'Dictate product details (MRP, net qty, manufacturer, expiry)...',
    startListening: 'Start Recording',
    stopListening: 'Stop Recording',
    analyzeButton: 'Analyze Product Compliance',
    analyzingButton: 'Evaluating Statutory Rules...',

    // Audit Report & ScoreCard
    auditDocketId: 'Dossier ID',
    complianceScore: 'Statutory Compliance Score',
    scoreSubtitle: 'Grounded strictly in PCR 2011/2026 & FSSAI 2020 Regulations',
    statusCompliant: 'COMPLIANT',
    statusNonCompliant: 'NON-COMPLIANT',
    statusCaution: 'NEEDS REVIEW',
    executiveSummary: 'Executive Regulatory Summary',
    fivePointEvaluation: 'Mandatory 5-Point Declarations (Rule 6)',
    parameter: 'Parameter',
    observedValue: 'Observed on Packaging',
    regulatoryClause: 'Statutory Clause',
    statutoryReasoning: 'Statutory Legal Reasoning',
    correctExplanation: 'Why Compliant',
    violationExplanation: 'Why Non-Compliant',

    // Export & Complaint Actions
    exportDossier: 'Export Compliance Dossier',
    downloadPdf: 'PDF Dossier',
    downloadWord: 'Word (.docx)',
    downloadHtml: 'Interactive App (.html)',
    downloadJson: 'JSON Data',
    downloadTxt: 'Plain Text (.txt)',
    exportToDrive: 'Export to Google Drive',
    shareEmail: 'Share via Email',
    draftComplaint: 'Draft Statutory Complaint',
    filePetition: 'File Legal Petition',
    complaintDocket: 'Statutory Grievance Form',
    authorityTarget: 'Target Authority Desk',
    transmitToFssai: 'Transmit to FSSAI Compliance Desk',
    copyPetition: 'Copy Petition Text',

    // Auth & Profile
    authTitle: 'Label Lens AI Portal Access',
    authSubtitle: 'Google OAuth & Account Registration',
    loginGoogle: 'Continue with Google (Gmail)',
    orEmail: 'Or sign in with verified email',
    fullName: 'Full Legal Name',
    emailAddress: 'Email Address',
    password: 'Password',
    accountRole: 'Designated Role',
    roleConsumer: 'Citizen / Consumer Complainant',
    roleInspector: 'Legal Metrology / Food Safety Inspector',
    roleAdmin: 'Directorate Administrator',
    loginAction: 'Sign In to Account',
    createAccountAction: 'Create New Account',
    alreadyHaveAccount: 'Already have an account? Sign In',
    dontHaveAccount: "Don't have an account? Create one",
    signOut: 'Sign Out',
    saveProfile: 'Save Profile Changes',

    // Settings
    settingsTitle: 'Label Lens AI Engine & Key Vault',
    settingsSubtitle: 'Connect Google Gemini, OpenAI, or Custom LLM API Keys',
    activeProvider: 'Active AI Provider',
    geminiApiKey: 'Google Gemini API Key',
    testKey: 'Test Connectivity',
    saveConfiguration: 'Save Configuration',
    auditoryChimes: 'Auditory Synthetic Chimes',
    testPopup: 'Test Pop-up',
    autoDriveBackup: 'Auto-backup dossiers to Firebase & Google Drive',
    languageSectionTitle: 'Regional Indian Language',

    // Notifications
    fileExported: 'FILE EXPORTED',
    legalPetition: 'LEGAL PETITION',
    auditVerified: 'AUDIT VERIFIED',
    pdpAnalyzing: 'ANALYZING PDP',
    helplineCall: 'HELPLINE CALL',
    firebaseSync: 'FIREBASE SYNC',
    googleDrive: 'GOOGLE DRIVE',
    directorateExcel: 'DIRECTORATE EXCEL',
    accessGranted: 'ACCESS GRANTED',
    aiConnected: 'AI CONNECTED',
    systemNotice: 'SYSTEM NOTICE',

    // Mobile & UI Enhancement
    desktopView: 'Desktop Web',
    mobileAppView: 'Mobile APK',
    deviceFrame: 'Phone Frame',
    fullscreen: 'Edge-to-Edge',
    tabScan: 'Scan',
    tabAudit: 'Audit',
    tabOffices: 'Offices',
    tabHelpline: 'Helpline',
    tabProfile: 'Profile',
    samplePresets: 'Quick Test Presets',
    compliantSample: 'Compliant Atta Pack (100/100)',
    misleadingSample: 'Cold-Pressed Oil (Misleading Claims)',
    importedSample: 'Imported Dark Chocolate (Missing Declarations)',
    underfilledSample: 'Potato Chips (Underfilled Net Qty)',
    penaltyLiability: 'Estimated Penalty Liability',
    violationsOnly: 'Violations Only',
    compliantOnly: 'Compliant Only',
    allFindings: 'All Declarations'
  },
  hi: {
    // Navigation & App Header
    appName: 'लेबल लेन्स एआई',
    appSubtitle: 'विधिक मापविज्ञान एवं खाद्य सुरक्षा अनुपालन इंजन',
    sihBadge: 'एसआईएच 2026',
    adminPanel: 'प्रशासन कक्ष',
    officesAndLabs: 'कार्यालय एवं प्रयोगशालाएं',
    callHelpline: 'हेल्पलाइन कॉल',
    chatAssistant: 'विधिक एआई',
    settings: 'सेटिंग्स',
    profile: 'प्रोफ़ाइल',
    signIn: 'साइन इन',
    language: 'भाषा',
    selectLanguage: 'भाषा चुनें',
    permissions: 'अनुमतियाँ',

    // Scanner / Input
    scannerTitle: 'पैकेज्ड वस्तु अनुपालन लेंस',
    scannerSubtitle: 'लाइव कैमरा, छवि अपलोड, आवाज श्रुतलेख एवं बारकोड खोज',
    tabCamera: 'लाइव कैमरा',
    tabUpload: 'मीडिया अपलोड',
    tabVoice: 'आवाज श्रुतलेख',
    tabText: 'लिखित विवरण',
    takeSnapshot: 'फोटो खींचें',
    uploadPrompt: 'पैकेजिंग फोटो या पीडीएफ यहाँ खींचकर लाएँ',
    pdpAreaLabel: 'मुख्य प्रदर्शन पटल (PDP) क्षेत्रफल (वर्ग सेमी)',
    barcodeLabel: 'बारकोड / EAN-13 संख्या',
    voicePrompt: 'उत्पाद विवरण बोलें (एमआरपी, शुद्ध मात्रा, निर्माता, समाप्ति)...',
    startListening: 'आवाज रिकॉर्डिंग शुरू करें',
    stopListening: 'रिकॉर्डिंग समाप्त करें',
    analyzeButton: 'उत्पाद अनुपालन की जाँच करें',
    analyzingButton: 'वैधानिक नियमों का मूल्यांकन जारी...',

    // Audit Report & ScoreCard
    auditDocketId: 'डोजियर क्रमांक',
    complianceScore: 'वैधानिक अनुपालन प्राप्तांक',
    scoreSubtitle: 'विधिक मापविज्ञान (पीसीआर) नियम 2011/2026 एवं एफएसएसएआई 2020 पर आधारित',
    statusCompliant: 'पूर्ण अनुपालक (COMPLIANT)',
    statusNonCompliant: 'गैर-अनुपालक (NON-COMPLIANT)',
    statusCaution: 'समीक्षा आवश्यक (NEEDS REVIEW)',
    executiveSummary: 'कार्यकारी विनियामक सारांश',
    fivePointEvaluation: 'अनिवार्य 5-बिंदु घोषणाएं (नियम 6)',
    parameter: 'मापदंड',
    observedValue: 'पैकेजिंग पर पाया गया विवरण',
    regulatoryClause: 'वैधानिक धारा / नियम',
    statutoryReasoning: 'वैधानिक कानूनी तर्क',
    correctExplanation: 'अनुपालन का कारण',
    violationExplanation: 'गैर-अनुपालन / उल्लंघन का कारण',

    // Export & Complaint Actions
    exportDossier: 'आधिकारिक ऑडिट डोजियर डाउनलोड करें',
    downloadPdf: 'पीडीएफ डोजियर (.pdf)',
    downloadWord: 'वर्ड दस्तावेज (.docx)',
    downloadHtml: 'इंटरैक्टिव ऐप (.html)',
    downloadJson: 'जेसन डेटा (.json)',
    downloadTxt: 'सादा पाठ (.txt)',
    exportToDrive: 'गूगल ड्राइव में सुरक्षित करें',
    shareEmail: 'ईमेल द्वारा साझा करें',
    draftComplaint: 'वैधानिक शिकायत याचिका तैयार करें',
    filePetition: 'कानूनी याचिका दर्ज करें',
    complaintDocket: 'वैधानिक शिकायत प्रपत्र',
    authorityTarget: 'लक्षित नियामक प्राधिकरण',
    transmitToFssai: 'एफएसएसएआई अनुपालन डेस्क को प्रेषित करें',
    copyPetition: 'याचिका पाठ कॉपी करें',

    // Auth & Profile
    authTitle: 'लेबल लेन्स एआई पोर्टल प्रवेश',
    authSubtitle: 'गूगल प्रमाणीकरण एवं उपयोगकर्ता खाता पंजीकरण',
    loginGoogle: 'गूगल (जीमेल) के साथ आगे बढ़ें',
    orEmail: 'या सत्यापित ईमेल द्वारा साइन इन करें',
    fullName: 'पूर्ण विधिक नाम',
    emailAddress: 'ईमेल पता',
    password: 'पासवर्ड',
    accountRole: 'निर्धारित पद / भूमिका',
    roleConsumer: 'नागरिक / उपभोक्ता शिकायतकर्ता',
    roleInspector: 'विधिक मापविज्ञान / खाद्य सुरक्षा निरीक्षक',
    roleAdmin: 'निदेशालय प्रशासक',
    loginAction: 'खाते में साइन इन करें',
    createAccountAction: 'नया खाता बनाएं',
    alreadyHaveAccount: 'पहले से खाता है? साइन इन करें',
    dontHaveAccount: 'खाता नहीं है? नया बनाएं',
    signOut: 'लॉग आउट',
    saveProfile: 'प्रोफ़ाइल सुरक्षित करें',

    // Settings
    settingsTitle: 'लेबल लेन्स एआई इंजन एवं कुंजी वॉल्ट',
    settingsSubtitle: 'गूगल जेमिनी, ओपनएआई अथवा कस्टम एलएलएम कनेक्ट करें',
    activeProvider: 'सक्रिय एआई प्रदाता',
    geminiApiKey: 'गूगल जेमिनी एपीआई कुंजी',
    testKey: 'कनेक्टिविटी परीक्षण',
    saveConfiguration: 'कॉन्फ़िगरेशन सहेजें',
    auditoryChimes: 'श्रव्य सिंथेटिक अलार्म चाइम',
    testPopup: 'पॉप-अप परीक्षण',
    autoDriveBackup: 'फायरबेस एवं गूगल ड्राइव में स्वतः बैकअप',
    languageSectionTitle: 'क्षेत्रीय भारतीय भाषा चयन',

    // Notifications
    fileExported: 'दस्तावेज निर्यात',
    legalPetition: 'वैधानिक याचिका',
    auditVerified: 'ऑडिट प्रमाणित',
    pdpAnalyzing: 'पीडीपी विश्लेषण',
    helplineCall: 'हेल्पलाइन कॉल',
    firebaseSync: 'फायरबेस सिंक',
    googleDrive: 'गूगल ड्राइव',
    directorateExcel: 'निदेशालय एक्सेल',
    accessGranted: 'अनुमति स्वीकृत',
    aiConnected: 'एआई कनेक्टेड',
    systemNotice: 'सिस्टम सूचना',

    // Mobile & UI Enhancement
    desktopView: 'डेस्कटॉप वेब',
    mobileAppView: 'मोबाइल एपीके',
    deviceFrame: 'फोन फ्रेम',
    fullscreen: 'फुलस्क्रीन',
    tabScan: 'स्कैन',
    tabAudit: 'ऑडिट',
    tabOffices: 'कार्यालय',
    tabHelpline: 'हेल्पलाइन',
    tabProfile: 'प्रोफ़ाइल',
    samplePresets: 'त्वरित परीक्षण नमूने',
    compliantSample: 'मानक आटा पैक (100/100)',
    misleadingSample: 'भ्रामक तेल पैक (अवैध दावे)',
    importedSample: 'आयातित चॉकलेट (अधूरी घोषणाएं)',
    underfilledSample: 'चिप्स पैकेट (कम शुद्ध मात्रा)',
    penaltyLiability: 'अनुमानित वैधानिक जुर्माना',
    violationsOnly: 'केवल उल्लंघन',
    compliantOnly: 'केवल अनुपालित',
    allFindings: 'सभी घोषणाएं'
  },
  mr: {
    // Marathi (Maharashtra)
    appName: 'लेबल लेन्स एआय',
    appSubtitle: 'कायदेशीर मापशास्त्र आणि अन्न सुरक्षा अनुपालन इंजिन',
    sihBadge: 'एसआयएच 2026',
    adminPanel: 'प्रशासन कक्ष',
    officesAndLabs: 'कार्यालये आणि प्रयोगशाळा',
    callHelpline: 'हेल्पलाइन कॉल',
    chatAssistant: 'कायदेशीर एआय',
    settings: 'सेटिंग्ज',
    profile: 'प्रोफाइल',
    signIn: 'साइन इन',
    language: 'भाषा',
    selectLanguage: 'भाषा निवडा',
    permissions: 'परवानग्या',

    // Scanner / Input
    scannerTitle: 'पॅकेज केलेल्या वस्तू अनुपालन लेन्स',
    scannerSubtitle: 'थेट कॅमेरा, प्रतिमा अपलोड, व्हॉइस डिक्टेशन आणि बारकोड शोध',
    tabCamera: 'थेट कॅमेरा',
    tabUpload: 'मीडिया अपलोड',
    tabVoice: 'आवाज डिक्टेशन',
    tabText: 'मजकूर वर्णन',
    takeSnapshot: 'फोटो घ्या',
    uploadPrompt: 'पॅकेजिंग फोटो किंवा पीडीएफ येथे टाका',
    pdpAreaLabel: 'मुख्य प्रदर्शन पॅनेल (PDP) क्षेत्रफळ (चौ. सेमी)',
    barcodeLabel: 'बारकोड / EAN-13 क्रमांक',
    voicePrompt: 'उत्पादनाचे तपशील बोला (एमआरपी, निव्वळ प्रमाण, उत्पादक, समाप्ती)...',
    startListening: 'आवाज रेकॉर्डिंग सुरू करा',
    stopListening: 'रेकॉर्डिंग थांबवा',
    analyzeButton: 'उत्पादन अनुपालनाची तपासणी करा',
    analyzingButton: 'कायदेशीर नियमांचे मूल्यांकन सुरू आहे...',

    // Audit Report & ScoreCard
    auditDocketId: 'डॉक्युमेंट आयडी',
    complianceScore: 'कायदेशीर अनुपालन गुण',
    scoreSubtitle: 'पीसीआर नियम 2011/2026 आणि एफएसएसएआय 2020 वर काटेकोरपणे आधारित',
    statusCompliant: 'पूर्ण अनुपालक (COMPLIANT)',
    statusNonCompliant: 'गैर-अनुपालक (NON-COMPLIANT)',
    statusCaution: 'पुनरावलोकन आवश्यक (NEEDS REVIEW)',
    executiveSummary: 'कार्यकारी नियामक सारांश',
    fivePointEvaluation: 'अनिवार्य 5-मुद्द्यांची घोषणा (नियम 6)',
    parameter: 'घटक',
    observedValue: 'पॅकेजिंगवर आढळलेले मूल्य',
    regulatoryClause: 'कायदेशीर कलम / नियम',
    statutoryReasoning: 'कायदेशीर कारणमीमांसा',
    correctExplanation: 'अनुपालनाचे कारण',
    violationExplanation: 'उल्लঙ্ঘनाचे कारण',

    // Export & Complaint Actions
    exportDossier: 'अधिकृत ऑडिट डॉसियर डाउनलोड करा',
    downloadPdf: 'पीडीएफ प्रत (.pdf)',
    downloadWord: 'वर्ड डॉक्युमेंट (.docx)',
    downloadHtml: 'इंटरॅक्टिव्ह ॲप (.html)',
    downloadJson: 'जेसन डेटा (.json)',
    downloadTxt: 'साधा मजकूर (.txt)',
    exportToDrive: 'गुगल ड्राईव्हवर सेव्ह करा',
    shareEmail: 'ईमेलद्वारे शेअर करा',
    draftComplaint: 'वैधानिक तक्रार याचिका तयार करा',
    filePetition: 'कायदेशीर याचिका दाखल करा',
    complaintDocket: 'वैधानिक तक्रार अर्ज',
    authorityTarget: 'लक्षित नियामक प्राधिकरण',
    transmitToFssai: 'एफएसएसएआय अनुपालन कक्षाला पाठवा',
    copyPetition: 'याचिका मजकूर कॉपी करा',

    // Auth & Profile
    authTitle: 'लेबल लेन्स एआय पोर्टल प्रवेश',
    authSubtitle: 'गुगल प्रमाणीकरण आणि खाते नोंदणी',
    loginGoogle: 'गुगल (जीमेल) द्वारे सुरू ठेवा',
    orEmail: 'किंवा ईमेलद्वारे साइन इन करा',
    fullName: 'पूर्ण कायदेशीर नाव',
    emailAddress: 'ईमेल पत्ता',
    password: 'पासवर्ड',
    accountRole: 'नियुक्त भूमिका',
    roleConsumer: 'नागरिक / ग्राहक तक्रारदार',
    roleInspector: 'वैधानिक मापशास्त्र / अन्न सुरक्षा निरीक्षक',
    roleAdmin: 'संचालनालय प्रशासक',
    loginAction: 'साइन इन करा',
    createAccountAction: 'नवीन खाते तयार करा',
    alreadyHaveAccount: 'आधीच खाते आहे? साइन इन करा',
    dontHaveAccount: 'खाते नाही? नवीन तयार करा',
    signOut: 'बाहेर पडा',
    saveProfile: 'प्रोफाइल सेव्ह करा',

    // Settings
    settingsTitle: 'लेबल लेन्स एआय इंजिन आणि की व्हॉल्ट',
    settingsSubtitle: 'गुगल जेमिनी, ओपनएआय किंवा सानुकूल एलएलएम कनेक्ट करा',
    activeProvider: 'सक्रिय एआय प्रदाता',
    geminiApiKey: 'गुगल जेमिनी एपीआय की',
    testKey: 'कनेक्टिव्हिटी चाचणी',
    saveConfiguration: 'कॉन्फिगरेशन सेव्ह करा',
    auditoryChimes: 'ध्वनी अलर्ट चाइम',
    testPopup: 'पॉप-अप चाचणी',
    autoDriveBackup: 'फायरबेस आणि गुगल ड्राईव्हवर ऑटो बॅकअप',
    languageSectionTitle: 'प्रादेशिक भारतीय भाषा निवड',

    // Notifications
    fileExported: 'फाइल निर्यात',
    legalPetition: 'कायदेशीर याचिका',
    auditVerified: 'ऑडिट प्रमाणित',
    pdpAnalyzing: 'पीडीपी विश्लेषण',
    helplineCall: 'हेल्पलाइन कॉल',
    firebaseSync: 'फायरबेस सिंक',
    googleDrive: 'गुगल ड्राईव्ह',
    directorateExcel: 'संचालनालय एक्सेल',
    accessGranted: 'परवानगी मंजूर',
    aiConnected: 'एआय कनेक्ट झाले',
    systemNotice: 'सिस्टम सूचना'
  },
  ta: {
    // Tamil (Tamil Nadu)
    appName: 'லேபிள் லென்ஸ் ஏஐ',
    appSubtitle: 'சட்ட அளவியல் & உணவுப் பாதுகாப்பு இணக்கத் தளம்',
    sihBadge: 'எஸ்ஐஹெச் 2026',
    adminPanel: 'நிர்வாக குழு',
    officesAndLabs: 'அலுவலகங்கள் & ஆய்வகங்கள்',
    callHelpline: 'உதவி எண் அழைப்பு',
    chatAssistant: 'சட்ட ஏஐ',
    settings: 'அமைப்புகள்',
    profile: 'சுயவிவரம்',
    signIn: 'உள்நுழைக',
    language: 'மொழி',
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    permissions: 'அனுமதிகள்',

    // Scanner / Input
    scannerTitle: 'பொதி செய்யப்பட்ட பொருட்கள் இணக்க லென்ஸ்',
    scannerSubtitle: 'நேரலை கேமரா, படம் பதிவேற்றம், குரல் தட்டச்சு & பார்கோடு தேடல்',
    tabCamera: 'நேரலை கேமரா',
    tabUpload: 'ஊடகம் பதிவேற்று',
    tabVoice: 'குரல் தட்டச்சு',
    tabText: 'எழுத்து விவரம்',
    takeSnapshot: 'படம் எடுங்கள்',
    uploadPrompt: 'பேக்கேஜிங் படம் அல்லது PDF-ஐ இங்கே இழுத்து விடவும்',
    pdpAreaLabel: 'முதன்மை காட்சி குழு (PDP) பரப்பளவு (ச.செ.மீ)',
    barcodeLabel: 'பார்கோடு / EAN-13 எண்',
    voicePrompt: 'தயாரிப்பு விவரங்களைப் பேசுங்கள் (MRP, நிகர அளவு, உற்பத்தியாளர், காலாவதி)...',
    startListening: 'குரல் பதிவைத் தொடங்குங்கள்',
    stopListening: 'பதிவை நிறுத்துங்கள்',
    analyzeButton: 'தயாரிப்பு இணக்கத்தை ஆய்வு செய்',
    analyzingButton: 'சட்ட விதிகள் சரிபார்க்கப்படுகின்றன...',

    // Audit Report & ScoreCard
    auditDocketId: 'ஆவண எண்',
    complianceScore: 'சட்டப்பூர்வ இணக்க மதிப்பெண்',
    scoreSubtitle: 'PCR விதிகள் 2011/2026 & FSSAI 2020 அடிப்படையில் உறுதிப்படுத்தப்பட்டது',
    statusCompliant: 'விதிகளுக்கு உட்பட்டது (COMPLIANT)',
    statusNonCompliant: 'விதிமீறல் (NON-COMPLIANT)',
    statusCaution: 'மறுஆய்வு தேவை (NEEDS REVIEW)',
    executiveSummary: 'நிர்வாக ஒழுங்குமுறை சுருக்கம்',
    fivePointEvaluation: 'கட்டாய 5-அம்ச அறிவிப்புகள் (விதி 6)',
    parameter: 'அளவுரு',
    observedValue: 'பேக்கேஜிங்கில் காணப்பட்ட விவரம்',
    regulatoryClause: 'ஒழுங்குமுறை பிரிவு / விதி',
    statutoryReasoning: 'சட்டப்பூர்வ நியாயப்பாடு',
    correctExplanation: 'இணக்கத்திற்கான காரணம்',
    violationExplanation: 'விதிமீறலுக்கான காரணம்',

    // Export & Complaint Actions
    exportDossier: 'அதிகாரப்பூர்வ தணிக்கை ஆவணத்தை பதிவிறக்கு',
    downloadPdf: 'PDF ஆவணம் (.pdf)',
    downloadWord: 'Word ஆவணம் (.docx)',
    downloadHtml: 'ஊடாடும் ஆப் (.html)',
    downloadJson: 'JSON தரவு (.json)',
    downloadTxt: 'எளிய உரை (.txt)',
    exportToDrive: 'Google Drive-ல் சேமிக்கவும்',
    shareEmail: 'மின்னஞ்சல் மூலம் பகிர்',
    draftComplaint: 'சட்டப்பூர்வ புகார் மனுவைத் தயார் செய்',
    filePetition: 'சட்ட மனுவைத் தாக்கல் செய்',
    complaintDocket: 'சட்டப்பூர்வ புகார் படிவம்',
    authorityTarget: 'இலக்கு ஒழுங்குமுறை ஆணையம்',
    transmitToFssai: 'FSSAI இணக்கப் பிரிவுக்கு அனுப்பவும்',
    copyPetition: 'மனு உரையை நகலெடு',

    // Auth & Profile
    authTitle: 'லேபிள் லென்ஸ் ஏஐ போர்ட்டல் அணுகல்',
    authSubtitle: 'Google அங்கீகாரம் & கணக்கு பதிவு',
    loginGoogle: 'Google (Gmail) மூலம் தொடரவும்',
    orEmail: 'அல்லது மின்னஞ்சல் மூலம் உள்நுழைக',
    fullName: 'முழு சட்டப்பூர்வ பெயர்',
    emailAddress: 'மின்னஞ்சல் முகவரி',
    password: 'கடவுச்சொல்',
    accountRole: 'நியமிக்கப்பட்ட பங்கு',
    roleConsumer: 'குடிமகன் / நுகர்வோர் புகார்தாரர்',
    roleInspector: 'சட்ட அளவியல் / உணவுப் பாதுகாப்பு ஆய்வாளர்',
    roleAdmin: 'இயக்குநரக நிர்வாகி',
    loginAction: 'உள்நுழைக',
    createAccountAction: 'புதிய கணக்கை உருவாக்கு',
    alreadyHaveAccount: 'ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக',
    dontHaveAccount: 'கணக்கு இல்லையா? புதியதை உருவாக்குங்கள்',
    signOut: 'வெளியேறு',
    saveProfile: 'சுயவிவரத்தைச் சேமி',

    // Settings
    settingsTitle: 'லேபிள் லென்ஸ் ஏஐ என்ஜின் & சாவி பெட்டகம்',
    settingsSubtitle: 'Google Gemini, OpenAI அல்லது விருப்ப LLM இணைக்கவும்',
    activeProvider: 'செயலில் உள்ள AI வழங்குநர்',
    geminiApiKey: 'Google Gemini API சாவி',
    testKey: 'இணைப்பைச் சோதிக்கவும்',
    saveConfiguration: 'அமைப்புகளைச் சேமி',
    auditoryChimes: 'ஒலி எச்சரிக்கை மணிகள்',
    testPopup: 'பாப்-அப் சோதனை',
    autoDriveBackup: 'Firebase மற்றும் Google Drive-ல் தானியங்கி காப்பு',
    languageSectionTitle: 'பிராந்திய இந்திய மொழித் தேர்வு',

    // Notifications
    fileExported: 'கோப்பு ஏற்றுமதி',
    legalPetition: 'சட்ட மனு',
    auditVerified: 'தணிக்கை சரிபார்க்கப்பட்டது',
    pdpAnalyzing: 'PDP பகுப்பாய்வு',
    helplineCall: 'உதவி எண் அழைப்பு',
    firebaseSync: 'Firebase ஒத்திசைவு',
    googleDrive: 'Google Drive',
    directorateExcel: 'இயக்குநரக Excel',
    accessGranted: 'அனுமதி வழங்கப்பட்டது',
    aiConnected: 'AI இணைக்கப்பட்டது',
    systemNotice: 'கணினி அறிவிப்பு'
  },
  te: {
    // Telugu (Andhra Pradesh & Telangana)
    appName: 'లేబుల్ లెన్స్ AI',
    appSubtitle: 'లీగల్ మెట్రాలజీ & ఆహార భద్రతా నిబంధనల ఇంజిన్',
    sihBadge: 'SIH 2026',
    adminPanel: 'అడ్మిన్ ప్యానెల్',
    officesAndLabs: 'కార్యాలయాలు & ల్యాబ్‌లు',
    callHelpline: 'హెల్ప్‌లైన్ కాల్',
    chatAssistant: 'చట్టపరమైన AI',
    settings: 'సెట్టింగ్‌లు',
    profile: 'ప్రొఫైల్',
    signIn: 'సైన్ ఇన్',
    language: 'భాష',
    selectLanguage: 'భాషను ఎంచుకోండి',
    permissions: 'అనుమతులు',

    // Scanner / Input
    scannerTitle: 'ప్యాక్ చేసిన వస్తువుల నిబంధనల లెన్స్',
    scannerSubtitle: 'లైవ్ కెమెరా, ఇమేజ్ అప్‌లోడ్, వాయిస్ డిక్టేషన్ & బార్‌కోడ్ శోధన',
    tabCamera: 'లైవ్ కెమెరా',
    tabUpload: 'మీడియా అప్‌లోడ్',
    tabVoice: 'వాయిస్ డిక్టేషన్',
    tabText: 'టెక్స్ట్ వివరణ',
    takeSnapshot: 'ఫోటో తీయండి',
    uploadPrompt: 'ప్యాకేజింగ్ ఫోటో లేదా PDF ఇక్కడ డ్రాగ్ చేయండి',
    pdpAreaLabel: 'ప్రధాన ప్రదర్శన ప్యానెల్ (PDP) వైశాల్యం (చ.సెం.మీ)',
    barcodeLabel: 'బార్‌కోడ్ / EAN-13 సంఖ్య',
    voicePrompt: 'ఉత్పత్తి వివరాలను మాట్లాడండి (MRP, నికర పరిమాణం, తయారీదారు, గడువు)...',
    startListening: 'రికార్డింగ్ ప్రారంభించండి',
    stopListening: 'రికార్డింగ్ ఆపండి',
    analyzeButton: 'ఉత్పత్తి నిబంధనల పరిశీలన',
    analyzingButton: 'చట్టపరమైన నిబంధనల మూల్యాంకనం...',

    // Audit Report & ScoreCard
    auditDocketId: 'డాక్యుమెంట్ ఐడీ',
    complianceScore: 'చట్టపరమైన అనుకూలత స్కోర్',
    scoreSubtitle: 'PCR నిబంధనలు 2011/2026 మరియు FSSAI 2020 ఆధారంగా',
    statusCompliant: 'నిబంధనలకు అనుగుణంగా ఉంది (COMPLIANT)',
    statusNonCompliant: 'ఉల్లంఘన జరిగింది (NON-COMPLIANT)',
    statusCaution: 'సమీక్ష అవసరం (NEEDS REVIEW)',
    executiveSummary: 'ఎగ్జిక్యూటివ్ నియంత్రణ సారాంశం',
    fivePointEvaluation: 'తప్పనిసరి 5-అంశాల ప్రకటనలు (నిబంధన 6)',
    parameter: 'పరామితి',
    observedValue: 'ప్యాకేజింగ్‌పై గమనించిన విలువ',
    regulatoryClause: 'చట్టపరమైన నిబంధన / క్లాజ్',
    statutoryReasoning: 'చట్టబద్ధమైన సమర్థన',
    correctExplanation: 'నిబంధనలకు అనుగుణంగా ఉండటానికి కారణం',
    violationExplanation: 'ఉల్లంఘనకు కారణం',

    // Export & Complaint Actions
    exportDossier: 'అధికారిక ఆడిట్ డాసియర్‌ను డౌన్‌లోడ్ చేయండి',
    downloadPdf: 'PDF ఫైల్ (.pdf)',
    downloadWord: 'Word డాక్యుమెంట్ (.docx)',
    downloadHtml: 'ఇంటరాక్టివ్ యాప్ (.html)',
    downloadJson: 'JSON డేటా (.json)',
    downloadTxt: 'సాదా టెక్స్ట్ (.txt)',
    exportToDrive: 'Google Drive లో భద్రపరచండి',
    shareEmail: 'ఇమెయిల్ ద్వారా షేర్ చేయండి',
    draftComplaint: 'చట్టపరమైన ఫిర్యాదు పిటిషన్ డ్రాఫ్ట్ చేయండి',
    filePetition: 'చట్టపరమైన పిటిషన్ దాఖలు చేయండి',
    complaintDocket: 'చట్టబద్ధమైన ఫిర్యాదు ఫారం',
    authorityTarget: 'లక్ష్య నియంత్రణ అధికారం',
    transmitToFssai: 'FSSAI కంప్లైయన్స్ డెస్క్‌కు పంపండి',
    copyPetition: 'పిటిషన్ టెక్స్ట్ కాపీ చేయండి',

    // Auth & Profile
    authTitle: 'లేబుల్ లెన్స్ AI పోర్టల్ యాక్సెస్',
    authSubtitle: 'Google ప్రామాణీకరణ & ఖాతా నమోదు',
    loginGoogle: 'Google (Gmail) తో కొనసాగించండి',
    orEmail: 'లేదా ధృవీకరించిన ఇమెయిల్‌తో సైన్ ఇన్ చేయండి',
    fullName: 'పూర్తి చట్టపరమైన పేరు',
    emailAddress: 'ఇమెయిల్ చిరునామా',
    password: 'పాస్‌వర్డ్',
    accountRole: 'నిర్దేశిత పాత్ర',
    roleConsumer: 'పౌరుడు / వినియోగదారు ఫిర్యాదుదారు',
    roleInspector: 'లీగల్ మెట్రాలజీ / ఫుడ్ సేఫ్టీ ఇన్‌స్పెక్టర్',
    roleAdmin: 'డైరెక్టరేట్ అడ్మినిస్ట్రేటర్',
    loginAction: 'సైన్ ఇన్ చేయండి',
    createAccountAction: 'కొత్త ఖాతాను సృష్టించండి',
    alreadyHaveAccount: 'ఇప్పటికే ఖాతా ఉందా? సైన్ ఇన్ చేయండి',
    dontHaveAccount: 'ఖాతా లేదా? కొత్తది సృష్టించండి',
    signOut: 'లాగ్ అవుట్',
    saveProfile: 'ప్రొఫైల్‌ను సేవ్ చేయండి',

    // Settings
    settingsTitle: 'లేబుల్ లెన్స్ AI ఇంజిన్ & కీ వాల్ట్',
    settingsSubtitle: 'Google Gemini, OpenAI లేదా కస్టమ్ LLM కనెక్ట్ చేయండి',
    activeProvider: 'యాక్టివ్ AI ప్రొవైడర్',
    geminiApiKey: 'Google Gemini API కీ',
    testKey: 'కనెక్టివిటీని పరీక్షించండి',
    saveConfiguration: 'కాన్ఫిగరేషన్‌ను సేవ్ చేయండి',
    auditoryChimes: 'ఆడియో అలర్ట్ బెల్స్',
    testPopup: 'పాప్-అప్ పరీక్ష',
    autoDriveBackup: 'Firebase & Google Drive కు ఆటో బ్యాకప్',
    languageSectionTitle: 'ప్రాంతీయ భారతీయ భాష ఎంపిక',

    // Notifications
    fileExported: 'ఫైల్ ఎగుమతి',
    legalPetition: 'చట్టపరమైన పిటిషన్',
    auditVerified: 'ఆడిట్ ధృవీకరించబడింది',
    pdpAnalyzing: 'PDP విశ్లేషణ',
    helplineCall: 'హెల్ప్‌లైన్ కాల్',
    firebaseSync: 'Firebase సింక్',
    googleDrive: 'Google Drive',
    directorateExcel: 'డైరెక్టరేట్ Excel',
    accessGranted: 'అనుమతి లభించింది',
    aiConnected: 'AI కనెక్ట్ అయింది',
    systemNotice: 'సిస్టమ్ నోటీసు'
  },
  bn: {
    // Bengali (West Bengal & Tripura)
    appName: 'লেবেল লেন্স এআই',
    appSubtitle: 'আইনি পরিমাপবিদ্যা ও খাদ্য সুরক্ষা সম্মতি ইঞ্জিন',
    sihBadge: 'SIH 2026',
    adminPanel: 'প্রশাসন প্যানেল',
    officesAndLabs: 'দপ্তর ও গবেষণাগার',
    callHelpline: 'হেল্পলাইন কল',
    chatAssistant: 'আইনি এআই',
    settings: 'সেটিংস',
    profile: 'প্রোফাইল',
    signIn: 'সাইন ইন',
    language: 'ভাষা',
    selectLanguage: 'ভাষা নির্বাচন করুন',
    permissions: 'অনুমতিসমূহ',

    // Scanner / Input
    scannerTitle: 'প্যাকেজড পণ্য সম্মতি লেন্স',
    scannerSubtitle: 'লাইভ ক্যামেরা, ছবি আপলোড, ভয়েস ডিকটেশন ও বারকোড অনুসন্ধান',
    tabCamera: 'লাইভ ক্যামেরা',
    tabUpload: 'মিডিয়া আপলোড',
    tabVoice: 'ভয়েস ডিকটেশন',
    tabText: 'টেক্সট বিবরণ',
    takeSnapshot: 'ছবি তুলুন',
    uploadPrompt: 'প্যাকেজিং ছবি বা পিডিএফ এখানে ড্র্যাগ করুন',
    pdpAreaLabel: 'প্রধান প্রদর্শন প্যানেল (PDP) ক্ষেত্রফল (বর্গ সেমি)',
    barcodeLabel: 'বারকোড / EAN-13 নম্বর',
    voicePrompt: 'পণ্যের বিবরণ বলুন (এমআরপি, নেট পরিমাণ, প্রস্তুতকারক, মেয়াদ)...',
    startListening: 'ভয়েস রেকর্ডিং শুরু করুন',
    stopListening: 'রেকর্ডিং বন্ধ করুন',
    analyzeButton: 'পণ্য সম্মতি পরীক্ষা করুন',
    analyzingButton: 'আইনি নিয়ম মূল্যায়ন করা হচ্ছে...',

    // Audit Report & ScoreCard
    auditDocketId: 'ডোসিয়ার আইডি',
    complianceScore: 'আইনি সম্মতি স্কোর',
    scoreSubtitle: 'PCR বিধি ২০১১/২০২৬ এবং FSSAI ২০২০ নিয়মের ওপর প্রতিষ্ঠিত',
    statusCompliant: 'নিয়মসঙ্গত (COMPLIANT)',
    statusNonCompliant: 'নিয়মবহির্ভূত (NON-COMPLIANT)',
    statusCaution: 'পর্যালোচনা প্রয়োজন (NEEDS REVIEW)',
    executiveSummary: 'কার্যনির্বাহী নিয়ন্ত্রক সারাংশ',
    fivePointEvaluation: 'বাধ্যতামূলক ৫-দফা ঘোষণা (বিধি ৬)',
    parameter: 'প্যারামিটার',
    observedValue: 'প্যাকেজিংয়ে প্রাপ্ত মান',
    regulatoryClause: 'বিধিবদ্ধ ধারা / নিয়ম',
    statutoryReasoning: 'আইনি যুক্তি',
    correctExplanation: 'সম্মতির কারণ',
    violationExplanation: 'লঙ্ঘনের কারণ',

    // Export & Complaint Actions
    exportDossier: 'অফিসিয়াল অডিট ডোসিয়ার ডাউনলোড করুন',
    downloadPdf: 'পিডিএফ ফাইল (.pdf)',
    downloadWord: 'ওয়ার্ড ফাইল (.docx)',
    downloadHtml: 'ইন্টারেক্টিভ অ্যাপ (.html)',
    downloadJson: 'জেসন ডেটা (.json)',
    downloadTxt: 'সাধারণ পাঠ্য (.txt)',
    exportToDrive: 'গুগল ড্রাইভে সংরক্ষণ করুন',
    shareEmail: 'ইমেলের মাধ্যমে শেয়ার করুন',
    draftComplaint: 'আইনি অভিযোগের খসড়া তৈরি করুন',
    filePetition: 'আইনি আবেদন জমা দিন',
    complaintDocket: 'বিধিবদ্ধ অভিযোগ পত্র',
    authorityTarget: 'উদ্দিষ্ট কর্তৃপক্ষ',
    transmitToFssai: 'FSSAI সম্মতি ডেস্কে পাঠান',
    copyPetition: 'আবেদনের পাঠ্য অনুলিপি করুন',

    // Auth & Profile
    authTitle: 'লেবেল লেন্স এআই পোর্টাল অ্যাক্সেস',
    authSubtitle: 'গুগল প্রমাণীকরণ ও অ্যাকাউন্ট নিবন্ধন',
    loginGoogle: 'গুগল (জিমেইল) দিয়ে এগিয়ে যান',
    orEmail: 'অথবা যাচাইকৃত ইমেল দিয়ে সাইন ইন করুন',
    fullName: 'পূর্ণ আইনি নাম',
    emailAddress: 'ইমেল ঠিকানা',
    password: 'পাসওয়ার্ড',
    accountRole: 'নির্ধারিত ভূমিকা',
    roleConsumer: 'নাগরিক / ভোক্তা অভিযোগকারী',
    roleInspector: 'আইনি পরিমাপবিদ্যা / খাদ্য সুরক্ষা পরিদর্শক',
    roleAdmin: 'অধিদপ্তর প্রশাসক',
    loginAction: 'সাইন ইন করুন',
    createAccountAction: 'নতুন অ্যাকাউন্ট তৈরি করুন',
    alreadyHaveAccount: 'ইতিমধ্যে অ্যাকাউন্ট আছে? সাইন ইন করুন',
    dontHaveAccount: 'অ্যাকাউন্ট নেই? নতুন তৈরি করুন',
    signOut: 'লগ আউট',
    saveProfile: 'প্রোফাইল সংরক্ষণ করুন',

    // Settings
    settingsTitle: 'লেবেল লেন্স এআই ইঞ্জিন ও কি ভল্ট',
    settingsSubtitle: 'গুগল জেমিনি, ওপেনএআই বা কাস্টম এলএলএম সংযুক্ত করুন',
    activeProvider: 'সক্রিয় এআই প্রদানকারী',
    geminiApiKey: 'গুগল জেমিনি এপিআই কি',
    testKey: 'সংযোগ পরীক্ষা করুন',
    saveConfiguration: 'কনফিগারেশন সংরক্ষণ করুন',
    auditoryChimes: 'শ্রবণযোগ্য সতর্কবার্তা চাইম',
    testPopup: 'পপ-আপ পরীক্ষা',
    autoDriveBackup: 'ফায়ারবেস ও গুগল ড্রাইভে স্বয়ংক্রিয় ব্যাকআপ',
    languageSectionTitle: 'আঞ্চলিক ভারতীয় ভাষা নির্বাচন',

    // Notifications
    fileExported: 'ফাইল রপ্তানি',
    legalPetition: 'আইনি আবেদন',
    auditVerified: 'অডিট যাচাইকৃত',
    pdpAnalyzing: 'PDP বিশ্লেষণ',
    helplineCall: 'হেল্পলাইন কল',
    firebaseSync: 'ফায়ারবেস সিঙ্ক',
    googleDrive: 'গুগল ড্রাইভ',
    directorateExcel: 'অধিদপ্তর এক্সেল',
    accessGranted: 'অনুমতি প্রদান করা হয়েছে',
    aiConnected: 'এআই সংযুক্ত হয়েছে',
    systemNotice: 'সিস্টেম বিজ্ঞপ্তি'
  },
  gu: {
    // Gujarati (Gujarat)
    appName: 'લેબલ લેન્સ AI',
    appSubtitle: 'કાયદેસર માપવિજ્ઞાન અને ખાદ્ય સુરક્ષા પાલન એન્જિન',
    sihBadge: 'SIH 2026',
    adminPanel: 'વહીવટી પેનલ',
    officesAndLabs: 'કચેરીઓ અને પ્રયોગશાળાઓ',
    callHelpline: 'હેલ્પલાઇન કૉલ',
    chatAssistant: 'કાનૂની AI',
    settings: 'સેટિંગ્સ',
    profile: 'પ્રોફાઇલ',
    signIn: 'સાઇન ઇન',
    language: 'ભાષા',
    selectLanguage: 'ભાષા પસંદ કરો',
    permissions: 'પરવાનગીઓ',

    // Scanner / Input
    scannerTitle: 'પેકેજ્ડ કોમોડિટી પાલન લેન્સ',
    scannerSubtitle: 'લાઈવ કેમેરા, ઈમેજ અપલોડ, વૉઇસ ડિક્ટેશન અને બારકોડ શોધ',
    tabCamera: 'લાઈવ કેમેરા',
    tabUpload: 'મીડિયા અપલોડ',
    tabVoice: 'વૉઇસ ડિક્ટેશન',
    tabText: 'ટેક્સ્ટ વર્ણન',
    takeSnapshot: 'ફોટો લો',
    uploadPrompt: 'પેકેજિંગ ફોટો અથવા PDF અહીં ખેંચો',
    pdpAreaLabel: 'મુખ્ય ડિસ્પ્લે પેનલ (PDP) ક્ષેત્રફળ (ચોરસ સેમી)',
    barcodeLabel: 'બારકોડ / EAN-13 નંબર',
    voicePrompt: 'ઉત્પાદનની વિગતો બોલો (MRP, ચોખ્ખો જથ્થો, ઉત્પાદક, સમાપ્તિ)...',
    startListening: 'વૉઇસ રેકોર્ડિંગ શરૂ કરો',
    stopListening: 'રેકોર્ડિંગ બંધ કરો',
    analyzeButton: 'ઉત્પાદન પાલન તપાસો',
    analyzingButton: 'કાનૂની નિયમોનું મૂલ્યાંકન ચાલુ છે...',

    // Audit Report & ScoreCard
    auditDocketId: 'ડોઝિયર આઈડી',
    complianceScore: 'કાનૂની પાલન સ્કોર',
    scoreSubtitle: 'PCR નિયમો 2011/2026 અને FSSAI 2020 પર આધારિત',
    statusCompliant: 'સંપૂર્ણ પાલન (COMPLIANT)',
    statusNonCompliant: 'બિન-પાલન (NON-COMPLIANT)',
    statusCaution: 'સમીક્ષા જરૂરી (NEEDS REVIEW)',
    executiveSummary: 'નિયમનકારી સારાંશ',
    fivePointEvaluation: 'ફરજિયાત 5-મુદ્દાની ઘોષણાઓ (નિયમ 6)',
    parameter: 'પરિમાણ',
    observedValue: 'પેકેજિંગ પર જોવા મળેલી વિગત',
    regulatoryClause: 'કાયદાકીય કલમ / નિયમ',
    statutoryReasoning: 'કાનૂની તર્ક',
    correctExplanation: 'પાલનનું કારણ',
    violationExplanation: 'ઉલ્લંઘનનું કારણ',

    // Export & Complaint Actions
    exportDossier: 'સત્તાવાર ઓડિટ ડોઝિયર ડાઉનલોડ કરો',
    downloadPdf: 'PDF ફાઇલ (.pdf)',
    downloadWord: 'Word ફાઇલ (.docx)',
    downloadHtml: 'ઇન્ટરેક્ટિવ એપ્લિકેશન (.html)',
    downloadJson: 'JSON ડેટા (.json)',
    downloadTxt: 'સાદો લખાણ (.txt)',
    exportToDrive: 'Google Drive માં સાચવો',
    shareEmail: 'ઇમેઇલ દ્વારા શેર કરો',
    draftComplaint: 'કાનૂની ફરિયાદ અરજી તૈયાર કરો',
    filePetition: 'કાનૂની અરજી દાખલ કરો',
    complaintDocket: 'કાનૂની ફરિયાદ પત્રક',
    authorityTarget: 'લક્ષ્ય સત્તામંડળ',
    transmitToFssai: 'FSSAI પાલન ડેસ્કને મોકલો',
    copyPetition: 'અરજીનું લખાણ કૉપિ કરો',

    // Auth & Profile
    authTitle: 'લેબલ લેન્સ AI પોર્ટલ પ્રવેશ',
    authSubtitle: 'Google પ્રમાણીકરણ અને ખાતું નોંધણી',
    loginGoogle: 'Google (Gmail) સાથે આગળ વધો',
    orEmail: 'અથવા ચકાસાયેલ ઇમેઇલથી સાઇન ઇન કરો',
    fullName: 'પૂર્ણ કાનૂની નામ',
    emailAddress: 'ઇમેઇલ સરનામું',
    password: 'પાસવર્ડ',
    accountRole: 'નિયુક્ત ભૂમિકા',
    roleConsumer: 'નાગરિક / ગ્રાહક ફરિયાદી',
    roleInspector: 'કાનૂની માપવિજ્ઞાન / ખાદ્ય સુરક્ષા નિરીક્ષક',
    roleAdmin: 'નિયામક વહીવટકર્તા',
    loginAction: 'સાઇન ઇન કરો',
    createAccountAction: 'નવું ખાતું બનાવો',
    alreadyHaveAccount: 'પહેલેથી ખાતું છે? સાઇન ઇન કરો',
    dontHaveAccount: 'ખાતું નથી? નવું બનાવો',
    signOut: 'લૉગ આઉટ',
    saveProfile: 'પ્રોફાઇલ સાચવો',

    // Settings
    settingsTitle: 'લેબલ લેન્સ AI એન્જિન અને કી વૉલ્ટ',
    settingsSubtitle: 'Google Gemini, OpenAI અથવા કસ્ટમ LLM કનેક્ટ કરો',
    activeProvider: 'સક્રિય AI પ્રદાતા',
    geminiApiKey: 'Google Gemini API કી',
    testKey: 'કનેક્ટિવિટી ચકાસો',
    saveConfiguration: 'રૂપરેખાંકન સાચવો',
    auditoryChimes: 'ધ્વનિ ચેતવણી ચાઇમ',
    testPopup: 'પૉપ-અપ પરીક્ષણ',
    autoDriveBackup: 'Firebase અને Google Drive માં આપમેળે બૅકઅપ',
    languageSectionTitle: 'પ્રાદેશિક ભારતીય ભાષા પસંદગી',

    // Notifications
    fileExported: 'ફાઇલ નિકાસ',
    legalPetition: 'કાનૂની અરજી',
    auditVerified: 'ઓડિટ ચકાસાયેલ',
    pdpAnalyzing: 'PDP વિશ્લેષણ',
    helplineCall: 'હેલ્પલાઇન કૉલ',
    firebaseSync: 'Firebase સિંક',
    googleDrive: 'Google Drive',
    directorateExcel: 'ડાયરેક્ટોરેટ Excel',
    accessGranted: 'પરવાનગી મંજૂર',
    aiConnected: 'AI જોડાયેલ છે',
    systemNotice: 'સિસ્ટમ સૂચના'
  },
  kn: {
    // Kannada (Karnataka)
    appName: 'ಲೇಬಲ್ ಲೆನ್ಸ್ AI',
    appSubtitle: 'ಕಾನೂನು ಮಾಪನಶಾಸ್ತ್ರ ಮತ್ತು ಆಹಾರ ಸುರಕ್ಷತಾ ಅನುಸರಣಾ ಎಂಜಿನ್',
    sihBadge: 'SIH 2026',
    adminPanel: 'ಆಡಳಿತ ಮಂಡಳಿ',
    officesAndLabs: 'ಕಚೇರಿಗಳು ಮತ್ತು ಪ್ರಯೋಗಾಲಯಗಳು',
    callHelpline: 'ಸಹಾಯವಾಣಿ ಕರೆ',
    chatAssistant: 'ಕಾನೂನು AI',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    profile: 'ಪ್ರೊಫೈಲ್',
    signIn: 'ಸೈನ್ ಇನ್',
    language: 'ಭಾಷೆ',
    selectLanguage: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    permissions: 'ಅನುಮತಿಗಳು',

    // Scanner / Input
    scannerTitle: 'ಪ್ಯಾಕ್ ಮಾಡಿದ ಸರಕುಗಳ ಅನುಸರಣಾ ಲೆನ್ಸ್',
    scannerSubtitle: 'ಲೈವ್ ಕ್ಯಾಮೆರಾ, ಚಿತ್ರ ಅಪ್‌ಲೋಡ್, ಧ್ವನಿ ಡಿಕ್ಟೇಶನ್ ಮತ್ತು ಬಾರ್‌ಕೋಡ್ ಹುಡುಕಾಟ',
    tabCamera: 'ಲೈವ್ ಕ್ಯಾಮೆರಾ',
    tabUpload: 'ಮಾಧ್ಯಮ ಅಪ್‌ಲೋಡ್',
    tabVoice: 'ಧ್ವನಿ ಡಿಕ್ಟೇಶನ್',
    tabText: 'ಪಠ್ಯ ವಿವರಣೆ',
    takeSnapshot: 'ಫೋಟೋ ತೆಗೆಯಿರಿ',
    uploadPrompt: 'ಪ್ಯಾಕೇಜಿಂಗ್ ಫೋಟೋ ಅಥವಾ PDF ಅನ್ನು ಇಲ್ಲಿ ಎಳೆಯಿರಿ',
    pdpAreaLabel: 'ಪ್ರಮುಖ ಪ್ರದರ್ಶನ ಫಲಕ (PDP) ವಿಸ್ತೀರ್ಣ (ಚ.ಸೆಂ.ಮೀ)',
    barcodeLabel: 'ಬಾರ್‌ಕೋಡ್ / EAN-13 ಸಂಖ್ಯೆ',
    voicePrompt: 'ಉತ್ಪನ್ನದ ವಿವರಗಳನ್ನು ಮಾತನಾಡಿ (MRP, ನಿವ್ವಳ ಪ್ರಮಾಣ, ತಯಾರಕ, ಮುಕ್ತಾಯ)...',
    startListening: 'ಧ್ವನಿ ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ',
    stopListening: 'ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸಿ',
    analyzeButton: 'ಉತ್ಪನ್ನ ಅನುಸರಣೆಯನ್ನು ಪರಿಶೀಲಿಸಿ',
    analyzingButton: 'ಕಾನೂನು ನಿಯಮಗಳ ಮೌಲ್ಯಮಾಪನ ನಡೆಯುತ್ತಿದೆ...',

    // Audit Report & ScoreCard
    auditDocketId: 'ದಾಖಲೆ ಐಡಿ',
    complianceScore: 'ಕಾನೂನು ಅನುಸರಣೆ ಅಂಕ',
    scoreSubtitle: 'PCR ನಿಯಮಗಳು 2011/2026 ಮತ್ತು FSSAI 2020 ಆಧಾರಿತ',
    statusCompliant: 'ಸಂಪೂರ್ಣ ಅನುಸರಣೆ (COMPLIANT)',
    statusNonCompliant: 'ನಿಯಮ ಉಲ್ಲಂಘನೆ (NON-COMPLIANT)',
    statusCaution: 'ಪರಿಶೀಲನೆ ಅಗತ್ಯ (NEEDS REVIEW)',
    executiveSummary: 'ಕಾರ್ಯನಿರ್ವಾಹಕ ನಿಯಂತ್ರಣ ಸಾರಾಂಶ',
    fivePointEvaluation: 'ಕಡ್ಡಾಯ 5-ಅಂಶಗಳ ಘೋಷಣೆಗಳು (ನಿಯಮ 6)',
    parameter: 'ಪ್ಯಾರಾಮೀಟರ್',
    observedValue: 'ಪ್ಯಾಕೇಜಿಂಗ್‌ನಲ್ಲಿ ಕಂಡುಬಂದ ವಿವರ',
    regulatoryClause: 'ಕಾನೂನು ನಿಯಮ / ಷರತ್ತು',
    statutoryReasoning: 'ಕಾನೂನುಬದ್ಧ ಸಮರ್ಥನೆ',
    correctExplanation: 'ಅನುಸರಣೆಗೆ ಕಾರಣ',
    violationExplanation: 'ಉಲ್ಲಂಘನೆಗೆ ಕಾರಣ',

    // Export & Complaint Actions
    exportDossier: 'ಅಧಿಕೃತ ಆಡಿಟ್ ಡಾಕ್ಯುಮೆಂಟ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    downloadPdf: 'PDF ಫೈಲ್ (.pdf)',
    downloadWord: 'Word ಡಾಕ್ಯುಮೆಂಟ್ (.docx)',
    downloadHtml: 'ಇಂಟರಾಕ್ಟಿವ್ ಆ್ಯಪ್ (.html)',
    downloadJson: 'JSON ಡೇಟಾ (.json)',
    downloadTxt: 'ಸರಳ ಪಠ್ಯ (.txt)',
    exportToDrive: 'Google Drive ನಲ್ಲಿ ಉಳಿಸಿ',
    shareEmail: 'ಇಮೇಲ್ ಮೂಲಕ ಹಂಚಿಕೊಳ್ಳಿ',
    draftComplaint: 'ಕಾನೂನು ದೂರು ಅರ್ಜಿ ಸಿದ್ಧಪಡಿಸಿ',
    filePetition: 'ಕಾನೂನು ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    complaintDocket: 'ಶಾಸನಬದ್ಧ ದೂರು ನಮೂನೆ',
    authorityTarget: 'ಗುರಿ ಪ್ರಾಧಿಕಾರ',
    transmitToFssai: 'FSSAI ಅನುಸರಣಾ ಡೆಸ್ಕ್‌ಗೆ ಕಳುಹಿಸಿ',
    copyPetition: 'ಅರ್ಜಿ ಪಠ್ಯವನ್ನು ನಕಲಿಸಿ',

    // Auth & Profile
    authTitle: 'ಲೇಬಲ್ ಲೆನ್ಸ್ AI ಪೋರ್ಟಲ್ ಪ್ರವೇಶ',
    authSubtitle: 'Google ದೃಢೀಕರಣ ಮತ್ತು ಖಾತೆ ನೋಂದಣಿ',
    loginGoogle: 'Google (Gmail) ನೊಂದಿಗೆ ಮುಂದುವರಿಯಿರಿ',
    orEmail: 'ಅಥವಾ ಪರಿಶೀಲಿಸಿದ ಇಮೇಲ್ ಮೂಲಕ ಸೈನ್ ಇನ್ ಮಾಡಿ',
    fullName: 'ಪೂರ್ಣ ಕಾನೂನು ಹೆಸರು',
    emailAddress: 'ಇಮೇಲ್ ವಿಳಾಸ',
    password: 'ಪಾಸ್‌ವರ್ಡ್',
    accountRole: 'ನಿಯೋಜಿತ ಪಾತ್ರ',
    roleConsumer: 'ನಾಗರಿಕ / ಗ್ರಾಹಕ ದೂರುದಾರ',
    roleInspector: 'ಕಾನೂನು ಮಾಪನಶಾಸ್ತ್ರ / ಆಹಾರ ಸುರಕ್ಷತಾ ನಿರೀಕ್ಷಕ',
    roleAdmin: 'ನಿರ್ದೇಶನಾಲಯ ನಿರ್ವಾಹಕ',
    loginAction: 'ಸೈನ್ ಇನ್ ಮಾಡಿ',
    createAccountAction: 'ಹೊಸ ಖಾತೆಯನ್ನು ರಚಿಸಿ',
    alreadyHaveAccount: 'ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ? ಸೈನ್ ಇನ್ ಮಾಡಿ',
    dontHaveAccount: 'ಖಾತೆ ಇಲ್ಲವೇ? ಹೊಸದನ್ನು ರಚಿಸಿ',
    signOut: 'ಸೈನ್ ಔಟ್',
    saveProfile: 'ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ',

    // Settings
    settingsTitle: 'ಲೇಬಲ್ ಲೆನ್ಸ್ AI ಎಂಜಿನ್ ಮತ್ತು ಕೀ ವಾಲ್ಟ್',
    settingsSubtitle: 'Google Gemini, OpenAI ಅಥವಾ ಕಸ್ಟಮ್ LLM ಸಂಪರ್ಕಿಸಿ',
    activeProvider: 'ಸಕ್ರಿಯ AI ಒದಗಿಸುವವರು',
    geminiApiKey: 'Google Gemini API ಕೀ',
    testKey: 'ಸಂಪರ್ಕವನ್ನು ಪರೀಕ್ಷಿಸಿ',
    saveConfiguration: 'ಸಂರಚನೆಯನ್ನು ಉಳಿಸಿ',
    auditoryChimes: 'ಧ್ವನಿ ಎಚ್ಚರಿಕೆ ಚೈಮ್ಸ್',
    testPopup: 'ಪಾಪ್-ಅಪ್ ಪರೀಕ್ಷೆ',
    autoDriveBackup: 'Firebase ಮತ್ತು Google Drive ಗೆ ಸ್ವಯಂಚಾಲಿತ ಬ್ಯಾಕಪ್',
    languageSectionTitle: 'ಪ್ರಾದೇಶಿಕ ಭಾರತೀಯ ಭಾಷಾ ಆಯ್ಕೆ',

    // Notifications
    fileExported: 'ಫೈಲ್ ರಫ್ತು',
    legalPetition: 'ಕಾನೂನು ಅರ್ಜಿ',
    auditVerified: 'ಆಡಿಟ್ ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
    pdpAnalyzing: 'PDP ವಿಶ್ಲೇಷಣೆ',
    helplineCall: 'ಸಹಾಯವಾಣಿ ಕರೆ',
    firebaseSync: 'Firebase ಸಿಂಕ್',
    googleDrive: 'Google Drive',
    directorateExcel: 'ನಿರ್ದೇಶನಾಲಯ Excel',
    accessGranted: 'ಅನುಮತಿ ನೀಡಲಾಗಿದೆ',
    aiConnected: 'AI ಸಂಪರ್ಕಗೊಂಡಿದೆ',
    systemNotice: 'ಸಿಸ್ಟಮ್ ಸೂಚನೆ'
  },
  ml: {
    // Malayalam (Kerala)
    appName: 'ലേബൽ ലെൻസ് AI',
    appSubtitle: 'ലീഗൽ മെട്രോളജി & ഫുഡ് സേഫ്റ്റി കംപ്ലയൻസ് എഞ്ചിൻ',
    sihBadge: 'SIH 2026',
    adminPanel: 'അഡ്മിൻ പാനൽ',
    officesAndLabs: 'ഓഫീസുകളും ലാബുകളും',
    callHelpline: 'ഹെൽപ്പ്‌ലൈൻ കോൾ',
    chatAssistant: 'നിയമ AI',
    settings: 'ക്രമീകരണങ്ങൾ',
    profile: 'പ്രൊഫൈൽ',
    signIn: 'സൈൻ ഇൻ',
    language: 'ഭാഷ',
    selectLanguage: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    permissions: 'അനുമതികൾ',

    // Scanner / Input
    scannerTitle: 'പാക്കേജ്ഡ് ഉൽപ്പന്ന കംപ്ലയൻസ് ലെൻസ്',
    scannerSubtitle: 'തത്സമയ ക്യാമറ, ഇമേജ് അപ്‌ലോഡ്, വോയ്‌സ് ഡിക്റ്റേഷൻ & ബാർകോഡ് തിരയൽ',
    tabCamera: 'തത്സമയ ക്യാമറ',
    tabUpload: 'മീഡിയ അപ്‌ലോഡ്',
    tabVoice: 'വോയ്‌സ് ഡിക്റ്റേഷൻ',
    tabText: 'ടെക്സ്റ്റ് വിവരണം',
    takeSnapshot: 'ഫോട്ടോ എടുക്കുക',
    uploadPrompt: 'പാക്കേജിംഗ് ഫോട്ടോ അല്ലെങ്കിൽ PDF ഇവിടെ ഇടുക',
    pdpAreaLabel: 'പ്രധാന ഡിസ്പ്ലേ പാനൽ (PDP) വിസ്തീർണ്ണം (ച.സെ.മീ)',
    barcodeLabel: 'ബാർകോഡ് / EAN-13 നമ്പർ',
    voicePrompt: 'ഉൽപ്പന്ന വിവരങ്ങൾ പറയുക (MRP, അറ്റ അളവ്, നിർമ്മാതാവ്, കാലാവധി)...',
    startListening: 'വോയ്‌സ് റെക്കോർഡിംഗ് ആരംഭിക്കുക',
    stopListening: 'റെക്കോർഡിംഗ് നിർത്തുക',
    analyzeButton: 'ഉൽപ്പന്ന കംപ്ലയൻസ് പരിശോധിക്കുക',
    analyzingButton: 'നിയമപരമായ ചട്ടങ്ങൾ പരിശോധിക്കുന്നു...',

    // Audit Report & ScoreCard
    auditDocketId: 'ഡോസിയർ ഐഡി',
    complianceScore: 'നിയമപരമായ കംപ്ലയൻസ് സ്കോർ',
    scoreSubtitle: 'PCR ചട്ടങ്ങൾ 2011/2026 & FSSAI 2020 അടിസ്ഥാനമാക്കി',
    statusCompliant: 'പൂർണ്ണ അനുസരണം (COMPLIANT)',
    statusNonCompliant: 'ചട്ടലംഘനം (NON-COMPLIANT)',
    statusCaution: 'അവലോകനം ആവശ്യമാണ് (NEEDS REVIEW)',
    executiveSummary: 'റെഗുലേറ്ററി സംഗ്രഹം',
    fivePointEvaluation: 'നിർബന്ധിത 5-പോയിന്റ് പ്രഖ്യാപനങ്ങൾ (ചട്ടം 6)',
    parameter: 'ഘടകം',
    observedValue: 'പാക്കേജിംഗിൽ കണ്ടെത്തിയ വിവരം',
    regulatoryClause: 'നിയമപരമായ വകുപ്പ് / ചട്ടം',
    statutoryReasoning: 'നിയമപരമായ ന്യായീകരണം',
    correctExplanation: 'അനുസരണത്തിനുള്ള കാരണം',
    violationExplanation: 'ലംഘനത്തിനുള്ള കാരണം',

    // Export & Complaint Actions
    exportDossier: 'ഔദ്യോഗിക ഓഡിറ്റ് ഡോസിയർ ഡൗൺലോഡ് ചെയ്യുക',
    downloadPdf: 'PDF ഫയൽ (.pdf)',
    downloadWord: 'Word പ്രമാണം (.docx)',
    downloadHtml: 'ഇന്ററാക്ടീവ് ആപ്പ് (.html)',
    downloadJson: 'JSON ഡാറ്റ (.json)',
    downloadTxt: 'ലളിതമായ ടെക്സ്റ്റ് (.txt)',
    exportToDrive: 'Google Drive-ൽ സൂക്ഷിക്കുക',
    shareEmail: 'ഇമെയിൽ വഴി പങ്കിടുക',
    draftComplaint: 'നിയമപരമായ പരാതി ഹർജി തയ്യാറാക്കുക',
    filePetition: 'നിയമ ഹർജി ഫയൽ ചെയ്യുക',
    complaintDocket: 'നിയമപരമായ പരാതി ഫോറം',
    authorityTarget: 'ലക്ഷ്യ അതോറിറ്റി',
    transmitToFssai: 'FSSAI കംപ്ലയൻസ് ഡെസ്കിലേക്ക് അയയ്ക്കുക',
    copyPetition: 'ഹർജി പകർപ്പാവകാശം പകർത്തുക',

    // Auth & Profile
    authTitle: 'ലേബൽ ലെൻസ് AI പോർട്ടൽ പ്രവേശനം',
    authSubtitle: 'Google പ്രാമാണീകരണവും അക്കൗണ്ട് രജിസ്ട്രേഷനും',
    loginGoogle: 'Google (Gmail) വഴി തുടരുക',
    orEmail: 'അല്ലെങ്കിൽ ഇമെയിൽ വഴി സൈൻ ഇൻ ചെയ്യുക',
    fullName: 'പൂർണ്ണ നിയമപരമായ പേര്',
    emailAddress: 'ഇമെയിൽ വിലാസം',
    password: 'പാസ്‌വേഡ്',
    accountRole: 'നിർദ്ദിഷ്ട പങ്ക്',
    roleConsumer: 'പൗരൻ / ഉപഭോക്തൃ പരാതിക്കാരൻ',
    roleInspector: 'ലീഗൽ മെട്രോളജി / ഫുഡ് സേഫ്റ്റി ഇൻസ്പെക്ടർ',
    roleAdmin: 'ഡയറക്ടറേറ്റ് അഡ്മിനിസ്ട്രേറ്റർ',
    loginAction: 'സൈൻ ഇൻ ചെയ്യുക',
    createAccountAction: 'പുതിയ അക്കൗണ്ട് ഉണ്ടാക്കുക',
    alreadyHaveAccount: 'ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ? സൈൻ ഇൻ ചെയ്യുക',
    dontHaveAccount: 'അക്കൗണ്ട് ഇല്ലേ? പുതിയത് ഉണ്ടാക്കുക',
    signOut: 'പുറത്തുകടക്കുക',
    saveProfile: 'പ്രൊഫൈൽ സംരക്ഷിക്കുക',

    // Settings
    settingsTitle: 'ലേബൽ ലെൻസ് AI എഞ്ചിനും കീ വോൾട്ടും',
    settingsSubtitle: 'Google Gemini, OpenAI അല്ലെങ്കിൽ ഇഷ്‌ടാനുസൃത LLM ബന്ധിപ്പിക്കുക',
    activeProvider: 'സജീവ AI ദാതാവ്',
    geminiApiKey: 'Google Gemini API കീ',
    testKey: 'കണക്റ്റിവിറ്റി പരിശോധിക്കുക',
    saveConfiguration: 'ക്രമീകരണം സംരക്ഷിക്കുക',
    auditoryChimes: 'ശബ്ദ മുന്നറിയിപ്പ് ബെല്ലുകൾ',
    testPopup: 'പോപ്പ്-അപ്പ് പരിശോധന',
    autoDriveBackup: 'Firebase & Google Drive ലേക്ക് യാന്ത്രിക ബാക്കപ്പ്',
    languageSectionTitle: 'പ്രാദേശിക ഇന്ത്യൻ ഭാഷ തിരഞ്ഞെടുക്കൽ',

    // Notifications
    fileExported: 'ഫയൽ കയറ്റുമതി',
    legalPetition: 'നിയമ ഹർജി',
    auditVerified: 'ഓഡിറ്റ് പരിശോധിച്ചു',
    pdpAnalyzing: 'PDP വിശകലനം',
    helplineCall: 'ഹെൽപ്പ്‌ലൈൻ കോൾ',
    firebaseSync: 'Firebase സമന്വയം',
    googleDrive: 'Google Drive',
    directorateExcel: 'ഡയറക്ടറേറ്റ് Excel',
    accessGranted: 'അനുമതി നൽകി',
    aiConnected: 'AI ബന്ധിപ്പിച്ചു',
    systemNotice: 'സിസ്റ്റം അറിയിപ്പ്'
  },
  pa: {
    // Punjabi (Punjab & Chandigarh)
    appName: 'ਲੇਬਲ ਲੈਂਜ਼ AI',
    appSubtitle: 'ਕਾਨੂੰਨੀ ਮਾਪ ਵਿਗਿਆਨ ਅਤੇ ਖੁਰਾਕ ਸੁਰੱਖਿਆ ਪਾਲਣਾ ਇੰਜਨ',
    sihBadge: 'SIH 2026',
    adminPanel: 'ਪ੍ਰਸ਼ਾਸਨ ਪੈਨਲ',
    officesAndLabs: 'ਦਫ਼ਤਰ ਅਤੇ ਪ੍ਰਯੋਗਸ਼ਾਲਾਵਾਂ',
    callHelpline: 'ਹੈਲਪਲਾਈਨ ਕਾਲ',
    chatAssistant: 'ਕਾਨੂੰਨੀ AI',
    settings: 'ਸੈਟਿੰਗਾਂ',
    profile: 'ਪ੍ਰੋਫਾਈਲ',
    signIn: 'ਸਾਈਨ ਇਨ',
    language: 'ਭਾਸ਼ਾ',
    selectLanguage: 'ਭਾਸ਼ਾ ਚੁਣੋ',
    permissions: 'ਇਜਾਜ਼ਤਾਂ',

    // Scanner / Input
    scannerTitle: 'ਪੈਕ ਕੀਤੀਆਂ ਵਸਤੂਆਂ ਪਾਲਣਾ ਲੈਂਜ਼',
    scannerSubtitle: 'ਲਾਈਵ ਕੈਮਰਾ, ਤਸਵੀਰ ਅੱਪਲੋਡ, ਆਵਾਜ਼ ਡਿਕਟੇਸ਼ਨ ਅਤੇ ਬਾਰਕੋਡ ਖੋਜ',
    tabCamera: 'ਲਾਈਵ ਕੈਮਰਾ',
    tabUpload: 'ਮੀਡੀਆ ਅੱਪਲੋਡ',
    tabVoice: 'ਆਵਾਜ਼ ਡਿਕਟੇਸ਼ਨ',
    tabText: 'ਲਿਖਤੀ ਵੇਰਵਾ',
    takeSnapshot: 'ਫੋਟੋ ਖਿੱਚੋ',
    uploadPrompt: 'ਪੈਕੇਜਿੰਗ ਫੋਟੋ ਜਾਂ PDF ਇੱਥੇ ਖਿੱਚੋ',
    pdpAreaLabel: 'ਮੁੱਖ ਡਿਸਪਲੇ ਪੈਨਲ (PDP) ਖੇਤਰਫਲ (ਵਰਗ ਸੈਂ.ਮੀ.)',
    barcodeLabel: 'ਬਾਰਕੋਡ / EAN-13 ਨੰਬਰ',
    voicePrompt: 'ਉਤਪਾਦ ਦੇ ਵੇਰਵੇ ਬੋਲੋ (MRP, ਸ਼ੁੱਧ ਮਾਤਰਾ, ਨਿਰਮਾਤਾ, ਮਿਆਦ)...',
    startListening: 'ਆਵਾਜ਼ ਰਿਕਾਰਡਿੰਗ ਸ਼ੁਰੂ ਕਰੋ',
    stopListening: 'ਰਿਕਾਰਡਿੰਗ ਬੰਦ ਕਰੋ',
    analyzeButton: 'ਉਤਪਾਦ ਪਾਲਣਾ ਦੀ ਜਾਂਚ ਕਰੋ',
    analyzingButton: 'ਕਾਨੂੰਨੀ ਨਿਯਮਾਂ ਦੀ ਸਮੀਖਿਆ ਜਾਰੀ ਹੈ...',

    // Audit Report & ScoreCard
    auditDocketId: 'ਡੋਜ਼ੀਅਰ ਆਈਡੀ',
    complianceScore: 'ਕਾਨੂੰਨੀ ਪਾਲਣਾ ਸਕੋਰ',
    scoreSubtitle: 'PCR ਨਿਯਮ 2011/2026 ਅਤੇ FSSAI 2020 ਦੇ ਅਧਾਰ ਤੇ',
    statusCompliant: 'ਨਿਯਮਾਂ ਅਨੁਸਾਰ (COMPLIANT)',
    statusNonCompliant: 'ਨਿਯਮਾਂ ਦੇ ਉਲਟ (NON-COMPLIANT)',
    statusCaution: 'ਸਮੀਖਿਆ ਦੀ ਲੋੜ (NEEDS REVIEW)',
    executiveSummary: 'ਕਾਰਜਕਾਰੀ ਰੈਗੂਲੇਟਰੀ ਸਾਰਾਂਸ਼',
    fivePointEvaluation: 'ਲਾਜ਼ਮੀ 5-ਨੁਕਾਤੀ ਐਲਾਨ (ਨਿਯਮ 6)',
    parameter: 'ਪੈਰਾਮੀਟਰ',
    observedValue: 'ਪੈਕੇਜਿੰਗ ਤੇ ਦਰਜ ਵੇਰਵਾ',
    regulatoryClause: 'ਕਾਨੂੰਨੀ ਧਾਰਾ / ਨਿਯਮ',
    statutoryReasoning: 'ਕਾਨੂੰਨੀ ਤਰਕ',
    correctExplanation: 'ਪਾਲਣਾ ਦਾ ਕਾਰਨ',
    violationExplanation: 'ਉਲੰਘਣਾ ਦਾ ਕਾਰਨ',

    // Export & Complaint Actions
    exportDossier: 'ਅਧਿਕਾਰਤ ਆਡਿਟ ਡੋਜ਼ੀਅਰ ਡਾਊਨਲੋਡ ਕਰੋ',
    downloadPdf: 'PDF ਫਾਈਲ (.pdf)',
    downloadWord: 'Word ਦਸਤਾਵੇਜ਼ (.docx)',
    downloadHtml: 'ਇੰਟਰਐਕਟਿਵ ਐਪ (.html)',
    downloadJson: 'JSON ਡੇਟਾ (.json)',
    downloadTxt: 'ਸਧਾਰਨ ਟੈਕਸਟ (.txt)',
    exportToDrive: 'Google Drive ਵਿੱਚ ਸੰਭਾਲੋ',
    shareEmail: 'ਈਮੇਲ ਰਾਹੀਂ ਸਾਂਝਾ ਕਰੋ',
    draftComplaint: 'ਕਾਨੂੰਨੀ ਸ਼ਿਕਾਇਤ ਪਟੀਸ਼ਨ ਤਿਆਰ ਕਰੋ',
    filePetition: 'ਕਾਨੂੰਨੀ ਪਟੀਸ਼ਨ ਦਾਇਰ ਕਰੋ',
    complaintDocket: 'ਕਾਨੂੰਨੀ ਸ਼ਿਕਾਇਤ ਫਾਰਮ',
    authorityTarget: 'ਨਿਸ਼ਾਨਾ ਅਥਾਰਟੀ ਡੈਸਕ',
    transmitToFssai: 'FSSAI ਕੰਪਲਾਇੰਸ ਡੈਸਕ ਨੂੰ ਭੇਜੋ',
    copyPetition: 'ਪਟੀਸ਼ਨ ਟੈਕਸਟ ਕਾਪੀ ਕਰੋ',

    // Auth & Profile
    authTitle: 'ਲੇਬਲ ਲੈਂਜ਼ AI ਪੋਰਟਲ ਦਾਖਲਾ',
    authSubtitle: 'Google ਪ੍ਰਮਾਣੀਕਰਨ ਅਤੇ ਖਾਤਾ ਰਜਿਸਟ੍ਰੇਸ਼ਨ',
    loginGoogle: 'Google (Gmail) ਨਾਲ ਜਾਰੀ ਰੱਖੋ',
    orEmail: 'ਜਾਂ ਪ੍ਰਮਾਣਿਤ ਈਮੇਲ ਨਾਲ ਸਾਈਨ ਇਨ ਕਰੋ',
    fullName: 'ਪੂਰਾ ਕਾਨੂੰਨੀ ਨਾਮ',
    emailAddress: 'ਈਮੇਲ ਪਤਾ',
    password: 'ਪਾਸਵਰਡ',
    accountRole: 'ਨਿਰਧਾਰਤ ਭੂਮਿਕਾ',
    roleConsumer: 'ਨਾਗਰਿਕ / ਖਪਤਕਾਰ ਸ਼ਿਕਾਇਤਕਰਤਾ',
    roleInspector: 'ਲੀਗਲ ਮੈਟਰੋਲੋਜੀ / ਫੂਡ ਸੇਫਟੀ ਇੰਸਪੈਕਟਰ',
    roleAdmin: 'ਡਾਇਰੈਕਟੋਰੇਟ ਪ੍ਰਸ਼ਾਸਕ',
    loginAction: 'ਸਾਈਨ ਇਨ ਕਰੋ',
    createAccountAction: 'ਨਵਾਂ ਖਾਤਾ ਬਣਾਓ',
    alreadyHaveAccount: 'ਪਹਿਲਾਂ ਤੋਂ ਖਾਤਾ ਹੈ? ਸਾਈਨ ਇਨ ਕਰੋ',
    dontHaveAccount: 'ਖਾਤਾ ਨਹੀਂ ਹੈ? ਨਵਾਂ ਬਣਾਓ',
    signOut: 'ਲਾਗ ਆਉਟ',
    saveProfile: 'ਪ੍ਰੋਫਾਈਲ ਸੰਭਾਲੋ',

    // Settings
    settingsTitle: 'ਲੇਬਲ ਲੈਂਜ਼ AI ਇੰਜਨ ਅਤੇ ਕੁੰਜੀ ਵਾਲਟ',
    settingsSubtitle: 'Google Gemini, OpenAI ਜਾਂ ਕਸਟਮ LLM ਕਨੈਕਟ ਕਰੋ',
    activeProvider: 'ਸਰਗਰਮ AI ਪ੍ਰਦਾਤਾ',
    geminiApiKey: 'Google Gemini API ਕੁੰਜੀ',
    testKey: 'ਕਨੈਕਟੀਵਿਟੀ ਟੈਸਟ ਕਰੋ',
    saveConfiguration: 'ਸੰਰਚਨਾ ਸੰਭਾਲੋ',
    auditoryChimes: 'ਆਡੀਓ ਚਿਤਾਵਨੀ ਚਾਈਮਸ',
    testPopup: 'ਪੌਪ-ਅੱਪ ਟੈਸਟ',
    autoDriveBackup: 'Firebase ਅਤੇ Google Drive ਤੇ ਆਟੋ ਬੈਕਅੱਪ',
    languageSectionTitle: 'ਖੇਤਰੀ ਭਾਰਤੀ ਭਾਸ਼ਾ ਚੋਣ',

    // Notifications
    fileExported: 'ਫਾਈਲ ਨਿਰਯਾਤ',
    legalPetition: 'ਕਾਨੂੰਨੀ ਪਟੀਸ਼ਨ',
    auditVerified: 'ਆਡਿਟ ਪ੍ਰਮਾਣਿਤ',
    pdpAnalyzing: 'PDP ਵਿਸ਼ਲੇਸ਼ਣ',
    helplineCall: 'ਹੈਲਪਲਾਈਨ ਕਾਲ',
    firebaseSync: 'Firebase ਸਿੰਕ',
    googleDrive: 'Google Drive',
    directorateExcel: 'ਡਾਇਰੈਕਟੋਰੇਟ Excel',
    accessGranted: 'ਇਜਾਜ਼ਤ ਮਨਜ਼ੂਰ',
    aiConnected: 'AI ਜੁੜਿਆ ਹੈ',
    systemNotice: 'ਸਿਸਟਮ ਨੋਟਿਸ'
  }
};

const STORAGE_LANG_KEY = 'label_lens_selected_language';

let currentLanguage: IndianLanguageCode = 'en';
const subscribers: Set<(lang: IndianLanguageCode) => void> = new Set();

/**
 * Initialize language from localStorage or user preference
 */
export function getStoredLanguage(): IndianLanguageCode {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem(STORAGE_LANG_KEY) as IndianLanguageCode;
  if (stored && SUPPORTED_INDIAN_LANGUAGES.some(l => l.code === stored)) {
    return stored;
  }
  return 'en';
}

currentLanguage = getStoredLanguage();

/**
 * Set active Indian language and update document attributes & typography classes
 */
export function setAppLanguage(lang: IndianLanguageCode): void {
  currentLanguage = lang;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_LANG_KEY, lang);
    document.documentElement.lang = lang;
    
    // Apply script specific typography body class
    document.body.classList.remove(
      'font-devanagari',
      'font-tamil',
      'font-telugu',
      'font-bengali',
      'font-gujarati',
      'font-kannada',
      'font-malayalam',
      'font-gurmukhi'
    );

    switch (lang) {
      case 'hi':
      case 'mr':
        document.body.classList.add('font-devanagari');
        break;
      case 'ta':
        document.body.classList.add('font-tamil');
        break;
      case 'te':
        document.body.classList.add('font-telugu');
        break;
      case 'bn':
        document.body.classList.add('font-bengali');
        break;
      case 'gu':
        document.body.classList.add('font-gujarati');
        break;
      case 'kn':
        document.body.classList.add('font-kannada');
        break;
      case 'ml':
        document.body.classList.add('font-malayalam');
        break;
      case 'pa':
        document.body.classList.add('font-gurmukhi');
        break;
    }
  }

  subscribers.forEach(sub => sub(lang));
}

export function getCurrentLanguage(): IndianLanguageCode {
  return currentLanguage;
}

export function subscribeToLanguage(sub: (lang: IndianLanguageCode) => void): () => void {
  subscribers.add(sub);
  sub(currentLanguage);
  return () => {
    subscribers.delete(sub);
  };
}

/**
 * Translate a key into the active Indian language, with automatic English fallback
 */
export function t(key: string, lang?: IndianLanguageCode): string {
  const targetLang = lang || currentLanguage;
  const dict = TRANSLATIONS[targetLang] || TRANSLATIONS.en;
  if (dict && dict[key]) {
    return dict[key];
  }
  // Fallback to English dictionary
  return TRANSLATIONS.en[key] || key;
}
