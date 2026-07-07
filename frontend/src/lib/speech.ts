import { useServoStore } from '@/store/servoStore';

export function speakText(
  text: string,
  options?: { rate?: number; pitch?: number; onStart?: () => void; onEnd?: () => void },
): void {
  if (!('speechSynthesis' in window) || !text.trim()) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = options?.rate ?? 0.95;
  utterance.pitch = options?.pitch ?? 1;

  let jawFrame: number | null = null;
  const setHead = useServoStore.getState().setHead;

  const stopJaw = () => {
    if (jawFrame !== null) cancelAnimationFrame(jawFrame);
    jawFrame = null;
    setHead('jaw', 8, true);
  };

  const animateJaw = () => {
    const start = performance.now();
    const loop = (now: number) => {
      const t = (now - start) / 1000;
      const open = 8 + Math.abs(Math.sin(t * 12)) * 22;
      setHead('jaw', Math.round(open), false);
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

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  useServoStore.getState().setHead('jaw', 8, true);
}