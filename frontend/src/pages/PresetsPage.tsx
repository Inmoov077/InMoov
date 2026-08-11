import { Suspense, lazy, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PRESETS, PRESET_META } from '@/lib/presets';
import { animateKeyframes } from '@/lib/animateKeyframes';
import { useBodyStore } from '@/store/bodyStore';
import { useServoStore } from '@/store/servoStore';
import { cn } from '@/lib/utils';

const RobotViewer = lazy(() =>
  import('@/components/robot/RobotViewer').then((m) => ({ default: m.RobotViewer })),
);

/**
 * Moves — only ~15 clear actions (hand up/down, wave, shake, baby hand…).
 * No 150+ dump list.
 */
export function PresetsPage() {
  const [running, setRunning] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const centerAll = useServoStore((s) => s.centerAll);
  const centerBody = useBodyStore((s) => s.centerBody);
  const connected = useServoStore((s) => s.connected);

  const playPreset = async (id: string) => {
    const keyframes = PRESETS[id];
    if (!keyframes) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setRunning(id);
    try {
      await animateKeyframes(keyframes, { signal: controller.signal, transitionMs: 320 });
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

  const playingName = PRESET_META.find((p) => p.id === running)?.name;

  return (
    <div className="moves-page">
      {/* ── Left: 3D ── */}
      <aside className="moves-page-preview">
        <div className="moves-page-3d">
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                Loading 3D…
              </div>
            }
          >
            <RobotViewer className="h-full w-full" showGallery={false} variant="moves" />
          </Suspense>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 text-sm">
          <div className="min-w-0">
            <p className="font-medium text-foreground">
              {running ? playingName : '3D robot'}
            </p>
            <p className="text-xs text-muted-foreground">
              {running
                ? 'Playing…'
                : connected
                  ? 'USB on · tap a move'
                  : 'Preview only · connect USB for motors'}
            </p>
          </div>
          {running ? (
            <Button variant="destructive" size="sm" className="h-8 shrink-0" onClick={stop}>
              <Square className="h-3.5 w-3.5" /> Stop
            </Button>
          ) : (
            <span
              className={cn(
                'shrink-0 text-xs font-medium',
                connected ? 'text-emerald-600' : 'text-muted-foreground',
              )}
            >
              {connected ? 'Live' : 'Offline'}
            </span>
          )}
        </div>
      </aside>

      {/* ── Right: curated list ── */}
      <div className="moves-page-list min-w-0">
        <div className="mb-5 border-b border-border/40 pb-4">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Moves</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {PRESET_META.length} clear actions · more can be added later ·{' '}
            <Link to="/control" className="underline-offset-2 hover:underline">
              Studio
            </Link>
          </p>
        </div>

        <ul className="grid gap-2 sm:grid-cols-1">
          {PRESET_META.map((preset, i) => {
            const active = running === preset.id;
            return (
              <li key={preset.id}>
                <button
                  type="button"
                  disabled={!!running && !active}
                  onClick={() => void playPreset(preset.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors',
                    active
                      ? 'border-primary/40 bg-primary/10 shadow-sm'
                      : 'border-border/50 bg-card hover:border-primary/30 hover:bg-muted/40',
                    running && !active && 'opacity-40',
                  )}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted font-mono text-sm font-semibold tabular-nums text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        'block text-base leading-snug',
                        active ? 'font-semibold text-primary' : 'font-semibold text-foreground',
                      )}
                    >
                      {preset.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {preset.desc}
                    </span>
                  </span>
                  <span className="shrink-0 text-muted-foreground">
                    {active ? (
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    ) : (
                      <Play className="h-4 w-4 opacity-60" />
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
