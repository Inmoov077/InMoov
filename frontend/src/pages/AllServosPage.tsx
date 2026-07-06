import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, ScanFace, Bone, ScrollText, Footprints, ArrowUpRight, Hand, Workflow } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ConnectionPanel } from '@/components/servo/ConnectionPanel';
import { ServoControl } from '@/components/servo/ServoControl';
import { SerialConsole } from '@/components/servo/SerialConsole';
import { Joystick } from '@/components/servo/Joystick';
import { RobotViewer } from '@/components/robot/RobotViewer';
import { SectionCard } from '@/components/ux/SectionCard';
import { HelpTip } from '@/components/ux/HelpTip';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useServoStore } from '@/store/servoStore';
import { useBodyStore } from '@/store/bodyStore';
import {
  ARM_JOINT_META,
  HAND_JOINT_META,
  LEG_JOINT_META,
  type BodySide,
} from '@/lib/bodyConfig';
import { cn } from '@/lib/utils';

type BodyTab = 'arms' | 'hands' | 'legs';

export function AllServosPage() {
  const [bodyTab, setBodyTab] = useState<BodyTab>('arms');
  const hneck = useServoStore((s) => s.hneck);
  const eye = useServoStore((s) => s.eye);
  const jaw = useServoStore((s) => s.jaw);
  const rot = useServoStore((s) => s.rot);
  const tilt = useServoStore((s) => s.tilt);
  const roll = useServoStore((s) => s.roll);
  const limits = useServoStore((s) => s.limits);
  const setHead = useServoStore((s) => s.setHead);
  const setNeck = useServoStore((s) => s.setNeck);
  const setMaster = useServoStore((s) => s.setMaster);
  const centerAll = useServoStore((s) => s.centerAll);
  const leftArm = useBodyStore((s) => s.leftArm);
  const rightArm = useBodyStore((s) => s.rightArm);
  const leftHand = useBodyStore((s) => s.leftHand);
  const rightHand = useBodyStore((s) => s.rightHand);
  const leftLeg = useBodyStore((s) => s.leftLeg);
  const rightLeg = useBodyStore((s) => s.rightLeg);
  const setArmJoint = useBodyStore((s) => s.setArmJoint);
  const setHandJoint = useBodyStore((s) => s.setHandJoint);
  const setLegJoint = useBodyStore((s) => s.setLegJoint);
  const centerBody = useBodyStore((s) => s.centerBody);

  const renderBodySide = (
    side: BodySide,
    tab: BodyTab,
  ) => {
    const arm = side === 'left' ? leftArm : rightArm;
    const hand = side === 'left' ? leftHand : rightHand;
    const leg = side === 'left' ? leftLeg : rightLeg;

    if (tab === 'arms') {
      return ARM_JOINT_META.map((joint) => (
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
      ));
    }
    if (tab === 'hands') {
      return HAND_JOINT_META.map((joint) => (
        <ServoControl
          key={`${side}-${joint.key}`}
          label={joint.label}
          hint={joint.hint}
          pin={joint.pin[side]}
          value={hand[joint.key]}
          min={joint.min}
          max={joint.max}
          onChange={(v) => setHandJoint(side, joint.key, v)}
          accent={side === 'left' ? 'phosphor' : 'violet'}
        />
      ));
    }
    return LEG_JOINT_META.map((joint) => (
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
    ));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Control panel"
        description="Move every motor. Watch the 3D model update live."
        actions={
          <Button variant="outline" onClick={() => centerAll()}>
            <RotateCcw className="h-4 w-4" /> Reset all
          </Button>
        }
      />

      <HelpTip>Drag sliders or the neck pad. Connect USB in Settings to move the real robot.</HelpTip>

      <div className="bento p-4">
        <p className="mb-1 font-display text-lg font-semibold">Full InMoov 3D preview</p>
        <p className="mb-3 text-sm text-muted-foreground">
          Realistic white PLA look · compare with gallery photos · all joints move live
        </p>
        <div className="h-[min(68vh,640px)] min-h-[480px]">
          <RobotViewer className="h-full w-full" />
        </div>
      </div>

      <SectionCard
        icon={Footprints}
        title="Arms, hands & legs"
        description="All body motors — preview updates live above"
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => centerBody()}>
              <RotateCcw className="h-3.5 w-3.5" /> Reset body
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/body">Full body page <ArrowUpRight className="h-3.5 w-3.5" /></Link>
            </Button>
          </div>
        }
      >
        <div className="mb-4 flex flex-wrap gap-2">
          {(
            [
              { id: 'arms' as BodyTab, label: 'Arms', icon: Workflow },
              { id: 'hands' as BodyTab, label: 'Hands', icon: Hand },
              { id: 'legs' as BodyTab, label: 'Legs', icon: Footprints },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setBodyTab(item.id)}
              className={cn(bodyTab === item.id ? 'nav-pill-active' : 'nav-pill-idle')}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {(['left', 'right'] as BodySide[]).map((side) => (
            <div key={side} className="space-y-4">
              <p className="text-sm font-semibold">{side === 'left' ? 'Left' : 'Right'} side</p>
              {renderBodySide(side, bodyTab)}
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-4">
          <ConnectionPanel compact />
          <SectionCard icon={ScanFace} title="Head" description="Face movement">
            <div className="space-y-4">
              <ServoControl label="Turn head" hint="Left ↔ right" pin={3} value={hneck} onChange={(v) => setHead('hneck', v)} presets={[0, 45, 85, 135, 180]} presetLabels={{ 85: 'Center' }} accent="copper" />
              <ServoControl label="Eyes" hint="Up ↔ down" pin={4} value={eye} onChange={(v) => setHead('eye', v)} accent="signal" />
              <ServoControl label="Jaw" hint="Open mouth" pin={5} value={jaw} min={0} max={40} onChange={(v) => setHead('jaw', v)} presets={[0, 8, 20, 40]} presetLabels={{ 0: 'Closed', 8: 'Rest' }} accent="phosphor" />
            </div>
          </SectionCard>
        </div>

        <div className="space-y-5 lg:col-span-5">
          <Joystick />
        </div>

        <div className="space-y-5 lg:col-span-3">
          <SectionCard icon={Bone} title="Neck" description="Rotation & tilt">
            <div className="space-y-4">
              <div className="surface-inset space-y-2">
                <div className="flex justify-between"><Label>All together</Label><span className="font-mono font-bold text-primary">{rot}°</span></div>
                <Slider accent="copper" min={0} max={180} value={[rot]} onValueChange={([v]) => setMaster(v)} />
              </div>
              <ServoControl label="Spin" pin={6} value={rot} min={limits.rot.min} max={limits.rot.max} onChange={(v) => setNeck('rot', v)} accent="violet" />
              <ServoControl label="Nod" pin={7} value={tilt} min={limits.tilt.min} max={limits.tilt.max} onChange={(v) => setNeck('tilt', v)} accent="copper" />
              <ServoControl label="Lean" pin={8} value={roll} min={limits.roll.min} max={limits.roll.max} onChange={(v) => setNeck('roll', v)} accent="signal" />
            </div>
          </SectionCard>
          <SectionCard icon={ScrollText} title="Log" description="Commands sent">
            <SerialConsole height="h-44" />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}