import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Brain,
  Camera,
  Clapperboard,
  Mic,
  Rocket,
  Settings,
  Usb,
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
    desc: 'Pin · limits · angle · 3D preview',
    color: 'from-primary/20 to-primary/5',
    big: true,
  },
  {
    to: '/ai',
    icon: Brain,
    title: 'Chat',
    desc: 'Local answers · voice in · speak out',
    color: 'from-axis-violet/15 to-transparent',
  },
  {
    to: '/moves',
    icon: Rocket,
    title: 'Moves',
    desc: 'Gestures & animations',
    color: 'from-success/15 to-transparent',
  },
  {
    to: '/camera',
    icon: Camera,
    title: 'Vision',
    desc: 'Camera wake & tracking',
    color: 'from-axis-sky/15 to-transparent',
  },
  {
    to: '/offline',
    icon: Mic,
    title: 'Commands',
    desc: 'Offline voice phrases',
    color: 'from-axis-amber/15 to-transparent',
  },
  {
    to: '/control?panel=usb',
    icon: Usb,
    title: 'USB',
    desc: 'Connect Arduino Mega',
    color: 'from-muted to-transparent',
  },
  {
    to: '/settings',
    icon: Settings,
    title: 'Settings',
    desc: 'Ports & system',
    color: 'from-muted to-transparent',
  },
];

export function HomePage() {
  const connected = useServoStore((s) => s.connected);
  const port = useServoStore((s) => s.port);
  const reconnecting = useServoStore((s) => s.reconnecting);

  return (
    <div className="space-y-8">
      <section className="page-hero">
        <div>
          <Badge
            variant={connected ? 'online' : reconnecting ? 'default' : 'offline'}
            className="mb-4"
          >
            {connected
              ? `USB · ${port}`
              : reconnecting
                ? 'Reconnecting…'
                : 'Not connected — open USB in Studio'}
          </Badge>
          <h1 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
            Control your <span className="text-gradient">InMoov</span>
          </h1>
          <p className="mt-4 max-w-lg text-lg text-muted-foreground">
            Simple studio: preview on the left, clear cards on the right. Move the body, set pins,
            chat from local campus data.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/control">
                Open Studio <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/ai">Chat</Link>
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
              key={t.to + t.title}
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
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
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
