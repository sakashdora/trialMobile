import { $, $$ } from '../shared/ui.js';
import { gsap } from '../vendor/gsap.js';

const TOTAL_360_FRAMES = 96;
const TOTAL_EXP_FRAMES = 64;

const WEBP_360 = 'assets/videos/smartphone-360-dark.webp';

const EXTERIOR_ANGLES = [
  {
    frameIdx: 0,
    label: 'Front',
    title: 'Super Retina XDR OLED Display',
    desc: '6.7-inch OLED panel with adaptive 120Hz refresh and Dynamic Island integration.',
  },
  {
    frameIdx: 24,
    label: 'Profile',
    title: 'Grade-5 Aerospace Titanium Perimeter',
    desc: 'Contoured 7.8mm featherweight titanium perimeter with integrated tactile Action Button.',
  },
  {
    frameIdx: 48,
    label: 'Back',
    title: 'Micro-Blasted Ceramic Shield',
    desc: 'Precision-etched AZURE insignia with molecular PVD finish for supreme scratch resistance.',
  },
  {
    frameIdx: 72,
    label: 'Optics',
    title: 'ProVision Triple-Lens Periscope Array',
    desc: '48MP primary sensor, 5x optical periscope telephoto, and ultra-wide macro.',
  },
];

const ASSEMBLY_LAYERS = [
  {
    targetFrame: 4,
    label: 'Display',
    title: 'Super Retina XDR OLED & Ceramic Shield',
    desc: 'Custom OLED subpixel geometry with 120Hz ProMotion adaptive refresh and 2,000 nits peak outdoor luminance.',
  },
  {
    targetFrame: 16,
    label: 'Titanium Core',
    title: 'Aerospace Grade-5 Titanium Substructure',
    desc: 'Solid billet CNC-milled titanium skeleton with internal acoustic resonance and vapor chamber channels.',
  },
  {
    targetFrame: 28,
    label: 'A19 Silicon',
    title: 'A19 Ultra 3nm Neural Silicon & Graphene Cell',
    desc: 'TSMC N3E 3nm compute node with 18.4 billion transistors and 16-core Neural Engine delivering 38 TOPS.',
  },
  {
    targetFrame: 44,
    label: 'Optics',
    title: 'ProVision 48MP Triple Periscope Array',
    desc: 'Folded tetraprism 5x optical telephoto with 2nd-generation 3D sensor-shift optical image stabilization.',
  },
  {
    targetFrame: 60,
    label: 'Ceramic Enclosure',
    title: 'Ceramic Backplate with Laser-Etched Insignia',
    desc: 'Micro-blasted ceramic backplate infused with Cosmic Azure molecular PVD vapor deposition and Qi2 induction.',
  },
];

export function initStudio360() {
  const stage = $('#studio-stage');
  const phoneImg = $('#studio-phone-view');
  const canvas = $('#studio-assembly-canvas');
  const assemblyFallback = $('#studio-assembly-fallback');
  const featureTitle = $('#studio-feature-title');
  const featureDesc = $('#studio-feature-desc');
  const cardBadge = $('#studio-card-badge');
  const dragHint = $('#studio-hint-text');

  const modeTabs = $$('.studio-mode-tab');
  const exteriorControls = $('#studio-exterior-controls');
  const assemblyControls = $('#studio-assembly-controls');
  const assemblyScrubRow = $('#studio-assembly-scrub');
  const assemblySlider = $('#studio-assembly-slider');

  if (!stage || !phoneImg) return;

  const ctx = canvas ? canvas.getContext('2d') : null;
  let currentMode = 'exterior'; // 'exterior' | 'assembly'
  let current360Frame = 0;
  let currentExpFrame = 0;
  let isDragging = false;
  let startX = 0;
  let startFrame = 0;
  let is360Manual = false;
  let resumeTimer = null;

  // Preload exterior frames
  const exteriorImages = [];
  for (let i = 0; i < TOTAL_360_FRAMES; i += 2) {
    const im = new Image();
    im.src = `assets/videos/frames/frame-${i}.jpg`;
    exteriorImages.push(im);
  }

  // Preload assembly frames
  const assemblyImages = [];
  for (let i = 0; i < TOTAL_EXP_FRAMES; i++) {
    const im = new Image();
    im.src = `assets/videos/exploded/frame-${i}.jpg`;
    im.onload = () => {
      if (i === 0 && currentMode === 'assembly' && ctx && canvas) {
        drawAssembly(0);
      }
    };
    assemblyImages.push(im);
  }

  function drawAssembly(frameIdx) {
    currentExpFrame = Math.max(0, Math.min(TOTAL_EXP_FRAMES - 1, Math.round(frameIdx)));
    if (assemblySlider) assemblySlider.value = currentExpFrame;

    if (canvas && ctx && assemblyImages[currentExpFrame]?.complete) {
      ctx.drawImage(assemblyImages[currentExpFrame], 0, 0, canvas.width, canvas.height);
    } else if (assemblyFallback) {
      assemblyFallback.src = `assets/videos/exploded/frame-${currentExpFrame}.jpg`;
    }

    // Determine active layer info
    let layerIdx = 0;
    if (currentExpFrame >= 10 && currentExpFrame < 22) layerIdx = 1;
    else if (currentExpFrame >= 22 && currentExpFrame < 36) layerIdx = 2;
    else if (currentExpFrame >= 36 && currentExpFrame < 52) layerIdx = 3;
    else if (currentExpFrame >= 52) layerIdx = 4;

    const data = ASSEMBLY_LAYERS[layerIdx];
    if (featureTitle) featureTitle.textContent = data.title;
    if (featureDesc) featureDesc.textContent = data.desc;
    if (cardBadge) cardBadge.textContent = `LAYER 0${layerIdx + 1} · ${data.label.toUpperCase()}`;

    const layerBtns = assemblyControls
      ? assemblyControls.querySelectorAll('.studio-angle-pill')
      : [];
    layerBtns.forEach((btn, idx) => {
      const active = idx === layerIdx;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  function show360Frame(frameIdx) {
    is360Manual = true;
    current360Frame = ((frameIdx % TOTAL_360_FRAMES) + TOTAL_360_FRAMES) % TOTAL_360_FRAMES;
    phoneImg.src = `assets/videos/frames/frame-${current360Frame}.jpg`;

    const deg = Math.round((current360Frame / TOTAL_360_FRAMES) * 360) % 360;
    let zone = 0;
    if (deg >= 45 && deg < 135) zone = 1;
    else if (deg >= 135 && deg < 225) zone = 2;
    else if (deg >= 225 && deg < 315) zone = 3;

    const angleData = EXTERIOR_ANGLES[zone];
    if (featureTitle) featureTitle.textContent = angleData.title;
    if (featureDesc) featureDesc.textContent = angleData.desc;
    if (cardBadge) cardBadge.textContent = 'INSPECTING HARDWARE';

    const exteriorBtns = exteriorControls
      ? exteriorControls.querySelectorAll('.studio-angle-pill')
      : [];
    exteriorBtns.forEach((btn, idx) => {
      const active = idx === zone;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  function resume360Loop() {
    is360Manual = false;
    phoneImg.src = WEBP_360;
    const exteriorBtns = exteriorControls
      ? exteriorControls.querySelectorAll('.studio-angle-pill')
      : [];
    exteriorBtns.forEach((b) => b.classList.remove('active'));
    if (featureTitle) featureTitle.textContent = EXTERIOR_ANGLES[1].title;
    if (featureDesc) featureDesc.textContent = EXTERIOR_ANGLES[1].desc;
    if (cardBadge) cardBadge.textContent = 'AEROSPACE GRADE 5 TITANIUM';
  }

  function setMode(mode) {
    currentMode = mode;
    modeTabs.forEach((tab) => {
      const active = tab.dataset.mode === mode;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });

    if (mode === 'exterior') {
      phoneImg.style.display = 'block';
      if (canvas) canvas.style.display = 'none';
      if (assemblyFallback) assemblyFallback.style.display = 'none';

      if (exteriorControls) exteriorControls.style.display = 'flex';
      if (assemblyControls) assemblyControls.style.display = 'none';
      if (assemblyScrubRow) assemblyScrubRow.style.display = 'none';

      if (dragHint) dragHint.textContent = 'Drag horizontally to rotate';
      resume360Loop();
    } else {
      clearTimeout(resumeTimer);
      phoneImg.style.display = 'none';
      if (canvas) {
        canvas.style.display = 'block';
        if (assemblyFallback) assemblyFallback.style.display = 'none';
      } else if (assemblyFallback) {
        assemblyFallback.style.display = 'block';
      }

      if (exteriorControls) exteriorControls.style.display = 'none';
      if (assemblyControls) assemblyControls.style.display = 'flex';
      if (assemblyScrubRow) assemblyScrubRow.style.display = 'flex';

      if (dragHint) dragHint.textContent = 'Drag horizontally to disassemble';
      drawAssembly(currentExpFrame);
    }
  }

  // Mode tabs switcher
  modeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      setMode(tab.dataset.mode);
    });
  });

  // Exterior angle buttons
  const extPills = exteriorControls ? exteriorControls.querySelectorAll('.studio-angle-pill') : [];
  extPills.forEach((btn) => {
    btn.addEventListener('click', () => {
      clearTimeout(resumeTimer);
      const idx = Number(btn.dataset.angleIndex);
      const angle = EXTERIOR_ANGLES[idx];
      if (angle) {
        show360Frame(angle.frameIdx);
        resumeTimer = setTimeout(resume360Loop, 6000);
      }
    });
  });

  // Assembly layer buttons
  const assPills = assemblyControls ? assemblyControls.querySelectorAll('.studio-angle-pill') : [];
  assPills.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.layerIdx || '0');
      const targetLayer = ASSEMBLY_LAYERS[idx];
      if (!targetLayer) return;

      if (gsap) {
        const obj = { frame: currentExpFrame };
        gsap.to(obj, {
          frame: targetLayer.targetFrame,
          duration: 0.6,
          ease: 'power2.out',
          onUpdate: () => drawAssembly(obj.frame),
        });
      } else {
        drawAssembly(targetLayer.targetFrame);
      }
    });
  });

  // Assembly Slider Scrub
  if (assemblySlider) {
    assemblySlider.addEventListener('input', (e) => {
      drawAssembly(parseFloat(e.target.value));
    });
  }

  // Pointer drag interaction
  stage.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    clearTimeout(resumeTimer);
    isDragging = true;
    startX = e.clientX;
    startFrame = currentMode === 'exterior' ? current360Frame : currentExpFrame;
    stage.setPointerCapture?.(e.pointerId);
    stage.classList.add('is-dragging');
  });

  stage.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;

    if (currentMode === 'exterior') {
      const width = stage.offsetWidth || 500;
      const frameDelta = Math.round((deltaX / width) * TOTAL_360_FRAMES);
      show360Frame(startFrame + frameDelta);
    } else {
      // In assembly mode: dragging right closes/assembles, dragging left explodes
      const frameDelta = -Math.round(deltaX / 8);
      drawAssembly(startFrame + frameDelta);
    }
  });

  const stopDrag = (e) => {
    if (!isDragging) return;
    isDragging = false;
    stage.classList.remove('is-dragging');
    try {
      stage.releasePointerCapture?.(e.pointerId);
    } catch (_) {}

    if (currentMode === 'exterior') {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(resume360Loop, 5000);
    }
  };

  stage.addEventListener('pointerup', stopDrag);
  stage.addEventListener('pointercancel', stopDrag);

  // Initialize in exterior view
  setMode('exterior');
}
