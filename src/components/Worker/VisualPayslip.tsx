import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Volume2, VolumeX, CheckCircle2, ArrowDownRight, IndianRupee, HelpCircle } from 'lucide-react';
import { speakAloud, getLangLocale } from '../../utils/voiceAssistant';

export default function VisualPayslip() {
  const { activeWorker, industry, lang, t } = useApp();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const baseRate = industry.hourlyRate;
  const overtimeRate = Math.round(baseRate * industry.overtimeMultiplier);

  const baseHours = 40; // weekly regular
  const overtimeHours = 7.5; // weekly overtime
  const basePay = baseHours * baseRate;
  const overtimePay = Math.round(overtimeHours * overtimeRate);
  const deductions = 180; // Provident fund + welfare
  const netSalary = basePay + overtimePay - deductions;

  const currentLocale = getLangLocale(lang);

  const handleReadAloud = async () => {
    if (isPlayingAudio) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);

    let script = '';
    if (lang === 'ta') {
      script = `வணக்கம் ${activeWorker.name}. உங்கள் இந்த வார சம்பள விவரம்: வழக்கமான நாற்பது மணிநேரத்திற்கு ரூபாய் ${basePay}. கூடுதல் நேரம் ஏழு புள்ளி ஐந்து மணிநேரத்திற்கு ரூபாய் ${overtimePay}. நலத்திட்ட பிடித்தம் ரூபாய் ${deductions}. உங்கள் வங்கிக் கணக்கில் வரவு வைக்கப்பட்ட நிகர சம்பளம் ரூபாய் ${netSalary}.`;
    } else if (lang === 'hi') {
      script = `नमस्ते ${activeWorker.name}। आपकी इस सप्ताह की वेतन पर्ची: नियमित 40 घंटों के लिए ${basePay} रुपये। 7.5 घंटे ओवरटाइम के लिए ${overtimePay} रुपये। पीएफ कटौती ${deductions} रुपये। आपके खाते में जमा कुल शुद्ध वेतन ${netSalary} रुपये है।`;
    } else {
      script = `Hello ${activeWorker.name}. Your weekly wage breakdown: Regular 40 hours pay is ${basePay} rupees. Overtime 7.5 hours pay is ${overtimePay} rupees. Welfare deduction is ${deductions} rupees. Your total take-home pay transferred is ${netSalary} rupees.`;
    }

    await speakAloud(script, currentLocale);
    setIsPlayingAudio(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-5">
      
      {/* Payslip Header with 1-Tap Audio Read */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            {t.payTab} · Week 43 (Oct 2026)
          </h3>
          <p className="text-xs text-slate-500">
            {activeWorker.name} · {industry.workerNoun}
          </p>
        </div>

        <button
          onClick={handleReadAloud}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 active:scale-95 cursor-pointer ${
            isPlayingAudio
              ? 'bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          aria-label="Listen to salary breakdown in selected language"
        >
          {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{isPlayingAudio ? 'Stop' : t.listenPayslip}</span>
        </button>
      </div>

      {/* Visual Pay Blocks with High Contrast */}
      <div className="space-y-3">
        
        {/* Regular Wages */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="font-bold text-slate-900 text-xs sm:text-sm">{t.regularPay}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {baseHours} hrs × ₹{baseRate}/hr
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm sm:text-base font-bold text-slate-900 font-mono tabular-nums">
              ₹{basePay.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Overtime Wages */}
        <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="font-bold text-amber-950 text-xs sm:text-sm">{t.overtimePay}</span>
            </div>
            <p className="text-[11px] text-amber-800 mt-0.5">
              {overtimeHours} hrs × ₹{overtimeRate}/hr (1.5× rate)
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm sm:text-base font-bold text-amber-950 font-mono tabular-nums">
              +₹{overtimePay.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Welfare Deductions */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span className="font-bold text-slate-800 text-xs sm:text-sm">{t.deductions}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              EPF / BOCW Welfare Board Contribution
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm sm:text-base font-bold text-rose-700 font-mono tabular-nums">
              -₹{deductions}
            </span>
          </div>
        </div>

      </div>

      {/* Net Salary Highlight Box */}
      <div className="p-4 sm:p-5 bg-slate-950 text-white rounded-xl flex items-center justify-between shadow-md">
        <div>
          <span className="text-[10px] sm:text-xs text-slate-300 font-semibold uppercase tracking-wider block">
            {t.netPay}
          </span>
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs mt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="font-medium">Direct Bank Transfer Completed</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tabular-nums">
            ₹{netSalary.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">Account: •••• 4012</span>
        </div>
      </div>

      {/* Daily Shift Attendance Breakdown */}
      <div className="pt-2">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Daily Log (Mon – Sat)
        </h4>
        <div className="divide-y divide-slate-100 text-xs border border-slate-100 rounded-xl overflow-hidden">
          {[
            { day: 'Mon, Oct 20', hours: '8.0h', ot: '1.5h OT', earn: `₹${8 * baseRate + Math.round(1.5 * overtimeRate)}` },
            { day: 'Tue, Oct 21', hours: '8.0h', ot: '0.0h', earn: `₹${8 * baseRate}` },
            { day: 'Wed, Oct 22', hours: '8.0h', ot: '2.0h OT', earn: `₹${8 * baseRate + Math.round(2.0 * overtimeRate)}` },
            { day: 'Thu, Oct 23', hours: '8.0h', ot: '2.5h OT', earn: `₹${8 * baseRate + Math.round(2.5 * overtimeRate)}` },
            { day: 'Fri, Oct 24', hours: '8.0h', ot: '1.5h OT', earn: `₹${8 * baseRate + Math.round(1.5 * overtimeRate)}` },
          ].map((shift, i) => (
            <div key={i} className="py-2 px-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <span className="text-slate-700 font-medium">{shift.day}</span>
              <div className="flex items-center gap-3">
                <span className="text-slate-500 font-mono">{shift.hours}</span>
                {shift.ot !== '0.0h' ? (
                  <span className="text-amber-800 font-bold text-[11px] bg-amber-50 px-1.5 py-0.5 rounded">
                    {shift.ot}
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px]">No OT</span>
                )}
                <span className="font-bold text-slate-900 font-mono w-14 text-right">{shift.earn}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
