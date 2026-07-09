import { useEffect, useState } from 'react';
import { RefreshCw, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import * as mrl from '@/lib/mrlClient';
import { useMrlStore } from '@/store/mrlStore';

export function MrlRuntimePanel() {
  const status = useMrlStore((s) => s.status);
  const services = useMrlStore((s) => s.services);
  const refresh = useMrlStore((s) => s.refresh);
  const [uptime, setUptime] = useState('');
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('');

  useEffect(() => {
    void mrl.mrlCall<string>('runtime', 'getUptime').then((r) => {
      if (typeof r.data === 'string') setUptime(r.data);
    });
  }, []);

  const startService = async () => {
    if (!newName || !newType) return;
    await mrl.mrlCall('runtime', 'start', newName, newType);
    void refresh();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Server className="h-4 w-4" /> InMoove Core runtime
          </CardTitle>
          <CardDescription>Native service registry — version, uptime, peers</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Core version</p>
            <p className="font-semibold">{status?.version ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Uptime</p>
            <p className="font-semibold">{uptime || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Services</p>
            <p className="font-semibold">{status?.serviceCount ?? services.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Robot state</p>
            <Badge variant="copper">{status?.i01State ?? '—'}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create service</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Input placeholder="name" value={newName} onChange={(e) => setNewName(e.target.value)} className="max-w-[140px]" />
          <Input placeholder="Service type" value={newType} onChange={(e) => setNewType(e.target.value)} className="max-w-[180px]" />
          <Button onClick={() => void startService()}>Start service</Button>
          <Button variant="outline" onClick={() => void refresh()}><RefreshCw className="h-4 w-4" /></Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Running services ({services.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[50vh] overflow-y-auto font-mono text-xs">
            {services.map((s) => (
              <div key={s} className="border-b border-border/30 py-1.5">{s}</div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}