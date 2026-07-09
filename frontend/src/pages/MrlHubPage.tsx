import { Link } from 'react-router-dom';
import {
  Bone,
  Bot,
  Brain,
  Camera,
  Footprints,
  Gamepad2,
  Mic,
  Rocket,
  ScanFace,
  Settings,
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
    title: 'Control studio',
    desc: 'Sticky 3D preview + head, neck, body, USB — one page, no duplicates.',
    icon: Gamepad2,
    to: '/control',
    badge: '3D',
  },
  {
    title: 'Head',
    desc: 'Pan, eyes, jaw, speak — opens Control → Head.',
    icon: ScanFace,
    to: '/control?tab=head',
    badge: 'Control',
  },
  {
    title: 'Neck',
    desc: 'Spin, nod, lean + pad — opens Control → Neck.',
    icon: Bone,
    to: '/control?tab=neck',
    badge: 'Control',
  },
  {
    title: 'Body',
    desc: 'Arms, hands, legs — opens Control → Body.',
    icon: Footprints,
    to: '/control?tab=body',
    badge: 'Control',
  },
  {
    title: 'InMoove Studio',
    desc: 'Body map, servos, gestures, vision, runtime, Python console.',
    icon: Bot,
    to: '/robot',
    badge: 'Core',
  },
  {
    title: 'Moves',
    desc: '136+ InMoov gestures + built-in animations on hardware.',
    icon: Rocket,
    to: '/presets',
    badge: 'Gestures',
  },
  {
    title: 'Vision',
    desc: 'MediaPipe face follow, hand greeting, capture.',
    icon: Camera,
    to: '/camera',
    badge: 'Camera',
  },
  {
    title: 'Voice',
    desc: 'Offline voice commands + knowledge fallback.',
    icon: Mic,
    to: '/offline',
    badge: 'Mic',
  },
  {
    title: 'Chat',
    desc: 'Gemini / Ollama with mood motion and TTS jaw.',
    icon: Brain,
    to: '/ai',
    badge: 'AI',
  },
  {
    title: 'Settings',
    desc: 'USB serial, ports, and safety limits.',
    icon: Settings,
    to: '/settings',
    badge: 'USB',
  },
];

const LIFE_PRESETS = [
  { id: 'idle-breathe', label: 'Idle breathe' },
  { id: 'mrl-relax', label: 'Relax / rest' },
  { id: 'scan-room', label: 'Scan room' },
  { id: 'mrl-presentation', label: 'Presentation' },
];

const MOODS = ['happy', 'sad', 'thinking', 'surprised', 'normal'] as const;

export function MrlHubPage() {
  const mrlCount = PRESET_META.filter((p) => p.category !== 'builtin').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Features"
        description="Every capability in one map. Control keeps the 3D preview fixed; Studio owns Core tools."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((s) => (
          <Card key={s.to + s.title} className="surface-hover">
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
              Quick vision
            </CardTitle>
            <CardDescription>One-click look &amp; social gestures</CardDescription>
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
            <CardDescription>Life scripts + face moods</CardDescription>
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
            Stack summary
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
          <p>
            <strong className="text-foreground">{mrlCount}</strong> gestures playable
          </p>
          <p>
            <strong className="text-foreground">163</strong> voice commands
          </p>
          <p>
            <strong className="text-foreground">36</strong> servo axes
          </p>
          <p>
            <strong className="text-foreground">URDF</strong> full-body 3D
          </p>
          <p>
            Control: <Link className="text-primary underline" to="/control">/control</Link>
          </p>
          <p>
            Studio: <Link className="text-primary underline" to="/robot">/robot</Link>
          </p>
          <p>
            Moves: <Link className="text-primary underline" to="/presets">/presets</Link>
          </p>
          <p>
            Settings: <Link className="text-primary underline" to="/settings">/settings</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
