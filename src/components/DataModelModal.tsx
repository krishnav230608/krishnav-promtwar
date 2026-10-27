import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Database, Shield, Sliders, Code2, Copy, Check } from 'lucide-react';
import { FIRESTORE_RULES_SNIPPET } from '../config/firestoreSchema';
import { INDUSTRY_CONFIG } from '../config/industryConfig';

export default function DataModelModal() {
  const { showSchemaModal, setShowSchemaModal, industryKey, grievances, activeWorker, currentShift } = useApp();
  const [activeTab, setActiveTab] = useState<'schema' | 'rules' | 'config' | 'liveJson'>('schema');
  const [copied, setCopied] = useState(false);

  if (!showSchemaModal) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleCollections = [
    {
      collection: 'organizations',
      description: 'Defines sector-specific compliance rules, wage baselines, and safety hazards.',
      sampleDoc: {
        id: `org_${industryKey}_01`,
        name: INDUSTRY_CONFIG[industryKey].orgName,
        industry: industryKey,
        maxShiftHours: INDUSTRY_CONFIG[industryKey].maxShiftHours,
        baseHourlyRate: INDUSTRY_CONFIG[industryKey].hourlyRate,
        overtimeMultiplier: INDUSTRY_CONFIG[industryKey].overtimeMultiplier,
        hazardCategories: INDUSTRY_CONFIG[industryKey].hazards
      }
    },
    {
      collection: 'users',
      description: 'Stores frontline worker profiles, verified credentials, and preferred languages.',
      sampleDoc: {
        id: activeWorker.id,
        name: activeWorker.name,
        preferredLanguage: 'ta',
        role: activeWorker.roleName,
        skillsCount: activeWorker.skills.length,
        skills: activeWorker.skills
      }
    },
    {
      collection: 'shifts',
      description: 'GPS-locked shifts, real-time hours tracking, and automated fatigue flags.',
      sampleDoc: {
        id: 'shift_active_01',
        workerId: activeWorker.id,
        checkIn: currentShift.startTime,
        elapsedHours: parseFloat((currentShift.elapsedSeconds / 3600).toFixed(2)),
        fatigueFlag: currentShift.isFatigued,
        location: currentShift.location
      }
    },
    {
      collection: 'grievances',
      description: 'Safety hazards and anonymous voice complaints with identity stripping.',
      sampleDoc: grievances[0] || {}
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 text-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                Technical Architecture & Firestore Data Model
              </h3>
              <p className="text-xs text-slate-400">
                SDG 8 Compliant · Zero-Fork Multi-Tenant Configuration
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowSchemaModal(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-2 bg-slate-950/60 border-b border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'schema' ? 'bg-slate-800 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Firestore Collections</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'rules' ? 'bg-slate-800 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Security Rules</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'config' ? 'bg-slate-800 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Multi-Industry Config</span>
          </button>

          <button
            onClick={() => setActiveTab('liveJson')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'liveJson' ? 'bg-slate-800 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Live State JSON</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 font-mono text-xs text-slate-300 space-y-4">
          
          {activeTab === 'schema' && (
            <div className="space-y-4 font-sans">
              <p className="text-xs text-slate-400">
                The database schema is organized into 4 primary collections ensuring high read speed on 2G/3G low-end devices:
              </p>
              <div className="grid gap-3">
                {sampleCollections.map((col, idx) => (
                  <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-amber-400 text-xs">/{col.collection}</span>
                      <span className="text-[10px] text-slate-500 font-sans">{col.description}</span>
                    </div>
                    <pre className="text-[11px] text-slate-300 overflow-x-auto p-2 bg-slate-900/60 rounded">
                      {JSON.stringify(col.sampleDoc, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between font-sans text-xs">
                <span className="text-slate-400">
                  firestore.rules — Enforces anonymous protection & worker isolation:
                </span>
                <button
                  onClick={() => handleCopy(FIRESTORE_RULES_SNIPPET)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto text-[11px] leading-relaxed text-emerald-300 font-mono">
                {FIRESTORE_RULES_SNIPPET}
              </pre>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-3">
              <p className="font-sans text-xs text-slate-400">
                How one codebase serves Construction and Colleges without forks:
              </p>
              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto text-[11px] text-amber-300 font-mono">
                {JSON.stringify(INDUSTRY_CONFIG, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === 'liveJson' && (
            <div className="space-y-3">
              <p className="font-sans text-xs text-slate-400">
                Current in-memory reactive application state:
              </p>
              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto text-[11px] text-blue-300 font-mono">
                {JSON.stringify(
                  {
                    industryKey,
                    currentShift,
                    activeWorker,
                    grievancesCount: grievances.length,
                    latestGrievance: grievances[0]
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
