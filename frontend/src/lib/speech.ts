/** Browser TTS. Server wake greetings use InMoove Core TTS. */
import { useServoStore } from '@/store/servoStore';

let voicesReady = false;

function ensureVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const load = () => {
    const list = window.speechSynthesis.getVoices();
    if (list?.length) voicesReady = true;
  };
  load();
  if (!voicesReady) {
    window.speechSynthesis.onvoiceschanged = () => {
      load();
    };
  }
}

if (typeof window !== 'undefined') {
  ensureVoices();
}

function pickVoice(): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  // Prefer clear English voices
  const preferred =
    voices.find((v) => /en-US/i.test(v.lang) && /Google|Natural|Samantha|Zira|Jenny/i.test(v.name)) ||
    voices.find((v) => /en-US/i.test(v.lang)) ||
    voices.find((v) => /^en/i.test(v.lang)) ||
    voices[0];
  return preferred ?? null;
}

export function speakText(
  text: string,
  options?: { rate?: number; pitch?: number; onStart?: () => void; onEnd?: () => void },
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const clean = (text || '').replace(/\s+/g, ' ').trim();
  if (!clean) return;

  ensureVoices();

  try {
    window.speechSynthesis.cancel();
  } catch {
    /* ignore */
  }

  // Chrome bug: speak right after cancel sometimes no-ops — small delay
  window.setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = options?.rate ?? 0.95;
    utterance.pitch = options?.pitch ?? 1;
    utterance.lang = 'en-US';
    const voice = pickVoice();
    if (voice) utterance.voice = voice;

    let jawFrame: number | null = null;
    const setHead = useServoStore.getState().setHead;

    const stopJaw = () => {
      if (jawFrame !== null) cancelAnimationFrame(jawFrame);
      jawFrame = null;
      try {
        setHead('jaw', 8, true);
      } catch {
        /* ignore */
      }
    };

    const animateJaw = () => {
      const start = performance.now();
      const loop = (now: number) => {
        const t = (now - start) / 1000;
        const open = 8 + Math.abs(Math.sin(t * 12)) * 22;
        try {
          setHead('jaw', Math.round(open), false);
        } catch {
          /* ignore */
        }
        jawFrame = requestAnimationFrame(loop);
      };
      jawFrame = requestAnimationFrame(loop);
    };

    utterance.onstart = () => {
      animateJaw();
      options?.onStart?.();
    };
    utterance.onend = () => {
      stopJaw();
      options?.onEnd?.();
    };
    utterance.onerror = () => {
      stopJaw();
      options?.onEnd?.();
    };

    try {
      window.speechSynthesis.speak(utterance);
      // Chrome sometimes pauses and never resumes
      window.setTimeout(() => {
        try {
          if (window.speechSynthesis.paused) window.speechSynthesis.resume();
        } catch {
          /* ignore */
        }
      }, 250);
    } catch {
      stopJaw();
      options?.onEnd?.();
    }
  }, 80);
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* ignore */
    }
  }
  try {
    useServoStore.getState().setHead('jaw', 8, true);
  } catch {
    /* ignore */
  }
}
