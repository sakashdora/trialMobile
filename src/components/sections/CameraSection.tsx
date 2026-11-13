import React, { useState } from 'react';
import { Camera, Maximize2, ChevronLeft, ChevronRight, X, Aperture, Compass } from 'lucide-react';
import { galleryScenes } from '../../data/gallery';

export const CameraSection: React.FC = () => {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const currentScene = galleryScenes[activeSceneIndex] || galleryScenes[0];

  const handlePrevScene = () => {
    setActiveSceneIndex((prev) => (prev + galleryScenes.length - 1) % galleryScenes.length);
  };

  const handleNextScene = () => {
    setActiveSceneIndex((prev) => (prev + 1) % galleryScenes.length);
  };

  const handleSelectScene = (index: number) => {
    if (index >= 0 && index < galleryScenes.length) {
      setActiveSceneIndex(index);
    }
  };

  return (
    <section
      id="camera"
      className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center"
    >
      {/* Section Header */}
      <div className="mb-10">
        <span className="eyebrow">PROVISION CAMERA SYSTEM</span>
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mt-2">
          Pro Optics. Cinematic Precision.
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
          48MP periscope telephoto with folded Tetraprism glass, 2nd-generation sensor-shift OIS,
          and computational multi-exposure fusion for breathtaking depth and resolution.
        </p>
      </div>

      {/* Optics Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Bento 1: 48MP Tetraprism Periscope */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-azure-cyan/10 border border-azure-cyan/20 flex items-center justify-center text-azure-cyan mb-4">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-azure-cyan/15 text-azure-cyan">
              Folded Optics
            </span>
            <h3 className="text-xl font-semibold text-white mt-3">48MP Tetraprism Optics</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Incoming light rays reflect four times through a 3D folded glass prism before hitting
              the sensor, achieving a true 120mm focal length inside a razor-thin 7.8mm chassis.
            </p>

            {/* Folded Glass Ray-Path SVG Diagram */}
            <div className="my-6 p-4 rounded-2xl bg-black/50 border border-white/10 relative">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-2">
                <span>Tetraprism Cutaway</span>
                <span className="text-azure-cyan font-mono">4x Internal Reflections</span>
              </div>
              <svg viewBox="0 0 320 120" className="w-full h-auto" fill="none">
                {/* Chassis outline */}
                <rect
                  x="10"
                  y="10"
                  width="300"
                  height="100"
                  rx="10"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="1.5"
                />
                {/* Tetraprism block */}
                <path
                  d="M 60 25 L 210 25 L 250 95 L 100 95 Z"
                  fill="rgba(56,189,248,0.06)"
                  stroke="rgba(56,189,248,0.3)"
                  strokeWidth="1.5"
                />
                {/* Internal Mirrors */}
                <line
                  x1="210"
                  y1="25"
                  x2="250"
                  y2="95"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <line
                  x1="60"
                  y1="25"
                  x2="100"
                  y2="95"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Sensor surface */}
                <rect x="260" y="45" width="8" height="40" rx="2" fill="#38bdf8" />
                <text x="265" y="102" fontSize="8" fill="#94a3b8" textAnchor="middle">
                  CMOS
                </text>
                {/* Folded Light Ray Path */}
                <path
                  d="M 20 60 L 175 60 L 95 85 L 195 35 L 260 65"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  className="animate-pulse"
                />
                {/* Optical Elements Markers */}
                <circle cx="20" cy="60" r="3" fill="#38bdf8" />
                <circle cx="175" cy="60" r="2.5" fill="#38bdf8" />
                <circle cx="95" cy="85" r="2.5" fill="#38bdf8" />
                <circle cx="195" cy="35" r="2.5" fill="#38bdf8" />
                <circle cx="260" cy="65" r="3" fill="#38bdf8" />
              </svg>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white tracking-tight">5x Optical</p>
              <p className="text-xs text-zinc-500 mt-0.5">120mm Equivalent Focal Length</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-azure-cyan">ƒ/2.8</p>
              <p className="text-[11px] text-zinc-500">Sensor-Shift OIS</p>
            </div>
          </div>
        </div>

        {/* Bento 2: 48MP Fusion Main Sensor */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-azure-cyan/10 border border-azure-cyan/20 flex items-center justify-center text-azure-cyan mb-4">
              <Aperture className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
              Primary Fusion
            </span>
            <h3 className="text-xl font-semibold text-white mt-3">48MP Main Fusion</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              2.44µm quad-pixel binning capturing immense light data with 2nd-generation 3-axis
              sensor-shift optical stabilization and 100% Focus Pixels.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                <span className="text-zinc-400">Native Focal Lengths</span>
                <span className="text-white font-medium">24mm / 28mm / 35mm</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                <span className="text-zinc-400">Aperture</span>
                <span className="text-white font-medium">ƒ/1.78 Bright Aperture</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2">
                <span className="text-zinc-400">Optical Stabilization</span>
                <span className="text-azure-cyan font-medium">2nd-Gen Sensor-Shift</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/10">
            <p className="text-2xl font-bold text-white tracking-tight">2.44µm</p>
            <p className="text-xs text-zinc-500 mt-0.5">Quad-Pixel Light Gathering</p>
          </div>
        </div>

        {/* Bento 3: 48MP Ultra Wide Macro */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-azure-cyan/10 border border-azure-cyan/20 flex items-center justify-center text-azure-cyan mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
              Ultra Wide
            </span>
            <h3 className="text-xl font-semibold text-white mt-3">48MP Ultra Wide Macro</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Expansive 120° field of view for dramatic architectural landscapes, shifting
              seamlessly into micro-focus down to 2 centimeters.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                <span className="text-zinc-400">Focal Length & FOV</span>
                <span className="text-white font-medium">13mm • 120° Field of View</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                <span className="text-zinc-400">Macro Precision</span>
                <span className="text-white font-medium">2cm Extreme Close-Up</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2">
                <span className="text-zinc-400">Lens Anti-Reflective</span>
                <span className="text-azure-cyan font-medium">Atomic Vapor Coating</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/10">
            <p className="text-2xl font-bold text-white tracking-tight">120° FOV</p>
            <p className="text-xs text-zinc-500 mt-0.5">Zero Edge Distortion Lens</p>
          </div>
        </div>
      </div>

      {/* Interactive Photo Gallery Exhibition Canvas */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        {/* Gallery Top HUD: Title, Kicker, Credit & Expand CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <p id="gallery-kicker" className="eyebrow text-azure-cyan font-mono">
              {currentScene.kicker}
            </p>
            <h3 id="gallery-title" className="text-xl sm:text-2xl font-semibold text-white mt-1">
              {currentScene.title}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <a
                id="photo-credit"
                href={currentScene.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-400 hover:text-azure-cyan transition-colors"
              >
                Photography by {currentScene.credit} ↗
              </a>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-zinc-500">{currentScene.location}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              id="expand-photo"
              onClick={() => setIsLightboxOpen(true)}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center space-x-2 transition-colors border border-white/10"
              aria-label="Expand photo"
            >
              <Maximize2 className="w-3.5 h-3.5 text-azure-cyan" />
              <span>Full View</span>
            </button>
          </div>
        </div>

        {/* Gallery Primary Stage */}
        <div className="my-6 relative rounded-2xl overflow-hidden aspect-[16/9] border border-white/10 bg-black/40 group">
          <img
            id="gallery-image"
            src={currentScene.image}
            alt={currentScene.alt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Shooting Telemetry HUD Badge Overlay */}
          <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-zinc-300 flex items-center space-x-3">
            <span>{currentScene.lens}</span>
            <span className="text-zinc-500">•</span>
            <span className="text-azure-cyan">{currentScene.aperture}</span>
            <span className="text-zinc-500">•</span>
            <span>{currentScene.shutter}</span>
            <span className="text-zinc-500">•</span>
            <span>{currentScene.iso}</span>
          </div>

          {/* Quick Prev / Next Floating Arrows */}
          <button
            type="button"
            id="gallery-prev"
            onClick={handlePrevScene}
            aria-label="Previous photograph"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            id="gallery-next"
            onClick={handleNextScene}
            aria-label="Next photograph"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Bottom Scene Selectors & Telemetry Strip */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* 3 Explicit [data-scene] buttons */}
          <div
            className="flex items-center space-x-2"
            role="tablist"
            aria-label="Curated gallery scenes"
          >
            {galleryScenes.map((scene, idx) => {
              const isActive = activeSceneIndex === idx;
              return (
                <button
                  key={scene.id}
                  type="button"
                  data-scene={idx.toString()}
                  role="tab"
                  aria-pressed={isActive}
                  aria-selected={isActive}
                  onClick={() => handleSelectScene(idx)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'active bg-azure-cyan/20 border border-azure-cyan text-white shadow-lg shadow-azure-cyan/20'
                      : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {scene.tabLabel || `Scene 0${idx + 1}`}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-zinc-500 font-mono">
            <span>
              Scene {activeSceneIndex + 1} of {galleryScenes.length}
            </span>
            <span className="mx-2">•</span>
            <span className="text-zinc-400">48MP Raw Image Capture</span>
          </div>
        </div>
      </div>

      {/* Photo Lightbox Modal Dialog (Rendered in DOM unconditionally for test query compatibility) */}
      <dialog
        id="photo-dialog"
        className={`photo-dialog fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl p-4 sm:p-8 flex items-center justify-center transition-all duration-300 ${
          isLightboxOpen
            ? 'opacity-100 pointer-events-auto'
            : 'hidden opacity-0 pointer-events-none'
        }`}
        aria-label="Full-size inspiration photograph"
        open={isLightboxOpen}
      >
        <div className="relative max-w-5xl w-full flex flex-col items-center">
          <button
            type="button"
            className="close-dialog absolute -top-12 right-0 sm:top-2 sm:right-2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close photograph"
            onClick={() => setIsLightboxOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="rounded-2xl overflow-hidden border border-white/15 bg-black/60 shadow-2xl max-h-[75vh]">
            <img
              id="large-photo"
              src={currentScene.image}
              alt={currentScene.alt}
              className="w-full h-auto max-h-[75vh] object-contain"
            />
          </div>

          <div className="mt-4 text-center max-w-2xl px-4">
            <p id="large-photo-caption" className="text-sm text-zinc-300 leading-relaxed">
              {currentScene.title} · Photography by {currentScene.credit} / Unsplash. Inspiration
              photography, not captured on AZURE.
            </p>
            <p className="text-xs text-zinc-500 mt-1 font-mono">{currentScene.lens}</p>
          </div>
        </div>
      </dialog>
    </section>
  );
};
