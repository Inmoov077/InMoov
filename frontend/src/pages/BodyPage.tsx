import { useState } from 'react';
import { Footprints, Hand, RotateCcw, Workflow } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { RobotViewer } from '@/components/robot/RobotViewer';
import { ServoControl } from '@/components/servo/ServoControl';
import { SectionCard } from '@/components/ux/SectionCard';
import { HelpTip } from '@/components/ux/HelpTip';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  ARM_JOINT_META,
  ARM_PRESETS,
  HAND_JOINT_META,
  HAND_PRESETS,
  LEG_JOINT_META,
  LEG_PRESETS,
  type BodySide,
} from '@/lib/bodyConfig';
import { useBodyStore } from '@/store/bodyStore';

type BodyTab = 'arms' | 'hands' | 'legs';

const TABS: { id: BodyTab; label: string; icon: typeof Workflow }[] = [
  { id: 'arms', label: 'Arms', icon: Workflow },
  { id: 'hands', label: 'Hands', icon: Hand },
  { id: 'legs', label: 'Legs', icon: Footprints },
];

function SideBadge({ side }: { side: BodySide }) {
  return (
    <Badge variant="default" className="mb-3 w-fit">
      {side === 'left' ? 'Left side' : 'Right side'}
    </Badge>
  );
}

export function BodyPage() {
  const [tab, setTab] = useState<BodyTab>('arms');
  const leftArm = useBodyStore((s) => s.leftArm);
  const rightArm = useBodyStore((s) => s.rightArm);
  const leftHand = useBodyStore((s) => s.leftHand);
  const rightHand = useBodyStore((s) => s.rightHand);
  const leftLeg = useBodyStore((s) => s.leftLeg);
  const rightLeg = useBodyStore((s) => s.rightLeg);
  const setArmJoint = useBodyStore((s) => s.setArmJoint);
  const setHandJoint = useBodyStore((s) => s.setHandJoint);
  const setLegJoint = useBodyStore((s) => s.setLegJoint);
  const setArm = useBodyStore((s) => s.setArm);
  const setHand = useBodyStore((s) => s.setHand);
  const setLeg = useBodyStore((s) => s.setLeg);
  const centerBody = useBodyStore((s) => s.centerBody);

  const renderArms = () => (
    <div className="grid gap-5 lg:grid-cols-2">
      {(['left', 'right'] as BodySide[]).map((side) => {
        const arm = side === 'left' ? leftArm : rightArm;
        return (
          <SectionCard
            key={side}
            icon={Workflow}
            title={`${side === 'left' ? 'Left' : 'Right'} arm`}
            description="Shoulder through wrist"
          >
            <SideBadge side={side} />
            <div className="mb-4 flex flex-wrap gap-2">
              {Object.entries(ARM_PRESETS).map(([name, preset]) => (
                <Button key={name} variant="outline" size="sm" onClick={() => setArm(side, preset)}>
                  {name}
                </Button>
              ))}
            </div>
            <div className="space-y-4">
              {ARM_JOINT_META.map((joint) => (
                <ServoControl
                  key={`${side}-${joint.key}`}
                  label={joint.label}
                  hint={joint.hint}
                  pin={joint.pin[side]}
                  value={arm[joint.key]}
                  min={joint.min}
                  max={joint.max}
                  onChange={(v) => setArmJoint(side, joint.key, v)}
                  accent={side === 'left' ? 'signal' : 'copper'}
                />
              ))}
            </div>
          </SectionCard>
        );
      })}
    </div>
  );

  const renderHands = () => (
    <div className="grid gap-5 lg:grid-cols-2">
      {(['left', 'right'] as BodySide[]).map((side) => {
        const hand = side === 'left' ? leftHand : rightHand;
        return (
          <SectionCard
            key={side}
            icon={Hand}
            title={`${side === 'left' ? 'Left' : 'Right'} hand`}
            description="Individual finger control"
          >
            <SideBadge side={side} />
            <div className="mb-4 flex flex-wrap gap-2">
              {Object.entries(HAND_PRESETS).map(([name, preset]) => (
                <Button key={name} variant="outline" size="sm" onClick={() => setHand(side, preset)}>
                  {name}
                </Button>
              ))}
            </div>
            <div className="space-y-4">
              {HAND_JOINT_META.map((joint) => (
                <ServoControl
                  key={`${side}-${joint.key}`}
                  label={joint.label}
                  hint={joint.hint}
                  pin={joint.pin[side]}
                  value={hand[joint.key]}
                  min={joint.min}
                  max={joint.max}
                  onChange={(v) => setHandJoint(side, joint.key, v)}
                  presets={[10, 90, 170]}
                  presetLabels={{ 10: 'Open', 90: 'Half', 170: 'Closed' }}
                  accent={side === 'left' ? 'phosphor' : 'violet'}
                />
              ))}
            </div>
          </SectionCard>
        );
      })}
    </div>
  );

  const renderLegs = () => (
    <div className="grid gap-5 lg:grid-cols-2">
      {(['left', 'right'] as BodySide[]).map((side) => {
        const leg = side === 'left' ? leftLeg : rightLeg;
        return (
          <SectionCard
            key={side}
            icon={Footprints}
            title={`${side === 'left' ? 'Left' : 'Right'} leg`}
            description="Hip through foot"
          >
            <SideBadge side={side} />
            <div className="mb-4 flex flex-wrap gap-2">
              {Object.entries(LEG_PRESETS).map(([name, preset]) => (
                <Button key={name} variant="outline" size="sm" onClick={() => setLeg(side, preset)}>
                  {name}
                </Button>
              ))}
            </div>
            <div className="space-y-4">
              {LEG_JOINT_META.map((joint) => (
                <ServoControl
                  key={`${side}-${joint.key}`}
                  label={joint.label}
                  hint={joint.hint}
                  pin={joint.pin[side]}
                  value={leg[joint.key]}
                  min={joint.min}
                  max={joint.max}
                  onChange={(v) => setLegJoint(side, joint.key, v)}
                  accent={side === 'left' ? 'signal' : 'copper'}
                />
              ))}
            </div>
          </SectionCard>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Full body"
        description="Control arms, hands, and legs. Preview updates live in 3D."
        actions={
          <Button variant="outline" onClick={() => centerBody()}>
            <RotateCcw className="h-4 w-4" /> Reset body
          </Button>
        }
      />

      <HelpTip>
        Upload <code className="rounded bg-muted px-1.5 py-0.5 text-xs">full_body_servo_control.ino</code> to an
        Arduino Mega for hardware control. Sliders work in 3D preview without USB.
      </HelpTip>

      <div className="bento p-4">
        <p className="mb-1 font-display text-lg font-semibold">Full body 3D preview</p>
        <p className="mb-3 text-sm text-muted-foreground">
          Official InMoov STL meshes — use view buttons for front, hands, legs &amp; all sides
        </p>
        <div className="h-[min(52vh,520px)] min-h-[360px]">
          <RobotViewer className="h-full w-full" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
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
      </div>

      {tab === 'arms' && renderArms()}
      {tab === 'hands' && renderHands()}
      {tab === 'legs' && renderLegs()}
    </div>
  );
}