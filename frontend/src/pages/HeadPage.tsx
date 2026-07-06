import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, RotateCcw, Volume2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ServoControl } from '@/components/servo/ServoControl';
import { SectionCard } from '@/components/ux/SectionCard';
import { HelpTip } from '@/components/ux/HelpTip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useServoStore } from '@/store/servoStore';

export function HeadPage() {
  const hneck = useServoStore((s) => s.hneck);
  const eye = useServoStore((s) => s.eye);
  const jaw = useServoStore((s) => s.jaw);
  const setHead = useServoStore((s) => s.setHead);
  const centerHead = useServoStore((s) => s.centerHead);

  const [ttsText, setTtsText] = useState(
    'Hello! I am InMoov, your open-source humanoid companion.',
  );
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
    utterance.pitch = 1;
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
    <div className="space-y-6">
      <PageHeader
        title="Head"
        description="Control how the head turns, how the eyes look, and how the jaw opens."
        actions={
          <Button variant="outline" size="sm" onClick={() => centerHead()}>
            <RotateCcw className="h-4 w-4" />
            Reset head
          </Button>
        }
      />

      <HelpTip>Each slider controls one motor. 90° is usually the center position for head and eyes.</HelpTip>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard icon={Volume2} title="Head motors" description="Use sliders or tap a quick position button.">
          <div className="space-y-4">
            <ServoControl
              label="Turn head"
              hint="Pan the head left or right."
              pin={3}
              value={hneck}
              onChange={(v) => setHead('hneck', v)}
              presets={[0, 45, 85, 135, 180]}
              presetLabels={{ 85: 'Center' }}
              accent="copper"
            />
            <ServoControl
              label="Eyes"
              hint="Look up or down."
              pin={4}
              value={eye}
              onChange={(v) => setHead('eye', v)}
              accent="signal"
            />
            <ServoControl
              label="Jaw"
              hint="0° = closed, higher = more open."
              pin={5}
              value={jaw}
              min={0}
              max={40}
              onChange={(v) => setHead('jaw', v)}
              presets={[0, 8, 20, 30, 40]}
              presetLabels={{ 0: 'Closed', 8: 'Rest', 40: 'Open' }}
              accent="phosphor"
            />
          </div>
        </SectionCard>

        <SectionCard
          icon={Mic}
          title="Make it talk"
          description="Type a sentence and the jaw will move while the computer speaks it aloud."
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tts">What should InMoov say?</Label>
              <Input
                id="tts"
                value={ttsText}
                onChange={(e) => setTtsText(e.target.value)}
                placeholder="Type something for the robot to say…"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {!speaking ? (
                <Button onClick={speak}>
                  <Mic className="h-4 w-4" />
                  Speak now
                </Button>
              ) : (
                <Button variant="destructive" onClick={stopSpeak}>
                  Stop speaking
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() =>
                  setTtsText('Testing jaw sync with text to speech output.')
                }
              >
                Try sample text
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Works in Chrome and Edge. The jaw opens and closes automatically while speaking.
            </p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}