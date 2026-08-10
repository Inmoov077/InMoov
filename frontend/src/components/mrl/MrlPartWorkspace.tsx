import { useMemo, useState } from 'react';
import { Loader2, Play } from 'lucide-react';
import { toast } from 'sonner';
import { MrlDragServo } from '@/components/mrl/MrlDragServo';
import { MrlPeerToggle } from '@/components/mrl/MrlPeerToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { cn } from '@/lib/utils';

interface MrlPartWorkspaceProps {
  panel: InMoovPanel;
  onOpenGestures?: () => void;
  onOpenRuntime?: () => void;
  onOpenLife?: () => void;
  onOpenPeers?: () => void;
}

type Side = 'left' | 'right';

function ServoGroup({
  title,
  services,
  accent,
}: {
  title: string;
  services: readonly { service: string; label: string }[];
  accent?: 'copper' | 'signal' | 'phosphor' | 'violet';
}) {
  return (
    <div className="mrl-part-group">
      <div className="mrl-part-group-title">{title}</div>
      <div className="mrl-part-servo-list">
        {services.map((s) => (
          <MrlDragServo key={s.service} service={s.service} label={s.label} accent={accent} />
        ))}
      </div>
    </div>
  );
}

/**
 * Right-hand InMoov2 detail panel — part selection drives drag-servo workspace.
 * Dense MRL-like layout: peer toggles + live drag sliders.
 */
export function MrlPartWorkspace({
  panel,
  onOpenGestures,
  onOpenRuntime,
  onOpenLife,
  onOpenPeers,
}: MrlPartWorkspaceProps) {
  const execGesture = useMrlStore((s) => s.execGesture);
  const [armSide, setArmSide] = useState<Side>('left');
  const [handSide, setHandSide] = useState<Side>('left');
  const [legSide, setLegSide] = useState<Side>('left');
  const [utterance, setUtterance] = useState('');
  const [speakText, setSpeakText] = useState('');
  const [running, setRunning] = useState(false);

  const runGesture = async (name: string) => {
    setRunning(true);
    const ok = await execGesture(name);
    if (ok) toast.success(`i01.${name}()`);
    else toast.error(`Failed: ${name}`);
    setRunning(false);
  };

  const title = useMemo(() => {
    const map: Partial<Record<InMoovPanel, string>> = {
      InMoov: 'InMoov2 Home',
      brain: 'Brain / ChatBot',
      mouth: 'Mouth / Speech',
      head: 'Head',
      torso: 'Torso',
      arm: 'Arms',
      hand: 'Hands',
      leg: 'Legs',
      ear: 'Ear / Voice',
      sensor: 'Sensors',
      extra: 'Extra',
      gestures: 'Gestures',
      runtime: 'Runtime',
    };
    return map[panel] ?? panel;
  }, [panel]);

  const SideToggle = ({
    side,
    setSide,
    leftLabel,
    rightLabel,
  }: {
    side: Side;
    setSide: (s: Side) => void;
    leftLabel: string;
    rightLabel: string;
  }) => (
    <div className="mrl-side-toggle">
      <button type="button" className={cn(side === 'left' && 'is-on')} onClick={() => setSide('left')}>
        {leftLabel}
      </button>
      <button type="button" className={cn(side === 'right' && 'is-on')} onClick={() => setSide('right')}>
        {rightLabel}
      </button>
    </div>
  );

  return (
    <div className="mrl-part-workspace">
      <header className="mrl-part-header">
        <div>
          <h2 className="mrl-part-title">{title}</h2>
          <p className="mrl-part-sub">Drag sliders · live serial · MRL limits</p>
        </div>
        <Badge variant="copper">{panel}</Badge>
      </header>

      {panel === 'head' && (
        <>
          <MrlPeerToggle peerKey="head" label="Head peer" icon={MRL_ASSET('InMoov2Head.png')} started />
          <ServoGroup title="Head servos — drag to move" services={HEAD_SERVOS} accent="signal" />
        </>
      )}

      {panel === 'arm' && (
        <>
          <SideToggle side={armSide} setSide={setArmSide} leftLabel="Left arm" rightLabel="Right arm" />
          <MrlPeerToggle
            peerKey={armSide === 'left' ? 'leftArm' : 'rightArm'}
            label={`${armSide} arm`}
            icon={MRL_ASSET('InMoov2Arm.png')}
            started
          />
          <ServoGroup
            title={`${armSide} arm — shoulder · omoplate · rotate · bicep`}
            services={ARM_SERVOS[armSide]}
            accent={armSide === 'left' ? 'signal' : 'copper'}
          />
          <div className="flex flex-wrap gap-1.5">
            {['raiserightarm', 'raiseleftarm', 'armsFront', 'armsUp', 'relax'].map((g) => (
              <Button key={g} size="sm" variant="outline" className="h-7 text-xs" disabled={running} onClick={() => void runGesture(g)}>
                {g}
              </Button>
            ))}
          </div>
        </>
      )}

      {panel === 'hand' && (
        <>
          <SideToggle side={handSide} setSide={setHandSide} leftLabel="Left hand" rightLabel="Right hand" />
          <MrlPeerToggle
            peerKey={handSide === 'left' ? 'leftHand' : 'rightHand'}
            label={`${handSide} hand`}
            icon={MRL_ASSET('InMoov2Hand.png')}
            started
          />
          <div className="flex flex-wrap gap-1.5">
            {['handopen', 'handclose', 'openlefthand', 'openrighthand', 'victory'].map((g) => (
              <Button key={g} size="sm" variant="outline" className="h-7 text-xs" disabled={running} onClick={() => void runGesture(g)}>
                {g}
              </Button>
            ))}
          </div>
          <ServoGroup
            title={`${handSide} fingers + wrist — drag`}
            services={HAND_SERVOS[handSide]}
            accent={handSide === 'left' ? 'phosphor' : 'violet'}
          />
        </>
      )}

      {panel === 'leg' && (
        <>
          <SideToggle side={legSide} setSide={setLegSide} leftLabel="Left leg" rightLabel="Right leg" />
          <MrlPeerToggle peerKey={legSide === 'left' ? 'leftLeg' : 'rightLeg'} label={`${legSide} leg`} started />
          <ServoGroup
            title={`${legSide} leg — drag`}
            services={LEG_SERVOS[legSide]}
            accent={legSide === 'left' ? 'signal' : 'copper'}
          />
        </>
      )}

      {panel === 'torso' && (
        <>
          <MrlPeerToggle peerKey="torso" label="Torso" icon={MRL_ASSET('InMoov2Torso.png')} started />
          <ServoGroup title="Torso stom — drag" services={TORSO_SERVOS} accent="copper" />
        </>
      )}

      {panel === 'mouth' && (
        <>
          <MrlPeerToggle peerKey="mouth" label="Mouth" icon={MRL_ASSET('img/InMoov2/mouth_Activ.png')} started />
          <MrlPeerToggle peerKey="htmlFilter" label="HTML Filter" started />
          <div className="flex gap-2">
            <Input
              value={speakText}
              onChange={(e) => setSpeakText(e.target.value)}
              placeholder="Speak text…"
              onKeyDown={(e) => e.key === 'Enter' && speakText && void mrl.mrlSpeak(speakText)}
            />
            <Button onClick={() => speakText && void mrl.mrlSpeak(speakText)}>Speak</Button>
          </div>
          <ServoGroup title="Jaw" services={[{ service: 'i01.head.jaw', label: 'jaw' }]} />
        </>
      )}

      {panel === 'brain' && (
        <>
          <MrlPeerToggle peerKey="chatBot" label="Chat Bot" icon={MRL_ASSET('Brain.png')} started />
          <div className="flex gap-2">
            <Input
              value={utterance}
              onChange={(e) => setUtterance(e.target.value)}
              placeholder="Type to chatBot…"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && utterance.trim()) {
                  void mrl.mrlCall('i01.chatBot', 'getResponse', utterance.trim()).then(() => {
                    toast.success('Sent');
                    setUtterance('');
                  });
                }
              }}
            />
            <Button
              onClick={() => {
                if (!utterance.trim()) return;
                void mrl.mrlCall('i01.chatBot', 'getResponse', utterance.trim()).then(() => {
                  toast.success('Sent');
                  setUtterance('');
                });
              }}
            >
              Send
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => void mrl.mrlPythonExec("execScript('services/A_Chatbot.py')")}>
            First contact script
          </Button>
        </>
      )}

      {panel === 'ear' && (
        <>
          <MrlPeerToggle peerKey="ear" label="Ear" icon={MRL_ASSET('InMoov2Ear.png')} />
          <p className="text-xs text-muted-foreground">Offline voice map is also under app → Voice.</p>
          <Button variant="outline" size="sm" asChild>
            <a href="/offline">Open Voice →</a>
          </Button>
        </>
      )}

      {panel === 'sensor' && (
        <>
          <MrlPeerToggle peerKey="opencv" label="OpenCV" icon={I01_PEERS.sensor?.icon} />
          <MrlPeerToggle peerKey="pir" label="PIR" />
          <MrlPeerToggle peerKey="ultrasonicLeft" label="Ultrasonic L" />
          <MrlPeerToggle peerKey="ultrasonicRight" label="Ultrasonic R" />
          <MrlPeerToggle peerKey="realsensePresence" label="RealSense D455" />
          <Button variant="outline" size="sm" onClick={() => void mrl.mrlCall('i01.opencv', 'capture')}>
            Capture
          </Button>
        </>
      )}

      {panel === 'extra' && (
        <>
          <MrlPeerToggle peerKey="leap" label="Leap / Extra" />
          <MrlPeerToggle peerKey="neoPixel" label="NeoPixel" />
          <MrlPeerToggle peerKey="servoMixer" label="Servo Mixer" />
          <MrlPeerToggle peerKey="imageDisplay" label="Image Display" />
          <MrlPeerToggle peerKey="llm" label="LLM" />
        </>
      )}

      {(panel === 'InMoov' || panel === 'settings') && (
        <>
          <p className="text-sm text-muted-foreground">
            Select a body part on the map (head, arm, hand, leg…) then <strong>drag</strong> each servo.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['Yes', 'No', 'relax', 'hello', 'presentation', 'shakehand'].map((g) => (
              <Button key={g} size="sm" variant="outline" className="h-7 text-xs" disabled={running} onClick={() => void runGesture(g)}>
                {running ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
                {g}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={onOpenGestures}>
              Gestures →
            </Button>
            <Button variant="outline" onClick={onOpenLife}>
              Life →
            </Button>
            <Button variant="outline" onClick={onOpenPeers}>
              Peers →
            </Button>
            <Button variant="outline" onClick={onOpenRuntime}>
              Runtime →
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => void mrl.mrlLifeAction('power_up').then((r) => r.ok && toast.success('power_up'))}>
              power_up
            </Button>
            <Button size="sm" variant="secondary" onClick={() => void mrl.mrlRestAll().then((r) => r.ok && toast.success('rest'))}>
              rest
            </Button>
            <Button size="sm" variant="secondary" onClick={() => void mrl.mrlStopAll().then((r) => r.ok && toast.success('stop'))}>
              stop
            </Button>
          </div>
        </>
      )}

      {(panel === 'gestures' || panel === 'runtime') && (
        <Button className="w-full" onClick={panel === 'runtime' ? onOpenRuntime : onOpenGestures}>
          Open {panel} tab →
        </Button>
      )}
    </div>
  );
}
