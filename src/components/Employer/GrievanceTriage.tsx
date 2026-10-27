import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Volume2, CheckCircle2, ShieldCheck, UserCheck, AlertOctagon, Filter, Eye } from 'lucide-react';
import { speakAloud } from '../../utils/voiceAssistant';

export default function GrievanceTriage() {
  const { grievances, resolveGrievance, industryKey, industry, t } = useApp();
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'RESOLVED'>('ALL');
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Filter for active industry
  const filteredGrievances = grievances
    .filter((g) => g.industry === industryKey)
    .filter((g) => {
      if (statusFilter === 'ALL') return true;
      return g.status === statusFilter;
    });

  const handlePlayVoice = (id: string, text: string, lang: string) => {
    if (playingId === id) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setPlayingId(null);
      return;
    }

    setPlayingId(id);
    speakAloud(text, lang || 'en-IN').then(() => {
      setPlayingId(null);
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden space-y-0">
      
      {/* Triage Header */}
      <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-rose-600" />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Safety Grievance & Hazard Queue ({industry.siteNoun})
          </h4>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-lg text-xs">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('OPEN')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              statusFilter === 'OPEN' ? 'bg-white text-rose-700 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter('RESOLVED')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              statusFilter === 'RESOLVED' ? 'bg-white text-emerald-800 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* Incidents List */}
      <div className="divide-y divide-slate-100">
        {filteredGrievances.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No incidents found for this filter.
          </div>
        ) : (
          filteredGrievances.map((item) => (
            <div key={item.id} className="p-4 space-y-2.5 hover:bg-slate-50/50 transition-colors">
              
              {/* Category + Severity + Timestamp */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-rose-900 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-md">
                    {item.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.severity === 'CRITICAL'
                        ? 'bg-rose-600 text-white'
                        : item.severity === 'HIGH'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.severity}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">{item.createdAt}</span>
              </div>

              {/* Spoken Transcript / Complaint Text */}
              <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                "{item.transcript}"
              </p>

              {/* Footer Controls: Audio Playback, Identity, Resolve Action */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                
                {/* Privacy / Reporter Badge */}
                <div className="flex items-center gap-1.5 text-xs">
                  {item.isAnonymous ? (
                    <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Anonymous Identity Protected
                    </span>
                  ) : (
                    <span className="text-slate-600 text-[11px] font-medium">
                      Reporter: <strong className="text-slate-900">{item.reporterName}</strong>
                    </span>
                  )}
                </div>

                {/* Audio Listen & Resolve Action */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePlayVoice(item.id, item.transcript, item.language)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      playingId === item.id
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                    title="Listen to recorded incident voice audio"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{playingId === item.id ? 'Stop' : 'Play Audio'}</span>
                  </button>

                  {item.status === 'OPEN' ? (
                    <button
                      onClick={() => resolveGrievance(item.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
                    >
                      {t.resolveAction}
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      {t.resolvedStatus} ({item.resolvedAt || 'Resolved'})
                    </span>
                  )}
                </div>

              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
