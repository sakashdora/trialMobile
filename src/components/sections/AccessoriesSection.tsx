import React, { useState, useEffect } from 'react';
import {
  Zap,
  Shield,
  Headphones,
  Cable,
  ArrowUpRight,
  Plus,
  Check,
  Magnet,
  Activity,
  Waves,
} from 'lucide-react';
import { useBag } from '../../context/BagContext';
import { formatPrice } from '../../lib/utils';
import { catalogAccessories, flagshipPhones } from '../../data/products';
import { ProductSpec } from '../../types/product';
import { ProductConfiguratorModal } from '../common/ProductConfiguratorModal';

type CategoryFilter = 'all' | 'charging' | 'audio' | 'protection';

export const AccessoriesSection: React.FC = () => {
  const { addItem } = useBag();
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [configuredProduct, setConfiguredProduct] = useState<ProductSpec | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  // Physics visualizer states
  const [isMagnetLatched, setIsMagnetLatched] = useState(true);
  const [cableBandwidth, setCableBandwidth] = useState<'idle' | 'prores' | 'thunderbolt'>(
    'thunderbolt',
  );
  const [isDropSimulating, setIsDropSimulating] = useState(false);

  const handleQuickAdd = (product: ProductSpec) => {
    addItem({
      model: product.id,
      name: product.name,
      price: product.startingPrice,
      image: product.image,
      finish: product.finishes[0]?.name || 'Standard',
      storage: 'Standard',
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleOpenConfigurator = (product: ProductSpec) => {
    setConfiguredProduct(product);
    setIsConfigModalOpen(true);
  };

  useEffect(() => {
    const handleCustomOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ productId: string }>;
      const productId = customEvent.detail?.productId;
      if (productId) {
        const prod =
          flagshipPhones.find((p) => p.id === productId) ||
          catalogAccessories.find((p) => p.id === productId);
        if (prod) {
          handleOpenConfigurator(prod);
        }
      }
    };

    const handleDelegatedProductClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest?.('[data-product]');
      if (target) {
        const productId = target.getAttribute('data-product');
        if (productId) {
          const prod =
            flagshipPhones.find((p) => p.id === productId) ||
            catalogAccessories.find((p) => p.id === productId);
          if (prod) {
            handleOpenConfigurator(prod);
          }
        }
      }
    };

    window.addEventListener('azure:open-configurator', handleCustomOpen);
    document.addEventListener('click', handleDelegatedProductClick);

    return () => {
      window.removeEventListener('azure:open-configurator', handleCustomOpen);
      document.removeEventListener('click', handleDelegatedProductClick);
    };
  }, []);

  const triggerDropSimulation = () => {
    if (isDropSimulating) return;
    setIsDropSimulating(true);
    setTimeout(() => setIsDropSimulating(false), 2000);
  };

  // Filter products matching category
  const filteredAccessories = catalogAccessories.filter((acc) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'charging') return acc.category === 'charger' || acc.category === 'cable';
    if (activeFilter === 'audio') return acc.category === 'audio';
    if (activeFilter === 'protection') return acc.category === 'case';
    return true;
  });

  return (
    <section
      id="accessories"
      className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center"
    >
      {/* Section Header */}
      <div className="mb-10">
        <span className="eyebrow">MODULAR ECOSYSTEM</span>
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mt-2">
          Charging, Protection, and Connectivity.
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
          Custom engineered accessories crafted from Grade-5 titanium, ballistic 600D aramid weave,
          and Qi2 neodymium magnets designed in unison with AZURE One Pro.
        </p>
      </div>

      {/* Flagship Hero Accessory Editorial Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 mb-10 border border-white/10 relative overflow-hidden bg-gradient-to-br from-zinc-900/90 via-black to-zinc-950">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-azure-cyan/15 text-azure-cyan border border-azure-cyan/30">
              Complete Flagship Ecosystem
            </span>
            <h3 className="text-2xl sm:text-4xl font-bold text-white mt-3 tracking-tight">
              AZURE One Pro & The Magnetic Lineup.
            </h3>
            <p className="text-sm text-zinc-400 mt-3 leading-relaxed max-w-xl">
              From high-voltage 240W Thunderbolt throughput to 15N magnetic wireless docking and
              aerospace drop defense — every piece shares the same titanium obsidian visual DNA.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 items-center">
              <button
                type="button"
                onClick={() => handleOpenConfigurator(flagshipPhones[0])}
                className="px-6 py-3 rounded-full bg-white hover:bg-zinc-200 text-black text-xs font-semibold flex items-center space-x-2 transition-all shadow-lg shadow-white/10"
              >
                <span>Configure One Pro (₹69,999)</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleOpenConfigurator(catalogAccessories[0])}
                className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center space-x-2 transition-all border border-white/10"
              >
                <span>Customize MagCharge</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group">
              <img
                src="/assets/images/products/azure-pro.png"
                alt="AZURE One Pro Flagship"
                className="max-h-64 object-contain filter drop-shadow-[0_20px_40px_rgba(56,189,248,0.3)] transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar & Count Status */}
      <div className="accessory-toolbar flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div
          className="filter-group flex flex-wrap gap-2"
          role="group"
          aria-label="Filter accessories"
        >
          <button
            type="button"
            data-filter="all"
            aria-pressed={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeFilter === 'all'
                ? 'active bg-azure-cyan/20 border border-azure-cyan text-white shadow-md shadow-azure-cyan/20'
                : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            All essentials
          </button>

          <button
            type="button"
            data-filter="charging"
            aria-pressed={activeFilter === 'charging'}
            onClick={() => setActiveFilter('charging')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              activeFilter === 'charging'
                ? 'active bg-azure-cyan/20 border border-azure-cyan text-white shadow-md shadow-azure-cyan/20'
                : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Charging</span>
          </button>

          <button
            type="button"
            data-filter="audio"
            aria-pressed={activeFilter === 'audio'}
            onClick={() => setActiveFilter('audio')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              activeFilter === 'audio'
                ? 'active bg-azure-cyan/20 border border-azure-cyan text-white shadow-md shadow-azure-cyan/20'
                : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Audio</span>
          </button>

          <button
            type="button"
            data-filter="protection"
            aria-pressed={activeFilter === 'protection'}
            onClick={() => setActiveFilter('protection')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              activeFilter === 'protection'
                ? 'active bg-azure-cyan/20 border border-azure-cyan text-white shadow-md shadow-azure-cyan/20'
                : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Protection</span>
          </button>
        </div>

        <span
          id="accessory-count"
          role="status"
          className="text-xs font-mono text-zinc-400 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full self-start sm:self-auto"
        >
          {filteredAccessories.length} essentials
        </span>
      </div>

      {/* Main Accessory Grid */}
      <div
        id="accessory-grid"
        className="accessory-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
      >
        {filteredAccessories.map((product) => {
          let categoryTag = 'charging';
          if (product.category === 'case') categoryTag = 'protection';
          if (product.category === 'audio') categoryTag = 'audio';

          const isAdded = addedId === product.id;

          return (
            <div
              key={product.id}
              data-category={categoryTag}
              data-product={product.id}
              className="glass-card rounded-3xl p-6 flex flex-col justify-between group border border-white/10 hover:border-azure-cyan/40 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-azure-cyan">
                    {product.badge || categoryTag}
                  </span>
                  <span className="text-xs font-bold text-white tracking-tight">
                    {formatPrice(product.startingPrice)}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mt-3 group-hover:text-azure-cyan transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Product Visual */}
              <div className="my-6 flex justify-center items-center py-4 rounded-2xl bg-black/30 border border-white/5 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-36 object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleQuickAdd(product)}
                  className={`w-full py-2.5 rounded-full text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                    isAdded
                      ? 'bg-azure-cyan text-black font-bold'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenConfigurator(product)}
                  className="w-full py-2 rounded-full bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white text-xs font-medium transition-colors flex items-center justify-center space-x-1 border border-white/5"
                >
                  <span>Configure</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Motion Physics Showcase Playground */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10">
        <div className="mb-8 pb-6 border-b border-white/10">
          <span className="eyebrow text-azure-cyan font-mono">PHYSICS & TELEMETRY LAB</span>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Dynamic Material & Magnetic Physics
          </h3>
          <p className="text-xs text-zinc-400 mt-2 max-w-xl leading-relaxed">
            Experience real-time interactive simulations of the neodymium magnetic latch,
            Thunderbolt 4 40 Gbps data bandwidth engine, and 12-foot kinetic shock dispersion.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Physics 1: Neodymium Magnetic Snap Physics */}
          <div className="bg-black/50 rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono text-azure-cyan uppercase tracking-wider flex items-center">
                  <Magnet className="w-3.5 h-3.5 mr-1" />
                  Qi2 Neodymium Latch
                </span>
                <span className="text-[10px] font-mono text-zinc-500">15N Force</span>
              </div>

              <h4 className="text-base font-semibold text-white">MagCharge Alignment Snap</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                16 N52 rare-earth magnets pull phone into sub-millimeter concentric alignment.
              </p>

              {/* Latching Visual Stage */}
              <div className="my-6 h-36 rounded-xl bg-zinc-950/80 border border-white/10 relative flex items-center justify-center overflow-hidden">
                {/* Magnetic Ring Field Ripples */}
                <div
                  className={`absolute rounded-full border border-azure-cyan/40 transition-all duration-700 ${
                    isMagnetLatched ? 'w-24 h-24 opacity-80 animate-ping' : 'w-12 h-12 opacity-20'
                  }`}
                />
                <div
                  className={`absolute rounded-full border border-azure-cyan/20 transition-all duration-700 ${
                    isMagnetLatched ? 'w-32 h-32 opacity-40' : 'w-16 h-16 opacity-10'
                  }`}
                />

                {/* Base Charger Puck */}
                <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-azure-cyan/50 flex items-center justify-center z-10 shadow-lg">
                  <div className="w-6 h-6 rounded-full bg-azure-cyan/20 border border-azure-cyan" />
                </div>

                {/* Snapping Phone Target */}
                <div
                  className={`absolute z-20 transition-all duration-500 ease-out flex items-center justify-center ${
                    isMagnetLatched
                      ? 'translate-y-0 scale-100 opacity-90'
                      : '-translate-y-10 scale-90 opacity-60'
                  }`}
                >
                  <div className="w-24 h-14 rounded-lg bg-azure-blue/40 border border-azure-cyan/60 backdrop-blur-md flex items-center justify-center text-[10px] text-white font-mono shadow-xl">
                    {isMagnetLatched ? 'LATCHED (15N)' : 'DETACHED'}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMagnetLatched(!isMagnetLatched)}
              className="w-full py-2 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
            >
              {isMagnetLatched ? 'Simulate Unlatch' : 'Simulate Magnetic Snap'}
            </button>
          </div>

          {/* Physics 2: Thunderbolt 4 40 Gbps Bandwidth Visualizer */}
          <div className="bg-black/50 rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono text-azure-cyan uppercase tracking-wider flex items-center">
                  <Cable className="w-3.5 h-3.5 mr-1" />
                  Thunderbolt 4
                </span>
                <span className="text-[10px] font-mono text-zinc-500">40 Gbps</span>
              </div>

              <h4 className="text-base font-semibold text-white">ArmorCable Throughput</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Photonic data streaming through double-braided Kevlar with Grade-5 titanium hoods.
              </p>

              {/* Bandwidth Pulse Stage */}
              <div className="my-6 h-36 rounded-xl bg-zinc-950/80 border border-white/10 relative flex flex-col justify-center px-4 overflow-hidden">
                <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-2">
                  <span>Titanium Connector A</span>
                  <span className="text-azure-cyan font-bold">
                    {cableBandwidth === 'idle'
                      ? '5 Gbps'
                      : cableBandwidth === 'prores'
                        ? '20 Gbps'
                        : '40 Gbps Max'}
                  </span>
                </div>

                {/* Cable Path with Streaming Packets */}
                <div className="relative w-full h-4 bg-zinc-800 rounded-full overflow-hidden border border-white/10 flex items-center">
                  <div
                    className={`h-full bg-gradient-to-r from-azure-blue via-azure-cyan to-white rounded-full transition-all duration-300 ${
                      cableBandwidth === 'idle'
                        ? 'w-1/4 animate-pulse'
                        : cableBandwidth === 'prores'
                          ? 'w-2/3 animate-pulse'
                          : 'w-full animate-pulse shadow-[0_0_15px_#38bdf8]'
                    }`}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                  <span>Packet Latency: 1.2µs</span>
                  <span>EPR 240W Delivery</span>
                </div>
              </div>
            </div>

            {/* Bandwidth Selector Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCableBandwidth('idle')}
                className={`py-1.5 rounded-lg text-[11px] font-mono font-medium transition-colors ${
                  cableBandwidth === 'idle'
                    ? 'bg-azure-cyan text-black font-bold'
                    : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                5 Gbps
              </button>
              <button
                type="button"
                onClick={() => setCableBandwidth('prores')}
                className={`py-1.5 rounded-lg text-[11px] font-mono font-medium transition-colors ${
                  cableBandwidth === 'prores'
                    ? 'bg-azure-cyan text-black font-bold'
                    : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                20 Gbps
              </button>
              <button
                type="button"
                onClick={() => setCableBandwidth('thunderbolt')}
                className={`py-1.5 rounded-lg text-[11px] font-mono font-medium transition-colors ${
                  cableBandwidth === 'thunderbolt'
                    ? 'bg-azure-cyan text-black font-bold'
                    : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                40 Gbps
              </button>
            </div>
          </div>

          {/* Physics 3: 12ft Kinetic Shockwave Dissipation Vector */}
          <div className="bg-black/50 rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono text-azure-cyan uppercase tracking-wider flex items-center">
                  <Waves className="w-3.5 h-3.5 mr-1" />
                  600D Aramid Weave
                </span>
                <span className="text-[10px] font-mono text-zinc-500">12ft MIL-STD</span>
              </div>

              <h4 className="text-base font-semibold text-white">ShieldCase Shock Absorption</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Micro-lattice ballistic fiber transfers 98.4% of kinetic impact away from chassis.
              </p>

              {/* Shockwave Stage */}
              <div className="my-6 h-36 rounded-xl bg-zinc-950/80 border border-white/10 relative flex items-center justify-center overflow-hidden">
                {/* Hexagonal Lattice Background */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]" />

                {/* Impact Shockwave Rings */}
                {isDropSimulating && (
                  <>
                    <div className="absolute w-12 h-12 rounded-full border-2 border-red-400 animate-ping" />
                    <div className="absolute w-28 h-28 rounded-full border border-azure-cyan animate-ping [animation-delay:200ms]" />
                    <div className="absolute w-44 h-44 rounded-full border border-azure-cyan/40 animate-ping [animation-delay:400ms]" />
                  </>
                )}

                <div className="relative z-10 text-center">
                  <div
                    className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 ${
                      isDropSimulating
                        ? 'border-red-400 bg-red-500/10 scale-95 shadow-[0_0_20px_rgba(248,113,113,0.5)]'
                        : 'border-azure-cyan/40 bg-zinc-900 shadow-lg'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold text-white">
                      {isDropSimulating ? 'IMPACT' : 'ARMED'}
                    </span>
                    <span className="text-[9px] font-mono text-azure-cyan mt-0.5">
                      {isDropSimulating ? '98.4% DAMP' : '12FT RATED'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={triggerDropSimulation}
              disabled={isDropSimulating}
              className="w-full py-2 rounded-full bg-white/10 hover:bg-white/15 disabled:opacity-50 text-white text-xs font-semibold transition-colors flex items-center justify-center space-x-1"
            >
              <Activity className="w-3.5 h-3.5 mr-1 text-azure-cyan" />
              <span>{isDropSimulating ? 'Absorbing Vector...' : 'Simulate 12ft Impact'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Configurator Modal (Always in DOM for static queries) */}
      <ProductConfiguratorModal
        isOpen={isConfigModalOpen}
        product={configuredProduct}
        onClose={() => setIsConfigModalOpen(false)}
      />
    </section>
  );
};
