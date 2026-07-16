import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Camera,
  CameraOff,
  Download,
  Eye,
  Hand,
  Radar,
  ScanFace,
  Settings2,
  Target,
  Power,
  PersonStanding,
  Waves,
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
import {
  realsenseDevices,
  realsenseStart,
  realsenseStatus,
  realsenseStop,
  realsenseWakeNow,
  type RealSenseStatus,
} from '@/lib/api';
import { useServoStore } from '@/store/servoStore';
import { cn } from '@/lib/utils';

const DEFAULT_GREETINGS = [
  'Hello there! I see you.',
  'Hi! Nice to meet you.',
  'Greetings, human friend!',
];

const DEFAULT_D455_GREET = 'Hello, how are you?';

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

  // ── RealSense D455 presence ──
  const [rsStatus, setRsStatus] = useState<RealSenseStatus>({});
  const [rsLoading, setRsLoading] = useState(false);
  const [rsDevices, setRsDevices] = useState<Array<{ name?: string; serial?: string; usb?: string }>>([]);
  const [rsGreet, setRsGreet] = useState(DEFAULT_D455_GREET);
  const [rsSeconds, setRsSeconds] = useState(5);
  const [rsStreamKey, setRsStreamKey] = useState(0);
  const [streamKind, setStreamKind] = useState<'color' | 'depth'>('color');

  const hneck = useServoStore((s) => s.hneck);
  const eye = useServoStore((s) => s.eye);
  const setHead = useServoStore((s) => s.setHead);
  const connected = useServoStore((s) => s.connected);

  const getGreetingPhrases = useCallback(
    () => greetings.split('\n').map((l) => l.trim()).filter(Boolean),
    [greetings],
  );

  // Poll D455 status while running
  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const st = await realsenseStatus();
        if (!cancelled) setRsStatus(st);
      } catch {
        /* ignore */
      }
    };
    void tick();
    const id = window.setInterval(tick, 800);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    void realsenseDevices()
      .then((d) => setRsDevices(d.devices || []))
      .catch(() => setRsDevices([]));
  }, []);

  const startD455 = async () => {
    setRsLoading(true);
    try {
      const res = await realsenseStart({
        presence_seconds: rsSeconds,
        greet_text: rsGreet,
        enable_motors_on_wake: true,
        min_distance_m: 0.45,
        max_distance_m: 2.2,
      });
      if (!res.ok) {
        toast.error('D455 failed to start', { description: res.error || 'Check USB connection' });
        return;
      }
      setRsStatus(res);
      setRsStreamKey((k) => k + 1);
      toast.success('D455 presence guard ON', {
        description: `Stand in front for ${rsSeconds}s → motors wake + "${rsGreet}"`,
      });
    } catch (err) {
      toast.error('D455 start error', {
        description: err instanceof Error ? err.message : 'Unknown error',
      });
    } finally {
      setRsLoading(false);
    }
  };

  const stopD455 = async () => {
    setRsLoading(true);
    try {
      const res = await realsenseStop();
      setRsStatus(res);
      toast.info('D455 presence guard stopped');
    } finally {
      setRsLoading(false);
    }
  };

  const testWake = async () => {
    try {
      await realsenseWakeNow(rsGreet);
      toast.success('Wake test sent', {
        description: connected
          ? 'Motors enabled + speaking greeting'
          : 'Speaking greeting (serial not connected — motors skipped)',
      });
    } catch (err) {
      toast.error('Wake test failed', {
        description: err instanceof Error ? err.message : 'Error',
      });
    }
  };

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

  const progressPct = Math.round((rsStatus.progress ?? 0) * 100);
  const d455Online = !!rsStatus.running && !!rsStatus.device_connected;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vision & tracking"
        description="Chest-mounted Intel RealSense D455 presence wake + browser MediaPipe face/hand tracking."
        actions={
          <div className="flex flex-wrap gap-2">
            {!rsStatus.running ? (
              <Button onClick={startD455} disabled={rsLoading}>
                <Radar className="h-4 w-4" />
                {rsLoading ? 'Starting D455…' : 'Start D455 guard'}
              </Button>
            ) : (
              <Button variant="destructive" onClick={stopD455} disabled={rsLoading}>
                <Power className="h-4 w-4" />
                Stop D455
              </Button>
            )}
            <Button variant="outline" onClick={testWake}>
              <Waves className="h-4 w-4" />
              Test wake + hello
            </Button>
          </div>
        }
      />

      {/* ── RealSense D455 presence guard ── */}
      <Card className="border-primary/30 bg-gradient-to-br from-card to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radar className="h-5 w-5 text-primary" />
            Intel RealSense D455 — chest mount
          </CardTitle>
          <CardDescription>
            When a person stands in front of the robot for <strong>{rsSeconds} seconds</strong>, the system
            enables all motors and speaks: <em>&quot;{rsGreet}&quot;</em>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-3">
              <div className="camera-feed-wrap min-h-[280px] bg-black/80">
                {rsStatus.running ? (
                  <img
                    key={`${rsStreamKey}-${streamKind}`}
                    src={`/api/realsense/stream?kind=${streamKind}&t=${rsStreamKey}`}
                    alt="RealSense D455 live feed"
                    className="camera-video active h-full w-full object-contain"
                  />
                ) : (
                  <div className="camera-placeholder">
                    <PersonStanding className="h-10 w-10 text-primary/60" />
                    <p className="text-sm font-medium text-muted-foreground">D455 presence guard off</p>
                    <p className="max-w-sm text-center text-xs text-muted-foreground">
                      Mount camera on chest (center hole). USB to PC. Start guard — stand 0.5–2.2 m in front for{' '}
                      {rsSeconds}s to wake the robot.
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={streamKind === 'color' ? 'default' : 'outline'}
                  onClick={() => setStreamKind('color')}
                  disabled={!rsStatus.running}
                >
                  Color
                </Button>
                <Button
                  size="sm"
                  variant={streamKind === 'depth' ? 'default' : 'outline'}
                  onClick={() => setStreamKind('depth')}
                  disabled={!rsStatus.running}
                >
                  Depth
                </Button>
                <Badge variant={d455Online ? 'online' : 'offline'}>
                  D455: {d455Online ? 'online' : 'offline'}
                </Badge>
                <Badge variant={rsStatus.person_present ? 'online' : 'offline'}>
                  Person: {rsStatus.person_present ? 'detected' : 'none'}
                </Badge>
                <Badge variant={rsStatus.awake ? 'copper' : 'signal'}>
                  System: {rsStatus.awake ? 'AWAKE' : 'idle'}
                </Badge>
                {rsStatus.median_distance_m != null && (
                  <Badge variant="signal">{rsStatus.median_distance_m.toFixed(2)} m</Badge>
                )}
                {rsStatus.usb_type && <Badge variant="outline">USB {rsStatus.usb_type}</Badge>}
              </div>

              {/* Presence progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    Presence timer: {(rsStatus.presence_seconds ?? 0).toFixed(1)}s /{' '}
                    {rsStatus.presence_required ?? rsSeconds}s
                  </span>
                  <span>{progressPct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-300',
                      rsStatus.person_present ? 'bg-emerald-500' : 'bg-muted-foreground/30',
                    )}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                {rsStatus.waiting_for_leave && (
                  <p className="text-xs text-amber-500">Waiting for person to leave before next greeting…</p>
                )}
                {rsStatus.last_greet_text && (
                  <p className="text-xs text-muted-foreground">
                    Last greet: &quot;{rsStatus.last_greet_text}&quot;
                  </p>
                )}
                {rsStatus.last_error && (
                  <p className="text-xs text-destructive">Error: {rsStatus.last_error}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rs-seconds">Presence time (seconds)</Label>
                <input
                  id="rs-seconds"
                  type="number"
                  min={1}
                  max={30}
                  step={0.5}
                  value={rsSeconds}
                  onChange={(e) => setRsSeconds(Number(e.target.value) || 5)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rs-greet">Wake greeting (spoken)</Label>
                <textarea
                  id="rs-greet"
                  rows={3}
                  value={rsGreet}
                  onChange={(e) => setRsGreet(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">How it works</p>
                <p>1. D455 on chest reads depth (0.45–2.2 m)</p>
                <p>2. Person fills center ROI for {rsSeconds}s</p>
                <p>3. Enable all motors (E,255) → rest pose</p>
                <p>4. Robot speaks: &quot;{rsGreet}&quot;</p>
                <p className="pt-1">
                  Arduino: {connected ? 'connected' : 'not connected'} — connect in Settings for real motors
                </p>
              </div>
              {rsDevices.length > 0 ? (
                <div className="rounded-lg border border-border p-3 text-xs space-y-1">
                  <p className="font-semibold">Detected devices</p>
                  {rsDevices.map((d) => (
                    <p key={d.serial || d.name}>
                      {d.name} · S/N {d.serial} · USB {d.usb || '?'}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No RealSense device listed yet (plug D455 USB).</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Browser webcam MediaPipe ── */}
      <div className="flex flex-wrap gap-2">
        {!active ? (
          <Button onClick={startCamera} disabled={loading} variant="outline">
            <Camera className="h-4 w-4" />
            {loading ? 'Starting…' : 'Enable browser webcam'}
          </Button>
        ) : (
          <Button variant="destructive" onClick={stopCamera}>
            <CameraOff className="h-4 w-4" />
            Disable webcam
          </Button>
        )}
        <Button variant="outline" onClick={takePhoto} disabled={!active}>
          <Download className="h-4 w-4" />
          Take photo
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScanFace className="h-4 w-4 text-accent" />
              Browser webcam (MediaPipe)
            </CardTitle>
            <CardDescription>
              Face box (green) and hand skeleton (pink). Optional — separate from chest D455.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="camera-feed-wrap">
              {!active && (
                <div className="camera-placeholder">
                  <Eye className="h-10 w-10 text-primary/60" />
                  <p className="text-sm font-medium text-muted-foreground">Webcam off</p>
                  <p className="text-xs text-muted-foreground">Enable for face-follow / open-hand greet</p>
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
            Official MyRobotLab 1.1.1610 look &amp; gesture triggers (browser mode)
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
            <CardTitle>D455 depth presence</CardTitle>
            <CardDescription>Chest-mounted depth camera on your InMoov torso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Intel RealSense D455 color + depth streams</p>
            <p>• Person zone: 0.45–2.2 m in center ROI</p>
            <p>• Continuous {rsSeconds}s → enable motors + TTS hello</p>
            <p>• Cooldown after greet; person must leave to re-trigger</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hand className="h-4 w-4" />
              Browser hand / face
            </CardTitle>
            <CardDescription>Optional laptop webcam MediaPipe layer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• MediaPipe Face Detection (short model)</p>
            <p>• Maps face X → eye + head neck servos</p>
            <p>• Open palm → happy-greet + speech</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
