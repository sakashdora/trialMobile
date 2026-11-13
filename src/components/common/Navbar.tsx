import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useBag } from '../../context/BagContext';
import { MobileMenu } from './MobileMenu';

export const Navbar: React.FC = () => {
  const { itemCount, setIsDrawerOpen } = useBag();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav shadow-2xl shadow-black/60 py-3'
            : 'bg-black/40 backdrop-blur-md border-b border-white/5 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#home"
            className="flex items-center space-x-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-azure-cyan rounded-md"
            aria-label="AZURE Mobile Home"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-azure-cyan via-azure-blue to-blue-600 p-[1px] flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-black rounded-[7px] flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-azure-cyan"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2L2 22h4l6-12 6 12h4L12 2z" />
                </svg>
              </div>
            </div>
            <span className="font-semibold text-lg tracking-wider text-white">AZURE</span>
          </a>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden lg:flex items-center space-x-7 text-sm font-medium text-zinc-300"
            aria-label="Main Navigation"
          >
            <a
              href="#collection"
              className="hover:text-white transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-azure-cyan after:absolute after:bottom-0 after:left-0 after:transition-all"
            >
              Handsets
            </a>
            <a
              href="#design"
              className="hover:text-white transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-azure-cyan after:absolute after:bottom-0 after:left-0 after:transition-all"
            >
              360° Studio
            </a>
            <a
              href="#camera"
              className="hover:text-white transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-azure-cyan after:absolute after:bottom-0 after:left-0 after:transition-all"
            >
              Camera
            </a>
            <a
              href="#performance"
              className="hover:text-white transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-azure-cyan after:absolute after:bottom-0 after:left-0 after:transition-all"
            >
              A19 Silicon
            </a>
            <a
              href="#accessories"
              className="hover:text-white transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-azure-cyan after:absolute after:bottom-0 after:left-0 after:transition-all"
            >
              Accessories
            </a>
            <a
              href="#compare"
              className="hover:text-white transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-azure-cyan after:absolute after:bottom-0 after:left-0 after:transition-all"
            >
              Compare
            </a>
            <a
              href="#support"
              className="hover:text-white transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-azure-cyan after:absolute after:bottom-0 after:left-0 after:transition-all"
            >
              Support
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Shopping Bag Trigger */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="bag-button relative p-2 text-zinc-300 hover:text-white transition-colors rounded-full hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-azure-cyan"
              aria-label={`Open preview bag, ${itemCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span
                id="bag-count"
                className={`absolute top-1 right-1 w-4 h-4 rounded-full bg-azure-cyan text-black text-[10px] font-bold flex items-center justify-center ${
                  itemCount > 0 ? 'animate-pulse' : 'hidden'
                }`}
              >
                {itemCount}
              </span>
            </button>

            {/* Shimmer Order CTA */}
            <a
              href="#order"
              className="hidden sm:inline-flex items-center justify-center px-4 py-1.5 text-xs font-semibold rounded-full btn-shimmer text-white shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-azure-blue"
            >
              Order One Pro
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-zinc-300 hover:text-white lg:hidden rounded-lg hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-azure-cyan"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-azure-cyan" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenBag={() => setIsDrawerOpen(true)}
        itemCount={itemCount}
      />
    </>
  );
};
