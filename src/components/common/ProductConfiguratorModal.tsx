import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ProductSpec } from '../../types/product';
import { useBag } from '../../context/BagContext';
import { formatPrice } from '../../lib/utils';
import { flagshipPhones } from '../../data/products';

export interface ProductConfiguratorModalProps {
  product?: ProductSpec | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductConfiguratorModal: React.FC<ProductConfiguratorModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { addItem, setIsDrawerOpen } = useBag();

  // Fallback to One Pro if no product passed, ensuring DOM elements are always fully populated
  const defaultProduct = flagshipPhones[0];
  const activeProduct = product || defaultProduct;

  const [selectedFinish, setSelectedFinish] = useState(
    activeProduct.finishes[0]?.name || 'Cosmic Azure',
  );
  const [selectedStorage, setSelectedStorage] = useState(
    activeProduct.storageOptions?.[0]?.size || '256 GB',
  );

  // Synchronize defaults on product change
  useEffect(() => {
    if (activeProduct) {
      if (activeProduct.finishes[0]) {
        setSelectedFinish(activeProduct.finishes[0].name);
      }
      if (activeProduct.storageOptions && activeProduct.storageOptions.length > 0) {
        setSelectedStorage(activeProduct.storageOptions[0].size);
      } else {
        setSelectedStorage('Standard');
      }
    }
  }, [activeProduct]);

  const hasStorage = Boolean(
    activeProduct.storageOptions && activeProduct.storageOptions.length > 0,
  );
  const storageOptions = hasStorage ? activeProduct.storageOptions! : [];

  const currentStorageOption = storageOptions.find((opt) => opt.size === selectedStorage);
  const storageDelta = currentStorageOption ? currentStorageOption.priceDelta : 0;
  const calculatedPrice = activeProduct.startingPrice + storageDelta;

  const currentFinishObj = activeProduct.finishes.find((f) => f.name === selectedFinish);
  const activeImage = currentFinishObj?.image || activeProduct.image;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addItem({
      model: activeProduct.id,
      name: activeProduct.name,
      price: calculatedPrice,
      image: activeImage,
      finish: selectedFinish,
      storage: hasStorage ? selectedStorage : undefined,
    });
    setIsDrawerOpen(true);
    onClose();
  };

  return (
    <dialog
      id="product-dialog"
      className={`product-dialog fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xl p-4 sm:p-6 flex items-center justify-center transition-all duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'hidden opacity-0 pointer-events-none'
      }`}
      aria-labelledby="product-title"
      open={isOpen}
    >
      <div className="relative w-full max-w-4xl bg-zinc-900/95 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden glass-card">
        <button
          type="button"
          className="close-dialog absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Close product details"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="modal-layout grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Visual Art */}
          <div className="modal-art flex flex-col items-center justify-center p-6 rounded-2xl bg-black/40 border border-white/5">
            <img
              id="product-image"
              src={activeImage}
              alt={activeProduct.name}
              className="max-h-72 object-contain filter drop-shadow-[0_20px_30px_rgba(56,189,248,0.25)] transition-all duration-300"
            />
            <p className="mt-4 text-xs text-zinc-400 font-medium">
              {selectedFinish} {hasStorage ? `• ${selectedStorage}` : ''}
            </p>
          </div>

          {/* Copy & Config Form */}
          <div className="modal-copy flex flex-col justify-between">
            <div>
              <span className="eyebrow">{activeProduct.badge || 'Configurator'}</span>
              <h2 id="product-title" className="text-2xl sm:text-3xl font-bold text-white mt-1">
                {activeProduct.name}
              </h2>
              <p id="product-description" className="text-sm text-zinc-400 mt-2 leading-relaxed">
                {activeProduct.description}
              </p>

              <ul id="product-highlights" className="mt-4 space-y-1.5 text-xs text-zinc-300">
                {activeProduct.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-azure-cyan font-bold">✓</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <form id="configuration-form" onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Finish Selection */}
              <div>
                <label htmlFor="finish" className="block text-xs font-semibold text-zinc-300 mb-2">
                  Finish: <span className="text-white">{selectedFinish}</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {activeProduct.finishes.map((f) => (
                    <button
                      key={f.name}
                      type="button"
                      onClick={() => setSelectedFinish(f.name)}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
                        selectedFinish === f.name
                          ? 'border-azure-cyan bg-azure-cyan/10 text-white'
                          : 'border-white/10 hover:border-white/20 text-zinc-400'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/40"
                        style={{ backgroundColor: f.colorHex }}
                      />
                      <span>{f.name}</span>
                    </button>
                  ))}
                </div>
                <select
                  id="finish"
                  value={selectedFinish}
                  onChange={(e) => setSelectedFinish(e.target.value)}
                  className="w-full bg-zinc-800/90 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-azure-cyan"
                >
                  {activeProduct.finishes.map((f) => (
                    <option key={f.name} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Storage Selection */}
              {hasStorage && (
                <div id="storage-field">
                  <label
                    htmlFor="storage"
                    className="block text-xs font-semibold text-zinc-300 mb-2"
                  >
                    Storage Capacity
                  </label>
                  <select
                    id="storage"
                    value={selectedStorage}
                    onChange={(e) => setSelectedStorage(e.target.value)}
                    className="w-full bg-zinc-800/90 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-azure-cyan"
                  >
                    {storageOptions.map((opt) => (
                      <option key={opt.size} value={opt.size}>
                        {opt.size} {opt.priceDelta > 0 ? `(+${formatPrice(opt.priceDelta)})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price Calculation & Submit */}
              <div className="configuration-total pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="block text-xs text-zinc-400">Starting price</span>
                  <strong
                    id="config-price"
                    className="text-2xl font-bold text-white tracking-tight"
                  >
                    {formatPrice(calculatedPrice)}
                  </strong>
                </div>

                <button
                  type="submit"
                  className="button light btn px-6 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black text-sm font-semibold transition-colors flex items-center space-x-1.5 shadow-lg shadow-white/10"
                >
                  <span>Add to preview bag</span>
                  <span className="text-base font-bold leading-none">＋</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </dialog>
  );
};
