import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Camera,
  CameraOff,
  Download,
  Eye,
  Hand,
  ScanFace,
  Settings2,
  Target,
} from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { CameraTracker } from '@/lib/cameraTracking';
import { VISION_COMMANDS } from '@/lib/visionCommands';
import { PRESETS } from '@/lib/presets';
import { animateKeyframes } from '@/lib/animateKeyframes';
import { speakText } from '@/lib/speech';
import { useServoStore } from '@/store/servoStore';
import { cn } from '@/lib/utils';

const DEFAULT_GREETINGS = [
  'Hello there! I see you.',
  'Hi! Nice to meet you.',
  'Greetings, human friend!',
];

export function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackerRef = useRef<CameraTracker | null>(null);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [faceOk, setFaceOk] = useState(false);
  const [handOk, setHandOk] = useState(false);
  const [invertEye, setInvertEye] = useState(true);
  const [invertNeck, setInvertNeck] = useState(false);
  const [faceFollow, setFaceFollow] = useState(true);
  const [handGreet, setHandGreet] = useState(true);
  const [greetings, setGreetings] = useState(DEFAULT_GREETINGS.join('\n'));
  const [runningCmd, setRunningCmd] = useState<string | null>(null);

  const hneck = useServoStore((s) => s.hneck);
  const eye = useServoStore((s) => s.eye);
  const setHead = useServoStore((s) => s.setHead);

  const getGreetingPhrases = useCallback(
    () => greetings.split('\n').map((l) => l.trim()).filter(Boolean),
    [greetings],
  );

  const runVisionCommand = async (presetId: string, cmdId: string) => {
    const kf = PRESETS[presetId];
    if (!kf) {
      toast.error('Preset not found', { description: presetId });
      return;
    }
    setRunningCmd(cmdId);
    try {
      await animateKeyframes(kf);
    } finally {
      setRunningCmd(null);
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const tracker = trackerRef.current;
    if (!video || !tracker?.isActive()) {
      toast.error('Turn on camera first');
      return;
    }
    const data = tracker.captureFrame(video);
    if (!data) return;
    const a = document.createElement('a');
    a.href = data;
    a.download = `inmoov-photo-${Date.now()}.jpg`;
    a.click();
    toast.success('Photo saved', { description: 'MRL takePicture equivalent' });
  };

  const startCamera = async () => {
    const video = videoRef.current;
    if (!video) return;
    setLoading(true);
    try {
      if (!trackerRef.current) {
        trackerRef.current = new CameraTracker();
      }
      const tracker = trackerRef.current;
      tracker.setServoReaders(
        () => useServoStore.getState().hneck,
        () => useServoStore.getState().eye,
      );
      tracker.setCallbacks({
        onFaceDetected: (d) => setFaceOk(d),
        onHandDetected: (d) => setHandOk(d),
        onGaze: (targetEye, targetHneck) => {
          setHead('eye', targetEye, true);
          if (Math.abs(targetHneck - useServoStore.getState().hneck) >= 2) {
            setHead('hneck', targetHneck, true);
          }
        },
        onOpenHand: () => {
          if (!handGreet) return;
          const phrases = getGreetingPhrases();
          const phrase = phrases[Math.floor(Math.random() * phrases.length)] ?? phrases[0];
          void animateKeyframes(PRESETS['happy-greet'] ?? []);
          setTimeout(() => speakText(phrase), 800);
          toast.success('Open hand detected', { description: phrase });
        },
      });
      tracker.setGazeOptions({ invertEye, invertNeck, faceFollowEnabled: faceFollow });
      await tracker.start(video);
      setActive(true);
      toast.success('Camera tracking active');
    } catch (err) {
      toast.error('Camera failed', {
        description: err instanceof Error ? err.message : 'Check webcam permissions',
      });
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = async () => {
    const video = videoRef.current;
    const tracker = trackerRef.current;
    if (video && tracker) await tracker.stop(video);
    setActive(false);
    setFaceOk(false);
    setHandOk(false);
    toast.info('Camera stopped');
  };

  useEffect(() => {
    trackerRef.current?.setGazeOptions({ invertEye, invertNeck, faceFollowEnabled: faceFollow });
  }, [invertEye, invertNeck, faceFollow]);

  useEffect(() => {
    return () => {
      const video = videoRef.current;
      const tracker = trackerRef.current;
      if (video && tracker?.isActive()) void tracker.stop(video);
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vision & tracking"
        description="MediaPipe face follow, hand greeting, and MyRobotLab vision gestures — all in your browser."
        actions={
          <div className="flex flex-wrap gap-2">
            {!active ? (
              <Button onClick={startCamera} disabled={loading}>
                <Camera className="h-4 w-4" />
                {loading ? 'Starting…' : 'Enable camera'}
              </Button>
            ) : (
              <Button variant="destructive" onClick={stopCamera}>
                <CameraOff className="h-4 w-4" />
                Disable camera
              </Button>
            )}
            <Button variant="outline" onClick={takePhoto} disabled={!active}>
              <Download className="h-4 w-4" />
              Take photo
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScanFace className="h-4 w-4 text-accent" />
              Live feed
            </CardTitle>
            <CardDescription>
              Face box (green) and hand skeleton (pink). Neck follows your face when tracking is on.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="camera-feed-wrap">
              {!active && (
                <div className="camera-placeholder">
                  <Eye className="h-10 w-10 text-primary/60" />
                  <p className="text-sm font-medium text-muted-foreground">Camera off</p>
                  <p className="text-xs text-muted-foreground">Click Enable camera to start MediaPipe tracking</p>
                </div>
              )}
              <video
                ref={videoRef}
                className={cn('camera-video', active && 'active')}
                autoPlay
                playsInline
                muted
              />
              <canvas className={cn('camera-overlay', active && 'active')} width={640} height={480} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant={faceOk ? 'online' : 'offline'}>
                Face: {faceOk ? 'detected' : 'not detected'}
              </Badge>
              <Badge variant={handOk ? 'online' : 'offline'}>
                Hand: {handOk ? 'detected' : 'not detected'}
              </Badge>
              <Badge variant="signal">
                Eye {eye}° · Head {hneck}°
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Tracking settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="face-follow">Auto face follow</Label>
              <Switch id="face-follow" checked={faceFollow} onCheckedChange={setFaceFollow} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="hand-greet">Open-hand greeting</Label>
              <Switch id="hand-greet" checked={handGreet} onCheckedChange={setHandGreet} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="invert-eye">Invert eye axis</Label>
              <Switch id="invert-eye" checked={invertEye} onCheckedChange={setInvertEye} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="invert-neck">Invert neck pan</Label>
              <Switch id="invert-neck" checked={invertNeck} onCheckedChange={setInvertNeck} />
            </div>
            <div className="space-y-2">
              <Label>Greeting phrases (one per line)</Label>
              <textarea
                rows={4}
                value={greetings}
                onChange={(e) => setGreetings(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            MRL vision commands
          </CardTitle>
          <CardDescription>
            Official MyRobotLab 1.1.1610 look &amp; gesture triggers (replaces i01.opencv / trackHumans in browser mode)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {VISION_COMMANDS.map((cmd) => (
              <Button
                key={cmd.id}
                variant="outline"
                className="h-auto flex-col items-start gap-1 px-4 py-3 text-left"
                disabled={!!runningCmd}
                onClick={() => runVisionCommand(cmd.presetId, cmd.id)}
              >
                <span className="font-semibold">{cmd.label}</span>
                <span className="text-xs text-muted-foreground">{cmd.desc}</span>
                {runningCmd === cmd.id && (
                  <Badge variant="copper" className="mt-1">
                    Playing…
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Face tracking</CardTitle>
            <CardDescription>Same EMA-smoothed gaze logic as legacy dashboard + MRL headTracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• MediaPipe Face Detection (short model)</p>
            <p>• Maps face X → eye + head neck servos</p>
            <p>• Rate-limited to 120ms for smooth motion</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hand className="h-4 w-4" />
              Hand gestures
            </CardTitle>
            <CardDescription>Open palm triggers happy-greet + TTS</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• MediaPipe Hands 21-point skeleton</p>
            <p>• Open-hand detection → preset + speech</p>
            <p>• 6s cooldown between greetings</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}