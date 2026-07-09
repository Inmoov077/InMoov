import { Footprints, Hand, RotateCcw, Workflow } from 'lucide-react';
import { ServoControl } from '@/components/servo/ServoControl';
import { SectionCard } from '@/components/ux/SectionCard';
import { Button } from '@/components/ui/button';
import {
  ARM_JOINT_META,
  ARM_PRESETS,
  HAND_JOINT_META,
  HAND_PRESETS,
  LEG_JOINT_META,
  LEG_PRESETS,
  type ArmJoints,
  type BodySide,
  type HandJoints,
  type LegJoints,
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
}

export function BodyJointPanel({ tab, onTabChange }: BodyJointPanelProps) {
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

  const presetNames =
    tab === 'arms'
      ? (Object.keys(ARM_PRESETS) as (keyof typeof ARM_PRESETS)[])
      : tab === 'hands'
        ? (Object.keys(HAND_PRESETS) as (keyof typeof HAND_PRESETS)[])
        : (Object.keys(LEG_PRESETS) as (keyof typeof LEG_PRESETS)[]);

  const applyPreset = (side: BodySide, name: string) => {
    if (tab === 'arms' && name in ARM_PRESETS) {
      setArm(side, ARM_PRESETS[name as keyof typeof ARM_PRESETS] as ArmJoints);
    } else if (tab === 'hands' && name in HAND_PRESETS) {
      setHand(side, HAND_PRESETS[name as keyof typeof HAND_PRESETS] as HandJoints);
    } else if (tab === 'legs' && name in LEG_PRESETS) {
      setLeg(side, LEG_PRESETS[name as keyof typeof LEG_PRESETS] as LegJoints);
    }
  };

  const renderSide = (side: BodySide) => {
    const isLeft = side === 'left';
    const arm = isLeft ? leftArm : rightArm;
    const hand = isLeft ? leftHand : rightHand;
    const leg = isLeft ? leftLeg : rightLeg;

    if (tab === 'arms') {
      return ARM_JOINT_META.map((joint) => (
        <ServoControl
          key={`${side}-${joint.key}`}
          label={joint.label}
          pin={joint.pin[side]}
          value={arm[joint.key]}
          min={joint.min}
          max={joint.max}
          onChange={(v) => setArmJoint(side, joint.key, v)}
          accent={isLeft ? 'signal' : 'copper'}
          presets={[joint.min ?? 0, 90, joint.max ?? 180]}
        />
      ));
    }
    if (tab === 'hands') {
      return HAND_JOINT_META.map((joint) => (
        <ServoControl
          key={`${side}-${joint.key}`}
          label={joint.label}
          pin={joint.pin[side]}
          value={hand[joint.key]}
          min={joint.min}
          max={joint.max}
          onChange={(v) => setHandJoint(side, joint.key, v)}
          presets={[10, 90, 170]}
          presetLabels={{ 10: 'O', 90: 'H', 170: 'C' }}
          accent={isLeft ? 'phosphor' : 'violet'}
        />
      ));
    }
    return LEG_JOINT_META.map((joint) => (
      <ServoControl
        key={`${side}-${joint.key}`}
        label={joint.label}
        pin={joint.pin[side]}
        value={leg[joint.key]}
        min={joint.min}
        max={joint.max}
        onChange={(v) => setLegJoint(side, joint.key, v)}
        accent={isLeft ? 'signal' : 'copper'}
        presets={[joint.min ?? 0, 90, joint.max ?? 180]}
      />
    ));
  };

  return (
    <SectionCard
      icon={TABS.find((t) => t.id === tab)?.icon}
      title="Body"
      description="Arms · hands · legs"
      action={
        <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => centerBody()}>
          <RotateCcw className="h-3 w-3" /> Reset
        </Button>
      }
    >
      <div className="mb-2 flex flex-wrap gap-1">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            className={cn(tab === item.id ? 'nav-pill-active' : 'nav-pill-idle', 'px-2.5 py-1 text-xs')}
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </button>
        ))}
      </div>

      <div className="mb-2 flex flex-wrap gap-1">
        {presetNames.map((name) => (
          <Button
            key={name}
            variant="outline"
            size="sm"
            className="h-6 px-2 text-[11px]"
            onClick={() => {
              applyPreset('left', name);
              applyPreset('right', name);
            }}
          >
            {name}
          </Button>
        ))}
        <span className="self-center text-[10px] text-muted-foreground">both</span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {(['left', 'right'] as BodySide[]).map((side) => (
          <div key={side} className="rounded-lg border border-border/40 bg-muted/30 p-1.5">
            <div className="mb-1 flex items-center justify-between px-1">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {side}
              </span>
              <div className="flex gap-0.5">
                {presetNames.slice(0, 3).map((name) => (
                  <button
                    key={name}
                    type="button"
                    className="motor-chip"
                    onClick={() => applyPreset(side, name)}
                  >
                    {String(name).slice(0, 4)}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1">{renderSide(side)}</div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
