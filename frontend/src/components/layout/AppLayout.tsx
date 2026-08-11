import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain,
  Camera,
  FlaskConical,
  Home,
  Menu,
  Mic,
  Rocket,
  Settings,
  Pin,
  Octagon,
  Clapperboard,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { TelemetryStrip } from '@/components/layout/TelemetryStrip';
import { useServoStore } from '@/store/servoStore';
import { Toaster } from 'sonner';

/** Primary nav — single Studio, no Control/Studio/Features duplicates */
const NAV = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/control', label: 'Studio', icon: Clapperboard },
  { to: '/moves', label: 'Moves', icon: Rocket },
  { to: '/camera', label: 'Vision', icon: Camera },
  { to: '/ai', label: 'Chat', icon: Brain },
  { to: '/offline', label: 'Commands', icon: Mic },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const MORE = [
  { to: '/control?panel=pins', label: 'Pins', icon: Pin },
  { to: '/control?panel=test', label: '1:1 Test', icon: FlaskConical },
  { to: '/calibration', label: 'Cal lab', icon: Pin },
];

export function AppLayout() {
  const location = useLocation();
  const connected = useServoStore((s) => s.connected);
  const port = useServoStore((s) => s.port);
  const reconnecting = useServoStore((s) => s.reconnecting);
  const emergencyStop = useServoStore((s) => s.emergencyStop);
  const [menuOpen, setMenuOpen] = useState(false);

  const isStudio = location.pathname === '/control' || location.pathname === '/robot';
  const showStats = location.pathname !== '/' && !isStudio && location.pathname !== '/features';

  useEffect(() => {
    const s = useServoStore.getState();
    // Light status check only — heavy pin/limit hydrate happens on Studio
    void s.refreshConnection();
    s.startConnectionWatchdog();
  }, []);

  // Wake animation poll only on pages that can drive the robot (not Home)
  useEffect(() => {
    const path = location.pathname;
    const active =
      path === '/control' ||
      path === '/camera' ||
      path === '/moves' ||
      path === '/presets' ||
      path === '/robot';
    if (!active) return;

    let cancelled = false;
    const tick = async () => {
      try {
        const { realsenseStatus } = await import('@/lib/api');
        const { maybePlayWakeFromServer } = await import('@/lib/wakeAnimation');
        const st = await realsenseStatus();
        if (cancelled) return;
        const id = st.wake_animation?.id;
        if (id) await maybePlayWakeFromServer(id);
      } catch {
        /* offline / no camera */
      }
    };
    // Delay first poll so the page paints first
    const start = window.setTimeout(() => {
      void tick();
    }, 1500);
    const t = window.setInterval(() => void tick(), 4000);
    return () => {
      cancelled = true;
      window.clearTimeout(start);
      window.clearInterval(t);
    };
  }, [location.pathname]);

  const NavPills = ({ mobile, onNav }: { mobile?: boolean; onNav?: () => void }) => (
    <div className={cn(mobile ? 'flex flex-col gap-1 p-4' : 'hidden items-center gap-0.5 xl:flex')}>
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
      {mobile &&
        MORE.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNav}
            className={({ isActive }) => (isActive ? 'nav-pill-active' : 'nav-pill-idle')}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/85 backdrop-blur-xl">
        <div className={cn('flex h-14 items-center gap-3 px-4 md:px-6', isStudio ? 'max-w-none' : 'shell')}>
          <NavLink to="/" className="flex shrink-0 items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow">
              <Clapperboard className="h-4 w-4" />
            </div>
            <div className="hidden sm:block">
              <p className="font-display text-base font-semibold leading-tight text-foreground">InMoov</p>
              <p className="text-[10px] leading-none text-muted-foreground">Unified Studio</p>
            </div>
          </NavLink>

          <NavPills />

          <div className="ml-auto flex items-center gap-2">
            <Badge
              variant={connected ? 'online' : reconnecting ? 'default' : 'offline'}
              className="hidden sm:flex"
            >
              <span
                className={cn(
                  'mr-1.5 h-2 w-2 rounded-full',
                  connected
                    ? 'animate-pulseDot bg-success'
                    : reconnecting
                      ? 'animate-pulse bg-amber-400'
                      : 'bg-destructive',
                )}
              />
              {connected ? port ?? 'Connected' : reconnecting ? 'Reconnecting…' : 'Offline'}
            </Badge>
            <Button variant="destructive" size="sm" onClick={() => emergencyStop()} title="Stop all motors">
              <Octagon className="h-4 w-4" />
              <span className="hidden md:inline">Stop</span>
            </Button>
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="xl:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0">
                <div className="border-b border-border/50 p-5">
                  <p className="font-display text-xl font-semibold">Menu</p>
                  <p className="text-sm text-muted-foreground">All pages in one place</p>
                </div>
                <NavPills mobile onNav={() => setMenuOpen(false)} />
                <div className="border-t border-border/50 p-4">
                  <Badge variant={connected ? 'online' : reconnecting ? 'default' : 'offline'}>
                    {connected
                      ? `Connected · ${port}`
                      : reconnecting
                        ? 'Reconnecting USB…'
                        : 'Not connected'}
                  </Badge>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className={cn('flex-1', isStudio ? 'studio-main' : 'shell py-6 md:py-8')}>
        {showStats && (
          <div className="mb-6">
            <TelemetryStrip />
          </div>
        )}
        {/* Skip motion on Home for instant paint; light fade elsewhere */}
        {location.pathname === '/' ? (
          <div>
            <Outlet />
          </div>
        ) : (
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0.96, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className={isStudio ? 'h-full' : undefined}
          >
            <Outlet />
          </motion.div>
        )}
      </main>

      {!isStudio && (
        <footer className="border-t border-border/50 py-5 text-center text-sm text-muted-foreground">
          InMoov · Marwadi University Robotics &amp; AI Club
        </footer>
      )}
      <Toaster theme="light" position="bottom-center" richColors closeButton />
    </div>
  );
}
