import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  variant?: 'solid' | 'outline' | 'soft';
  className?: string;
}

export default function Badge({ children, color, variant = 'soft', className }: BadgeProps) {
  const baseClasses = 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium';

  if (color && variant === 'solid') {
    return (
      <span className={cn(baseClasses, className)} style={{ backgroundColor: color, color: '#fff' }}>
        {children}
      </span>
    );
  }

  if (color && variant === 'soft') {
    return (
      <span
        className={cn(baseClasses, className)}
        style={{ backgroundColor: `${color}20`, color }}
      >
        {children}
      </span>
    );
  }

  return (
    <span className={cn(baseClasses, 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300', className)}>
      {children}
    </span>
  );
}
