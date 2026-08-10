import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, RefreshCw, Save, Undo2 } from 'lucide-react';
import { toast } from 'sonner';
import * as api from '@/lib/api';
import { SERVOS, type ServoDef } from '@/lib/servoConfig';
import { useServoStore } from '@/store/servoStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const GROUP_ORDER = [
  'head',
  'neck',
  'leftArm',
  'rightArm',
  'leftHand',
  'rightHand',
  'leftLeg',
  'rightLeg',
] as const;

const GROUP_LABELS: Record<string, string> = {
  head: 'Head',
  neck: 'Neck',
  leftArm: 'Left Arm',
  rightArm: 'Right Arm',
  leftHand: 'Left Hand',
  rightHand: 'Right Hand',
  leftLeg: 'Left Leg',
  rightLeg: 'Right Leg',
};

export function PinMapPanel({ className }: { className?: string }) {
  const connected = useServoStore((s) => s.connected);
  const [pins, setPins] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [filter, setFilter] = useState('');

  const grouped = useMemo(() => {
    const map: Record<string, ServoDef[]> = {};
    for (const s of SERVOS) {
      if (!map[s.group]) map[s.group] = [];
      map[s.group].push(s);
    }
    return map;
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cfg, pinRes] = await Promise.all([api.getServoConfig(), api.getServoPins()]);
      const pinMap: Record<string, number> = {};
      for (const s of cfg.servos ?? SERVOS) pinMap[s.key] = s.pin;
      Object.assign(pinMap, pinRes.pins ?? {});
      setPins(pinMap);
      setDirty(false);
    } catch {
      toast.error('Could not load pin map');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onPinChange = async (key: string, pin: number) => {
    const safe = Math.max(2, Math.min(53, Math.round(pin) || 2));
    setPins((p) => ({ ...p, [key]: safe }));
    setDirty(true);
  };

  /** Apply one pin immediately to Arduino (and save override). */
  const applyOne = async (key: string) => {
    const safe = Math.max(2, Math.min(53, Math.round(pins[key] ?? 2)));
    if (!connected) {
      toast.error('Connect USB first — pin will not reach Arduino offline');
      return;
    }
    setSaving(true);
    try {
      const res = await api.setServoPin(key, safe, true);
      if (res.ok && res.serial_sent) {
        toast.success(`${key} → pin ${safe}${res.test_sent ? ' (test pulse sent)' : ''}`);
        if (res.warning) toast.warning(res.warning);
        setDirty(true);
      } else {
        toast.error(res.error || res.hint || 'Pin not applied — reconnect USB');
      }
    } catch {
      toast.error('Pin apply failed');
    } finally {
      setSaving(false);
    }
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      if (!connected) {
        const res = await api.saveServoPins(pins, false);
        if (res.ok) {
          toast.warning('Pins saved to disk only — connect USB then Save again to program board');
          setDirty(false);
        } else toast.error(res.error || 'Save failed');
        return;
      }
      const res = await api.saveServoPins(pins, true);
      if (res.ok) {
        const n = res.firmware_applied?.length ?? 0;
        const fail = (res.firmware_failed as string[] | undefined)?.length ?? 0;
        if (n > 0) {
          toast.success(
            `Saved & pushed ${n} pins to Arduino` + (fail ? ` (${fail} failed — keep USB connected)` : ''),
          );
          // Do NOT full sync here — re-pushing all W+U floods serial and drops COM
        } else {
          toast.warning(res.warning || 'Saved but board did not confirm pin writes');
        }
        setDirty(false);
        void useServoStore.getState().refreshConnection();
      } else toast.error(res.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const resetDefaults = () => {
    const defaults: Record<string, number> = {};
    for (const s of SERVOS) defaults[s.key] = s.pin;
    setPins(defaults);
    setDirty(true);
    toast.info('Reset to Mega defaults — click Save');
  };

  const applyVdb = async () => {
    const res = await api.applyVdbPinProfile();
    if (res.ok) {
      toast.success('VDB pin profile applied');
      await load();
    } else toast.error('VDB profile failed');
  };

  const q = filter.trim().toLowerCase();

  /** Detect duplicate Mega pins (causes intermittent / fighting motors) */
  const conflicts = useMemo(() => {
    const byPin: Record<number, string[]> = {};
    for (const s of SERVOS) {
      const pin = pins[s.key] ?? s.pin;
      if (pin < 2) continue;
      if (!byPin[pin]) byPin[pin] = [];
      byPin[pin].push(s.key);
    }
    const map: Record<string, number> = {};
    for (const [pinStr, keys] of Object.entries(byPin)) {
      if (keys.length > 1) {
        for (const k of keys) map[k] = Number(pinStr);
      }
    }
    return map;
  }, [pins]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading pins…
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Filter servo…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-8 max-w-[200px] text-xs"
        />
        <Button size="sm" className="h-8" onClick={() => void saveAll()} disabled={saving || !dirty}>
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          Save pins
        </Button>
        <Button size="sm" variant="outline" className="h-8" onClick={resetDefaults}>
          <Undo2 className="h-3.5 w-3.5" /> Defaults
        </Button>
        <Button size="sm" variant="outline" className="h-8" onClick={() => void applyVdb()}>
          VDB profile
        </Button>
        <Button size="sm" variant="ghost" className="h-8" onClick={() => void load()}>
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
        {dirty && (
          <Badge variant="signal" className="text-[10px]">
            unsaved
          </Badge>
        )}
        <Badge variant={connected ? 'online' : 'offline'} className="text-[10px]">
          {connected ? 'live → firmware' : 'offline save only'}
        </Badge>
      </div>

      <p className="text-[11px] text-muted-foreground">
        Assign Mega pin (2–53) per motor. <strong>Apply</strong> programs the board; <strong>Save pins</strong> writes all.
        Red rows = pin conflict (two motors on one pin — fix these first).
      </p>
      {Object.keys(conflicts).length > 0 && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-[11px] text-destructive">
          Pin conflicts detected on: {[...new Set(Object.values(conflicts))].join(', ')}. Each pin must be unique.
        </div>
      )}

      {GROUP_ORDER.map((group) => {
        let servos = grouped[group] ?? [];
        if (q) {
          servos = servos.filter(
            (s) =>
              s.label.toLowerCase().includes(q) ||
              s.key.toLowerCase().includes(q) ||
              String(pins[s.key] ?? s.pin).includes(q),
          );
        }
        if (!servos.length) return null;
        return (
          <div key={group} className="rounded-xl border border-border/50 bg-card/50 p-2">
            <p className="mb-1.5 px-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {GROUP_LABELS[group] ?? group}
            </p>
            <div className="space-y-1">
              {servos.map((s) => (
                <div
                  key={s.key}
                  className={cn(
                    'grid grid-cols-[1fr_auto_auto_4rem_auto] items-center gap-2 rounded-lg border bg-background/60 px-2 py-1.5',
                    conflicts[s.key]
                      ? 'border-destructive/60 bg-destructive/5'
                      : 'border-border/40',
                  )}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{s.label}</p>
                    <p className="truncate font-mono text-[10px] text-muted-foreground">{s.key}</p>
                  </div>
                  <Badge variant="default" className="text-[9px]">
                    {s.motor ?? 'Servo'}
                  </Badge>
                  {s.vdbPin != null && (
                    <span className="text-[10px] text-muted-foreground">VDB {s.vdbPin}</span>
                  )}
                  {s.vdbPin == null && <span />}
                  <Input
                    type="number"
                    min={2}
                    max={53}
                    className="h-8 w-16 font-mono text-center text-sm"
                    value={pins[s.key] ?? s.pin}
                    onChange={(e) => void onPinChange(s.key, Number(e.target.value))}
                    title="Arduino pin"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-2 text-[10px]"
                    disabled={saving}
                    onClick={() => void applyOne(s.key)}
                    title="Apply this pin to Arduino now"
                  >
                    Apply
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
