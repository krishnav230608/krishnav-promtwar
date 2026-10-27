import React from 'react';
import { useApp } from '../context/AppContext';
import { HardHat, GraduationCap, Globe, ShieldAlert, User, Database } from 'lucide-react';
import { SupportedLanguage } from '../config/industryConfig';

export default function Navbar() {
  const {
    role,
    setRole,
    industryKey,
    setIndustryKey,
    lang,
    setLang,
    industry,
    setShowSchemaModal
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-sm">
            {industryKey === 'construction' ? (
              <HardHat className="w-5 h-5 text-slate-950" />
            ) : (
              <GraduationCap className="w-5 h-5 text-slate-950" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight leading-tight">ShramikSetu</span>
            <span className="text-[10px] text-slate-400 font-medium truncate max-w-[140px] sm:max-w-none">
              {industry.orgName}
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation & Config Selectors */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-1">
          {/* Industry Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-[11px] text-slate-400 hidden lg:inline">Sector:</span>
            <select
              value={industryKey}
              onChange={(e) => setIndustryKey(e.target.value as any)}
              className="bg-transparent text-amber-300 font-semibold focus:outline-none cursor-pointer text-xs"
              title="Select Industry Context"
            >
              <option value="construction" className="bg-slate-900 text-white">Construction Site</option>
              <option value="college" className="bg-slate-900 text-white">College Campus</option>
            </select>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as SupportedLanguage)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
              title="Select Regional Language"
            >
              <option value="ta" className="bg-slate-900 text-white">தமிழ் (Tamil)</option>
              <option value="hi" className="bg-slate-900 text-white">हिंदी (Hindi)</option>
              <option value="en" className="bg-slate-900 text-white">English</option>
            </select>
          </div>

          {/* Architecture / Schema Viewer for Hackathon evaluation */}
          <button
            onClick={() => setShowSchemaModal(true)}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 transition-colors whitespace-nowrap"
            title="Inspect Firestore Data Model & Architecture"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Architecture</span>
          </button>
        </div>

        {/* Zone 3: Primary Action / Role Toggle */}
        <div className="flex items-center shrink-0">
          <button
            onClick={() => setRole(role === 'worker' ? 'employer' : 'worker')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all shadow-sm whitespace-nowrap active:scale-95 ${
              role === 'worker'
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {role === 'worker' ? (
              <>
                <User className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Worker Portal</span>
                <span className="text-[10px] opacity-75">Switch</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Supervisor View</span>
                <span className="text-[10px] opacity-75">Switch</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
