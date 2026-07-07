import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Cpu,
  Hand,
  Loader2,
  Pin,
  Play,
  RefreshCw,
  Save,
  Settings2,
  Square,
  Target,
  Waves,
  Wrench,
} from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/PageHeader';
import { ConnectionPanel } from '@/components/servo/ConnectionPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import * as api from '@/lib/api';
import { SERVO_CONFIG, SERVOS, type ServoDef } from '@/lib/servoConfig';
import { playWavePattern, type WavePattern } from '@/lib/wavePatternPlayer';
import { useBodyStore } from '@/store/bodyStore';
import { useServoStore } from '@/store/servoStore';
import { cn } from '@/lib/utils';

type Tab = 'pins' | 'limits' | 'tester' | 'waves';

const GROUP_ORDER = [
  'head', 'neck', 'leftArm', 'rightArm', 'leftHand', 'rightHand', 'leftLeg', 'rightLeg',
] as const;

const GROUP_LABELS: Record<string, string> = {
  head: 'Head',
  neck: 'Neck',
  leftArm: 'Left Arm',
  rightArm: 'Right Arm',
  leftHand: 'Left Hand',
  rightHand: 'Right Hand',
  leftLeg: 'Left Leg',
  rightLeg: 'Right Leg',
};

export function CalibrationPage() {
  const [tab, setTab] = useState<Tab>('pins');
  const [pins, setPins] = useState<Record<string, number>>({});
  const [limits, setLimits] = useState<Record<string, { min: number; max: number; rest: number }>>({});
  const [enabledParts, setEnabledParts] = useState<Record<string, boolean>>({});
  const [wavePatterns, setWavePatterns] = useState<WavePattern[]>([]);
  const [runningWave, setRunningWave] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [testPart, setTestPart] = useState<string | null>(null);
  const [gripPct, setGripPct] = useState(80);
  const abortRef = useRef<AbortController | null>(null);
  const connected = useServoStore((s) => s.connected);
  const centerAll = useServoStore((s) => s.centerAll);
  const centerBody = useBodyStore((s) => s.centerBody);
  const setHand = useBodyStore((s) => s.setHand);

  const grouped = useMemo(() => {
    const map: Record<string, ServoDef[]> = {};
    for (const s of SERVOS) {
      if (!map[s.group]) map[s.group] = [];
      map[s.group].push(s);
    }
    return map;
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [cfg, pinRes, calRes, waveRes] = await Promise.all([
        api.getServoConfig(),
        api.getServoPins(),
        api.getServoCalibration(),
        api.getWavePatterns(),
      ]);

      const pinMap: Record<string, number> = {};
      const limMap: Record<string, { min: number; max: number; rest: number }> = {};
      for (const s of cfg.servos ?? SERVOS) {
        pinMap[s.key] = s.pin;
        limMap[s.key] = { min: s.min, max: s.max, rest: s.rest };
      }
      Object.assign(pinMap, pinRes.pins ?? {});
      for (const [k, v] of Object.entries(calRes.calibration ?? {})) {
        if (v && typeof v === 'object') {
          limMap[k] = { ...limMap[k], ...(v as { min?: number; max?: number; rest?: number }) };
        }
      }
      setPins(pinMap);
      setLimits(limMap);

      const groups = cfg.bodyPartGroups ?? SERVO_CONFIG.bodyPartGroups;
      const en: Record<string, boolean> = {};
      for (const k of Object.keys(groups)) en[k] = true;
      setEnabledParts(en);

      setWavePatterns(waveRes.patterns ?? []);
    } catch {
      toast.error('Failed to load calibration data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const savePins = async () => {
    setSaving(true);
    try {
      const res = await api.saveServoPins(pins, connected);
      if (res.ok) toast.success(`Pins saved${res.firmware_applied?.length ? ' & sent to firmware' : ''}`);
      else toast.error(res.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const saveLimits = async () => {
    setSaving(true);
    try {
      const res = await api.saveServoCalibration(limits, connected);
      if (res.ok) toast.success(`Calibration saved${res.firmware_applied?.length ? ' & sent to firmware' : ''}`);
      else toast.error(res.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const applyVdbProfile = async () => {
    const res = await api.applyVdbPinProfile();
    if (res.ok) {
      toast.success('VDB upper-body pin profile applied');
      await loadAll();
    } else toast.error('Failed to apply VDB profile');
  };

  const resetPins = () => {
    const defaults: Record<string, number> = {};
    for (const s of SERVOS) defaults[s.key] = s.pin;
    setPins(defaults);
    toast.info('Pins reset to Mega defaults — click Save to persist');
  };

  const onPinChange = async (key: string, pin: number) => {
    setPins((p) => ({ ...p, [key]: pin }));
    if (connected) {
      await api.setServoPin(key, pin);
    }
  };

  const onLimitChange = (key: string, field: 'min' | 'max' | 'rest', value: number) => {
    setLimits((l) => ({
      ...l,
      [key]: { ...l[key], [field]: value },
    }));
  };

  const togglePart = async (groupKey: string, on: boolean) => {
    const next = { ...enabledParts, [groupKey]: on };
    setEnabledParts(next);
    if (connected) await api.setBodyPartEnable(next);
  };

  const doGrip = async (side: 'L' | 'R' | 'B', pct: number) => {
    if (connected) {
      await api.sendGrip(side, pct);
    } else {
      const handSide = side === 'L' ? 'left' : 'right';
      if (side === 'B') {
        const open = { thumb: 10, index: 10, middle: 10, ring: 10, pinky: 10 };
        const closed = { thumb: 120, index: 130, middle: 130, ring: 130, pinky: 130 };
        const vals = pct < 50 ? open : closed;
        setHand('left', vals, false);
        setHand('right', vals, false);
      } else {
        const s = SERVOS.find((x) => x.key === `${handSide[0]}_thumb`);
        const mn = s?.min ?? 10;
        const mx = s?.max ?? 130;
        const v = Math.round(mn + (pct / 100) * (mx - mn));
        setHand(handSide, { thumb: v, index: v, middle: v, ring: v, pinky: v }, false);
      }
    }
    toast.success(`Grip ${side} @ ${pct}%`);
  };

  const playWave = async (pat: WavePattern) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setRunningWave(pat.id);
    try {
      await playWavePattern(pat, ctrl.signal);
    } finally {
      setRunningWave(null);
    }
  };

  const TABS: { id: Tab; label: string; icon: typeof Pin }[] = [
    { id: 'pins', label: 'Pin Map', icon: Pin },
    { id: 'limits', label: 'Calibration', icon: Target },
    { id: 'tester', label: 'Part Tester', icon: Wrench },
    { id: 'waves', label: 'Wave Patterns', icon: Waves },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading calibration data…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calibration & Pins"
        description="Motor wiring, degree limits from VDB + MRL, part testing, and flag-wave patterns."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={loadAll}>
              <RefreshCw className="h-4 w-4" /> Reload
            </Button>
            {runningWave && (
              <Button variant="destructive" size="sm" onClick={() => { abortRef.current?.abort(); setRunningWave(null); }}>
                <Square className="h-4 w-4" /> Stop
              </Button>
            )}
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Button key={t.id} variant={tab === t.id ? 'default' : 'outline'} size="sm" onClick={() => setTab(t.id)}>
            <t.icon className="h-4 w-4" /> {t.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {tab === 'pins' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pin className="h-4 w-4 text-primary" /> Pin / Channel Mapping
                </CardTitle>
                <CardDescription>
                  Assign Mega pins per servo. Changes send <code className="text-xs">W,idx,pin</code> to firmware when connected.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={savePins} disabled={saving}>
                    <Save className="h-4 w-4" /> Save All Pins
                  </Button>
                  <Button size="sm" variant="outline" onClick={resetPins}>Reset Defaults</Button>
                  <Button size="sm" variant="outline" onClick={applyVdbProfile}>Apply VDB Profile</Button>
                </div>
                {GROUP_ORDER.map((group) => {
                  const servos = grouped[group];
                  if (!servos?.length) return null;
                  return (
                    <div key={group}>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {GROUP_LABELS[group] ?? group}
                      </p>
                      <div className="space-y-1">
                        {servos.map((s) => (
                          <div key={s.key} className="flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2">
                            <span className="min-w-[120px] text-sm font-medium">{s.label}</span>
                            <Badge variant="default" className="text-[10px]">{s.motor ?? 'Servo'}</Badge>
                            {s.vdbPin != null && (
                              <span className="text-[10px] text-muted-foreground">VDB:{s.vdbPin}</span>
                            )}
                            <Input
                              type="number"
                              min={2}
                              max={53}
                              className="ml-auto h-8 w-20 font-mono text-center"
                              value={pins[s.key] ?? s.pin}
                              onChange={(e) => onPinChange(s.key, Number(e.target.value))}
                            />
                            <span className="text-[10px] text-muted-foreground">pin</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {tab === 'limits' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-accent" /> Degree Limits & Rest
                </CardTitle>
                <CardDescription>
                  VDB hardware-tested limits merged with MRL. Sends <code className="text-xs">U,idx,min,max,rest</code> when saved.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button size="sm" onClick={saveLimits} disabled={saving}>
                  <Save className="h-4 w-4" /> Save Calibration
                </Button>
                <div className="max-h-[60vh] overflow-y-auto space-y-1">
                  {SERVOS.map((s) => {
                    const lim = limits[s.key] ?? { min: s.min, max: s.max, rest: s.rest };
                    return (
                      <div key={s.key} className="grid grid-cols-[1fr_repeat(3,72px)] items-center gap-2 rounded border border-border/40 px-3 py-2 text-sm">
                        <div>
                          <span className="font-medium">{s.label}</span>
                          <Badge variant="copper" className="ml-2 text-[9px]">{s.calibrationSource ?? 'mrl'}</Badge>
                        </div>
                        {(['min', 'max', 'rest'] as const).map((field) => (
                          <Input
                            key={field}
                            type="number"
                            className="h-7 font-mono text-xs text-center"
                            value={lim[field]}
                            onChange={(e) => onLimitChange(s.key, field, Number(e.target.value))}
                          />
                        ))}
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-muted-foreground">Columns: Min · Max · Rest (degrees)</p>
              </CardContent>
            </Card>
          )}

          {tab === 'tester' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-4 w-4" /> Part Tester
                </CardTitle>
                <CardDescription>Test body groups — grip, home, and per-part enable</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {GROUP_ORDER.filter((g) => g.includes('Hand') || g.includes('Arm')).map((group) => (
                    <button
                      key={group}
                      type="button"
                      className={cn(
                        'rounded-xl border p-4 text-left transition-colors',
                        testPart === group ? 'border-primary bg-primary/10' : 'border-border/60 hover:border-primary/40',
                      )}
                      onClick={() => setTestPart(group)}
                    >
                      <p className="font-semibold">{GROUP_LABELS[group]}</p>
                      <p className="text-xs text-muted-foreground">{grouped[group]?.length ?? 0} servos</p>
                    </button>
                  ))}
                </div>

                <div className="rounded-lg border border-border/60 p-4 space-y-3">
                  <Label className="flex items-center gap-2"><Hand className="h-4 w-4" /> Grip Control</Label>
                  <Slider accent="copper" min={0} max={100} value={[gripPct]} onValueChange={([v]) => setGripPct(v)} />
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => doGrip('R', 10)}>Open Right</Button>
                    <Button size="sm" variant="outline" onClick={() => doGrip('R', gripPct)}>Grip Right {gripPct}%</Button>
                    <Button size="sm" variant="outline" onClick={() => doGrip('L', gripPct)}>Grip Left {gripPct}%</Button>
                    <Button size="sm" onClick={() => doGrip('B', gripPct)}>Grip Both</Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => { centerAll(); centerBody(); }}>Home All</Button>
                </div>

                {testPart && grouped[testPart] && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase text-muted-foreground">Sliders — {GROUP_LABELS[testPart]}</p>
                    {grouped[testPart].map((s) => {
                      const lim = limits[s.key] ?? s;
                      return (
                        <div key={s.key} className="flex items-center gap-3">
                          <span className="w-24 text-xs">{s.label}</span>
                          <Slider
                            accent="signal"
                            min={lim.min}
                            max={lim.max}
                            value={[lim.rest]}
                            onValueChange={() => {}}
                            className="flex-1 opacity-50"
                          />
                          <span className="font-mono text-xs w-10">{lim.rest}°</span>
                        </div>
                      );
                    })}
                    <p className="text-[10px] text-muted-foreground">Use Control panel for live slider testing</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {tab === 'waves' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Waves className="h-4 w-4 text-primary" /> VDB Wave Patterns
                </CardTitle>
                <CardDescription>Flag-wave arm patterns from VDB — played via dashboard animator</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {wavePatterns.map((pat) => (
                    <div
                      key={pat.id}
                      className={cn(
                        'preset-tile cursor-pointer',
                        runningWave === pat.id && 'active',
                      )}
                      onClick={() => !runningWave && playWave(pat)}
                    >
                      <span className="text-2xl">{pat.icon}</span>
                      <h3 className="mt-2 font-semibold">{pat.name}</h3>
                      <p className="text-xs text-muted-foreground">{pat.hands} hand(s)</p>
                      <Button className="mt-3 w-full" size="sm" disabled={!!runningWave}>
                        <Play className="h-3 w-3" /> Play
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <ConnectionPanel />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Settings2 className="h-4 w-4" /> Body Part Enable
              </CardTitle>
              <CardDescription>Disable unwired groups — sends E,mask to firmware</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(SERVO_CONFIG.bodyPartGroups ?? {}).map(([key, gdef]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={`en-${key}`} className="text-sm">{gdef.label}</Label>
                  <Switch
                    id={`en-${key}`}
                    checked={enabledParts[key] ?? true}
                    onCheckedChange={(on) => togglePart(key, on)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Cpu className="h-4 w-4" /> Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p>MRL 1.1.1610 — head, neck, joint ranges</p>
              <p>VDB — arm/hand calibration (DS5160 + MG996R)</p>
              <p>User overrides — pin_overrides.json, calibration_overrides.json</p>
              <Badge variant="online" className="mt-2">{SERVO_CONFIG.servoCount} servos</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}