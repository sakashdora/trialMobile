import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { ArrowUp, ArrowUpRight, Plus, Check, X, Bookmark, Trash2 } from 'lucide-react';
import { AzureGlyph, BrandMark } from './components/Brand';
import { BagProvider, useBag } from './context/BagContext';
import { models, accessories, catalog, type Concept } from './data/collection';
import { gsap, Flip, ScrollTrigger } from './lib/gsap';
import { lockScroll, useAzureMotion } from './hooks/useAzureMotion';
import './premium.css';

// The accessory photos are named after what they show, not after the catalogue id.
const IMAGE_FILE: Record<string, string> = { wireless: 'stand', audio: 'earbuds' };

const NAV: [string, string][] = [
  ['Phones', '#collection'],
  ['Craft', '#architecture'],
  ['Accessories', '#accessories'],
  ['Compare', '#compare'],
];

const FILTERS = ['All phones', 'Everyday', 'Pro', 'Compact', 'Folding'];

const CRAFT = [
  {
    label: 'Frame',
    title: 'A titanium rim, cut to be held',
    text: 'A contoured titanium edge with a tactile action button. Strong where the phone is gripped, light where it sits in a pocket.',
  },
  {
    label: 'Lenses',
    title: 'Three lenses, one raised surround',
    text: 'A single surround keeps all three lenses on the same plane and lifts the glass clear of the table.',
  },
  {
    label: 'Back',
    title: 'A brushed back that stays clean',
    text: 'A micro-etched finish that resists fingerprints and warms quickly in the hand.',
  },
];

function ProductImage({ item, eager = false }: { item: Concept; eager?: boolean }) {
  const phone = item.category === 'phone';
  return (
    <img
      src={`/assets/collection-v3/items/${IMAGE_FILE[item.id] ?? item.id}.png`}
      alt={`${item.name}, ${item.finish.toLowerCase()} finish`}
      width={phone ? 324 : 627}
      height={phone ? 486 : 627}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className="product-tile-img"
    />
  );
}

type View = { kind: 'item'; item: Concept } | { kind: 'bag' };

function Storefront() {
  const { items, addItem, removeItem, clearBag } = useBag();
  const [filter, setFilter] = useState('All phones');
  const [menu, setMenu] = useState(false);
  const [booted, setBooted] = useState(false);
  const [view, setView] = useState<View>({ kind: 'bag' });
  const [open, setOpen] = useState(false);
  const [comparison, setComparison] = useState(['pro', 'air']);
  const root = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const wasLocked = useRef(false);

  useAzureMotion(root, () => setBooted(true));

  const saved = items.filter((item) => catalog.some((product) => product.id === item.model));
  const isSaved = (id: string) => saved.some((item) => item.model === id);

  const save = (item: Concept) => {
    if (!isSaved(item.id)) {
      addItem({
        model: item.id,
        name: `AZURE ${item.name}`,
        price: 0,
        image: '',
        finish: item.finish,
        storage: 'Concept',
      });
    }
  };

  const inspect = (item: Concept) => {
    setView({ kind: 'item', item });
    setOpen(true);
  };
  const openBag = () => {
    setView({ kind: 'bag' });
    setOpen(true);
  };
  // Keeping `view` after closing lets the dialog fade out with the content it was showing.
  const closeDialog = () => setOpen(false);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  }, [open]);

  const locked = open || menu;
  useEffect(() => {
    if (locked === wasLocked.current) return;
    wasLocked.current = locked;
    lockScroll(locked);
  }, [locked]);

  useEffect(() => {
    const page = document.getElementById('smooth-wrapper');
    if (page) page.inert = menu;
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenu(false);
    };
    window.addEventListener('keydown', escape);
    return () => {
      if (page) page.inert = false;
      window.removeEventListener('keydown', escape);
    };
  }, [menu]);

  // Filtering glides the cards to their new places instead of swapping them.
  const changeFilter = (value: string) => {
    if (value === filter) return;
    const cards = grid.current ? gsap.utils.toArray<HTMLElement>('.phone-card', grid.current) : [];
    if (!cards.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setFilter(value);
      return;
    }
    const area = grid.current!;
    const from = area.offsetHeight;
    const state = Flip.getState(cards);
    flushSync(() => setFilter(value));
    // While cards travel they are taken out of the flow, so the grid holds its old height and eases
    // to the new one; otherwise the sections below would jump.
    const to = area.offsetHeight;
    gsap.fromTo(
      area,
      { height: from },
      { height: to, duration: 0.9, ease: 'expo.inOut', clearProps: 'height' },
    );
    Flip.from(state, {
      duration: 0.9,
      ease: 'expo.inOut',
      absolute: true,
      stagger: 0.03,
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { autoAlpha: 0, scale: 0.9 },
          { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'expo.out', delay: 0.25 },
        ),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.9, duration: 0.45, ease: 'power2.in' }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  };

  const shown = models.filter((item) => filter === 'All phones' || item.kind === filter);
  const countFor = (value: string) =>
    value === 'All phones' ? models.length : models.filter((item) => item.kind === value).length;

  const saveButton = (item: Concept) => (
    <button
      className="icon-button save-button"
      aria-label={`${isSaved(item.id) ? 'Saved' : 'Save'} ${item.name}`}
      aria-pressed={isSaved(item.id)}
      onClick={() => save(item)}
    >
      <Plus size={16} className="icon-plus" />
      <Check size={16} className="icon-check" />
    </button>
  );

  const card = (item: Concept, index: number) => {
    const phone = item.category === 'phone';
    const hidden = phone && filter !== 'All phones' && item.kind !== filter;
    return (
      <article
        className={phone ? 'phone-card' : 'accessory-card'}
        key={item.id}
        id={item.id === 'case' ? 'cases' : item.id === 'charger' ? 'charging' : undefined}
        data-card=""
        data-hidden={hidden ? 'true' : undefined}
        data-speed={phone ? undefined : index % 2 ? 'clamp(0.86)' : 'clamp(1.04)'}
      >
        <button
          className="tile"
          onClick={() => inspect(item)}
          aria-label={`Inspect ${item.name} ${item.category}`}
        >
          <span className="reveal-clip">
            <ProductImage item={item} />
          </span>
        </button>
        <div className="card-meta">
          <button className="card-name" onClick={() => inspect(item)}>
            <h3>{item.name}</h3>
          </button>
          {!phone && <p className="card-text">{item.description}</p>}
          <div className="card-foot">
            <span className="finish">
              <i style={{ background: item.color }} aria-hidden="true" />
              {phone ? `${item.finish}, ${item.focus.toLowerCase()}` : item.finish}
            </span>
            {saveButton(item)}
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="premium-site" ref={root} data-menu={menu}>
      <a className="skip-link" href="#content">
        Skip to content
      </a>

      {/* ------------------------------------------------------------ Loader */}
      {!booted && (
        <div className="loader" aria-hidden="true">
          <div className="loader-stage">
            <AzureGlyph className="loader-glyph" shine />
            <span className="loader-track">
              <span className="loader-bar" />
            </span>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------ Header */}
      <header className="site-header">
        <div className="header-inner wrap">
          <BrandMark />
          <nav className="desktop-nav" aria-label="Main navigation">
            {NAV.map(([label, url]) => (
              <a key={url} href={url}>
                {label}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <button
              className="saved-button"
              onClick={openBag}
              aria-label={`Open shortlist, ${saved.length} items`}
            >
              <Bookmark size={16} />
              <span>Shortlist</span>
              <b key={saved.length}>{saved.length.toString().padStart(2, '0')}</b>
            </button>
            <button
              className="menu-button"
              aria-label={menu ? 'Close menu' : 'Open menu'}
              aria-expanded={menu}
              aria-controls="mobile-navigation"
              onClick={() => setMenu(!menu)}
            >
              <span className="menu-bars" aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </header>

      <nav
        id="mobile-navigation"
        className="menu-panel"
        aria-label="Mobile navigation"
        data-open={menu}
      >
        <ul>
          {NAV.map(([label, url], index) => (
            <li key={url} style={{ '--i': index } as React.CSSProperties}>
              <a href={url} onClick={() => setMenu(false)}>
                {label}
                <ArrowUpRight />
              </a>
            </li>
          ))}
        </ul>
        <button
          className="menu-shortlist"
          onClick={() => {
            setMenu(false);
            openBag();
          }}
        >
          Open shortlist ({saved.length})
        </button>
      </nav>

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main id="content">
            {/* ---------------------------------------------------- Hero */}
            <section className="hero theme-dark" id="home">
              <div className="hero-media">
                <img
                  className="hero-image"
                  src="/assets/collection-v3/hero.png"
                  alt="Three AZURE phones in graphite titanium and midnight blue standing on dark slate, the centre screen showing a night sea"
                  fetchPriority="high"
                />
              </div>
              <div className="hero-shade" />
              <div className="hero-inner wrap">
                <h1>
                  <span>Ten phones.</span>
                  <span>One quiet metal.</span>
                </h1>
                <div className="hero-foot">
                  <p className="hero-sub">
                    AZURE is a concept collection of ten smartphones and four accessories. Compare
                    them side by side, then keep the ones you like. Nothing here is for sale.
                  </p>
                  <div className="hero-actions">
                    <a className="btn btn-light" href="#collection">
                      Browse the ten phones <ArrowUpRight size={17} />
                    </a>
                    <a className="btn btn-ghost" href="#architecture">
                      See the craft
                    </a>
                  </div>
                </div>
              </div>
              <div className="hero-meta wrap">
                <span>Concept collection, 2026</span>
                <span className="scroll-cue">
                  Scroll <i aria-hidden="true" />
                </span>
              </div>
            </section>

            {/* ---------------------------------------------------- Statement */}
            <section className="statement theme-dark">
              <div className="wrap">
                <p className="statement-text story-word" data-split="scrub">
                  Every AZURE concept starts from one rule: keep only what the hand and the eye
                  need. Titanium where it carries weight, ceramic where it meets skin, and glass
                  that stays out of the way.
                </p>
              </div>
            </section>

            {/* ---------------------------------------------------- Craft chapter (pinned) */}
            <section className="chapter theme-dark" id="architecture" aria-labelledby="craft-title">
              <div className="chapter-media">
                <img
                  className="chapter-image"
                  src="/assets/collection-v3/detail.png"
                  alt="Close view of a brushed titanium phone corner with three dark lenses in a raised surround"
                  loading="lazy"
                />
              </div>
              <div className="chapter-shade" />
              <div className="chapter-inner wrap">
                <h2 id="craft-title" data-split="lines">
                  Built from the edge in.
                </h2>
                <div className="chapter-steps">
                  {CRAFT.map((step) => (
                    <article className="chapter-step" key={step.label}>
                      <h3>{step.title}</h3>
                      <p>{step.text}</p>
                    </article>
                  ))}
                </div>
                <div className="chapter-rail">
                  <span className="chapter-line" aria-hidden="true">
                    <span className="chapter-fill" />
                  </span>
                  <ol>
                    {CRAFT.map((step, index) => (
                      <li className="chapter-mark" key={step.label}>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        {step.label}
                      </li>
                    ))}
                  </ol>
                </div>
                <p className="chapter-note">Design study. Materials and finishes are not final.</p>
              </div>
            </section>

            {/* ---------------------------------------------------- Collection */}
            <section className="collection sheet theme-light" id="collection">
              <div className="wrap">
                <div className="section-head">
                  <h2 data-split="lines">Ten phones, one for every grip.</h2>
                  <p>
                    Filter by how you use a phone, open any model for its details, and save the
                    ones you want to come back to.
                  </p>
                </div>
                <div className="filter-row" role="group" aria-label="Filter phones">
                  {FILTERS.map((value) => (
                    <button
                      key={value}
                      aria-pressed={filter === value}
                      onClick={() => changeFilter(value)}
                    >
                      {value}
                      <small>{countFor(value)}</small>
                    </button>
                  ))}
                  <span aria-live="polite" className="filter-count">
                    Showing {shown.length} of {models.length}
                  </span>
                </div>
                <div className="phone-grid" ref={grid}>
                  {models.map(card)}
                </div>
                <p className="collection-note">
                  Every phone here is a concept study; no order or payment is taken.
                </p>
              </div>
            </section>

            {/* ---------------------------------------------------- Accessories */}
            <section className="accessories sheet theme-dark" id="accessories">
              <div className="wrap">
                <div className="section-head">
                  <h2 data-split="lines">Four accessories, one palette.</h2>
                  <p>
                    Cases, charging and audio in sand and champagne tones. Fit and compatibility are
                    still to be confirmed.
                  </p>
                </div>
                <div className="accessory-grid">{accessories.map(card)}</div>
              </div>
            </section>

            {/* ---------------------------------------------------- Compare */}
            <section className="compare sheet theme-dark" id="compare">
              <div className="wrap">
                <div className="section-head">
                  <h2 data-split="lines">Compare any two.</h2>
                  <p>Pick two phones to see their focus, size and finish side by side.</p>
                </div>
                <div className="comparison">
                  <div className="compare-labels" aria-hidden="true">
                    <span className="compare-thumb-label">Preview</span>
                    <span>Phone</span>
                    <span>Focus</span>
                    <span>Size</span>
                    <span>Finish</span>
                  </div>
                  {comparison.map((id, index) => {
                    const item = models.find((m) => m.id === id)!;
                    return (
                      <div className="compare-column" key={index}>
                        <div className="compare-thumb" key={id}>
                          <ProductImage item={item} />
                        </div>
                        <label htmlFor={`compare-${index}`}>Phone {index + 1}</label>
                        <select
                          id={`compare-${index}`}
                          value={id}
                          onChange={(event) =>
                            setComparison((previous) =>
                              previous.map((value, i) => (index === i ? event.target.value : value)),
                            )
                          }
                        >
                          {models.map((model) => (
                            <option value={model.id} key={model.id}>
                              {model.name} ({model.finish})
                            </option>
                          ))}
                        </select>
                        <span className="compare-val" key={`${id}-focus`}>
                          <b>Focus</b>
                          {item.focus}
                        </span>
                        <span className="compare-val" key={`${id}-size`}>
                          <b>Size</b>
                          {item.size}
                        </span>
                        <span className="compare-val" key={`${id}-finish`}>
                          <b>Finish</b>
                          <i style={{ background: item.color }} aria-hidden="true" />
                          {item.finish}, {item.material.toLowerCase()}
                        </span>
                        <button className="btn btn-outline" onClick={() => save(item)}>
                          {isSaved(id) ? 'Shortlisted' : `Shortlist ${item.name}`}
                          {isSaved(id) ? <Check size={15} /> : <Plus size={15} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* ---------------------------------------------------- Closing */}
            <section className="closing sheet theme-dark">
              <div className="wrap closing-inner">
                <h2 data-split="lines">Keep the ones you like.</h2>
                <p>Your shortlist stays in this browser. Nothing is sent anywhere.</p>
                <div className="closing-actions">
                  <button className="btn btn-light" onClick={openBag}>
                    Open shortlist ({saved.length}) <ArrowUpRight size={17} />
                  </button>
                  <a className="btn btn-ghost" href="#collection">
                    Back to the phones
                  </a>
                </div>
              </div>
            </section>
          </main>

          <footer className="site-footer theme-dark">
            <div className="wrap footer-main">
              <div className="footer-brand">
                <BrandMark size="lg" />
                <p>
                  A concept collection of ten smartphones and four accessories. Compare them, then keep
                  the ones you like.
                </p>
                <div className="footer-spec-summary">
                  <span>Grade-5 Titanium Billets</span>
                  <span className="dot-sep" aria-hidden="true">·</span>
                  <span>Ceramic Shield Armor</span>
                  <span className="dot-sep" aria-hidden="true">·</span>
                  <span>Pure Hardware Design</span>
                </div>
              </div>
              <nav className="footer-col" aria-label="Footer">
                <h3>Explore Lineup</h3>
                <ul>
                  {NAV.map(([label, url]) => (
                    <li key={url}>
                      <a href={url}>{label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="footer-col">
                <h3>Curated Shortlist</h3>
                <p>{saved.length ? `${saved.length} device${saved.length === 1 ? '' : 's'} saved in local storage.` : 'No concepts saved yet.'}</p>
                <button className="btn btn-outline footer-bag-btn" onClick={openBag}>
                  <span>Open shortlist</span>
                  <span className="footer-badge">{saved.length}</span>
                </button>
              </div>
            </div>

            <div className="mega-wrap" aria-hidden="true">
              <svg className="mega" viewBox="0 0 1000 250" preserveAspectRatio="xMidYMax meet">
                <defs>
                  <linearGradient id="mega-fade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#cdb98f" stopOpacity="0.4" />
                    <stop offset="1" stopColor="#cdb98f" stopOpacity="0.03" />
                  </linearGradient>
                </defs>
                <text x="0" y="244" textLength="1000" lengthAdjust="spacingAndGlyphs" fill="url(#mega-fade)">
                  AZURE
                </text>
              </svg>
            </div>

            <div className="wrap footer-bar">
              <p>
                AZURE Technology Inc. concept showcase. All devices, materials and renders are
                illustrative design studies.
              </p>
              <a className="icon-button to-top" href="#home" aria-label="Back to top">
                <ArrowUp size={18} />
              </a>
            </div>
          </footer>
        </div>
      </div>

      {/* ------------------------------------------------------------ Inspector / shortlist */}
      <dialog
        ref={dialog}
        className="concept-dialog"
        aria-label={view.kind === 'item' ? `${view.item.name} concept details` : 'Shortlist'}
        onCancel={(event) => {
          event.preventDefault();
          closeDialog();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
      >
        <button className="dialog-close icon-button" aria-label="Close dialog" onClick={closeDialog}>
          <X size={18} />
        </button>
        {view.kind === 'item' ? (
          <div className="dialog-grid">
            <div className="dialog-media">
              <ProductImage item={view.item} eager />
            </div>
            <div className="dialog-body">
              <p className="dialog-kicker">
                {view.item.category === 'phone' ? 'Smartphone concept' : 'Accessory concept'}
              </p>
              <h2>{view.item.name}</h2>
              <p className="dialog-lede">{view.item.description}</p>
              <dl>
                <div>
                  <dt>Focus</dt>
                  <dd>{view.item.focus}</dd>
                </div>
                <div>
                  <dt>Size</dt>
                  <dd>{view.item.size}</dd>
                </div>
                <div>
                  <dt>Finish</dt>
                  <dd>{view.item.finish}</dd>
                </div>
                <div>
                  <dt>Material</dt>
                  <dd>{view.item.material}</dd>
                </div>
              </dl>
              <button
                className="btn btn-light dialog-cta"
                onClick={() => save(view.item)}
                aria-pressed={isSaved(view.item.id)}
              >
                {isSaved(view.item.id) ? 'Shortlisted' : `Shortlist ${view.item.name}`}
                {isSaved(view.item.id) ? <Check size={17} /> : <Plus size={17} />}
              </button>
            </div>
          </div>
        ) : (
          <div className="dialog-body dialog-bag">
            <p className="dialog-kicker">Your shortlist</p>
            <h2>
              {saved.length ? `${saved.length} saved` : 'Nothing saved yet'}
            </h2>
            {saved.length ? (
              <>
                <ul className="saved-list">
                  {saved.map((item) => {
                    const product = catalog.find((p) => p.id === item.model)!;
                    return (
                      <li key={item.id}>
                        <span className="saved-thumb">
                          <ProductImage item={product} />
                        </span>
                        <span className="saved-text">
                          <strong>{product.name}</strong>
                          <small>
                            {item.finish}, {product.material.toLowerCase()}
                          </small>
                        </span>
                        <button
                          className="icon-button"
                          aria-label={`Remove ${product.name}`}
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <button className="text-link" onClick={clearBag}>
                  Clear shortlist
                </button>
              </>
            ) : (
              <div className="empty-state">
                <p>Use the plus on any phone or accessory to save it here.</p>
                <a
                  className="btn btn-light"
                  href="#collection"
                  onClick={closeDialog}
                >
                  Browse the phones <ArrowUpRight size={17} />
                </a>
              </div>
            )}
          </div>
        )}
      </dialog>
    </div>
  );
}

export const App = () => (
  <BagProvider storageKey="azure-concept-shortlist">
    <Storefront />
  </BagProvider>
);

export default App;
