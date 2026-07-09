import { useEffect, useState } from 'react';
import { Camera, Loader2, Square } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import * as mrl from '@/lib/mrlClient';
import { MRL_ASSET } from '@/lib/mrlInmoovConfig';
import { connectMrlWebSocket, onOpencvFrame } from '@/lib/mrlWebSocket';

export function MrlOpenCvPanel() {
  const [capturing, setCapturing] = useState(false);
  const [frame, setFrame] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ name: string; type: string }[]>([]);
  const [displayFilter, setDisplayFilter] = useState('Flip');
  const [cameraIndex, setCameraIndex] = useState('0');
  const [webViewer, setWebViewer] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    connectMrlWebSocket();
    return onOpencvFrame(setFrame);
  }, []);

  useEffect(() => {
    void (async () => {
      const cap = await mrl.mrlCall<boolean>('i01.opencv', 'isCapturing');
      setCapturing(!!cap.data);
      const f = await mrl.mrlCall<Record<string, { name: string; type: string }>>('i01.opencv', 'getFilters');
      if (f.data && typeof f.data === 'object') {
        setFilters(Object.values(f.data));
      }
      const df = await mrl.mrlCall<string>('i01.opencv', 'getDisplayFilter');
      if (typeof df.data === 'string') setDisplayFilter(df.data);
    })();
  }, []);

  const toggleCapture = async () => {
    setBusy(true);
    try {
      if (capturing) {
        await mrl.mrlCall('i01.opencv', 'stopCapture');
        setCapturing(false);
        setFrame(null);
        toast.success('Capture stopped');
      } else {
        await mrl.mrlCall('i01.opencv', 'setCameraIndex', cameraIndex);
        await mrl.mrlCall('i01.opencv', 'capture');
        setCapturing(true);
        toast.success('Capture started');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Camera className="h-4 w-4" /> Vision
          </CardTitle>
          <CardDescription>Peer control for vision. Live face tracking lives on the Vision page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => void toggleCapture()} disabled={busy}>
              {busy ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : capturing ? <Square className="mr-1 h-4 w-4" /> : <Camera className="mr-1 h-4 w-4" />}
              {capturing ? 'Stop capture' : 'Start capture'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => void mrl.mrlStartPeer('opencv')}>Start opencv peer</Button>
          </div>
          <div className="flex items-center gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Camera index</Label>
              <Select value={cameraIndex} onValueChange={setCameraIndex}>
                <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 8 }, (_, i) => (
                    <SelectItem key={i} value={String(i)}>{i}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={webViewer} onCheckedChange={(v) => { setWebViewer(v); void mrl.mrlCall('i01.opencv', 'setWebViewer', v ? 'true' : 'false'); }} />
              <Label className="text-sm">Web viewer</Label>
            </div>
          </div>
          {filters.length > 0 && (
            <div className="space-y-1">
              <Label className="text-xs">Display filter</Label>
              <Select value={displayFilter} onValueChange={(v) => { setDisplayFilter(v); void mrl.mrlCall('i01.opencv', 'setDisplayFilter', v); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {filters.map((f) => (
                    <SelectItem key={f.name} value={f.name}>{f.name} ({f.type})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Video feed</CardTitle>
          <CardDescription>
            Open <a className="text-primary underline" href="/camera">Vision</a> for live MediaPipe tracking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-border/50 bg-black/80">
            <img
              src={frame ?? MRL_ASSET('OpenCV.png')}
              alt="Vision"
              className="mx-auto max-h-[400px] w-full object-contain"
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {capturing
              ? 'Vision peer started — use /camera for live browser feed'
              : 'Start capture to enable vision peer'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}