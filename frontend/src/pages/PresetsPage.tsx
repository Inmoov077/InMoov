import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Play, Search, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  { id: 'full', label: 'Full' },
  { id: 'social', label: 'Social' },
];

export function PresetsPage() {
  const [running, setRunning] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [q, setQ] = useState('');
  const abortRef = useRef<AbortController | null>(null);
  const centerAll = useServoStore((s) => s.centerAll);
  const centerBody = useBodyStore((s) => s.centerBody);

  const visiblePresets = useMemo(() => {
    let list = filter === 'all' ? PRESET_META : PRESET_META.filter((p) => p.category === filter);
    const query = q.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.desc.toLowerCase().includes(query) ||
          p.id.toLowerCase().includes(query),
      );
    }
    return list;
  }, [filter, q]);

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

  const stop = () => {
    abortRef.current?.abort();
    setRunning(null);
    centerAll();
    centerBody();
  };

  return (
    <div className="space-y-4 animate-fadeUp">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">Moves</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {PRESET_META.length} gestures · tap to play ·{' '}
            <Link to="/control" className="text-primary underline-offset-2 hover:underline">
              Control
            </Link>
          </p>
        </div>
        {running && (
          <Button variant="destructive" size="sm" className="h-8" onClick={stop}>
            <Square className="h-3.5 w-3.5" /> Stop
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search moves…"
            className="h-9 pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {FILTER_TABS.map((tab) => {
            const count =
              tab.id === 'all'
                ? PRESET_META.length
                : PRESET_META.filter((p) => p.category === tab.id).length;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={cn(
                  filter === tab.id ? 'nav-pill-active' : 'nav-pill-idle',
                  'px-2.5 py-1 text-xs',
                )}
              >
                {tab.label}
                <span className="ml-1 opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {visiblePresets.map((preset) => {
          const active = running === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              disabled={!!running && !active}
              onClick={() => void playPreset(preset.id)}
              className={cn(
                'preset-chip group text-left',
                active && 'preset-chip-active',
                running && !active && 'opacity-50',
              )}
              title={preset.desc}
            >
              <div className="flex items-start justify-between gap-1">
                <span className="text-lg leading-none">{preset.icon}</span>
                {active ? (
                  <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-primary" />
                ) : (
                  <Play className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                )}
              </div>
              <p className="mt-1.5 line-clamp-2 text-xs font-semibold leading-snug">{preset.name}</p>
              <div className="mt-1 flex items-center gap-1">
                {preset.category !== 'builtin' && (
                  <Badge variant="copper" className="h-4 px-1 text-[9px]">
                    MRL
                  </Badge>
                )}
                <span className="truncate text-[10px] text-muted-foreground">{preset.category}</span>
              </div>
            </button>
          );
        })}
      </div>

      {visiblePresets.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">No moves match your search.</p>
      )}
    </div>
  );
}
