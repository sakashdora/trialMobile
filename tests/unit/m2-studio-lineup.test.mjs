import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { createServer } from 'vite';

test('Milestone M2: Hero, Lineup & Hardware Studio Unit & Integration Verification', async (t) => {
  const vite = await createServer({
    root: process.cwd(),
    server: { middlewareMode: true },
    appType: 'custom',
  });

  const { flagshipPhones, ecosystemAccessories, productMap, allProducts } =
    await vite.ssrLoadModule('/src/data/products.ts');
  const { BagProvider } = await vite.ssrLoadModule('/src/context/BagContext.tsx');
  const { HeroSection } = await vite.ssrLoadModule('/src/components/sections/HeroSection.tsx');
  const { CollectionSection } = await vite.ssrLoadModule(
    '/src/components/sections/CollectionSection.tsx',
  );
  const { HardwareStudio } = await vite.ssrLoadModule(
    '/src/components/sections/HardwareStudio.tsx',
  );
  const { App } = await vite.ssrLoadModule('/src/App.tsx');

  t.after(async () => {
    await vite.close();
  });

  await t.test('Product catalog data integrity for One Pro, One Air, and One', () => {
    assert.equal(flagshipPhones.length, 3, 'Must have 3 flagship phones');

    // 1. One Pro
    const pro = flagshipPhones.find((p) => p.id === 'pro');
    assert.ok(pro, 'One Pro must exist in catalog');
    assert.equal(pro.startingPrice, 69999);
    assert.equal(pro.name, 'AZURE One Pro');
    assert.equal(pro.category, 'handset');
    assert.ok(
      pro.finishes.some((f) => f.name === 'Cosmic Azure'),
      'Must include Cosmic Azure finish',
    );
    assert.ok(
      pro.finishes.some((f) => f.name === 'Natural Titanium'),
      'Must include Natural Titanium finish',
    );
    assert.ok(
      pro.finishes.some((f) => f.name === 'Desert Titanium'),
      'Must include Desert Titanium finish',
    );
    assert.ok(
      pro.finishes.some((f) => f.name === 'White Titanium'),
      'Must include White Titanium finish',
    );
    assert.ok(
      pro.finishes.some((f) => f.name === 'Black Titanium'),
      'Must include Black Titanium finish',
    );
    assert.ok(pro.specs['Display'].includes('6.7″'), 'One Pro has 6.7″ display');
    assert.ok(pro.specs['Chip'].includes('A19 Ultra'), 'One Pro has A19 Ultra silicon');
    assert.ok(pro.specs['Camera'].includes('48MP'), 'One Pro has 48MP ProVision optics');

    // 2. One Air
    const air = flagshipPhones.find((p) => p.id === 'air');
    assert.ok(air, 'One Air must exist in catalog');
    assert.equal(air.startingPrice, 59999);
    assert.ok(
      air.finishes.some((f) => f.name === 'Pearl Silver'),
      'Must include Pearl Silver finish',
    );
    assert.ok(air.specs['Display'].includes('6.5″'), 'One Air has 6.5″ display');

    // 3. One Essential
    const one = flagshipPhones.find((p) => p.id === 'one');
    assert.ok(one, 'One must exist in catalog');
    assert.equal(one.startingPrice, 44999);
    assert.ok(
      one.finishes.some((f) => f.name === 'Sage'),
      'Must include Sage finish',
    );
    assert.ok(one.specs['Display'].includes('6.1″'), 'One has 6.1″ display');

    // Ecosystem Accessories
    assert.equal(ecosystemAccessories.length, 3, 'Must have 3 ecosystem accessories');
    assert.ok(productMap['magcharge'], 'MagCharge in catalog');
    assert.ok(productMap['armorcable'], 'ArmorCable in catalog');
    assert.ok(productMap['shieldcase'], 'ShieldCase in catalog');
    assert.equal(allProducts.length, 6);
  });

  await t.test('HeroSection renders full viewport structure and mandatory test contracts', () => {
    const html = ReactDOMServer.renderToString(
      React.createElement(BagProvider, null, React.createElement(HeroSection)),
    );

    // Section ID & Taste-skill contract
    assert.ok(html.includes('id="home"'), 'Must have id="home"');
    assert.ok(html.includes('data-enter'), 'Must have data-enter attribute');

    // Typography
    assert.ok(html.includes('AZURE'), 'Headline includes AZURE');
    assert.ok(html.includes('Built Beyond Limits'), 'Headline includes Built Beyond Limits');

    // Lead & Facts
    assert.ok(html.includes('class="hero-lead'), 'Contains .hero-lead class');
    assert.ok(html.includes('class="hero-facts'), 'Contains .hero-facts class');
    assert.ok(html.includes('48MP'), 'Contains 48MP metric');
    assert.ok(html.includes('A19 Ultra'), 'Contains A19 Ultra metric');
    assert.ok(html.includes('120Hz'), 'Contains 120Hz metric');

    // CTA & 360 link
    assert.ok(html.includes('data-product="pro"'), 'Shimmer button has data-product="pro"');
    assert.ok(html.includes('shimmer-btn'), 'Contains .shimmer-btn class');
    assert.ok(html.includes('href="#design"'), 'Contains link to #design');
    assert.ok(html.includes('360° Titanium View'), 'Contains 360 view pill label');
  });

  await t.test('CollectionSection renders bento grid with interactive finishes and prices', () => {
    const html = ReactDOMServer.renderToString(
      React.createElement(BagProvider, null, React.createElement(CollectionSection)),
    );

    assert.ok(html.includes('id="collection"'), 'Must have id="collection"');
    assert.ok(html.includes('AZURE One Pro'), 'Displays One Pro');
    assert.ok(html.includes('AZURE One Air'), 'Displays One Air');
    assert.ok(html.includes('AZURE One'), 'Displays One');

    assert.ok(html.includes('₹69,999'), 'Displays Pro price');
    assert.ok(html.includes('₹59,999'), 'Displays Air price');
    assert.ok(html.includes('₹44,999'), 'Displays One price');

    assert.ok(html.includes('Cosmic Azure'), 'Displays Cosmic Azure finish');
    assert.ok(html.includes('Pearl Silver'), 'Displays Pearl Silver finish');
    assert.ok(html.includes('Sage'), 'Displays Sage finish');
  });

  await t.test(
    'HardwareStudio renders dual-mode stage, 4 exterior perspective pills, and 5 assembly layers',
    () => {
      const html = ReactDOMServer.renderToString(
        React.createElement(BagProvider, null, React.createElement(HardwareStudio)),
      );

      assert.ok(html.includes('id="design"'), 'Must have id="design"');
      assert.ok(html.includes('id="studio-stage"'), 'Must have id="studio-stage"');
      assert.ok(html.includes('id="studio-phone-view"'), 'Must have id="studio-phone-view"');
      assert.ok(
        html.includes('id="studio-exterior-controls"'),
        'Must have id="studio-exterior-controls"',
      );

      // Verify perspective angle pills
      assert.ok(html.includes('Front'), 'Contains Front angle pill');
      assert.ok(html.includes('Profile'), 'Contains Profile angle pill');
      assert.ok(html.includes('Back'), 'Contains Back angle pill');
      assert.ok(html.includes('Optics'), 'Contains Optics angle pill');
      assert.ok(html.includes('studio-angle-pill'), 'Contains .studio-angle-pill class');

      // Verify exploded assembly controls & sliders
      assert.ok(html.includes('studio-assembly-slider'), 'Contains studio-assembly-slider');
      assert.ok(html.includes('arch-hud-readout'), 'Contains arch-hud-readout');
      assert.ok(html.includes('arch-scrub-slider'), 'Contains arch-scrub-slider');
      assert.ok(html.includes('arch-autoplay-btn'), 'Contains arch-autoplay-btn');
      assert.ok(html.includes('arch-layer-pill'), 'Contains arch-layer-pill');
    },
  );

  await t.test('App component successfully mounts all M2 sections into unified application', () => {
    const html = ReactDOMServer.renderToString(React.createElement(App));

    assert.ok(html.includes('id="home"'), 'App renders #home');
    assert.ok(html.includes('id="collection"'), 'App renders #collection');
    assert.ok(html.includes('id="design"'), 'App renders #design');
    assert.ok(html.includes('id="camera"'), 'App renders #camera');
    assert.ok(html.includes('id="performance"'), 'App renders #performance');
    assert.ok(html.includes('id="accessories"'), 'App renders #accessories');
    assert.ok(html.includes('id="compare"'), 'App renders #compare');
    assert.ok(html.includes('id="support"'), 'App renders #support');
    assert.ok(html.includes('id="order"'), 'App renders #order');
  });
});
