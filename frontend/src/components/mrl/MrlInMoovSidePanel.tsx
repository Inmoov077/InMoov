import { useState } from 'react';
import { Loader2, Mic, Play } from 'lucide-react';
import { toast } from 'sonner';
import { MrlPeerToggle } from '@/components/mrl/MrlPeerToggle';
import { MrlServoPanel } from '@/components/mrl/MrlServoPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ARM_SERVOS,
  HAND_SERVOS,
  HEAD_SERVOS,
  I01_PEERS,
  LEG_SERVOS,
  MRL_ASSET,
  TORSO_SERVOS,
  type InMoovPanel,
} from '@/lib/mrlInmoovConfig';
import * as mrl from '@/lib/mrlClient';
import { useMrlStore } from '@/store/mrlStore';

interface MrlInMoovSidePanelProps {
  panel: InMoovPanel;
  onOpenGestures?: () => void;
  onOpenRuntime?: () => void;
  onOpenLife?: () => void;
  onOpenPeers?: () => void;
}

export function MrlInMoovSidePanel({
  panel,
  onOpenGestures,
  onOpenRuntime,
  onOpenLife,
  onOpenPeers,
}: MrlInMoovSidePanelProps) {
  const execGesture = useMrlStore((s) => s.execGesture);
  const [utterance, setUtterance] = useState('');
  const [speakText, setSpeakText] = useState('');
  const [armSide, setArmSide] = useState<'left' | 'right'>('left');
  const [handSide, setHandSide] = useState<'left' | 'right'>('left');
  const [legSide, setLegSide] = useState<'left' | 'right'>('left');
  const [headServo, setHeadServo] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  const runGesture = async (name: string) => {
    setRunning(true);
    const ok = await execGesture(name);
    if (ok) toast.success(`i01.${name}()`);
    else toast.error(`Failed: ${name}`);
    setRunning(false);
  };

  const sendChat = async () => {
    if (!utterance.trim()) return;
    try {
      const res = await mrl.mrlCall('i01.chatBot', 'getResponse', utterance.trim());
      toast.success(res.ok ? 'Sent to chatBot' : (res.error ?? 'Failed'));
      setUtterance('');
    } catch {
      toast.error('chatBot error');
    }
  };

  if (panel === 'head' && headServo) {
    const s = HEAD_SERVOS.find((h) => h.key === headServo);
    if (s) {
      return (
        <div className="space-y-3">
          <Button variant="ghost" size="sm" onClick={() => setHeadServo(null)}>← Back to head map</Button>
          <MrlServoPanel service={s.service} label={s.label} />
        </div>
      );
    }
  }

  if (panel === 'arm') {
    const servos = ARM_SERVOS[armSide];
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button size="sm" variant={armSide === 'left' ? 'default' : 'outline'} onClick={() => setArmSide('left')}>Left arm</Button>
          <Button size="sm" variant={armSide === 'right' ? 'default' : 'outline'} onClick={() => setArmSide('right')}>Right arm</Button>
        </div>
        <MrlPeerToggle peerKey={armSide === 'left' ? 'leftArm' : 'rightArm'} label={`${armSide} arm`} icon={MRL_ASSET('InMoov2Arm.png')} started />
        {servos.map((s) => (
          <MrlServoPanel key={s.service} service={s.service} label={s.label} />
        ))}
      </div>
    );
  }

  switch (panel) {
    case 'brain':
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <img src={MRL_ASSET('Brain.png')} alt="" className="h-8" /> Chat Bot
            </CardTitle>
            <CardDescription>Native clone of InMoov2 brain panel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <MrlPeerToggle peerKey="chatBot" label="Chat Bot" icon={MRL_ASSET('Brain.png')} started />
            <div className="flex gap-2">
              <Input placeholder="Type utterance…" value={utterance} onChange={(e) => setUtterance(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && void sendChat()} />
              <Button onClick={() => void sendChat()}>Send</Button>
            </div>
            <Button variant="outline" size="sm" onClick={() => void mrl.mrlPythonExec("execScript('services/A_Chatbot.py')")}>First contact script</Button>
          </CardContent>
        </Card>
      );

    case 'mouth':
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mouth / Speech</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <MrlPeerToggle peerKey="mouth" label="Mouth" icon={MRL_ASSET('img/InMoov2/mouth_Activ.png')} />
            <MrlPeerToggle peerKey="htmlFilter" label="HTML Filter" started />
            <div className="space-y-2">
              <Label>Speak (speakBlocking)</Label>
              <Input value={speakText} onChange={(e) => setSpeakText(e.target.value)} placeholder="Text to speak…" />
              <Button onClick={() => speakText && void mrl.mrlSpeak(speakText)}><Mic className="mr-1 h-4 w-4" /> Speak</Button>
            </div>
            <MrlServoPanel service="i01.head.jaw" label="Jaw" />
            <MrlServoPanel service="i01.mouthControl" label="Mouth control" />
          </CardContent>
        </Card>
      );

    case 'head':
      return (
        <div className="space-y-3">
          <MrlPeerToggle peerKey="head" label="Head service" icon={MRL_ASSET('InMoov2Head.png')} started />
          <p className="text-sm text-muted-foreground">Select a servo (InMoov2HeadGui):</p>
          <div className="grid grid-cols-2 gap-2">
            {HEAD_SERVOS.map((s) => (
              <Button key={s.key} variant="outline" size="sm" onClick={() => setHeadServo(s.key)}>{s.label}</Button>
            ))}
          </div>
        </div>
      );

    case 'torso':
      return (
        <div className="space-y-3">
          <MrlPeerToggle peerKey="torso" label="Torso" icon={MRL_ASSET('InMoov2Torso.png')} started />
          {TORSO_SERVOS.map((s) => (
            <MrlServoPanel key={s.service} service={s.service} label={s.label} />
          ))}
        </div>
      );

    case 'hand': {
      const handServos = HAND_SERVOS[handSide];
      return (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button size="sm" variant={handSide === 'left' ? 'default' : 'outline'} onClick={() => setHandSide('left')}>
              Left hand
            </Button>
            <Button size="sm" variant={handSide === 'right' ? 'default' : 'outline'} onClick={() => setHandSide('right')}>
              Right hand
            </Button>
          </div>
          <MrlPeerToggle
            peerKey={handSide === 'left' ? 'leftHand' : 'rightHand'}
            label={`${handSide} hand`}
            icon={MRL_ASSET('InMoov2Hand.png')}
            started
          />
          <div className="flex flex-wrap gap-1.5">
            <Button size="sm" variant="outline" disabled={running} onClick={() => void runGesture('handopen')}>
              handopen()
            </Button>
            <Button size="sm" variant="outline" disabled={running} onClick={() => void runGesture('handclose')}>
              handclose()
            </Button>
            <Button size="sm" variant="outline" disabled={running} onClick={() => void runGesture('openlefthand')}>
              open left
            </Button>
            <Button size="sm" variant="outline" disabled={running} onClick={() => void runGesture('openrighthand')}>
              open right
            </Button>
          </div>
          {handServos.map((s) => (
            <MrlServoPanel key={s.service} service={s.service} label={s.label} />
          ))}
        </div>
      );
    }

    case 'ear':
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ear / Voice recognition</CardTitle>
            <CardDescription>MRL WebkitSpeech / offline voice path</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <MrlPeerToggle peerKey="ear" label="Ear (WebkitSpeech)" icon={MRL_ASSET('InMoov2Ear.png')} />
            <p className="text-xs text-muted-foreground">
              Full offline command map also lives under{' '}
              <strong>Voice</strong> in the app menu (163 commands).
            </p>
            <Button variant="outline" size="sm" asChild>
              <a href="/offline">Open Voice page →</a>
            </Button>
          </CardContent>
        </Card>
      );

    case 'leg': {
      const legServos = LEG_SERVOS[legSide];
      return (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button size="sm" variant={legSide === 'left' ? 'default' : 'outline'} onClick={() => setLegSide('left')}>
              Left leg
            </Button>
            <Button size="sm" variant={legSide === 'right' ? 'default' : 'outline'} onClick={() => setLegSide('right')}>
              Right leg
            </Button>
          </div>
          <MrlPeerToggle
            peerKey={legSide === 'left' ? 'leftLeg' : 'rightLeg'}
            label={`${legSide} leg`}
            started
          />
          {legServos.map((s) => (
            <MrlServoPanel key={s.service} service={s.service} label={s.label} />
          ))}
        </div>
      );
    }

    case 'sensor':
    case 'extra':
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{I01_PEERS[panel]?.label ?? panel}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <MrlPeerToggle
              peerKey={I01_PEERS[panel]?.peerKey ?? 'opencv'}
              label={I01_PEERS[panel]?.label ?? panel}
              icon={I01_PEERS[panel]?.icon}
            />
            {panel === 'sensor' && (
              <>
                <MrlPeerToggle peerKey="pir" label="PIR" />
                <MrlPeerToggle peerKey="ultrasonicLeft" label="Ultrasonic L" />
                <MrlPeerToggle peerKey="ultrasonicRight" label="Ultrasonic R" />
                <MrlPeerToggle peerKey="realsensePresence" label="RealSense D455" />
                <Button variant="outline" size="sm" onClick={() => void mrl.mrlCall('i01.opencv', 'capture')}>
                  Start OpenCV capture
                </Button>
              </>
            )}
            {panel === 'extra' && (
              <>
                <MrlPeerToggle peerKey="leap" label="Leap / Extra" />
                <MrlPeerToggle peerKey="neoPixel" label="NeoPixel" />
                <MrlPeerToggle peerKey="servoMixer" label="Servo Mixer" />
                <MrlPeerToggle peerKey="imageDisplay" label="Image Display" />
              </>
            )}
          </CardContent>
        </Card>
      );

    case 'gestures':
    case 'runtime':
      return (
        <Card>
          <CardContent className="py-8 text-center">
            <Button onClick={panel === 'runtime' ? onOpenRuntime : onOpenGestures}>Open {panel} tab →</Button>
          </CardContent>
        </Card>
      );

    default:
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">InMoov2 Control</CardTitle>
            <CardDescription>
              Full native clone of MyRobotLab InMoov2 home — click the body map, or use tools below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {['Yes', 'No', 'relax', 'hello', 'presentation'].map((g) => (
                <Button key={g} size="sm" variant="outline" disabled={running} onClick={() => void runGesture(g)}>
                  {running ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
                  {g}
                </Button>
              ))}
              <Button
                size="sm"
                variant="outline"
                disabled={running}
                onClick={() => void mrl.mrlRestAll().then((r) => r.ok && toast.success('rest()'))}
              >
                rest
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={running}
                onClick={() =>
                  void mrl.mrlLifeAction('power_up').then((r) =>
                    r.ok ? toast.success('power_up') : toast.error(r.error ?? 'failed'),
                  )
                }
              >
                power_up
              </Button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button variant="outline" className="w-full" onClick={onOpenGestures}>
                All gestures →
              </Button>
              <Button variant="outline" className="w-full" onClick={onOpenRuntime}>
                Runtime →
              </Button>
              <Button variant="outline" className="w-full" onClick={onOpenLife}>
                Life (sleep / random) →
              </Button>
              <Button variant="outline" className="w-full" onClick={onOpenPeers}>
                All peers →
              </Button>
            </div>
            <MrlPeerToggle peerKey="fsm" label="Finite state machine" />
            <MrlPeerToggle peerKey="random" label="Random motion" />
            <MrlPeerToggle peerKey="chatBot" label="Chat Bot / Brain" started />
          </CardContent>
        </Card>
      );
  }
}