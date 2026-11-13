import test from 'node:test';
import assert from 'node:assert/strict';
import { StorefrontInteractionHarness } from '../fixtures/interaction-harness.mjs';
import { products, phones } from '../../src/scripts/data/products.js';

test('Tier 3: Cross-Feature Combinations (Pairwise Interactions)', async (t) => {
  await t.test('TC-T3.01 — Color Swatch & Storage Switch + Bag Configurator Pricing', async () => {
    const harness = new StorefrontInteractionHarness();

    // Open One Pro (starts with 256GB at ₹69,999)
    const configPro = harness.openProductConfigurator('pro');
    assert.equal(configPro.name, 'Azure One Pro');
    assert.equal(configPro.currentPrice, 69999);

    // Upgrade storage to 512GB (+₹10,000)
    const price512 = harness.setStorageOption('512 GB');
    assert.equal(price512, 79999, '512GB tier increases price by ₹10,000');

    // Submit configuration
    const added = harness.submitConfiguration();
    assert.equal(added, true, 'Item submitted successfully');
    assert.equal(harness.bag.length, 1);
    assert.equal(harness.bag[0].model, 'pro');
    assert.equal(harness.bag[0].storage, '512 GB');
    assert.equal(harness.getItemPrice(harness.bag[0]), 79999);

    // Verify persistent storage serialization
    const rawStored = harness.storage['azure-preview-bag'];
    assert.ok(rawStored, 'Saved to localStorage');
    const parsed = JSON.parse(rawStored);
    assert.equal(parsed[0].model, 'pro');
    assert.equal(parsed[0].storage, '512 GB');
    assert.equal(parsed[0].finish, products.pro.finish);
  });

  await t.test('TC-T3.02 — 360 Turntable Drag + Perspective Pill Synchronization', async () => {
    const harness = new StorefrontInteractionHarness();

    // Step 1: Click "Back" perspective pill -> Jump to frame 48
    const backFrame = harness.set360Perspective('back');
    assert.equal(backFrame, 48, 'Back perspective sets frame to 48');
    assert.equal(harness.current360Frame, 48);

    // Step 2: Drag 50px forward from frame 48
    const draggedFrame = harness.drag360(50, 600); // 50 / 600 * 96 = +8 frames -> 56
    assert.equal(draggedFrame, 56, 'Drag forward rotates turntable to frame 56');

    // Step 3: Click "Optics" perspective pill -> Jump to frame 72
    const opticsFrame = harness.set360Perspective('optics');
    assert.equal(opticsFrame, 72, 'Optics perspective sets frame to 72');

    // Step 4: Click "Front" perspective pill -> Return to frame 0
    const frontFrame = harness.set360Perspective('front');
    assert.equal(frontFrame, 0, 'Front perspective resets frame to 0');
  });

  await t.test('TC-T3.03 — Exploded View Slider Scrub + Layer Selector Pills', async () => {
    const harness = new StorefrontInteractionHarness();

    // Step 1: Select "A19 Silicon" layer (layer index 2 -> targetFrame 28)
    const layerA19 = harness.setExplodedLayer(2);
    assert.equal(layerA19.targetFrame, 28, 'Layer 2 targets frame 28');
    assert.equal(layerA19.stat, '38 TOPS');
    assert.equal(harness.currentExpFrame, 28);

    // Step 2: User manually scrubs slider to frame 44
    const scrubbed = harness.scrubExploded(44);
    assert.equal(scrubbed, 44, 'Scrub slider sets frame to 44');

    // Step 3: Select "Ceramic Enclosure" layer (layer index 4 -> targetFrame 60)
    const layerCeramic = harness.setExplodedLayer(4);
    assert.equal(layerCeramic.targetFrame, 60);
    assert.equal(layerCeramic.stat, 'QI2 15W');
    assert.equal(harness.currentExpFrame, 60);

    // Step 4: Select "Display" layer (layer index 0 -> targetFrame 4)
    const layerDisplay = harness.setExplodedLayer(0);
    assert.equal(layerDisplay.targetFrame, 4);
    assert.equal(layerDisplay.stat, '2,000 NITS');
    assert.equal(harness.currentExpFrame, 4);
  });

  await t.test('TC-T3.04 — Accessory Category Filter + Bag Drawer Persistence', async () => {
    const harness = new StorefrontInteractionHarness();

    // Filter to protection
    const filtered = harness.setCategoryFilter('protection');
    assert.equal(filtered.activeFilter, 'protection');
    assert.ok(filtered.visibleIds.includes('case'), 'Case is visible in protection');

    // Configure Azure Soft Case (starting price ₹1,999)
    const configCase = harness.openProductConfigurator('case');
    assert.equal(configCase.name, 'Azure Soft Case');
    assert.equal(configCase.currentPrice, 1999);

    // Submit to bag
    harness.submitConfiguration();
    assert.equal(harness.bag.length, 1);
    assert.equal(harness.bag[0].model, 'case');
    assert.equal(harness.getTotalPrice(), 1999);

    // Category filter state remains 'protection'
    assert.equal(harness.activeCategoryFilter, 'protection');

    // Verify bag persisted to storage
    const stored = JSON.parse(harness.storage['azure-preview-bag']);
    assert.equal(stored.length, 1);
    assert.equal(stored[0].model, 'case');
  });

  await t.test(
    'TC-T3.05 — Compare Matrix Dynamic Synchronization + Configure CTA Handoff',
    async () => {
      const harness = new StorefrontInteractionHarness();

      // Comparing Pro vs Air initially
      const initial = harness.getComparison('pro', 'air');
      assert.equal(initial.left.name, 'Azure One Pro');
      assert.equal(initial.right.name, 'Azure One Air');

      // If user switches left to 'air' (same as right), right must auto-switch
      const collisionAvoided = harness.getComparison('air', 'air');
      assert.notEqual(
        collisionAvoided.left.id,
        collisionAvoided.right.id,
        'Auto-switches to avoid comparing same device against itself',
      );

      // User selects Configure CTA for the compared device
      const config = harness.openProductConfigurator(collisionAvoided.left.id);
      assert.equal(config.name, products[collisionAvoided.left.id].name);
      assert.equal(config.currentPrice, products[collisionAvoided.left.id].base);
    },
  );
});
