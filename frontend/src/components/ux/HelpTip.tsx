import { Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HelpTipProps {
  children: React.ReactNode;
  className?: string;
}

export function HelpTip({ children, className }: HelpTipProps) {
  return (
    <div className={cn('flex items-start gap-3 rounded-2xl bg-accent/8 px-4 py-3 text-sm leading-relaxed text-muted-foreground', className)}>
      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
      <div>{children}</div>
    </div>
  );
}