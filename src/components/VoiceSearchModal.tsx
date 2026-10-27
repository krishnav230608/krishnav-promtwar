import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Volume2, Sparkles, Navigation } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  FrontlineSpeechRecognizer,
  speakAloud,
  evaluateVoiceCommand,
  getLangLocale,
  playTactileFeedbackTone
} from '../utils/voiceAssistant';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: 'punch' | 'payslip' | 'grievance' | 'passport') => void;
}

export default function VoiceSearchModal({ isOpen, onClose, onNavigate }: VoiceSearchModalProps) {
  const { lang, t } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [systemResponse, setSystemResponse] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const recognizerRef = useRef<FrontlineSpeechRecognizer | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
      setIsListening(false);
      setTranscript('');
      setSystemResponse('');
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentLocale = getLangLocale(lang);

  const startListening = () => {
    setErrorMessage('');
    setTranscript('');
    setSystemResponse(
      lang === 'ta'
        ? 'கேட்கிறது... தெளிவாகப் பேசுங்கள்...'
        : lang === 'hi'
        ? 'सुन रहे हैं... कृपया स्पष्ट बोलें...'
        : 'Listening... please speak your query clearly...'
    );
    setIsListening(true);
    playTactileFeedbackTone('punch');

    const recognizer = new FrontlineSpeechRecognizer(
      currentLocale,
      (text) => {
        setIsListening(false);
        setTranscript(text);
        const command = evaluateVoiceCommand(text, lang);
        setSystemResponse(command.text);

        // Speak back to assist frontline workers who have limited literacy
        speakAloud(command.text, currentLocale);

        const target = command.targetTab;
        if (target) {
          playTactileFeedbackTone('success');
          setTimeout(() => {
            onNavigate(target);
            onClose();
          }, 1400);
        }
      },
      (error) => {
        setIsListening(false);
        setErrorMessage(
          `Mic: ${error}. You can also tap the quick-query buttons below.`
        );
      },
      () => {
        setIsListening(false);
      }
    );

    recognizerRef.current = recognizer;
    recognizer.start();
  };

  const stopListening = () => {
    if (recognizerRef.current) {
      recognizerRef.current.stop();
    }
    setIsListening(false);
  };

  const handleQuickChip = (tab: 'punch' | 'payslip' | 'grievance' | 'passport', chipText: string) => {
    setTranscript(chipText);
    const command = evaluateVoiceCommand(chipText, lang);
    setSystemResponse(command.text);
    speakAloud(command.text, currentLocale);
    playTactileFeedbackTone('success');
    setTimeout(() => {
      onNavigate(tab);
      onClose();
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl relative border border-slate-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close voice assistant"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            {lang === 'ta' ? 'குரல் தேடல் உதவி' : lang === 'hi' ? 'बोलकर खोजें और सहायता पाएं' : 'Multilingual Voice Assistant'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Recognizing: <span className="font-semibold text-slate-800 uppercase">{currentLocale}</span>
          </p>
        </div>

        {/* Big Touch Hitbox Microphone Button */}
        <div className="flex flex-col items-center justify-center my-4">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all transform active:scale-95 shadow-xl relative ${
              isListening
                ? 'bg-rose-600 text-white ring-8 ring-rose-200 animate-pulse'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
            }`}
            aria-label={isListening ? 'Stop listening' : 'Start speaking'}
          >
            {isListening ? (
              <>
                <MicOff className="w-9 h-9 mb-1" />
                <span className="text-[11px] font-bold">Listening...</span>
              </>
            ) : (
              <>
                <Mic className="w-9 h-9 mb-1" />
                <span className="text-[11px] font-bold">{t.tapToSpeak}</span>
              </>
            )}
          </button>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            {isListening ? 'Speak now into microphone' : 'Tap once to speak'}
          </p>
        </div>

        {/* Voice Feedback Screen */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 min-h-[84px] flex flex-col justify-center">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
            <span>{t.speakQuery}</span>
            {systemResponse && <Volume2 className="w-3.5 h-3.5 text-blue-600 animate-bounce" />}
          </div>
          
          <p className="text-sm font-bold text-slate-900 min-h-[22px]">
            {transcript ? `"${transcript}"` : <span className="text-slate-400 font-normal italic">Tap mic and speak in Tamil, Hindi or English</span>}
          </p>

          {systemResponse && (
            <p className="text-xs text-blue-700 font-medium mt-1.5 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 shrink-0" />
              <span>{systemResponse}</span>
            </p>
          )}

          {errorMessage && (
            <p className="text-xs text-rose-600 font-medium mt-1">{errorMessage}</p>
          )}
        </div>

        {/* Quick Suggestion Chips (Essential for low-literacy and instant demo testing) */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <p className="text-[11px] text-slate-500 font-medium text-center mb-2">
            Quick Queries / விரைவு தேடல்:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickChip('payslip', lang === 'ta' ? 'சம்பளம்' : lang === 'hi' ? 'वेतन' : 'My Salary')}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-lg text-left truncate transition-colors flex items-center justify-between"
            >
              <span>{lang === 'ta' ? '💰 சம்பளம் (Salary)' : lang === 'hi' ? '💰 वेतन (Salary)' : '💰 Salary Breakdown'}</span>
            </button>

            <button
              onClick={() => handleQuickChip('grievance', lang === 'ta' ? 'ஆபத்து' : lang === 'hi' ? 'खतरा' : 'Safety Hazard')}
              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 font-medium rounded-lg text-left truncate transition-colors flex items-center justify-between"
            >
              <span>{lang === 'ta' ? '⚠️ ஆபத்து (Hazard)' : lang === 'hi' ? '⚠️ खतरा (Hazard)' : '⚠️ Report Danger'}</span>
            </button>

            <button
              onClick={() => handleQuickChip('punch', lang === 'ta' ? 'வேலை நேரம்' : lang === 'hi' ? 'काम के घंटे' : 'Shift Hours')}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-lg text-left truncate transition-colors flex items-center justify-between"
            >
              <span>{lang === 'ta' ? '⏱️ நேரம் (Shift)' : lang === 'hi' ? '⏱️ घंटे (Shift)' : '⏱️ Check Hours'}</span>
            </button>

            <button
              onClick={() => handleQuickChip('passport', lang === 'ta' ? 'திறன் சான்றிதழ்' : lang === 'hi' ? 'कौशल कार्ड' : 'Skill Passport')}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-lg text-left truncate transition-colors flex items-center justify-between"
            >
              <span>{lang === 'ta' ? '🎖️ திறன் (Passport)' : lang === 'hi' ? '🎖️ कौशल (Passport)' : '🎖️ Skill Card'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
