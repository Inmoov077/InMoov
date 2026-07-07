import { Link } from 'react-router-dom';
import {
  Brain,
  Camera,
  Footprints,
  Gamepad2,
  Mic,
  Radio,
  Rocket,
  ScanFace,
  Workflow,
  Zap,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VISION_COMMANDS } from '@/lib/visionCommands';
import { PRESETS, PRESET_META } from '@/lib/presets';
import { animateKeyframes } from '@/lib/animateKeyframes';
import { playMoodExpression } from '@/lib/moodExpressions';

const SECTIONS = [
  {
    title: 'MRL Live (localhost:8888)',
    desc: 'Full native MyRobotLab clone — InMoov2 body map, servos, 136 gestures, OpenCV, runtime, Python. No iframe.',
    icon: Radio,
    to: '/mrl-live',
    badge: 'native clone',
  },
  {
    title: 'Vision & camera',
    desc: 'MediaPipe face follow, hand greeting, photo capture — replaces MRL OpenCV/i01.headTracking in browser.',
    icon: Camera,
    to: '/camera',
    badge: 'D_OpenCv.py',
  },
  {
    title: 'Gestures & moves',
    desc: '136 MyRobotLab 1.1.1610 InMoov2 gestures + 16 built-in animations.',
    icon: Rocket,
    to: '/presets',
    badge: '227 gesture scripts',
  },
  {
    title: 'Voice & AIML',
    desc: '163 offline voice commands from MRL ProgramAB + knowledge RAG fallback.',
    icon: Mic,
    to: '/offline',
    badge: '_inmoovGestures.aiml',
  },
  {
    title: 'AI conversation',
    desc: 'Gemini / Ollama with mood motion, TTS jaw sync, and vision camera.',
    icon: Brain,
    to: '/ai',
    badge: 'L_Llm.py',
  },
  {
    title: 'Full body control',
    desc: '36-axis arms, hands, legs with official URDF 3D preview.',
    icon: Footprints,
    to: '/body',
    badge: 'inmoov_ros URDF',
  },
  {
    title: 'Control deck',
    desc: 'All servos, 3D robot viewer, live serial sync.',
    icon: Gamepad2,
    to: '/control',
    badge: 'i01 servos',
  },
];

const LIFE_PRESETS = [
  { id: 'idle-breathe', label: 'Idle breathe', mrl: 'MoveRandomize' },
  { id: 'mrl-relax', label: 'Relax / rest', mrl: 'rest.py' },
  { id: 'scan-room', label: 'Scan room', mrl: 'lookaroundyou' },
  { id: 'mrl-presentation', label: 'Presentation', mrl: 'presentation.py' },
];

const MOODS = ['happy', 'sad', 'thinking', 'surprised', 'normal'] as const;

export function MrlHubPage() {
  const mrlCount = PRESET_META.filter((p) => p.category !== 'builtin').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="MyRobotLab hub"
        description="Everything from myrobotlab-1.1.1610 + MyRobotLab/inmoov_ros — integrated into your control deck."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((s) => (
          <Card key={s.to} className="surface-hover">
            <CardHeader>
              <div className="flex items-start justify-between">
                <s.icon className="h-8 w-8 text-primary" />
                <Badge variant="copper">{s.badge}</Badge>
              </div>
              <CardTitle className="mt-3">{s.title}</CardTitle>
              <CardDescription>{s.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to={s.to}>Open</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScanFace className="h-4 w-4" />
              Quick vision (MRL)
            </CardTitle>
            <CardDescription>One-click MRL look &amp; social gestures</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {VISION_COMMANDS.slice(0, 8).map((cmd) => (
              <Button
                key={cmd.id}
                variant="outline"
                size="sm"
                onClick={() => {
                  const kf = PRESETS[cmd.presetId];
                  if (kf) void animateKeyframes(kf);
                }}
              >
                {cmd.label}
              </Button>
            ))}
            <Button variant="ghost" size="sm" asChild>
              <Link to="/camera">All vision →</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="h-4 w-4" />
              Life &amp; expressions
            </CardTitle>
            <CardDescription>MRL life scripts + faceExpression moods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {LIFE_PRESETS.map((p) => (
                <Button
                  key={p.id}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const kf = PRESETS[p.id];
                    if (kf) void animateKeyframes(kf);
                  }}
                >
                  {p.label}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <Button key={m} variant="ghost" size="sm" onClick={() => playMoodExpression(m)}>
                  {m}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent" />
            Integration summary
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
          <p><strong className="text-foreground">{mrlCount}</strong> MRL gestures playable</p>
          <p><strong className="text-foreground">163</strong> voice commands</p>
          <p><strong className="text-foreground">36</strong> servo axes</p>
          <p><strong className="text-foreground">URDF</strong> full-body 3D model</p>
          <p>Joint map from <code>config.yaml</code></p>
          <p>Meshes from <code>inmoov_ros</code></p>
          <p>Face track via MediaPipe</p>
          <p>Regenerate: <code>extract_mrl_inmoov.py</code></p>
        </CardContent>
      </Card>
    </div>
  );
}