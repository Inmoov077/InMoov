import { useCallback, useEffect, useRef, useState } from 'react';
import { Move } from 'lucide-react';
import { syncLiveRobot } from '@/lib/robotLiveController';
import { readStoreAngles } from '@/lib/robotStoreAngles';
import { useServoStore } from '@/store/servoStore';
import { cn, clamp } from '@/lib/utils';

export function Joystick({ className, compact = true }: { className?: string; compact?: boolean }) {
  const PAD = compact ? 132 : 200;
  const KNOB = compact ? 36 : 48;
  const rot = useServoStore((s) => s.rot);
  const tilt = useServoStore((s) => s.tilt);
  const limits = useServoStore((s) => s.limits);
  const padRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [active, setActive] = useState(false);

  const rotToX = (r: number) =>
    ((r - limits.rot.min) / (limits.rot.max - limits.rot.min)) * (PAD - KNOB);
  const tiltToY = (t: number) =>
    (1 - (t - limits.tilt.min) / (limits.tilt.max - limits.tilt.min)) * (PAD - KNOB);

  const [knob, setKnob] = useState({ x: rotToX(rot), y: tiltToY(tilt) });

  useEffect(() => {
    if (!dragging.current) setKnob({ x: rotToX(rot), y: tiltToY(tilt) });
  }, [rot, tilt, limits, PAD, KNOB]);

  const update = useCallback(
    (cx: number, cy: number) => {
      const pad = padRef.current;
      if (!pad) return;
      const rect = pad.getBoundingClientRect();
      const x = clamp(cx - rect.left - KNOB / 2, 0, PAD - KNOB);
      const y = clamp(cy - rect.top - KNOB / 2, 0, PAD - KNOB);
      setKnob({ x, y });
      const st = useServoStore.getState();
      const rotVal = Math.round(
        limits.rot.min + (x / (PAD - KNOB)) * (limits.rot.max - limits.rot.min),
      );
      const tiltVal = Math.round(
        limits.tilt.max - (y / (PAD - KNOB)) * (limits.tilt.max - limits.tilt.min),
      );
      st.setNeck('rot', rotVal, false);
      st.setNeck('tilt', tiltVal, true);
      syncLiveRobot(readStoreAngles());
    },
    [limits, PAD, KNOB],
  );

  return (
    <div className={cn('surface flex flex-col items-center gap-2 p-3', className)}>
      <div className="flex w-full items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-xs font-semibold">
          <Move className="h-3.5 w-3.5 text-primary" /> Neck pad
        </p>
        <div className="flex gap-3 font-mono text-[11px] text-muted-foreground">
          <span>
            Spin <strong className="text-foreground">{rot}°</strong>
          </span>
          <span>
            Nod <strong className="text-foreground">{tilt}°</strong>
          </span>
        </div>
      </div>
      <div
        ref={padRef}
        className={cn('joystick-ring border border-border/40', active && 'active')}
        style={{ width: PAD, height: PAD }}
        onPointerDown={(e) => {
          dragging.current = true;
          setActive(true);
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          update(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => dragging.current && update(e.clientX, e.clientY)}
        onPointerUp={() => {
          dragging.current = false;
          setActive(false);
        }}
      >
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-full w-px bg-border/50" />
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-px w-full bg-border/50" />
        </div>
        <div
          className="absolute rounded-full bg-primary shadow-glow"
          style={{
            width: KNOB,
            height: KNOB,
            left: knob.x,
            top: knob.y,
            border: '2px solid hsl(var(--card))',
          }}
        />
      </div>
    </div>
  );
}
