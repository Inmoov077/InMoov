import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Server } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import * as mrl from '@/lib/mrlClient';
import type { MrlPeer } from '@/lib/mrlClient';

export function MrlPeersPanel() {
  const [peers, setPeers] = useState<MrlPeer[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await mrl.getMrlPeers();
      setPeers(res.peers ?? []);
    } catch {
      toast.error('Failed to load peers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const toggle = async (peer: MrlPeer, on: boolean) => {
    try {
      const res = on ? await mrl.mrlStartPeer(peer.name) : await mrl.mrlReleasePeer(peer.name);
      if (!res.ok) toast.error(res.error ?? 'Peer action failed');
      else toast.success(`${peer.name} ${on ? 'started' : 'released'}`);
      await refresh();
    } catch {
      toast.error('Peer toggle failed');
    }
  };

  const started = peers.filter((p) => p.started).length;

  return (
    <div className="space-y-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Server className="h-4 w-4" />
            i01 Peers
          </CardTitle>
          <CardDescription>
            Full InMoov2 peer graph ({started}/{peers.length} started) — like MRL startPeer / releasePeer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="sm" variant="outline" className="h-7" onClick={() => void refresh()} disabled={loading}>
            <RefreshCw className="mr-1 h-3.5 w-3.5" />
            Refresh
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-1.5">
        {peers.map((p) => (
          <div
            key={p.name}
            className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/70 px-3 py-2"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-sm font-semibold">{p.label}</span>
                <Badge variant={p.started ? 'online' : 'offline'} className="text-[9px]">
                  {p.started ? 'on' : 'off'}
                </Badge>
                {p.autoStart && (
                  <Badge variant="signal" className="text-[9px]">
                    auto
                  </Badge>
                )}
              </div>
              <p className="truncate font-mono text-[10px] text-muted-foreground">
                {p.service} · {p.type}
              </p>
            </div>
            <Switch checked={p.started} onCheckedChange={(on) => void toggle(p, on)} />
          </div>
        ))}
      </div>
    </div>
  );
}
