import { useMemo, useRef, useState } from 'react';
import { Loader2, Play, Square } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PRESETS, PRESET_META, type PresetCategory } from '@/lib/presets';
import { animateKeyframes } from '@/lib/animateKeyframes';
import { useBodyStore } from '@/store/bodyStore';
import { useServoStore } from '@/store/servoStore';
import { cn } from '@/lib/utils';

type FilterTab = 'all' | PresetCategory;

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'builtin', label: 'Built-in' },
  { id: 'head', label: 'Head' },
  { id: 'arm', label: 'Arms' },
  { id: 'hand', label: 'Hands' },
  { id: 'full', label: 'Full body' },
  { id: 'social', label: 'Social' },
];

export function PresetsPage() {
  const [running, setRunning] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterTab>('all');
  const abortRef = useRef<AbortController | null>(null);
  const centerAll = useServoStore((s) => s.centerAll);
  const centerBody = useBodyStore((s) => s.centerBody);

  const visiblePresets = useMemo(() => {
    if (filter === 'all') return PRESET_META;
    return PRESET_META.filter((p) => p.category === filter);
  }, [filter]);

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
        description="Built-in animations plus 136 official MyRobotLab 1.1.1610 InMoov2 gestures."
        actions={
          running ? (
            <Button variant="destructive" size="sm" onClick={() => { abortRef.current?.abort(); setRunning(null); centerAll(); centerBody(); }}>
              <Square className="h-4 w-4" /> Stop
            </Button>
          ) : undefined
        }
      />

      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <Button
            key={tab.id}
            variant={filter === tab.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(tab.id)}
          >
            {tab.label}
            <Badge variant="default" className="ml-2">
              {tab.id === 'all'
                ? PRESET_META.length
                : PRESET_META.filter((p) => p.category === tab.id).length}
            </Badge>
          </Button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visiblePresets.map((preset) => (
          <div key={preset.id} className={cn('preset-tile', running === preset.id && 'active')}>
            <div className="flex items-start justify-between gap-2">
              <span className="text-3xl">{preset.icon}</span>
              <div className="flex flex-col items-end gap-1">
                {running === preset.id && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                {preset.category !== 'builtin' && (
                  <Badge variant="copper" className="text-[10px] uppercase tracking-wide">
                    MRL
                  </Badge>
                )}
              </div>
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