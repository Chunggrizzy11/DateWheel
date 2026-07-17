import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';

/**
 * PageTransition — Wraps page content with a GSAP fade+slide entrance.
 * Per gsap-react skill: scope is passed as the containerRef so selectors
 * only affect children of this wrapper; cleanup is automatic on unmount.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      gsap.from(containerRef.current, {
        autoAlpha: 0,
        y: reduceMotion ? 0 : 16,
        duration: reduceMotion ? 0 : 0.35,
        ease: 'power2.out',
        clearProps: 'all',
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} style={{ visibility: 'hidden' }}>
      {children}
    </div>
  );
}
