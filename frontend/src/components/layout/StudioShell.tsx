import { Suspense, lazy, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

const RobotViewer = lazy(() =>
  import('@/components/robot/RobotViewer').then((m) => ({ default: m.RobotViewer })),
);

const PREVIEW_MIN = 280;
const PREVIEW_MAX = 720;
const STORAGE_KEY = 'inmoov.studio.previewWidth';

interface StudioShellProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  tabs?: ReactNode;
  children: ReactNode;
  preview?: ReactNode;
  className?: string;
  showGallery?: boolean;
}

function PreviewSkeleton() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted/30 text-xs text-muted-foreground">
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary/60 border-t-transparent" />
      <span>Loading 3D…</span>
    </div>
  );
}

/**
 * Studio workspace: resizable 3D/map preview (drag right edge) + control panel.
 * 3D viewer is lazy so controls paint first.
 */
export function StudioShell({
  title,
  description,
  actions,
  tabs,
  children,
  preview,
  className,
  showGallery = false,
}: StudioShellProps) {
  const [previewWidth, setPreviewWidth] = useState(() => {
    if (typeof window === 'undefined') return 420;
    const raw = Number(localStorage.getItem(STORAGE_KEY));
    if (Number.isFinite(raw) && raw >= PREVIEW_MIN && raw <= PREVIEW_MAX) return raw;
    return 420;
  });
  const [dragging, setDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartW = useRef(420);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(previewWidth));
    } catch {
      /* ignore */
    }
  }, [previewWidth]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      setDragging(true);
      dragStartX.current = e.clientX;
      dragStartW.current = previewWidth;
    },
    [previewWidth],
  );

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - dragStartX.current;
      const next = Math.max(PREVIEW_MIN, Math.min(PREVIEW_MAX, dragStartW.current + dx));
      setPreviewWidth(next);
    };
    const onUp = () => setDragging(false);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [dragging]);

  return (
    <div
      className={cn('studio-shell', dragging && 'studio-shell-resizing', className)}
      style={
        {
          '--studio-preview-w': `${previewWidth}px`,
        } as React.CSSProperties
      }
    >
      <aside className="studio-preview" aria-label="Robot preview">
        <div className="studio-preview-frame">
          {preview ?? (
            <Suspense fallback={<PreviewSkeleton />}>
              <RobotViewer className="h-full w-full" showGallery={showGallery} />
            </Suspense>
          )}
        </div>
        <div
          className={cn('studio-resize-handle', dragging && 'is-active')}
          onPointerDown={onPointerDown}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize preview"
          title="Drag to resize preview"
        />
      </aside>

      <section className="studio-controls" aria-label="Robot controls">
        <header className="studio-controls-header">
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-lg font-semibold tracking-tight md:text-xl">{title}</h1>
            {description && (
              <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap items-center gap-1.5">{actions}</div>}
        </header>

        {tabs && (
          <nav className="studio-tabs" aria-label="Studio tabs">
            {tabs}
          </nav>
        )}

        <div className="studio-controls-scroll">{children}</div>
      </section>
    </div>
  );
}
