import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Box, Map, RefreshCw, RotateCcw, Square, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { StudioShell } from '@/components/layout/StudioShell';
import { ServoTestPanel } from '@/components/control/ServoTestPanel';
import { MrlInMoovBodyMap } from '@/components/mrl/MrlInMoovBodyMap';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { InMoovPanel } from '@/lib/mrlInmoovConfig';
import * as mrl from '@/lib/mrlClient';
import { useBodyStore } from '@/store/bodyStore';
import { useMrlStore } from '@/store/mrlStore';
import { useServoStore } from '@/store/servoStore';
import { usePinStore } from '@/store/pinStore';
import { useLimitStore } from '@/store/limitStore';
import { cn } from '@/lib/utils';
import { connectMrlWebSocket, disconnectMrlWebSocket } from '@/lib/mrlWebSocket';

/**
 * Studio = Control only (pin + angle + limits).
 * Gestures → /moves · USB → /settings
 */
type PreviewMode = '3d' | 'map';

function mapPanelToGroup(panel: InMoovPanel): string {
  if (panel === 'head' || panel === 'mouth' || panel === 'ear' || panel === 'brain') return 'head';
  if (panel === 'hand') return 'hands';
  if (panel === 'leg') return 'legs';
  if (panel === 'arm' || panel === 'torso') return 'arms';
  return 'arms';
}

export function AllServosPage() {
  const [params, setParams] = useSearchParams();
  const view = (params.get('view') as PreviewMode) || '3d';
  const groupParam = params.get('group') || 'arms';

  const [mapPanel, setMapPanel] = useState<InMoovPanel>('InMoov');
  const [peersStarted, setPeersStarted] = useState<Record<string, boolean>>({});
  const [controlGroup, setControlGroup] = useState(groupParam);

  const connected = useServoStore((s) => s.connected);
  const reconnecting = useServoStore((s) => s.reconnecting);
  const centerAll = useServoStore((s) => s.centerAll);
  const centerBody = useBodyStore((s) => s.centerBody);
  const status = useMrlStore((s) => s.status);
  const loading = useMrlStore((s) => s.loading);
  const refresh = useMrlStore((s) => s.refresh);
  const startPolling = useMrlStore((s) => s.startPolling);
  const stopPolling = useMrlStore((s) => s.stopPolling);

  useEffect(() => {
    // Defer non-critical work so Studio chrome + control panel paint first
    const t = window.setTimeout(() => {
      startPolling(30000);
      connectMrlWebSocket();
      void usePinStore.getState().hydrate();
      void useLimitStore.getState().hydrate();
    }, 200);
    return () => {
      window.clearTimeout(t);
      stopPolling();
      disconnectMrlWebSocket();
    };
  }, [startPolling, stopPolling]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      void (async () => {
        try {
          const res = await mrl.getMrlPeers();
          const map: Record<string, boolean> = {};
          for (const p of res.peers ?? []) map[p.name] = !!p.started;
          setPeersStarted(map);
        } catch {
          /* optional */
        }
      })();
    }, 800);
    return () => window.clearTimeout(t);
  }, []);

  const patch = (next: Record<string, string | null>) => {
    const p = new URLSearchParams(params);
    // Drop legacy multi-tab params
    for (const k of ['mode', 'tab', 'core', 'pose', 'part', 'panel']) p.delete(k);
    for (const [k, v] of Object.entries(next)) {
      if (!v) p.delete(k);
      else p.set(k, v);
    }
    setParams(p, { replace: true });
  };

  const setView = (v: PreviewMode) => {
    patch({ view: v === '3d' ? null : v, group: controlGroup });
  };

  const restAll = async () => {
    centerAll();
    centerBody();
    try {
      await mrl.mrlRestAll();
      toast.success('Rest');
    } catch {
      toast.success('Rest');
    }
  };

  const stopAll = async () => {
    try {
      await mrl.mrlStopAll();
      toast.success('Stop');
    } catch {
      toast.message('Stop');
    }
  };

  const onMapSelect = (panel: InMoovPanel) => {
    setMapPanel(panel);
    if (panel === 'gestures') {
      window.location.href = '/moves';
      return;
    }
    const g = mapPanelToGroup(panel);
    setControlGroup(g);
    patch({ view: 'map', group: g });
  };

  return (
    <StudioShell
      title="Studio"
      description="Select a joint, set its pin and safe range, then move it. Drag the preview edge to resize."
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
            className="hidden sm:flex text-[10px]"
          >
            {connected ? 'USB on' : reconnecting ? 'USB…' : 'USB off'}
          </Badge>
          <Button size="sm" variant="outline" className="h-8 px-2.5 text-xs" onClick={() => void restAll()}>
            <RotateCcw className="h-3.5 w-3.5" /> Rest
          </Button>
          <Button size="sm" variant="outline" className="h-8 px-2.5 text-xs" onClick={() => void stopAll()}>
            <Square className="h-3.5 w-3.5" /> Stop
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2 text-xs"
            onClick={() => void refresh()}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          </Button>
          <Button size="sm" variant="ghost" className="h-8 px-2 text-xs" asChild>
            <Link to="/moves">Moves</Link>
          </Button>
          <Button size="sm" variant="ghost" className="h-8 px-2 text-xs" asChild>
            <Link to="/settings">Settings</Link>
          </Button>
        </>
      }
    >
      <ServoTestPanel key={controlGroup} initialGroup={controlGroup} />
    </StudioShell>
  );
}
