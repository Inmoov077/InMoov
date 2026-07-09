import { Link, useSearchParams } from 'react-router-dom';
import { Bone, Cable, Footprints, RotateCcw, ScanFace, ScrollText } from 'lucide-react';
import { StudioShell } from '@/components/layout/StudioShell';
import { BodyJointPanel, type BodyTab } from '@/components/control/BodyJointPanel';
import { HeadPanel, NeckPanel } from '@/components/control/HeadNeckPanel';
import { ConnectionPanel } from '@/components/servo/ConnectionPanel';
import { SerialConsole } from '@/components/servo/SerialConsole';
import { SectionCard } from '@/components/ux/SectionCard';
import { Button } from '@/components/ui/button';
import { useServoStore } from '@/store/servoStore';
import { useBodyStore } from '@/store/bodyStore';
import { cn } from '@/lib/utils';

type ControlTab = 'head' | 'neck' | 'body' | 'connect';

const TABS: { id: ControlTab; label: string; icon: typeof ScanFace }[] = [
  { id: 'head', label: 'Head', icon: ScanFace },
  { id: 'neck', label: 'Neck', icon: Bone },
  { id: 'body', label: 'Body', icon: Footprints },
  { id: 'connect', label: 'USB', icon: Cable },
];

function parseTab(raw: string | null): ControlTab {
  if (raw === 'neck' || raw === 'body' || raw === 'connect' || raw === 'head') return raw;
  if (raw === 'all') return 'head';
  return 'head';
}

function parseBodyTab(raw: string | null): BodyTab {
  if (raw === 'arms' || raw === 'hands' || raw === 'legs') return raw;
  return 'arms';
}

export function AllServosPage() {
  const [params, setParams] = useSearchParams();
  const tab = parseTab(params.get('tab'));
  const bodyTab = parseBodyTab(params.get('part'));

  const centerAll = useServoStore((s) => s.centerAll);
  const centerBody = useBodyStore((s) => s.centerBody);

  const setTab = (next: ControlTab) => {
    const p = new URLSearchParams(params);
    if (next === 'head') p.delete('tab');
    else p.set('tab', next);
    if (next !== 'body') p.delete('part');
    setParams(p, { replace: true });
  };

  const setBodyTab = (part: BodyTab) => {
    const p = new URLSearchParams(params);
    p.set('tab', 'body');
    p.set('part', part);
    setParams(p, { replace: true });
  };

  return (
    <StudioShell
      title="Control"
      description="Live 3D · one section at a time"
      showGallery
      actions={
        <>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => {
              centerAll();
              centerBody();
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
          <Button variant="outline" size="sm" className="h-7 px-2 text-xs" asChild>
            <Link to="/presets">Moves</Link>
          </Button>
        </>
      }
      tabs={
        <>
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(tab === item.id ? 'nav-pill-active' : 'nav-pill-idle', 'px-2.5 py-1 text-xs')}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          ))}
        </>
      }
    >
      {tab === 'head' && <HeadPanel />}
      {tab === 'neck' && <NeckPanel />}
      {tab === 'body' && <BodyJointPanel tab={bodyTab} onTabChange={setBodyTab} />}
      {tab === 'connect' && (
        <div className="space-y-2">
          <ConnectionPanel compact />
          <SectionCard icon={ScrollText} title="Log" description="Serial traffic">
            <SerialConsole height="h-36" />
          </SectionCard>
        </div>
      )}
    </StudioShell>
  );
}
