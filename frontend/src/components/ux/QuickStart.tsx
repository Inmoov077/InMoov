import { Link } from 'react-router-dom';
import { Cable, Gamepad2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STEPS = [
  { n: 1, icon: Cable, title: 'Plug in USB', text: 'Connect the Arduino board to your computer.', link: '/settings', btn: 'Connect' },
  { n: 2, icon: Gamepad2, title: 'Move sliders', text: 'Open the control panel and drag any slider.', link: '/control', btn: 'Control' },
  { n: 3, icon: Sparkles, title: 'Try a move', text: 'Tap Nod or Wave — one click choreography.', link: '/presets', btn: 'Moves' },
];

export function QuickStart() {
  return (
    <div className="surface hero-gradient p-6 md:p-8">
      <h2 className="font-display text-2xl font-semibold">Get started in 3 steps</h2>
      <p className="mt-1 text-muted-foreground">No experience needed — just follow along.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.n} className="surface-inset flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{s.n}</span>
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            <p className="font-semibold">{s.title}</p>
            <p className="flex-1 text-sm text-muted-foreground">{s.text}</p>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to={s.link}>{s.btn}</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}