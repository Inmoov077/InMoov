import { Bone, Mic, RotateCcw, ScanFace } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ServoControl } from '@/components/servo/ServoControl';
import { Joystick } from '@/components/servo/Joystick';
import { SectionCard } from '@/components/ux/SectionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { servoByKey } from '@/lib/servoConfig';
import { usePinStore } from '@/store/pinStore';
import { useServoStore, type Axis } from '@/store/servoStore';

const NECK_AXES: {
  key: Axis;
  label: string;
  pin: number;
  accent: 'copper' | 'signal' | 'violet';
}[] = [
  { key: 'rot', label: 'Rotate', pin: servoByKey('neck_rot')?.pin ?? 6, accent: 'violet' },
  { key: 'tilt', label: 'Tilt', pin: servoByKey('neck_tilt')?.pin ?? 7, accent: 'copper' },
  { key: 'roll', label: 'Roll', pin: servoByKey('neck_roll')?.pin ?? 8, accent: 'signal' },
];

export function HeadPanel() {
  const pinMap = usePinStore((s) => s.pins);
  const hneck = useServoStore((s) => s.hneck);
  const eye = useServoStore((s) => s.eye);
  const jaw = useServoStore((s) => s.jaw);
  const setHead = useServoStore((s) => s.setHead);
  const centerHead = useServoStore((s) => s.centerHead);

  const [ttsText, setTtsText] = useState('Hello! I am InMoov.');
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
      setHead('jaw', Math.round(8 + Math.abs(Math.sin(t * 12)) * 22), false);
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
    <SectionCard
      icon={ScanFace}
      title="Head"
      description="Pitch · eyes · jaw"
      action={
        <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs" onClick={() => centerHead()}>
          <RotateCcw className="h-3.5 w-3.5" /> Rest head
        </Button>
      }
    >
      <div className="space-y-1.5">
        <ServoControl
          label="Head"
          pin={pinMap.head_neck ?? servoByKey('head_neck')?.pin ?? 3}
          value={hneck}
          min={servoByKey('head_neck')?.min}
          max={servoByKey('head_neck')?.max}
          onChange={(v) => setHead('hneck', v)}
          presets={[0, 45, 85, 135, 180]}
          presetLabels={{ 85: 'Rest' }}
          accent="copper"
          showPin
        />
        <ServoControl
          label="Eyes"
          pin={pinMap.head_eye ?? servoByKey('head_eye')?.pin ?? 4}
          value={eye}
          min={servoByKey('head_eye')?.min}
          max={servoByKey('head_eye')?.max}
          onChange={(v) => setHead('eye', v)}
          accent="signal"
          showPin
        />
        <ServoControl
          label="Jaw"
          pin={pinMap.head_jaw ?? servoByKey('head_jaw')?.pin ?? 5}
          value={jaw}
          min={servoByKey('head_jaw')?.min ?? 0}
          max={servoByKey('head_jaw')?.max ?? 40}
          onChange={(v) => setHead('jaw', v)}
          presets={[0, 8, 20, 40]}
          presetLabels={{ 0: 'Shut', 8: 'Rest' }}
          accent="phosphor"
          showPin
        />
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-border/40 bg-muted/20 p-2">
        <Input
          value={ttsText}
          onChange={(e) => setTtsText(e.target.value)}
          className="h-10 text-sm"
          placeholder="Type text to speak…"
        />
        <Button size="sm" className="h-10 shrink-0 px-3" onClick={speak} disabled={speaking}>
          <Mic className="h-4 w-4" /> Speak
        </Button>
        {speaking && (
          <Button size="sm" variant="outline" className="h-10 shrink-0 px-3" onClick={stopSpeak}>
            Stop
          </Button>
        )}
      </div>
    </SectionCard>
  );
}

export function NeckPanel() {
  const pinMap = usePinStore((s) => s.pins);
  const rot = useServoStore((s) => s.rot);
  const tilt = useServoStore((s) => s.tilt);
  const roll = useServoStore((s) => s.roll);
  const limits = useServoStore((s) => s.limits);
  const setNeck = useServoStore((s) => s.setNeck);
  const setMaster = useServoStore((s) => s.setMaster);
  const centerNeck = useServoStore((s) => s.centerNeck);

  return (
    <div className="space-y-2">
      <SectionCard
        icon={Bone}
        title="Neck"
        description="Rotate · tilt · roll"
        action={
          <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs" onClick={() => centerNeck()}>
            <RotateCcw className="h-3.5 w-3.5" /> Rest neck
          </Button>
        }
      >
        <div className="mb-2 flex items-center gap-2 rounded-xl border border-border/40 bg-muted/40 px-3 py-2">
          <Label className="shrink-0 text-xs font-semibold">Master</Label>
          <Slider
            accent="copper"
            min={limits.rot.min}
            max={limits.rot.max}
            value={[rot]}
            onValueChange={([v]) => setMaster(v)}
            className="flex-1"
          />
          <span className="w-10 text-right font-mono text-sm font-bold tabular-nums text-primary">
            {rot}°
          </span>
        </div>
        <div className="space-y-1.5">
          {NECK_AXES.map((axis) => {
            const pinKey =
              axis.key === 'rot' ? 'neck_rot' : axis.key === 'tilt' ? 'neck_tilt' : 'neck_roll';
            return (
            <ServoControl
              key={axis.key}
              label={axis.label}
              pin={pinMap[pinKey] ?? axis.pin}
              value={axis.key === 'rot' ? rot : axis.key === 'tilt' ? tilt : roll}
              min={limits[axis.key].min}
              max={limits[axis.key].max}
              onChange={(v) => setNeck(axis.key, v)}
              accent={axis.accent}
              showPin
            />
            );
          })}
        </div>
      </SectionCard>
      <Joystick compact />
    </div>
  );
}
