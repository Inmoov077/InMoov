import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { syncLiveRobot } from '@/lib/robotLiveController';
import { readStoreAngles } from '@/lib/robotStoreAngles';
import { cn } from '@/lib/utils';

interface ServoControlProps {
  label: string;
  hint?: string;
  pin: number;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  presets?: number[];
  presetLabels?: Record<number, string>;
  accent?: 'copper' | 'signal' | 'phosphor' | 'violet';
  className?: string;
  disabled?: boolean;
  /** Dense single-row motor control (default true in studio) */
  compact?: boolean;
  showPin?: boolean;
}

const COLORS = {
  copper: 'hsl(var(--primary))',
  signal: 'hsl(var(--info))',
  phosphor: 'hsl(var(--success))',
  violet: 'hsl(var(--violet))',
};

export function ServoControl({
  label,
  hint,
  pin,
  value,
  min = 0,
  max = 180,
  onChange,
  presets = [0, 45, 90, 135, 180],
  presetLabels,
  accent = 'signal',
  className,
  disabled,
  compact = true,
  showPin = false,
}: ServoControlProps) {
  const filtered = presets.filter((p) => p >= min && p <= max);

  const handleChange = (v: number) => {
    onChange(v);
    syncLiveRobot(readStoreAngles());
  };

  if (compact) {
    return (
      <div
        className={cn('motor-row', className)}
        style={{ '--motor-color': COLORS[accent] } as React.CSSProperties}
        title={hint ? `${hint} · pin ${pin}` : `pin ${pin}`}
      >
        <div className="motor-row-label">
          <Label className="text-xs font-medium leading-none">{label}</Label>
          {showPin && <span className="text-[10px] text-muted-foreground">#{pin}</span>}
        </div>
        <Slider
          accent={accent}
          min={min}
          max={max}
          step={1}
          value={[value]}
          onValueChange={([v]) => handleChange(v)}
          disabled={disabled}
          className="min-w-0 flex-1"
        />
        <span className="motor-row-value">{Math.round(value)}°</span>
        <div className="motor-row-presets">
          {filtered.slice(0, 5).map((p) => (
            <button
              key={p}
              type="button"
              disabled={disabled}
              onClick={() => handleChange(p)}
              className={cn(
                'motor-chip',
                Math.round(value) === p && 'motor-chip-active',
              )}
            >
              {presetLabels?.[p] ?? p}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn('motor-card', className)}
      style={{ '--motor-color': COLORS[accent] } as React.CSSProperties}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <Label>{label}</Label>
          {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <span className="rounded-full bg-primary/12 px-3 py-1 font-mono text-sm font-bold text-primary">
          {Math.round(value)}°
        </span>
      </div>
      <Slider
        accent={accent}
        min={min}
        max={max}
        step={1}
        value={[value]}
        onValueChange={([v]) => handleChange(v)}
        disabled={disabled}
      />
      <div className="flex flex-wrap gap-1.5">
        {filtered.map((p) => (
          <Button
            key={p}
            type="button"
            variant={Math.round(value) === p ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleChange(p)}
            disabled={disabled}
          >
            {presetLabels?.[p] ?? `${p}°`}
          </Button>
        ))}
      </div>
      {showPin && (
        <span className="text-[10px] text-muted-foreground">Wire {pin}</span>
      )}
    </div>
  );
}
