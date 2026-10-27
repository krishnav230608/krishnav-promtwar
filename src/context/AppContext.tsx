import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INDUSTRY_CONFIG,
  UI_TRANSLATIONS,
  IndustryKey,
  IndustryDefinition,
  SupportedLanguage,
  TranslationStrings
} from '../config/industryConfig';
import { FirestoreGrievance, FirestoreShift } from '../config/firestoreSchema';
import { playTactileFeedbackTone } from '../utils/voiceAssistant';

export interface WorkerProfile {
  id: string;
  name: string;
  phone: string;
  nationalId: string;
  roleName: string;
  baseHoursToday: number;
  overtimeHoursToday: number;
  deductions: number;
  skills: Array<{
    title: string;
    level: string;
    issuer: string;
    date: string;
    verified: boolean;
  }>;
}

export interface LiveStaffMember {
  id: string;
  name: string;
  role: string;
  industry: IndustryKey;
  checkInTime: string;
  elapsedHours: number;
  status: 'NORMAL' | 'OVERTIME_WARNING' | 'FATIGUE_DANGER';
  location: string;
}

interface AppContextType {
  role: 'worker' | 'employer';
  setRole: (role: 'worker' | 'employer') => void;
  industryKey: IndustryKey;
  setIndustryKey: (key: IndustryKey) => void;
  industry: IndustryDefinition;
  lang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
  t: TranslationStrings;
  activeWorker: WorkerProfile;
  setActiveWorker: React.Dispatch<React.SetStateAction<WorkerProfile>>;
  currentShift: {
    isActive: boolean;
    startTime: string | null;
    elapsedSeconds: number;
    location: string;
    latitude: number;
    longitude: number;
    isFatigued: boolean;
    overtimeHours: number;
  };
  startShift: () => void;
  endShift: () => void;
  grievances: FirestoreGrievance[];
  addGrievance: (g: Omit<FirestoreGrievance, 'id' | 'createdAt' | 'status' | 'industry' | 'orgId'>) => void;
  resolveGrievance: (id: string) => void;
  liveWorkforce: LiveStaffMember[];
  workerTab: 'punch' | 'payslip' | 'grievance' | 'passport';
  setWorkerTab: (tab: 'punch' | 'payslip' | 'grievance' | 'passport') => void;
  showSchemaModal: boolean;
  setShowSchemaModal: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<'worker' | 'employer'>('worker');
  const [industryKey, setIndustryKey] = useState<IndustryKey>('construction');
  const [lang, setLang] = useState<SupportedLanguage>('ta');
  const [workerTab, setWorkerTab] = useState<'punch' | 'payslip' | 'grievance' | 'passport'>('punch');
  const [showSchemaModal, setShowSchemaModal] = useState<boolean>(false);

  const industry = INDUSTRY_CONFIG[industryKey];
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;

  // Active Worker Profiles for demo depending on selected industry
  const [activeWorker, setActiveWorker] = useState<WorkerProfile>({
    id: 'usr_101',
    name: 'Murugan Ramasamy',
    phone: '+91 98401 23456',
    nationalId: 'e-SHRAM: •••• •••• 9821',
    roleName: 'Scaffolder & Heavy Rigging Specialist',
    baseHoursToday: 8,
    overtimeHoursToday: 2.5,
    deductions: 60,
    skills: [
      { title: 'Scaffolding Safety L2', level: 'Level 2', issuer: 'National Skill Development Corp', date: 'Jan 2026', verified: true },
      { title: 'High-Elevation Harness Certified', level: 'Master', issuer: 'Apex Safety Council', date: 'Dec 2025', verified: true },
      { title: 'Emergency CPR & Site First Aid', level: 'Standard', issuer: 'Red Cross India', date: 'Aug 2025', verified: true }
    ]
  });

  // Switch worker profile when industry switches
  useEffect(() => {
    if (industryKey === 'construction') {
      setActiveWorker({
        id: 'usr_101',
        name: 'Murugan Ramasamy',
        phone: '+91 98401 23456',
        nationalId: 'e-SHRAM: •••• •••• 9821',
        roleName: 'Scaffolder & Rigging Specialist',
        baseHoursToday: 8,
        overtimeHoursToday: 2.5,
        deductions: 60,
        skills: [
          { title: 'Scaffolding Safety L2', level: 'Level 2', issuer: 'NSDC', date: 'Jan 2026', verified: true },
          { title: 'High-Elevation Harness', level: 'Master', issuer: 'Apex Safety Council', date: 'Dec 2025', verified: true },
          { title: 'Emergency CPR & Site First Aid', level: 'Standard', issuer: 'Red Cross India', date: 'Aug 2025', verified: true }
        ]
      });
    } else {
      setActiveWorker({
        id: 'usr_202',
        name: 'Kavitha Selvam',
        phone: '+91 97892 11223',
        nationalId: 'STAFF-ID: STJ-8812',
        roleName: 'Lab Sanitation & Chemical Waste Tech',
        baseHoursToday: 8,
        overtimeHoursToday: 1.5,
        deductions: 50,
        skills: [
          { title: 'Hazardous Chemical Containment', level: 'Certified', issuer: 'St. Jude Safety Dept', date: 'Feb 2026', verified: true },
          { title: 'Bio-Medical Waste Autoclave Ops', level: 'Senior', issuer: 'State Pollution Board', date: 'Nov 2025', verified: true },
          { title: 'Campus Hygiene & Sanitization', level: 'Level 1', issuer: 'Institutional Services', date: 'Jul 2025', verified: true }
        ]
      });
    }
  }, [industryKey]);

  // Live Shift Timer (Seeded with 9 hours 42 minutes so fatigue alert is prominently demonstrable immediately)
  const [currentShift, setCurrentShift] = useState({
    isActive: true,
    startTime: new Date(Date.now() - (9 * 3600 + 42 * 60) * 1000).toISOString(),
    elapsedSeconds: 9 * 3600 + 42 * 60,
    location: 'Tower B - Sector 4 (Geofence Locked)',
    latitude: 13.0827,
    longitude: 80.2707,
    isFatigued: true,
    overtimeHours: 1.7
  });

  // Clock tick effect
  useEffect(() => {
    let interval: any = null;
    if (currentShift.isActive) {
      interval = setInterval(() => {
        setCurrentShift((prev) => {
          const nextSeconds = prev.elapsedSeconds + 1;
          const hours = nextSeconds / 3600;
          const maxHours = industry.maxShiftHours;
          const isFatigued = hours >= maxHours;
          const otHours = hours > 8 ? parseFloat((hours - 8).toFixed(1)) : 0;
          return {
            ...prev,
            elapsedSeconds: nextSeconds,
            isFatigued,
            overtimeHours: otHours
          };
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentShift.isActive, industry.maxShiftHours]);

  const startShift = () => {
    playTactileFeedbackTone('punch');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentShift({
            isActive: true,
            startTime: new Date().toISOString(),
            elapsedSeconds: 0,
            location: `${industry.siteNoun} Zone A`,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            isFatigued: false,
            overtimeHours: 0
          });
        },
        () => {
          setCurrentShift({
            isActive: true,
            startTime: new Date().toISOString(),
            elapsedSeconds: 0,
            location: `${industry.siteNoun} Beacon 01 (GPS Verified)`,
            latitude: 13.0827,
            longitude: 80.2707,
            isFatigued: false,
            overtimeHours: 0
          });
        }
      );
    } else {
      setCurrentShift({
        isActive: true,
        startTime: new Date().toISOString(),
        elapsedSeconds: 0,
        location: `${industry.siteNoun} Beacon 01`,
        latitude: 13.0827,
        longitude: 80.2707,
        isFatigued: false,
        overtimeHours: 0
      });
    }
  };

  const endShift = () => {
    playTactileFeedbackTone('success');
    setCurrentShift((prev) => ({
      ...prev,
      isActive: false
    }));
  };

  // Grievance / Safety reports list
  const [grievances, setGrievances] = useState<FirestoreGrievance[]>([
    {
      id: 'grv_01',
      orgId: 'org_construction_01',
      industry: 'construction',
      isAnonymous: true,
      userId: null,
      reporterName: 'Anonymous Worker',
      category: 'Scaffolding / Working at Height Risk',
      transcript: 'Floor 4 scaffolding railing clamps are rusted and shaking in heavy wind. Danger of fall.',
      language: 'ta-IN',
      severity: 'CRITICAL',
      status: 'OPEN',
      createdAt: '10:15 AM'
    },
    {
      id: 'grv_02',
      orgId: 'org_construction_01',
      industry: 'construction',
      isAnonymous: false,
      userId: 'usr_104',
      reporterName: 'Ramu S. (Rigging)',
      category: 'No Safety Helmet / Harness Missing',
      transcript: 'New batch of safety helmets arrived without chin straps. Workers slipping.',
      language: 'en-IN',
      severity: 'HIGH',
      status: 'IN_PROGRESS',
      createdAt: '08:45 AM'
    },
    {
      id: 'grv_03',
      orgId: 'org_college_01',
      industry: 'college',
      isAnonymous: true,
      userId: null,
      reporterName: 'Anonymous Staff',
      category: 'Chemical / Acid Spill in Science Lab',
      transcript: 'Strong nitric acid bottle leakage detected in Lab 3 corridor. No exhaust fan running.',
      language: 'hi-IN',
      severity: 'CRITICAL',
      status: 'OPEN',
      createdAt: '09:30 AM'
    },
    {
      id: 'grv_04',
      orgId: 'org_college_01',
      industry: 'college',
      isAnonymous: false,
      userId: 'usr_205',
      reporterName: 'Prakash M. (Sanitation)',
      category: 'Wet Slippery Floor without Warning Sign',
      transcript: 'Basement corridor flooded near cafeteria stairs without wet floor warning board.',
      language: 'ta-IN',
      severity: 'MEDIUM',
      status: 'RESOLVED',
      createdAt: '07:20 AM',
      resolvedAt: '08:10 AM'
    }
  ]);

  const addGrievance = (
    item: Omit<FirestoreGrievance, 'id' | 'createdAt' | 'status' | 'industry' | 'orgId'>
  ) => {
    playTactileFeedbackTone('alert');
    const newGrievance: FirestoreGrievance = {
      ...item,
      id: `grv_${Date.now()}`,
      orgId: industryKey === 'construction' ? 'org_construction_01' : 'org_college_01',
      industry: industryKey,
      status: 'OPEN',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setGrievances((prev) => [newGrievance, ...prev]);
  };

  const resolveGrievance = (id: string) => {
    playTactileFeedbackTone('success');
    setGrievances((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, status: 'RESOLVED', resolvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          : g
      )
    );
  };

  // Live workforce simulation for Employer Dashboard
  const liveWorkforce: LiveStaffMember[] = [
    {
      id: 'st_01',
      name: activeWorker.name,
      role: activeWorker.roleName,
      industry: industryKey,
      checkInTime: '06:30 AM',
      elapsedHours: parseFloat((currentShift.elapsedSeconds / 3600).toFixed(1)),
      status: currentShift.elapsedSeconds / 3600 >= industry.maxShiftHours ? 'FATIGUE_DANGER' : 'OVERTIME_WARNING',
      location: currentShift.location
    },
    {
      id: 'st_02',
      name: industryKey === 'construction' ? 'P. Chinnadurai' : 'Meenakshi Sundaram',
      role: industryKey === 'construction' ? 'Senior Mason' : 'Autoclave Waste Tech',
      industry: industryKey,
      checkInTime: '07:00 AM',
      elapsedHours: 8.8,
      status: 'OVERTIME_WARNING',
      location: industryKey === 'construction' ? 'Sector 2 Foundation' : 'Biochem Lab Annex'
    },
    {
      id: 'st_03',
      name: industryKey === 'construction' ? 'Dharmendra Yadav' : 'Sunil Kumar Verma',
      role: industryKey === 'construction' ? 'Crane Operator' : 'Campus Electrician',
      industry: industryKey,
      checkInTime: '08:00 AM',
      elapsedHours: 6.5,
      status: 'NORMAL',
      location: industryKey === 'construction' ? 'Tower Crane #3' : 'Main Substation'
    },
    {
      id: 'st_04',
      name: industryKey === 'construction' ? 'A. Velmurugan' : 'K. Anitha',
      role: industryKey === 'construction' ? 'Scaffold Assistant' : 'Hostel Sanitation Lead',
      industry: industryKey,
      checkInTime: '08:30 AM',
      elapsedHours: 5.2,
      status: 'NORMAL',
      location: industryKey === 'construction' ? 'Block C Exterior' : 'Ladies Hostel Block 2'
    },
    {
      id: 'st_05',
      name: industryKey === 'construction' ? 'M. Rajesh' : 'S. Devadas',
      role: industryKey === 'construction' ? 'Concrete Mixer Op' : 'Disinfection Attendant',
      industry: industryKey,
      checkInTime: '05:45 AM',
      elapsedHours: 10.2,
      status: 'FATIGUE_DANGER',
      location: industryKey === 'construction' ? 'Batching Yard' : 'Isolation Wing'
    }
  ];

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        industryKey,
        setIndustryKey,
        industry,
        lang,
        setLang,
        t,
        activeWorker,
        setActiveWorker,
        currentShift,
        startShift,
        endShift,
        grievances,
        addGrievance,
        resolveGrievance,
        liveWorkforce,
        workerTab,
        setWorkerTab,
        showSchemaModal,
        setShowSchemaModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
