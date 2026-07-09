import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
  /** Tighter padding for studio panels */
  dense?: boolean;
}

export function SectionCard({
  icon: Icon,
  title,
  description,
  children,
  className,
  action,
  dense = true,
}: SectionCardProps) {
  return (
    <Card className={cn(dense && 'section-dense', className)}>
      <CardHeader
        className={cn(
          'flex-row items-center justify-between space-y-0',
          dense ? 'gap-2 p-3 pb-2' : 'gap-4 p-6 pb-4',
        )}
      >
        <div className={cn('flex min-w-0 items-center', dense ? 'gap-2' : 'gap-4')}>
          {Icon && (
            <div
              className={cn(
                'flex shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary',
                dense ? 'h-8 w-8' : 'h-12 w-12 rounded-2xl',
              )}
            >
              <Icon className={dense ? 'h-4 w-4' : 'h-5 w-5'} />
            </div>
          )}
          <div className="min-w-0">
            <CardTitle className={dense ? 'text-base' : undefined}>{title}</CardTitle>
            {description && !dense && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
            {description && dense && (
              <p className="truncate text-[11px] text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {action}
      </CardHeader>
      <CardContent className={dense ? 'p-3 pt-0' : 'p-6 pt-0'}>{children}</CardContent>
    </Card>
  );
}
