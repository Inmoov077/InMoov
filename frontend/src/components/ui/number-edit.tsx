import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  /** Number to show; null/undefined = empty field (pins until Save). */
  value: number | null | undefined;
  onCommit: (n: number) => void;
  /** Called when field left empty (only if allowEmpty). */
  onClear?: () => void;
  min?: number;
  max?: number;
  /** Expected digit count — used for min width */
  digits?: number;
  /** sm = compact lists, md = default, lg = angle */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  title?: string;
  id?: string;
  label?: string;
  /**
   * When true: empty blur stays empty (does not restore previous).
   * Use for pin fields that start blank until Save.
   */
  allowEmpty?: boolean;
  placeholder?: string;
};

/**
 * Normal number typing:
 * backspace to empty → type digits → Enter / blur to apply.
 */
export function NumberEdit({
  value,
  onCommit,
  onClear,
  min = 0,
  max = 180,
  digits = 3,
  size = 'md',
  className,
  disabled,
  title,
  id,
  label,
  allowEmpty = false,
  placeholder = '—',
}: Props) {
  const display =
    value == null || (typeof value === 'number' && !Number.isFinite(value))
      ? ''
      : String(Math.round(value));

  const [text, setText] = useState(display);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!editing) setText(display);
  }, [display, editing]);

  const finish = () => {
    setEditing(false);
    const raw = text.trim();
    if (raw === '') {
      if (allowEmpty) {
        setText('');
        onClear?.();
        return;
      }
      setText(display);
      return;
    }
    const n = parseInt(raw, 10);
    if (Number.isNaN(n)) {
      setText(display);
      return;
    }
    const clamped = Math.max(min, Math.min(max, n));
    setText(String(clamped));
    onCommit(clamped);
  };

  // Fixed pixel widths so digits never clip on any font
  const widthClass =
    size === 'sm'
      ? 'h-9 w-14 min-w-[3.5rem] text-sm px-2'
      : size === 'lg'
        ? 'h-11 w-[4.75rem] min-w-[4.75rem] text-lg px-3'
        : digits <= 2
          ? 'h-10 w-14 min-w-[3.75rem] text-base px-2.5'
          : 'h-10 w-16 min-w-[4.25rem] text-base px-2.5';

  const field = (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      spellCheck={false}
      disabled={disabled}
      title={title}
      value={text}
      placeholder={placeholder}
      onFocus={() => setEditing(true)}
      onBlur={finish}
      onChange={(e) => {
        const next = e.target.value;
        // Free empty + digits only
        if (!(next === '' || /^[0-9]+$/.test(next))) return;
        setText(next);
        // Live draft for pin-style fields so Save works without blur first
        if (allowEmpty) {
          if (next === '') {
            onClear?.();
          } else {
            const n = parseInt(next, 10);
            if (!Number.isNaN(n) && n >= min && n <= max) onCommit(n);
          }
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          (e.target as HTMLInputElement).blur();
        }
        if (e.key === 'Escape') {
          setText(display);
          setEditing(false);
          (e.target as HTMLInputElement).blur();
        }
      }}
      className={cn(
        'box-border rounded-lg border-2 border-input bg-card',
        'text-center font-mono font-semibold tabular-nums leading-none',
        'placeholder:font-normal placeholder:text-muted-foreground/50',
        'focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30',
        'disabled:opacity-50',
        widthClass,
        className,
      )}
    />
  );

  if (!label) return field;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {field}
    </div>
  );
}
