/** Settings: serial port, pins, limits. D455 presence is configured on Vision. */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Info, Pin, RefreshCw, Settings2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ConnectionPanel } from '@/components/servo/ConnectionPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import * as api from '@/lib/api';
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
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [loading, setLoading] = useState(false);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const data = await api.getConfig();
      setConfig(data);
    } catch {
      setConfig(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
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
    <div>
      <PageHeader
        title="Settings"
        description="Connect your Arduino, check system info, and adjust neck safety limits."
        actions={
          <Button variant="outline" size="sm" onClick={loadConfig} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <ConnectionPanel />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pin className="h-4 w-4 text-primary" />
              Pin & Motor Calibration
            </CardTitle>
            <CardDescription>VDB hardware-tested limits + editable pin map</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/calibration">Open Calibration Page</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-primary" />
              Neck Limits
            </CardTitle>
            <CardDescription>Global software limits stored in servo state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {AXES.map((axis) => (
              <div key={axis.key} className="space-y-2 rounded-lg border border-border/60 p-3">
                <div className="flex items-center justify-between">
                  <Label>{axis.label}</Label>
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">
                    {limits[axis.key].min}Â° â€“ {limits[axis.key].max}Â°
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Slider
                    accent="signal"
                    min={0}
                    max={180}
                    value={[limits[axis.key].min]}
                    onValueChange={([v]) => updateLimit(axis.key, 'min', v)}
                  />
                  <Slider
                    accent="copper"
                    min={0}
                    max={180}
                    value={[limits[axis.key].max]}
                    onValueChange={([v]) => updateLimit(axis.key, 'max', v)}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-4 w-4 text-accent" />
              System Information
            </CardTitle>
            <CardDescription>From api.getConfig()</CardDescription>
          </CardHeader>
          <CardContent>
            {config ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <InfoItem label="Application" value={config.app_name ?? 'â€”'} />
                <InfoItem label="Firmware" value={config.firmware ?? 'â€”'} />
                <InfoItem label="Baud Rate" value={String(config.baud_rate ?? 'â€”')} />
                <div className="panel-inset p-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Gemini API
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant={config.gemini_configured ? 'online' : 'offline'}>
                      {config.gemini_configured ? 'Configured' : 'Not Set'}
                    </Badge>
                  </div>
                  {config.gemini_api_key && (
                    <p className="mt-2 font-mono text-xs text-muted-foreground">
                      Key: {config.gemini_api_key.slice(0, 8)}â€¦
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Unable to load config â€” ensure Flask backend is running on port 5000.
              </p>
            )}

            <Separator className="my-4" />

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Cpu className="h-4 w-4" />
              <span>InMoov Control Center Â· React + Vite frontend Â· Zustand servo store</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel-inset p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-display text-sm font-semibold">{value}</p>
    </div>
  );
}
