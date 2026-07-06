import { RotateCcw, ScanFace, Bone, ScrollText } from 'lucide-react';
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

export function AllServosPage() {
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
          <div className="bento p-4">
            <p className="mb-3 font-display text-lg font-semibold">3D preview</p>
            <div className="h-[420px]">
              <RobotViewer className="h-full w-full" />
            </div>
          </div>
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