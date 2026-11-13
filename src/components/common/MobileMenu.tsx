import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, ChevronRight } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBag: () => void;
  itemCount: number;
}

const navLinks = [
  { label: 'Overview', href: '#home' },
  { label: 'Handset Lineup', href: '#collection' },
  { label: '360° Hardware Studio', href: '#design' },
  { label: 'ProVision Camera', href: '#camera' },
  { label: 'A19 Ultra Silicon', href: '#performance' },
  { label: 'Accessories', href: '#accessories' },
  { label: 'Compare Models', href: '#compare' },
  { label: 'Care & Support', href: '#support' },
];

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  onOpenBag,
  itemCount,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 top-[60px] z-40 bg-[#050507]/95 backdrop-blur-2xl border-t border-white/10 flex flex-col justify-between px-6 py-8 overflow-y-auto lg:hidden"
        >
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs uppercase tracking-eyebrow text-azure-cyan font-semibold">
                Store Navigation
              </span>
              <button
                type="button"
                onClick={onClose}
                className="p-2 -mr-2 text-zinc-400 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center justify-between py-2.5 text-lg font-medium text-zinc-300 hover:text-white transition-colors group"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-azure-cyan group-hover:translate-x-1 transition-all" />
                </a>
              ))}
            </nav>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col space-y-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenBag();
              }}
              className="flex items-center justify-center space-x-3 w-full py-3.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-azure-cyan" />
              <span>Preview Bag ({itemCount})</span>
            </button>

            <a
              href="#order"
              onClick={onClose}
              className="flex items-center justify-center w-full py-3.5 rounded-full bg-azure-blue hover:bg-blue-600 text-white font-semibold transition-all shadow-lg shadow-blue-500/20"
            >
              Order One Pro
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
