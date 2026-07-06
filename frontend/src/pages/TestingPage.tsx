import { useState } from 'react';
import { FlaskConical, Play, Send, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/PageHeader';
import { ServoControl } from '@/components/servo/ServoControl';
import { SerialConsole } from '@/components/servo/SerialConsole';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as api from '@/lib/api';
import { PRESETS, PRESET_META } from '@/lib/presets';
import { animateKeyframes } from '@/lib/animateKeyframes';
import { useServoStore } from '@/store/servoStore';
import { cn } from '@/lib/utils';

type Tab = 'servos' | 'hnc' | 'raw' | 'presets';

const TABS: { id: Tab; label: string }[] = [
  { id: 'servos', label: 'Motors' },
  { id: 'hnc', label: 'Head & neck codes' },
  { id: 'raw', label: 'Send raw command' },
  { id: 'presets', label: 'Test moves' },
];

export function TestingPage() {
  const [tab, setTab] = useState<Tab>('servos');
  const [rawCmd, setRawCmd] = useState('H,85,90,8');
  const [hValues, setHValues] = useState({ neck: 85, eye: 90, jaw: 8 });
  const [nValues, setNValues] = useState({ rot: 60, tilt: 50, roll: 120 });
  const [sending, setSending] = useState(false);

  const hneck = useServoStore((s) => s.hneck);
  const eye = useServoStore((s) => s.eye);
  const jaw = useServoStore((s) => s.jaw);
  const rot = useServoStore((s) => s.rot);
  const tilt = useServoStore((s) => s.tilt);
  const roll = useServoStore((s) => s.roll);
  const limits = useServoStore((s) => s.limits);
  const setHead = useServoStore((s) => s.setHead);
  const setNeck = useServoStore((s) => s.setNeck);
  const log = useServoStore((s) => s.log);

  const sendRaw = async () => {
    setSending(true);
    try {
      const res = await api.sendRawSerial(rawCmd);
      if (res.ok) {
        log('send', rawCmd);
        toast.success('Command sent');
      } else {
        toast.error(res.error ?? 'Send failed');
      }
    } catch {
      toast.error('Serial send failed');
    } finally {
      setSending(false);
    }
  };

  const sendH = async () => {
    setSending(true);
    const res = await api.sendHead(hValues.neck, hValues.eye, hValues.jaw);
    if (res.ok) log('send', `H,${hValues.neck},${hValues.eye},${hValues.jaw}`);
    setSending(false);
  };

  const sendN = async () => {
    setSending(true);
    const res = await api.sendNeck(nValues.rot, nValues.tilt, nValues.roll);
    if (res.ok) log('send', `N,${nValues.rot},${nValues.tilt},${nValues.roll}`);
    setSending(false);
  };

  const sendC = async () => {
    setSending(true);
    const res = await api.sendCombined6({
      headNeck: hValues.neck,
      headEye: hValues.eye,
      headJaw: hValues.jaw,
      neckRot: nValues.rot,
      neckTilt: nValues.tilt,
      neckRoll: nValues.roll,
    });
    if (res.ok) {
      log(
        'send',
        `C,${hValues.neck},${hValues.eye},${hValues.jaw},${nValues.rot},${nValues.tilt},${nValues.roll}`,
      );
    }
    setSending(false);
  };

  return (
    <div>
      <PageHeader
        title="Test mode"
        description="For advanced users — test one motor at a time or send custom commands to the board."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Button
            key={t.id}
            size="sm"
            variant={tab === t.id ? 'default' : 'outline'}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          {tab === 'servos' && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-accent" />
                  Individual Servo Test
                </CardTitle>
                <CardDescription>Move each axis independently with live store sync</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <ServoControl label="H-Neck" pin={3} value={hneck} onChange={(v) => setHead('hneck', v)} accent="copper" />
                <ServoControl label="Eye" pin={4} value={eye} onChange={(v) => setHead('eye', v)} />
                <ServoControl label="Jaw" pin={5} value={jaw} min={0} max={40} onChange={(v) => setHead('jaw', v)} accent="phosphor" />
                <ServoControl label="Rot" pin={6} value={rot} min={limits.rot.min} max={limits.rot.max} onChange={(v) => setNeck('rot', v)} accent="violet" />
                <ServoControl label="Tilt" pin={7} value={tilt} min={limits.tilt.min} max={limits.tilt.max} onChange={(v) => setNeck('tilt', v)} accent="copper" />
                <ServoControl label="Roll" pin={8} value={roll} min={limits.roll.min} max={limits.roll.max} onChange={(v) => setNeck('roll', v)} />
              </CardContent>
            </>
          )}

          {tab === 'hnc' && (
            <>
              <CardHeader>
                <CardTitle>H / N / C Command Test</CardTitle>
                <CardDescription>Send protocol packets directly to firmware</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3 panel-inset p-4">
                  <Label>H — Head (neck, eye, jaw)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['neck', 'eye', 'jaw'] as const).map((k) => (
                      <Input
                        key={k}
                        type="number"
                        value={hValues[k]}
                        onChange={(e) =>
                          setHValues((v) => ({ ...v, [k]: Number(e.target.value) }))
                        }
                        placeholder={k}
                      />
                    ))}
                  </div>
                  <Button size="sm" onClick={sendH} disabled={sending}>
                    <Send className="h-4 w-4" /> Send H
                  </Button>
                </div>
                <div className="space-y-3 panel-inset p-4">
                  <Label>N — Neck (rot, tilt, roll)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['rot', 'tilt', 'roll'] as const).map((k) => (
                      <Input
                        key={k}
                        type="number"
                        value={nValues[k]}
                        onChange={(e) =>
                          setNValues((v) => ({ ...v, [k]: Number(e.target.value) }))
                        }
                        placeholder={k}
                      />
                    ))}
                  </div>
                  <Button size="sm" onClick={sendN} disabled={sending}>
                    <Send className="h-4 w-4" /> Send N
                  </Button>
                </div>
                <Button onClick={sendC} disabled={sending}>
                  <Send className="h-4 w-4" /> Send Combined C (all 6)
                </Button>
              </CardContent>
            </>
          )}

          {tab === 'raw' && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-primary" />
                  Raw Serial
                </CardTitle>
                <CardDescription>Send arbitrary commands via api.sendRawSerial</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={rawCmd}
                  onChange={(e) => setRawCmd(e.target.value)}
                  className="font-mono"
                  placeholder="H,85,90,8"
                />
                <div className="flex flex-wrap gap-2">
                  <Button onClick={sendRaw} disabled={sending}>
                    <Send className="h-4 w-4" /> Transmit
                  </Button>
                  {['H,85,90,8', 'N,60,50,120', 'C,85,90,8,60,50,120'].map((preset) => (
                    <Button key={preset} variant="outline" size="sm" onClick={() => setRawCmd(preset)}>
                      {preset}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </>
          )}

          {tab === 'presets' && (
            <>
              <CardHeader>
                <CardTitle>Motion Preset Test</CardTitle>
                <CardDescription>Run choreography sequences from diagnostics</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {PRESET_META.map((p) => (
                  <Button
                    key={p.id}
                    variant="outline"
                    className="h-auto justify-start py-3"
                    onClick={() => PRESETS[p.id] && animateKeyframes(PRESETS[p.id])}
                  >
                    <span className="mr-2 text-lg">{p.icon}</span>
                    <div className="text-left">
                      <p className="font-display text-xs uppercase">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground">{p.desc}</p>
                    </div>
                    <Play className={cn('ml-auto h-4 w-4')} />
                  </Button>
                ))}
              </CardContent>
            </>
          )}
        </Card>

        <SerialConsole height="h-[480px]" />
      </div>
    </div>
  );
}