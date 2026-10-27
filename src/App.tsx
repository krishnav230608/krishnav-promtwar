import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import PunchClock from './components/Worker/PunchClock';
import VisualPayslip from './components/Worker/VisualPayslip';
import VoiceGrievance from './components/Worker/VoiceGrievance';
import SkillPassport from './components/Worker/SkillPassport';
import FatigueDashboard from './components/Employer/FatigueDashboard';
import GrievanceTriage from './components/Employer/GrievanceTriage';
import VoiceSearchModal from './components/VoiceSearchModal';
import DataModelModal from './components/DataModelModal';
import {
  Mic,
  Clock,
  CreditCard,
  AlertTriangle,
  Award,
  Sparkles,
  HelpCircle,
  Building,
  GraduationCap
} from 'lucide-react';

export default function App() {
  const {
    role,
    industry,
    industryKey,
    lang,
    t,
    activeWorker,
    workerTab,
    setWorkerTab
  } = useApp();

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 flex flex-col font-sans">
      
      {/* Top Bar Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-3.5 sm:px-6 py-4 pb-28 sm:pb-12">
        
        {/* ============================================================ */}
        {/* WORKER VIEW (Mobile-First, High Contrast, Low-Literacy Safe) */}
        {/* ============================================================ */}
        {role === 'worker' && (
          <div className="max-w-xl mx-auto space-y-4">
            
            {/* Multilingual Voice Assistant Trigger Banner */}
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="w-full bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 hover:from-blue-800 hover:to-indigo-800 text-white rounded-2xl p-3.5 sm:p-4 shadow-md flex items-center justify-between text-left transition-all active:scale-[0.98] cursor-pointer border border-blue-600/50"
              aria-label="Open voice search assistant"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-sm shrink-0">
                  <Mic className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs sm:text-sm text-white">
                      {lang === 'ta'
                        ? 'குரல் உதவி (Voice Search)'
                        : lang === 'hi'
                        ? 'बोलकर खोजें (Voice Assistant)'
                        : 'Voice Assistant (Tamil / Hindi / English)'}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <p className="text-[11px] text-blue-100 mt-0.5 line-clamp-1">
                    {t.voiceSubtitle}
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-bold bg-white/20 px-2.5 py-1.5 rounded-lg whitespace-nowrap hidden xs:inline">
                {t.tapToSpeak}
              </span>
            </button>

            {/* Worker Identity Card */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-3 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-slate-900 text-amber-400 font-black text-xs flex items-center justify-center">
                  {activeWorker.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                    {activeWorker.name}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {activeWorker.roleName} · {activeWorker.nationalId}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Standard Rate</span>
                <span className="text-xs font-mono font-bold text-slate-800">₹{industry.hourlyRate}/hr</span>
              </div>
            </div>

            {/* Desktop Tabs (for tablet/laptop preview) */}
            <div className="hidden sm:grid grid-cols-4 gap-2 bg-slate-200/80 p-1.5 rounded-xl text-xs font-bold">
              <button
                onClick={() => setWorkerTab('punch')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  workerTab === 'punch' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>{t.homeTab}</span>
              </button>

              <button
                onClick={() => setWorkerTab('payslip')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  workerTab === 'payslip' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>{t.payTab}</span>
              </button>

              <button
                onClick={() => setWorkerTab('grievance')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  workerTab === 'grievance' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>{t.safetyTab}</span>
              </button>

              <button
                onClick={() => setWorkerTab('passport')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  workerTab === 'passport' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span>{t.passportTab}</span>
              </button>
            </div>

            {/* Active Screen Rendering */}
            <div className="pt-1">
              {workerTab === 'punch' && <PunchClock />}
              {workerTab === 'payslip' && <VisualPayslip />}
              {workerTab === 'grievance' && <VoiceGrievance />}
              {workerTab === 'passport' && <SkillPassport />}
            </div>

            {/* Mobile Bottom Navigation Bar (Fixed for Ergonomic Thumb Navigation) */}
            <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-2xl max-w-lg mx-auto">
              <button
                onClick={() => setWorkerTab('punch')}
                className={`flex flex-col items-center min-w-[56px] py-1 transition-colors ${
                  workerTab === 'punch' ? 'text-emerald-700 font-bold' : 'text-slate-400'
                }`}
              >
                <Clock className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">{t.homeTab}</span>
              </button>

              <button
                onClick={() => setWorkerTab('payslip')}
                className={`flex flex-col items-center min-w-[56px] py-1 transition-colors ${
                  workerTab === 'payslip' ? 'text-blue-700 font-bold' : 'text-slate-400'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">{t.payTab}</span>
              </button>

              {/* Floating Voice Mic Trigger in Nav */}
              <button
                onClick={() => setIsVoiceModalOpen(true)}
                className="w-12 h-12 -mt-5 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform border-2 border-white ring-2 ring-blue-200"
                aria-label="Activate voice search"
              >
                <Mic className="w-6 h-6 text-amber-300" />
              </button>

              <button
                onClick={() => setWorkerTab('grievance')}
                className={`flex flex-col items-center min-w-[56px] py-1 transition-colors ${
                  workerTab === 'grievance' ? 'text-rose-600 font-bold' : 'text-slate-400'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">{t.safetyTab}</span>
              </button>

              <button
                onClick={() => setWorkerTab('passport')}
                className={`flex flex-col items-center min-w-[56px] py-1 transition-colors ${
                  workerTab === 'passport' ? 'text-amber-600 font-bold' : 'text-slate-400'
                }`}
              >
                <Award className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">{t.passportTab}</span>
              </button>
            </nav>

          </div>
        )}

        {/* ============================================================ */}
        {/* EMPLOYER / ADMIN VIEW (Safety Officer & Fatigue Dashboard) */}
        {/* ============================================================ */}
        {role === 'employer' && (
          <div className="space-y-6">
            
            {/* Dashboard Subheader */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  {industryKey === 'construction' ? (
                    <Building className="w-5 h-5 text-amber-600" />
                  ) : (
                    <GraduationCap className="w-5 h-5 text-emerald-600" />
                  )}
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    {industry.employerNoun} Console
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Monitoring: <strong className="text-slate-800">{industry.orgName}</strong> · Standard Safe Shift Limit: {industry.maxShiftHours} Hours
                </p>
              </div>

              <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Compliance Standard</span>
                <span className="font-semibold text-slate-900 text-xs">{industry.complianceStandard}</span>
              </div>
            </div>

            {/* 2-Column Responsive Dashboard Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <FatigueDashboard />
              <GrievanceTriage />
            </div>

          </div>
        )}

      </main>

      {/* Multilingual Voice Assistant Modal */}
      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onNavigate={(tab) => setWorkerTab(tab)}
      />

      {/* Firestore Architecture & Hackathon Data Model Inspector Modal */}
      <DataModelModal />

    </div>
  );
}
