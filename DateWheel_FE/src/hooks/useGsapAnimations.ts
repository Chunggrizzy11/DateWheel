/**
 * usePageEntrance — Animates all children of the container ref on mount.
 * Per gsap-react skill: use useGSAP with scope ref, cleanup is automatic.
 */
import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';

export function usePageEntrance() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Stagger in all direct card/section children
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 768px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { reduceMotion } = context.conditions!;

          gsap.from('[data-gsap="card"]', {
            autoAlpha: 0,
            y: reduceMotion ? 0 : 32,
            duration: reduceMotion ? 0 : 0.55,
            stagger: { each: 0.08, from: 'start' },
            ease: 'power3.out',
            clearProps: 'all',
          });

          gsap.from('[data-gsap="title"]', {
            autoAlpha: 0,
            y: reduceMotion ? 0 : -20,
            duration: reduceMotion ? 0 : 0.4,
            ease: 'power2.out',
            clearProps: 'all',
          });
        }
      );

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return containerRef;
}

/**
 * useHoverTilt — Adds a subtle 3D tilt effect on hover to an element.
 */
export function useHoverTilt<T extends HTMLElement = HTMLDivElement>(externalRef?: React.RefObject<T>, enabled: boolean = true) {
  const internalRef = useRef<T>(null);
  const ref = externalRef || internalRef;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !enabled) return;

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        let rafId = 0;

        const onMove = (e: MouseEvent) => {
          // Throttle to one GSAP tween per animation frame
          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => {
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width / 2);
            const dy = (e.clientY - cy) / (rect.height / 2);
            gsap.to(el, {
              rotationY: dx * 6,
              rotationX: -dy * 6,
              scale: 1.02,
              duration: 0.3,
              ease: 'power2.out',
              transformPerspective: 800,
              overwrite: true,
            });
          });
        };
        const onLeave = () => {
          cancelAnimationFrame(rafId);
          gsap.to(el, {
            rotationY: 0,
            rotationX: 0,
            scale: 1,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: true,
          });
        };

        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        return () => {
          cancelAnimationFrame(rafId);
          el.removeEventListener('mousemove', onMove);
          el.removeEventListener('mouseleave', onLeave);
        };
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [enabled] }
  );

  return ref;
}

/**
 * useCountUp — Animates a number from 0 to target value.
 */
export function useCountUp(target: number) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || target === 0) return;

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1,
          ease: 'power2.out',
          onUpdate() {
            el.textContent = Math.round(obj.val).toString();
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [target] }
  );

  return ref;
}
