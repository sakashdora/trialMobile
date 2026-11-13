import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Zap,
  Sparkles,
  ChevronDown,
  ArrowUpRight,
  Activity,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { CONCIERGE_CARDS, FAQ_ITEMS, DIAGNOSTIC_TELEMETRY_ITEMS } from '../../data/support';

export const SupportSection: React.FC = () => {
  const [openFaqId, setOpenFaqId] = useState<string | null>('warranty-terms');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [clientCapabilities, setClientCapabilities] = useState<{
    gamut: string;
    refresh: string;
  }>({
    gamut: 'Display-P3 Wide Color',
    refresh: '120Hz ProMotion Calibrated',
  });

  const faqButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isP3 = window.matchMedia('(color-gamut: p3)').matches;
      setClientCapabilities({
        gamut: isP3 ? 'Display-P3 Wide Color' : 'sRGB Calibrated',
        refresh: '120Hz ProMotion Capable',
      });
    }
  }, []);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number, total: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (index + 1) % total;
      faqButtonsRef.current[next]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (index - 1 + total) % total;
      faqButtonsRef.current[prev]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      faqButtonsRef.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      faqButtonsRef.current[total - 1]?.focus();
    }
  };

  const handleRunDiagnostic = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 1200);
  };

  const filteredFaqs =
    activeCategory === 'all'
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section
      id="support"
      className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center"
      aria-label="AZURE Care Concierge and Support"
    >
      {/* 1. SECTION HEAD */}
      <div className="mb-12">
        <span className="eyebrow">AZURE CARE CONCIERGE</span>
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mt-2">
          Warranty, Dispatch, and Concierge Support.
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-xl">
          Uncompromising coverage designed to protect your investment worldwide with zero deductible
          repairs and dedicated hardware specialist access.
        </p>
      </div>

      {/* 2. 3 CONCIERGE SERVICE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {CONCIERGE_CARDS.map((card) => {
          const IconComponent =
            card.iconName === 'ShieldCheck'
              ? ShieldCheck
              : card.iconName === 'Zap'
                ? Zap
                : Sparkles;

          return (
            <div
              key={card.id}
              className="glass-card rounded-3xl p-8 flex flex-col justify-between group hover:border-azure-cyan/40 transition-all duration-300 relative overflow-hidden"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-azure-cyan group-hover:scale-105 group-hover:bg-azure-cyan/10 group-hover:border-azure-cyan/30 transition-all duration-300 shadow-lg shadow-cyan-500/10 mb-6">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-mono tracking-widest text-azure-cyan uppercase bg-azure-cyan/10 px-2.5 py-1 rounded-full border border-azure-cyan/20 w-fit mb-3">
                  {card.eyebrow}
                </div>
                <h3 className="text-xl font-semibold text-white tracking-tight">{card.title}</h3>
                <p className="text-sm text-zinc-400 mt-2.5 leading-relaxed">{card.description}</p>
              </div>

              <div>
                <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 gap-3 text-xs">
                  {card.metrics.map((m, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <span className="text-zinc-500 text-[11px] block">{m.label}</span>
                      <span className="text-zinc-200 font-mono font-medium">{m.value}</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => toggleFaq('warranty-terms')}
                  className="mt-6 inline-flex items-center text-xs font-semibold text-azure-cyan hover:text-white transition-colors group/link"
                >
                  <span>{card.actionLabel}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. DEALT MOMENT: HARDWARE TELEMETRY & DIAGNOSTICS CARD */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 mb-16 border border-white/10 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2 text-azure-cyan text-xs font-mono uppercase tracking-wider mb-1">
              <Activity className="w-4 h-4 animate-pulse" />
              <span>AZURE Hardware Diagnostic Lab</span>
            </div>
            <h3 className="text-xl font-semibold text-white tracking-tight">
              Instant Over-The-Air Hardware Verification
            </h3>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              Execute a real-time cryptographic diagnostic handshake to verify display calibration,
              thermal dissipation status, and active warranty entitlement.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRunDiagnostic}
            disabled={isScanning}
            className="px-6 py-3 rounded-full bg-azure-cyan/15 hover:bg-azure-cyan/25 border border-azure-cyan/30 text-azure-cyan hover:text-white text-xs font-semibold transition-all flex items-center justify-center space-x-2 disabled:opacity-50 flex-shrink-0"
          >
            {isScanning ? (
              <>
                <Activity className="w-4 h-4 animate-spin text-azure-cyan" />
                <span>Running Diagnostic Handshake...</span>
              </>
            ) : scanComplete ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Re-run Hardware Diagnostic</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Run Hardware Diagnostic Handshake</span>
              </>
            )}
          </button>
        </div>

        {/* Telemetry Readouts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          {DIAGNOSTIC_TELEMETRY_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all duration-300 ${
                isScanning
                  ? 'bg-azure-cyan/5 border-azure-cyan/30 animate-pulse'
                  : scanComplete
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : 'bg-white/[0.02] border-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-zinc-400 truncate">
                  {item.component}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    scanComplete
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-azure-cyan/10 text-azure-cyan border border-azure-cyan/20'
                  }`}
                >
                  {scanComplete ? 'OPTIMAL' : item.status}
                </span>
              </div>
              <div className="text-sm font-mono font-semibold text-white">
                {idx === 0 ? clientCapabilities.gamut : item.metric}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1 leading-snug">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. ACCORDION FAQ SECTION */}
      <div className="mt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="eyebrow">COMMON INQUIRIES</span>
            <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mt-1">
              Frequently Asked Questions.
            </h3>
            <p className="text-sm text-zinc-400 mt-1 max-w-lg">
              Detailed specifications on warranty terms, international courier transit, return
              protocols, and cellular network compatibility.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Topics' },
              { id: 'warranty', label: 'Warranty' },
              { id: 'dispatch', label: 'Dispatch' },
              { id: 'returns', label: 'Returns' },
              { id: 'diagnostics', label: 'Diagnostics' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-azure-cyan text-black font-semibold shadow-md shadow-cyan-500/20'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* WAI-ARIA Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openFaqId === faq.id;

            return (
              <div
                key={faq.id}
                className="glass-card rounded-2xl border border-white/10 overflow-hidden transition-colors hover:border-white/20"
              >
                <button
                  type="button"
                  id={`faq-trigger-${faq.id}`}
                  ref={(el) => (faqButtonsRef.current[index] = el)}
                  onClick={() => toggleFaq(faq.id)}
                  onKeyDown={(e) => handleKeyDown(e, index, filteredFaqs.length)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-azure-cyan transition-colors"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10 flex-shrink-0">
                      {faq.badge}
                    </span>
                    <span className="text-base sm:text-lg font-medium text-white tracking-tight">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-400 transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'transform rotate-180 text-azure-cyan' : ''
                    }`}
                  />
                </button>

                {/* CSS Grid 0fr -> 1fr Zero-Jank Transition */}
                <div
                  id={`faq-answer-${faq.id}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${faq.id}`}
                  className={`grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 pt-2 text-sm text-zinc-400 leading-relaxed border-t border-white/5">
                      <p>{faq.answer}</p>
                      {faq.highlights && faq.highlights.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2 pt-2">
                          {faq.highlights.map((h, hIdx) => (
                            <span
                              key={hIdx}
                              className="text-[11px] font-mono text-zinc-300 bg-white/5 px-2.5 py-1 rounded-md border border-white/5"
                            >
                              ✓ {h}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
