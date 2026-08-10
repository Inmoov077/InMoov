import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, Pin, Play, RotateCcw, Target } from 'lucide-react';
import { toast } from 'sonner';
import * as api from '@/lib/api';
import { SERVOS, type ServoDef } from '@/lib/servoConfig';
import { useServoStore } from '@/store/servoStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const GROUPS = [
  { id: 'all', label: 'All servos' },
  { id: 'head', label: 'Head' },
  { id: 'neck', label: 'Neck' },
  { id: 'leftArm', label: 'Left arm' },
  { id: 'rightArm', label: 'Right arm' },
  { id: 'leftHand', label: 'Left hand' },
  { id: 'rightHand', label: 'Right hand' },
  { id: 'leftLeg', label: 'Left leg' },
  { id: 'rightLeg', label: 'Right leg' },
] as const;

/**
 * One-to-one servo bench: pick part → set pin → drag angle → min/rest/max tests.
 */
export function ServoTestPanel({ className }: { className?: string }) {
  const connected = useServoStore((s) => s.connected);
  const [group, setGroup] = useState<string>('leftArm');
  const [selectedKey, setSelectedKey] = useState<string>('l_shoulder');
  const [pins, setPins] = useState<Record<string, number>>({});
  const [limits, setLimits] = useState<Record<string, { min: number; max: number; rest: number }>>({});
  const [angle, setAngle] = useState(90);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const lastSent = useRef<number | null>(null);
  const throttle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<number | null>(null);

  const list = useMemo(() => {
    if (group === 'all') return SERVOS;
    return SERVOS.filter((s) => s.group === group);
  }, [group]);

  const servo: ServoDef | undefined = useMemo(
    () => SERVOS.find((s) => s.key === selectedKey) ?? list[0],
    [selectedKey, list],
  );

  const min = limits[selectedKey]?.min ?? servo?.min ?? 0;
  const max = limits[selectedKey]?.max ?? servo?.max ?? 180;
  const rest = limits[selectedKey]?.rest ?? servo?.rest ?? 90;
  const pin = pins[selectedKey] ?? servo?.pin ?? 0;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cfg, pinRes, calRes] = await Promise.all([
        api.getServoConfig(),
        api.getServoPins(),
        api.getServoCalibration(),
      ]);
      const pinMap: Record<string, number> = {};
      const limMap: Record<string, { min: number; max: number; rest: number }> = {};
      for (const s of cfg.servos ?? SERVOS) {
        pinMap[s.key] = s.pin;
        limMap[s.key] = { min: s.min, max: s.max, rest: s.rest };
      }
      Object.assign(pinMap, pinRes.pins ?? {});
      for (const [k, v] of Object.entries(calRes.calibration ?? {})) {
        if (v && typeof v === 'object') limMap[k] = { ...limMap[k], ...(v as object) };
      }
      setPins(pinMap);
      setLimits(limMap);
      const key = selectedKey in limMap ? selectedKey : SERVOS[0]?.key;
      if (key) {
        setSelectedKey(key);
        setAngle(limMap[key]?.rest ?? 90);
      }
    } catch {
      toast.error('Failed to load servo config');
    } finally {
      setLoading(false);
    }
  }, [selectedKey]);

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (list.length && !list.find((s) => s.key === selectedKey)) {
      setSelectedKey(list[0].key);
      setAngle(limits[list[0].key]?.rest ?? list[0].rest);
    }
  }, [group, list, selectedKey, limits]);

  const sendAngle = useCallback(
    (a: number, immediate = false) => {
      const clamped = Math.max(min, Math.min(max, Math.round(a)));
      pending.current = clamped;
      const fire = () => {
        throttle.current = null;
        const v = pending.current;
        if (v == null || v === lastSent.current) return;
        lastSent.current = v;
        void api.moveServoByKey(selectedKey, v);
      };
      if (immediate) {
        if (throttle.current) clearTimeout(throttle.current);
        fire();
        return;
      }
      if (throttle.current) return;
      throttle.current = setTimeout(fire, 40);
    },
    [max, min, selectedKey],
  );

  const selectServo = (key: string) => {
    setSelectedKey(key);
    const r = limits[key]?.rest ?? SERVOS.find((s) => s.key === key)?.rest ?? 90;
    setAngle(r);
    lastSent.current = null;
  };

  const setPin = async (p: number) => {
    const safe = Math.max(2, Math.min(53, Math.round(p) || 2));
    setPins((prev) => ({ ...prev, [selectedKey]: safe }));
    setBusy(true);
    try {
      const res = await api.setServoPin(selectedKey, safe);
      if (res.ok) toast.success(`Pin ${selectedKey} → ${safe}`);
      else toast.error(res.error || 'Pin set failed');
    } finally {
      setBusy(false);
    }
  };

  const saveLimits = async () => {
    const lim = limits[selectedKey] ?? { min, max, rest };
    setBusy(true);
    try {
      const res = await api.setServoLimits(selectedKey, lim);
      if (res.ok) toast.success('Limits saved');
      else toast.error(res.error || 'Limits failed');
    } finally {
      setBusy(false);
    }
  };

  const go = (a: number) => {
    const clamped = Math.max(min, Math.min(max, Math.round(a)));
    setAngle(clamped);
    sendAngle(clamped, true);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading test bench…
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Select value={group} onValueChange={setGroup}>
          <SelectTrigger className="h-8 w-[140px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {GROUPS.map((g) => (
              <SelectItem key={g.id} value={g.id}>
                {g.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant={connected ? 'online' : 'offline'}>
          {connected ? 'USB live' : 'Preview only — connect USB'}
        </Badge>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* Servo picker */}
        <div className="max-h-[52vh] space-y-1 overflow-y-auto rounded-xl border border-border/50 bg-card/40 p-1.5">
          {list.map((s) => {
            const active = s.key === selectedKey;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => selectServo(s.key)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors',
                  active ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted/60',
                )}
              >
                <span className="min-w-0 flex-1 truncate text-xs font-medium">{s.label}</span>
                <span className={cn('font-mono text-[10px]', active ? 'opacity-90' : 'text-muted-foreground')}>
                  #{pins[s.key] ?? s.pin}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active bench */}
        <div className="space-y-3 rounded-xl border border-border/50 bg-card/60 p-3">
          {servo && (
            <>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-lg font-semibold">{servo.label}</h3>
                  <p className="font-mono text-[11px] text-muted-foreground">{servo.key}</p>
                </div>
                <Badge variant="copper">{servo.motor ?? 'Servo'}</Badge>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="flex items-center gap-1 text-xs">
                    <Pin className="h-3 w-3" /> Arduino pin
                  </Label>
                  <div className="flex gap-1.5">
                    <Input
                      type="number"
                      min={2}
                      max={53}
                      className="h-9 font-mono"
                      value={pin}
                      onChange={(e) =>
                        setPins((p) => ({ ...p, [selectedKey]: Number(e.target.value) }))
                      }
                    />
                    <Button size="sm" className="h-9" disabled={busy} onClick={() => void setPin(pin)}>
                      Apply
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="flex items-center gap-1 text-xs">
                    <Target className="h-3 w-3" /> Limits (min / rest / max)
                  </Label>
                  <div className="flex gap-1">
                    {(['min', 'rest', 'max'] as const).map((f) => (
                      <Input
                        key={f}
                        type="number"
                        className="h-9 font-mono text-center text-xs"
                        value={limits[selectedKey]?.[f] ?? (f === 'min' ? min : f === 'max' ? max : rest)}
                        onChange={(e) =>
                          setLimits((l) => ({
                            ...l,
                            [selectedKey]: {
                              min: l[selectedKey]?.min ?? min,
                              max: l[selectedKey]?.max ?? max,
                              rest: l[selectedKey]?.rest ?? rest,
                              [f]: Number(e.target.value),
                            },
                          }))
                        }
                      />
                    ))}
                    <Button size="sm" variant="outline" className="h-9" disabled={busy} onClick={() => void saveLimits()}>
                      Save
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2 rounded-lg border border-border/40 bg-muted/20 p-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Angle — drag for live move</Label>
                  <span className="font-mono text-lg font-bold tabular-nums text-primary">{angle}°</span>
                </div>
                <Slider
                  accent="copper"
                  min={min}
                  max={max}
                  step={1}
                  value={[angle]}
                  onValueChange={([v]) => {
                    setAngle(v);
                    sendAngle(v);
                  }}
                  onValueCommit={([v]) => {
                    setAngle(v);
                    sendAngle(v, true);
                  }}
                />
                <div className="flex flex-wrap gap-1.5">
                  <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => go(min)}>
                    <Play className="h-3 w-3" /> Min {min}°
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => go(rest)}>
                    <RotateCcw className="h-3 w-3" /> Rest {rest}°
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => go(max)}>
                    <Play className="h-3 w-3" /> Max {max}°
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 text-xs"
                    onClick={() => go(Math.round((min + max) / 2))}
                  >
                    Mid
                  </Button>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground">
                1:1 test: select motor → set pin → drag or jump Min/Rest/Max. Safe clamp uses your factory limits.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
