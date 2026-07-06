import { useEffect, useRef } from 'react';
import { ScrollText, Trash2 } from 'lucide-react';
import { useServoStore } from '@/store/servoStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const COLORS: Record<string, string> = {
  send: 'text-info', recv: 'text-success', error: 'text-destructive', system: 'text-primary',
};

export function SerialConsole({ height = 'h-48', className }: { height?: string; className?: string }) {
  const logs = useServoStore((s) => s.logs);
  const clearLogs = useServoStore((s) => s.clearLogs);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  return (
    <Card className={className}>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-base"><ScrollText className="h-4 w-4" />Activity log</CardTitle>
        <Button variant="ghost" size="sm" onClick={clearLogs}><Trash2 className="h-4 w-4" /></Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className={cn('log-box', height)}>
          <div className="space-y-1 p-3">
            {logs.length === 0 && <p className="text-muted-foreground">Commands appear here when you move motors.</p>}
            {logs.map((e) => (
              <div key={e.id} className="flex gap-2">
                <span className="text-muted-foreground/70">[{e.ts}]</span>
                <span className={cn('font-medium', COLORS[e.type])}>{e.type}</span>
                <span className="break-all">{e.msg}</span>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}