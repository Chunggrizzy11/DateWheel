import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register all plugins once
gsap.registerPlugin(useGSAP, ScrollTrigger);

// Project-wide defaults per gsap-core skill
gsap.defaults({ duration: 0.5, ease: 'power2.out' });

export { gsap, useGSAP, ScrollTrigger };
