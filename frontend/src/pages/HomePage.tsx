import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Brain,
  Camera,
  Clapperboard,
  Mic,
  Rocket,
  Settings,
} from 'lucide-react';
import { QuickStart } from '@/components/ux/QuickStart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useServoStore } from '@/store/servoStore';

const TILES = [
  {
    to: '/control',
    icon: Clapperboard,
    title: 'Studio',
    desc: 'InMoov2 map · Pose · Gestures · Servos · Runtime — one workspace',
    color: 'from-primary/20 to-primary/5',
    big: true,
  },
  {
    to: '/presets',
    icon: Rocket,
    title: 'Moves',
    desc: '136+ gestures & built-in animations',
    color: 'from-success/15 to-transparent',
  },
  {
    to: '/camera',
    icon: Camera,
    title: 'Vision',
    desc: 'D455 presence wake + face/hand track',
    color: 'from-axis-sky/15 to-transparent',
  },
  {
    to: '/ai',
    icon: Brain,
    title: 'Chat',
    desc: 'Talk with AI + mood motion',
    color: 'from-axis-violet/15 to-transparent',
  },
  {
    to: '/offline',
    icon: Mic,
    title: 'Voice',
    desc: 'Offline commands',
    color: 'from-axis-amber/15 to-transparent',
  },
  {
    to: '/settings',
    icon: Settings,
    title: 'Settings',
    desc: 'USB ports & safety',
    color: 'from-muted to-transparent',
  },
];

export function HomePage() {
  const connected = useServoStore((s) => s.connected);
  const port = useServoStore((s) => s.port);

  return (
    <div className="space-y-8 animate-fadeUp">
      <section className="page-hero">
        <div>
          <Badge variant={connected ? 'online' : 'offline'} className="mb-4">
            {connected ? `Connected · ${port}` : 'Not connected — plug in USB'}
          </Badge>
          <h1 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
            Control your <span className="text-gradient">InMoov</span>
          </h1>
          <p className="mt-4 max-w-lg text-lg text-muted-foreground">
            MyRobotLab-style InMoov studio: body map on the left, one tool panel on the right.
            Joint limits, anti-overlap, and arm hardware inversions are built in.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/control">
                Open Studio <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/control?panel=gestures">Gestures</Link>
            </Button>
            {!connected && (
              <Button size="lg" variant="outline" asChild>
                <Link to="/control?panel=usb">Connect USB</Link>
              </Button>
            )}
          </div>
        </div>
        <div className="hidden h-32 w-32 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-accent shadow-glow md:flex">
          <Clapperboard className="h-16 w-16 text-white" />
        </div>
      </section>

      <QuickStart />

      <section>
        <h2 className="mb-4 font-display text-2xl font-semibold">Explore</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TILES.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className={`surface-hover group relative overflow-hidden p-5 ${t.big ? 'sm:col-span-2 lg:col-span-2' : ''}`}
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80 ${t.color}`}
              />
              <div className="relative flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-card shadow-sm">
                  <t.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-semibold">{t.title}</h3>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
