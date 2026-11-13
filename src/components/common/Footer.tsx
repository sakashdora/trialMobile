import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050507] text-zinc-400 text-xs border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Disclaimers & Technical Footnotes */}
        <div className="pb-8 border-b border-white/5 space-y-3 leading-relaxed text-zinc-500 text-[11px]">
          <p>
            1. Display dimensions are measured diagonally as a standard rectangle. Actual viewable
            area is slightly less due to rounded corners. Peak outdoor brightness of 3,000 nits is
            achieved in high ambient light mode with ProMotion enabled.
          </p>
          <p>
            2. TSMC 3nm N3P process transistor count and 39 TOPS inference compute metrics represent
            architectural engineering benchmarks. Thermal vapor chamber efficiency varies with
            device operating workload.
          </p>
          <p>
            3. ArmorCable 240W supports USB Power Delivery 3.1 Extended Power Range (EPR) up to
            48V/5A and Thunderbolt 4 bandwidth up to 40 Gbps with compatible host and peripheral
            hardware.
          </p>
          <p>
            4. MagCharge 30W wireless inductive fast charging requires compatible Qi2 or MagSafe
            enabled devices and minimum 30W USB-C PD power adapter.
          </p>
          <p>
            5. Photography licensed via Unsplash by Priscilla Du Preez, Saad Chaudhry, and Jakob
            Rosen. All product specifications and visual concepts are concept showcases.
          </p>
        </div>

        {/* Directory Columns */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-xs font-semibold tracking-wider uppercase mb-4">
              Handset Lineup
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a href="#collection" className="hover:text-white transition-colors">
                  AZURE One Pro (Flagship)
                </a>
              </li>
              <li>
                <a href="#collection" className="hover:text-white transition-colors">
                  AZURE One Air (Ultralight)
                </a>
              </li>
              <li>
                <a href="#collection" className="hover:text-white transition-colors">
                  AZURE One (Essential)
                </a>
              </li>
              <li>
                <a href="#compare" className="hover:text-white transition-colors">
                  Compare Specifications
                </a>
              </li>
              <li>
                <a href="#design" className="hover:text-white transition-colors">
                  360° Hardware Studio
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-xs font-semibold tracking-wider uppercase mb-4">
              Ecosystem & Accessories
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a href="#accessories" className="hover:text-white transition-colors">
                  MagCharge 30W Cantilever
                </a>
              </li>
              <li>
                <a href="#accessories" className="hover:text-white transition-colors">
                  ArmorCable 240W Thunderbolt 4
                </a>
              </li>
              <li>
                <a href="#accessories" className="hover:text-white transition-colors">
                  ShieldCase 600D Aramid Fiber
                </a>
              </li>
              <li>
                <a href="#accessories" className="hover:text-white transition-colors">
                  AZURE Buds Acoustic
                </a>
              </li>
              <li>
                <a href="#accessories" className="hover:text-white transition-colors">
                  All Accessories
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-xs font-semibold tracking-wider uppercase mb-4">
              Engineering & Silicon
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a href="#performance" className="hover:text-white transition-colors">
                  A19 Ultra TSMC 3nm Silicon
                </a>
              </li>
              <li>
                <a href="#performance" className="hover:text-white transition-colors">
                  16-Core Neural Engine (39 TOPS)
                </a>
              </li>
              <li>
                <a href="#camera" className="hover:text-white transition-colors">
                  ProVision 48MP Tetraprism Optics
                </a>
              </li>
              <li>
                <a href="#design" className="hover:text-white transition-colors">
                  Grade-5 Aerospace Titanium
                </a>
              </li>
              <li>
                <a href="#performance" className="hover:text-white transition-colors">
                  Passive Vapor Chamber Matrix
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-xs font-semibold tracking-wider uppercase mb-4">
              Care & Support
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a href="#support" className="hover:text-white transition-colors">
                  2-Year Hardware Warranty
                </a>
              </li>
              <li>
                <a href="#support" className="hover:text-white transition-colors">
                  Express Global Courier Dispatch
                </a>
              </li>
              <li>
                <a href="#support" className="hover:text-white transition-colors">
                  24/7 Dedicated Concierge
                </a>
              </li>
              <li>
                <a href="#support" className="hover:text-white transition-colors">
                  Trade-In Program
                </a>
              </li>
              <li>
                <a href="#support" className="hover:text-white transition-colors">
                  Order Status & Tracking
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-zinc-500">
          <div className="flex items-center space-x-2">
            <span className="text-white font-medium">Λ AZURE</span>
            <span>• Copyright © 2026 AZURE Technology Inc. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-zinc-400">
            <a href="#privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-white transition-colors">
              Terms of Sale
            </a>
            <a href="#legal" className="hover:text-white transition-colors">
              Legal Notices
            </a>
            <a href="#sitemap" className="hover:text-white transition-colors">
              Site Map
            </a>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-300">Worldwide (English)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
