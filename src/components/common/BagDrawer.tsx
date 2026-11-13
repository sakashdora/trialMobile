import React, { useEffect } from 'react';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useBag } from '../../context/BagContext';
import { formatPrice } from '../../lib/utils';

export const BagDrawer: React.FC = () => {
  const { isDrawerOpen, setIsDrawerOpen, items, removeItem, clearBag, totalPrice, itemCount } =
    useBag();

  // Handle Escape key to dismiss drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, setIsDrawerOpen]);

  return (
    <dialog
      id="bag-dialog"
      aria-label="Your preview selection"
      open={isDrawerOpen}
      className={`bag-dialog fixed inset-0 z-50 overflow-hidden m-0 p-0 w-full h-full max-w-none max-h-none border-none bg-transparent transition-all duration-300 ${
        isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'hidden opacity-0 pointer-events-none'
      }`}
    >
      <div className="relative w-full h-full flex justify-end">
        {/* Backdrop */}
        <div
          onClick={() => setIsDrawerOpen(false)}
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
            isDrawerOpen ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />

        {/* Slide-over panel */}
        <div
          className={`relative z-10 w-full sm:max-w-md h-full bg-[#0a0b10] border-l border-white/10 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
            isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <ShoppingBag className="w-5 h-5 text-azure-cyan" />
              <h2 className="text-lg font-semibold text-white tracking-wide">
                Review Your Bag ({itemCount})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="close-dialog p-2 -mr-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-azure-cyan"
              aria-label="Close preview bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items Container (#bag-items) */}
          <div id="bag-items" className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-zinc-400 space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-zinc-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="empty-bag text-base font-medium text-zinc-300">
                    Make room for something extraordinary. Explore the collection and save your
                    favorite concepts here.
                  </p>
                  <p className="text-xs text-zinc-500 mt-2 max-w-xs mx-auto">
                    Custom-engineered flagship handsets and titanium accessories ready for immediate
                    configuration.
                  </p>
                </div>
                <a
                  href="#collection"
                  onClick={() => setIsDrawerOpen(false)}
                  className="button light mt-4 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
                >
                  Explore the collection ↗
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center space-x-4 group"
                  >
                    <div className="w-16 h-16 rounded-xl bg-black/40 border border-white/5 p-2 flex items-center justify-center flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {item.finish} {item.storage ? `• ${item.storage}` : ''}
                      </p>
                      <p className="text-xs font-medium text-azure-cyan mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-zinc-500 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
                      aria-label={`Remove ${item.name} from bag`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={clearBag}
                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Clear entire bag
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary Container (#bag-summary) */}
          <div
            id="bag-summary"
            className={`p-6 border-t border-white/10 bg-black/40 space-y-4 ${
              items.length === 0 ? 'hidden' : ''
            }`}
          >
            {items.length > 0 && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Express Global Shipping</span>
                    <span className="text-emerald-400 font-medium">Free Included</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-zinc-200">
                    <span>Subtotal</span>
                    <span className="font-semibold text-white text-base">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    alert(
                      `Thank you for testing the preview checkout. Order subtotal: ${formatPrice(totalPrice)}. Express courier dispatch initiated.`,
                    );
                    setIsDrawerOpen(false);
                  }}
                  className="checkout-btn w-full py-3.5 rounded-full bg-azure-blue hover:bg-blue-600 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Simulated Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-zinc-500 text-center leading-normal">
                  Complimentary express shipping and 2-year hardware warranty included. This is a
                  concept showcase checkout.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
};
