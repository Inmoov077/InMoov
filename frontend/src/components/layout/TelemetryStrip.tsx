import { Eye, Move3d, RotateCw, ScanFace, Smile } from 'lucide-react';
import { useServoStore } from '@/store/servoStore';
import { cn } from '@/lib/utils';

const STATS = [
  { key: 'hneck' as const, label: 'Head', icon: ScanFace, bg: 'bg-primary/12 text-primary' },
  { key: 'eye' as const, label: 'Eyes', icon: Eye, bg: 'bg-info/12 text-info' },
  { key: 'jaw' as const, label: 'Jaw', icon: Smile, bg: 'bg-success/12 text-success' },
  { key: 'rot' as const, label: 'Spin', icon: RotateCw, bg: 'bg-axis-violet/12 text-axis-violet' },
  { key: 'tilt' as const, label: 'Nod', icon: Move3d, bg: 'bg-axis-amber/12 text-axis-amber' },
  { key: 'roll' as const, label: 'Lean', icon: RotateCw, bg: 'bg-axis-sky/12 text-axis-sky' },
];

export function TelemetryStrip() {
  const hneck = useServoStore((s) => s.hneck);
  const eye = useServoStore((s) => s.eye);
  const jaw = useServoStore((s) => s.jaw);
  const rot = useServoStore((s) => s.rot);
  const tilt = useServoStore((s) => s.tilt);
  const roll = useServoStore((s) => s.roll);
  const values = { hneck, eye, jaw, rot, tilt, roll };

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
      {STATS.map((s) => (
        <div key={s.key} className="stat-chip">
          <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl', s.bg)}>
            <s.icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="font-mono text-base font-semibold">{values[s.key]}°</p>
          </div>
        </div>
      ))}
    </div>
  );
}