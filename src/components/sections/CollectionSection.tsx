import React, { useState } from 'react';
import { useBag } from '../../context/BagContext';
import { flagshipPhones } from '../../data/products';
import { Check, ArrowUpRight, Plus } from 'lucide-react';
import { formatPrice } from '../../lib/utils';

export const CollectionSection: React.FC = () => {
  const { addItem } = useBag();

  // State to track selected finish index per phone model
  const [selectedFinishes, setSelectedFinishes] = useState<Record<string, number>>({
    pro: 0,
    air: 0,
    one: 0,
  });

  const handleSelectFinish = (phoneId: string, finishIndex: number) => {
    setSelectedFinishes((prev) => ({
      ...prev,
      [phoneId]: finishIndex,
    }));
  };

  const handleAddPhoneToBag = (phoneId: string) => {
    const phone = flagshipPhones.find((p) => p.id === phoneId);
    if (!phone) return;

    const finishIndex = selectedFinishes[phoneId] ?? 0;
    const selectedFinish = phone.finishes[finishIndex] || phone.finishes[0];

    addItem({
      model: phone.id,
      name: phone.name,
      price: phone.startingPrice,
      image: selectedFinish.image || phone.image,
      finish: selectedFinish.name,
      storage: phone.storageOptions?.[0]?.size || '256 GB',
    });
  };

  const proPhone = flagshipPhones.find((p) => p.id === 'pro')!;
  const airPhone = flagshipPhones.find((p) => p.id === 'air')!;
  const onePhone = flagshipPhones.find((p) => p.id === 'one')!;

  return (
    <section
      id="collection"
      className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center"
    >
      {/* Section Header */}
      <div className="mb-12 max-w-3xl">
        <span className="eyebrow">THE SMARTPHONE COLLECTION</span>
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mt-2">
          Three Distinct Personalities.
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl font-normal leading-relaxed">
          Engineered with Grade-5 aerospace titanium, edge-to-edge ProMotion displays, and unified
          USB-C architecture. Select your finish and configure your device.
        </p>
      </div>

      {/* Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* BENTO CARD 1: AZURE One Pro (Full 7-col hero bento card) */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-10 flex flex-col justify-between relative group hover:-translate-y-0.5 transition-all duration-300 border border-white/10 hover:border-azure-cyan/30">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-azure-blue/20 text-azure-cyan border border-azure-blue/40">
                {proPhone.badge}
              </span>
              <span className="text-sm font-semibold text-azure-cyan">
                From {formatPrice(proPhone.startingPrice)}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-semibold text-white mt-4 tracking-tight">
              {proPhone.name}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">{proPhone.tagline}</p>
            <p className="text-xs sm:text-sm text-zinc-300 mt-3 leading-relaxed max-w-xl">
              {proPhone.description}
            </p>
          </div>

          {/* Large Hero Visual */}
          <div className="my-8 flex flex-col items-center justify-center relative min-h-[260px] sm:min-h-[300px]">
            <div className="absolute w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-azure-cyan/10 blur-[80px] pointer-events-none" />
            <img
              src={proPhone.finishes[selectedFinishes['pro'] ?? 0]?.image || proPhone.image}
              alt={`${proPhone.name} in ${proPhone.finishes[selectedFinishes['pro'] ?? 0]?.name}`}
              className="h-60 sm:h-72 object-contain group-hover:scale-[1.03] transition-transform duration-500 filter drop-shadow-[0_20px_30px_rgba(56,189,248,0.25)]"
            />
            {/* Active Finish Label */}
            <span className="text-xs text-zinc-400 mt-3 tracking-wide">
              Finish:{' '}
              <span className="text-white font-medium">
                {proPhone.finishes[selectedFinishes['pro'] ?? 0]?.name}
              </span>
            </span>
          </div>

          {/* Interactive Finish Swatches & Quick Specs & Bag CTA */}
          <div className="pt-4 border-t border-white/10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Finish swatches */}
              <div className="flex items-center space-x-2">
                {proPhone.finishes.map((finish, idx) => {
                  const isSelected = (selectedFinishes['pro'] ?? 0) === idx;
                  return (
                    <button
                      key={finish.name}
                      type="button"
                      aria-label={`Select ${finish.name}`}
                      onClick={() => handleSelectFinish('pro', idx)}
                      style={{ backgroundColor: finish.colorHex }}
                      className={`w-6 h-6 rounded-full transition-all relative flex items-center justify-center ${
                        isSelected
                          ? 'ring-2 ring-azure-cyan ring-offset-2 ring-offset-black scale-110'
                          : 'opacity-80 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-black stroke-[3]" />}
                    </button>
                  );
                })}
              </div>

              {/* Quick specs pill */}
              <div className="text-[11px] text-zinc-400 bg-white/[0.04] px-3 py-1 rounded-full border border-white/5">
                6.7″ OLED 120Hz • A19 Ultra • 48MP 5x
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => handleAddPhoneToBag('pro')}
                className="flex-1 py-3 rounded-full btn-shimmer text-white text-xs font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-azure-cyan/20 hover:-translate-y-0.5 active:translate-y-0 transition-transform"
              >
                <Plus className="w-4 h-4 text-azure-cyan" />
                <span>Add One Pro to Bag</span>
              </button>

              <a
                href="#design"
                className="px-5 py-3 rounded-full btn-secondary text-xs font-medium text-white flex items-center space-x-1.5 hover:-translate-y-0.5 active:translate-y-0 transition-transform"
              >
                <span>360° Studio</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 cols): Bento Stack for One Air & One */}
        <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
          {/* BENTO CARD 2: AZURE One Air */}
          <div className="glass-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between flex-1 relative group hover:-translate-y-0.5 transition-all duration-300 border border-white/10 hover:border-zinc-500/40">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-zinc-500/20 text-zinc-300 border border-zinc-500/30">
                  {airPhone.badge}
                </span>
                <span className="text-sm font-semibold text-white">
                  From {formatPrice(airPhone.startingPrice)}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mt-2 tracking-tight">
                {airPhone.name}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Slim 6.9mm profile • 6.5″ OLED • Pearl Silver
              </p>
            </div>

            <div className="my-5 flex items-center justify-center relative">
              <img
                src={airPhone.finishes[selectedFinishes['air'] ?? 0]?.image || airPhone.image}
                alt={`${airPhone.name} in ${airPhone.finishes[selectedFinishes['air'] ?? 0]?.name}`}
                className="h-44 rounded-2xl object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="pt-3 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {airPhone.finishes.map((finish, idx) => {
                    const isSelected = (selectedFinishes['air'] ?? 0) === idx;
                    return (
                      <button
                        key={finish.name}
                        type="button"
                        aria-label={`Select ${finish.name}`}
                        onClick={() => handleSelectFinish('air', idx)}
                        style={{ backgroundColor: finish.colorHex }}
                        className={`w-5 h-5 rounded-full transition-all relative flex items-center justify-center ${
                          isSelected
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110'
                            : 'opacity-80 hover:opacity-100'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
                <span className="text-[11px] text-zinc-400 font-medium">
                  {airPhone.finishes[selectedFinishes['air'] ?? 0]?.name}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleAddPhoneToBag('air')}
                className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add One Air to Bag</span>
              </button>
            </div>
          </div>

          {/* BENTO CARD 3: AZURE One */}
          <div className="glass-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between flex-1 relative group hover:-translate-y-0.5 transition-all duration-300 border border-white/10 hover:border-emerald-500/40">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {onePhone.badge}
                </span>
                <span className="text-sm font-semibold text-white">
                  From {formatPrice(onePhone.startingPrice)}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mt-2 tracking-tight">
                {onePhone.name}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Compact 6.1″ OLED • Dual Camera Visor • Sage
              </p>
            </div>

            <div className="my-5 flex items-center justify-center relative">
              <img
                src={onePhone.finishes[selectedFinishes['one'] ?? 0]?.image || onePhone.image}
                alt={`${onePhone.name} in ${onePhone.finishes[selectedFinishes['one'] ?? 0]?.name}`}
                className="h-44 rounded-2xl object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="pt-3 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {onePhone.finishes.map((finish, idx) => {
                    const isSelected = (selectedFinishes['one'] ?? 0) === idx;
                    return (
                      <button
                        key={finish.name}
                        type="button"
                        aria-label={`Select ${finish.name}`}
                        onClick={() => handleSelectFinish('one', idx)}
                        style={{ backgroundColor: finish.colorHex }}
                        className={`w-5 h-5 rounded-full transition-all relative flex items-center justify-center ${
                          isSelected
                            ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-black scale-110'
                            : 'opacity-80 hover:opacity-100'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
                <span className="text-[11px] text-zinc-400 font-medium">
                  {onePhone.finishes[selectedFinishes['one'] ?? 0]?.name}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleAddPhoneToBag('one')}
                className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add One to Bag</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionSection;
