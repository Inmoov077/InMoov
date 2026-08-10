import { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useMrlStore } from '@/store/mrlStore';

/**
 * MRL-style compact servo: drag the thumb — live moveTo while sliding.
 * Matches MyRobotLab WebGui slider feel (onSliderChange while tracking).
 */
interface MrlDragServoProps {
  service: string;
  label?: string;
  className?: string;
  /** Override min/max when Core returns defaults */
  min?: number;
  max?: number;
  accent?: 'copper' | 'signal' | 'phosphor' | 'violet';
}

function num(v: unknown, fallback = 0): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  if (typeof v === 'string' && v !== 'null' && v !== '') {
    const n = parseFloat(v);
    if (!Number.isNaN(n)) return n;
  }
  return fallback;
}

export function MrlDragServo({
  service,
  label,
  className,
  min: minProp,
  max: maxProp,
  accent = 'signal',
}: MrlDragServoProps) {
  const state = useMrlStore((s) => s.servoCache[service]);
  const refreshServo = useMrlStore((s) => s.refreshServo);
  const moveServo = useMrlStore((s) => s.moveServo);

  const [loading, setLoading] = useState(!state);
  const [position, setPosition] = useState(90);
  const lastSent = useRef<number | null>(null);
  const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<number | null>(null);

  const min = minProp ?? num(state?.getMin, 0);
  const max = maxProp ?? num(state?.getMax, 180);
  const rest = num(state?.getRest, 90);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const s = await refreshServo(service);
      if (!alive) return;
      if (s) setPosition(num(s.getPosition, num(s.getRest, 90)));
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [service, refreshServo]);

  const sendLive = useCallback(
    (angle: number) => {
      pending.current = angle;
      if (throttleRef.current) return;
      throttleRef.current = setTimeout(() => {
        throttleRef.current = null;
        const v = pending.current;
        if (v == null || v === lastSent.current) return;
        lastSent.current = v;
        void moveServo(service, v, { refresh: false });
      }, 40); // ~25 Hz — smooth drag without flooding serial
    },
    [moveServo, service],
  );

  const onDrag = (v: number) => {
    const clamped = Math.max(min, Math.min(max, Math.round(v)));
    setPosition(clamped);
    sendLive(clamped);
  };

  const onCommit = (v: number) => {
    const clamped = Math.max(min, Math.min(max, Math.round(v)));
    setPosition(clamped);
    lastSent.current = clamped;
    void moveServo(service, clamped, { refresh: true });
  };

  if (loading && !state) {
    return (
      <div className={cn('mrl-drag-servo is-loading', className)}>
        <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label ?? service}</span>
      </div>
    );
  }

  const shortLabel = label ?? service.split('.').pop() ?? service;

  return (
    <div className={cn('mrl-drag-servo', className)} title={service}>
      <div className="mrl-drag-servo-meta">
        <span className="mrl-drag-servo-label">{shortLabel}</span>
        <span className="mrl-drag-servo-range">
          {min}–{max}
        </span>
      </div>
      <Slider
        accent={accent}
        min={min}
        max={max}
        step={1}
        value={[position]}
        onValueChange={([v]) => onDrag(v)}
        onValueCommit={([v]) => onCommit(v)}
        className="min-w-0 flex-1"
      />
      <button
        type="button"
        className="mrl-drag-servo-value"
        title={`Rest ${rest}° — click to rest`}
        onClick={() => onCommit(rest)}
      >
        {position}°
      </button>
    </div>
  );
}
