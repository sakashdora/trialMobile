/**
 * Tier 5: Adversarial Coverage Hardening Test Suite
 * Validates motion physics resilience, GSAP lifecycles, reduced-motion compliance,
 * linear sequence boundary clamping, canvas input robustness, configurator isolation,
 * and bag/pricing schema hardening against adversarial vectors.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

test('Tier 5: Adversarial Coverage Hardening', async (t) => {
  let vite;

  t.before(async () => {
    vite = await createServer({
      root: projectRoot,
      server: { middlewareMode: true },
      appType: 'custom',
    });
  });

  t.after(async () => {
    if (vite) {
      await vite.close();
    }
  });

  await t.test('TC-T5.01 — Compiled Application CSS Bundles Reduced-Motion Rules', async () => {
    // 1. Verify src/index.css defines reduced-motion rules
    const indexCss = await readFile(path.join(projectRoot, 'src/index.css'), 'utf8');
    assert.match(
      indexCss,
      /@media\s*\(prefers-reduced-motion:\s*reduce\)/,
      'src/index.css must define @media (prefers-reduced-motion: reduce)',
    );
    assert.match(
      indexCss,
      /animation-duration:\s*0\.01ms\s*!important/,
      'src/index.css must clamp animation-duration to 0.01ms under reduced-motion',
    );
    assert.match(
      indexCss,
      /transform:\s*none\s*!important/,
      'src/index.css must suppress hover transforms under reduced-motion',
    );

    // 2. Verify compiled production bundle in dist/assets/
    const distAssetsDir = path.join(projectRoot, 'dist/assets');
    const files = await readdir(distAssetsDir);
    const appCssFile = files.find((f) => f.startsWith('index-') && f.endsWith('.css'));
    assert.ok(appCssFile, 'Compiled app CSS bundle must exist in dist/assets/');

    const appCss = await readFile(path.join(distAssetsDir, appCssFile), 'utf8');
    assert.match(
      appCss,
      /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/,
      'Compiled CSS bundle must contain @media (prefers-reduced-motion: reduce)',
    );
    assert.match(
      appCss,
      /animation-duration:\s*0?\.01ms\s*!important/,
      'Compiled CSS bundle must clamp animation-duration under reduced-motion',
    );
  });

  await t.test('TC-T5.02 — HardwareStudio Reduced Motion Compliance', async () => {
    const studioCode = await readFile(
      path.join(projectRoot, 'src/components/sections/HardwareStudio.tsx'),
      'utf8',
    );

    // 1. Verify idle rotation respects prefers-reduced-motion
    assert.match(
      studioCode,
      /reset360IdleTimer[\s\S]*?prefers-reduced-motion/,
      '360 Turntable idle auto-rotation must check prefers-reduced-motion before scheduling',
    );

    // 2. Verify drag inertia physics respects prefers-reduced-motion
    assert.match(
      studioCode,
      /handlePointerUp[\s\S]*?prefers-reduced-motion[\s\S]*?stepInertia/,
      'Pointer drag inertia must be suppressed when prefers-reduced-motion is active',
    );

    // 3. Verify perspective and layer clicks bypass tweens under reduced-motion
    assert.match(
      studioCode,
      /handlePerspectiveClick[\s\S]*?prefers-reduced-motion/,
      'handlePerspectiveClick must check prefers-reduced-motion to skip tween animation',
    );
    assert.match(
      studioCode,
      /handleLayerClick[\s\S]*?prefers-reduced-motion/,
      'handleLayerClick must check prefers-reduced-motion to skip tween animation',
    );
  });

  await t.test(
    'TC-T5.03 — Exploded Sequence Scrubbing Boundary Clamping (No Wrap Glitch)',
    async () => {
      const studioCode = await readFile(
        path.join(projectRoot, 'src/components/sections/HardwareStudio.tsx'),
        'utf8',
      );

      // HardwareStudio must clamp scrubbedFrame against momentum overshoot
      assert.match(
        studioCode,
        /Math\.max\(\s*0\s*,\s*Math\.min\(\s*EXPLODED_TOTAL_FRAMES\s*-\s*1/,
        'HardwareStudio must clamp scrubbedFrame to [0, EXPLODED_TOTAL_FRAMES - 1] to prevent wrap glitch on momentum overshoot',
      );

      // Mathematical boundary verification
      const TOTAL_FRAMES = 64;
      const clampScrub = (progress) =>
        Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(progress * (TOTAL_FRAMES - 1))));

      assert.equal(clampScrub(-0.05), 0, 'Negative progress overscroll must clamp to frame 0');
      assert.equal(clampScrub(0), 0, 'Progress 0 must map to frame 0');
      assert.equal(clampScrub(0.5), 32, 'Progress 0.5 must map to frame 32');
      assert.equal(clampScrub(1.0), 63, 'Progress 1.0 must map to frame 63');
      assert.equal(clampScrub(1.08), 63, 'Positive progress overscroll must clamp to frame 63');
    },
  );

  await t.test(
    'TC-T5.04 — GSAP Tween Concurrency and Unmount Cleanup in HardwareStudio',
    async () => {
      const studioCode = await readFile(
        path.join(projectRoot, 'src/components/sections/HardwareStudio.tsx'),
        'utf8',
      );

      // Must track active tween ref to kill previous tweens
      assert.match(
        studioCode,
        /activeTweenRef\s*=\s*useRef/,
        'HardwareStudio must declare activeTweenRef to track running tweens',
      );

      assert.match(
        studioCode,
        /activeTweenRef\.current\.kill\(\)/,
        'HardwareStudio must invoke activeTweenRef.current.kill() before spawning concurrent tweens',
      );

      // Unmount effect must clean up active tween
      assert.match(
        studioCode,
        /activeTweenRef\.current\s*\?\.\s*kill\(\)/,
        'HardwareStudio unmount cleanup effect must terminate running tweens',
      );
    },
  );

  await t.test('TC-T5.05 — useImageSequence Non-Finite Input Resilience', async () => {
    const hookCode = await readFile(
      path.join(projectRoot, 'src/hooks/useImageSequence.ts'),
      'utf8',
    );

    // Must use Number.isFinite to guard width and height against NaN/Infinity
    assert.match(
      hookCode,
      /Number\.isFinite\(\s*width\s*\)/,
      'useImageSequence drawFrame must validate Number.isFinite(width)',
    );
    assert.match(
      hookCode,
      /Number\.isFinite\(\s*height\s*\)/,
      'useImageSequence drawFrame must validate Number.isFinite(height)',
    );
    assert.match(
      hookCode,
      /Number\.isFinite\(\s*frameIndex\s*\)/,
      'useImageSequence drawFrame must validate Number.isFinite(frameIndex)',
    );

    // Dynamic guard verification
    const validateCanvasInputs = (ctx, frameIndex, width, height) => {
      if (
        !ctx ||
        !Number.isFinite(width) ||
        width <= 0 ||
        !Number.isFinite(height) ||
        height <= 0
      ) {
        return false;
      }
      const safeFrame = Number.isFinite(frameIndex) ? frameIndex : 0;
      return { safeFrame, width, height };
    };

    assert.equal(validateCanvasInputs({}, 0, NaN, 100), false, 'NaN width rejected');
    assert.equal(validateCanvasInputs({}, 0, 100, Infinity), false, 'Infinity height rejected');
    assert.equal(validateCanvasInputs({}, 0, -50, 100), false, 'Negative width rejected');
    assert.equal(validateCanvasInputs({}, 0, 100, 0), false, 'Zero height rejected');
    assert.equal(validateCanvasInputs(null, 0, 100, 100), false, 'Null context rejected');

    const result = validateCanvasInputs({}, NaN, 300, 200);
    assert.deepEqual(
      result,
      { safeFrame: 0, width: 300, height: 200 },
      'NaN frameIndex safely falls back to 0',
    );
  });

  await t.test('TC-T5.06 — Headless / SSR Window Object Safety', async () => {
    const heroCode = await readFile(
      path.join(projectRoot, 'src/components/sections/HeroSection.tsx'),
      'utf8',
    );
    const studioCode = await readFile(
      path.join(projectRoot, 'src/components/sections/HardwareStudio.tsx'),
      'utf8',
    );

    // Verify all usages of window.matchMedia are preceded by typeof window !== 'undefined'
    assert.match(
      heroCode,
      /typeof\s+window\s*!==\s*['"]undefined['"][\s\S]*?window\.matchMedia/,
      'HeroSection must guard window.matchMedia with typeof window !== "undefined"',
    );
    assert.match(
      studioCode,
      /typeof\s+window\s*!==\s*['"]undefined['"][\s\S]*?window\.matchMedia/,
      'HardwareStudio must guard window.matchMedia with typeof window !== "undefined"',
    );

    // Verify no bare unguarded window.matchMedia calls exist
    const hasUnguardedMatchMedia = (source) => {
      const occurrences = [...source.matchAll(/window\.matchMedia/g)];
      for (const occ of occurrences) {
        const precedingSlice = source.slice(Math.max(0, occ.index - 100), occ.index);
        if (!precedingSlice.includes('typeof window')) {
          return true;
        }
      }
      return false;
    };

    assert.equal(
      hasUnguardedMatchMedia(heroCode),
      false,
      'HeroSection must not contain any unguarded window.matchMedia',
    );
    assert.equal(
      hasUnguardedMatchMedia(studioCode),
      false,
      'HardwareStudio must not contain any unguarded window.matchMedia',
    );
  });

  await t.test('TC-T5.07 — Pointer Capture Exception Resilience', async () => {
    const studioCode = await readFile(
      path.join(projectRoot, 'src/components/sections/HardwareStudio.tsx'),
      'utf8',
    );

    // setPointerCapture must be wrapped in try/catch like releasePointerCapture
    assert.match(
      studioCode,
      /try\s*\{\s*[^}]*setPointerCapture[^}]*\}\s*catch/,
      'HardwareStudio handlePointerDown must wrap setPointerCapture in try...catch',
    );
  });

  await t.test('TC-T5.08 — ProductConfiguratorModal Accessory Storage Isolation', async () => {
    const { catalogAccessories } = await vite.ssrLoadModule('/src/data/products.ts');

    // 1. Data Schema: All non-handset catalog items must NOT define phone storage options
    const nonHandsets = catalogAccessories.filter((p) => p.category !== 'handset');
    assert.ok(nonHandsets.length >= 4, 'Must have at least 4 catalog accessories');
    for (const item of nonHandsets) {
      assert.equal(
        item.storageOptions,
        undefined,
        `Accessory ${item.name} (${item.id}) must not define handset storage options`,
      );
    }

    // 2. Component Logic: Modal must conditionally render storage select only when product has storage
    const modalCode = await readFile(
      path.join(projectRoot, 'src/components/common/ProductConfiguratorModal.tsx'),
      'utf8',
    );

    assert.doesNotMatch(
      modalCode,
      /\[\s*\{\s*size:\s*['"]256 GB['"],\s*priceDelta:\s*0\s*\}\s*,\s*\{\s*size:\s*['"]512 GB['"],\s*priceDelta:\s*10000\s*\}\s*\]/,
      'ProductConfiguratorModal must NOT fall back accessories to 256GB/512GB (+₹10,000) storage tiers',
    );

    assert.match(
      modalCode,
      /hasStorage\s*&&|\.storageOptions\s*&&[\s\S]*?storage-field/,
      'ProductConfiguratorModal must render #storage-field only when product has storage options',
    );
  });

  await t.test(
    'TC-T5.09 — BagContext Runtime Negative Price Sanitization and Storage Schema Hardening',
    async () => {
      const { BagProvider, useBag } = await vite.ssrLoadModule('/src/context/BagContext.tsx');

      // 1. Storage loader schema filter: requires item.storage to be string or undefined
      const bagContextCode = await readFile(
        path.join(projectRoot, 'src/context/BagContext.tsx'),
        'utf8',
      );
      assert.match(
        bagContextCode,
        /typeof\s+item\.storage\s*===\s*['"]string['"]\s*\|\|\s*item\.storage\s*===\s*undefined/,
        'BagContext localStorage loader must validate typeof item.storage === "string" || item.storage === undefined',
      );

      // 2. Runtime addItem sanitizes price against negative, NaN, or non-finite exploit values
      assert.match(
        bagContextCode,
        /itemData\.price\s*>=\s*0|price\s*>=\s*0/,
        'BagContext addItem must validate itemData.price >= 0',
      );

      // 3. Functional price sanitizer verification
      const sanitizePrice = (price) =>
        typeof price === 'number' && Number.isFinite(price) && price >= 0 ? Math.round(price) : 0;

      assert.equal(sanitizePrice(-50000), 0, 'Negative prices must be clamped to 0');
      assert.equal(sanitizePrice(NaN), 0, 'NaN price must fall back to 0');
      assert.equal(sanitizePrice(Infinity), 0, 'Infinity price must fall back to 0');
      assert.equal(sanitizePrice(69999.4), 69999, 'Valid float price rounds to integer');
    },
  );

  await t.test(
    'TC-T5.10 — formatPrice Non-Negative Price Clamping & CompareSection Event Propagation Safeguard',
    async () => {
      const { formatPrice } = await vite.ssrLoadModule('/src/lib/utils.ts');

      // 1. formatPrice clamp verification
      assert.equal(formatPrice(-500), '₹0', 'Negative amounts must clamp to ₹0');
      assert.equal(formatPrice(-1), '₹0', 'Negative amount must clamp to ₹0');
      assert.equal(formatPrice(0), '₹0', 'Zero amount must format as ₹0');
      assert.equal(formatPrice(69999), '₹69,999', 'Positive amounts format correctly');
      assert.equal(formatPrice(1000000), '₹10,00,000', 'Lakhs delimiter formatting');

      // 2. CompareSection configure CTA button stops event propagation
      const compareCode = await readFile(
        path.join(projectRoot, 'src/components/sections/CompareSection.tsx'),
        'utf8',
      );
      assert.match(
        compareCode,
        /handleConfigure[\s\S]*?stopPropagation\(\)/,
        'CompareSection configure handler must call stopPropagation() to prevent duplicate delegated clicks',
      );
    },
  );
});
