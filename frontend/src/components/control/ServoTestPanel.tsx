import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlipHorizontal2, Loader2, Pin, Play, RotateCcw, Target } from 'lucide-react';
import { toast } from 'sonner';
import * as api from '@/lib/api';
import { applyLocalServoAngle } from '@/lib/applyLocalServo';
import { SERVOS, type ServoDef } from '@/lib/servoConfig';
import { servoDisplayName, servoShortName } from '@/lib/servoNames';
import { getShowLegs } from '@/lib/studioPrefs';
import { usePinStore } from '@/store/pinStore';
import { useLimitStore } from '@/store/limitStore';
import { useServoStore } from '@/store/servoStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { NumberEdit } from '@/components/ui/number-edit';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

const BASE_GROUPS: { id: string; label: string; match: (s: ServoDef) => boolean }[] = [
  { id: 'head', label: 'Head', match: (s) => s.group === 'head' },
  { id: 'neck', label: 'Neck', match: (s) => s.group === 'neck' },
  { id: 'arms', label: 'Arms', match: (s) => s.group === 'leftArm' || s.group === 'rightArm' },
  { id: 'hands', label: 'Hands', match: (s) => s.group === 'leftHand' || s.group === 'rightHand' },
  { id: 'legs', label: 'Legs', match: (s) => s.group === 'leftLeg' || s.group === 'rightLeg' },
];

const DEFAULT_INVERT: Record<string, boolean> = {
  l_shoulder: true,
  l_lift: true,
  l_rotate: true,
  l_elbow: true,
  l_wrist: true,
  r_shoulder: true,
  r_lift: false, // right omoplate: invert off (per hardware)
  r_rotate: true,
  r_elbow: true,
  r_wrist: true,
};

/**
 * Single Studio control — pick motor, set pin / limits / invert / angle.
 * No duplicate Head/Body panels. Pins + limits save permanently.
 */
export function ServoTestPanel({
  className,
  initialGroup = 'arms',
}: {
  className?: string;
  initialGroup?: string;
}) {
  const connected = useServoStore((s) => s.connected);
  const pins = usePinStore((s) => s.pins);
  const setPinLocal = usePinStore((s) => s.setPinLocal);
  const saveOnePin = usePinStore((s) => s.saveOne);
  const hydratePins = usePinStore((s) => s.hydrate);

  const limitsMap = useLimitStore((s) => s.limits);
  const hydrateLimits = useLimitStore((s) => s.hydrate);
  const setLimitLocal = useLimitStore((s) => s.setLocal);
  const saveLimitsOne = useLimitStore((s) => s.saveOne);
  const clampAngle = useLimitStore((s) => s.clampAngle);

  const [showLegs, setShowLegsState] = useState(() => getShowLegs());
  const [group, setGroup] = useState(initialGroup === 'legs' && !getShowLegs() ? 'arms' : initialGroup);
  const [selectedKey, setSelectedKey] = useState('l_shoulder');
  const [invert, setInvert] = useState<Record<string, boolean>>({ ...DEFAULT_INVERT });
  const [angle, setAngle] = useState(90);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const lastSent = useRef<number | null>(null);
  const throttle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<number | null>(null);

  useEffect(() => {
    const onPrefs = () => {
      const on = getShowLegs();
      setShowLegsState(on);
      if (!on && group === 'legs') setGroup('arms');
    };
    window.addEventListener('inmoov-studio-prefs', onPrefs);
    return () => window.removeEventListener('inmoov-studio-prefs', onPrefs);
  }, [group]);

  const GROUPS = useMemo(
    () => BASE_GROUPS.filter((g) => g.id !== 'legs' || showLegs),
    [showLegs],
  );

  const list = useMemo(() => {
    const g = GROUPS.find((x) => x.id === group) ?? GROUPS.find((x) => x.id === 'arms') ?? GROUPS[0];
    return SERVOS.filter(g.match);
  }, [group, GROUPS]);

  const servo = useMemo(
    () => SERVOS.find((s) => s.key === selectedKey) ?? list[0],
    [selectedKey, list],
  );

  const lim = limitsMap[selectedKey] ?? {
    min: servo?.min ?? 0,
    max: servo?.max ?? 180,
    rest: servo?.rest ?? 90,
  };
  const min = lim.min;
  const max = lim.max;
  const rest = lim.rest;
  /** Only show pin after user saved / typed a draft — never factory prefill. */
  const pin = pins[selectedKey];
  const inverted = invert[selectedKey] ?? DEFAULT_INVERT[selectedKey] ?? false;
  const safeAngle = clampAngle(selectedKey, angle);
  const title = servo ? servoDisplayName(servo.key, servo.label) : 'Motor';
  const short = servo ? servoShortName(servo.key, servo.label) : 'Motor';

  useEffect(() => {
    let cancelled = false;
    // Paint control UI immediately; hydrate in background (no full-page spinner)
    setLoading(false);
    (async () => {
      try {
        await Promise.all([hydratePins(), hydrateLimits()]);
        const invRes = await api.getServoInvert().catch(() => ({ invert: {} as Record<string, boolean> }));
        if (cancelled) return;
        if (invRes.invert) setInvert((p) => ({ ...DEFAULT_INVERT, ...p, ...invRes.invert }));
        const key = selectedKey;
        const r = useLimitStore.getState().getLimits(key).rest;
        setAngle(r);
      } catch {
        /* offline defaults already shown */
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (list.length && !list.find((s) => s.key === selectedKey)) {
      const k = list[0].key;
      setSelectedKey(k);
      setAngle(useLimitStore.getState().getLimits(k).rest);
      lastSent.current = null;
    }
  }, [group, list, selectedKey]);

  const sendAngle = useCallback(
    (a: number, immediate = false) => {
      // Always update local angle + 3D preview (USB not required for preview)
      const clamped = clampAngle(selectedKey, a);
      setAngle(clamped);
      pending.current = clamped;

      const fire = () => {
        throttle.current = null;
        const v = pending.current;
        if (v == null) return;
        // Skip redundant store writes only for the same value when throttling
        if (!immediate && v === lastSent.current) return;
        lastSent.current = v;

        // Always update stores + 3D preview (no USB required)
        const applied = applyLocalServoAngle(selectedKey, v, { send: false });
        setAngle(applied);

        // Real motors only when USB is connected
        if (useServoStore.getState().connected) {
          void api.moveServoByKey(selectedKey, applied).then((res) => {
            if (res.ok && typeof res.angle === 'number') {
              setAngle(useLimitStore.getState().clampAngle(selectedKey, res.angle));
            } else if (!res.ok && immediate) {
              toast.message('USB write failed — 3D preview still updated');
              void useServoStore.getState().refreshConnection();
            }
          });
        }
      };

      if (immediate) {
        if (throttle.current) clearTimeout(throttle.current);
        fire();
        return;
      }
      if (throttle.current) return;
      // 40ms throttle = smooth preview without flooding serial
      throttle.current = setTimeout(fire, 40);
    },
    [clampAngle, selectedKey],
  );

  const selectServo = (key: string) => {
    setSelectedKey(key);
    setAngle(useLimitStore.getState().getLimits(key).rest);
    lastSent.current = null;
  };

  const applyPin = async () => {
    if (pin == null || pin < 2) {
      toast.error('Enter a pin number first (2–53)');
      return;
    }
    const safe = Math.max(2, Math.min(53, Math.round(pin)));
    setBusy(true);
    try {
      const res = await saveOnePin(selectedKey, safe, connected);
      if (res.ok) {
        toast.success(connected && res.serial_sent ? `${short} → D${safe}` : `${short} pin saved`);
        lastSent.current = null;
      } else toast.error(res.error || 'Pin save failed');
    } finally {
      setBusy(false);
    }
  };

  const setInvertMode = async (on: boolean) => {
    setInvert((prev) => ({ ...prev, [selectedKey]: on }));
    setBusy(true);
    try {
      const res = await api.setServoInvert(selectedKey, on, connected);
      if (res.ok) {
        toast.success(`Invert ${on ? 'ON' : 'OFF'}`);
        lastSent.current = null;
        if (connected) sendAngle(angle, true);
      } else {
        toast.error(res.error || 'Invert failed');
        setInvert((prev) => ({ ...prev, [selectedKey]: !on }));
      }
    } finally {
      setBusy(false);
    }
  };

  const saveLimits = async () => {
    const draft = limitsMap[selectedKey] ?? { min, max, rest };
    setBusy(true);
    try {
      const res = await saveLimitsOne(selectedKey, draft);
      if (res.ok) {
        toast.success(`Saved ${res.min}–${res.max}° (rest ${res.rest}°) permanently`);
        setAngle((a) => clampAngle(selectedKey, a));
      } else toast.error(res.error || 'Limits save failed');
    } finally {
      setBusy(false);
    }
  };

  const go = (a: number) => sendAngle(a, true);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Groups */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border/40 pb-2">
        {GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setGroup(g.id)}
            className={cn(
              'rounded-md px-3 py-1.5 text-xs font-semibold transition-colors',
              group === g.id
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {g.label}
          </button>
        ))}
        <span className="ml-auto text-[11px] text-muted-foreground">
          {connected ? 'USB on' : 'USB off'}
        </span>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(180px,220px)_minmax(0,1fr)]">
        {/* Motor list — flat */}
        <div className="max-h-[min(58vh,540px)] overflow-y-auto border-r border-border/30 pr-1">
          {list.map((s) => {
            const active = s.key === selectedKey;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => selectServo(s.key)}
                className={cn(
                  'flex w-full items-center gap-2 border-b border-border/25 px-2 py-2.5 text-left transition-colors',
                  active ? 'bg-muted font-semibold' : 'hover:bg-muted/40',
                )}
              >
                <span className="min-w-0 flex-1 truncate text-sm leading-snug">
                  {servoShortName(s.key, s.label)}
                </span>
                <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
                  {pins[s.key] != null ? `D${pins[s.key]}` : '—'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active motor */}
        <div className="min-w-0 space-y-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Safe range {min}° – {max}°
              {pin != null ? ` · Arduino pin D${pin}` : ' · pin empty until Save'}
            </p>
          </div>

          {/* Pin + Invert */}
          <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
            <div className="flex flex-col gap-1.5">
              <Label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                <Pin className="h-3.5 w-3.5" />
                Pin
              </Label>
              <div className="flex items-center gap-2.5">
                <NumberEdit
                  value={pin}
                  min={2}
                  max={53}
                  digits={2}
                  size="md"
                  allowEmpty
                  placeholder="—"
                  title="Empty until you type and Save pin (2–53)"
                  onCommit={(n) => setPinLocal(selectedKey, n)}
                  onClear={() => usePinStore.getState().clearPinLocal(selectedKey)}
                />
                <Button
                  className="h-10 shrink-0 px-4"
                  disabled={busy || pin == null}
                  onClick={() => void applyPin()}
                >
                  Save pin
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 sm:ml-auto">
              <Label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                <FlipHorizontal2 className="h-3.5 w-3.5" />
                Invert
              </Label>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void setInvertMode(false)}
                  className={cn(
                    'h-10 min-w-[3.25rem] rounded-md px-3 text-sm font-semibold',
                    !inverted ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground',
                  )}
                >
                  Off
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void setInvertMode(true)}
                  className={cn(
                    'h-10 min-w-[3.25rem] rounded-md px-3 text-sm font-semibold',
                    inverted ? 'bg-sky-600 text-white' : 'bg-muted text-muted-foreground',
                  )}
                >
                  On
                </button>
              </div>
            </div>
          </div>

          {/* Limits */}
          <div className="space-y-2.5">
            <Label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              <Target className="h-3.5 w-3.5" />
              Safe range (saved permanently)
            </Label>
            <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
              {(['min', 'rest', 'max'] as const).map((f) => (
                <NumberEdit
                  key={f}
                  label={f === 'min' ? 'Min' : f === 'max' ? 'Max' : 'Rest'}
                  value={lim[f]}
                  min={0}
                  max={180}
                  digits={3}
                  size="md"
                  title={`${f} degrees`}
                  onCommit={(n) => setLimitLocal(selectedKey, { ...lim, [f]: n })}
                />
              ))}
              <Button
                variant="outline"
                className="h-10 shrink-0 px-4"
                disabled={busy}
                onClick={() => void saveLimits()}
              >
                Save limits
              </Button>
            </div>
          </div>

          {/* Angle */}
          <div className="space-y-3 border-t border-border/40 pt-4">
            <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Angle
                </Label>
                <div className="flex items-center gap-2.5">
                  <NumberEdit
                    value={safeAngle}
                    min={0}
                    max={180}
                    digits={3}
                    size="lg"
                    title="Angle in degrees"
                    onCommit={(n) => {
                      setAngle(n);
                      go(n);
                    }}
                  />
                  <span className="pb-2 text-sm font-medium text-muted-foreground">°</span>
                  <Button className="h-11 shrink-0 px-5" disabled={busy} onClick={() => go(angle)}>
                    Go
                  </Button>
                </div>
              </div>
            </div>
            <Slider
              accent="copper"
              min={min}
              max={Math.max(min + 1, max)}
              step={1}
              value={[safeAngle]}
              onValueChange={([v]) => sendAngle(v, false)}
              onValueCommit={([v]) => go(v)}
            />
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="h-9 gap-1.5 px-3" onClick={() => go(min)}>
                <Play className="h-3.5 w-3.5" /> Min {min}°
              </Button>
              <Button size="sm" variant="outline" className="h-9 gap-1.5 px-3" onClick={() => go(rest)}>
                <RotateCcw className="h-3.5 w-3.5" /> Rest {rest}°
              </Button>
              <Button size="sm" variant="outline" className="h-9 gap-1.5 px-3" onClick={() => go(max)}>
                Max {max}°
              </Button>
            </div>
          </div>

          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Type any number freely (backspace to clear). Preview works without USB. Connect USB for real motors.
          </p>
        </div>
      </div>
    </div>
  );
}
