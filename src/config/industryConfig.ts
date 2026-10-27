export type SupportedLanguage = 'ta' | 'hi' | 'en';
export type IndustryKey = 'construction' | 'college';

export interface IndustryDefinition {
  id: IndustryKey;
  orgName: string;
  workerNoun: string;
  employerNoun: string;
  siteNoun: string;
  badgeCode: string;
  maxShiftHours: number;
  hourlyRate: number; // in INR
  overtimeMultiplier: number;
  complianceStandard: string;
  hazards: string[];
  defaultRoleName: string;
}

export const INDUSTRY_CONFIG: Record<IndustryKey, IndustryDefinition> = {
  construction: {
    id: 'construction',
    orgName: 'Apex Infra Site #4 — Tower B',
    workerNoun: 'Laborer / Tradesperson',
    employerNoun: 'Site Foreman & Safety Officer',
    siteNoun: 'Construction Site',
    badgeCode: 'BOCW-2026-IND',
    maxShiftHours: 9,
    hourlyRate: 125, // ₹125/hr
    overtimeMultiplier: 1.5,
    complianceStandard: 'Building and Other Construction Workers (BOCW) Act & OSHA 1926',
    hazards: [
      'Scaffolding / Working at Height Risk',
      'No Safety Helmet / Harness Missing',
      'Heavy Excavator / Crane Blindspot',
      'Exposed High-Voltage Wiring & Water Puddle',
      'Extreme Heat, Dehydration & Sunstroke',
      'Deep Trench Cave-In Hazard'
    ],
    defaultRoleName: 'Scaffolder & Rigging Mason'
  },
  college: {
    id: 'college',
    orgName: 'St. Jude Medical & Engineering Campus',
    workerNoun: 'Contract Staff & Lab Attendant',
    employerNoun: 'Campus Facilities & Safety Dean',
    siteNoun: 'University Campus',
    badgeCode: 'UGC-SAF-2026',
    maxShiftHours: 8,
    hourlyRate: 105, // ₹105/hr
    overtimeMultiplier: 1.25,
    complianceStandard: 'Institutional Safety Code & Contract Labour (Regulation) Act',
    hazards: [
      'Chemical / Acid Spill in Science Lab',
      'Bio-Medical Waste Bin Overflow',
      'Wet Slippery Floor without Warning Sign',
      'Defective High-Voltage Main Switchboard',
      'Dormitory Water Shortage & Contamination',
      'Fire Exit Blocked by Storage Cartons'
    ],
    defaultRoleName: 'Sanitation & Hazardous Waste Handler'
  }
};

export interface TranslationStrings {
  appName: string;
  punchIn: string;
  punchOut: string;
  onDuty: string;
  offDuty: string;
  hoursWorked: string;
  overtime: string;
  speakQuery: string;
  reportHazard: string;
  anonymousNote: string;
  listenPayslip: string;
  skills: string;
  homeTab: string;
  payTab: string;
  safetyTab: string;
  passportTab: string;
  listening: string;
  tapToSpeak: string;
  voiceSubtitle: string;
  fatigueWarning: string;
  overtimeRateActive: string;
  regularPay: string;
  overtimePay: string;
  deductions: string;
  netPay: string;
  fileGrievance: string;
  issueCategory: string;
  speakOrType: string;
  submitComplaint: string;
  anonymousToggle: string;
  successRecorded: string;
  verifiedBadges: string;
  shareBadge: string;
  adminTitle: string;
  adminSub: string;
  activeStaff: string;
  inOvertime: string;
  fatigueRisk: string;
  resolveAction: string;
  resolvedStatus: string;
  switchIndustry: string;
  modeWorker: string;
  modeAdmin: string;
}

export const UI_TRANSLATIONS: Record<SupportedLanguage, TranslationStrings> = {
  en: {
    appName: 'ShramikSetu',
    punchIn: 'CHECK IN (START SHIFT)',
    punchOut: 'CHECK OUT (END SHIFT)',
    onDuty: 'ON DUTY',
    offDuty: 'OFF DUTY',
    hoursWorked: 'Hours Worked',
    overtime: 'Overtime (OT)',
    speakQuery: 'Tap to Speak (Tamil / Hindi / English)',
    reportHazard: 'Report Safety Hazard',
    anonymousNote: 'Identity Hidden & Protected',
    listenPayslip: 'Listen in Audio',
    skills: 'Verified Skill Passport',
    homeTab: 'Shift Clock',
    payTab: 'Payslip',
    safetyTab: 'Safety Hazard',
    passportTab: 'Passport',
    listening: 'Listening... please speak clearly',
    tapToSpeak: 'Tap & Speak',
    voiceSubtitle: 'Speak queries like "Salary", "Overtime", "Danger" or "Hours"',
    fatigueWarning: 'Overtime Fatigue Warning',
    overtimeRateActive: 'Shift has exceeded standard safe limits. 1.5x Overtime active.',
    regularPay: 'Regular Wages',
    overtimePay: 'Overtime Pay (OT)',
    deductions: 'EPF & Welfare Deductions',
    netPay: 'Total Take-Home Pay',
    fileGrievance: 'Report Safety Hazard / Grievance',
    issueCategory: 'Hazard Category',
    speakOrType: 'Voice Memo / Incident Details',
    submitComplaint: 'Submit Incident Report',
    anonymousToggle: 'Keep Report 100% Anonymous',
    successRecorded: 'Incident recorded securely. Supervisors alerted.',
    verifiedBadges: 'Verifiable Credentials (SDG 8)',
    shareBadge: 'Share Verified Worker QR',
    adminTitle: 'Live Safety & Fatigue Monitor',
    adminSub: 'Real-time shift compliance & incident triage board',
    activeStaff: 'On Duty Today',
    inOvertime: 'Overtime Staff',
    fatigueRisk: 'Fatigue Alerts',
    resolveAction: 'Mark Resolved',
    resolvedStatus: 'Resolved',
    switchIndustry: 'Switch Industry',
    modeWorker: 'Worker View',
    modeAdmin: 'Supervisor View'
  },
  ta: {
    appName: 'ஸ்ரமிக் சேது',
    punchIn: 'வேலை தொடங்கு (CHECK IN)',
    punchOut: 'வேலை முடிந்தது (CHECK OUT)',
    onDuty: 'பணியில் உள்ளீர்',
    offDuty: 'பணியில் இல்லை',
    hoursWorked: 'வேலை செய்த நேரம்',
    overtime: 'கூடுதல் நேரம் (OT)',
    speakQuery: 'பேசி தேடுங்கள் (தமிழ் / Hindi / English)',
    reportHazard: 'பாதுகாப்பு புகாரை பதிவு செய்',
    anonymousNote: 'பெயர் மற்றும் அடையாளம் ரகசியம்',
    listenPayslip: 'சம்பள குரல் விவரம்',
    skills: 'திறன் சான்றிதழ் அட்டை',
    homeTab: 'பணி நேரம்',
    payTab: 'சம்பளம்',
    safetyTab: 'பாதுகாப்பு',
    passportTab: 'சான்றிதழ்',
    listening: 'கேட்கிறது... தெளிவாகப் பேசுங்கள்',
    tapToSpeak: 'பேச தொடங்குங்கள்',
    voiceSubtitle: '"சம்பளம்", "ஆபத்து", "நேரம்", "சான்றிதழ்" என்று பேசுங்கள்',
    fatigueWarning: 'அதிக வேலை நேரம் எச்சரிக்கை',
    overtimeRateActive: 'அனுமதிக்கப்பட்ட நேரத்தை விட அதிகம் வேலை செய்துள்ளீர்கள். OT கூலி சேர்க்கப்படும்.',
    regularPay: 'அடிப்படை கூலி',
    overtimePay: 'கூடுதல் நேர கூலி (OT)',
    deductions: 'சமூக பாதுகாப்பு பிடித்தம்',
    netPay: 'மொத்த சம்பள தொகை',
    fileGrievance: 'விபத்து மற்றும் பாதுகாப்பு புகார்',
    issueCategory: 'புகார் வகை',
    speakOrType: 'குரல் பதிவு / புகார் விவரம்',
    submitComplaint: 'புகாரை அனுப்பு',
    anonymousToggle: 'பெயர் இல்லாமல் ரகசியமாக அனுப்பு',
    successRecorded: 'புகார் பதிவு செய்யப்பட்டது. அதிகாரிகள் சரிபார்ப்பார்கள்.',
    verifiedBadges: 'சரிபார்க்கப்பட்ட திறன்கள் (SDG 8)',
    shareBadge: 'தொழிலாளர் QR ஐ பகிருங்கள்',
    adminTitle: 'பணி பாதுகாப்பு & சோர்வு கண்காணிப்பு',
    adminSub: 'தொழிலாளர்கள் நேரம் மற்றும் புகார்கள் நேரலை',
    activeStaff: 'பணியில் உள்ளவர்கள்',
    inOvertime: 'கூடுதல் நேரம் செய்பவர்கள்',
    fatigueRisk: 'சோர்வு எச்சரிக்கைகள்',
    resolveAction: 'சரிசெய்யப்பட்டது',
    resolvedStatus: 'முடிந்தது',
    switchIndustry: 'துறையை மாற்றுக',
    modeWorker: 'தொழிலாளர் பக்கம்',
    modeAdmin: 'மேற்பார்வையாளர்'
  },
  hi: {
    appName: 'श्रमिक सेतु',
    punchIn: 'काम शुरू करें (CHECK IN)',
    punchOut: 'काम समाप्त करें (CHECK OUT)',
    onDuty: 'ड्यूटी पर हैं',
    offDuty: 'ड्यूटी समाप्त',
    hoursWorked: 'काम के घंटे',
    overtime: 'अतिरिक्त समय (OT)',
    speakQuery: 'बोलकर खोजें (हिंदी / Tamil / English)',
    reportHazard: 'सुरक्षा खतरे की सूचना दें',
    anonymousNote: 'पहचान पूरी तरह गोपनीय',
    listenPayslip: 'वेतन पर्ची सुनें',
    skills: 'डिजिटल कौशल पासपोर्ट',
    homeTab: 'शिफ्ट घड़ी',
    payTab: 'वेतन पर्ची',
    safetyTab: 'सुरक्षा खतरा',
    passportTab: 'कौशल कार्ड',
    listening: 'सुन रहे हैं... कृपया स्पष्ट बोलें',
    tapToSpeak: 'बोलने के लिए दबाएं',
    voiceSubtitle: '"वेतन", "खतरा", "घंटे" या "कौशल" बोलें',
    fatigueWarning: 'थकान और अधिक समय की चेतावनी',
    overtimeRateActive: 'शिफ्ट मानक सीमा से अधिक हो गई है। ओवरटाइम दर लागू है।',
    regularPay: 'मूल मजदूरी',
    overtimePay: 'ओवरटाइम राशि (OT)',
    deductions: 'पीएफ व कल्याण कटौती',
    netPay: 'कुल शुद्ध भुगतान',
    fileGrievance: 'सुरक्षा खतरा / शिकायत दर्ज करें',
    issueCategory: 'खतरे की श्रेणी',
    speakOrType: 'आवाज से बोलें या विवरण लिखें',
    submitComplaint: 'रिपोर्ट जमा करें',
    anonymousToggle: 'गुमनाम भेजें (नाम छुपाएं)',
    successRecorded: 'रिपोर्ट सफलतापूर्वक दर्ज हुई। प्रबंधन को सूचित किया गया।',
    verifiedBadges: 'सत्यापित कौशल (SDG 8)',
    shareBadge: 'कार्यकर्ता क्यूआर साझा करें',
    adminTitle: 'कार्यबल सुरक्षा एवं थकान निगरानी',
    adminSub: 'रियल-टाइम शिफ्ट अनुपालन और शिकायत समाधान बोर्ड',
    activeStaff: 'ड्यूटी पर कुल कर्मचारी',
    inOvertime: 'ओवरटाइम में कर्मचारी',
    fatigueRisk: 'थकान अलर्ट',
    resolveAction: 'समाधान चिन्हित करें',
    resolvedStatus: 'हल किया गया',
    switchIndustry: 'उद्योग बदलें',
    modeWorker: 'श्रमिक पोर्टल',
    modeAdmin: 'प्रबंधक पोर्टल'
  }
};
