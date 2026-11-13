import React, { useState, useRef } from 'react';
import { Cpu, Zap, Sparkles, Layers, Activity, Gauge, CheckCircle2 } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../lib/gsap';
import {
  SILICON_METRICS,
  DIE_BLOCKS,
  COMPUTE_BENCHMARKS,
  TECHNICAL_DEEP_DIVES,
} from '../../data/silicon';
import { DieBlock } from '../../types/silicon';

export const SiliconSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedBlock, setSelectedBlock] = useState<DieBlock>(DIE_BLOCKS[2]); // Default to Neural Engine
  const [activeBenchmarkId, setActiveBenchmarkId] = useState<string>('ai-tokens');

  // Value refs for direct DOM interpolation without React re-renders
  const metricValRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useGSAP(
    () => {
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        // Immediate static values
        SILICON_METRICS.forEach((m, idx) => {
          const el = metricValRefs.current[idx];
          if (el) {
            const formatted =
              m.decimals > 0
                ? m.targetValue.toFixed(m.decimals)
                : m.targetValue.toLocaleString('en-IN');
            el.textContent = `${m.prefix || ''}${formatted}${m.suffix}`;
          }
        });
        return;
      }

      // Create scroll-triggered counter interpolation
      const proxies = SILICON_METRICS.map(() => ({ val: 0 }));

      SILICON_METRICS.forEach((m, idx) => {
        const el = metricValRefs.current[idx];
        if (!el) return;

        gsap.to(proxies[idx], {
          val: m.targetValue,
          duration: 2.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
          onUpdate: () => {
            const currentVal = proxies[idx].val;
            const formatted =
              m.decimals > 0
                ? currentVal.toFixed(m.decimals)
                : Math.round(currentVal).toLocaleString('en-IN');
            el.textContent = `${m.prefix || ''}${formatted}${m.suffix}`;
          },
        });
      });

      // Subtle card entrance reveals
      gsap.from('.silicon-metric-card', {
        y: 24,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });
    },
    { scope: sectionRef, revertOnUpdate: true },
  );

  const activeBenchmark =
    COMPUTE_BENCHMARKS.find((b) => b.id === activeBenchmarkId) || COMPUTE_BENCHMARKS[0];

  return (
    <section
      ref={sectionRef}
      id="performance"
      className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center"
    >
      {/* Section Header */}
      <div className="mb-10">
        <span className="eyebrow">TSMC 3NM PROCESS NODE</span>
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mt-2">
          A19 Ultra Silicon. 39 TOPS Compute.
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
          18.6 billion transistors microarchitected for instantaneous on-device generative
          intelligence, desktop-class ray tracing, and unthrottled sustained throughput.
        </p>
      </div>

      {/* 4 Animated Bento Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {SILICON_METRICS.map((metric, idx) => {
          let IconComponent = Cpu;
          if (metric.iconName === 'Zap') IconComponent = Zap;
          if (metric.iconName === 'Sparkles') IconComponent = Sparkles;
          if (metric.iconName === 'Layers') IconComponent = Layers;

          return (
            <div
              key={metric.id}
              className="silicon-metric-card glass-card rounded-2xl p-6 flex flex-col justify-between border border-white/10 hover:border-azure-cyan/40 transition-colors"
            >
              <div>
                <div className="w-8 h-8 rounded-xl bg-azure-blue/10 flex items-center justify-center text-azure-cyan mb-3">
                  <IconComponent className="w-4 h-4" />
                </div>
                <p
                  ref={(el) => (metricValRefs.current[idx] = el)}
                  className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
                >
                  {`${metric.decimals > 0 ? metric.targetValue.toFixed(metric.decimals) : metric.targetValue.toLocaleString('en-IN')}${metric.suffix}`}
                </p>
                <p className="text-xs text-zinc-300 font-medium mt-1">{metric.sublabel}</p>
              </div>
              <p className="text-[11px] text-zinc-500 mt-3 pt-3 border-t border-white/5 line-clamp-2">
                {metric.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Interactive Microarchitecture Die Diagram & HUD Telemetry */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 mb-10 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-3">
          <div>
            <span className="eyebrow text-azure-cyan font-mono">DIE TOPOGRAPHY & INTERCONNECT</span>
            <h3 className="text-xl sm:text-2xl font-semibold text-white mt-1">
              Monolithic Silicon Floorplan
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Select any microarchitectural block to inspect execution pipelines and transistor
              density.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-azure-cyan animate-ping" />
            <span>Telemetry Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6 items-center">
          {/* Interactive SVG Die View (7 Cols) */}
          <div className="lg:col-span-7 bg-black/70 rounded-2xl p-4 sm:p-6 border border-white/10 relative overflow-hidden">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3 flex items-center justify-between">
              <span>A19 ULTRA • 600x400 DIE MAP</span>
              <span>N3P FINFET EUV</span>
            </div>

            <svg viewBox="0 0 600 400" className="w-full h-auto" fill="none">
              {/* Die Substrate Outer Boundary */}
              <rect
                x="10"
                y="10"
                width="580"
                height="380"
                rx="16"
                stroke="rgba(56, 189, 248, 0.25)"
                strokeWidth="2"
                fill="#0a0a0c"
              />

              {/* Silicon Interconnect Bus Lines */}
              <g stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1">
                <line x1="280" y1="20" x2="280" y2="380" strokeDasharray="4 4" />
                <line x1="20" y1="200" x2="580" y2="200" strokeDasharray="4 4" />
              </g>

              {/* Functional Die Blocks */}
              {DIE_BLOCKS.map((block) => {
                const isSelected = selectedBlock.id === block.id;
                return (
                  <g
                    key={block.id}
                    onClick={() => setSelectedBlock(block)}
                    className="cursor-pointer transition-all duration-300"
                  >
                    <rect
                      x={block.rect.x}
                      y={block.rect.y}
                      width={block.rect.width}
                      height={block.rect.height}
                      rx={block.rect.rx || 8}
                      fill={isSelected ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255, 255, 255, 0.03)'}
                      stroke={isSelected ? '#38bdf8' : 'rgba(255, 255, 255, 0.12)'}
                      strokeWidth={isSelected ? 2 : 1}
                      className="hover:stroke-azure-cyan/80 transition-colors"
                    />
                    <text
                      x={block.rect.x + 12}
                      y={block.rect.y + 24}
                      fill={isSelected ? '#38bdf8' : '#e4e4e7'}
                      fontSize="12"
                      fontWeight="600"
                      className="font-sans select-none"
                    >
                      {block.name}
                    </text>
                    <text
                      x={block.rect.x + 12}
                      y={block.rect.y + 42}
                      fill={isSelected ? '#bae6fd' : '#71717a'}
                      fontSize="10"
                      className="font-mono select-none"
                    >
                      {block.cores} • {block.transistorShare}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* HUD Telemetry Readout Card (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-zinc-900/60 rounded-2xl p-6 border border-white/10">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-azure-cyan/15 text-azure-cyan">
                  {selectedBlock.category.toUpperCase()} BLOCK
                </span>
                <span className="text-xs font-mono text-zinc-500">
                  {selectedBlock.transistorShare}
                </span>
              </div>

              <h4 className="text-xl font-semibold text-white mt-3">{selectedBlock.name}</h4>
              <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                {selectedBlock.description}
              </p>

              {/* Architectural Telemetry Specs */}
              <div className="mt-6 space-y-3">
                {selectedBlock.specs.map((spec, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex items-center justify-between text-xs py-2 border-b border-white/5"
                  >
                    <span className="text-zinc-400">{spec.label}</span>
                    <span className="text-azure-cyan font-mono font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
              <span>Bus Fabric: 68.2 GB/s</span>
              <span className="text-azure-cyan flex items-center space-x-1">
                <Activity className="w-3.5 h-3.5 mr-1" />
                <span>Zero Wait-State</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Compute Benchmarks Comparative Matrix */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 mb-10 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-3">
          <div>
            <span className="eyebrow text-azure-cyan font-mono">HARDWARE BENCHMARKS</span>
            <h3 className="text-xl sm:text-2xl font-semibold text-white mt-1">
              Sustained Compute Dominance
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Verified performance gains vs prior silicon generation and flagship competitors.
            </p>
          </div>

          {/* Workload Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {COMPUTE_BENCHMARKS.map((bm) => (
              <button
                key={bm.id}
                type="button"
                onClick={() => setActiveBenchmarkId(bm.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeBenchmarkId === bm.id
                    ? 'bg-azure-cyan/20 border border-azure-cyan text-white shadow-md'
                    : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {bm.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Benchmark Detail & Bar Visualization */}
        <div className="my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-white">{activeBenchmark.title}</h4>
              <p className="text-xs text-zinc-400">{activeBenchmark.workload}</p>
            </div>
            <div className="mt-2 sm:mt-0 flex items-center space-x-2">
              <span className="text-xs font-bold text-azure-cyan bg-azure-cyan/15 px-2.5 py-1 rounded-full">
                +{activeBenchmark.upliftPercent}% Uplift
              </span>
            </div>
          </div>

          <p className="text-xs text-zinc-300 mb-6 leading-relaxed">
            {activeBenchmark.description}
          </p>

          {/* Comparison Bars */}
          <div className="space-y-4">
            {/* A19 Ultra */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white font-semibold flex items-center">
                  <span className="w-2 h-2 rounded-full bg-azure-cyan mr-2" />
                  AZURE A19 Ultra (TSMC 3nm N3P)
                </span>
                <span className="text-azure-cyan font-bold font-mono">
                  {activeBenchmark.a19Display}
                </span>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-azure-blue to-azure-cyan rounded-full transition-all duration-700"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Baseline (A18 Bionic) */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-zinc-500 mr-2" />
                  {activeBenchmark.baselineName}
                </span>
                <span className="text-zinc-300 font-mono font-medium">
                  {activeBenchmark.baselineDisplay}
                </span>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  className="h-full bg-zinc-600 rounded-full transition-all duration-700"
                  style={{
                    width: `${(activeBenchmark.baselineScore / activeBenchmark.a19Score) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Competitor */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-500 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-zinc-700 mr-2" />
                  {activeBenchmark.competitorName}
                </span>
                <span className="text-zinc-400 font-mono font-medium">
                  {activeBenchmark.competitorDisplay}
                </span>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  className="h-full bg-zinc-700 rounded-full transition-all duration-700"
                  style={{
                    width: `${(activeBenchmark.competitorScore / activeBenchmark.a19Score) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Deep Dive Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TECHNICAL_DEEP_DIVES.map((card) => (
          <div
            key={card.id}
            className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-white/10"
          >
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-azure-cyan">
                {card.badge}
              </span>
              <h4 className="text-lg font-semibold text-white mt-3">{card.title}</h4>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{card.summary}</p>

              <ul className="mt-4 space-y-2 text-xs text-zinc-300">
                {card.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-azure-cyan shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs text-zinc-500">
              <Gauge className="w-3.5 h-3.5 mr-1 text-azure-cyan" />
              <span>Full Thermal Stability Under Load</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
