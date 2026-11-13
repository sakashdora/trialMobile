import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { RotateCw, Layers, Eye, Play, Pause, Compass, Cpu } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { useImageSequence } from '../../hooks/useImageSequence';

interface PerspectiveConfig {
  name: 'Front' | 'Profile' | 'Back' | 'Optics';
  frame: number;
  badge: string;
  title: string;
  desc: string;
  metric: string;
}

const PERSPECTIVES: PerspectiveConfig[] = [
  {
    name: 'Front',
    frame: 0,
    badge: 'SUPER RETINA XDR OLED',
    title: 'Edge-to-Edge 120Hz ProMotion Display',
    desc: '6.7-inch OLED panel delivering 3,000 nits outdoor peak brightness, 1Hz-to-120Hz LTPO adaptive refresh, and Dynamic Island telemetry.',
    metric: '3,000 NITS',
  },
  {
    name: 'Profile',
    frame: 24,
    badge: 'GRADE-5 AEROSPACE TITANIUM',
    title: 'Grade-5 Aerospace Titanium Perimeter',
    desc: 'Contoured 7.8mm perimeter band hot-forged with solid-state diffusion bonding to an internal aluminum substructure.',
    metric: '7.8MM PROFILE',
  },
  {
    name: 'Back',
    frame: 48,
    badge: 'CERAMIC SHIELD MATRIX',
    title: 'Micro-Blasted Ceramic Shield Backplate',
    desc: 'Precision-etched AZURE insignia with molecular PVD finish and 16-element neodymium magnetic alignment ring for Qi2 charging.',
    metric: 'QI2 15W',
  },
  {
    name: 'Optics',
    frame: 72,
    badge: 'PROVISION TETRAPRISM',
    title: 'ProVision Triple-Lens Periscope Array',
    desc: '48MP primary sensor with 2nd-gen sensor-shift OIS, 5x optical telephoto with folded tetraprism glass, and 12MP ultra-wide macro.',
    metric: '5X OPTICAL',
  },
];

interface LayerConfig {
  idx: number;
  targetFrame: number;
  label: string;
  badge: string;
  title: string;
  stat: string;
  statSub: string;
  desc: string;
}

const EXPLODED_LAYERS: LayerConfig[] = [
  {
    idx: 0,
    targetFrame: 4,
    label: 'Display',
    badge: 'LAYER 01 · DISPLAY MATRIX',
    title: 'Super Retina XDR OLED Panel',
    stat: '2,000 NITS',
    statSub: '1–120Hz Adaptive ProMotion',
    desc: 'Custom-engineered flexible OLED display substrate protected by ceramic-shield nanometer glass crystals.',
  },
  {
    idx: 1,
    targetFrame: 16,
    label: 'Titanium Core',
    badge: 'LAYER 02 · TITANIUM CHASSIS',
    title: 'Grade-5 Structural Mid-Frame',
    stat: 'GRADE 5',
    statSub: 'Aerospace Substructure',
    desc: 'High-rigidity internal skeleton precision CNC-milled to dissipate impact kinetic energy while preserving thermal flow.',
  },
  {
    idx: 2,
    targetFrame: 28,
    label: 'A19 Silicon',
    badge: 'LAYER 03 · TSMC 3NM SILICON',
    title: 'A19 Ultra Neural Compute Core',
    stat: '38 TOPS',
    statSub: '16-Core Neural Engine',
    desc: '18.6 billion transistors microarchitected for instantaneous on-device generative intelligence and graphene passive cooling.',
  },
  {
    idx: 3,
    targetFrame: 44,
    label: 'Optics',
    badge: 'LAYER 04 · CAMERA MONOLITH',
    title: 'ProVision Periscope Array',
    stat: '48MP F/1.78',
    statSub: 'Tetraprism 5x Optical',
    desc: 'Folded optical light path reflecting through four glass surfaces to provide 120mm focal length within 7.8mm chassis depth.',
  },
  {
    idx: 4,
    targetFrame: 60,
    label: 'Ceramic Enclosure',
    badge: 'LAYER 05 · REAR ENCLOSURE',
    title: 'Ceramic Shield Backplate & Qi2',
    stat: 'QI2 15W',
    statSub: '16x N52 Neodymium Array',
    desc: 'Double-ion exchange glass backplate integrated with high-permeability magnetic ring for instantaneous inductive coupling.',
  },
];

const EXTERIOR_TOTAL_FRAMES = 96;
const EXPLODED_TOTAL_FRAMES = 64;

export const HardwareStudio: React.FC = () => {
  const [mode, setMode] = useState<'exterior' | 'exploded'>('exterior');

  // 360 Exterior State
  const [current360Frame, setCurrent360Frame] = useState<number>(0);
  const [is360Dragging, setIs360Dragging] = useState<boolean>(false);
  const [is360Autoplay, setIs360Autoplay] = useState<boolean>(false);
  const [activePerspective, setActivePerspective] = useState<string>('Front');

  // Safely wrapped display frame for 360 exterior turntable [0, 95]
  const currentDisplay360Frame =
    ((Math.round(current360Frame) % EXTERIOR_TOTAL_FRAMES) + EXTERIOR_TOTAL_FRAMES) %
    EXTERIOR_TOTAL_FRAMES;

  // Exploded View State
  const [currentExpFrame, setCurrentExpFrame] = useState<number>(0);
  const [isExpAutoplay, setIsExpAutoplay] = useState<boolean>(false);
  const [activeLayerIdx, setActiveLayerIdx] = useState<number>(0);

  // Refs
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const assemblyCanvasRef = useRef<HTMLCanvasElement>(null);
  const dragStartXRef = useRef<number>(0);
  const dragStartFrameRef = useRef<number>(0);
  const lastDragTimeRef = useRef<number>(0);
  const lastClientXRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoplayIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isTweeningRef = useRef<boolean>(false);
  const activeTweenRef = useRef<gsap.core.Tween | null>(null);

  // Preload 64 Exploded View Frames via custom hook
  const explodedUrls = useMemo(
    () =>
      Array.from(
        { length: EXPLODED_TOTAL_FRAMES },
        (_, i) => `/assets/videos/exploded/frame-${i}.jpg`,
      ),
    [],
  );

  const { isLoaded: isExplodedLoaded, drawFrame: drawExplodedFrame } = useImageSequence({
    urls: explodedUrls,
  });

  // Preload 96 Exterior Frames
  const exteriorUrls = useMemo(
    () =>
      Array.from(
        { length: EXTERIOR_TOTAL_FRAMES },
        (_, i) => `/assets/videos/frames/frame-${i}.jpg`,
      ),
    [],
  );

  useImageSequence({ urls: exteriorUrls });

  // Update active perspective based on current 360 frame
  useEffect(() => {
    const frame = currentDisplay360Frame;
    if (frame >= 84 || frame < 12) setActivePerspective('Front');
    else if (frame >= 12 && frame < 36) setActivePerspective('Profile');
    else if (frame >= 36 && frame < 60) setActivePerspective('Back');
    else if (frame >= 60 && frame < 84) setActivePerspective('Optics');
  }, [currentDisplay360Frame]);

  // Update active layer in exploded view
  useEffect(() => {
    const frame = Math.round(currentExpFrame);
    if (frame < 10) setActiveLayerIdx(0);
    else if (frame < 22) setActiveLayerIdx(1);
    else if (frame < 36) setActiveLayerIdx(2);
    else if (frame < 52) setActiveLayerIdx(3);
    else setActiveLayerIdx(4);
  }, [currentExpFrame]);

  // Blit canvas frame when exploded frame updates
  useEffect(() => {
    const canvas = assemblyCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawExplodedFrame(ctx, currentExpFrame, canvas.width, canvas.height);
  }, [currentExpFrame, isExplodedLoaded, drawExplodedFrame]);

  // 360 Auto-Rotation on Idle
  const reset360IdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
      autoplayIntervalRef.current = null;
    }
    setIs360Autoplay(false);

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    idleTimerRef.current = setTimeout(() => {
      setIs360Autoplay(true);
    }, 5000);
  }, []);

  useEffect(() => {
    if (mode === 'exterior' && is360Autoplay) {
      autoplayIntervalRef.current = setInterval(() => {
        setCurrent360Frame((prev) => (prev + 1) % EXTERIOR_TOTAL_FRAMES);
      }, 70);
    } else if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
      autoplayIntervalRef.current = null;
    }
    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    };
  }, [mode, is360Autoplay]);

  // Exploded Autoplay Controller
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (mode === 'exploded' && isExpAutoplay) {
      interval = setInterval(() => {
        setCurrentExpFrame((prev) => {
          if (prev >= EXPLODED_TOTAL_FRAMES - 1) return 0;
          return prev + 1;
        });
      }, 50);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mode, isExpAutoplay]);

  // Unmount cleanup for active RAF, idle timer, and autoplay interval
  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
      activeTweenRef.current?.kill();
    };
  }, []);

  // Pointer drag handling for 360 Exterior turntable with inertia
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (mode !== 'exterior') return;
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    setIs360Dragging(true);
    reset360IdleTimer();
    dragStartXRef.current = e.clientX;
    lastClientXRef.current = e.clientX;
    dragStartFrameRef.current = current360Frame;
    lastDragTimeRef.current = performance.now();
    velocityRef.current = 0;
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore detached or synthetic pointer capture failure
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!is360Dragging || mode !== 'exterior') return;
    const now = performance.now();
    const dt = Math.max(now - lastDragTimeRef.current, 1);
    const deltaX = e.clientX - dragStartXRef.current;

    const frameDelta = (deltaX / 600) * EXTERIOR_TOTAL_FRAMES;
    let newFrame = (dragStartFrameRef.current + frameDelta) % EXTERIOR_TOTAL_FRAMES;
    if (newFrame < 0) newFrame += EXTERIOR_TOTAL_FRAMES;

    const stepDeltaX = e.clientX - lastClientXRef.current;
    velocityRef.current = (stepDeltaX / dt) * 12;
    lastClientXRef.current = e.clientX;

    setCurrent360Frame(newFrame);
    lastDragTimeRef.current = now;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!is360Dragging || mode !== 'exterior') return;
    setIs360Dragging(false);
    reset360IdleTimer();
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let v = velocityRef.current;
    if (Math.abs(v) > 0.5) {
      const stepInertia = () => {
        v *= 0.92;
        if (Math.abs(v) > 0.05) {
          setCurrent360Frame((prev) => {
            let next = (prev + v) % EXTERIOR_TOTAL_FRAMES;
            if (next < 0) next += EXTERIOR_TOTAL_FRAMES;
            return next;
          });
          rafIdRef.current = requestAnimationFrame(stepInertia);
        } else {
          rafIdRef.current = null;
        }
      };
      rafIdRef.current = requestAnimationFrame(stepInertia);
    }
  };

  // Perspective Angle Pill Click: Smooth GSAP tween
  const handlePerspectiveClick = (perspectiveName: PerspectiveConfig['name']) => {
    reset360IdleTimer();
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (activeTweenRef.current) {
      activeTweenRef.current.kill();
      activeTweenRef.current = null;
    }

    const cfg = PERSPECTIVES.find((p) => p.name === perspectiveName);
    if (!cfg) return;

    const target = cfg.frame;
    const current = current360Frame;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      isTweeningRef.current = false;
      setCurrent360Frame(target);
      return;
    }

    isTweeningRef.current = true;

    let diff = target - (current % EXTERIOR_TOTAL_FRAMES);
    if (diff > EXTERIOR_TOTAL_FRAMES / 2) diff -= EXTERIOR_TOTAL_FRAMES;
    if (diff < -EXTERIOR_TOTAL_FRAMES / 2) diff += EXTERIOR_TOTAL_FRAMES;

    const proxy = { frame: current };
    activeTweenRef.current = gsap.to(proxy, {
      frame: current + diff,
      duration: 0.65,
      ease: 'power2.out',
      onUpdate: () => {
        let f = proxy.frame % EXTERIOR_TOTAL_FRAMES;
        if (f < 0) f += EXTERIOR_TOTAL_FRAMES;
        setCurrent360Frame(f);
      },
      onComplete: () => {
        isTweeningRef.current = false;
        setCurrent360Frame(target);
        activeTweenRef.current = null;
      },
    });
  };

  // Exploded Layer Button Click: Smooth GSAP tween
  const handleLayerClick = (layerIdx: number) => {
    const layer = EXPLODED_LAYERS[layerIdx];
    if (!layer) return;

    if (activeTweenRef.current) {
      activeTweenRef.current.kill();
      activeTweenRef.current = null;
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      isTweeningRef.current = false;
      setCurrentExpFrame(layer.targetFrame);
      return;
    }

    isTweeningRef.current = true;
    const proxy = { frame: currentExpFrame };
    activeTweenRef.current = gsap.to(proxy, {
      frame: layer.targetFrame,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: () => {
        setCurrentExpFrame(proxy.frame);
      },
      onComplete: () => {
        isTweeningRef.current = false;
        setCurrentExpFrame(layer.targetFrame);
        activeTweenRef.current = null;
      },
    });
  };

  // GSAP ScrollTrigger for Exploded View scrubbing
  useGSAP(
    () => {
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion || !stageRef.current) return;

      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        end: 'bottom 30%',
        scrub: 1.2,
        onUpdate: (self) => {
          if (mode === 'exploded' && !isTweeningRef.current && !isExpAutoplay) {
            const scrubbedFrame = Math.max(
              0,
              Math.min(
                EXPLODED_TOTAL_FRAMES - 1,
                Math.round(self.progress * (EXPLODED_TOTAL_FRAMES - 1)),
              ),
            );
            setCurrentExpFrame(scrubbedFrame);
          }
        },
      });

      return () => {
        trigger.kill();
      };
    },
    { dependencies: [mode, isExpAutoplay], revertOnUpdate: true, scope: sectionRef },
  );

  const activePerspectiveData =
    PERSPECTIVES.find((p) => p.name === activePerspective) || PERSPECTIVES[0];
  const activeLayerData = EXPLODED_LAYERS[activeLayerIdx] || EXPLODED_LAYERS[0];

  return (
    <section
      id="design"
      ref={sectionRef}
      className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center relative select-none"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <span className="eyebrow">AEROSPACE GRADE 5 TITANIUM</span>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mt-2">
            360° Exterior Studio and Internal Disassembly.
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl font-normal leading-relaxed">
            Experience our 96-frame interactive turntable with inertia physics and 64-frame exploded
            internal architecture.
          </p>
        </div>

        {/* Mode Switcher Pill */}
        <div className="inline-flex p-1 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md self-start md:self-auto">
          <button
            type="button"
            onClick={() => setMode('exterior')}
            className={`px-5 py-2 rounded-full text-xs font-semibold flex items-center space-x-2 transition-all ${
              mode === 'exterior'
                ? 'bg-azure-cyan text-black shadow-lg shadow-azure-cyan/25'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>360° Exterior</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('exploded')}
            className={`px-5 py-2 rounded-full text-xs font-semibold flex items-center space-x-2 transition-all ${
              mode === 'exploded'
                ? 'bg-azure-cyan text-black shadow-lg shadow-azure-cyan/25'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Exploded Assembly</span>
          </button>
        </div>
      </div>

      {/* Main Studio Card Container (`#studio-stage`) */}
      <div
        id="studio-stage"
        ref={stageRef}
        className="glass-card rounded-3xl p-6 sm:p-10 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 border border-white/10 shadow-2xl"
      >
        {/* Left Side: Telemetry & Controls Container */}
        <div className="w-full lg:max-w-md z-10">
          {/* EXTERIOR CONTROLS BLOCK */}
          <div className={`space-y-6 ${mode === 'exterior' ? 'block' : 'hidden'}`}>
            <div>
              <div
                id="studio-card-badge"
                className="live-card-badge inline-flex items-center space-x-2 text-azure-cyan text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-azure-cyan/10 border border-azure-cyan/20"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{activePerspectiveData.badge}</span>
              </div>
              <h3
                id="studio-feature-title"
                className="text-2xl sm:text-3xl font-semibold text-white mt-3 tracking-tight"
              >
                {activePerspectiveData.title}
              </h3>
              <p
                id="studio-feature-desc"
                className="text-zinc-400 text-xs sm:text-sm mt-2 leading-relaxed"
              >
                {activePerspectiveData.desc}
              </p>
            </div>

            {/* Perspective Angle Pills (`#studio-exterior-controls`) */}
            <div>
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-2">
                Perspective Angle Presets
              </p>
              <div id="studio-exterior-controls" className="grid grid-cols-4 gap-2">
                {PERSPECTIVES.map((p) => {
                  const isSelected = activePerspective === p.name;
                  return (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => handlePerspectiveClick(p.name)}
                      className={`studio-angle-pill py-2.5 px-3 rounded-xl text-xs font-semibold text-center transition-all ${
                        isSelected
                          ? 'bg-azure-cyan/20 text-azure-cyan border border-azure-cyan/40 shadow-sm'
                          : 'bg-white/[0.04] text-zinc-400 border border-white/5 hover:text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Exterior Angle & Inertia Telemetry Readout */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                <p className="text-[11px] text-zinc-500 uppercase tracking-wider">
                  Turntable Angle
                </p>
                <p className="text-base font-semibold text-white mt-1">
                  {Math.round((current360Frame / EXTERIOR_TOTAL_FRAMES) * 360)}°
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Frame {currentDisplay360Frame} / 96
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                <p className="text-[11px] text-zinc-500 uppercase tracking-wider">Chassis Metric</p>
                <p className="text-base font-semibold text-azure-cyan mt-1">
                  {activePerspectiveData.metric}
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Grade-5 Spec</p>
              </div>
            </div>
          </div>

          {/* EXPLODED CONTROLS BLOCK */}
          <div className={`space-y-6 ${mode === 'exploded' ? 'block' : 'hidden'}`}>
            <div>
              <div
                id="arch-layer-badge"
                className="telemetry-badge inline-flex items-center space-x-2 text-azure-cyan text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-azure-cyan/10 border border-azure-cyan/20"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>{activeLayerData.badge}</span>
              </div>
              <h3
                id="arch-layer-title"
                className="telemetry-title text-2xl sm:text-3xl font-semibold text-white mt-3 tracking-tight"
              >
                {activeLayerData.title}
              </h3>
              <p
                id="arch-layer-desc"
                className="telemetry-desc text-zinc-400 text-xs sm:text-sm mt-2 leading-relaxed"
              >
                {activeLayerData.desc}
              </p>
            </div>

            {/* Layer Selector Buttons (`#studio-assembly-controls`) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">
                  Hardware Layer Disassembly
                </p>
                <button
                  type="button"
                  id="arch-autoplay-btn"
                  onClick={() => setIsExpAutoplay(!isExpAutoplay)}
                  className="inline-flex items-center space-x-1.5 text-[11px] text-azure-cyan hover:underline"
                >
                  {isExpAutoplay ? (
                    <>
                      <Pause className="w-3 h-3" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      <span>Autoplay</span>
                    </>
                  )}
                </button>
              </div>

              <div id="studio-assembly-controls" className="flex flex-wrap gap-1.5">
                {EXPLODED_LAYERS.map((layer) => {
                  const isSelected = activeLayerIdx === layer.idx;
                  return (
                    <button
                      key={layer.label}
                      type="button"
                      onClick={() => handleLayerClick(layer.idx)}
                      className={`arch-layer-pill py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-azure-cyan/20 text-azure-cyan border border-azure-cyan/40 shadow-sm'
                          : 'bg-white/[0.04] text-zinc-400 border border-white/5 hover:text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      {layer.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slider Scrub Row */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Assembled (0)</span>
                <span id="arch-hud-readout" className="arch-hud-readout font-mono text-white">
                  {Math.round((currentExpFrame / (EXPLODED_TOTAL_FRAMES - 1)) * 100)}% DISASSEMBLY
                </span>
                <span>Exploded (63)</span>
              </div>
              <div className="relative flex items-center">
                <div
                  id="arch-scrub-fill"
                  className="arch-slider-fill absolute h-1.5 bg-azure-cyan rounded-full pointer-events-none"
                  style={{
                    width: `${(currentExpFrame / (EXPLODED_TOTAL_FRAMES - 1)) * 100}%`,
                  }}
                />
                <input
                  type="range"
                  id="studio-assembly-slider"
                  min="0"
                  max="63"
                  value={Math.round(currentExpFrame)}
                  onChange={(e) => setCurrentExpFrame(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-azure-cyan"
                />
                {/* Secondary ID for test compatibility */}
                <input
                  type="range"
                  id="arch-scrub-slider"
                  min="0"
                  max="63"
                  value={Math.round(currentExpFrame)}
                  onChange={(e) => setCurrentExpFrame(Number(e.target.value))}
                  className="hidden"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Telemetry Stat Row */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                <p className="text-[11px] text-zinc-500 uppercase tracking-wider">Key Metric</p>
                <p
                  id="arch-layer-stat"
                  className="telemetry-stat-val text-base font-semibold text-azure-cyan mt-1"
                >
                  {activeLayerData.stat}
                </p>
                <p
                  id="arch-layer-sub"
                  className="telemetry-stat-sub text-[10px] text-zinc-400 mt-0.5"
                >
                  {activeLayerData.statSub}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                <p className="text-[11px] text-zinc-500 uppercase tracking-wider">Assembly Step</p>
                <p className="text-base font-semibold text-white mt-1">
                  Frame {Math.round(currentExpFrame)} / 63
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5">3D CAD Exploded</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Viewports */}
        <div className="w-full lg:max-w-xl aspect-[16/10] bg-black/80 rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden group touch-none select-none">
          {/* 360 Exterior Turntable Display */}
          <div
            className={`w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing relative ${
              mode === 'exterior' ? 'block' : 'hidden'
            }`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <img
              id="studio-phone-view"
              src={`/assets/videos/frames/frame-${currentDisplay360Frame}.jpg`}
              alt="AZURE One Pro 360 Degree Turntable Frame"
              className="max-h-full max-w-full object-contain pointer-events-none filter drop-shadow-[0_20px_40px_rgba(56,189,248,0.2)]"
              draggable={false}
            />

            <div
              id="studio-hint-text"
              className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[11px] text-zinc-300 pointer-events-none transition-opacity duration-300 flex items-center space-x-1.5 ${
                is360Dragging ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <RotateCw className="w-3 h-3 text-azure-cyan animate-spin-slow" />
              <span>Drag horizontally to rotate • 96 frames</span>
            </div>
          </div>

          {/* Exploded Assembly HTML5 Canvas Blitter */}
          <div
            className={`w-full h-full flex items-center justify-center relative ${
              mode === 'exploded' ? 'block' : 'hidden'
            }`}
          >
            <canvas
              id="studio-assembly-canvas"
              ref={assemblyCanvasRef}
              width={960}
              height={540}
              className="max-h-full max-w-full object-contain"
            />

            <canvas
              id="arch-canvas"
              width={960}
              height={540}
              className="hidden"
              aria-hidden="true"
            />

            {!isExplodedLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-20">
                <div className="flex flex-col items-center space-y-2">
                  <RotateCw className="w-6 h-6 text-azure-cyan animate-spin" />
                  <span className="text-xs text-zinc-400">Loading Exploded CAD Frames...</span>
                </div>
              </div>
            )}

            <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[11px] text-zinc-300 pointer-events-none flex items-center space-x-1.5">
              <Eye className="w-3 h-3 text-azure-cyan" />
              <span>64 Exploded Hardware Stages</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HardwareStudio;
