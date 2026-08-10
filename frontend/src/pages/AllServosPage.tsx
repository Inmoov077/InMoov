import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Bone,
  Box,
  Cable,
  Crosshair,
  Footprints,
  Map,
  Pin,
  RefreshCw,
  RotateCcw,
  ScanFace,
  ScrollText,
  Sparkles,
  Square,
} from 'lucide-react';
import { toast } from 'sonner';
import { StudioShell } from '@/components/layout/StudioShell';
import { BodyJointPanel, type BodyTab } from '@/components/control/BodyJointPanel';
import { HeadPanel, NeckPanel } from '@/components/control/HeadNeckPanel';
import { PinMapPanel } from '@/components/control/PinMapPanel';
import { ServoTestPanel } from '@/components/control/ServoTestPanel';
import { ConnectionPanel } from '@/components/servo/ConnectionPanel';
import { SerialConsole } from '@/components/servo/SerialConsole';
import { SectionCard } from '@/components/ux/SectionCard';
import { MrlInMoovBodyMap } from '@/components/mrl/MrlInMoovBodyMap';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import type { InMoovPanel } from '@/lib/mrlInmoovConfig';
import * as mrl from '@/lib/mrlClient';
import { useBodyStore } from '@/store/bodyStore';
import { useMrlStore } from '@/store/mrlStore';
import { useServoStore } from '@/store/servoStore';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { connectMrlWebSocket, disconnectMrlWebSocket } from '@/lib/mrlWebSocket';
import { Play, Search, Loader2 } from 'lucide-react';

/**
 * Clean InMoov Control Deck — focused UX, no tab soup.
 * Control · Pins · Test · Gestures · USB
 */
type Tab = 'control' | 'pins' | 'test' | 'gestures' | 'usb';
type PosePart = 'head' | 'neck' | 'body';
type PreviewMode = '3d' | 'map';

const TABS: { id: Tab; label: string; icon: typeof ScanFace; hint: string }[] = [
  { id: 'control', label: 'Control', icon: ScanFace, hint: 'Move the robot' },
  { id: 'pins', label: 'Pins', icon: Pin, hint: 'Wire map' },
  { id: 'test', label: 'Test 1:1', icon: Crosshair, hint: 'Single servo' },
  { id: 'gestures', label: 'Gestures', icon: Sparkles, hint: 'Moves' },
  { id: 'usb', label: 'USB', icon: Cable, hint: 'Serial' },
];

const POSE: { id: PosePart; label: string; icon: typeof ScanFace }[] = [
  { id: 'head', label: 'Head', icon: ScanFace },
  { id: 'neck', label: 'Neck', icon: Bone },
  { id: 'body', label: 'Body', icon: Footprints },
];

const QUICK = ['Yes', 'No', 'relax', 'hello', 'presentation', 'shakehand', 'victory'];

function parseTab(v: string | null): Tab {
  if (v === 'pins' || v === 'test' || v === 'gestures' || v === 'usb' || v === 'control') return v;
  // legacy
  if (v === 'pose' || v === 'inmoov' || v === 'head' || v === 'neck' || v === 'body') return 'control';
  if (v === 'servos') return 'test';
  if (v === 'connect') return 'usb';
  return 'control';
}

export function AllServosPage() {
  const [params, setParams] = useSearchParams();
  const tab = parseTab(params.get('panel') ?? params.get('tab') ?? params.get('mode'));
  const pose = (params.get('pose') as PosePart) || 'head';
  const bodyPart = (params.get('part') as BodyTab) || 'arms';
  const view = (params.get('view') as PreviewMode) || '3d';

  const [mapPanel, setMapPanel] = useState<InMoovPanel>('InMoov');
  const [gestureFilter, setGestureFilter] = useState('');
  const [running, setRunning] = useState<string | null>(null);
  const [peersStarted, setPeersStarted] = useState<Record<string, boolean>>({});

  const connected = useServoStore((s) => s.connected);
  const reconnecting = useServoStore((s) => s.reconnecting);
  const centerAll = useServoStore((s) => s.centerAll);
  const centerBody = useBodyStore((s) => s.centerBody);
  const gestures = useMrlStore((s) => s.gestures);
  const loading = useMrlStore((s) => s.loading);
  const refresh = useMrlStore((s) => s.refresh);
  const startPolling = useMrlStore((s) => s.startPolling);
  const stopPolling = useMrlStore((s) => s.stopPolling);
  const execGesture = useMrlStore((s) => s.execGesture);
  const status = useMrlStore((s) => s.status);

  useEffect(() => {
    startPolling(12000);
    connectMrlWebSocket();
    return () => {
      stopPolling();
      disconnectMrlWebSocket();
    };
  }, [startPolling, stopPolling]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await mrl.getMrlPeers();
        const map: Record<string, boolean> = {};
        for (const p of res.peers ?? []) map[p.name] = !!p.started;
        setPeersStarted(map);
      } catch {
        /* optional */
      }
    };
    void load();
  }, [tab]);

  const patch = (next: Record<string, string | null>) => {
    const p = new URLSearchParams(params);
    p.delete('mode');
    p.delete('tab');
    p.delete('core');
    for (const [k, v] of Object.entries(next)) {
      if (!v) p.delete(k);
      else p.set(k, v);
    }
    setParams(p, { replace: true });
  };

  const setTab = (t: Tab) => {
    patch({
      panel: t === 'control' ? null : t,
      view: t === 'control' ? view : null,
      pose: t === 'control' && pose !== 'head' ? pose : null,
      part: t === 'control' && pose === 'body' ? bodyPart : null,
    });
  };

  const setPose = (p: PosePart) => {
    patch({
      panel: null,
      pose: p === 'head' ? null : p,
      part: p === 'body' ? bodyPart : null,
      view,
    });
  };

  const setBodyPart = (part: BodyTab) => {
    patch({ panel: null, pose: 'body', part, view });
  };

  const setView = (v: PreviewMode) => {
    patch({ view: v === '3d' ? null : v });
  };

  const filteredGestures = useMemo(() => {
    const q = gestureFilter.trim().toLowerCase();
    if (!q) return gestures;
    return gestures.filter(
      (g) => g.name.toLowerCase().includes(q) || g.mrlName.toLowerCase().includes(q),
    );
  }, [gestures, gestureFilter]);

  const restAll = async () => {
    centerAll();
    centerBody();
    try {
      await mrl.mrlRestAll();
      toast.success('Rest');
    } catch {
      toast.success('Rest (local)');
    }
  };

  const stopAll = async () => {
    try {
      await mrl.mrlStopAll();
      toast.success('Stop');
    } catch {
      toast.message('Stop requested');
    }
  };

  const runGesture = async (name: string) => {
    setRunning(name);
    const ok = await execGesture(name);
    if (ok) toast.success(name);
    else toast.error(`Failed: ${name}`);
    setRunning(null);
  };

  /** Map part click → open matching control section (single URL patch) */
  const onMapSelect = (panel: InMoovPanel) => {
    setMapPanel(panel);
    if (panel === 'gestures') {
      setTab('gestures');
      return;
    }
    if (panel === 'head' || panel === 'mouth' || panel === 'brain' || panel === 'ear') {
      patch({ panel: null, pose: null, part: null, view: 'map' });
      return;
    }
    if (panel === 'arm' || panel === 'hand' || panel === 'leg' || panel === 'torso') {
      const part = panel === 'hand' ? 'hands' : panel === 'leg' ? 'legs' : 'arms';
      patch({ panel: null, pose: 'body', part, view: 'map' });
      return;
    }
    setTab('control');
  };

  const poseOk = pose === 'head' || pose === 'neck' || pose === 'body' ? pose : 'head';

  return (
    <StudioShell
      title="Control Deck"
      description="Move · pins · 1:1 test · gestures · USB"
      showGallery={view === '3d'}
      preview={
        view === 'map' ? (
          <div className="studio-preview-inner studio-preview-mrl h-full">
            <MrlInMoovBodyMap
              activePanel={mapPanel}
              onSelect={onMapSelect}
              i01State={status?.i01State}
              peersStarted={peersStarted}
            />
          </div>
        ) : undefined
      }
      actions={
        <>
          <div className="studio-preview-toggle" role="group" aria-label="Preview">
            <button
              type="button"
              className={cn('studio-toggle-btn', view === '3d' && 'is-active')}
              onClick={() => setView('3d')}
            >
              <Box className="h-3.5 w-3.5" /> 3D
            </button>
            <button
              type="button"
              className={cn('studio-toggle-btn', view === 'map' && 'is-active')}
              onClick={() => setView('map')}
            >
              <Map className="h-3.5 w-3.5" /> Map
            </button>
          </div>
          <Badge
            variant={connected ? 'online' : reconnecting ? 'default' : 'offline'}
            className="hidden sm:flex"
          >
            {connected ? 'USB on' : reconnecting ? 'USB…' : 'USB off'}
          </Badge>
          <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => void restAll()}>
            <RotateCcw className="h-3.5 w-3.5" /> Rest
          </Button>
          <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => void stopAll()}>
            <Square className="h-3.5 w-3.5" /> Stop
          </Button>
          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => void refresh()} disabled={loading}>
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          </Button>
        </>
      }
      tabs={
        <>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              title={t.hint}
              onClick={() => setTab(t.id)}
              className={cn(tab === t.id ? 'nav-pill-active' : 'nav-pill-idle', 'px-2.5 py-1 text-xs')}
            >
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          ))}
        </>
      }
    >
      {tab === 'control' && (
        <div className="space-y-2">
          <div className="studio-subtabs">
            {POSE.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPose(p.id)}
                className={cn(
                  poseOk === p.id ? 'nav-pill-active' : 'nav-pill-idle',
                  'px-2.5 py-1 text-xs',
                )}
              >
                <p.icon className="h-3.5 w-3.5" />
                {p.label}
              </button>
            ))}
          </div>
          <p className="px-1 text-[11px] text-muted-foreground">
            Drag sliders for live motion. Limits + anti-overlap + arm inversion apply automatically.
          </p>
          {poseOk === 'head' && <HeadPanel />}
          {poseOk === 'neck' && <NeckPanel />}
          {poseOk === 'body' && <BodyJointPanel tab={bodyPart} onTabChange={setBodyPart} />}
        </div>
      )}

      {tab === 'pins' && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Map every motor to a Mega pin. Save to disk + firmware when USB is on.
          </p>
          <PinMapPanel />
        </div>
      )}

      {tab === 'test' && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            One servo at a time: pick joint → set pin → drag or Min / Rest / Max.
          </p>
          <ServoTestPanel />
        </div>
      )}

      {tab === 'gestures' && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {QUICK.map((g) => (
              <Button
                key={g}
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                disabled={!!running}
                onClick={() => void runGesture(g)}
              >
                <Play className="mr-1 h-3 w-3" />
                {g}
              </Button>
            ))}
          </div>
          <div className="relative max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder={`Search ${gestures.length} gestures…`}
              value={gestureFilter}
              onChange={(e) => setGestureFilter(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {filteredGestures.map((g) => (
              <Button
                key={g.id}
                variant="outline"
                className="h-auto justify-start px-2.5 py-1.5"
                disabled={!!running}
                onClick={() => void runGesture(g.mrlName)}
              >
                <span className="mr-2">{g.icon || '◉'}</span>
                <span className="min-w-0 text-left">
                  <span className="block truncate text-xs font-medium">{g.name}</span>
                  <span className="block truncate font-mono text-[10px] text-muted-foreground">
                    {g.mrlName}
                  </span>
                </span>
              </Button>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Full offline catalog:{' '}
            <Link to="/presets" className="text-primary underline">
              Moves
            </Link>
          </p>
        </div>
      )}

      {tab === 'usb' && (
        <div className="space-y-2">
          <ConnectionPanel compact />
          <SectionCard icon={ScrollText} title="Serial log" description="Arduino traffic">
            <SerialConsole height="h-40" />
          </SectionCard>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link to="/settings">Full settings →</Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link to="/calibration">Calibration lab →</Link>
            </Button>
          </div>
        </div>
      )}
    </StudioShell>
  );
}
