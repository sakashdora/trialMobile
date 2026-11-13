import React, { useRef } from 'react';
import { RotateCw, ArrowUpRight, ArrowRight } from 'lucide-react';
import { useBag } from '../../context/BagContext';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../lib/gsap';

export const HeroSection: React.FC = () => {
  const { addItem } = useBag();
  const heroContainerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const gleamRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const handleConfigurePro = () => {
    addItem({
      model: 'pro',
      name: 'AZURE One Pro',
      price: 69999,
      image: '/assets/images/products/azure-pro.png',
      finish: 'Cosmic Azure',
      storage: '256 GB',
    });
  };

  useGSAP(
    () => {
      // Check for prefers-reduced-motion
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Badge entrance
      tl.fromTo('.hero-badge-pill', { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.8 });

      // Headline character/word entrance reveal
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.hero-headline-word');
        tl.fromTo(
          words,
          { opacity: 0, y: 32, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.08 },
          '-=0.5',
        );
      }

      // Lead copy
      tl.fromTo('.hero-lead', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.4');

      // Phone render rises 32px with specular reflection gleam
      if (phoneRef.current) {
        tl.fromTo(
          phoneRef.current,
          { opacity: 0, y: 32, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power2.out' },
          '-=0.6',
        );
      }

      // Specular gleam sweeps across the phone
      if (gleamRef.current) {
        tl.fromTo(
          gleamRef.current,
          { x: '-100%', opacity: 0 },
          { x: '100%', opacity: 0.6, duration: 1.1, ease: 'power1.inOut' },
          '-=0.7',
        );
      }

      // CTA Buttons and 360 pill
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current.children,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
          '-=0.6',
        );
      }

      // Stats row
      if (statsRef.current) {
        tl.fromTo(
          statsRef.current.children,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 },
          '-=0.5',
        );
      }
    },
    { scope: heroContainerRef },
  );

  return (
    <section
      id="home"
      data-enter
      ref={heroContainerRef}
      className="relative w-full min-h-screen flex flex-col justify-between pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden bg-black select-none"
    >
      {/* Ambient cyan backdrop atmospheric glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[750px] h-[350px] sm:h-[450px] rounded-full bg-azure-cyan/10 blur-[130px] pointer-events-none -z-10" />

      {/* Top Header Block: Badge + Titanium Display Headline + Lead */}
      <div className="text-center pt-2 sm:pt-6 z-10 max-w-4xl mx-auto">
        <div className="hero-badge-pill inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/[0.05] border border-white/10 mb-4 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-azure-cyan animate-pulse" />
          <span className="text-[11px] font-semibold tracking-wider text-zinc-300 uppercase">
            FLAGSHIP SMARTPHONE COLLECTION
          </span>
        </div>

        <h1
          ref={headlineRef}
          className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tighter text-white leading-[1.08] text-balance"
        >
          <span className="hero-headline-word inline-block mr-2 sm:mr-3">AZURE</span>
          <span className="hero-headline-word inline-block mr-2 sm:mr-3">Flagship</span>
          <span className="hero-headline-word inline-block mr-2 sm:mr-3">Smartphones.</span>
          <br className="hidden sm:inline" />
          <span className="hero-headline-word inline-block bg-gradient-to-r from-azure-cyan via-white to-blue-400 bg-clip-text text-transparent italic tracking-tight font-normal">
            Built Beyond Limits.
          </span>
        </h1>

        <p className="hero-lead mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Sculpted Grade-5 titanium chassis, ProVision periscope optics, and A19 Ultra silicon.
          Designed to deliver uncompromising speed and timeless elegance.
        </p>

        {/* Primary and Secondary Action CTAs */}
        <div ref={ctaRef} className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            data-product="pro"
            onClick={handleConfigurePro}
            className="shimmer-btn px-6 py-3 rounded-full text-white text-sm font-semibold flex items-center space-x-2 shadow-xl shadow-azure-cyan/20 hover:-translate-y-0.5 active:translate-y-0 transition-transform duration-200"
          >
            <span>Configure One Pro</span>
            <ArrowUpRight className="w-4 h-4 text-azure-cyan" />
          </button>

          <a
            href="#collection"
            className="px-6 py-3 rounded-full btn-secondary text-sm font-medium flex items-center space-x-2 hover:-translate-y-0.5 active:translate-y-0 transition-transform duration-200"
          >
            <span>Explore Handsets</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Hero Visual: Azure One Pro Render with Specular Gleam & 360 Pill */}
      <div className="relative my-4 sm:my-6 flex items-center justify-center">
        <div
          ref={phoneRef}
          className="relative z-10 max-w-[280px] sm:max-w-[360px] lg:max-w-[400px] mx-auto filter drop-shadow-[0_30px_50px_rgba(56,189,248,0.22)] hover:scale-[1.02] transition-transform duration-500 overflow-hidden"
        >
          <img
            src="/assets/images/products/azure-pro.png"
            alt="AZURE One Pro in Cosmic Azure Titanium"
            className="w-full h-auto object-contain block"
            {...({ fetchpriority: 'high' } as Record<string, string>)}
          />

          {/* Specular gleam overlay sweep */}
          <div
            ref={gleamRef}
            className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
          />

          {/* 360 Titanium View Pill */}
          <a
            href="#design"
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-xs font-medium text-white flex items-center space-x-2.5 hover:bg-black/90 hover:border-azure-cyan/50 hover:scale-105 active:scale-95 transition-all shadow-xl group"
          >
            <RotateCw className="w-3.5 h-3.5 text-azure-cyan group-hover:rotate-180 transition-transform duration-500" />
            <span className="tracking-wide">360° Titanium View</span>
          </a>
        </div>
      </div>

      {/* Key Facts / Metrics Row */}
      <div
        ref={statsRef}
        className="hero-facts grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto w-full pt-4 border-t border-white/10 text-center z-10"
      >
        <div className="p-2">
          <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">48MP</p>
          <p className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider mt-0.5">
            ProVision Optics
          </p>
        </div>
        <div className="p-2 border-x border-white/10">
          <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">A19 Ultra</p>
          <p className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider mt-0.5">
            Neural Silicon
          </p>
        </div>
        <div className="p-2">
          <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">120Hz</p>
          <p className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider mt-0.5">
            ProMotion OLED
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
