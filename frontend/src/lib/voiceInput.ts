/**
 * Reliable browser speech-to-text (Chrome / Edge).
 * - Interim text shown while speaking
 * - Final on silence OR when user stops mic
 * - Recovers last interim if Chrome never marks isFinal
 */

export type VoiceInputCallbacks = {
  onPartial?: (text: string) => void;
  onFinal: (text: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (message: string) => void;
};

function getSR(): (new () => SpeechRecognition) | null {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function isVoiceInputSupported(): boolean {
  return !!getSR();
}

export class VoiceInput {
  private rec: SpeechRecognition | null = null;
  private active = false;
  private wantListen = false;
  private lang = 'en-US';
  private continuous = true;
  private cbs: VoiceInputCallbacks = { onFinal: () => {} };
  private lastInterim = '';
  private lastFinal = '';
  private delivered = false;
  private restartCount = 0;
  private silenceTimer: ReturnType<typeof setTimeout> | null = null;

  configure(opts: { lang?: string; continuous?: boolean; callbacks: VoiceInputCallbacks }) {
    this.lang = opts.lang ?? 'en-US';
    // continuous + interim is more reliable for real speech
    this.continuous = opts.continuous !== false;
    this.cbs = opts.callbacks;
  }

  get listening() {
    return this.active || this.wantListen;
  }

  private clearSilence() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }

  private scheduleSilenceCommit() {
    this.clearSilence();
    // After ~1.4s of no new results, accept interim as final
    this.silenceTimer = setTimeout(() => {
      if (!this.wantListen || this.delivered) return;
      const text = (this.lastFinal || this.lastInterim).trim();
      if (text) this.deliver(text);
      else this.stop(true);
    }, 1400);
  }

  private deliver(text: string) {
    const t = text.trim();
    if (!t || this.delivered) return;
    this.delivered = true;
    this.clearSilence();
    this.wantListen = false;
    try {
      this.cbs.onFinal(t);
    } catch {
      /* ignore callback errors */
    }
    this.stop(false);
  }

  start() {
    const SR = getSR();
    if (!SR) {
      this.cbs.onError?.('Voice needs Chrome or Edge browser');
      return false;
    }

    this.stop(false);
    this.wantListen = true;
    this.delivered = false;
    this.lastInterim = '';
    this.lastFinal = '';
    this.restartCount = 0;

    return this.attachAndStart(SR);
  }

  private attachAndStart(SR: new () => SpeechRecognition): boolean {
    const rec = new SR();
    rec.lang = this.lang;
    rec.continuous = this.continuous;
    rec.interimResults = true;
    rec.maxAlternatives = 3;

    rec.onstart = () => {
      this.active = true;
      this.cbs.onStart?.();
    };

    rec.onresult = (e: SpeechRecognitionEvent) => {
      if (!this.wantListen) return;
      let interim = '';
      let finalChunk = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        const t = (r[0]?.transcript ?? '').trim();
        if (!t) continue;
        if (r.isFinal) finalChunk += (finalChunk ? ' ' : '') + t;
        else interim += (interim ? ' ' : '') + t;
      }

      if (finalChunk) {
        this.lastFinal = (this.lastFinal ? this.lastFinal + ' ' : '') + finalChunk;
        this.cbs.onPartial?.(this.lastFinal);
        // In continuous mode wait briefly for more words, then commit
        this.scheduleSilenceCommit();
        if (!this.continuous) {
          this.deliver(this.lastFinal);
        }
      } else if (interim) {
        this.lastInterim = interim;
        this.cbs.onPartial?.(this.lastFinal ? `${this.lastFinal} ${interim}` : interim);
        this.scheduleSilenceCommit();
      }
    };

    rec.onerror = (ev: SpeechRecognitionErrorEvent) => {
      const code = ev.error || 'error';
      // Soft: keep listening / recover
      if (code === 'aborted') {
        this.active = false;
        return;
      }
      if (code === 'no-speech') {
        // Chrome ends session on silence — restart once while user still wants mic
        this.active = false;
        if (this.wantListen && !this.delivered && this.restartCount < 2) {
          this.restartCount += 1;
          try {
            setTimeout(() => {
              if (this.wantListen && !this.delivered) this.attachAndStart(SR);
            }, 200);
          } catch {
            /* ignore */
          }
          return;
        }
        const maybe = (this.lastFinal || this.lastInterim).trim();
        if (maybe) {
          this.deliver(maybe);
          return;
        }
        this.wantListen = false;
        this.cbs.onError?.('No speech heard — try again closer to the mic');
        this.cbs.onEnd?.();
        return;
      }
      if (code === 'network') {
        // Still try to use any captured text
        const maybe = (this.lastFinal || this.lastInterim).trim();
        if (maybe) {
          this.deliver(maybe);
          return;
        }
        this.wantListen = false;
        this.active = false;
        this.cbs.onError?.(
          'Speech network error — Chrome needs internet for voice recognition, or type your question',
        );
        this.cbs.onEnd?.();
        return;
      }
      const map: Record<string, string> = {
        'not-allowed': 'Mic blocked — click the lock icon → allow microphone',
        'service-not-allowed': 'Mic not allowed in this browser',
        'audio-capture': 'No microphone found — plug in a mic',
      };
      this.wantListen = false;
      this.active = false;
      this.cbs.onError?.(map[code] || `Mic error: ${code}`);
      this.cbs.onEnd?.();
    };

    rec.onend = () => {
      this.active = false;
      this.clearSilence();
      // Chrome often ends without isFinal — use last transcript
      if (this.wantListen && !this.delivered) {
        const text = (this.lastFinal || this.lastInterim).trim();
        if (text) {
          this.deliver(text);
          return;
        }
        // Auto-restart a couple times for continuous listen
        if (this.continuous && this.restartCount < 3) {
          this.restartCount += 1;
          try {
            setTimeout(() => {
              if (this.wantListen && !this.delivered) this.attachAndStart(SR);
            }, 250);
            return;
          } catch {
            /* ignore */
          }
        }
        this.wantListen = false;
        this.cbs.onEnd?.();
        return;
      }
      this.cbs.onEnd?.();
    };

    this.rec = rec;
    try {
      rec.start();
      return true;
    } catch (e) {
      this.wantListen = false;
      this.active = false;
      this.cbs.onError?.(e instanceof Error ? e.message : 'Could not start mic');
      return false;
    }
  }

  /** User pressed stop — commit whatever we heard. */
  stop(notify = true) {
    this.clearSilence();
    const text = (this.lastFinal || this.lastInterim).trim();
    const shouldDeliver = this.wantListen && !this.delivered && !!text;

    this.wantListen = false;
    this.active = false;
    const rec = this.rec;
    this.rec = null;
    if (rec) {
      try {
        rec.onend = null;
        rec.onerror = null;
        rec.onresult = null;
        rec.stop();
      } catch {
        try {
          rec.abort();
        } catch {
          /* ignore */
        }
      }
    }

    if (shouldDeliver) {
      this.delivered = true;
      try {
        this.cbs.onFinal(text);
      } catch {
        /* ignore */
      }
      return;
    }
    if (notify) this.cbs.onEnd?.();
  }
}
