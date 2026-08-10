import type { ReactNode } from 'react';
import { RobotViewer } from '@/components/robot/RobotViewer';
import { cn } from '@/lib/utils';

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

/** Sticky preview + dense control panel — single InMoov studio workspace. */
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
      <aside className="studio-preview" aria-label="Robot preview">
        <div className="studio-preview-frame">
          {preview ?? <RobotViewer className="h-full w-full" showGallery={showGallery} />}
        </div>
      </aside>

      <section className="studio-controls" aria-label="Robot controls">
        <header className="studio-controls-header">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="font-display text-lg font-semibold tracking-tight md:text-xl">{title}</h1>
              {description && (
                <span className="hidden text-xs text-muted-foreground lg:inline">{description}</span>
              )}
            </div>
          </div>
          {actions && <div className="flex shrink-0 flex-wrap items-center gap-1.5">{actions}</div>}
        </header>

        {tabs && <div className="studio-tabs">{tabs}</div>}

        <div className="studio-controls-scroll">{children}</div>
      </section>
    </div>
  );
}
