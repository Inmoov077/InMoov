import { Footprints, Hand, RotateCcw, Workflow } from 'lucide-react';
import { ServoControl } from '@/components/servo/ServoControl';
import { SectionCard } from '@/components/ux/SectionCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { cn } from '@/lib/utils';

export type BodyTab = 'arms' | 'hands' | 'legs';

const TABS: { id: BodyTab; label: string; icon: typeof Workflow }[] = [
  { id: 'arms', label: 'Arms', icon: Workflow },
  { id: 'hands', label: 'Hands', icon: Hand },
  { id: 'legs', label: 'Legs', icon: Footprints },
];

interface BodyJointPanelProps {
  tab: BodyTab;
  onTabChange: (tab: BodyTab) => void;
  compact?: boolean;
}

export function BodyJointPanel({ tab, onTabChange, compact }: BodyJointPanelProps) {
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

  const renderSide = (side: BodySide) => {
    const isLeft = side === 'left';
    const arm = isLeft ? leftArm : rightArm;
    const hand = isLeft ? leftHand : rightHand;
    const leg = isLeft ? leftLeg : rightLeg;

    if (tab === 'arms') {
      return (
        <>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {Object.entries(ARM_PRESETS).map(([name, preset]) => (
              <Button key={name} variant="outline" size="sm" onClick={() => setArm(side, preset)}>
                {name}
              </Button>
            ))}
          </div>
          <div className="space-y-3">
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
                accent={isLeft ? 'signal' : 'copper'}
              />
            ))}
          </div>
        </>
      );
    }

    if (tab === 'hands') {
      return (
        <>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {Object.entries(HAND_PRESETS).map(([name, preset]) => (
              <Button key={name} variant="outline" size="sm" onClick={() => setHand(side, preset)}>
                {name}
              </Button>
            ))}
          </div>
          <div className="space-y-3">
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
                accent={isLeft ? 'phosphor' : 'violet'}
              />
            ))}
          </div>
        </>
      );
    }

    return (
      <>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {Object.entries(LEG_PRESETS).map(([name, preset]) => (
            <Button key={name} variant="outline" size="sm" onClick={() => setLeg(side, preset)}>
              {name}
            </Button>
          ))}
        </div>
        <div className="space-y-3">
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
              accent={isLeft ? 'signal' : 'copper'}
            />
          ))}
        </div>
      </>
    );
  };

  const tabMeta = TABS.find((t) => t.id === tab) ?? TABS[0];

  return (
    <SectionCard
      icon={tabMeta.icon}
      title={compact ? 'Body' : `${tabMeta.label}`}
      description={
        tab === 'arms'
          ? 'Shoulder through wrist'
          : tab === 'hands'
            ? 'Individual fingers'
            : 'Hip through foot'
      }
      action={
        <Button variant="outline" size="sm" onClick={() => centerBody()}>
          <RotateCcw className="h-3.5 w-3.5" />
          Reset body
        </Button>
      }
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            className={cn(tab === item.id ? 'nav-pill-active' : 'nav-pill-idle')}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {(['left', 'right'] as BodySide[]).map((side) => (
          <div key={side} className="surface-inset space-y-1">
            <Badge variant="default" className="mb-2">
              {side === 'left' ? 'Left' : 'Right'}
            </Badge>
            {renderSide(side)}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
