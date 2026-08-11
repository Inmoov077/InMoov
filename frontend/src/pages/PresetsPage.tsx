import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PRESETS, PRESET_META } from '@/lib/presets';
import { animateKeyframes } from '@/lib/animateKeyframes';
import { applyNeutralPose } from '@/lib/applyNeutralPose';
import { useServoStore } from '@/store/servoStore';
import { isLiveRobotReady } from '@/lib/robotLiveController';
import { cn } from '@/lib/utils';

const RobotViewer = lazy(() =>
  import('@/components/robot/RobotViewer').then((m) => ({ default: m.RobotViewer })),
);

/** Moves that focus the camera on hands / upper body */
const HAND_FOCUS = new Set([
  'hand-up',
  'hand-down',
  'wave-arm',
  'wave-high',
  'shake-hand',
  'baby-hand',
  'open-hand',
  'fist',
  'point',
  'clap',
]);
/** Head + right arm close-up (salute to temple) */
const HEAD_FOCUS = new Set(['salute', 'nod', 'shake']);

/**
 * Moves — curated actions with live 3D preview.
 * 3D is force-driven every keyframe step (does not depend on store subscribers).
 */
export function PresetsPage() {
  const [running, setRunning] = useState<string | null>(null);
  const [previewNote, setPreviewNote] = useState<string>('');
  const abortRef = useRef<AbortController | null>(null);
  const viewerRef = useRef<{ setView: (id: string) => void } | null>(null);
  const connected = useServoStore((s) => s.connected);

  // Perfect default hands/arms every time Moves opens
  useEffect(() => {
    applyNeutralPose({ send: false });
  }, []);

  const waitFor3d = async (ms = 10000): Promise<boolean> => {
    const start = Date.now();
    while (!isLiveRobotReady() && Date.now() - start < ms) {
      await new Promise((r) => setTimeout(r, 80));
    }
    return isLiveRobotReady();
  };

  const playPreset = async (id: string) => {
    const keyframes = PRESETS[id];
    if (!keyframes?.length) {
      setPreviewNote('Move data missing');
      return;
    }

    // Stop any previous move cleanly
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setRunning(id);
    setPreviewNote('Waiting for 3D…');

    try {
      const ready = await waitFor3d(10000);
      if (controller.signal.aborted) return;

      if (!ready) {
        setPreviewNote('3D not ready — reload page if model failed');
        // Still run so stores update; user may see motion after load
      } else {
        setPreviewNote(connected ? 'Playing 3D + motors' : 'Playing 3D preview');
      }

      try {
        // Salute / arm moves: full body so you see the whole path (MRL-style)
        if (id === 'nod' || id === 'shake') viewerRef.current?.setView('head');
        else if (HAND_FOCUS.has(id) || id === 'salute') viewerRef.current?.setView('full');
        else if (HEAD_FOCUS.has(id)) viewerRef.current?.setView('head');
        else viewerRef.current?.setView('full');
      } catch {
        /* camera optional */
      }

      // Salute needs longer blends so elbow/hand path reads clearly
      const transitionMs =
        id === 'salute' ? 520 : id === 'wake-up' ? 420 : id === 'nod' || id === 'shake' ? 320 : 450;

      await animateKeyframes(keyframes, {
        signal: controller.signal,
        transitionMs,
        // Always update 3D; motors only if USB connected (checked inside)
        send: true,
      });

      if (!controller.signal.aborted) {
        // Always return to perfect default hands/arms after a move
        applyNeutralPose({ send: false });
        setPreviewNote(ready ? 'Done · default pose' : 'Done (3D was offline)');
      }
    } catch (err) {
      console.error('[Moves] play failed', err);
      setPreviewNote('Playback error — see console');
      applyNeutralPose({ send: false });
    } finally {
      if (!controller.signal.aborted) {
        try {
          viewerRef.current?.setView('full');
        } catch {
          /* ignore */
        }
      }
      setRunning(null);
      window.setTimeout(() => setPreviewNote(''), 2500);
    }
  };

  const stop = () => {
    abortRef.current?.abort();
    setRunning(null);
    setPreviewNote('Stopped · default pose');
    applyNeutralPose({ send: false });
    try {
      viewerRef.current?.setView('full');
    } catch {
      /* ignore */
    }
    window.setTimeout(() => setPreviewNote(''), 1500);
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
                Loading 3D model…
              </div>
            }
          >
            <RobotViewer
              ref={(r) => {
                viewerRef.current = r;
              }}
              className="h-full w-full"
              showGallery={false}
              variant="moves"
            />
          </Suspense>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 text-sm">
          <div className="min-w-0">
            <p className="font-medium text-foreground">
              {running ? playingName : '3D robot'}
            </p>
            <p className="text-xs text-muted-foreground">
              {previewNote ||
                (running
                  ? 'Playing…'
                  : connected
                    ? 'USB on · tap a move'
                    : 'Preview only · connect USB for motors')}
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
            {PRESET_META.length} actions · 3D updates every frame ·{' '}
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
