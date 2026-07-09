import type { ReactNode } from 'react';
import { RobotViewer } from '@/components/robot/RobotViewer';
import { cn } from '@/lib/utils';

interface StudioShellProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  tabs?: ReactNode;
  children: ReactNode;
  /** Optional custom preview; defaults to full-body RobotViewer */
  preview?: ReactNode;
  className?: string;
  showGallery?: boolean;
}

/**
 * Split studio layout: sticky 3D preview (always visible) + scrollable controls.
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
  return (
    <div className={cn('studio-shell', className)}>
      <aside className="studio-preview" aria-label="3D robot preview">
        <div className="studio-preview-frame">
          {preview ?? <RobotViewer className="h-full w-full" showGallery={showGallery} />}
        </div>
        <p className="studio-preview-hint">Drag to orbit · scroll to zoom · sliders update live</p>
      </aside>

      <section className="studio-controls" aria-label="Robot controls">
        <header className="studio-controls-header">
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
            {description && (
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground md:text-base">{description}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
        </header>

        {tabs && <div className="studio-tabs">{tabs}</div>}

        <div className="studio-controls-scroll">{children}</div>
      </section>
    </div>
  );
}
