import { useCallback, useEffect, useState } from 'react';
import { Plug, PlugZap, RefreshCw, Usb } from 'lucide-react';
import { toast } from 'sonner';
import * as api from '@/lib/api';
import { useServoStore } from '@/store/servoStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function ConnectionPanel({ compact, className }: { compact?: boolean; className?: string }) {
  const connected = useServoStore((s) => s.connected);
  const port = useServoStore((s) => s.port);
  const connect = useServoStore((s) => s.connect);
  const disconnect = useServoStore((s) => s.disconnect);
  const autoDetect = useServoStore((s) => s.autoDetect);
  const refreshConnection = useServoStore((s) => s.refreshConnection);

  const [ports, setPorts] = useState<string[]>([]);
  const [selectedPort, setSelectedPort] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const loadPorts = useCallback(async () => {
    setBusy(true);
    try {
      const data = await api.getPorts();
      const list: string[] = data.ports ?? [];
      setPorts(list);
      setSelectedPort((prev) => {
        if (data.current && list.includes(data.current)) return data.current;
        if (prev && list.includes(prev)) return prev;
        return list[0];
      });
      await refreshConnection();
    } catch {
      toast.error('Could not find USB ports');
    } finally {
      setBusy(false);
      setLoaded(true);
    }
  }, [refreshConnection]);

  useEffect(() => {
    loadPorts();
  }, [loadPorts]);

  useEffect(() => {
    if (port && ports.includes(port)) setSelectedPort(port);
  }, [port, ports]);

  const selectValue = selectedPort && ports.includes(selectedPort) ? selectedPort : undefined;

  return (
    <Card className={cn(className)}>
      <CardHeader className={compact ? 'p-5 pb-3' : undefined}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12">
              <Usb className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Connect robot</CardTitle>
              {!compact && <CardDescription>USB cable → pick port → Connect</CardDescription>}
            </div>
          </div>
          <Badge variant={connected ? 'online' : 'offline'}>{connected ? 'On' : 'Off'}</Badge>
        </div>
      </CardHeader>
      <CardContent className={cn('space-y-4', compact && 'px-5 pb-5')}>
        <div className="surface-inset">
          {!loaded ? (
            <p className="text-sm text-muted-foreground">Searching…</p>
          ) : ports.length === 0 ? (
            <p className="text-sm text-muted-foreground">No ports — plug in USB and refresh.</p>
          ) : (
            <Select value={selectValue} onValueChange={setSelectedPort} disabled={connected || busy}>
              <SelectTrigger>
                <SelectValue placeholder="Choose port (COM3, COM4…)" />
              </SelectTrigger>
              <SelectContent>
                {ports.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {!connected ? (
            <Button onClick={async () => {
              if (!selectedPort) return toast.warning('Pick a port first');
              setBusy(true);
              const ok = await connect(selectedPort);
              setBusy(false);
              ok ? toast.success('Connected!') : toast.error('Failed — check cable');
            }} disabled={busy || !selectedPort}>
              <Plug className="h-4 w-4" /> Connect
            </Button>
          ) : (
            <Button variant="destructive" onClick={async () => { setBusy(true); await disconnect(); setBusy(false); }} disabled={busy}>
              <PlugZap className="h-4 w-4" /> Disconnect
            </Button>
          )}
          <Button variant="outline" onClick={loadPorts} disabled={busy}>
            <RefreshCw className={cn('h-4 w-4', busy && 'animate-spin')} />
          </Button>
          <Button variant="accent" onClick={async () => {
            setBusy(true);
            const d = await autoDetect();
            setBusy(false);
            if (d) { setSelectedPort(d); toast.success(`Found ${d}`); }
          }} disabled={busy || connected}>
            Auto-find
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}