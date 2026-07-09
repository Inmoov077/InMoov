import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Bone,
  Cable,
  Footprints,
  LayoutGrid,
  RotateCcw,
  ScanFace,
  ScrollText,
} from 'lucide-react';
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

type ControlTab = 'all' | 'head' | 'neck' | 'body' | 'connect';

const TABS: { id: ControlTab; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'all', label: 'All', icon: LayoutGrid },
  { id: 'head', label: 'Head', icon: ScanFace },
  { id: 'neck', label: 'Neck', icon: Bone },
  { id: 'body', label: 'Body', icon: Footprints },
  { id: 'connect', label: 'USB', icon: Cable },
];

function parseTab(raw: string | null): ControlTab {
  if (raw === 'head' || raw === 'neck' || raw === 'body' || raw === 'connect' || raw === 'all') return raw;
  return 'all';
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
    if (next === 'all') p.delete('tab');
    else p.set('tab', next);
    setParams(p, { replace: true });
  };

  const setBodyTab = (part: BodyTab) => {
    const p = new URLSearchParams(params);
    p.set('tab', 'body');
    p.set('part', part);
    setParams(p, { replace: true });
  };

  const description = useMemo(() => {
    switch (tab) {
      case 'head':
        return 'Head pan, eyes, jaw, and speak — 3D stays on the left.';
      case 'neck':
        return 'Spin, nod, lean, and the neck pad — preview always visible.';
      case 'body':
        return 'Arms, hands, and legs — one panel, no duplicate pages.';
      case 'connect':
        return 'USB serial connection and command log.';
      default:
        return 'Every motor in one place. Preview stays put while you scroll controls.';
    }
  }, [tab]);

  return (
    <StudioShell
      title="Control"
      description={description}
      showGallery
      actions={
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              centerAll();
              centerBody();
            }}
          >
            <RotateCcw className="h-4 w-4" /> Reset all
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/presets">Moves</Link>
          </Button>
        </div>
      }
      tabs={
        <>
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(tab === item.id ? 'nav-pill-active' : 'nav-pill-idle')}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </>
      }
    >
      {(tab === 'all' || tab === 'head') && <HeadPanel />}
      {(tab === 'all' || tab === 'neck') && <NeckPanel />}
      {(tab === 'all' || tab === 'body') && (
        <BodyJointPanel tab={bodyTab} onTabChange={setBodyTab} compact={tab === 'all'} />
      )}
      {(tab === 'all' || tab === 'connect') && (
        <div className="space-y-4">
          <ConnectionPanel compact={tab === 'all'} />
          <SectionCard icon={ScrollText} title="Serial log" description="Commands sent to the board">
            <SerialConsole height="h-48" />
          </SectionCard>
        </div>
      )}
    </StudioShell>
  );
}
