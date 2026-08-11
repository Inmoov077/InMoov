import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, RefreshCw, Save, Undo2 } from 'lucide-react';
import { toast } from 'sonner';
import * as api from '@/lib/api';
import { SERVOS, type ServoDef } from '@/lib/servoConfig';
import { groupDisplayName, servoShortName } from '@/lib/servoNames';
import { usePinStore } from '@/store/pinStore';
import { useServoStore } from '@/store/servoStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NumberEdit } from '@/components/ui/number-edit';
import { cn } from '@/lib/utils';

const GROUP_ORDER = [
  'head',
  'neck',
  'leftArm',
  'rightArm',
  'leftHand',
  'rightHand',
  'leftLeg',
  'rightLeg',
] as const;

/**
 * Pin map — inputs start empty.
 * Only saved overrides (or draft after typing) appear; Save persists to disk + board.
 */
export function PinMapPanel({ className }: { className?: string }) {
  const connected = useServoStore((s) => s.connected);
  const pins = usePinStore((s) => s.pins);
  const dirty = usePinStore((s) => s.dirty);
  const loaded = usePinStore((s) => s.loaded);
  const hydrate = usePinStore((s) => s.hydrate);
  const setPinLocal = usePinStore((s) => s.setPinLocal);
  const clearPinLocal = usePinStore((s) => s.clearPinLocal);
  const saveAll = usePinStore((s) => s.saveAll);
  const saveOne = usePinStore((s) => s.saveOne);
  const resetDefaults = usePinStore((s) => s.resetDefaults);

  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const grouped = useMemo(() => {
    const map: Record<string, ServoDef[]> = {};
    for (const s of SERVOS) {
      if (!map[s.group]) map[s.group] = [];
      map[s.group].push(s);
    }
    return map;
  }, []);

  const conflicts = useMemo(() => {
    const byPin: Record<number, string[]> = {};
    for (const s of SERVOS) {
      const pin = pins[s.key];
      if (pin == null || pin < 2) continue;
      if (!byPin[pin]) byPin[pin] = [];
      byPin[pin].push(s.key);
    }
    const map: Record<string, number> = {};
    for (const [pinStr, keys] of Object.entries(byPin)) {
      if (keys.length > 1) {
        for (const k of keys) map[k] = Number(pinStr);
      }
    }
    return map;
  }, [pins]);

  const onSaveAll = useCallback(async () => {
    if (Object.keys(pins).length === 0) {
      toast.error('No pins to save — type a pin first');
      return;
    }
    setSaving(true);
    try {
      const res = await saveAll(connected);
      if (res.ok) {
        if (connected) {
          const n = res.firmware_applied?.length ?? 0;
          toast.success(n > 0 ? `Saved ${n} pins to board` : 'Pins saved');
        } else {
          toast.success('Pins saved — connect USB to program board');
        }
        void hydrate();
      } else toast.error(res.error || 'Save failed');
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  }, [connected, saveAll, hydrate, pins]);

  const onApplyOne = useCallback(
    async (key: string) => {
      const pin = pins[key];
      if (pin == null || pin < 2) {
        toast.error('Enter a pin number first (2–53)');
        return;
      }
      setSaving(true);
      try {
        if (connected) {
          const res = await saveOne(key, pin, true);
          if (res.ok && res.serial_sent) toast.success(`${servoShortName(key)} → D${pin}`);
          else if (res.ok) toast.success(`${servoShortName(key)} pin saved`);
          else toast.error(res.error || 'Apply failed');
          if (res.warning) toast.warning(String(res.warning));
        } else {
          const res = await saveOne(key, pin, false);
          if (res.ok) toast.success(`${servoShortName(key)} saved (USB off)`);
          else toast.error(res.error || 'Save failed');
        }
        void hydrate();
      } catch {
        toast.error('Apply failed');
      } finally {
        setSaving(false);
      }
    },
    [connected, pins, saveOne, hydrate],
  );

  const onDefaults = () => {
    resetDefaults();
    toast.message('Factory pins loaded as draft — click Save to keep them');
  };

  const onVdb = async () => {
    setSaving(true);
    try {
      const res = await api.applyVdbPinProfile();
      if (res.ok) {
        toast.success('VDB pins loaded');
        await hydrate();
      } else toast.error('VDB profile failed');
    } finally {
      setSaving(false);
    }
  };

  const q = filter.trim().toLowerCase();

  if (!loaded) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading pins…
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Filter…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-9 max-w-[180px] text-sm"
        />
        <Button size="sm" className="h-9" onClick={() => void onSaveAll()} disabled={saving || !dirty}>
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          Save
        </Button>
        <Button size="sm" variant="outline" className="h-9" onClick={onDefaults} disabled={saving}>
          <Undo2 className="h-3.5 w-3.5" /> Defaults
        </Button>
        <Button size="sm" variant="outline" className="h-9" onClick={() => void onVdb()} disabled={saving}>
          VDB
        </Button>
        <Button size="sm" variant="ghost" className="h-9" onClick={() => void hydrate()} disabled={saving}>
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
        {dirty && <span className="text-[11px] text-amber-600">Unsaved</span>}
        <span className="text-[11px] text-muted-foreground">
          {connected ? 'USB on' : 'USB off · save to disk'}
        </span>
      </div>

      <p className="text-[11px] text-muted-foreground">
        Pin fields start empty. Type a number → Save / Apply. Only saved pins show after reload.
      </p>

      {Object.keys(conflicts).length > 0 && (
        <p className="text-[11px] text-destructive">
          Conflict on pin {[...new Set(Object.values(conflicts))].join(', ')} — each pin must be unique.
        </p>
      )}

      {GROUP_ORDER.map((group) => {
        let servos = grouped[group] ?? [];
        if (q) {
          servos = servos.filter(
            (s) =>
              servoShortName(s.key, s.label).toLowerCase().includes(q) ||
              s.key.toLowerCase().includes(q) ||
              (pins[s.key] != null && String(pins[s.key]).includes(q)),
          );
        }
        if (!servos.length) return null;
        return (
          <div key={group} className="border-t border-border/40 pt-2">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {groupDisplayName(group)}
            </p>
            <div className="divide-y divide-border/30">
              {servos.map((s) => {
                const p = pins[s.key];
                const clash = conflicts[s.key];
                return (
                  <div
                    key={s.key}
                    className={cn(
                      'flex flex-wrap items-center gap-2 py-2',
                      clash && 'bg-destructive/5',
                    )}
                  >
                    <div className="min-w-[120px] flex-1">
                      <p className="text-sm font-medium">{servoShortName(s.key, s.label)}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">{s.key}</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] font-medium text-muted-foreground">Pin</span>
                      <NumberEdit
                        value={p}
                        min={2}
                        max={53}
                        digits={2}
                        size="sm"
                        allowEmpty
                        placeholder="—"
                        title="Empty until Save"
                        className={cn(clash && 'border-destructive')}
                        onCommit={(n) => setPinLocal(s.key, n)}
                        onClear={() => clearPinLocal(s.key)}
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 px-3 text-xs"
                      disabled={saving || p == null}
                      onClick={() => void onApplyOne(s.key)}
                    >
                      Apply
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
