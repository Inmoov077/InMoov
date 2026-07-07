import { useCallback, useEffect, useRef, useState } from 'react';
import { Bot, Camera, CameraOff, Loader2, Mic, MicOff, Send, Square, User, Volume2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import * as api from '@/lib/api';
import { playMoodExpression } from '@/lib/moodExpressions';
import { speakText, stopSpeaking } from '@/lib/speech';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  mood?: string;
}

const MODELS = [
  { id: 'gemini-text', label: 'Gemini Text' },
  { id: 'gemini-vision', label: 'Gemini Vision' },
  { id: 'llama-vision', label: 'Llama 3.2 Vision (Ollama)' },
];

const LANGUAGES = [
  { id: 'en', label: 'English' },
  { id: 'hi', label: 'Hindi' },
  { id: 'gu', label: 'Gujarati' },
];

export function AiChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState('gemini-text');
  const [language, setLanguage] = useState('en');
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [speakReplies, setSpeakReplies] = useState(true);
  const [moodMotion, setMoodMotion] = useState(true);
  const [camOn, setCamOn] = useState(false);
  const [listening, setListening] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const captureFrame = useCallback((): string | undefined => {
    const video = videoRef.current;
    if (!camOn || !video || video.readyState < 2) return undefined;
    try {
      const c = document.createElement('canvas');
      c.width = 480;
      c.height = 360;
      const ctx = c.getContext('2d');
      if (!ctx) return undefined;
      ctx.translate(c.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, c.width, c.height);
      return c.toDataURL('image/jpeg', 0.75);
    } catch {
      return undefined;
    }
  }, [camOn]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCamOn(true);
    } catch {
      setCamOn(false);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamOn(false);
  };

  const sendMessage = useCallback(
    async (textOverride?: string) => {
      const text = (textOverride ?? input).trim();
      if (!text || loading) return;

      const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', text };
      setMessages((m) => [...m, userMsg]);
      if (!textOverride) setInput('');
      setLoading(true);
      playMoodExpression('thinking');

      try {
        const needsVision = model.includes('vision');
        const image = needsVision ? captureFrame() : undefined;
        const res = await api.sendConversation({
          message: text,
          model_provider: model,
          language,
          image,
        });

        if (res.ok) {
          const mood = res.mood || 'normal';
          if (moodMotion) playMoodExpression(mood);
          const reply = res.text ?? '';
          setMessages((m) => [
            ...m,
            { id: crypto.randomUUID(), role: 'assistant', text: reply, mood },
          ]);
          if (speakReplies && reply) speakText(reply);
        } else {
          setMessages((m) => [
            ...m,
            { id: crypto.randomUUID(), role: 'assistant', text: res.error ?? 'Request failed' },
          ]);
        }
      } catch (err) {
        setMessages((m) => [
          ...m,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            text: err instanceof Error ? err.message : 'Network error',
          },
        ]);
      } finally {
        setLoading(false);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      }
    },
    [input, loading, model, language, captureFrame, moodMotion, speakReplies],
  );

  const toggleListen = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = language === 'hi' ? 'hi-IN' : language === 'gu' ? 'gu-IN' : 'en-US';
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = e.results[0]?.[0]?.transcript;
      if (transcript) void sendMessage(transcript);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  };

  const startSession = () => {
    setActive(true);
    setMessages([
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: 'Hi! I am InMoov. Talk or type — I move my face to match how I feel.',
        mood: 'happy',
      },
    ]);
    playMoodExpression('happy');
  };

  const stopSession = () => {
    abortRef.current?.abort();
    stopSpeaking();
    stopCamera();
    if (recognitionRef.current) recognitionRef.current.stop();
    setListening(false);
    setActive(false);
    setLoading(false);
  };

  useEffect(() => () => stopCamera(), []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Talk to robot"
        description="Gemini / Ollama chat with mood expressions, voice, and optional camera vision."
        actions={
          <div className="flex gap-2">
            {!active ? (
              <Button size="sm" onClick={startSession}>
                Start chatting
              </Button>
            ) : (
              <Button size="sm" variant="destructive" onClick={stopSession}>
                <Square className="h-4 w-4" />
                End chat
              </Button>
            )}
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-1">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle>AI settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 pt-2">
              <div className="space-y-2">
                <Label>Model</Label>
                <Select value={model} onValueChange={setModel} disabled={!active}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODELS.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={language} onValueChange={setLanguage} disabled={!active}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label>Speak replies</Label>
                <Switch checked={speakReplies} onCheckedChange={setSpeakReplies} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Mood → motion</Label>
                <Switch checked={moodMotion} onCheckedChange={setMoodMotion} />
              </div>
              <Badge variant={active ? 'online' : 'offline'}>
                {active ? 'Chatting' : 'Not started'}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Vision input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4 pt-2">
              <div className="camera-feed-wrap max-h-40">
                <video
                  ref={videoRef}
                  className={cn('camera-video', camOn && 'active')}
                  autoPlay
                  playsInline
                  muted
                />
                {!camOn && (
                  <div className="camera-placeholder">
                    <CameraOff className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                disabled={!active}
                onClick={camOn ? stopCamera : startCamera}
              >
                {camOn ? 'Stop camera' : 'Start camera for vision'}
              </Button>
              <p className="text-xs text-muted-foreground">
                Required for Gemini Vision / Llama Vision models.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-3">
          <CardHeader className="p-4 pb-2">
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <ScrollArea className="console-surface h-[400px] p-4">
              {messages.length === 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  Press Start chatting, then type or use the mic.
                </p>
              )}
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
                  >
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                        msg.role === 'user' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary',
                      )}
                    >
                      {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div
                      className={cn(
                        'max-w-[80%] rounded-lg border px-4 py-2.5 text-sm',
                        msg.role === 'user'
                          ? 'border-accent/30 bg-accent/10 shadow-sm'
                          : 'border-border/80 bg-card-elevated/80 shadow-sm',
                      )}
                    >
                      <p>{msg.text}</p>
                      {msg.mood && (
                        <Badge variant="copper" className="mt-2">
                          mood: {msg.mood}
                        </Badge>
                      )}
                      {msg.role === 'assistant' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 h-7 gap-1 px-2 text-xs"
                          onClick={() => speakText(msg.text)}
                        >
                          <Volume2 className="h-3 w-3" />
                          Speak
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking…
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={!active || loading}
                onClick={toggleListen}
                title="Voice input"
              >
                {listening ? <MicOff className="h-4 w-4 text-destructive" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={active ? 'Type a message…' : 'Start session first'}
                disabled={!active || loading}
                className="flex-1"
              />
              <Button onClick={() => sendMessage()} disabled={!active || loading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}