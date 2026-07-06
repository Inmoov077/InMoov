import { useCallback, useEffect, useRef, useState } from 'react';
import { Move } from 'lucide-react';
import { syncLiveRobot } from '@/lib/robotLiveController';
import { readStoreAngles } from '@/lib/robotStoreAngles';
import { useServoStore } from '@/store/servoStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, clamp } from '@/lib/utils';

const PAD = 200;
const KNOB = 48;

export function Joystick({ className }: { className?: string }) {
  const rot = useServoStore((s) => s.rot);
  const tilt = useServoStore((s) => s.tilt);
  const limits = useServoStore((s) => s.limits);
  const padRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [active, setActive] = useState(false);

  const rotToX = (r: number) => ((r - limits.rot.min) / (limits.rot.max - limits.rot.min)) * (PAD - KNOB);
  const tiltToY = (t: number) => (1 - (t - limits.tilt.min) / (limits.tilt.max - limits.tilt.min)) * (PAD - KNOB);

  const [knob, setKnob] = useState({ x: rotToX(rot), y: tiltToY(tilt) });

  useEffect(() => {
    if (!dragging.current) setKnob({ x: rotToX(rot), y: tiltToY(tilt) });
  }, [rot, tilt, limits]);

  const update = useCallback((cx: number, cy: number) => {
    const pad = padRef.current;
    if (!pad) return;
    const rect = pad.getBoundingClientRect();
    const x = clamp(cx - rect.left - KNOB / 2, 0, PAD - KNOB);
    const y = clamp(cy - rect.top - KNOB / 2, 0, PAD - KNOB);
    setKnob({ x, y });
    const st = useServoStore.getState();
    const rotVal = Math.round(limits.rot.min + (x / (PAD - KNOB)) * (limits.rot.max - limits.rot.min));
    const tiltVal = Math.round(limits.tilt.max - (y / (PAD - KNOB)) * (limits.tilt.max - limits.tilt.min));
    st.setNeck('rot', rotVal, false);
    st.setNeck('tilt', tiltVal, true);
    syncLiveRobot(readStoreAngles());
  }, [limits]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Move className="h-5 w-5 text-primary" />Neck pad</CardTitle>
        <CardDescription>Drag the circle — side to side spins, up and down nods.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div
          ref={padRef}
          className={cn('joystick-ring border-2 border-border/40', active && 'active')}
          style={{ width: PAD, height: PAD }}
          onPointerDown={(e) => { dragging.current = true; setActive(true); (e.target as HTMLElement).setPointerCapture(e.pointerId); update(e.clientX, e.clientY); }}
          onPointerMove={(e) => dragging.current && update(e.clientX, e.clientY)}
          onPointerUp={() => { dragging.current = false; setActive(false); }}
        >
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center"><div className="h-full w-px bg-border/50" /></div>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center"><div className="h-px w-full bg-border/50" /></div>
          <div
            className="absolute rounded-full bg-primary shadow-glow transition-transform"
            style={{ width: KNOB, height: KNOB, left: knob.x, top: knob.y, border: '3px solid hsl(var(--card))' }}
          />
        </div>
        <div className="flex gap-6 rounded-full bg-muted px-5 py-2 font-mono text-sm">
          <span>Spin <strong className="text-axis-violet">{rot}°</strong></span>
          <span>Nod <strong className="text-axis-amber">{tilt}°</strong></span>
        </div>
      </CardContent>
    </Card>
  );
}