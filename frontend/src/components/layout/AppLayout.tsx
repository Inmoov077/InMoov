import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bot,
  Brain,
  Camera,
  FlaskConical,
  Gamepad2,
  Home,
  Menu,
  Mic,
  Rocket,
  Settings,
  Pin,
  SlidersHorizontal,
  Bone,
  Footprints,
  Octagon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { TelemetryStrip } from '@/components/layout/TelemetryStrip';
import { useServoStore } from '@/store/servoStore';
import { Toaster } from 'sonner';

const NAV = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/control', label: 'Control', icon: Gamepad2 },
  { to: '/head', label: 'Head', icon: SlidersHorizontal },
  { to: '/neck', label: 'Neck', icon: Bone },
  { to: '/body', label: 'Body', icon: Footprints },
  { to: '/presets', label: 'Moves', icon: Rocket },
  { to: '/ai', label: 'Chat', icon: Brain },
  { to: '/offline', label: 'Voice', icon: Mic },
  { to: '/camera', label: 'Vision', icon: Camera },
  { to: '/mrl-live', label: 'MRL Live', icon: Bot },
  { to: '/mrl', label: 'MRL Hub', icon: Bot },
  { to: '/calibration', label: 'Calibration', icon: Pin },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function AppLayout() {
  const location = useLocation();
  const connected = useServoStore((s) => s.connected);
  const port = useServoStore((s) => s.port);
  const emergencyStop = useServoStore((s) => s.emergencyStop);
  const [menuOpen, setMenuOpen] = useState(false);
  const showStats = location.pathname !== '/';

  useEffect(() => {
    useServoStore.getState().refreshConnection();
  }, []);

  const NavPills = ({ mobile, onNav }: { mobile?: boolean; onNav?: () => void }) => (
    <div className={cn(mobile ? 'flex flex-col gap-1 p-4' : 'hidden items-center gap-1 lg:flex')}>
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNav}
          className={({ isActive }) => (isActive ? 'nav-pill-active' : 'nav-pill-idle')}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </NavLink>
      ))}
      {!mobile && (
        <NavLink
          to="/testing"
          className={({ isActive }) => (isActive ? 'nav-pill-active' : 'nav-pill-idle')}
        >
          <FlaskConical className="h-4 w-4" />
          Test
        </NavLink>
      )}
    </div>
  );

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="shell flex h-16 items-center gap-4">
          <NavLink to="/" className="flex shrink-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
              <Bot className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <p className="font-display text-lg font-semibold leading-tight text-foreground">InMoov</p>
              <p className="text-xs text-muted-foreground">Robot Studio</p>
            </div>
          </NavLink>

          <NavPills />

          <div className="ml-auto flex items-center gap-2">
            <Badge variant={connected ? 'online' : 'offline'} className="hidden sm:flex">
              <span className={cn('mr-1.5 h-2 w-2 rounded-full', connected ? 'animate-pulseDot bg-success' : 'bg-destructive')} />
              {connected ? port ?? 'Connected' : 'Offline'}
            </Badge>
            <Button variant="destructive" size="sm" onClick={() => emergencyStop()} title="Stop all motors">
              <Octagon className="h-4 w-4" />
              <span className="hidden md:inline">Stop</span>
            </Button>
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0">
                <div className="border-b border-border/50 p-5">
                  <p className="font-display text-xl font-semibold">Menu</p>
                </div>
                <NavPills mobile onNav={() => setMenuOpen(false)} />
                <div className="border-t border-border/50 p-4">
                  <Badge variant={connected ? 'online' : 'offline'}>
                    {connected ? `Connected · ${port}` : 'Not connected'}
                  </Badge>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="shell py-6 md:py-8">
        {showStats && (
          <div className="mb-6">
            <TelemetryStrip />
          </div>
        )}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Outlet />
        </motion.div>
      </main>

      <footer className="border-t border-border/50 py-6 text-center text-sm text-muted-foreground">
        InMoov · Marwadi University Robotics &amp; AI Club
      </footer>
      <Toaster theme="light" position="bottom-center" richColors closeButton />
    </div>
  );
}