import { useState } from 'react';
import { Loader2, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import * as mrl from '@/lib/mrlClient';

const QUICK = ['i01.relax()', 'i01.Yes()', 'i01.loadGestures()', "i01.execScript('system/startScripts/batterylevelGui.py')"];

export function MrlPythonConsole() {
  const [script, setScript] = useState('i01.Yes()');
  const [output, setOutput] = useState('');
  const [busy, setBusy] = useState(false);

  const run = async (s: string) => {
    setBusy(true);
    const res = await mrl.mrlPythonExec(s);
    setOutput(JSON.stringify(res, null, 2));
    if (res.ok) toast.success('Executed');
    else toast.error(res.error ?? 'Failed');
    setBusy(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Terminal className="h-4 w-4" /> Python console
        </CardTitle>
        <CardDescription>python/exec — same as MRL script tab</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {QUICK.map((q) => (
            <Button key={q} size="sm" variant="outline" onClick={() => { setScript(q); void run(q); }}>{q}</Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={script} onChange={(e) => setScript(e.target.value)} className="font-mono text-sm" onKeyDown={(e) => e.key === 'Enter' && void run(script)} />
          <Button onClick={() => void run(script)} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Run'}
          </Button>
        </div>
        {output && (
          <pre className="max-h-48 overflow-auto rounded-lg bg-muted/50 p-3 font-mono text-xs">{output}</pre>
        )}
      </CardContent>
    </Card>
  );
}