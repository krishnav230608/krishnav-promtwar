import { SupportedLanguage } from '../config/industryConfig';

// Define SpeechRecognition interface for browser compatibility
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export const getLangLocale = (lang: SupportedLanguage): string => {
  switch (lang) {
    case 'ta':
      return 'ta-IN';
    case 'hi':
      return 'hi-IN';
    case 'en':
    default:
      return 'en-IN';
  }
};

export class FrontlineSpeechRecognizer {
  private recognition: any = null;
  private isSupported: boolean = false;

  constructor(
    private langCode: string,
    private onResult: (transcript: string) => void,
    private onError: (errorMsg: string) => void,
    private onEnd?: () => void
  ) {
    const win = typeof window !== 'undefined' ? window : null;
    const SpeechRecognitionClass = win
      ? (win as any).SpeechRecognition || (win as any).webkitSpeechRecognition
      : null;

    if (SpeechRecognitionClass) {
      this.isSupported = true;
      try {
        this.recognition = new SpeechRecognitionClass();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = this.langCode;

        this.recognition.onresult = (event: any) => {
          if (event.results && event.results[0] && event.results[0][0]) {
            const transcript = event.results[0][0].transcript;
            this.onResult(transcript);
          }
        };

        this.recognition.onerror = (event: any) => {
          this.onError(event.error || 'Speech recognition error');
        };

        this.recognition.onend = () => {
          if (this.onEnd) this.onEnd();
        };
      } catch (err) {
        this.isSupported = false;
        this.onError('Failed to initialize speech engine.');
      }
    } else {
      this.isSupported = false;
    }
  }

  get supported(): boolean {
    return this.isSupported;
  }

  start() {
    if (!this.isSupported || !this.recognition) {
      this.onError('Speech recognition not available on this browser. Use quick action chips.');
      return;
    }
    try {
      this.recognition.lang = this.langCode;
      this.recognition.start();
    } catch (err) {
      // If already started, stop and restart
      try {
        this.recognition.stop();
        setTimeout(() => this.recognition.start(), 150);
      } catch (e) {
        this.onError('Microphone is busy.');
      }
    }
  }

  stop() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (err) {
        // Ignore
      }
    }
  }
}

/**
 * Text-to-Speech reader for low-literacy workers
 */
export const speakAloud = (text: string, langCode: string = 'ta-IN'): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop active speaking

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.92; // Deliberate speed for clarity
      utterance.pitch = 1.0;

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
      resolve();
    }
  });
};

export interface VoiceRouteResult {
  targetTab: 'punch' | 'payslip' | 'grievance' | 'passport' | null;
  text: string;
  matchedCategory?: string;
}

/**
 * Multilingual Voice Command Evaluator (Tamil, Hindi, English)
 */
export const evaluateVoiceCommand = (
  rawTranscript: string,
  currentLang: SupportedLanguage
): VoiceRouteResult => {
  const query = rawTranscript.trim().toLowerCase();

  // 1. Payslip & Salary keywords
  const salaryKeywords = [
    'salary', 'pay', 'payslip', 'wage', 'slip', 'money', 'bonus', 'rate',
    'சம்பளம்', 'பணம்', 'கூலி', 'ரசீது', 'ஊதியம்',
    'वेतन', 'सैलरी', 'पर्ची', 'रुपये', 'पैसा', 'कमाई'
  ];
  if (salaryKeywords.some((kw) => query.includes(kw))) {
    let msg = 'Opening your salary and overtime breakdown.';
    if (currentLang === 'ta') msg = 'உங்கள் சம்பள விவரப் பக்கத்திற்குச் செல்கிறது.';
    if (currentLang === 'hi') msg = 'आपकी वेतन पर्ची खोली जा रही है।';
    return { targetTab: 'payslip', text: msg };
  }

  // 2. Safety / Hazard / Grievance keywords
  const hazardKeywords = [
    'hazard', 'danger', 'complaint', 'unsafe', 'accident', 'fall', 'scaffold', 'hurt', 'chemical', 'leak', 'fire', 'emergency',
    'ஆபத்து', 'விபத்து', 'புகார்', 'பாதுகாப்பு', 'காயம்', 'தகராறு',
    'खतरा', 'दुर्घटना', 'शिकायत', 'सुरक्षा', 'चोट', 'आपातकाल'
  ];
  if (hazardKeywords.some((kw) => query.includes(kw))) {
    let msg = 'Opening safety hazard & incident report form.';
    if (currentLang === 'ta') msg = 'பாதுகாப்பு மற்றும் ஆபத்து புகார் படிவம் திறக்கப்படுகிறது.';
    if (currentLang === 'hi') msg = 'सुरक्षा खतरा एवं शिकायत रिपोर्ट खोली जा रही है।';
    return { targetTab: 'grievance', text: msg };
  }

  // 3. Shift / Hours / Attendance keywords
  const shiftKeywords = [
    'hour', 'hours', 'shift', 'punch', 'check in', 'check out', 'time', 'duty', 'overtime', 'clock',
    'நேரம்', 'மணி', 'பணி', 'ஷிப்ட்', 'கூடுதல் நேரம்', 'வேலை',
    'घंटे', 'समय', 'शिफ्ट', 'ड्यूटी', 'ओवरटाइम', 'हाजिरी'
  ];
  if (shiftKeywords.some((kw) => query.includes(kw))) {
    let msg = 'Navigating to Shift Clock and Hours Tracker.';
    if (currentLang === 'ta') msg = 'பணி நேரக் கண்காணிப்புக்குச் செல்கிறது.';
    if (currentLang === 'hi') msg = 'शिफ्ट ट्रैकर पर ले जाया जा रहा है।';
    return { targetTab: 'punch', text: msg };
  }

  // 4. Skill Passport keywords
  const skillKeywords = [
    'skill', 'passport', 'certificate', 'credential', 'training', 'badge',
    'திறன்', 'சான்றிதழ்', 'பாஸ்போர்ட்', 'பயிற்சி',
    'कौशल', 'पासपोर्ट', 'प्रमाण', 'सर्टिफिकेट', 'प्रशिक्षण'
  ];
  if (skillKeywords.some((kw) => query.includes(kw))) {
    let msg = 'Opening your Portable Skill Passport.';
    if (currentLang === 'ta') msg = 'உங்கள் திறன் சான்றிதழ் அட்டை திறக்கப்படுகிறது.';
    if (currentLang === 'hi') msg = 'आपका कौशल पासपोर्ट खोला जा रहा है।';
    return { targetTab: 'passport', text: msg };
  }

  // Fallback
  let unknownMsg = `Searching for "${rawTranscript}". Please choose a quick shortcut.`;
  if (currentLang === 'ta') unknownMsg = `"${rawTranscript}" புரிந்துகொள்ளப்பட்டது. கீழே உள்ள பொத்தானைத் தொடவும்.`;
  if (currentLang === 'hi') unknownMsg = `"${rawTranscript}" दर्ज किया गया। कृपया नीचे दिए गए विकल्प चुनें।`;

  return { targetTab: null, text: unknownMsg };
};

/**
 * Sound Chime for low-end phone feedback (punch in, speech activate, alert)
 */
export const playTactileFeedbackTone = (type: 'punch' | 'alert' | 'success') => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'punch') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.12); // E5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'alert') {
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
      osc.frequency.setValueAtTime(330, ctx.currentTime + 0.1); // E4
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else {
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch (e) {
    // AudioContext might be restricted until user interaction
  }
};
