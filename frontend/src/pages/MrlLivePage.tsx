import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  Camera,
  Layers,
  Loader2,
  Play,
  RefreshCw,
  Search,
  Server,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/PageHeader';
import { MrlInMoovBodyMap } from '@/components/mrl/MrlInMoovBodyMap';
import { MrlInMoovSidePanel } from '@/components/mrl/MrlInMoovSidePanel';
import { MrlOpenCvPanel } from '@/components/mrl/MrlOpenCvPanel';
import { MrlPythonConsole } from '@/components/mrl/MrlPythonConsole';
import { MrlRuntimePanel } from '@/components/mrl/MrlRuntimePanel';
import { MrlServoPanel } from '@/components/mrl/MrlServoPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { InMoovPanel } from '@/lib/mrlInmoovConfig';
import { connectMrlWebSocket, disconnectMrlWebSocket } from '@/lib/mrlWebSocket';
import { useMrlStore } from '@/store/mrlStore';

type Tab = 'inmoov' | 'servos' | 'gestures' | 'opencv' | 'runtime' | 'python';

const TABS: { id: Tab; label: string; icon: typeof Bot }[] = [
  { id: 'inmoov', label: 'InMoov2', icon: Layers },
  { id: 'servos', label: 'All servos', icon: Zap },
  { id: 'gestures', label: 'Gestures', icon: Sparkles },
  { id: 'opencv', label: 'OpenCV', icon: Camera },
  { id: 'runtime', label: 'Runtime', icon: Server },
  { id: 'python', label: 'Python', icon: Terminal },
];

const QUICK_GESTURES = ['Yes', 'No', 'relax', 'presentation', 'raiserightarm', 'shakehand', 'victory', 'hello'];

export function MrlLivePage() {
  const [tab, setTab] = useState<Tab>('inmoov');
  const [inmoovPanel, setInmoovPanel] = useState<InMoovPanel>('InMoov');
  const [gestureFilter, setGestureFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [runningGesture, setRunningGesture] = useState<string | null>(null);

  const status = useMrlStore((s) => s.status);
  const services = useMrlStore((s) => s.services);
  const i01Servos = useMrlStore((s) => s.i01Servos);
  const gestures = useMrlStore((s) => s.gestures);
  const loading = useMrlStore((s) => s.loading);
  const refresh = useMrlStore((s) => s.refresh);
  const startPolling = useMrlStore((s) => s.startPolling);
  const stopPolling = useMrlStore((s) => s.stopPolling);
  const execGesture = useMrlStore((s) => s.execGesture);

  useEffect(() => {
    startPolling(10000);
    connectMrlWebSocket();
    return () => {
      stopPolling();
      disconnectMrlWebSocket();
    };
  }, [startPolling, stopPolling]);

  const online = status?.online ?? false;

  const filteredGestures = useMemo(() => {
    const q = gestureFilter.trim().toLowerCase();
    if (!q) return gestures;
    return gestures.filter((g) => g.name.toLowerCase().includes(q) || g.mrlName.toLowerCase().includes(q));
  }, [gestures, gestureFilter]);

  const filteredServos = useMemo(() => {
    const q = serviceFilter.trim().toLowerCase();
    if (!q) return i01Servos;
    return i01Servos.filter((s) => s.service.toLowerCase().includes(q) || s.label.toLowerCase().includes(q));
  }, [i01Servos, serviceFilter]);

  const runGesture = async (name: string) => {
    if (!online) {
      toast.error('Start MyRobotLab on port 8888');
      return;
    }
    setRunningGesture(name);
    const ok = await execGesture(name);
    if (ok) toast.success(`i01.${name}()`);
    else toast.error(`Failed: ${name}`);
    setRunningGesture(null);
  };

  const onBodySelect = (panel: InMoovPanel) => {
    if (panel === 'runtime') setTab('runtime');
    else if (panel === 'gestures') setTab('gestures');
    else setInmoovPanel(panel);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="MyRobotLab — full native UI"
        description="Complete clone of localhost:8888 InMoov2 dashboard — real assets, body map, servos, gestures, OpenCV, runtime. No iframe."
        actions={
          <div className="flex flex-wrap gap-2">
            <Badge variant={online ? 'online' : 'offline'} className="px-3 py-1">
              {online ? `MRL ${status?.version} · ${status?.serviceCount} services · ${status?.i01State}` : 'MRL offline'}
            </Badge>
            <Button variant="outline" size="sm" onClick={() => void refresh()} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </div>
        }
      />

      {!online && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="py-4 text-sm">
            Start <strong>myrobotlab-1.1.1610</strong> with InMoov2 loaded on port 8888. This UI talks to it via REST + WebSocket.
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Button key={t.id} variant={tab === t.id ? 'default' : 'outline'} size="sm" onClick={() => setTab(t.id)}>
            <t.icon className="mr-1.5 h-4 w-4" />{t.label}
          </Button>
        ))}
      </div>

      {tab === 'inmoov' && (
        <div className="grid gap-6 xl:grid-cols-[minmax(280px,620px)_1fr]">
          <MrlInMoovBodyMap activePanel={inmoovPanel} onSelect={onBodySelect} i01State={status?.i01State} />
          <MrlInMoovSidePanel
            panel={inmoovPanel}
            onOpenGestures={() => setTab('gestures')}
            onOpenRuntime={() => setTab('runtime')}
          />
        </div>
      )}

      {tab === 'servos' && (
        <div className="space-y-4">
          <Input placeholder="Filter servos…" value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="max-w-sm" />
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredServos.map((s) => (
              <MrlServoPanel key={s.service} service={s.service} label={s.label} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{services.length} MRL services · {filteredServos.length} i01 servo panels</p>
        </div>
      )}

      {tab === 'gestures' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {QUICK_GESTURES.map((g) => (
              <Button key={g} size="sm" variant="outline" disabled={!!runningGesture} onClick={() => void runGesture(g)}>
                <Play className="mr-1 h-3 w-3" />{g}
              </Button>
            ))}
          </div>
          <div className="relative max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder={`Search ${gestures.length} gestures…`} value={gestureFilter} onChange={(e) => setGestureFilter(e.target.value)} className="pl-9" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredGestures.map((g) => (
              <Button key={g.id} variant="outline" className="h-auto justify-start px-3 py-2" disabled={!!runningGesture} onClick={() => void runGesture(g.mrlName)}>
                <span className="mr-2">{g.icon || '◉'}</span>
                <span className="min-w-0 text-left">
                  <span className="block truncate text-sm font-medium">{g.name}</span>
                  <span className="block truncate font-mono text-[10px] text-muted-foreground">{g.mrlName}</span>
                </span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {tab === 'opencv' && <MrlOpenCvPanel />}

      {tab === 'runtime' && <MrlRuntimePanel />}

      {tab === 'python' && <MrlPythonConsole />}

      <p className="text-center text-xs text-muted-foreground">
        Offline presets still work without MRL — <Link to="/mrl" className="text-primary underline">MRL Hub</Link> · <Link to="/presets" className="text-primary underline">Moves</Link>
      </p>
    </div>
  );
}