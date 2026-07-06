import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Bone,
  Brain,
  Camera,
  Gamepad2,
  Mic,
  Rocket,
  Settings,
  SlidersHorizontal,
  Footprints,
} from 'lucide-react';
import { QuickStart } from '@/components/ux/QuickStart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useServoStore } from '@/store/servoStore';

const TILES = [
  { to: '/control', icon: Gamepad2, title: 'Control panel', desc: 'All motors + 3D preview', color: 'from-primary/20 to-primary/5', big: true },
  { to: '/head', icon: SlidersHorizontal, title: 'Head', desc: 'Turn, eyes, jaw', color: 'from-accent/15 to-transparent' },
  { to: '/neck', icon: Bone, title: 'Neck', desc: 'Spin, nod, lean', color: 'from-info/15 to-transparent' },
  { to: '/body', icon: Footprints, title: 'Body', desc: 'Arms, hands & legs', color: 'from-primary/15 to-transparent' },
  { to: '/presets', icon: Rocket, title: 'Moves', desc: 'Nod, wave, bow', color: 'from-success/15 to-transparent' },
  { to: '/ai', icon: Brain, title: 'Chat', desc: 'Talk with AI', color: 'from-axis-violet/15 to-transparent' },
  { to: '/offline', icon: Mic, title: 'Voice', desc: 'Offline commands', color: 'from-axis-amber/15 to-transparent' },
  { to: '/camera', icon: Camera, title: 'Camera', desc: 'Face follow', color: 'from-axis-sky/15 to-transparent' },
  { to: '/settings', icon: Settings, title: 'Settings', desc: 'USB & limits', color: 'from-muted to-transparent' },
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
            Control your <span className="text-gradient">InMoov</span> robot
          </h1>
          <p className="mt-4 max-w-lg text-lg text-muted-foreground">
            Move the head, neck, arms, hands, and legs — try ready-made gestures or chat with your humanoid.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/control">Open control panel <ArrowUpRight className="h-4 w-4" /></Link>
            </Button>
            {!connected && (
              <Button size="lg" variant="outline" asChild>
                <Link to="/settings">Connect USB</Link>
              </Button>
            )}
          </div>
        </div>
        <div className="hidden h-32 w-32 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-accent shadow-glow md:flex">
          <Gamepad2 className="h-16 w-16 text-white" />
        </div>
      </section>

      <QuickStart />

      <section>
        <h2 className="mb-4 font-display text-2xl font-semibold">Explore</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TILES.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className={`surface-hover group flex flex-col justify-between bg-gradient-to-br p-6 ${t.color} ${t.big ? 'sm:col-span-2' : ''}`}
            >
              <t.icon className="h-8 w-8 text-primary" />
              <div className="mt-8">
                <p className="font-display text-xl font-semibold group-hover:text-primary">{t.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              </div>
              <ArrowUpRight className="mt-4 h-5 w-5 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}