import { $, $$ } from '../shared/ui.js';
import { gsap, ScrollTrigger, TextPlugin, ScrambleTextPlugin } from '../vendor/gsap.js';

const TOTAL_FRAMES = 64;
const FRAME_PATH = (idx) => `assets/videos/exploded/frame-${idx}.jpg`;
const WEBP_ANIM = 'assets/videos/smartphone-exploded-dark.webp';

const LAYERS = [
  {
    targetFrame: 4,
    pct: '0%',
    badge: 'LAYER 01 · DISPLAY MATRIX',
    title: 'Super Retina XDR OLED & Ceramic Shield',
    desc: 'Custom OLED subpixel geometry with 120Hz ProMotion adaptive refresh, 2,000 nits peak outdoor luminance, and laser-fused Ceramic Shield glass.',
    statVal: '2,000 NITS',
    statSub: '1-120Hz Adaptive ProMotion',
  },
  {
    targetFrame: 16,
    pct: '25%',
    badge: 'LAYER 02 · STRUCTURAL CORE',
    title: 'Aerospace Grade-5 Titanium Substructure',
    desc: 'Solid billet CNC-milled titanium skeleton with internal acoustic resonance chamber, vapor chamber dissipation channels, and contoured 7.8mm perimeter.',
    statVal: 'GRADE 5',
    statSub: 'Billet Titanium Skeleton',
  },
  {
    targetFrame: 28,
    pct: '45%',
    badge: 'LAYER 03 · SILICON ENGINE',
    title: 'A19 Ultra 3nm Neural Silicon & Graphene Cell',
    desc: 'TSMC N3E 3nm compute node with 18.4 billion transistors, 16-core Neural Engine delivering 38 TOPS, and 4,800mAh high-density graphene battery.',
    statVal: '38 TOPS',
    statSub: '16-Core Neural Engine',
  },
  {
    targetFrame: 44,
    pct: '70%',
    badge: 'LAYER 04 · OPTICAL CHAMBER',
    title: 'ProVision 48MP Triple Periscope Array',
    desc: 'Folded tetraprism 5x optical telephoto with 2nd-gen 3D sensor-shift optical image stabilization and sub-millimeter LiDAR depth scanner.',
    statVal: '48MP F/1.78',
    statSub: '5x Tetraprism Periscope',
  },
  {
    targetFrame: 60,
    pct: '100%',
    badge: 'LAYER 05 · REAR ENCLOSURE',
    title: 'Ceramic Backplate with Laser-Etched Insignia',
    desc: 'Micro-blasted ceramic backplate infused with Cosmic Azure molecular PVD vapor deposition and integrated Qi2 magnetic induction matrix.',
    statVal: 'QI2 15W',
    statSub: 'Molecular PVD Finish',
  },
];

export function initArchitecture() {
  const section = $('#performance');
  const stage = $('#arch-stage');
  const phoneImg = $('#arch-phone-view');
  const canvas = $('#arch-canvas');
  const readout = $('#arch-hud-readout');
  const layerBadge = $('#arch-layer-badge');
  const layerTitle = $('#arch-layer-title');
  const layerDesc = $('#arch-layer-desc');
  const layerStat = $('#arch-layer-stat');
  const layerSub = $('#arch-layer-sub');
  const layerButtons = $$('.arch-layer-pill');
  const autoPlayBtn = $('#arch-autoplay-btn');
  const slider = $('#arch-scrub-slider');
  const progressFill = $('#arch-scrub-fill');

  if (!section || (!phoneImg && !canvas)) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let isAutoPlay = false;
  let currentFrame = 0;
  let isDragging = false;
  let startX = 0;
  let startFrame = 0;
  const ctx = canvas ? canvas.getContext('2d') : null;

  // Preload scrub frames
  const loadedFrames = [];
  let loadedCount = 0;

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = FRAME_PATH(i);
    img.onload = () => {
      loadedCount++;
      if (i === 0 && ctx && canvas) {
        drawFrame(0);
      }
    };
    loadedFrames.push(img);
  }

  function drawFrame(idx) {
    currentFrame = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(idx)));
    if (slider) slider.value = currentFrame;
    if (progressFill) progressFill.style.width = `${(currentFrame / (TOTAL_FRAMES - 1)) * 100}%`;

    if (canvas && ctx && loadedFrames[currentFrame]?.complete) {
      ctx.drawImage(loadedFrames[currentFrame], 0, 0, canvas.width, canvas.height);
    } else if (phoneImg) {
      phoneImg.src = FRAME_PATH(currentFrame);
    }

    updateHud(currentFrame);
  }

  function getActiveLayerIndex(frame) {
    if (frame < 10) return 0;
    if (frame < 22) return 1;
    if (frame < 36) return 2;
    if (frame < 52) return 3;
    return 4;
  }

  function updateHud(frame) {
    const layerIdx = getActiveLayerIndex(frame);
    const data = LAYERS[layerIdx];
    const progressPct = Math.round((frame / (TOTAL_FRAMES - 1)) * 100);

    if (readout) readout.textContent = `${progressPct}% DISASSEMBLY`;
    if (layerBadge) layerBadge.textContent = data.badge;
    if (layerTitle) layerTitle.textContent = data.title;
    if (layerDesc) layerDesc.textContent = data.desc;
    if (layerStat) layerStat.textContent = data.statVal;
    if (layerSub) layerSub.textContent = data.statSub;

    layerButtons.forEach((btn, idx) => {
      const active = idx === layerIdx && !isAutoPlay;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    if (autoPlayBtn) {
      autoPlayBtn.classList.toggle('active', isAutoPlay);
    }
  }

  function setAutoPlay(enable) {
    isAutoPlay = enable;
    if (enable) {
      if (phoneImg) {
        phoneImg.src = WEBP_ANIM;
        phoneImg.style.display = 'block';
      }
      if (canvas) canvas.style.display = 'none';
      if (readout) readout.textContent = 'CONTINUOUS ASSEMBLY';
      layerButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      if (autoPlayBtn) autoPlayBtn.classList.add('active');
    } else {
      if (canvas) {
        canvas.style.display = 'block';
        if (phoneImg) phoneImg.style.display = 'none';
      } else if (phoneImg) {
        phoneImg.style.display = 'block';
      }
      if (autoPlayBtn) autoPlayBtn.classList.remove('active');
      drawFrame(currentFrame);
    }
  }

  // Interactive Layer Buttons
  layerButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetIdx = parseInt(btn.dataset.layerIndex || '0', 10);
      const targetData = LAYERS[targetIdx];
      if (!targetData) return;

      setAutoPlay(false);

      if (!reducedMotion && gsap) {
        const obj = { frame: currentFrame };
        gsap.to(obj, {
          frame: targetData.targetFrame,
          duration: 0.6,
          ease: 'power2.out',
          onUpdate: () => drawFrame(obj.frame),
        });
      } else {
        drawFrame(targetData.targetFrame);
      }
    });
  });

  if (autoPlayBtn) {
    autoPlayBtn.addEventListener('click', () => {
      setAutoPlay(!isAutoPlay);
    });
  }

  if (slider) {
    slider.addEventListener('input', (e) => {
      setAutoPlay(false);
      drawFrame(parseFloat(e.target.value));
    });
  }

  // Pointer drag on stage to scrub
  if (stage) {
    stage.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button') || e.target.closest('input')) return;
      isDragging = true;
      startX = e.clientX;
      startFrame = currentFrame;
      setAutoPlay(false);
      stage.setPointerCapture?.(e.pointerId);
    });

    stage.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      // 8px per frame
      const frameDelta = -Math.round(dx / 8);
      const newFrame = Math.max(0, Math.min(TOTAL_FRAMES - 1, startFrame + frameDelta));
      drawFrame(newFrame);
    });

    const stopDrag = (e) => {
      if (!isDragging) return;
      isDragging = false;
      try {
        stage.releasePointerCapture?.(e.pointerId);
      } catch (_) {}
    };

    stage.addEventListener('pointerup', stopDrag);
    stage.addEventListener('pointercancel', stopDrag);
  }

  // GSAP ScrollTrigger Integration for scroll scrubbing
  if (ScrollTrigger && !reducedMotion && stage) {
    const scrollObj = { frame: 0 };
    ScrollTrigger.create({
      trigger: stage,
      start: 'top 75%',
      end: 'bottom 25%',
      scrub: 1.2,
      onUpdate: (self) => {
        if (!isAutoPlay && !isDragging) {
          const target = self.progress * (TOTAL_FRAMES - 1);
          drawFrame(target);
        }
      },
    });

    // ScrambleText metrics when performance section comes into view
    const metrics = $$('.arch-stat-metric');
    if (metrics.length > 0 && ScrambleTextPlugin) {
      ScrollTrigger.batch(metrics, {
        onEnter: (elements) => {
          elements.forEach((el) => {
            const finalVal = el.dataset.finalVal || el.textContent;
            gsap.to(el, {
              duration: 1.2,
              scrambleText: {
                text: finalVal,
                chars: '0123456789ABCDEF!#$%',
                speed: 0.3,
              },
            });
          });
        },
        once: true,
      });
    }
  }

  // Initial draw
  drawFrame(0);
}
