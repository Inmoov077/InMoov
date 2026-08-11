import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Bot,
  Loader2,
  Mic,
  MicOff,
  Send,
  Sparkles,
  User,
  Volume2,
  VolumeX,
  MessageCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import * as api from '@/lib/api';
import { playMoodExpression } from '@/lib/moodExpressions';
import { speakText, stopSpeaking } from '@/lib/speech';
import { VoiceInput, isVoiceInputSupported } from '@/lib/voiceInput';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  mood?: string;
  source?: string;
}

const CHIPS = [
  'Who is the HOD?',
  'Who is the Provost?',
  'Where is Marwadi?',
  'Who are you?',
  'Hello',
  'Thank you',
];

/**
 * Local chat — type or mic. Voice engine kept stable (refs) so recognition
 * is not torn down while speaking / waiting for a reply.
 */
export function AiChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'hi',
      role: 'assistant',
      text: 'Hi! I am InMoov. Ask me anything from local data — HOD, Provost, Robotics club, or say hello. Tap the mic to talk.',
      mood: 'happy',
      source: 'local',
    },
  ]);
  const [input, setInput] = useState('');
  const [partial, setPartial] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speakOn, setSpeakOn] = useState(true);
  const [micSupported] = useState(() => isVoiceInputSupported());

  const bottomRef = useRef<HTMLDivElement>(null);
  const voiceRef = useRef<VoiceInput | null>(null);
  const speakOnRef = useRef(speakOn);
  const loadingRef = useRef(loading);
  const sendRef = useRef<(raw: string) => Promise<void>>(async () => {});
  speakOnRef.current = speakOn;
  loadingRef.current = loading;

  const scrollDown = () => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 40);
  };

  const sendMessage = useCallback(async (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    if (loadingRef.current) {
      // Queue briefly: don't drop voice finals while previous reply loads
      toast.message('Still answering… try again in a moment');
      return;
    }

    setMessages((m) => [...m, { id: crypto.randomUUID(), role: 'user', text }]);
    setInput('');
    setPartial('');
    setLoading(true);
    loadingRef.current = true;
    try {
      playMoodExpression('thinking');
    } catch {
      /* optional */
    }
    scrollDown();

    try {
      const res = await api.sendConversation({
        message: text,
        model_provider: 'local',
        language: 'en',
      });

      let reply = '';
      let mood = 'normal';
      let source = 'local';

      if (res && typeof res === 'object') {
        if (res.ok === false) {
          reply = String(res.error || 'No answer from local data.');
        } else {
          reply = String(res.text || res.reply || res.message || '').trim();
          mood = String(res.mood || 'normal');
          source = String(res.source || 'local');
        }
      }

      if (!reply) {
        reply =
          'I heard you, but I have no answer for that yet. Try: who is the HOD? or hello.';
        source = 'local_fallback';
      }

      try {
        playMoodExpression(mood);
      } catch {
        /* optional */
      }

      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: reply,
          mood,
          source,
        },
      ]);

      if (speakOnRef.current && reply) {
        // Speak after paint so user always sees text even if TTS is blocked
        window.setTimeout(() => speakText(reply), 120);
      }
    } catch (e) {
      const err =
        e instanceof Error
          ? e.message
          : 'Server offline — start Flask (python app.py) and try again';
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: err,
        },
      ]);
      toast.error('Chat request failed');
    } finally {
      setLoading(false);
      loadingRef.current = false;
      scrollDown();
    }
  }, []);

  sendRef.current = sendMessage;

  // Create voice engine once; callbacks always call latest send via ref
  useEffect(() => {
    const v = new VoiceInput();
    voiceRef.current = v;
    v.configure({
      lang: 'en-US',
      continuous: true,
      callbacks: {
        onStart: () => setListening(true),
        onEnd: () => {
          setListening(false);
          setPartial('');
        },
        onPartial: (t) => setPartial(t),
        onFinal: (t) => {
          setListening(false);
          setPartial('');
          const clean = t.trim();
          if (!clean) {
            toast.message('Did not catch that — try again');
            return;
          }
          setInput(clean);
          toast.success(`Heard: “${clean.slice(0, 48)}${clean.length > 48 ? '…' : ''}”`);
          void sendRef.current(clean);
        },
        onError: (msg) => {
          setListening(false);
          setPartial('');
          toast.error(msg);
        },
      },
    });
    return () => {
      v.stop(false);
      stopSpeaking();
    };
  }, []);

  const toggleMic = () => {
    if (!micSupported) {
      toast.error('Use Chrome or Edge for voice (mic not supported here)');
      return;
    }
    const v = voiceRef.current;
    if (!v) {
      toast.error('Voice not ready — refresh the page');
      return;
    }
    if (listening || v.listening) {
      // Stop and send whatever was heard
      v.stop(true);
      setListening(false);
      return;
    }
    if (loadingRef.current) {
      toast.message('Wait for the reply, then speak');
      return;
    }
    stopSpeaking();
    const ok = v.start();
    if (ok) {
      setListening(true);
      toast.message('Listening… speak clearly, then pause or tap mic again');
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-4.5rem)] max-w-3xl flex-col gap-0 px-3 py-3 md:px-4">
      {/* Top bar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border/50 bg-card px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-lg font-semibold leading-tight">Chat</h1>
            <p className="text-xs text-muted-foreground">
              Local answers · {micSupported ? 'mic ready' : 'type only (use Chrome/Edge for mic)'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="online" className="text-[10px]">
            <Sparkles className="mr-1 h-3 w-3" />
            Campus data
          </Badge>
          <Button
            size="sm"
            variant={speakOn ? 'default' : 'outline'}
            className="h-9 gap-1.5"
            onClick={() => {
              setSpeakOn((s) => !s);
              if (speakOn) stopSpeaking();
            }}
          >
            {speakOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            {speakOn ? 'Speak on' : 'Speak off'}
          </Button>
        </div>
      </div>

      {/* Suggestions */}
      <div className="mb-2 flex gap-1.5 overflow-x-auto pb-1">
        {CHIPS.map((c) => (
          <button
            key={c}
            type="button"
            disabled={loading}
            onClick={() => void sendMessage(c)}
            className="shrink-0 rounded-full border border-border/50 bg-card px-3 py-1.5 text-xs font-medium shadow-sm transition hover:border-primary/40 hover:bg-primary/5 disabled:opacity-50"
          >
            {c}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-border/50 bg-gradient-to-b from-muted/30 to-card/40 px-3 py-4 shadow-inner">
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex gap-2.5',
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row',
              )}
            >
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl',
                  msg.role === 'user' ? 'bg-accent/20 text-accent' : 'bg-primary/15 text-primary',
                )}
              >
                {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div
                className={cn(
                  'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm',
                  msg.role === 'user'
                    ? 'rounded-tr-md bg-accent text-accent-foreground'
                    : 'rounded-tl-md border border-border/50 bg-card',
                )}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                {msg.role === 'assistant' && (
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {msg.source && (
                      <span className="rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-medium uppercase text-muted-foreground">
                        {msg.source}
                      </span>
                    )}
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={() => speakText(msg.text)}
                    >
                      <Volume2 className="h-3 w-3" /> Speak
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 px-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking…
            </div>
          )}
          {partial && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-foreground">
              <span className="font-medium text-primary">Hearing:</span> “{partial}”
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Composer */}
      <div className="mt-3 rounded-2xl border border-border/50 bg-card p-2.5 shadow-sm">
        <div className="flex items-end gap-2">
          <Button
            type="button"
            size="icon"
            variant={listening ? 'destructive' : 'outline'}
            className={cn('h-12 w-12 shrink-0 rounded-2xl', listening && 'animate-pulse')}
            disabled={loading && !listening}
            onClick={toggleMic}
            title={listening ? 'Stop & send' : 'Start voice'}
          >
            {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void sendMessage(input);
              }
            }}
            placeholder={listening ? 'Listening… speak now' : 'Type or tap mic…'}
            disabled={loading}
            className="h-12 flex-1 rounded-2xl border-border/40 bg-muted/30 text-base"
          />
          <Button
            type="button"
            className="h-12 shrink-0 rounded-2xl px-5"
            disabled={loading || !input.trim()}
            onClick={() => void sendMessage(input)}
          >
            <Send className="h-4 w-4" />
            Send
          </Button>
        </div>
        <p className="mt-2 px-1 text-center text-[10px] text-muted-foreground">
          {listening
            ? 'Speak, then pause — or tap mic again to send what was heard'
            : 'Chrome/Edge · allow microphone · Speak on for voice replies · Flask must be running'}
        </p>
      </div>
    </div>
  );
}
