import { useCallback, useEffect, useState } from 'react';
import { Loader2, Pin, RefreshCw, RotateCcw, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import * as mrl from '@/lib/mrlClient';
import { useMrlStore } from '@/store/mrlStore';

interface MrlServoPanelProps {
  service: string;
  label?: string;
}

function num(v: unknown, fallback = 0): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  if (typeof v === 'string' && v !== 'null' && v !== '') {
    const n = parseFloat(v);
    if (!Number.isNaN(n)) return n;
  }
  return fallback;
}

export function MrlServoPanel({ service, label }: MrlServoPanelProps) {
  const servoCache = useMrlStore((s) => s.servoCache);
  const refreshServo = useMrlStore((s) => s.refreshServo);
  const moveServo = useMrlStore((s) => s.moveServo);
  const state = servoCache[service];
  const [loading, setLoading] = useState(!state);
  const [position, setPosition] = useState(90);
  const [pin, setPin] = useState('');
  const [speed, setSpeed] = useState(45);
  const [sweeping, setSweeping] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const s = await refreshServo(service);
    if (s) {
      const pos = num(s.getPosition, num(s.getRest, 90));
      setPosition(pos);
      setPin(String(s.getPin ?? ''));
      setSpeed(num(s.getSpeed, 45));
      setSweeping(!!s.isSweeping);
    }
    setLoading(false);
  }, [refreshServo, service]);

  useEffect(() => {
    void load();
  }, [load]);

  const min = num(state?.getMin, 0);
  const max = num(state?.getMax, 180);
  const rest = num(state?.getRest, 90);
  const attached = !!state?.isAttached;

  const run = async (fn: () => Promise<unknown>, okMsg: string) => {
    try {
      await fn();
      toast.success(okMsg);
      await load();
    } catch {
      toast.error('MRL command failed');
    }
  };

  if (loading && !state) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading {service}…
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{label ?? service}</CardTitle>
            <CardDescription className="font-mono text-xs">{service}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={attached ? 'online' : 'offline'}>{attached ? 'Attached' : 'Detached'}</Badge>
            <Button variant="ghost" size="icon" onClick={() => void load()} title="Refresh">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label className="flex items-center gap-1 text-xs">
              <Pin className="h-3 w-3" /> Pin
            </Label>
            <div className="flex gap-2">
              <Input
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="h-8 font-mono text-sm"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => run(() => mrl.mrlSetPin(service, parseInt(pin, 10)), 'Pin updated')}
              >
                Set
              </Button>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Speed °/s</Label>
            <div className="flex items-center gap-2">
              <Slider
                value={[speed]}
                min={1}
                max={200}
                step={1}
                onValueChange={([v]) => setSpeed(v)}
                onValueCommit={([v]) => run(() => mrl.mrlSetSpeed(service, v), 'Speed set')}
                className="flex-1"
              />
              <span className="w-8 text-right text-xs tabular-nums">{speed}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Position {position}°</Label>
            <span className="text-xs text-muted-foreground">
              min {min} · rest {rest} · max {max}
            </span>
          </div>
          <Slider
            value={[position]}
            min={min}
            max={max}
            step={1}
            onValueChange={([v]) => setPosition(v)}
            onValueCommit={([v]) => void moveServo(service, v)}
          />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => run(() => mrl.mrlRest(service), 'Rest')}>
              <RotateCcw className="mr-1 h-3 w-3" /> Rest
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => run(() => mrl.mrlMoveTo(service, rest), 'Moved to rest')}
            >
              Go rest ({rest}°)
            </Button>
            {attached ? (
              <Button size="sm" variant="outline" onClick={() => run(() => mrl.mrlDetach(service), 'Detached')}>
                Detach
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => run(() => mrl.mrlAttach(service), 'Attached')}>
                Attach
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border/50 bg-muted/30 p-3">
          <div className="flex items-center gap-2">
            <Switch
              checked={sweeping}
              onCheckedChange={(v) => run(() => mrl.mrlSweep(service, v), v ? 'Sweep on' : 'Sweep off')}
            />
            <Label className="text-sm">Sweep</Label>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => run(() => mrl.mrlEnable(service), 'Enabled')}
          >
            <Zap className="mr-1 h-3 w-3" /> Enable
          </Button>
          <Button size="sm" variant="ghost" onClick={() => run(() => mrl.mrlDisable(service), 'Disabled')}>
            Disable
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}