import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({ open, onClose, title, children, className, size = 'md' }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className={cn(
        'w-full bg-glass-bg backdrop-blur-[20px] rounded-base shadow-glass border border-glass-border relative overflow-hidden animate-fade-in-scale',
        sizes[size],
        className
      )}>
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'var(--glass-edge-top)' }}></div>
        <div className="absolute top-0 left-0 w-[1px] h-full" style={{ background: 'var(--glass-edge-left)' }}></div>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-glass-border z-10 relative">
            <h3 className="text-lg font-semibold text-heading">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-base hover:bg-glass-bg-hover text-body transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-6 relative z-10">{children}</div>
      </div>
    </div>
  );
}
