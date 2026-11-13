import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

// Configure ScrollTrigger defaults to prevent resize thrashing on mobile browsers
if (typeof window !== 'undefined') {
  ScrollTrigger.config({
    ignoreMobileResize: true,
    limitCallbacks: true,
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize',
  });

  // Ensure scroll trigger refreshes once web fonts are fully loaded
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }
}

export { gsap, ScrollTrigger, useGSAP };
