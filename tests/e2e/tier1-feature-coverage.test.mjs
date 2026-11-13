import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { startTestServer } from '../fixtures/server-fixture.mjs';
import { parseHTML } from '../fixtures/html-parser.mjs';
import { StorefrontInteractionHarness } from '../fixtures/interaction-harness.mjs';
import { products, phones, accessories } from '../../src/scripts/data/products.js';
import { scenes } from '../../src/scripts/data/gallery.js';
import { projectRoot, outputDir, sourceDir, publicDir } from '../../scripts/paths.mjs';

test('Tier 1: Feature Coverage (R1 — Framework Modernization)', async (t) => {
  let serverFixture;
  let html;
  let doc;

  t.before(async () => {
    serverFixture = await startTestServer({ preview: false });
    html = await serverFixture.fetchText('/');
    doc = parseHTML(html);
  });

  t.after(async () => {
    if (serverFixture) await serverFixture.close();
  });

  await t.test('TC-R1.01 — Clean Build & Hosting Parity', async () => {
    const hostingJson = JSON.parse(
      await readFile(path.join(projectRoot, '.openai/hosting.json'), 'utf8'),
    );
    assert.equal(hostingJson.static?.directory, 'dist', 'Hosting static directory must be dist');
    await access(path.join(outputDir, 'index.html'));
  });

  await t.test('TC-R1.02 — HTTP Development & Preview Serving', async () => {
    const devServer = await startTestServer({ preview: false });
    try {
      const devRes = await devServer.fetchResponse('/');
      assert.equal(devRes.status, 200, 'Dev server returns HTTP 200');
      assert.match(devRes.headers.get('content-type'), /text\/html/, 'Dev server serves HTML');

      const previewRes = await serverFixture.fetchResponse('/');
      assert.equal(previewRes.status, 200, 'Preview server returns HTTP 200');
      assert.match(
        previewRes.headers.get('content-type'),
        /text\/html/,
        'Preview server serves HTML',
      );
    } finally {
      await devServer.close();
    }
  });

  await t.test('TC-R1.03 — Static Asset Delivery & Content-Type Integrity', async () => {
    const testAssets = [
      { path: '/assets/system.css', type: /text\/css/ },
      { path: '/styles/main.css', type: /text\/css/ },
      { path: '/scripts/app.js', type: /text\/javascript/ },
      { path: '/assets/images/products/azure-pro.png', type: /image\/png/ },
      { path: '/assets/images/products/power.jpg', type: /image\/jpeg/ },
      { path: '/assets/videos/smartphone-360-dark.webp', type: /image\/webp/ },
    ];

    for (const asset of testAssets) {
      const res = await serverFixture.fetchResponse(asset.path);
      assert.equal(res.status, 200, `Asset ${asset.path} must return HTTP 200`);
      assert.match(
        res.headers.get('content-type'),
        asset.type,
        `Asset ${asset.path} must have matching MIME type`,
      );
    }
  });

  await t.test('TC-R1.04 — JavaScript Compilation & Import Graph Integrity', async () => {
    const scriptsToCheck = [
      'scripts/build.mjs',
      'scripts/serve.mjs',
      'scripts/paths.mjs',
      'src/scripts/app.js',
      'src/scripts/features/catalog.js',
      'src/scripts/features/shopping.js',
      'src/scripts/features/studio.js',
      'src/scripts/features/architecture.js',
      'src/scripts/features/comparison.js',
      'src/scripts/features/gallery.js',
      'src/scripts/features/navigation.js',
    ];

    for (const rel of scriptsToCheck) {
      const abs = path.join(projectRoot, rel);
      assert.doesNotThrow(() => {
        execFileSync(process.execPath, ['--check', abs], { stdio: 'pipe' });
      }, `File ${rel} must pass syntax check`);
    }
  });

  await t.test('TC-R1.05 — Landmark Semantic Accessibility Structure', async () => {
    assert.ok(doc.querySelector('header'), 'Must contain <header>');
    assert.ok(doc.querySelector('nav'), 'Must contain <nav>');
    assert.ok(doc.querySelector('main'), 'Must contain <main>');
    assert.ok(doc.querySelector('footer'), 'Must contain <footer>');
    const skipLink = doc.querySelector('.skip-link');
    assert.ok(skipLink, 'Must contain skip link');
    assert.equal(skipLink.getAttribute('href'), '#main', 'Skip link points to #main');
  });

  await t.test('TC-R1.06 — Metadata & Apple Mobile Web App Configuration', async () => {
    const viewport = doc.querySelector('meta[name="viewport"]');
    assert.ok(viewport, 'Must have viewport meta tag');
    assert.match(
      viewport.getAttribute('content'),
      /viewport-fit=cover/,
      'Must support viewport-fit=cover',
    );

    const themeColor = doc.querySelector('meta[name="theme-color"]');
    assert.ok(themeColor, 'Must specify theme color');
    assert.ok(doc.querySelector('title')?.textContent.includes('AZURE'), 'Title includes AZURE');
  });
});

test('Tier 1: Feature Coverage (R2 — Apple-Caliber UI/UX Redesign)', async (t) => {
  let serverFixture;
  let html;
  let doc;

  t.before(async () => {
    serverFixture = await startTestServer({ preview: false });
    html = await serverFixture.fetchText('/');
    doc = parseHTML(html);
  });

  t.after(async () => {
    if (serverFixture) await serverFixture.close();
  });

  await t.test('TC-R2.01 — Core Storefront Sections Presence', async () => {
    const requiredSections = [
      'home',
      'collection',
      'camera',
      'design',
      'performance',
      'accessories',
      'compare',
      'support',
    ];
    for (const sec of requiredSections) {
      assert.ok(doc.querySelector(`section#${sec}`), `Section #${sec} must exist in document`);
    }
  });

  await t.test('TC-R2.02 — Apple Design Tokens & Dark Aesthetic', async () => {
    const htmlElem = doc.querySelector('html');
    assert.equal(htmlElem?.getAttribute('data-type'), 'product', 'Root has data-type=product');
    assert.equal(htmlElem?.getAttribute('data-radius'), 'soft', 'Root has data-radius=soft');
    assert.equal(htmlElem?.getAttribute('data-buttons'), 'pill', 'Root has data-buttons=pill');

    const heroLead = doc.querySelector('.hero-lead');
    assert.ok(heroLead, 'Hero section has Apple-style lead copy');
    assert.ok(doc.querySelector('.hero-facts'), 'Hero displays precision metric facts');
  });

  await t.test('TC-R2.03 — Hardware Studio 360 Exterior Turntable', async () => {
    assert.ok(doc.querySelector('#studio-stage'), 'Hardware Studio stage exists');
    assert.ok(doc.querySelector('#studio-phone-view'), 'Turntable image view element exists');

    const pills = doc.querySelectorAll('#studio-exterior-controls .studio-angle-pill');
    assert.equal(pills.length, 4, 'Must have 4 perspective angle pills in exterior mode');
    const texts = pills.map((p) => p.textContent);
    assert.deepEqual(
      texts,
      ['Front', 'Profile', 'Back', 'Optics'],
      'Angle pills match Apple perspectives',
    );
  });

  await t.test('TC-R2.04 — Exploded View Silicon Architecture (A19 Ultra)', async () => {
    assert.ok(doc.querySelector('#arch-stage'), 'Architecture stage exists');
    assert.ok(doc.querySelector('#arch-canvas'), 'Architecture canvas blitter exists');

    const layerPills = doc
      .querySelectorAll('.arch-layer-pill')
      .filter((p) => p.id !== 'arch-autoplay-btn');
    assert.equal(layerPills.length, 5, 'Must have 5 architecture layer selectors');
    assert.ok(doc.querySelector('#arch-hud-readout'), 'Architecture HUD telemetry readout exists');
    assert.ok(doc.querySelector('#arch-scrub-slider'), 'Architecture scrubber slider exists');
  });

  await t.test('TC-R2.05 — ProVision Camera Optics & Photo Gallery Lightbox', async () => {
    assert.ok(doc.querySelector('#gallery-image'), 'Gallery primary image view exists');
    assert.ok(doc.querySelector('#gallery-prev'), 'Gallery previous button exists');
    assert.ok(doc.querySelector('#gallery-next'), 'Gallery next button exists');
    assert.ok(doc.querySelector('#expand-photo'), 'Gallery lightbox expand button exists');
    assert.ok(doc.querySelector('#photo-dialog'), 'Photo lightbox modal exists');

    const sceneButtons = doc.querySelectorAll('[data-scene]');
    assert.equal(sceneButtons.length, scenes.length, 'Scene selectors match gallery data length');
  });

  await t.test('TC-R2.06 — Apple-Style Compare Matrix', async () => {
    const leftPicker = doc.querySelector('#compare-left');
    const rightPicker = doc.querySelector('#compare-right');
    assert.ok(leftPicker, 'Left device picker exists');
    assert.ok(rightPicker, 'Right device picker exists');
    assert.ok(doc.querySelector('#compare table'), 'Comparison matrix table exists');
    assert.ok(doc.querySelector('#compare-head'), 'Comparison table head exists');
    assert.ok(doc.querySelector('#compare-body'), 'Comparison table body exists');

    const harness = new StorefrontInteractionHarness();
    const comparison = harness.getComparison('pro', 'air');
    assert.equal(comparison.left.name, 'Azure One Pro');
    assert.equal(comparison.right.name, 'Azure One Air');
    assert.notEqual(comparison.left.price, comparison.right.price);
  });
});

test('Tier 1: Feature Coverage (R3 — New Product Catalog Additions)', async (t) => {
  let serverFixture;
  let html;
  let doc;

  t.before(async () => {
    serverFixture = await startTestServer({ preview: false });
    html = await serverFixture.fetchText('/');
    doc = parseHTML(html);
  });

  t.after(async () => {
    if (serverFixture) await serverFixture.close();
  });

  await t.test('TC-R3.01 — Flagship Handset Lineup Showcase', async () => {
    assert.deepEqual(phones, ['pro', 'air', 'one'], 'Phone lineup includes pro, air, one');
    assert.equal(products.pro.base, 69999, 'One Pro flagship price is 69999');
    assert.equal(products.air.base, 59999, 'One Air price is 59999');
    assert.equal(products.one.base, 44999, 'One essential price is 44999');
    assert.ok(products.pro.finish, 'One Pro has signature finish');
  });

  await t.test('TC-R3.02 — Complete 4-Product Lineup Coverage', async () => {
    // 1. Mobile
    assert.ok(products.pro && products.pro.category === 'phone', 'Mobile product present');
    // 2. Charger
    assert.ok(products.power && products.power.category === 'charging', 'Charger product present');
    // 3. Cable (part of Power Kit concept with USB-C braided cable)
    assert.ok(
      products.power.highlights.some((h) => h.toLowerCase().includes('cable')),
      'Cable represented in catalog',
    );
    // 4. Case
    assert.ok(products.case && products.case.category === 'protection', 'Case product present');
  });

  await t.test('TC-R3.03 — Accessory Category Filter', async () => {
    const filterButtons = doc.querySelectorAll('[data-filter]');
    assert.ok(filterButtons.length >= 4, 'Must have at least 4 category filter buttons');

    const harness = new StorefrontInteractionHarness();
    const all = harness.setCategoryFilter('all');
    assert.equal(all.visibleCount, accessories.length, 'Filter all shows all accessories');

    const charging = harness.setCategoryFilter('charging');
    assert.ok(charging.visibleCount >= 1, 'Filter charging shows charger accessories');
    assert.ok(charging.visibleIds.includes('power'), 'Power Kit included in charging');

    const protection = harness.setCategoryFilter('protection');
    assert.ok(protection.visibleIds.includes('case'), 'Case included in protection');
  });

  await t.test('TC-R3.04 — Interactive Product Configurator Modal', async () => {
    assert.ok(doc.querySelector('#product-dialog'), 'Product dialog modal exists');
    assert.ok(doc.querySelector('#storage'), 'Storage select dropdown exists');
    assert.ok(doc.querySelector('#config-price'), 'Configurator live price element exists');

    const harness = new StorefrontInteractionHarness();
    const config = harness.openProductConfigurator('pro');
    assert.equal(config.name, 'Azure One Pro');
    assert.equal(config.currentPrice, 69999);

    const updatedPrice = harness.setStorageOption('512 GB');
    assert.equal(updatedPrice, 79999, 'Upgrading storage adds 10,000 to base price');
  });

  await t.test('TC-R3.05 — Shopping Bag Drawer & Live Subtotal', async () => {
    assert.ok(doc.querySelector('#bag-dialog'), 'Bag slide-over dialog exists');
    assert.ok(doc.querySelector('#bag-items'), 'Bag items container exists');
    assert.ok(doc.querySelector('#bag-summary'), 'Bag summary container exists');
    assert.ok(doc.querySelector('.bag-button'), 'Bag toggle button exists');

    const harness = new StorefrontInteractionHarness();
    harness.openProductConfigurator('pro');
    harness.submitConfiguration();

    assert.equal(harness.bag.length, 1, 'Bag holds 1 item');
    assert.equal(harness.getTotalPrice(), 69999, 'Total price is 69999');

    harness.removeBagItem(0);
    assert.equal(harness.bag.length, 0, 'Bag is empty after removal');
    assert.equal(harness.getTotalPrice(), 0, 'Total price resets to 0');
  });

  await t.test('TC-R3.06 — Persistent Storage Synchronization', async () => {
    const initialStorage = {
      'azure-preview-bag': JSON.stringify([
        { model: 'pro', finish: 'Cosmic Azure', storage: '256 GB' },
      ]),
    };
    const harness = new StorefrontInteractionHarness(initialStorage);
    assert.equal(harness.bag.length, 1, 'Bag restored 1 item from localStorage');
    assert.equal(harness.bag[0].model, 'pro', 'Restored correct model');
    assert.equal(harness.getTotalPrice(), 69999, 'Calculated correct price from restored bag');
  });
});

test('Tier 1: Feature Coverage (R4 — Fluid Motion, Scroll Effects & Transitions)', async (t) => {
  let serverFixture;
  let html;
  let doc;

  t.before(async () => {
    serverFixture = await startTestServer({ preview: false });
    html = await serverFixture.fetchText('/');
    doc = parseHTML(html);
  });

  t.after(async () => {
    if (serverFixture) await serverFixture.close();
  });

  await t.test('TC-R4.01 — GSAP Vendor Suite Availability & Clean Syntax', async () => {
    const gsapFiles = [
      'src/scripts/vendor/gsap.js',
      'src/scripts/vendor/gsap/gsap-core.js',
      'src/scripts/vendor/gsap/ScrollTrigger.js',
      'src/scripts/vendor/gsap/Draggable.js',
      'src/scripts/vendor/gsap/SplitText.js',
    ];

    for (const file of gsapFiles) {
      const abs = path.join(projectRoot, file);
      await access(abs);
      assert.doesNotThrow(() => {
        execFileSync(process.execPath, ['--check', abs], { stdio: 'pipe' });
      }, `GSAP module ${file} must have valid syntax`);
    }
  });

  await t.test('TC-R4.02 — Motion Initialization & Entrance State', async () => {
    assert.match(html, /data-motion/, 'HTML root has data-motion attribute');
    assert.match(html, /m-enter/, 'Initial inline script attaches m-enter class');

    const hero = doc.querySelector('#home');
    assert.ok(hero?.hasAttribute('data-enter'), 'Hero section has data-enter attribute');
  });

  await t.test('TC-R4.03 — Interactive Scrub Physics Controls', async () => {
    const archSlider = doc.querySelector('#arch-scrub-slider');
    assert.ok(archSlider, 'Architecture scrub slider exists');
    assert.equal(archSlider.getAttribute('min'), '0', 'Scrub slider min is 0');
    assert.equal(archSlider.getAttribute('max'), '63', 'Scrub slider max is 63 frames');

    const fillBar = doc.querySelector('#arch-scrub-fill');
    assert.ok(fillBar, 'Architecture progress fill bar exists');
  });

  await t.test('TC-R4.04 — Exploded Architecture Autoplay Controller', async () => {
    assert.ok(doc.querySelector('#arch-autoplay-btn'), 'Autoplay button exists');
    const harness = new StorefrontInteractionHarness();
    assert.equal(harness.isAutoplay, false, 'Autoplay initially false');
    assert.equal(harness.toggleAutoplay(), true, 'Autoplay toggles to true');
    assert.equal(harness.toggleAutoplay(), false, 'Autoplay toggles back to false');
  });

  await t.test('TC-R4.05 — Reduced Motion Accessibility Compliance', async () => {
    const responsiveCss = await readFile(path.join(sourceDir, 'styles/responsive.css'), 'utf8');
    assert.match(
      responsiveCss,
      /@media\s*\(prefers-reduced-motion:\s*reduce\)/,
      'Must define prefers-reduced-motion media query',
    );
    assert.match(
      responsiveCss,
      /animation-duration:\s*0\.01ms\s*!important/,
      'Must suppress animation duration under reduced-motion',
    );
    assert.match(
      responsiveCss,
      /transform:\s*none\s*!important/,
      'Must suppress hover transforms under reduced-motion',
    );
  });
});
