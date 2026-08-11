import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Info, Pin, RefreshCw, Settings2, Usb } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ConnectionPanel } from '@/components/servo/ConnectionPanel';
import { PinMapPanel } from '@/components/control/PinMapPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import * as api from '@/lib/api';
import { getShowLegs, setShowLegs } from '@/lib/studioPrefs';
import { useServoStore, type Axis } from '@/store/servoStore';

interface ConfigData {
  gemini_api_key?: string;
  gemini_configured?: boolean;
  app_name?: string;
  firmware?: string;
  baud_rate?: number;
}

const AXES: { key: Axis; label: string }[] = [
  { key: 'rot', label: 'Rotation' },
  { key: 'tilt', label: 'Tilt' },
  { key: 'roll', label: 'Roll' },
];

export function SettingsPage() {
  const limits = useServoStore((s) => s.limits);
  const connected = useServoStore((s) => s.connected);
  const port = useServoStore((s) => s.port);
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState<'connect' | 'pins' | 'neck'>('connect');
  const [legsOn, setLegsOn] = useState(() => getShowLegs());

  const loadConfig = async () => {
    setLoading(true);
    try {
      setConfig(await api.getConfig());
    } catch {
      setConfig(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadConfig();
  }, []);

  const updateLimit = (axis: Axis, field: 'min' | 'max', value: number) => {
    useServoStore.setState({
      limits: {
        ...useServoStore.getState().limits,
        [axis]: { ...limits[axis], [field]: value },
      },
    });
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Settings"
        description="USB connection, pins, body options, and safety limits"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => void loadConfig()} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm" asChild>
              <Link to="/control">Open Studio</Link>
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap gap-1.5">
        {(
          [
            { id: 'connect' as const, label: 'USB', icon: Usb },
            { id: 'pins' as const, label: 'Pins', icon: Pin },
            { id: 'neck' as const, label: 'Neck limits', icon: Settings2 },
          ] as const
        ).map((s) => (
          <Button
            key={s.id}
            size="sm"
            variant={section === s.id ? 'default' : 'outline'}
            onClick={() => setSection(s.id)}
          >
            <s.icon className="h-4 w-4" />
            {s.label}
          </Button>
        ))}
        <Button size="sm" variant="outline" asChild>
          <Link to="/calibration">Calibration</Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Studio options</CardTitle>
          <CardDescription>What appears in Studio Control</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Show legs</p>
              <p className="text-xs text-muted-foreground">
                Off by default — enable to control left and right legs in Studio
              </p>
            </div>
            <Switch
              checked={legsOn}
              onCheckedChange={(on) => {
                setLegsOn(on);
                setShowLegs(on);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {section === 'connect' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ConnectionPanel />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Info className="h-4 w-4 text-primary" /> System
              </CardTitle>
              <CardDescription>Firmware & AI config</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">USB</span>
                <Badge variant={connected ? 'online' : 'offline'}>
                  {connected ? port ?? 'On' : 'Off'}
                </Badge>
              </div>
              <Separator />
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">App</span>
                <span className="font-medium">{config?.app_name ?? 'InMoove'}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Firmware</span>
                <span className="font-mono text-xs">{config?.firmware ?? 'full_body_servo_control'}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Baud</span>
                <span className="font-mono">{config?.baud_rate ?? 9600}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Gemini</span>
                <Badge variant={config?.gemini_configured ? 'online' : 'offline'}>
                  {config?.gemini_configured ? 'Configured' : 'Not set'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {section === 'pins' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pin map</CardTitle>
            <CardDescription>Every servo → Mega pin. Save applies to firmware when connected.</CardDescription>
          </CardHeader>
          <CardContent>
            <PinMapPanel />
          </CardContent>
        </Card>
      )}

      {section === 'neck' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings2 className="h-4 w-4 text-primary" /> Neck software limits
            </CardTitle>
            <CardDescription>UI clamps for rotation / tilt / roll (session store)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {AXES.map((axis) => (
              <div key={axis.key} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <Label>{axis.label}</Label>
                  <span className="font-mono text-xs text-muted-foreground">
                    {limits[axis.key].min}° – {limits[axis.key].max}°
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="mb-1 text-[10px] text-muted-foreground">Min</p>
                    <Slider
                      value={[limits[axis.key].min]}
                      min={0}
                      max={180}
                      step={1}
                      onValueChange={([v]) => updateLimit(axis.key, 'min', v)}
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] text-muted-foreground">Max</p>
                    <Slider
                      value={[limits[axis.key].max]}
                      min={0}
                      max={180}
                      step={1}
                      onValueChange={([v]) => updateLimit(axis.key, 'max', v)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
