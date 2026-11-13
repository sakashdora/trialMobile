import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';

// The plugins touch `document` while registering, so they are skipped during
// server-side rendering (the unit tests render the app in Node).
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, Flip, useGSAP);

  // Mobile browsers resize the viewport as the address bar hides; ignore that
  // so pinned chapters do not jump.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, Flip, useGSAP };
