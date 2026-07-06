import { useMemo, useState } from 'react';
import { BookOpen, Mic, Search, Volume2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import offlineCommands from '@/data/offline_commands.json';
import { PRESETS } from '@/lib/presets';
import { animateKeyframes } from '@/lib/animateKeyframes';
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
    const presetMap: Record<string, string> = {
      nod: 'nod',
      shake: 'shake',
      tilt: 'tilt-side',
      scan: 'scan-room',
      'eye-sweep': 'look-around',
    };
    const presetId = animKey ? presetMap[animKey] : null;
    if (presetId && PRESETS[presetId]) {
      animateKeyframes(PRESETS[presetId]);
    }
  };

  const runTest = () => {
    const match = matchCommand(testPhrase);
    setMatchResult(match);
    if (match) {
      setLastResponse(match.response);
      applyAngles(match);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(match.response);
        window.speechSynthesis.speak(u);
      }
    } else {
      setLastResponse(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Voice commands"
        description={`Say or type a phrase — the robot moves and answers. ${commands.length} built-in commands, no internet needed.`}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Command Directory
            </CardTitle>
            <CardDescription>Browse all offline trigger phrases and responses</CardDescription>
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
                  <div key={i} className="p-4 hover:bg-secondary/30">
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
                  </div>
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
                Phrase Matcher
              </CardTitle>
              <CardDescription>Test local phrase matching without the API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder='Try "hello" or "who are you"'
                value={testPhrase}
                onChange={(e) => setTestPhrase(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runTest()}
              />
              <Button className="w-full" onClick={runTest}>
                <Search className="h-4 w-4" />
                Match &amp; Execute
              </Button>
              <div
                className={cn(
                  'rounded-lg border p-3 text-sm',
                  matchResult
                    ? 'border-success/30 bg-success/5'
                    : testPhrase && !matchResult
                      ? 'border-destructive/30 bg-destructive/5'
                      : 'border-border panel-inset',
                )}
              >
                {matchResult ? (
                  <>
                    <p className="font-mono text-[10px] uppercase text-success">Match found</p>
                    <p className="mt-1">{matchResult.response}</p>
                  </>
                ) : testPhrase ? (
                  <p className="text-muted-foreground">No matching command for this phrase.</p>
                ) : (
                  <p className="text-muted-foreground">Enter a phrase to test matching.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-primary" />
                Voice Chat
              </CardTitle>
              <CardDescription>Speech output structure for offline mode</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {lastResponse ? (
                <p className="text-foreground">{lastResponse}</p>
              ) : (
                <p>Matched responses will be spoken via browser TTS.</p>
              )}
              <p className="text-xs">
                Full voice recognition integration connects to the Flask offline pipeline in a
                future release.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}