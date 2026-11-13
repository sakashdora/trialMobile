import { products, phones, accessories } from '../../src/scripts/data/products.js';
import { scenes } from '../../src/scripts/data/gallery.js';

/**
 * Headless interaction harness for testing storefront state machines and event cycles.
 */
export class StorefrontInteractionHarness {
  constructor(initialLocalStorage = {}) {
    this.storage = { ...initialLocalStorage };
    this.bag = [];
    this.currentProduct = 'pro';
    this.selectedStorage = null;
    this.activeGalleryScene = 0;
    this.current360Frame = 0;
    this.currentExpFrame = 0;
    this.activeCategoryFilter = 'all';
    this.isAutoplay = false;
    this.dialogStack = [];
    this.toasts = [];

    // Load initial bag from simulated localStorage
    try {
      const raw = this.storage['azure-preview-bag'];
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.bag = parsed
            .filter(
              (i) =>
                i &&
                Object.hasOwn(products, i.model) &&
                typeof i.finish === 'string' &&
                (!products[i.model].storage || products[i.model].storage.includes(i.storage)),
            )
            .slice(0, 20)
            .map((i) => ({
              model: i.model,
              finish: products[i.model].finish,
              storage: products[i.model].storage ? i.storage : null,
            }));
        }
      }
    } catch {
      this.bag = [];
    }
  }

  // --- LocalStorage & Bag State ---
  syncStorage() {
    this.storage['azure-preview-bag'] = JSON.stringify(this.bag);
  }

  getItemPrice(item) {
    const p = products[item.model];
    if (!p) return 0;
    const isHigherStorage = p.storage && p.storage.indexOf(item.storage) > 0;
    return p.base + (isHigherStorage ? 10000 : 0);
  }

  getTotalPrice() {
    return this.bag.reduce((sum, item) => sum + this.getItemPrice(item), 0);
  }

  openProductConfigurator(productId) {
    if (!products[productId]) {
      throw new Error(`Product ${productId} not found in catalog.`);
    }
    this.currentProduct = productId;
    const p = products[productId];
    this.selectedStorage = p.storage ? p.storage[0] : null;
    this.dialogStack.push('product-dialog');
    return {
      name: p.name,
      basePrice: p.base,
      storageOptions: p.storage || [],
      selectedStorage: this.selectedStorage,
      currentPrice: this.getCurrentConfigPrice(),
    };
  }

  setStorageOption(storageVal) {
    const p = products[this.currentProduct];
    if (p.storage && p.storage.includes(storageVal)) {
      this.selectedStorage = storageVal;
    }
    return this.getCurrentConfigPrice();
  }

  getCurrentConfigPrice() {
    const p = products[this.currentProduct];
    if (!p) return 0;
    const isHigher = p.storage && p.storage.indexOf(this.selectedStorage) > 0;
    return p.base + (isHigher ? 10000 : 0);
  }

  submitConfiguration() {
    if (this.bag.length >= 20) {
      this.toasts.push('Your preview bag holds up to 20 items. Remove an item to add another.');
      return false;
    }
    const p = products[this.currentProduct];
    this.bag.push({
      model: this.currentProduct,
      finish: p.finish,
      storage: p.storage ? this.selectedStorage : null,
    });
    this.syncStorage();
    this.dialogStack = this.dialogStack.filter((d) => d !== 'product-dialog');
    this.toasts.push(`${p.name} added to your preview bag`);
    return true;
  }

  removeBagItem(index) {
    if (index >= 0 && index < this.bag.length) {
      const removed = this.bag.splice(index, 1)[0];
      this.syncStorage();
      return removed;
    }
    return null;
  }

  // --- Category Filtering ---
  setCategoryFilter(category) {
    this.activeCategoryFilter = category;
    const visibleCards = accessories.filter((id) => {
      const p = products[id];
      return category === 'all' || p.category === category;
    });
    return {
      activeFilter: category,
      visibleCount: visibleCards.length,
      visibleIds: visibleCards,
    };
  }

  // --- Compare Matrix ---
  getComparison(leftId, rightId) {
    if (leftId === rightId) {
      rightId = phones.find((x) => x !== leftId) || leftId;
    }
    const a = products[leftId];
    const b = products[rightId];
    return {
      left: {
        id: leftId,
        name: a.name,
        price: a.base,
        display: a.display,
        camera: a.camera,
        finishes: a.finish,
      },
      right: {
        id: rightId,
        name: b.name,
        price: b.base,
        display: b.display,
        camera: b.camera,
        finishes: b.finish,
      },
    };
  }

  // --- 360 Exterior Turntable ---
  set360Perspective(perspective) {
    const mapping = {
      front: 0,
      profile: 24,
      back: 48,
      optics: 72,
    };
    if (mapping[perspective] !== undefined) {
      this.current360Frame = mapping[perspective];
      return this.current360Frame;
    }
    throw new Error(`Unknown perspective: ${perspective}`);
  }

  drag360(deltaX, width = 600) {
    const totalFrames = 96;
    const frameDelta = Math.round((deltaX / width) * totalFrames);
    this.current360Frame = (this.current360Frame + frameDelta + totalFrames * 10) % totalFrames;
    return this.current360Frame;
  }

  // --- Exploded Architecture ---
  setExplodedLayer(layerIndex) {
    const layers = [
      { targetFrame: 4, label: 'Display', stat: '2,000 NITS' },
      { targetFrame: 16, label: 'Titanium Core', stat: 'GRADE 5' },
      { targetFrame: 28, label: 'A19 Silicon', stat: '38 TOPS' },
      { targetFrame: 44, label: 'Optics', stat: '48MP F/1.78' },
      { targetFrame: 60, label: 'Ceramic Enclosure', stat: 'QI2 15W' },
    ];
    if (layerIndex >= 0 && layerIndex < layers.length) {
      this.currentExpFrame = layers[layerIndex].targetFrame;
      return layers[layerIndex];
    }
    throw new Error(`Invalid layer index: ${layerIndex}`);
  }

  scrubExploded(frame) {
    this.currentExpFrame = Math.max(0, Math.min(63, Math.round(frame)));
    return this.currentExpFrame;
  }

  toggleAutoplay() {
    this.isAutoplay = !this.isAutoplay;
    return this.isAutoplay;
  }

  // --- Camera Gallery ---
  nextGalleryScene() {
    this.activeGalleryScene = (this.activeGalleryScene + 1) % scenes.length;
    return scenes[this.activeGalleryScene];
  }

  prevGalleryScene() {
    this.activeGalleryScene = (this.activeGalleryScene + scenes.length - 1) % scenes.length;
    return scenes[this.activeGalleryScene];
  }

  setGalleryScene(index) {
    if (index >= 0 && index < scenes.length) {
      this.activeGalleryScene = index;
      return scenes[index];
    }
    throw new Error(`Invalid gallery index: ${index}`);
  }
}
