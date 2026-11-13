import test from 'node:test';
import assert from 'node:assert/strict';
import { StorefrontInteractionHarness } from '../fixtures/interaction-harness.mjs';
import { startTestServer } from '../fixtures/server-fixture.mjs';
import { parseHTML } from '../fixtures/html-parser.mjs';
import { products, phones, accessories } from '../../src/scripts/data/products.js';
import { scenes } from '../../src/scripts/data/gallery.js';

test('Tier 4: Real-World Application Scenarios (End-to-End User Journeys)', async (t) => {
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

  await t.test('TC-T4.01 — End-to-End Flagship Phone Purchase Journey', async () => {
    // 1. Visitor lands on Hero section
    const hero = doc.querySelector('#home');
    assert.ok(hero, 'Hero section is visible on landing');

    // 2. Shimmer button initiates One Pro configuration
    const shimmerBtn = hero.querySelector('.shimmer-btn');
    assert.ok(shimmerBtn, 'Shimmer CTA button exists in hero');
    assert.equal(shimmerBtn.dataset.product, 'pro', 'Shimmer button configures One Pro');

    // 3. User opens configurator modal
    const harness = new StorefrontInteractionHarness();
    const config = harness.openProductConfigurator('pro');
    assert.equal(config.name, 'Azure One Pro');
    assert.equal(config.currentPrice, 69999);
    assert.deepEqual(config.storageOptions, ['256 GB', '512 GB']);

    // 4. User selects 512GB storage upgrade
    const upgradedPrice = harness.setStorageOption('512 GB');
    assert.equal(upgradedPrice, 79999, 'Price dynamically reflects 512GB tier');

    // 5. User submits form
    const submitted = harness.submitConfiguration();
    assert.equal(submitted, true, 'Configuration form submitted');
    assert.ok(
      harness.toasts.some((t) => t.includes('Azure One Pro added')),
      'Confirmation toast triggered',
    );

    // 6. User inspects bag drawer
    assert.equal(harness.bag.length, 1);
    assert.equal(harness.bag[0].model, 'pro');
    assert.equal(harness.bag[0].storage, '512 GB');
    assert.equal(harness.getTotalPrice(), 79999, 'Subtotal correctly calculates to ₹79,999');

    // 7. Verify persistent storage contains exactly this purchase
    const stored = JSON.parse(harness.storage['azure-preview-bag']);
    assert.equal(stored.length, 1);
    assert.equal(stored[0].model, 'pro');
    assert.equal(stored[0].storage, '512 GB');
  });

  await t.test('TC-T4.02 — Complete Multi-Product Ecosystem Purchase Journey', async () => {
    const harness = new StorefrontInteractionHarness();

    // Step 1: Add flagship Azure One Pro
    harness.openProductConfigurator('pro');
    harness.submitConfiguration();
    assert.equal(harness.bag.length, 1);
    assert.equal(harness.getTotalPrice(), 69999);

    // Step 2: Add Azure Power Kit (charging ecosystem)
    harness.openProductConfigurator('power');
    harness.submitConfiguration();
    assert.equal(harness.bag.length, 2);
    assert.equal(harness.getTotalPrice(), 69999 + 2499); // 72498

    // Step 3: Add Azure Soft Case (protection ecosystem)
    harness.openProductConfigurator('case');
    harness.submitConfiguration();
    assert.equal(harness.bag.length, 3);
    assert.equal(harness.getTotalPrice(), 69999 + 2499 + 1999); // 74497

    // Step 4: Open bag, review items
    assert.equal(harness.bag[0].model, 'pro');
    assert.equal(harness.bag[1].model, 'power');
    assert.equal(harness.bag[2].model, 'case');

    // Step 5: Remove case
    const removed = harness.removeBagItem(2);
    assert.equal(removed.model, 'case');
    assert.equal(harness.bag.length, 2);
    assert.equal(harness.getTotalPrice(), 69999 + 2499); // 72498

    // Step 6: Verify persistent storage updated
    const stored = JSON.parse(harness.storage['azure-preview-bag']);
    assert.equal(stored.length, 2);
    assert.equal(stored[0].model, 'pro');
    assert.equal(stored[1].model, 'power');
  });

  await t.test('TC-T4.03 — ProVision Optics & Photography Exhibition Journey', async () => {
    // 1. Navigate to Camera section
    const camera = doc.querySelector('#camera');
    assert.ok(camera, 'Camera section is present');

    // 2. Curated photo gallery exists
    const galleryImg = camera.querySelector('#gallery-image');
    assert.ok(galleryImg, 'Primary gallery photo view exists');

    // 3. Cycle through all photography scenes
    const harness = new StorefrontInteractionHarness();
    assert.equal(harness.activeGalleryScene, 0);

    // Step forward through scenes
    const scene1 = harness.nextGalleryScene();
    assert.equal(harness.activeGalleryScene, 1);
    assert.equal(scene1.kicker, scenes[1].kicker);

    const scene2 = harness.nextGalleryScene();
    assert.equal(harness.activeGalleryScene, 2);
    assert.equal(scene2.kicker, scenes[2].kicker);

    // Wraps back to 0
    const scene0 = harness.nextGalleryScene();
    assert.equal(harness.activeGalleryScene, 0);
    assert.equal(scene0.kicker, scenes[0].kicker);

    // 4. Lightbox modal exists
    const dialog = doc.querySelector('#photo-dialog');
    assert.ok(dialog, 'Photo lightbox dialog element exists');
    assert.ok(dialog.querySelector('#large-photo'), 'Large photo view element exists');
    assert.ok(
      dialog.querySelector('#large-photo-caption'),
      'Attribution and caption element exists',
    );
  });

  await t.test('TC-T4.04 — Hardware Studio Exploration & Telemetry Analysis Journey', async () => {
    // 1. Navigate to Hardware Studio section
    const design = doc.querySelector('#design');
    assert.ok(design, 'Hardware Studio section is present');

    const harness = new StorefrontInteractionHarness();

    // 2. Turntable perspective angles
    const perspectives = ['front', 'profile', 'back', 'optics'];
    const expectedFrames = [0, 24, 48, 72];

    for (let i = 0; i < perspectives.length; i++) {
      const frame = harness.set360Perspective(perspectives[i]);
      assert.equal(
        frame,
        expectedFrames[i],
        `Perspective ${perspectives[i]} maps to frame ${expectedFrames[i]}`,
      );
    }

    // 3. Exploded view layer stepping
    const expectedLayers = [
      { idx: 0, frame: 4, stat: '2,000 NITS' },
      { idx: 1, frame: 16, stat: 'GRADE 5' },
      { idx: 2, frame: 28, stat: '38 TOPS' },
      { idx: 3, frame: 44, stat: '48MP F/1.78' },
      { idx: 4, frame: 60, stat: 'QI2 15W' },
    ];

    for (const exp of expectedLayers) {
      const layer = harness.setExplodedLayer(exp.idx);
      assert.equal(layer.targetFrame, exp.frame);
      assert.equal(layer.stat, exp.stat);
    }

    // 4. Autoplay toggle
    assert.equal(harness.isAutoplay, false);
    harness.toggleAutoplay();
    assert.equal(harness.isAutoplay, true);
    harness.toggleAutoplay();
    assert.equal(harness.isAutoplay, false);
  });

  await t.test('TC-T4.05 — Mobile Shopper Responsive Exploration Journey', async () => {
    // 1. Mobile menu toggle button exists
    const menuBtn = doc.querySelector('.menu-button') || doc.querySelector('.nav__toggle');
    assert.ok(menuBtn, 'Mobile hamburger toggle button is accessible');

    // 2. Navigation bar contains links to all sections
    const navLinks = doc.querySelectorAll('#main-nav a, nav a');
    assert.ok(navLinks.length >= 7, 'Mobile navigation provides full access to all sections');

    // 3. Target sections can be reached from nav links
    const hrefs = navLinks.map((a) => a.getAttribute('href')).filter((h) => h.startsWith('#'));
    for (const hash of hrefs) {
      const targetId = hash.slice(1);
      assert.ok(
        doc.querySelector(`#${targetId}`),
        `Navigation anchor ${hash} resolves to section #${targetId}`,
      );
    }

    // 4. Mobile shopper comparison selection
    const harness = new StorefrontInteractionHarness();
    const comp = harness.getComparison('pro', 'one');
    assert.equal(comp.left.name, 'Azure One Pro');
    assert.equal(comp.right.name, 'Azure One');

    // 5. Configurator can be triggered from comparison table
    const configOne = harness.openProductConfigurator(comp.right.id);
    assert.equal(configOne.name, 'Azure One');
    assert.equal(configOne.currentPrice, 44999);
    assert.deepEqual(configOne.storageOptions, ['128 GB', '256 GB']);
  });
});
