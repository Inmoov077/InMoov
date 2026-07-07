import { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Mic, MicOff, Search, Volume2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import offlineCommands from '@shared/offline_commands.json';
import { PRESETS } from '@/lib/presets';
import { animateKeyframes } from '@/lib/animateKeyframes';
import { speakText } from '@/lib/speech';
import * as api from '@/lib/api';
import { useServoStore } from '@/store/servoStore';
import { cn } from '@/lib/utils';

interface OfflineCommand {
  inputs: string[];
  response: string;
  angles: {
    hneck: number;
    eye: number;
    neckRot: number;
    neckTilt: number;
    neckRoll: number;
  };
  animation?: string;
}

const commands = offlineCommands as OfflineCommand[];

function matchCommand(query: string): OfflineCommand | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  let best: { cmd: OfflineCommand; score: number } | null = null;

  for (const cmd of commands) {
    for (const input of cmd.inputs) {
      const phrase = input.trim().toLowerCase();
      if (!phrase) continue;
      if (q === phrase || q.includes(phrase) || phrase.includes(q)) {
        const score = phrase.length;
        if (!best || score > best.score) best = { cmd, score };
      }
    }
  }

  return best?.cmd ?? null;
}

export function OfflinePage() {
  const [search, setSearch] = useState('');
  const [testPhrase, setTestPhrase] = useState('');
  const [matchResult, setMatchResult] = useState<OfflineCommand | null>(null);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [ragResult, setRagResult] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const setHead = useServoStore((s) => s.setHead);
  const setNeck = useServoStore((s) => s.setNeck);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.response.toLowerCase().includes(q) ||
        c.inputs.some((i) => i.toLowerCase().includes(q)),
    );
  }, [search]);

  const applyAngles = (cmd: OfflineCommand) => {
    const a = cmd.angles;
    setHead('hneck', a.hneck);
    setHead('eye', a.eye);
    setNeck('rot', a.neckRot);
    setNeck('tilt', a.neckTilt);
    setNeck('roll', a.neckRoll);

    const animKey = cmd.animation;
    const legacyMap: Record<string, string> = {
      nod: 'nod',
      shake: 'shake',
      tilt: 'tilt-side',
      scan: 'scan-room',
      'eye-sweep': 'look-around',
    };
    const presetId = animKey ? (legacyMap[animKey] ?? animKey) : null;
    if (presetId && PRESETS[presetId]) {
      void animateKeyframes(PRESETS[presetId]);
    }
  };

  const executeCommand = async (phrase: string) => {
    setTestPhrase(phrase);
    const match = matchCommand(phrase);
    setMatchResult(match);
    setRagResult(null);

    if (match) {
      setLastResponse(match.response);
      applyAngles(match);
      speakText(match.response);
      return;
    }

    try {
      const rag = await api.offlineSearch(phrase);
      if (rag.ok && rag.match && rag.text) {
        setRagResult(rag.text);
        setLastResponse(rag.text);
        speakText(rag.text);
      } else {
        setLastResponse(null);
      }
    } catch {
      setLastResponse(null);
    }
  };

  const runTest = () => void executeCommand(testPhrase);

  const toggleListen = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = 'en-US';
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const last = e.results[e.results.length - 1];
      if (last?.isFinal) {
        const transcript = last[0]?.transcript?.trim();
        if (transcript) void executeCommand(transcript);
      }
    };
    rec.onend = () => {
      if (listening) rec.start();
    };
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  };

  useEffect(
    () => () => {
      recognitionRef.current?.stop();
    },
    [],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Voice commands"
        description={`${commands.length} offline phrases from InMoov + MyRobotLab 1.1.1610 AIML. Say or type — robot moves and speaks.`}
        actions={
          <Button variant={listening ? 'destructive' : 'default'} onClick={toggleListen}>
            {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {listening ? 'Stop listening' : 'Start voice'}
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Command directory
            </CardTitle>
            <CardDescription>MRL gestures, built-in Q&amp;A, and motion triggers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search phrases or responses…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <ScrollArea className="h-[420px] rounded-lg border border-border">
              <div className="divide-y divide-border">
                {filtered.map((cmd, i) => (
                  <button
                    key={i}
                    type="button"
                    className="w-full p-4 text-left hover:bg-secondary/30"
                    onClick={() => void executeCommand(cmd.inputs[0] ?? '')}
                  >
                    <div className="mb-2 flex flex-wrap gap-1">
                      {cmd.inputs.slice(0, 3).map((inp) => (
                        <Badge key={inp} variant="default">
                          {inp.trim()}
                        </Badge>
                      ))}
                      {cmd.inputs.length > 3 && (
                        <Badge variant="signal">+{cmd.inputs.length - 3}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-foreground/90">{cmd.response}</p>
                    {cmd.animation && (
                      <Badge variant="copper" className="mt-2">
                        anim: {cmd.animation}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-accent" />
                Phrase matcher
              </CardTitle>
              <CardDescription>Local match → motion + TTS. Falls back to RAG search.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder='Try "shake hand" or "look left"'
                value={testPhrase}
                onChange={(e) => setTestPhrase(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runTest()}
              />
              <Button className="w-full" onClick={runTest}>
                <Search className="h-4 w-4" />
                Match &amp; execute
              </Button>
              <div
                className={cn(
                  'rounded-lg border p-3 text-sm',
                  matchResult
                    ? 'border-success/30 bg-success/5'
                    : testPhrase && !matchResult && !ragResult
                      ? 'border-destructive/30 bg-destructive/5'
                      : 'border-border panel-inset',
                )}
              >
                {matchResult ? (
                  <>
                    <p className="font-mono text-[10px] uppercase text-success">Command match</p>
                    <p className="mt-1">{matchResult.response}</p>
                  </>
                ) : ragResult ? (
                  <>
                    <p className="font-mono text-[10px] uppercase text-info">RAG knowledge</p>
                    <p className="mt-1">{ragResult}</p>
                  </>
                ) : testPhrase ? (
                  <p className="text-muted-foreground">No matching command for this phrase.</p>
                ) : (
                  <p className="text-muted-foreground">Enter a phrase or use Start voice.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-primary" />
                Last response
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {lastResponse ? (
                <p className="text-foreground">{lastResponse}</p>
              ) : (
                <p>Responses are spoken with jaw-sync TTS.</p>
              )}
              {listening && (
                <Badge variant="online" className="mt-3">
                  Listening…
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}