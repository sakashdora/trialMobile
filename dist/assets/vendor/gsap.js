import { gsap } from './gsap/index.js';
import { ScrollTrigger } from './gsap/ScrollTrigger.js';
import { ScrollSmoother } from './gsap/ScrollSmoother.js';
import { ScrollToPlugin } from './gsap/ScrollToPlugin.js';
import { TextPlugin } from './gsap/TextPlugin.js';
import { MotionPathPlugin } from './gsap/MotionPathPlugin.js';
import { MorphSVGPlugin } from './gsap/MorphSVGPlugin.js';
import { ScrambleTextPlugin } from './gsap/ScrambleTextPlugin.js';

gsap.registerPlugin(
  ScrollTrigger,
  ScrollSmoother,
  ScrollToPlugin,
  TextPlugin,
  MotionPathPlugin,
  MorphSVGPlugin,
  ScrambleTextPlugin
);

export {
  gsap,
  ScrollTrigger,
  ScrollSmoother,
  ScrollToPlugin,
  TextPlugin,
  MotionPathPlugin,
  MorphSVGPlugin,
  ScrambleTextPlugin,
};
