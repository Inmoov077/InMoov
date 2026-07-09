import { Bone, Mic, RotateCcw, ScanFace, Volume2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ServoControl } from '@/components/servo/ServoControl';
import { Joystick } from '@/components/servo/Joystick';
import { SectionCard } from '@/components/ux/SectionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { servoByKey } from '@/lib/servoConfig';
import { useServoStore, type Axis } from '@/store/servoStore';

const NECK_AXES: {
  key: Axis;
  label: string;
  hint: string;
  pin: number;
  accent: 'copper' | 'signal' | 'violet';
}[] = [
  { key: 'rot', label: 'Spin', hint: 'Turn left / right', pin: servoByKey('neck_rot')?.pin ?? 6, accent: 'violet' },
  { key: 'tilt', label: 'Nod', hint: 'Forward / back', pin: servoByKey('neck_tilt')?.pin ?? 7, accent: 'copper' },
  { key: 'roll', label: 'Lean', hint: 'Side tilt', pin: servoByKey('neck_roll')?.pin ?? 8, accent: 'signal' },
];

export function HeadPanel() {
  const hneck = useServoStore((s) => s.hneck);
  const eye = useServoStore((s) => s.eye);
  const jaw = useServoStore((s) => s.jaw);
  const setHead = useServoStore((s) => s.setHead);
  const centerHead = useServoStore((s) => s.centerHead);

  const [ttsText, setTtsText] = useState('Hello! I am InMoov, your open-source humanoid companion.');
  const [speaking, setSpeaking] = useState(false);
  const jawAnimRef = useRef<number | null>(null);

  const stopJawAnim = useCallback(() => {
    if (jawAnimRef.current) {
      cancelAnimationFrame(jawAnimRef.current);
      jawAnimRef.current = null;
    }
    setHead('jaw', 8, true);
  }, [setHead]);

  const animateJawWhileSpeaking = useCallback(() => {
    const start = performance.now();
    const loop = (now: number) => {
      const t = (now - start) / 1000;
      const open = 8 + Math.abs(Math.sin(t * 12)) * 22;
      setHead('jaw', Math.round(open), false);
      jawAnimRef.current = requestAnimationFrame(loop);
    };
    jawAnimRef.current = requestAnimationFrame(loop);
  }, [setHead]);

  const speak = useCallback(() => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    stopJawAnim();
    const utterance = new SpeechSynthesisUtterance(ttsText);
    utterance.rate = 0.95;
    utterance.onstart = () => {
      setSpeaking(true);
      animateJawWhileSpeaking();
    };
    utterance.onend = () => {
      setSpeaking(false);
      stopJawAnim();
    };
    utterance.onerror = () => {
      setSpeaking(false);
      stopJawAnim();
    };
    window.speechSynthesis.speak(utterance);
  }, [ttsText, animateJawWhileSpeaking, stopJawAnim]);

  const stopSpeak = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    stopJawAnim();
  }, [stopJawAnim]);

  useEffect(() => () => stopJawAnim(), [stopJawAnim]);

  return (
    <div className="space-y-4">
      <SectionCard
        icon={ScanFace}
        title="Head"
        description="Pan, eyes, and jaw"
        action={
          <Button variant="outline" size="sm" onClick={() => centerHead()}>
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
        }
      >
        <div className="space-y-4">
          <ServoControl
            label="Turn head"
            hint="Left ↔ right"
            pin={servoByKey('head_neck')?.pin ?? 3}
            value={hneck}
            min={servoByKey('head_neck')?.min}
            max={servoByKey('head_neck')?.max}
            onChange={(v) => setHead('hneck', v)}
            presets={[0, 45, 85, 135, 180]}
            presetLabels={{ 85: 'Center' }}
            accent="copper"
          />
          <ServoControl
            label="Eyes"
            hint="Up ↔ down"
            pin={servoByKey('head_eye')?.pin ?? 4}
            value={eye}
            min={servoByKey('head_eye')?.min}
            max={servoByKey('head_eye')?.max}
            onChange={(v) => setHead('eye', v)}
            accent="signal"
          />
          <ServoControl
            label="Jaw"
            hint="Open mouth"
            pin={servoByKey('head_jaw')?.pin ?? 5}
            value={jaw}
            min={servoByKey('head_jaw')?.min ?? 0}
            max={servoByKey('head_jaw')?.max ?? 40}
            onChange={(v) => setHead('jaw', v)}
            presets={[0, 8, 20, 40]}
            presetLabels={{ 0: 'Closed', 8: 'Rest' }}
            accent="phosphor"
          />
        </div>
      </SectionCard>

      <SectionCard icon={Volume2} title="Speak" description="Browser TTS with jaw motion">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="tts">Text</Label>
            <Input id="tts" value={ttsText} onChange={(e) => setTtsText(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={speak} disabled={speaking}>
              <Mic className="h-4 w-4" /> Speak
            </Button>
            {speaking && (
              <Button size="sm" variant="outline" onClick={stopSpeak}>
                Stop
              </Button>
            )}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

export function NeckPanel() {
  const rot = useServoStore((s) => s.rot);
  const tilt = useServoStore((s) => s.tilt);
  const roll = useServoStore((s) => s.roll);
  const limits = useServoStore((s) => s.limits);
  const setNeck = useServoStore((s) => s.setNeck);
  const setMaster = useServoStore((s) => s.setMaster);
  const centerNeck = useServoStore((s) => s.centerNeck);

  return (
    <div className="space-y-4">
      <SectionCard
        icon={Bone}
        title="Neck"
        description="Spin, nod, lean — or use the pad"
        action={
          <Button variant="outline" size="sm" onClick={() => centerNeck()}>
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="surface-inset space-y-2">
            <div className="flex items-center justify-between">
              <Label>All neck motors</Label>
              <span className="font-mono text-sm font-bold text-primary">{rot}°</span>
            </div>
            <Slider
              accent="copper"
              min={limits.rot.min}
              max={limits.rot.max}
              value={[rot]}
              onValueChange={([v]) => setMaster(v)}
            />
          </div>
          {NECK_AXES.map((axis) => (
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
  );
}
