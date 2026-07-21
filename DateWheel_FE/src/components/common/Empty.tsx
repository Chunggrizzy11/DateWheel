import { cn } from '../../lib/utils';
import { Inbox } from 'lucide-react';

interface EmptyProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function Empty({
  icon = <Inbox size={64} className="text-body-subtle/50" />,
  title = 'No data found',
  description = 'There is nothing here yet.',
  action,
  className,
}: EmptyProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="mb-4 animate-float flex justify-center">{icon}</div>
      <h3 className="text-lg font-semibold text-heading mb-1">{title}</h3>
      <p className="text-sm text-body-subtle mb-4 max-w-sm">{description}</p>
      {action}
    </div>
  );
}
