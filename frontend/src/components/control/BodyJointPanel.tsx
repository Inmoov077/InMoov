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
import { getArmEffectiveLimits, getArmHardLimits, sanitizeArm } from '@/lib/armSafety';
import { useBodyStore } from '@/store/bodyStore';
import { usePinStore } from '@/store/pinStore';
import { cn } from '@/lib/utils';

export type BodyTab = 'arms' | 'hands' | 'legs';

const TABS: { id: BodyTab; label: string; icon: typeof Workflow }[] = [
  { id: 'arms', label: 'Arms', icon: Workflow },
  { id: 'hands', label: 'Hands', icon: Hand },
  { id: 'legs', label: 'Legs', icon: Footprints },
];

const SIDE_LABEL: Record<BodySide, string> = {
  left: 'Left',
  right: 'Right',
};

const PRESET_NICE: Record<string, string> = {
  rest: 'Rest',
  wave: 'Wave',
  point: 'Point',
  reach: 'Reach',
  open: 'Open',
  fist: 'Fist',
  peace: 'Peace',
  stand: 'Stand',
  step: 'Step',
  squat: 'Squat',
  kick: 'Kick',
  walk: 'Walk',
  lunge: 'Lunge',
};

interface BodyJointPanelProps {
  tab: BodyTab;
  onTabChange: (tab: BodyTab) => void;
}

export function BodyJointPanel({ tab, onTabChange }: BodyJointPanelProps) {
  // Re-render when pins change (saved from Pins tab)
  const pinMap = usePinStore((s) => s.pins);
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
      setArm(side, sanitizeArm(side, ARM_PRESETS[name as keyof typeof ARM_PRESETS] as ArmJoints));
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
      const hard = getArmHardLimits(side);
      const effective = getArmEffectiveLimits(side, arm);
      return ARM_JOINT_META.map((joint) => {
        const min = hard[joint.key].min;
        const max = hard[joint.key].max;
        const effMax = effective[joint.key].max;
        const effMin = effective[joint.key].min;
        const mid = Math.round((min + max) / 2);
        const limited = arm[joint.key] > effMax || arm[joint.key] < effMin;
        return (
          <ServoControl
            key={`${side}-${joint.key}`}
            label={joint.label}
            hint={
              limited
                ? `${joint.hint} · safe ${effMin}–${effMax}°`
                : `${joint.hint} · ${min}–${max}°`
            }
            pin={
              pinMap[`${isLeft ? 'l' : 'r'}_${joint.key === 'lift' ? 'lift' : joint.key}`] ??
              joint.pin[side]
            }
            value={arm[joint.key]}
            min={min}
            max={max}
            onChange={(v) => setArmJoint(side, joint.key, v)}
            accent={isLeft ? 'signal' : 'copper'}
            showPin
            presets={[min, mid, max].filter((p, i, a) => a.indexOf(p) === i)}
          />
        );
      });
    }
    if (tab === 'hands') {
      return HAND_JOINT_META.map((joint) => {
        const pkey = `${isLeft ? 'l' : 'r'}_${joint.key}`;
        return (
        <ServoControl
          key={`${side}-${joint.key}`}
          label={joint.label}
          pin={pinMap[pkey] ?? joint.pin[side]}
          value={hand[joint.key]}
          min={joint.min}
          max={joint.max}
          onChange={(v) => setHandJoint(side, joint.key, v)}
          presets={[10, 90, 170]}
          presetLabels={{ 10: 'Open', 90: 'Half', 170: 'Close' }}
          accent={isLeft ? 'phosphor' : 'violet'}
          showPin
        />
        );
      });
    }
    return LEG_JOINT_META.map((joint) => {
      const pkey = `${isLeft ? 'l' : 'r'}_${joint.key}`;
      return (
      <ServoControl
        key={`${side}-${joint.key}`}
        label={joint.label}
        pin={pinMap[pkey] ?? joint.pin[side]}
        value={leg[joint.key]}
        min={joint.min}
        max={joint.max}
        onChange={(v) => setLegJoint(side, joint.key, v)}
        accent={isLeft ? 'signal' : 'copper'}
        showPin
        presets={[joint.min ?? 0, 90, joint.max ?? 180]}
      />
      );
    });
  };

  const partWord = tab === 'arms' ? 'arm' : tab === 'hands' ? 'hand' : 'leg';

  return (
    <SectionCard
      icon={TABS.find((t) => t.id === tab)?.icon}
      title="Body"
      description="Arms · hands · legs"
      action={
        <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs" onClick={() => centerBody()}>
          <RotateCcw className="h-3.5 w-3.5" /> Rest body
        </Button>
      }
    >
      {/* Part tabs */}
      <div className="mb-3 flex flex-wrap gap-1">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            className={cn(
              tab === item.id ? 'nav-pill-active' : 'nav-pill-idle',
              'px-3 py-1.5 text-xs font-semibold',
            )}
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Presets for both sides */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Both sides
        </span>
        {presetNames.map((name) => (
          <Button
            key={name}
            variant="outline"
            size="sm"
            className="h-8 px-2.5 text-xs capitalize"
            onClick={() => {
              applyPreset('left', name);
              applyPreset('right', name);
            }}
          >
            {PRESET_NICE[String(name)] ?? String(name)}
          </Button>
        ))}
      </div>

      {/* Left / Right cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {(['left', 'right'] as BodySide[]).map((side) => (
          <div key={side} className="body-side-card">
            <div className="mb-2 flex items-center justify-between gap-2 px-0.5">
              <span className="body-side-title">
                {SIDE_LABEL[side]} {partWord}
              </span>
              <div className="flex flex-wrap justify-end gap-1">
                {presetNames.slice(0, 4).map((name) => (
                  <button
                    key={name}
                    type="button"
                    className="motor-chip"
                    onClick={() => applyPreset(side, name)}
                  >
                    {PRESET_NICE[String(name)] ?? String(name)}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">{renderSide(side)}</div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
