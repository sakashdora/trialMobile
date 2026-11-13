import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { createServer } from 'vite';

test('Milestone M4: Compare Matrix, Support, Bag Drawer & Polish Unit Verification', async (t) => {
  const vite = await createServer({
    root: process.cwd(),
    server: { middlewareMode: true },
    appType: 'custom',
  });

  const { comparisonDevices, PHONE_IDS, resolveCollision, getComparison, comparisonSpecRows } =
    await vite.ssrLoadModule('/src/data/comparison.ts');

  const { CONCIERGE_CARDS, FAQ_ITEMS, DIAGNOSTIC_TELEMETRY_ITEMS } =
    await vite.ssrLoadModule('/src/data/support.ts');

  const { BagProvider } = await vite.ssrLoadModule('/src/context/BagContext.tsx');
  const { CompareSection } = await vite.ssrLoadModule(
    '/src/components/sections/CompareSection.tsx',
  );
  const { SupportSection } = await vite.ssrLoadModule(
    '/src/components/sections/SupportSection.tsx',
  );
  const { BagDrawer } = await vite.ssrLoadModule('/src/components/common/BagDrawer.tsx');
  const { Navbar } = await vite.ssrLoadModule('/src/components/common/Navbar.tsx');
  const { App } = await vite.ssrLoadModule('/src/App.tsx');

  t.after(async () => {
    await vite.close();
  });

  await t.test('1. Comparison Data Schema & Collision Avoidance Logic', () => {
    assert.deepEqual(
      PHONE_IDS,
      ['pro', 'air', 'one'],
      'Canonical PHONE_IDS array is pro, air, one',
    );
    assert.ok(comparisonDevices.pro, 'Pro specs exist');
    assert.ok(comparisonDevices.air, 'Air specs exist');
    assert.ok(comparisonDevices.one, 'One specs exist');

    assert.equal(comparisonDevices.pro.startingPrice, 69999, 'Pro price is ₹69,999');
    assert.equal(comparisonDevices.air.startingPrice, 59999, 'Air price is ₹59,999');
    assert.equal(comparisonDevices.one.startingPrice, 44999, 'One price is ₹44,999');

    // Collision avoidance resolution
    assert.equal(resolveCollision('pro', 'pro'), 'air', 'pro vs pro resolves right to air');
    assert.equal(resolveCollision('air', 'air'), 'pro', 'air vs air resolves right to pro');
    assert.equal(resolveCollision('one', 'one'), 'pro', 'one vs one resolves right to pro');
    assert.equal(resolveCollision('pro', 'air'), 'air', 'pro vs air is untouched');

    // getComparison helper
    const normal = getComparison('pro', 'air');
    assert.equal(normal.left.id, 'pro');
    assert.equal(normal.right.id, 'air');

    const collision = getComparison('air', 'air');
    assert.equal(collision.left.id, 'air');
    assert.notEqual(collision.right.id, 'air', 'Avoids collision on identical selection');

    assert.ok(comparisonSpecRows.length >= 6, 'Spec rows contain at least 6 technical categories');
  });

  await t.test('2. Support Data & FAQ Catalog Integrity', () => {
    assert.equal(CONCIERGE_CARDS.length, 3, 'Must contain exactly 3 concierge service cards');
    assert.ok(
      CONCIERGE_CARDS.some((c) => c.id === 'warranty'),
      'Contains warranty card',
    );
    assert.ok(
      CONCIERGE_CARDS.some((c) => c.id === 'dispatch'),
      'Contains courier dispatch card',
    );
    assert.ok(
      CONCIERGE_CARDS.some((c) => c.id === 'concierge'),
      'Contains concierge specialist card',
    );

    assert.equal(FAQ_ITEMS.length, 6, 'Must contain exactly 6 authoritative FAQ items');
    assert.ok(
      FAQ_ITEMS.some((f) => f.id === 'warranty-terms'),
      'Covers warranty terms',
    );
    assert.ok(
      FAQ_ITEMS.some((f) => f.id === 'dispatch-sla'),
      'Covers express courier dispatch',
    );
    assert.ok(
      FAQ_ITEMS.some((f) => f.id === 'return-policy'),
      'Covers 14-day zero-restocking return',
    );
    assert.ok(
      FAQ_ITEMS.some((f) => f.id === 'diagnostics-repair'),
      'Covers remote hardware diagnostics',
    );
    assert.ok(
      FAQ_ITEMS.some((f) => f.id === 'esim-connectivity'),
      'Covers eSIM worldwide connectivity',
    );
    assert.ok(
      FAQ_ITEMS.some((f) => f.id === 'data-migration'),
      'Covers white glove data migration',
    );

    assert.equal(DIAGNOSTIC_TELEMETRY_ITEMS.length, 4, 'Contains 4 diagnostic telemetry items');
  });

  await t.test('3. CompareSection SSR Rendering & DOM Contract Adherence', () => {
    const html = ReactDOMServer.renderToString(
      React.createElement(BagProvider, null, React.createElement(CompareSection)),
    );

    assert.ok(html.includes('id="compare"'), 'Section has id="compare"');
    assert.ok(html.includes('id="compare-visuals"'), 'Contains #compare-visuals container');
    assert.ok(html.includes('id="compare-img-left"'), 'Contains #compare-img-left image');
    assert.ok(html.includes('id="compare-img-right"'), 'Contains #compare-img-right image');

    assert.ok(html.includes('id="compare-pickers"'), 'Contains #compare-pickers container');
    assert.ok(html.includes('id="compare-left"'), 'Contains #compare-left dropdown');
    assert.ok(html.includes('id="compare-right"'), 'Contains #compare-right dropdown');

    assert.ok(html.includes('<table'), 'Contains table element');
    assert.ok(html.includes('id="compare-head"'), 'Contains thead#compare-head');
    assert.ok(html.includes('id="compare-body"'), 'Contains tbody#compare-body');
    assert.ok(html.includes('compare-phone-title'), 'Contains compare-phone-title class');

    // Button contracts
    assert.ok(html.includes('data-product="pro"'), 'Contains data-product="pro"');
    assert.ok(html.includes('data-product="air"'), 'Contains data-product="air"');
    assert.ok(html.includes('button light btn'), 'Contains button light btn classes');
  });

  await t.test('4. SupportSection SSR Rendering & ARIA Disclosure Pattern', () => {
    const html = ReactDOMServer.renderToString(
      React.createElement(BagProvider, null, React.createElement(SupportSection)),
    );

    assert.ok(html.includes('id="support"'), 'Section has id="support"');
    assert.ok(html.includes('2-Year Full Hardware Warranty'), 'Renders warranty card');
    assert.ok(html.includes('Express Global Courier Dispatch'), 'Renders dispatch card');
    assert.ok(html.includes('24/7 Dedicated Concierge'), 'Renders concierge card');

    // Interactive hardware diagnostics card
    assert.ok(html.includes('AZURE Hardware Diagnostic Lab'), 'Contains diagnostics header');
    assert.ok(
      html.includes('Run Hardware Diagnostic Handshake'),
      'Contains diagnostic trigger button',
    );

    // Accordion FAQ & ARIA disclosures
    assert.ok(html.includes('aria-expanded="true"'), 'Has at least one expanded item');
    assert.ok(
      html.includes('aria-controls="faq-answer-warranty-terms"'),
      'Trigger points to answer region',
    );
    assert.ok(html.includes('role="region"'), 'Answer containers have role="region"');
    assert.ok(
      html.includes('aria-labelledby="faq-trigger-warranty-terms"'),
      'Region labeled by trigger',
    );
  });

  await t.test('5. BagDrawer Unconditional Dialog Rendering & DOM Alignment', () => {
    const html = ReactDOMServer.renderToString(
      React.createElement(BagProvider, null, React.createElement(BagDrawer)),
    );

    // Unconditional dialog existence in DOM
    assert.ok(html.includes('id="bag-dialog"'), 'Contains dialog#bag-dialog unconditionally');
    assert.ok(html.includes('id="bag-items"'), 'Contains #bag-items container');
    assert.ok(html.includes('id="bag-summary"'), 'Contains #bag-summary container');
    assert.ok(html.includes('close-dialog'), 'Contains .close-dialog button class');

    // Apple-caliber empty bag state
    assert.ok(html.includes('empty-bag'), 'Contains .empty-bag class');
    assert.ok(
      html.includes('Make room for something extraordinary'),
      'Renders canonical empty bag notification text',
    );
    assert.ok(html.includes('Explore the collection ↗'), 'Renders Explore the collection CTA');
    assert.ok(html.includes('button light'), 'CTA carries button light class');
    assert.ok(html.includes('href="#collection"'), 'CTA links to #collection');
  });

  await t.test('6. Navbar DOM Alignment', () => {
    const html = ReactDOMServer.renderToString(
      React.createElement(BagProvider, null, React.createElement(Navbar)),
    );

    assert.ok(html.includes('bag-button'), 'Navbar bag button carries .bag-button class');
    assert.ok(html.includes('id="bag-count"'), 'Navbar contains span#bag-count');
  });

  await t.test('7. App Component Full Unified Integration', () => {
    const html = ReactDOMServer.renderToString(React.createElement(App));

    assert.ok(html.includes('id="home"'), 'Renders #home');
    assert.ok(html.includes('id="collection"'), 'Renders #collection');
    assert.ok(html.includes('id="design"'), 'Renders #design');
    assert.ok(html.includes('id="camera"'), 'Renders #camera');
    assert.ok(html.includes('id="performance"'), 'Renders #performance');
    assert.ok(html.includes('id="accessories"'), 'Renders #accessories');
    assert.ok(html.includes('id="compare"'), 'Renders #compare');
    assert.ok(html.includes('id="support"'), 'Renders #support');
    assert.ok(html.includes('id="order"'), 'Renders #order');

    // Dialogs unconditionally present
    assert.ok(html.includes('id="bag-dialog"'), 'App renders #bag-dialog');
    assert.ok(html.includes('id="product-dialog"'), 'App renders #product-dialog');
    assert.ok(html.includes('id="photo-dialog"'), 'App renders #photo-dialog');
  });
});
