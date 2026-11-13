import type { RefObject } from 'react';
import { gsap, ScrollTrigger, ScrollSmoother, SplitText, useGSAP } from '../lib/gsap';

/**
 * Motion for the whole page, in one place:
 *  - the loader curtain and the hero entrance that follows it (the one orchestrated moment)
 *  - ScrollSmoother, so the page glides instead of jumping
 *  - SplitText headings that rise line by line, and a statement that fills in word by word
 *  - the pinned "craft" chapter that travels across one macro photograph
 *  - clip-path reveals for the product tiles
 *
 * Under prefers-reduced-motion none of this runs: the loader is skipped and every section
 * renders in its final state with native scrolling.
 */

let smoother: ScrollSmoother | null = null;

/** Scroll to an element, or to the top, through the smoother when it is running. */
export function scrollToTarget(target: Element | number) {
  if (smoother) {
    if (typeof target === 'number') smoother.scrollTo(target, true);
    else smoother.scrollTo(target, true, 'top top');
    return;
  }
  if (typeof target === 'number') window.scrollTo({ top: target });
  else target.scrollIntoView();
}

/** Freeze or release page scrolling (menu and dialog open). */
export function lockScroll(locked: boolean) {
  if (smoother) smoother.paused(locked);
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}

// Where the camera of the pinned chapter looks, as fractions of the macro photograph.
const FOCUS = [
  { x: 0.4, y: 0.14, s: 1.45 }, // titanium rim
  { x: 0.72, y: 0.38, s: 1.75 }, // lens surround
  { x: 0.82, y: 0.86, s: 1.5 }, // brushed back
];

const focusTo = ({ x, y, s }: { x: number; y: number; s: number }) => {
  const limit = (s - 1) * 50;
  const clamp = gsap.utils.clamp(-limit, limit);
  return {
    scale: s,
    xPercent: clamp(-s * (x - 0.5) * 100),
    yPercent: clamp(-s * (y - 0.5) * 100),
  };
};

export function useAzureMotion(scope: RefObject<HTMLElement>, onBooted: () => void) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const q = gsap.utils.selector(root);
      const html = document.documentElement;
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        onBooted();
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        let cancelled = false;
        html.classList.add('is-booting');
        // The intro always starts from the top, even after a reload deep in the page.
        if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
        window.scrollTo(0, 0);
        ScrollSmoother.get()?.kill();

        const sm = ScrollSmoother.create({
          wrapper: '#smooth-wrapper',
          content: '#smooth-content',
          smooth: 1.25,
          smoothTouch: false,
        });
        sm.paused(true);
        smoother = sm;

        // Depth effects (data-speed) only where cards sit in staggered columns; in a single
        // column they would slide over the text of the card above.
        const depth = gsap.matchMedia();
        depth.add('(min-width: 901px)', () => {
          const effects = sm.effects('[data-speed]');
          return () => effects.forEach((effect) => effect.kill());
        });

        /* ---------------------------------------------------------------- Header */
        const header = root.querySelector<HTMLElement>('.site-header');
        ScrollTrigger.create({
          start: 0,
          end: 'max',
          onUpdate: (self) => {
            const y = self.scroll();
            header?.classList.toggle('is-hidden', self.direction === 1 && y > 160);
            header?.classList.toggle('is-scrolled', y > 24);
          },
        });

        // Ink-on-ivory while the header sits over a light section.
        q<HTMLElement>('.theme-light').forEach((section) => {
          ScrollTrigger.create({
            trigger: section,
            start: 'top 38px',
            end: 'bottom 38px',
            onToggle: (self) => header?.classList.toggle('on-light', self.isActive),
          });
        });

        /* ---------------------------------------------------------------- Hero */
        let heroTitle: gsap.core.Animation | undefined;
        let heroSub: gsap.core.Animation | undefined;
        const heroHead = root.querySelector<HTMLElement>('.hero h1');
        const heroCopy = root.querySelector<HTMLElement>('.hero-sub');

        if (heroHead) {
          SplitText.create(heroHead, {
            type: 'lines,chars',
            mask: 'lines',
            linesClass: 'split-line',
            autoSplit: true,
            onSplit(self) {
              heroTitle = gsap.from(self.chars, {
                yPercent: 120,
                duration: 1.3,
                ease: 'expo.out',
                stagger: 0.028,
                paused: true,
              });
              return heroTitle;
            },
          });
        }
        if (heroCopy) {
          SplitText.create(heroCopy, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'split-line',
            autoSplit: true,
            onSplit(self) {
              heroSub = gsap.from(self.lines, {
                yPercent: 110,
                duration: 1.1,
                ease: 'expo.out',
                stagger: 0.09,
                paused: true,
              });
              return heroSub;
            },
          });
        }
        gsap.set(q('.hero-media'), { scale: 1.3 });
        gsap.set(q('.hero-actions > *, .hero-meta'), { autoAlpha: 0, y: 22 });
        gsap.set(header, { yPercent: -100, autoAlpha: 0 });

        const playHero = () => {
          gsap.to(q('.hero-media'), { scale: 1, duration: 2.6, ease: 'expo.out' });
          heroTitle?.play();
          gsap.delayedCall(0.35, () => heroSub?.play());
          gsap.to(q('.hero-actions > *, .hero-meta'), {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: 'expo.out',
            stagger: 0.1,
            delay: 0.65,
          });
          gsap.to(header, {
            yPercent: 0,
            autoAlpha: 1,
            duration: 1.1,
            ease: 'expo.out',
            delay: 0.5,
            clearProps: 'transform,opacity,visibility',
          });
        };

        // Scrolling away from the hero: the photograph drifts and settles, the copy lifts and fades.
        gsap.to(q('.hero-image'), {
          yPercent: 14,
          scale: 1.1,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to(q('.hero-inner'), {
          yPercent: -14,
          autoAlpha: 0.15,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: '70% top', scrub: true },
        });

        /* ---------------------------------------------------------------- Section headings */
        q<HTMLElement>('[data-split="lines"]').forEach((el) => {
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'split-line',
            autoSplit: true,
            onSplit(self) {
              return gsap.from(self.lines, {
                yPercent: 115,
                duration: 1.25,
                ease: 'expo.out',
                stagger: 0.1,
                scrollTrigger: { trigger: el, start: 'top 88%', once: true },
              });
            },
          });
        });

        /* ---------------------------------------------------------------- Statement: words fill in with scroll */
        q<HTMLElement>('[data-split="scrub"]').forEach((el) => {
          SplitText.create(el, {
            type: 'words',
            autoSplit: true,
            onSplit(self) {
              return gsap.fromTo(
                self.words,
                { opacity: 0.14 },
                {
                  opacity: 1,
                  ease: 'none',
                  stagger: 0.12,
                  scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
                },
              );
            },
          });
        });

        /* ---------------------------------------------------------------- Pinned craft chapter */
        const chapter = root.querySelector<HTMLElement>('.chapter');
        if (chapter) {
          chapter.classList.add('is-scrub');
          const image = chapter.querySelector('.chapter-image');
          const steps = gsap.utils.toArray<HTMLElement>('.chapter-step', chapter);
          const marks = gsap.utils.toArray<HTMLElement>('.chapter-mark', chapter);

          gsap.set(steps.slice(1), { autoAlpha: 0, y: 36 });
          gsap.set(marks.slice(1), { opacity: 0.38 });

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: chapter,
              start: 'top top',
              end: '+=320%',
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          tl.fromTo(
            image,
            { scale: 1.04, xPercent: 0, yPercent: 0 },
            { ...focusTo(FOCUS[0]), duration: 1.1, ease: 'power2.inOut' },
            0,
          )
            .to(image, { ...focusTo(FOCUS[1]), duration: 1.1, ease: 'power2.inOut' }, 1.5)
            .to(image, { ...focusTo(FOCUS[2]), duration: 1.1, ease: 'power2.inOut' }, 3)
            .to('.chapter-fill', { scaleX: 1, duration: 4.5 }, 0)
            .to(steps[0], { autoAlpha: 0, y: -36, duration: 0.4 }, 1.3)
            .to(marks[0], { opacity: 0.38, duration: 0.3 }, 1.3)
            .to(steps[1], { autoAlpha: 1, y: 0, duration: 0.4 }, 1.6)
            .to(marks[1], { opacity: 1, duration: 0.3 }, 1.6)
            .to(steps[1], { autoAlpha: 0, y: -36, duration: 0.4 }, 2.8)
            .to(marks[1], { opacity: 0.38, duration: 0.3 }, 2.8)
            .to(steps[2], { autoAlpha: 1, y: 0, duration: 0.4 }, 3.1)
            .to(marks[2], { opacity: 1, duration: 0.3 }, 3.1)
            .to({}, { duration: 0.5 }, 4);
        }

        /* ---------------------------------------------------------------- Product reveals */
        const cards = q<HTMLElement>('[data-card]');
        gsap.set(q('.reveal-clip'), { clipPath: 'inset(100% 0% 0% 0%)' });
        gsap.set(q('.card-meta'), { autoAlpha: 0, y: 18 });
        ScrollTrigger.batch(cards, {
          start: 'top 94%',
          once: true,
          onEnter: (batch) => {
            gsap.to(
              batch.map((card) => card.querySelector('.reveal-clip')),
              { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.25, ease: 'expo.inOut', stagger: 0.08 },
            );
            gsap.to(
              batch.map((card) => card.querySelector('.card-meta')),
              { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08, delay: 0.4 },
            );
          },
        });

        /* ---------------------------------------------------------------- Footer wordmark */
        // The wordmark rises into its frame and finishes exactly when the page reaches the bottom.
        const mega = root.querySelector<HTMLElement>('.mega');
        if (mega) {
          gsap.fromTo(
            mega,
            { yPercent: 42, opacity: 0.15 },
            {
              yPercent: 0,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: '.site-footer',
                start: 'top 85%',
                end: 'bottom bottom',
                scrub: 0.6,
              },
            },
          );
        }

        /* ---------------------------------------------------------------- In-page links glide */
        const onClick = (event: MouseEvent) => {
          const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
          if (!link || event.defaultPrevented) return;
          const hash = link.getAttribute('href') ?? '';
          const target = hash.length > 1 ? document.querySelector(hash) : null;
          if (hash !== '#home' && !target) return;
          event.preventDefault();
          const where = hash === '#home' || !target ? 0 : target;
          // Links inside the menu or dialog fire while scrolling is still locked; wait for the unlock.
          if (link.closest('.menu-panel, dialog')) setTimeout(() => scrollToTarget(where), 160);
          else scrollToTarget(where);
        };
        root.addEventListener('click', onClick);

        /* ---------------------------------------------------------------- Loader */
        // Quiet, in the manner of a device start-up screen: the mark fades up and catches the light
        // while a thin line fills beneath it; then the mark swells away and the page appears behind it.
        const loader = root.querySelector<HTMLElement>('.loader');
        const bar = root.querySelector<HTMLElement>('.loader-bar');

        const finish = () => {
          if (cancelled) return;
          sm.paused(false);
          html.classList.remove('is-booting');
          onBooted();
          ScrollTrigger.refresh();
        };

        if (!loader) {
          playHero();
          finish();
        } else {
          const progress = { value: 0 };
          const paint = () => {
            if (bar) bar.style.transform = `scaleX(${progress.value / 100})`;
          };

          gsap.fromTo(
            '.loader-glyph',
            { autoAlpha: 0, scale: 0.86 },
            { autoAlpha: 1, scale: 1, duration: 1.5, ease: 'expo.out', delay: 0.1 },
          );
          gsap.fromTo(
            '.loader-track',
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.9, ease: 'power2.out', delay: 0.5 },
          );
          // A band of light travels across the mark while it loads.
          const sweep = gsap.fromTo(
            '#azure-shine',
            { attr: { x1: -30, x2: -10 } },
            {
              attr: { x1: 50, x2: 70 },
              duration: 1.5,
              ease: 'power1.inOut',
              repeat: -1,
              repeatDelay: 0.35,
              delay: 0.5,
            },
          );

          const crawl = gsap.to(progress, {
            value: 86,
            duration: 1.9,
            ease: 'power2.out',
            onUpdate: paint,
          });

          const reveal = () => {
            sweep.kill();
            gsap
              .timeline({ onComplete: finish })
              .to('.loader-track', { autoAlpha: 0, duration: 0.4, ease: 'power2.out' })
              .to('#azure-shine stop', { attr: { 'stop-opacity': 1 }, duration: 0.4 }, '<')
              .add(playHero, '+=0.1')
              .to('.loader-glyph', { scale: 1.6, autoAlpha: 0, duration: 1.05, ease: 'power3.in' }, '<')
              .to(loader, { autoAlpha: 0, duration: 1.1, ease: 'power2.inOut' }, '<0.2');
          };

          const heroImg = root.querySelector<HTMLImageElement>('.hero-image');
          const ready = Promise.all([
            document.fonts ? document.fonts.ready : Promise.resolve(),
            heroImg?.decode ? heroImg.decode().catch(() => undefined) : Promise.resolve(),
            new Promise((resolve) => setTimeout(resolve, 1500)),
          ]);
          const patience = new Promise((resolve) => setTimeout(resolve, 6000));
          Promise.race([ready, patience]).then(() => {
            if (cancelled) return;
            crawl.kill();
            gsap.to(progress, {
              value: 100,
              duration: 0.55,
              ease: 'power2.inOut',
              onUpdate: paint,
              onComplete: reveal,
            });
          });
        }

        return () => {
          cancelled = true;
          root.removeEventListener('click', onClick);
          chapter?.classList.remove('is-scrub');
          html.classList.remove('is-booting');
          depth.revert();
          sm.kill();
          if (smoother === sm) smoother = null;
        };
      });

      return () => mm.revert();
    },
    { scope },
  );
}
