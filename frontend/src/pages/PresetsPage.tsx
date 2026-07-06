import { useRef, useState } from 'react';
import { Loader2, Play, Square } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { PRESETS, PRESET_META } from '@/lib/presets';
import { animateKeyframes } from '@/lib/animateKeyframes';
import { useBodyStore } from '@/store/bodyStore';
import { useServoStore } from '@/store/servoStore';
import { cn } from '@/lib/utils';

export function PresetsPage() {
  const [running, setRunning] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const centerAll = useServoStore((s) => s.centerAll);
  const centerBody = useBodyStore((s) => s.centerBody);

  const playPreset = async (id: string) => {
    const keyframes = PRESETS[id];
    if (!keyframes) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setRunning(id);
    try {
      await animateKeyframes(keyframes, { signal: controller.signal });
    } finally {
      setRunning(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ready moves"
        description="One tap — the robot does the rest."
        actions={
          running ? (
            <Button variant="destructive" size="sm" onClick={() => { abortRef.current?.abort(); setRunning(null); centerAll(); centerBody(); }}>
              <Square className="h-4 w-4" /> Stop
            </Button>
          ) : undefined
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PRESET_META.map((preset) => (
          <div key={preset.id} className={cn('preset-tile', running === preset.id && 'active')}>
            <div className="flex items-start justify-between">
              <span className="text-3xl">{preset.icon}</span>
              {running === preset.id && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
            </div>
            <h3 className="mt-4 font-display text-xl font-semibold">{preset.name}</h3>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{preset.desc}</p>
            <Button className="mt-4 w-full" disabled={!!running} onClick={() => playPreset(preset.id)}>
              <Play className="h-4 w-4" /> Play
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}