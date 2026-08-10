import { useCallback, useEffect, useState } from 'react';
import { Plug, PlugZap, RefreshCw, Unlock, Usb } from 'lucide-react';
import { toast } from 'sonner';
import * as api from '@/lib/api';
import { useServoStore } from '@/store/servoStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type PortDetail = {
  device: string;
  description: string;
  manufacturer?: string;
  likely_arduino?: boolean;
  vid?: string;
  pid?: string;
};

export function ConnectionPanel({ compact, className }: { compact?: boolean; className?: string }) {
  const connected = useServoStore((s) => s.connected);
  const port = useServoStore((s) => s.port);
  const reconnecting = useServoStore((s) => s.reconnecting);
  const storeError = useServoStore((s) => s.lastSerialError);
  const connect = useServoStore((s) => s.connect);
  const disconnect = useServoStore((s) => s.disconnect);
  const autoDetect = useServoStore((s) => s.autoDetect);
  const refreshConnection = useServoStore((s) => s.refreshConnection);
  const startWatchdog = useServoStore((s) => s.startConnectionWatchdog);
  const log = useServoStore((s) => s.log);

  const [ports, setPorts] = useState<string[]>([]);
  const [details, setDetails] = useState<PortDetail[]>([]);
  const [selectedPort, setSelectedPort] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const loadPorts = useCallback(async () => {
    setBusy(true);
    try {
      const data = await api.getPorts();
      const list: string[] = data.ports ?? [];
      setPorts(list);
      setDetails((data.details as PortDetail[]) ?? []);
      if (data.last_error) setLastError(data.last_error);
      setSelectedPort((prev) => {
        if (data.current && list.includes(data.current)) return data.current;
        if (data.desired_port && list.includes(data.desired_port)) return data.desired_port;
        // Prefer Arduino-looking ports
        const arduino = (data.details as PortDetail[] | undefined)?.find((d) => d.likely_arduino);
        if (arduino && list.includes(arduino.device)) return arduino.device;
        if (prev && list.includes(prev)) return prev;
        return list[0];
      });
      await refreshConnection();
    } catch {
      toast.error('Could not list USB ports');
    } finally {
      setBusy(false);
      setLoaded(true);
    }
  }, [refreshConnection]);

  useEffect(() => {
    void loadPorts();
    startWatchdog();
  }, [loadPorts, startWatchdog]);

  useEffect(() => {
    if (port && ports.includes(port)) setSelectedPort(port);
  }, [port, ports]);

  const selectValue = selectedPort && ports.includes(selectedPort) ? selectedPort : undefined;

  const labelFor = (device: string) => {
    const d = details.find((x) => x.device === device);
    if (!d) return device;
    const tag = d.likely_arduino ? ' · Arduino' : '';
    return `${d.device} — ${d.description}${tag}`;
  };

  const doConnect = async () => {
    if (!selectedPort) return toast.warning('Pick a COM port first');
    setBusy(true);
    setLastError(null);
    try {
      const ok = await connect(selectedPort);
      if (ok) {
        toast.success(`Connected to ${selectedPort}`);
        setLastError(null);
      } else {
        // Pull last error from ports endpoint / store log
        const data = await api.getPorts().catch(() => null);
        const err =
          data?.last_error ||
          'Access denied or port busy — close Arduino Serial Monitor, then Force free.';
        setLastError(err);
        toast.error(err.length > 120 ? 'COM access denied — see tip below' : err);
      }
    } finally {
      setBusy(false);
      await loadPorts();
    }
  };

  const doDisconnect = async () => {
    setBusy(true);
    try {
      await disconnect();
      toast.message('Disconnected');
    } finally {
      setBusy(false);
      await loadPorts();
    }
  };

  const doForceFree = async () => {
    setBusy(true);
    setLastError(null);
    try {
      await api.forceReleasePort(selectedPort);
      log('system', `Force released ${selectedPort ?? 'serial'}`);
      toast.success('Port handle released — wait 1s, then Connect');
      await new Promise((r) => setTimeout(r, 900));
      await loadPorts();
    } catch {
      toast.error('Force free failed');
    } finally {
      setBusy(false);
    }
  };

  const doAuto = async () => {
    setBusy(true);
    setLastError(null);
    try {
      const d = await autoDetect();
      if (d) {
        setSelectedPort(d);
        toast.success(`Connected on ${d}`);
      } else {
        setLastError('Auto-find failed. Close other COM apps, Force free, then Connect manually.');
        toast.error('No Arduino opened — try Force free + Connect');
      }
    } finally {
      setBusy(false);
      await loadPorts();
    }
  };

  return (
    <Card className={cn(compact && 'section-dense', className)}>
      <CardHeader className={compact ? 'p-3 pb-2' : undefined}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'flex items-center justify-center rounded-xl bg-primary/12',
                compact ? 'h-8 w-8' : 'h-11 w-11 rounded-2xl',
              )}
            >
              <Usb className={cn(compact ? 'h-4 w-4' : 'h-5 w-5', 'text-primary')} />
            </div>
            <div>
              <CardTitle className={compact ? 'text-base' : 'text-lg'}>Connect</CardTitle>
              {!compact && (
                <CardDescription>Arduino Mega USB · pick COM · Connect</CardDescription>
              )}
            </div>
          </div>
          <Badge variant={connected ? 'online' : reconnecting ? 'default' : 'offline'}>
            {connected ? port ?? 'On' : reconnecting ? 'Reconnecting…' : 'Off'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className={cn(compact ? 'space-y-2 p-3 pt-0' : 'space-y-4')}>
        <div className={cn(compact ? 'rounded-lg border border-border/40 bg-muted/40 p-2' : 'surface-inset')}>
          {!loaded ? (
            <p className="text-xs text-muted-foreground">Searching ports…</p>
          ) : ports.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No COM ports — plug USB, install CH340/Arduino drivers if needed, then Refresh.
            </p>
          ) : (
            <Select value={selectValue} onValueChange={setSelectedPort} disabled={connected || busy}>
              <SelectTrigger className={compact ? 'h-8 text-xs' : undefined}>
                <SelectValue placeholder="Port (COM11…)" />
              </SelectTrigger>
              <SelectContent>
                {ports.map((p) => (
                  <SelectItem key={p} value={p}>
                    {labelFor(p)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {!connected ? (
            <Button onClick={() => void doConnect()} disabled={busy || !selectedPort || reconnecting}>
              <Plug className="h-4 w-4" /> {reconnecting ? 'Reconnecting…' : 'Connect'}
            </Button>
          ) : (
            <Button variant="destructive" onClick={() => void doDisconnect()} disabled={busy}>
              <PlugZap className="h-4 w-4" /> Disconnect
            </Button>
          )}
          <Button variant="outline" onClick={() => void loadPorts()} disabled={busy} title="Refresh port list">
            <RefreshCw className={cn('h-4 w-4', busy && 'animate-spin')} />
          </Button>
          <Button variant="outline" onClick={() => void doForceFree()} disabled={busy} title="Free stuck COM handle">
            <Unlock className="h-4 w-4" /> Force free
          </Button>
          <Button variant="accent" onClick={() => void doAuto()} disabled={busy || connected || reconnecting}>
            Auto-find
          </Button>
        </div>

        {(lastError || storeError) && !connected && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-[11px] leading-snug text-destructive">
            <strong className="block text-xs">Connection error</strong>
            {lastError || storeError}
          </div>
        )}

        {reconnecting && !connected && (
          <p className="text-[11px] leading-snug text-amber-600 dark:text-amber-400">
            Link dropped — server is auto-reconnecting. Leave USB plugged in.
          </p>
        )}

        {connected && (
          <p className="text-[11px] leading-snug text-muted-foreground">
            Link stable · quiet mode on · auto-reconnect enabled if USB blips.
          </p>
        )}

        {!connected && !reconnecting && (
          <p className="text-[11px] leading-snug text-muted-foreground">
            <strong>Access denied?</strong> Close Arduino IDE Serial Monitor, other browser tabs of this
            app, and any terminal using COM. Click <em>Force free</em>, wait 1 second, then Connect.
            Your Mega is often <code className="text-[10px]">COM11 · VID 2341:0042</code>.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
