import { useState } from 'react';
import { Loader2, Power } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import * as mrl from '@/lib/mrlClient';

interface MrlPeerToggleProps {
  peerKey: string;
  label: string;
  icon?: string;
  started?: boolean;
  onToggle?: () => void;
}

export function MrlPeerToggle({ peerKey, label, icon, started, onToggle }: MrlPeerToggleProps) {
  const [busy, setBusy] = useState(false);
  const [localOn, setLocalOn] = useState(started ?? false);

  const toggle = async () => {
    setBusy(true);
    try {
      const res = localOn ? await mrl.mrlReleasePeer(peerKey) : await mrl.mrlStartPeer(peerKey);
      if (res.ok) {
        setLocalOn(!localOn);
        toast.success(`${label} ${localOn ? 'released' : 'started'}`);
        onToggle?.();
      } else toast.error(res.error ?? 'Peer command failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 p-3">
      {icon && <img src={icon} alt="" className="h-10 w-10 object-contain" />}
      <div className="min-w-0 flex-1">
        <p className="font-medium">{label}</p>
        <p className="font-mono text-xs text-muted-foreground">i01.{peerKey}</p>
      </div>
      <Badge variant={localOn ? 'online' : 'offline'}>{localOn ? 'on' : 'off'}</Badge>
      <Button size="sm" variant={localOn ? 'default' : 'outline'} onClick={() => void toggle()} disabled={busy}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Power className="h-4 w-4" />}
      </Button>
    </div>
  );
}