import { HTMLAttributes, forwardRef, useRef } from 'react';
import { cn } from '../../lib/utils';
import { useHoverTilt } from '../../hooks/useGsapAnimations';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glass?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, glass = true, children, ...props }, forwardedRef) => {
    // If the parent didn't provide a ref, create an internal one to pass to useHoverTilt
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement>) || internalRef;
    
    // Apply GSAP tilt effect if hover is enabled
    useHoverTilt(ref, hover);

    return (
      <div
        ref={ref}
        className={cn(
          'p-6',
          hover && 'hover-lift cursor-pointer',
          glass ? 'glass-card' : 'rounded-base border border-border-default bg-neutral-primary-soft shadow-sm',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
export default Card;
