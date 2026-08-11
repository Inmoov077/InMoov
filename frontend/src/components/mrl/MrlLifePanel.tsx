import { useCallback, useEffect, useState } from 'react';
import {
  Activity,
  Eye,
  HeartPulse,
  Moon,
  Power,
  RefreshCw,
  Square,
  Sun,
  User,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import * as mrl from '@/lib/mrlClient';

const ACTIONS: {
  id: string;
  label: string;
  desc: string;
  icon: typeof Moon;
  tone?: 'default' | 'destructive' | 'outline';
}[] = [
  { id: 'power_up', label: 'Power up', desc: 'Start core peers + rest', icon: Power },
  { id: 'wake', label: 'Wake', desc: 'Leave sleep mode', icon: Sun },
  { id: 'sleepMode', label: 'Sleep', desc: 'MRL sleepMode.py', icon: Moon },
  { id: 'healthCheck', label: 'Health check', desc: 'Self-test + nod', icon: HeartPulse },
  { id: 'moveHeadRandomize', label: 'Random head', desc: 'life/MoveHeadRandomize', icon: User },
  { id: 'moveEyesRandomize', label: 'Random eyes', desc: 'life/MoveEyesRandomize', icon: Eye },
  { id: 'moveBodyRandomize', label: 'Random body', desc: 'life/MoveBodyRandomize', icon: Activity },
  { id: 'moveRandomize', label: 'Random all', desc: 'life/MoveRandomize', icon: Zap },
  { id: 'rest', label: 'Rest', desc: 'All servos to rest', icon: Square, tone: 'outline' },
  { id: 'stopGesture', label: 'Stop gesture', desc: 'Abort playing move', icon: Square, tone: 'outline' },
  { id: 'power_down', label: 'Power down', desc: 'Shutdown sequence', icon: Power, tone: 'destructive' },
];

export function MrlLifePanel() {
  const [status, setStatus] = useState<Awaited<ReturnType<typeof mrl.getMrlLifeStatus>> | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setStatus(await mrl.getMrlLifeStatus());
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void refresh();
    const t = setInterval(() => void refresh(), 2500);
    return () => clearInterval(t);
  }, [refresh]);

  const run = async (action: string) => {
    setBusy(action);
    try {
      if (action === 'wake' || action === 'power_up' || action === 'healthCheck') {
        // Full-body wake checklist (head, face, fingers, both hands)
        try {
          const { playWakeAnimation } = await import('@/lib/api');
          const { playWakeUpClient } = await import('@/lib/wakeAnimation');
          await playWakeAnimation();
          void playWakeUpClient();
        } catch {
          /* optional */
        }
      }
      const res = await mrl.mrlLifeAction(action);
      if (res.ok) toast.success(action === 'wake' ? 'Wake + full body check' : `life.${action}()`);
      else toast.error(res.error ?? `Failed ${action}`);
      await refresh();
    } catch {
      toast.error(`life.${action} failed`);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <HeartPulse className="h-4 w-4 text-primary" />
            InMoov2 Life
          </CardTitle>
          <CardDescription>
            Native port of MyRobotLab <code className="text-[10px]">InMoov2/life/*</code> — sleep, random
            motion, health, power
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
          <Badge variant={status?.lifeMode === 'sleep' ? 'offline' : 'online'}>
            mode: {status?.lifeMode ?? '—'}
          </Badge>
          <Badge variant="copper">state: {status?.state ?? '—'}</Badge>
          {status?.randomRunning && <Badge variant="signal">random running</Badge>}
          <Button size="sm" variant="ghost" className="h-7 ml-auto" onClick={() => void refresh()}>
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-2 sm:grid-cols-2">
        {ACTIONS.map((a) => (
          <Button
            key={a.id}
            variant={a.tone === 'destructive' ? 'destructive' : a.tone === 'outline' ? 'outline' : 'outline'}
            className="h-auto justify-start px-3 py-2"
            disabled={!!busy}
            onClick={() => void run(a.id)}
          >
            <a.icon className="mr-2 h-4 w-4 shrink-0" />
            <span className="min-w-0 text-left">
              <span className="block text-xs font-semibold">
                {busy === a.id ? '…' : a.label}
              </span>
              <span className="block text-[10px] font-normal text-muted-foreground">{a.desc}</span>
            </span>
          </Button>
        ))}
      </div>

      {status?.log && status.log.length > 0 && (
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm">Life log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-36 overflow-y-auto font-mono text-[10px] text-muted-foreground">
              {status.log.map((line, i) => (
                <div key={`${i}-${line}`}>{line}</div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
