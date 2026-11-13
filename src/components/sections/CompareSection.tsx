import React, { useState } from 'react';
import {
  comparisonDevices,
  comparisonSpecRows,
  PhoneId,
  resolveCollision,
} from '../../data/comparison';

export const CompareSection: React.FC = () => {
  const [leftId, setLeftId] = useState<PhoneId>('pro');
  const [rightId, setRightId] = useState<PhoneId>('air');

  const handleLeftChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLeft = e.target.value as PhoneId;
    if (newLeft === rightId) {
      const newRight = resolveCollision(newLeft, rightId);
      setRightId(newRight);
    }
    setLeftId(newLeft);
  };

  const handleRightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRight = e.target.value as PhoneId;
    if (newRight === leftId) {
      const newLeft = resolveCollision(newRight, leftId);
      setLeftId(newLeft);
    }
    setRightId(newRight);
  };

  const handleConfigure = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('azure:open-configurator', {
          detail: { productId },
        }),
      );
    }
  };

  const leftDevice = comparisonDevices[leftId];
  const rightDevice = comparisonDevices[rightId];

  return (
    <section
      id="compare"
      className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center"
      aria-label="Handset Comparison Matrix"
    >
      {/* Section Head */}
      <div className="mb-10 section-head">
        <span className="eyebrow">TECHNICAL MATRIX</span>
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mt-2">
          Compare Handsets and Architecture.
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-xl">
          Side-by-side technical evaluation across display, silicon, optics, and battery benchmarks.
        </p>
      </div>

      {/* Visual Previews (#compare-visuals) */}
      <div id="compare-visuals" className="compare-visuals grid grid-cols-2 gap-4 sm:gap-8 mb-8">
        <div className="compare-visual-card glass-card rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="w-full max-w-[200px] sm:max-w-[240px] h-48 sm:h-64 flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-105">
            <img
              id="compare-img-left"
              src={leftDevice.image}
              alt={leftDevice.name}
              className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_35px_rgba(56,189,248,0.2)]"
            />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-azure-cyan uppercase bg-azure-cyan/10 px-2.5 py-0.5 rounded-full border border-azure-cyan/20 mb-1">
            {leftDevice.badge}
          </span>
          <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
            {leftDevice.name}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs">{leftDevice.tagline}</p>
        </div>

        <div className="compare-visual-card glass-card rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="w-full max-w-[200px] sm:max-w-[240px] h-48 sm:h-64 flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-105">
            <img
              id="compare-img-right"
              src={rightDevice.image}
              alt={rightDevice.name}
              className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_35px_rgba(56,189,248,0.2)]"
            />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-azure-cyan uppercase bg-azure-cyan/10 px-2.5 py-0.5 rounded-full border border-azure-cyan/20 mb-1">
            {rightDevice.badge}
          </span>
          <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
            {rightDevice.name}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs">{rightDevice.tagline}</p>
        </div>
      </div>

      {/* Synchronized Selectors (#compare-pickers) */}
      <div
        id="compare-pickers"
        className="compare-pickers grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
      >
        <div className="space-y-1.5">
          <label
            htmlFor="compare-left"
            className="block text-xs font-medium uppercase tracking-wider text-zinc-400"
          >
            First phone
          </label>
          <select
            id="compare-left"
            value={leftId}
            onChange={handleLeftChange}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-azure-cyan focus:border-transparent transition-all cursor-pointer"
          >
            <option value="pro" className="bg-zinc-900 text-white">
              AZURE One Pro
            </option>
            <option value="air" className="bg-zinc-900 text-white">
              AZURE One Air
            </option>
            <option value="one" className="bg-zinc-900 text-white">
              AZURE One
            </option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="compare-right"
            className="block text-xs font-medium uppercase tracking-wider text-zinc-400"
          >
            Second phone
          </label>
          <select
            id="compare-right"
            value={rightId}
            onChange={handleRightChange}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-azure-cyan focus:border-transparent transition-all cursor-pointer"
          >
            <option value="air" className="bg-zinc-900 text-white">
              AZURE One Air
            </option>
            <option value="pro" className="bg-zinc-900 text-white">
              AZURE One Pro
            </option>
            <option value="one" className="bg-zinc-900 text-white">
              AZURE One
            </option>
          </select>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="comparison-table glass-card rounded-3xl p-6 sm:p-8 overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-300 min-w-[600px]">
          <caption className="sr-only">
            Technical specifications for the AZURE handset lineup
          </caption>
          <thead id="compare-head">
            <tr className="border-b border-white/10 text-white">
              <th scope="col" className="py-4 font-semibold text-zinc-400 w-1/3">
                SPECIFICATIONS
              </th>
              <th scope="col" className="py-4 font-semibold text-azure-cyan w-1/3">
                <div className="compare-phone-title text-base">{leftDevice.name}</div>
              </th>
              <th scope="col" className="py-4 font-semibold text-azure-cyan w-1/3">
                <div className="compare-phone-title text-base">{rightDevice.name}</div>
              </th>
            </tr>
          </thead>
          <tbody id="compare-body" className="divide-y divide-white/5">
            {comparisonSpecRows.map((row) => (
              <tr key={row.label} className="hover:bg-white/[0.02] transition-colors">
                <th scope="row" className="py-4 text-zinc-400 font-medium">
                  {row.label}
                </th>
                <td
                  className={`py-4 ${
                    row.label === 'Starting Price'
                      ? 'text-azure-cyan font-bold text-base'
                      : 'text-zinc-200'
                  }`}
                >
                  {row.getValue(leftDevice)}
                </td>
                <td
                  className={`py-4 ${
                    row.label === 'Starting Price'
                      ? 'text-azure-cyan font-bold text-base'
                      : 'text-zinc-200'
                  }`}
                >
                  {row.getValue(rightDevice)}
                </td>
              </tr>
            ))}
            {/* Action Row: Configure CTA Buttons */}
            <tr className="hover:bg-white/[0.02] transition-colors border-t border-white/10">
              <th scope="row" className="py-5 text-white font-medium">
                Make it yours
              </th>
              <td className="py-5">
                <button
                  type="button"
                  className="button light btn px-5 py-2.5 rounded-full bg-azure-cyan/15 hover:bg-azure-cyan/25 text-azure-cyan border border-azure-cyan/30 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] inline-flex items-center space-x-1.5"
                  data-product={leftDevice.id}
                  onClick={(e) => handleConfigure(e, leftDevice.id)}
                >
                  <span>Configure {leftDevice.shortName} ↗</span>
                </button>
              </td>
              <td className="py-5">
                <button
                  type="button"
                  className="button light btn px-5 py-2.5 rounded-full bg-azure-cyan/15 hover:bg-azure-cyan/25 text-azure-cyan border border-azure-cyan/30 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] inline-flex items-center space-x-1.5"
                  data-product={rightDevice.id}
                  onClick={(e) => handleConfigure(e, rightDevice.id)}
                >
                  <span>Configure {rightDevice.shortName} ↗</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};
