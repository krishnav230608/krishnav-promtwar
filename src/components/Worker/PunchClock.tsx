import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, MapPin, AlertTriangle, ShieldCheck, CheckCircle2, Flame, LogOut } from 'lucide-react';

export default function PunchClock() {
  const { currentShift, startShift, endShift, industry, t, activeWorker } = useApp();

  const totalSeconds = currentShift.elapsedSeconds;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const regularMax = 8;
  const overtimeHours = hours >= regularMax ? parseFloat((hours - regularMax + minutes / 60).toFixed(1)) : 0;
  const isFatigued = hours >= industry.maxShiftHours;

  // Percentage for progress bar capped at 12 hours
  const progressPercent = Math.min(100, Math.round((totalSeconds / (industry.maxShiftHours * 3600)) * 100));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-5">
      
      {/* Top Location & Duty Bar */}
      <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5 text-slate-600 font-medium truncate">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">{currentShift.location}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              currentShift.isActive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${currentShift.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            {currentShift.isActive ? t.onDuty : t.offDuty}
          </span>
        </div>
      </div>

      {/* Main Clock Face */}
      <div className="text-center py-2">
        <div className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 font-mono tabular-nums leading-none">
          {String(hours).padStart(2, '0')}
          <span className="text-slate-300">:</span>
          {String(minutes).padStart(2, '0')}
          <span className="text-slate-300">:</span>
          <span className="text-2xl sm:text-3xl text-slate-400 font-normal">
            {String(seconds).padStart(2, '0')}
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-2">
          {t.hoursWorked} · {industry.siteNoun}
        </p>

        {/* Shift Progress Visual Indicator */}
        <div className="max-w-xs mx-auto mt-4">
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isFatigued
                  ? 'bg-rose-500'
                  : hours >= regularMax
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>0h</span>
            <span>8h (Normal)</span>
            <span>{industry.maxShiftHours}h (Max Safe)</span>
          </div>
        </div>
      </div>

      {/* Fatigue Warning Callout */}
      {currentShift.isActive && isFatigued && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-left flex items-start gap-3">
          <div className="p-1.5 bg-rose-100 rounded-lg text-rose-700 shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-xs text-rose-950">
            <p className="font-bold">{t.fatigueWarning} ({industry.maxShiftHours}+ hrs)</p>
            <p className="text-[11px] text-rose-800 mt-0.5 leading-snug">
              {t.overtimeRateActive} {industry.complianceStandard} requires mandatory rest intervals.
            </p>
          </div>
        </div>
      )}

      {/* Overtime Metric Box */}
      {currentShift.isActive && overtimeHours > 0 && !isFatigued && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-amber-900 font-semibold">
            <Flame className="w-4 h-4 text-amber-600" />
            <span>Overtime Accrued Today:</span>
          </div>
          <span className="font-mono font-bold text-amber-950 text-sm">+{overtimeHours} hrs (1.5× rate)</span>
        </div>
      )}

      {/* Big Touch Hitbox 1-Tap Action Button */}
      <div className="pt-2">
        {currentShift.isActive ? (
          <button
            onClick={endShift}
            className="w-full min-h-[56px] py-4 px-6 rounded-xl font-bold text-sm sm:text-base text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>{t.punchOut}</span>
          </button>
        ) : (
          <button
            onClick={startShift}
            className="w-full min-h-[56px] py-4 px-6 rounded-xl font-bold text-sm sm:text-base text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Clock className="w-5 h-5" />
            <span>{t.punchIn}</span>
          </button>
        )}
      </div>

      {/* Trust & Compliance Marker */}
      <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Geo-verified Proof of Work</span>
        </span>
        <span className="font-mono">Rate: ₹{industry.hourlyRate}/hr</span>
      </div>

    </div>
  );
}
