import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { createServer } from 'vite';

test('Milestone M3: Camera Optics, Silicon Architecture & Catalog Showcase Unit Verification', async (t) => {
  const vite = await createServer({
    root: process.cwd(),
    server: { middlewareMode: true },
    appType: 'custom',
  });

  const { galleryScenes, scenes } = await vite.ssrLoadModule('/src/data/gallery.ts');
  const { SILICON_METRICS, DIE_BLOCKS, COMPUTE_BENCHMARKS } =
    await vite.ssrLoadModule('/src/data/silicon.ts');
  const {
    flagshipPhones,
    ecosystemAccessories,
    allProducts,
    audioAccessories,
    catalogAccessories,
  } = await vite.ssrLoadModule('/src/data/products.ts');
  const { BagProvider } = await vite.ssrLoadModule('/src/context/BagContext.tsx');
  const { CameraSection } = await vite.ssrLoadModule('/src/components/sections/CameraSection.tsx');
  const { SiliconSection } = await vite.ssrLoadModule(
    '/src/components/sections/SiliconSection.tsx',
  );
  const { AccessoriesSection } = await vite.ssrLoadModule(
    '/src/components/sections/AccessoriesSection.tsx',
  );
  const { ProductConfiguratorModal } = await vite.ssrLoadModule(
    '/src/components/common/ProductConfiguratorModal.tsx',
  );
  const { App } = await vite.ssrLoadModule('/src/App.tsx');

  t.after(async () => {
    await vite.close();
  });

  await t.test('1. Gallery Data & Types Integrity', () => {
    assert.equal(galleryScenes.length, 3, 'Must contain exactly 3 curated scenes');
    assert.equal(scenes.length, 3, 'scenes alias matches galleryScenes length');

    // Scene 0: Night
    assert.equal(galleryScenes[0].id, 'night');
    assert.ok(galleryScenes[0].kicker.includes('AFTER HOURS'));
    assert.ok(galleryScenes[0].title.includes('Low-Light Astro'));
    assert.equal(galleryScenes[0].credit, 'Priscilla Du Preez');
    assert.ok(galleryScenes[0].image.includes('gallery-night.jpg'));

    // Scene 1: City
    assert.equal(galleryScenes[1].id, 'city');
    assert.ok(galleryScenes[1].kicker.includes('BLUE HOUR'));
    assert.equal(galleryScenes[1].credit, 'Saad Chaudhry');
    assert.ok(galleryScenes[1].image.includes('gallery-city.jpg'));

    // Scene 2: Landscape
    assert.equal(galleryScenes[2].id, 'landscape');
    assert.ok(galleryScenes[2].kicker.includes('OPEN HORIZONS'));
    assert.equal(galleryScenes[2].credit, 'Jakob Rosen');
    assert.ok(galleryScenes[2].image.includes('gallery-landscape.jpg'));
  });

  await t.test('2. Silicon Architecture Data Integrity', () => {
    assert.equal(SILICON_METRICS.length, 4, 'Must have 4 bento metrics');
    assert.equal(SILICON_METRICS[0].targetValue, 18.6);
    assert.equal(SILICON_METRICS[1].targetValue, 39);
    assert.equal(SILICON_METRICS[2].targetValue, 3000);
    assert.equal(SILICON_METRICS[3].targetValue, 100);

    assert.equal(DIE_BLOCKS.length, 5, 'Must have 5 functional die blocks');
    assert.ok(DIE_BLOCKS.some((b) => b.id === 'perf-cpu'));
    assert.ok(DIE_BLOCKS.some((b) => b.id === 'eff-cpu'));
    assert.ok(DIE_BLOCKS.some((b) => b.id === 'neural-engine'));
    assert.ok(DIE_BLOCKS.some((b) => b.id === 'gpu-cores'));
    assert.ok(DIE_BLOCKS.some((b) => b.id === 'memory-fabric'));

    assert.ok(COMPUTE_BENCHMARKS.length >= 3, 'Must have at least 3 compute benchmarks');
  });

  await t.test('3. Catalog & Accessories Preservation & Expansion', () => {
    // M2 Guard Rail Check
    assert.equal(ecosystemAccessories.length, 3, 'Preserves ecosystemAccessories length of 3');
    assert.equal(allProducts.length, 6, 'Preserves allProducts length of 6');

    // Audio and complete catalog accessories
    assert.ok(audioAccessories.length >= 1, 'Exports audioAccessories');
    assert.ok(audioAccessories.some((a) => a.id === 'buds'));
    assert.equal(catalogAccessories.length, 4, 'catalogAccessories has 4 accessories');
    assert.ok(catalogAccessories.some((a) => a.id === 'magcharge'));
    assert.ok(catalogAccessories.some((a) => a.id === 'armorcable'));
    assert.ok(catalogAccessories.some((a) => a.id === 'shieldcase'));
    assert.ok(catalogAccessories.some((a) => a.id === 'buds'));
  });

  await t.test('4. CameraSection SSR Rendering & DOM Contract Adherence', () => {
    const html = ReactDOMServer.renderToString(
      React.createElement(BagProvider, null, React.createElement(CameraSection)),
    );

    assert.ok(html.includes('id="camera"'), 'Section has id="camera"');
    assert.ok(html.includes('id="gallery-image"'), 'Contains #gallery-image');
    assert.ok(html.includes('id="gallery-prev"'), 'Contains #gallery-prev button');
    assert.ok(html.includes('id="gallery-next"'), 'Contains #gallery-next button');
    assert.ok(html.includes('id="expand-photo"'), 'Contains #expand-photo button');
    assert.ok(html.includes('id="photo-dialog"'), 'Contains #photo-dialog modal');
    assert.ok(html.includes('id="large-photo"'), 'Contains #large-photo inside dialog');
    assert.ok(html.includes('id="large-photo-caption"'), 'Contains #large-photo-caption');
    assert.ok(html.includes('data-scene="0"'), 'Contains data-scene="0"');
    assert.ok(html.includes('data-scene="1"'), 'Contains data-scene="1"');
    assert.ok(html.includes('data-scene="2"'), 'Contains data-scene="2"');

    // Optics bento features
    assert.ok(html.includes('48MP Tetraprism Optics'), 'Mentions 48MP Tetraprism Optics');
    assert.ok(html.includes('5x Optical'), 'Mentions 5x Optical');
    assert.ok(html.includes('120mm Equivalent Focal Length'), 'Mentions 120mm focal length');
  });

  await t.test('5. SiliconSection SSR Rendering & Telemetry Adherence', () => {
    const html = ReactDOMServer.renderToString(
      React.createElement(BagProvider, null, React.createElement(SiliconSection)),
    );

    assert.ok(html.includes('id="performance"'), 'Section has id="performance"');
    assert.ok(html.includes('TSMC 3NM PROCESS NODE'), 'Mentions TSMC 3NM process node');
    assert.ok(html.includes('A19 Ultra Silicon. 39 TOPS Compute.'), 'Headline matches');
    assert.ok(html.includes('18.6B'), 'Displays 18.6B transistor metric');
    assert.ok(html.includes('39 TOPS'), 'Displays 39 TOPS metric');
    assert.ok(html.includes('3,000 Nits'), 'Displays 3,000 Nits metric');
    assert.ok(html.includes('100%'), 'Displays 100% cooling metric');

    // Die blocks
    assert.ok(html.includes('Firestorm Pro Performance Cores'), 'Displays Firestorm cores');
    assert.ok(html.includes('16-Core Matrix Neural Engine'), 'Displays Neural Engine die block');
  });

  await t.test('6. AccessoriesSection & ProductConfiguratorModal SSR Rendering', () => {
    const html = ReactDOMServer.renderToString(
      React.createElement(BagProvider, null, React.createElement(AccessoriesSection)),
    );

    assert.ok(html.includes('id="accessories"'), 'Section has id="accessories"');
    assert.ok(html.includes('id="accessory-grid"'), 'Contains #accessory-grid');
    assert.ok(html.includes('id="accessory-count"'), 'Contains #accessory-count');

    // 4 Filter Buttons
    assert.ok(html.includes('data-filter="all"'), 'Contains data-filter="all"');
    assert.ok(html.includes('data-filter="charging"'), 'Contains data-filter="charging"');
    assert.ok(html.includes('data-filter="audio"'), 'Contains data-filter="audio"');
    assert.ok(html.includes('data-filter="protection"'), 'Contains data-filter="protection"');

    // Product cards
    assert.ok(html.includes('AZURE MagCharge 30W'), 'Renders MagCharge card');
    assert.ok(html.includes('ArmorCable 240W'), 'Renders ArmorCable card');
    assert.ok(html.includes('AZURE ShieldCase'), 'Renders ShieldCase card');
    assert.ok(html.includes('AZURE Buds Acoustic'), 'Renders Buds card');

    // Product dialog and configurator
    assert.ok(html.includes('id="product-dialog"'), 'Contains #product-dialog');
    assert.ok(html.includes('id="storage"'), 'Contains #storage select');
    assert.ok(html.includes('id="config-price"'), 'Contains #config-price');
    assert.ok(html.includes('id="configuration-form"'), 'Contains #configuration-form');

    // Physics Visualizers
    assert.ok(html.includes('Qi2 Neodymium Latch'), 'Contains Neodymium physics');
    assert.ok(html.includes('Thunderbolt 4'), 'Contains Thunderbolt physics');
    assert.ok(html.includes('ShieldCase Shock Absorption'), 'Contains shock absorption physics');
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
  });
});
