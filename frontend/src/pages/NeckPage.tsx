import { AlertTriangle, RotateCcw, Shield } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ServoControl } from '@/components/servo/ServoControl';
import { Joystick } from '@/components/servo/Joystick';
import { SectionCard } from '@/components/ux/SectionCard';
import { HelpTip } from '@/components/ux/HelpTip';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useServoStore, type Axis } from '@/store/servoStore';
import { Bone } from 'lucide-react';

const AXES: {
  key: Axis;
  label: string;
  hint: string;
  pin: number;
  accent: 'copper' | 'signal' | 'violet';
}[] = [
  { key: 'rot', label: 'Spin', hint: 'Turn neck left or right.', pin: 6, accent: 'violet' },
  { key: 'tilt', label: 'Nod', hint: 'Tilt forward or backward.', pin: 7, accent: 'copper' },
  { key: 'roll', label: 'Lean', hint: 'Tilt sideways.', pin: 8, accent: 'signal' },
];

const SAFE_DEFAULTS = {
  rot: { min: 10, max: 170 },
  tilt: { min: 15, max: 165 },
  roll: { min: 10, max: 170 },
};

export function NeckPage() {
  const rot = useServoStore((s) => s.rot);
  const tilt = useServoStore((s) => s.tilt);
  const roll = useServoStore((s) => s.roll);
  const limits = useServoStore((s) => s.limits);
  const setNeck = useServoStore((s) => s.setNeck);
  const setMaster = useServoStore((s) => s.setMaster);
  const centerNeck = useServoStore((s) => s.centerNeck);

  const updateLimit = (axis: Axis, field: 'min' | 'max', value: number) => {
    useServoStore.setState({
      limits: {
        ...useServoStore.getState().limits,
        [axis]: { ...limits[axis], [field]: value },
      },
    });
  };

  const applySafeLimits = () => {
    useServoStore.setState({ limits: SAFE_DEFAULTS });
  };

  const resetWideLimits = () => {
    useServoStore.setState({
      limits: {
        rot: { min: 0, max: 180 },
        tilt: { min: 0, max: 180 },
        roll: { min: 0, max: 180 },
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Neck"
        description="Spin, nod, and lean — or drag the joystick pad for rotation + nod at once."
        actions={
          <Button variant="outline" size="sm" onClick={() => centerNeck()}>
            <RotateCcw className="h-4 w-4" />
            Reset neck
          </Button>
        }
      />

      <HelpTip>
        The joystick below is the easiest way to start — drag the dot to move rotation and nod together.
      </HelpTip>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <SectionCard icon={Bone} title="Neck motors" description="Fine-tune each axis with sliders.">
            <div className="space-y-4">
              <div className="panel-inset space-y-2 p-4">
                <div className="flex items-center justify-between">
                  <Label>Move all neck motors</Label>
                  <span className="font-mono text-sm font-bold text-primary">{rot}°</span>
                </div>
                <p className="text-xs text-muted-foreground">One slider controls spin, nod, and lean together.</p>
                <Slider
                  accent="copper"
                  min={limits.rot.min}
                  max={limits.rot.max}
                  value={[rot]}
                  onValueChange={([v]) => setMaster(v)}
                />
              </div>
              {AXES.map((axis) => (
                <ServoControl
                  key={axis.key}
                  label={axis.label}
                  hint={axis.hint}
                  pin={axis.pin}
                  value={axis.key === 'rot' ? rot : axis.key === 'tilt' ? tilt : roll}
                  min={limits[axis.key].min}
                  max={limits[axis.key].max}
                  onChange={(v) => setNeck(axis.key, v)}
                  accent={axis.accent}
                />
              ))}
            </div>
          </SectionCard>
          <Joystick />
        </div>

        <SectionCard
          icon={Shield}
          title="Safety limits"
          description="Prevent motors from going too far. Recommended for beginners."
        >
          <div className="space-y-5">
            {AXES.map((axis) => (
              <div key={axis.key} className="panel-inset space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <Label>{axis.label}</Label>
                  <Badge variant="copper">
                    {limits[axis.key].min}° – {limits[axis.key].max}°
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Minimum</span>
                    <Slider
                      accent="signal"
                      min={0}
                      max={180}
                      value={[limits[axis.key].min]}
                      onValueChange={([v]) => updateLimit(axis.key, 'min', v)}
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Maximum</span>
                    <Slider
                      accent="copper"
                      min={0}
                      max={180}
                      value={[limits[axis.key].max]}
                      onValueChange={([v]) => updateLimit(axis.key, 'max', v)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="success" onClick={applySafeLimits}>
                <Shield className="h-4 w-4" />
                Use safe defaults
              </Button>
              <Button size="sm" variant="outline" onClick={resetWideLimits}>
                Full range (0–180°)
              </Button>
            </div>

            <div className="flex gap-2 rounded-lg border border-destructive/30 bg-destructive/8 p-3 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
              <p>
                Going past physical limits can damage motors. Start with safe defaults and only widen
                the range after testing carefully.
              </p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}