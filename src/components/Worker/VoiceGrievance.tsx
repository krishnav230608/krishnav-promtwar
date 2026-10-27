import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Mic, MicOff, Send, ShieldCheck, ShieldAlert, CheckCircle2, AlertOctagon } from 'lucide-react';
import { FrontlineSpeechRecognizer, getLangLocale, playTactileFeedbackTone } from '../../utils/voiceAssistant';

export default function VoiceGrievance() {
  const { industry, addGrievance, lang, t, activeWorker } = useApp();

  const [category, setCategory] = useState(industry.hazards[0]);
  const [transcript, setTranscript] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');
  const recognizerRef = useRef<FrontlineSpeechRecognizer | null>(null);

  const currentLocale = getLangLocale(lang);

  const handleToggleRecord = () => {
    if (isRecording) {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    setErrorNotice('');
    setIsRecording(true);
    playTactileFeedbackTone('punch');

    const recognizer = new FrontlineSpeechRecognizer(
      currentLocale,
      (text) => {
        setTranscript((prev) => (prev ? `${prev} ${text}` : text));
        setIsRecording(false);
        playTactileFeedbackTone('success');
      },
      (error) => {
        setIsRecording(false);
        setErrorNotice(`Speech input note: ${error}. You may type the complaint below.`);
      },
      () => {
        setIsRecording(false);
      }
    );

    recognizerRef.current = recognizer;
    recognizer.start();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim()) {
      setErrorNotice('Please speak or type the hazard details.');
      return;
    }

    addGrievance({
      isAnonymous,
      userId: isAnonymous ? null : activeWorker.id,
      reporterName: isAnonymous ? 'Anonymous Frontline Worker' : `${activeWorker.name} (${activeWorker.phone})`,
      category,
      transcript: transcript.trim(),
      language: currentLocale as any,
      severity: category.toLowerCase().includes('chemical') || category.toLowerCase().includes('scaffold') ? 'CRITICAL' : 'HIGH'
    });

    setSubmitted(true);
    setTranscript('');
    setErrorNotice('');

    setTimeout(() => {
      setSubmitted(false);
    }, 3500);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {t.fileGrievance}
            </h3>
            <p className="text-xs text-slate-500">
              {industry.orgName} · Zero-Retaliation Policy
            </p>
          </div>
        </div>
      </div>

      {submitted ? (
        <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2 animate-in zoom-in-95 duration-200">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h4 className="font-bold text-emerald-950 text-sm">
            {t.successRecorded}
          </h4>
          <p className="text-xs text-emerald-800">
            {isAnonymous
              ? 'Your identity was fully masked. The site safety team has received the alert.'
              : 'Report submitted. You can track this under incident resolution.'}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Industry Specific Hazard Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.issueCategory}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl p-3 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {industry.hazards.map((h, i) => (
                <option key={i} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          {/* Voice Memo Record Button + Speech Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.speakOrType}
            </label>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleToggleRecord}
                className={`min-h-[48px] px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-200'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-amber-300" />}
                <span>{isRecording ? 'Listening (Tap to Stop)' : 'Hold & Speak Voice Report'}</span>
              </button>

              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={3}
                placeholder={
                  lang === 'ta'
                    ? 'குரலில் பேசியது அல்லது புகாரை இங்கு எழுதுங்கள்...'
                    : lang === 'hi'
                    ? 'बोली गई बातें या शिकायत यहाँ टाइप करें...'
                    : 'Spoken incident words appear here or type details...'
                }
                className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900 placeholder:text-slate-400"
              />
            </div>
            {errorNotice && <p className="text-xs text-amber-700 mt-1">{errorNotice}</p>}
          </div>

          {/* Anonymous Protection Toggle (Crucial for eliminating fear) */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {t.anonymousToggle}
                </span>
                <span className="text-[11px] text-slate-500">
                  {isAnonymous ? 'Worker name & phone number are removed from the report.' : 'Reporting as verified employee.'}
                </span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full min-h-[50px] py-3.5 px-5 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{t.submitComplaint}</span>
          </button>

        </form>
      )}

    </div>
  );
}
