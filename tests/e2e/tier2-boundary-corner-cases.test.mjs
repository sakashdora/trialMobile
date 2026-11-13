import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { startTestServer } from '../fixtures/server-fixture.mjs';
import { parseHTML } from '../fixtures/html-parser.mjs';
import { StorefrontInteractionHarness } from '../fixtures/interaction-harness.mjs';
import { sourceDir } from '../../scripts/paths.mjs';

test('Tier 2: Boundary & Corner Cases', async (t) => {
  let serverFixture;
  let html;
  let doc;
  let responsiveCss;

  t.before(async () => {
    serverFixture = await startTestServer({ preview: false });
    html = await serverFixture.fetchText('/');
    doc = parseHTML(html);
    responsiveCss = await readFile(path.join(sourceDir, 'styles/responsive.css'), 'utf8');
  });

  t.after(async () => {
    if (serverFixture) await serverFixture.close();
  });

  await t.test('TC-T2.01 — Viewport Boundary 390px (Mobile Compact / iPhone)', async () => {
    assert.match(
      responsiveCss,
      /@media\s*\(max-width:\s*639px\)/,
      'Must define compact mobile breakpoint (covers 390px)',
    );
    // Under 639px (which includes 390px):
    // Actions stack vertically, accessories are 1 column, arch metrics grid is 1 column
    assert.match(responsiveCss, /\.actions\s*\{\s*flex-direction:\s*column/);
    assert.match(responsiveCss, /\.accessory-grid\s*\{\s*grid-template-columns:\s*1fr/);
    assert.match(responsiveCss, /\.arch-metrics-grid\s*\{\s*grid-template-columns:\s*1fr/);

    // Verify mobile menu toggle exists in markup
    const menuBtn = doc.querySelector('.menu-button') || doc.querySelector('.nav__toggle');
    assert.ok(menuBtn, 'Mobile hamburger menu toggle button exists');
  });

  await t.test('TC-T2.02 — Viewport Boundary 768px (Tablet Portrait / iPad)', async () => {
    assert.match(
      responsiveCss,
      /@media\s*\(max-width:\s*1023px\)/,
      'Must define tablet breakpoint (covers 768px)',
    );
    // Under 1023px (which includes 768px):
    // Accessories are 2 columns, metrics grid is 2 columns, telemetry HUD is 1 column
    assert.match(
      responsiveCss,
      /\.accessory-grid\s*\{\s*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/,
    );
    assert.match(
      responsiveCss,
      /\.arch-metrics-grid\s*\{\s*grid-template-columns:\s*repeat\(2,\s*1fr\)/,
    );
    assert.match(responsiveCss, /\.arch-telemetry-hud\s*\{\s*grid-template-columns:\s*1fr/);
  });

  await t.test(
    'TC-T2.03 — Viewport Boundary 1024px (Tablet Landscape / Laptop Breakpoint)',
    async () => {
      // Base styles or rules outside max-width: 1023px define desktop navigation
      const nav = doc.querySelector('#main-nav') || doc.querySelector('nav');
      assert.ok(nav, 'Navigation landmark exists for 1024px desktop display');
      assert.equal(
        nav.querySelectorAll('.nav__item').length,
        7,
        'Desktop nav has all 7 section links',
      );
    },
  );

  await t.test('TC-T2.04 — Viewport Boundary 1440px (Desktop Large / Retina)', async () => {
    const mainCss = await readFile(path.join(sourceDir, 'styles/main.css'), 'utf8');
    const baseCss = await readFile(path.join(sourceDir, 'styles/base.css'), 'utf8');
    const combined = `${mainCss}\n${baseCss}\n${responsiveCss}`;

    // Wrappers must constrain width to prevent edge overflow on wide screens
    const hasWrapConstraint =
      combined.includes('--wrap:') ||
      combined.includes('max-width:') ||
      doc.querySelectorAll('.wrap').length > 0;
    assert.ok(hasWrapConstraint, 'Wrappers constrain layout on 1440px screens');
    assert.ok(
      doc.querySelectorAll('.wrap').length >= 3,
      'Multiple sections utilize .wrap containers',
    );
  });

  await t.test('TC-T2.05 — Missing Resource & Error Handling', async () => {
    // Missing file returns 404
    const notFound = await serverFixture.fetchResponse(
      '/assets/images/products/non-existent-device.jpg',
    );
    assert.equal(notFound.status, 404, 'Non-existent asset returns 404');

    // Malformed URI percent encoding returns 400
    const malformed = await serverFixture.fetchResponse('/%');
    assert.equal(malformed.status, 400, 'Malformed percent-encoding returns 400');

    // Path traversal attempt returns 403
    const traversal = await serverFixture.fetchResponse('/..%2fpackage.json');
    assert.equal(traversal.status, 403, 'Directory traversal attempt returns 403');

    // Method not allowed for POST on static server
    const postRes = await serverFixture.fetchResponse('/', { method: 'POST' });
    assert.equal(postRes.status, 405, 'POST on static server returns 405 Method Not Allowed');
  });

  await t.test('TC-T2.06 — Rapid User Input Stress (Clicks & Scrubs)', async () => {
    const harness = new StorefrontInteractionHarness();

    // Rapid gallery scene cycling: 0 -> 1 -> 2 -> 0 -> 1 -> 2
    for (let i = 0; i < 20; i++) {
      const scene = harness.nextGalleryScene();
      assert.ok(scene && scene.image, 'Gallery scene remains valid during rapid cycling');
      assert.ok(harness.activeGalleryScene >= 0 && harness.activeGalleryScene <= 2);
    }

    // Rapid exploded view scrubbing: jump across frame boundaries
    const framesToTest = [0, 63, 15, 60, -10, 100, 28, 44, 4];
    for (const f of framesToTest) {
      const clamped = harness.scrubExploded(f);
      assert.ok(clamped >= 0 && clamped <= 63, `Frame ${f} clamped to valid range [0, 63]`);
    }

    // Rapid storage tier switching
    harness.openProductConfigurator('pro');
    for (let i = 0; i < 10; i++) {
      const p1 = harness.setStorageOption('256 GB');
      assert.equal(p1, 69999);
      const p2 = harness.setStorageOption('512 GB');
      assert.equal(p2, 79999);
    }
  });

  await t.test('TC-T2.07 — Empty Bag State & Recovery', async () => {
    const harness = new StorefrontInteractionHarness({ 'azure-preview-bag': '[]' });
    assert.equal(harness.bag.length, 0, 'Bag starts empty');
    assert.equal(harness.getTotalPrice(), 0, 'Empty bag total is 0');

    // Verify empty state text in shopping feature
    const shoppingJs = await readFile(path.join(sourceDir, 'scripts/features/shopping.js'), 'utf8');
    assert.match(
      shoppingJs,
      /Make room for something extraordinary/,
      'Displays Apple-caliber empty bag notification text',
    );
    assert.match(
      shoppingJs,
      /Explore the collection/,
      'Provides CTA button to explore handsets when bag is empty',
    );
  });

  await t.test('TC-T2.08 — Bag Storage Limit Enforcement (20 Items Cap)', async () => {
    const harness = new StorefrontInteractionHarness();
    harness.openProductConfigurator('pro');

    // Add exactly 20 items
    for (let i = 0; i < 20; i++) {
      const ok = harness.submitConfiguration();
      assert.equal(ok, true, `Item ${i + 1} added successfully`);
    }
    assert.equal(harness.bag.length, 20, 'Bag contains exactly 20 items');

    // 21st item should be rejected
    const rejected = harness.submitConfiguration();
    assert.equal(rejected, false, '21st item was rejected');
    assert.equal(harness.bag.length, 20, 'Bag length remains capped at 20');
    assert.ok(
      harness.toasts.some((msg) => msg.includes('20 items')),
      'Toast message explains 20 item maximum limit',
    );
  });

  await t.test('TC-T2.09 — Corrupt LocalStorage Resiliency', async () => {
    // Malformed JSON should not throw unhandled exception
    assert.doesNotThrow(() => {
      const harness = new StorefrontInteractionHarness({
        'azure-preview-bag': '{"corrupt: unclosed json',
      });
      assert.equal(harness.bag.length, 0, 'Corrupt storage falls back to clean empty bag');
      assert.equal(harness.getTotalPrice(), 0);
    }, 'Must gracefully recover from malformed localStorage');

    // Invalid item schema in JSON should be filtered out
    assert.doesNotThrow(() => {
      const harness = new StorefrontInteractionHarness({
        'azure-preview-bag': JSON.stringify([
          { model: 'unknown-alien-phone', finish: 'None' },
          null,
          { model: 'pro', finish: 'Cosmic Azure', storage: '256 GB' },
        ]),
      });
      assert.equal(harness.bag.length, 1, 'Only valid products are kept from storage');
      assert.equal(harness.bag[0].model, 'pro');
    }, 'Must filter out unknown products or null entries');
  });
});
