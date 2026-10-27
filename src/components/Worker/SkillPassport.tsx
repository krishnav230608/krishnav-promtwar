import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, QrCode, CheckCircle2, ShieldCheck, Share2, Plus, Download } from 'lucide-react';
import { playTactileFeedbackTone } from '../../utils/voiceAssistant';

export default function SkillPassport() {
  const { activeWorker, industry, t } = useApp();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    playTactileFeedbackTone('success');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Digital Passport Card - Metallic / Dark Identity Aesthetic */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-lg border border-slate-700/60 relative overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded uppercase tracking-wider">
                Portable Skill Passport · SDG 8
              </span>
            </div>
            <h3 className="font-black text-xl tracking-tight text-white">{activeWorker.name}</h3>
            <p className="text-xs text-slate-300 mt-0.5">{activeWorker.roleName}</p>
            <p className="text-[11px] text-slate-400 font-mono mt-1">{activeWorker.nationalId}</p>
          </div>

          {/* QR Code Container */}
          <div className="bg-white p-2 rounded-xl shrink-0 shadow-md flex flex-col items-center">
            {/* SVG QR Code pattern */}
            <svg className="w-16 h-16 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm8-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm11-2h3v3h-3v-3zm3 3h3v3h-3v-3zm-6 2h3v3h-3v-3zm3 3h3v3h-3v-3zm3-5h3v3h-3v-3zM5 5h2v2H5V5zm10 0h2v2h-2V5zM5 17h2v2H5v-2z" />
            </svg>
            <span className="text-[9px] font-bold text-slate-700 uppercase tracking-tight mt-0.5">
              Verify
            </span>
          </div>
        </div>

        {/* Credentials List */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              {t.verifiedBadges}
            </span>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Blockchain Authenticated
            </span>
          </div>

          <div className="space-y-2">
            {activeWorker.skills.map((skill, index) => (
              <div
                key={index}
                className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-100 block">{skill.title}</span>
                    <span className="text-[10px] text-slate-400">
                      {skill.issuer} · Issued {skill.date}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-amber-300 font-semibold px-2 py-0.5 bg-amber-400/10 rounded">
                  {skill.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-4 pt-3 flex items-center justify-between text-xs">
          <span className="text-[10px] text-slate-400">
            Registered: <strong className="text-slate-200">{industry.orgName}</strong>
          </span>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-all shadow active:scale-95 cursor-pointer text-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Link Copied!' : t.shareBadge}</span>
          </button>
        </div>

      </div>

      {/* Explanatory Benefit Box for Judging & Social Impact */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900 space-y-1">
        <p className="font-bold flex items-center gap-1.5 text-blue-950">
          <Award className="w-4 h-4 text-blue-700" />
          SDG 8.5 & 8.8 Impact: Portable Career Capital
        </p>
        <p className="text-[11px] text-blue-800 leading-relaxed">
          Frontline workers often start from zero wage rates when shifting contractors. With ShramikSetu Skill Passport, certified scaffolding, chemical safety, or heavy machinery hours are permanently credited to their verifiable digital identity.
        </p>
      </div>

    </div>
  );
}
