import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDown, Plus, Check, X, Menu, Bookmark, Trash2, Shield, Cpu, Sparkles } from 'lucide-react';
import { BagProvider, useBag } from './context/BagContext';
import { models, accessories, catalog, type Concept } from './data/collection';
import './premium.css';

function ProductImage({ item, eager = false }: { item: Concept; eager?: boolean }) {
  return (
    <div className={`product-image ${item.category}`}>
      <img
        src={`/assets/collection-v3/items/${item.id}.png`}
        alt={`${item.name} in ${item.finish}, titanium and ceramic concept design`}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="product-tile-img"
      />
    </div>
  );
}

function Storefront() {
  const { items, addItem, removeItem, clearBag } = useBag();
  const [filter, setFilter] = useState('All phones');
  const [menu, setMenu] = useState(false);
  const [selected, setSelected] = useState<Concept | null>(null);
  const [bagOpen, setBagOpen] = useState(false);
  const [comparison, setComparison] = useState(['pro', 'air']);
  const dialog = useRef<HTMLDialogElement>(null);
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

  const closeDialog = () => {
    setSelected(null);
    setBagOpen(false);
  };

  useEffect(() => {
    if (selected || bagOpen) dialog.current?.showModal();
    else dialog.current?.close();
    if (selected || bagOpen || menu) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [selected, bagOpen, menu]);

  useEffect(() => {
    const surfaces = document.querySelectorAll<HTMLElement>('main,footer');
    surfaces.forEach((el) => {
      el.inert = menu;
    });
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenu(false);
    };
    window.addEventListener('keydown', escape);
    return () => {
      surfaces.forEach((el) => {
        el.inert = false;
      });
      window.removeEventListener('keydown', escape);
    };
  }, [menu]);

  const visible = models.filter((item) => filter === 'All phones' || item.kind === filter);
  const nav = [
    ['Smartphones', '#collection'],
    ['Architecture', '#architecture'],
    ['Accessories', '#accessories'],
    ['Comparison', '#compare'],
  ];

  const card = (item: Concept) => (
    <article
      className={item.category === 'phone' ? 'phone-card' : 'accessory-card'}
      key={item.id}
      id={item.id === 'case' ? 'cases' : item.id === 'charger' ? 'charging' : undefined}
    >
      <button
        className="product-visual-button"
        onClick={() => setSelected(item)}
        aria-label={`Inspect ${item.name} ${item.category}`}
      >
        <ProductImage item={item} />
      </button>
      <div className="product-info">
        <button className="product-name" onClick={() => setSelected(item)}>
          <h3>{item.name}</h3>
        </button>
        <div className="product-spec-pill">
          <span>{item.focus}</span>
        </div>
        <div className="product-bottom">
          <span className="finish">
            <i style={{ background: item.color }} aria-hidden="true" />
            {item.finish}
          </span>
          <button
            className="icon-button"
            aria-label={`${isSaved(item.id) ? 'Saved' : 'Save'} ${item.name}`}
            aria-pressed={isSaved(item.id)}
            onClick={() => save(item)}
          >
            {isSaved(item.id) ? <Check size={16} /> : <Plus size={16} />}
          </button>
        </div>
      </div>
    </article>
  );

  return (
    <div className="premium-site">
      <a className="skip-link" href="#content">
        Skip to content
      </a>

      {/* Header Navigation */}
      <header className="site-header">
        <div className="header-inner wrap">
          <a className="brand" href="#home" aria-label="AZURE Smartphones home">
            <svg viewBox="0 0 40 36" aria-hidden="true" className="brand-glyph">
              <path d="M17 1h8L40 34H29L17 9 5 34H0L17 1Z" />
              <path d="m17 23 5 11H11Z" />
            </svg>
            <span>AZURE</span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {nav.map(([label, url]) => (
              <a key={url} href={url}>
                {label}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <button
              className="saved-button"
              onClick={() => setBagOpen(true)}
              aria-label={`Open saved collection, ${saved.length} items`}
            >
              <Bookmark size={16} />
              <span>Shortlist</span>
              <b>{saved.length.toString().padStart(2, '0')}</b>
            </button>
            <a href="#collection" className="btn primary nav-cta">
              Explore 10 Handsets
            </a>
            <button
              className="menu-button"
              aria-label={menu ? 'Close menu' : 'Open menu'}
              aria-expanded={menu}
              aria-controls="mobile-navigation"
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {menu && (
        <nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation">
          {nav.map(([label, url]) => (
            <a key={url} href={url} onClick={() => setMenu(false)}>
              {label}
              <ArrowUpRight />
            </a>
          ))}
        </nav>
      )}

      <main id="content">
        {/* Section 1: Hero Section */}
        <section className="hero" id="home">
          <img
            className="hero-image"
            src="/assets/collection-v3/hero.png"
            alt="AZURE One Pro flagship smartphones in Grade-5 Titanium, Ivory and Midnight on dark slate table"
            fetchPriority="high"
          />
          <div className="hero-shade" />
          <div className="hero-content wrap">
            <div className="hero-badge">
              <span className="badge-dot" /> 10 FLAGSHIP SMARTPHONE CONCEPTS · 2026 EDITION
            </div>
            <h1>
              <span>AZURE Flagship</span>
              <span>Smartphones</span>
              <span>Built in Titanium.</span>
            </h1>
            <p className="hero-intro">
              Grade-5 titanium unibody, 200MP periscope telephoto optics, and sub-3nm neural silicon. 
              Engineered with zero compromise for pure performance and ergonomics.
            </p>
            <div className="hero-actions">
              <a className="btn light" href="#collection">
                Explore The 10 Smartphones <ArrowUpRight size={17} />
              </a>
              <a className="btn secondary hero-ghost" href="#architecture">
                Titanium Engineering <ArrowDown size={15} />
              </a>
            </div>
            <div className="hero-stats-strip">
              <div>
                <strong>Grade-5</strong>
                <small>Solid Titanium</small>
              </div>
              <div>
                <strong>3nm Core</strong>
                <small>Neural Compute Engine</small>
              </div>
              <div>
                <strong>2,000 Nits</strong>
                <small>120Hz ProMotion LTPO</small>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Collection Catalog */}
        <section id="collection" className="collection-section">
          <div className="wrap">
            <div className="section-heading">
              <div>
                <p className="eyebrow">01 / The Handset Lineup</p>
                <h2>
                  Ten distinct smartphones.
                  <br className="mobile-break" /> One pure engineering ethos.
                </h2>
              </div>
              <a href="#compare" className="text-link">
                Compare technical specifications <ArrowUpRight size={16} />
              </a>
            </div>
            <div className="filter-row" aria-label="Filter phones">
              {['All phones', 'Everyday', 'Pro', 'Compact', 'Folding'].map((value) => (
                <button
                  key={value}
                  aria-pressed={filter === value}
                  onClick={() => setFilter(value)}
                >
                  {value}
                  {value === 'All phones' && <small>10</small>}
                </button>
              ))}
              <span aria-live="polite" className="filter-count">{visible.length} available</span>
            </div>
            <div className="phone-grid">{visible.map(card)}</div>
            <p className="collection-note">
              Every handset concept represents a calibrated balance of ergonomics, thermal dissipation, and optical glass; no order or payment is taken.
            </p>
          </div>
        </section>

        {/* Section 3: Titanium Architecture Section */}
        <section className="architecture-section" id="architecture">
          <div className="wrap">
            <div className="section-heading">
              <div>
                <p className="eyebrow">02 / Precision Architecture</p>
                <h2>Machined from solid Grade-5 titanium billets.</h2>
              </div>
              <p>Sub-millimeter tolerances. Laser-fused ceramic shield armor.</p>
            </div>

            <div className="architecture-grid">
              <div className="arch-feature-visual">
                <img
                  src="/assets/collection-v3/detail.png"
                  alt="Micro-engineered titanium periscope camera surround with dark sapphire crystal lenses"
                  loading="lazy"
                />
                <span className="arch-visual-tag">PROVISION TETRAPRISM OPTICS</span>
              </div>
              <div className="arch-feature-copy">
                <div className="arch-card">
                  <div className="arch-card-icon"><Shield size={20} /></div>
                  <h3 className="story-word">Precision Grade-5 Titanium Perimeter</h3>
                  <p>
                    Contoured 7.8mm featherweight titanium perimeter with integrated tactile action button. 
                    Solid-state diffusion bonded to an internal graphene thermal skeleton.
                  </p>
                </div>
                <div className="arch-card">
                  <div className="arch-card-icon"><Cpu size={20} /></div>
                  <h3>TSMC 3nm Neural Silicon Core</h3>
                  <p>
                    18.6 billion transistors engineered for sustained compute density and zero throttling. 
                    Features dedicated on-device machine intelligence.
                  </p>
                </div>
                <div className="arch-card">
                  <div className="arch-card-icon"><Sparkles size={20} /></div>
                  <h3>Ceramic Shield Nanocrystal Armor</h3>
                  <p>
                    Dual-ion exchange glass backplate micro-etched for a silky fingerprint-resistant tactile finish 
                    and 4x greater drop resilience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Ecosystem & Accessories */}
        <section className="accessories-section" id="accessories">
          <div className="wrap">
            <div className="section-heading">
              <div>
                <p className="eyebrow">03 / The Ecosystem</p>
                <h2>Modular charging and acoustic accessories.</h2>
              </div>
              <p>Universal USB-C Power Delivery and magnetic wireless alignment.</p>
            </div>
            <div className="accessory-grid">{accessories.map(card)}</div>
          </div>
        </section>

        {/* Section 5: Handset Comparison */}
        <section className="compare-section" id="compare">
          <div className="wrap">
            <div className="section-heading">
              <div>
                <p className="eyebrow">04 / Side by Side Inspector</p>
                <h2>Compare specifications and dimensions.</h2>
              </div>
              <p>Select any two handsets to inspect optics, compute, and materials.</p>
            </div>
            <div className="comparison">
              <div className="compare-labels">
                <span className="compare-thumb-label">Device Preview</span>
                <span>Select Handset</span>
                <span>Hardware Focus</span>
                <span>Display &amp; Chassis</span>
                <span>Finish &amp; Materials</span>
              </div>
              {comparison.map((id, index) => {
                const item = models.find((m) => m.id === id)!;
                return (
                  <div className="compare-column" key={index}>
                    <div className="compare-thumb">
                      <ProductImage item={item} />
                    </div>
                    <label htmlFor={`compare-${index}`}>Handset {index + 1}</label>
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
                    <span className="compare-val">{item.focus}</span>
                    <span className="compare-val">{item.size}</span>
                    <span className="compare-val">
                      <i style={{ background: item.color }} aria-hidden="true" />
                      {item.finish} ({item.material})
                    </span>
                    <button className="btn secondary" onClick={() => save(item)}>
                      {isSaved(id) ? 'Shortlisted' : `Shortlist ${item.name}`}
                      {isSaved(id) ? <Check size={15} /> : <Plus size={15} />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 6: Closing Section */}
        <section className="closing-section">
          <div className="wrap">
            <div className="closing-content">
              <p className="eyebrow">AZURE FLAGSHIP SHOWCASE</p>
              <h2>Experience the pinnacle of mobile design.</h2>
              <p>Curate your personal collection and review your shortlisted devices.</p>
              <button className="btn light" onClick={() => setBagOpen(true)}>
                View your shortlist ({saved.length}) <ArrowUpRight size={17} />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap footer-wrap">
          <div className="footer-top">
            <a className="brand" href="#home">
              AZURE
            </a>
            <a className="text-link" href="#home">
              Back to top ↑
            </a>
          </div>
          <p>
            AZURE Technology Inc. Flagship smartphone concept showcase. 
            All device configurations, materials, and renders are illustrative design studies.
          </p>
        </div>
      </footer>

      {/* Inspector / Shortlist Dialog */}
      <dialog
        ref={dialog}
        className="concept-dialog"
        aria-label={selected ? `${selected.name} concept details` : 'Saved collection'}
        onCancel={closeDialog}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
      >
        <div className="dialog-inner">
          <button
            className="dialog-close icon-button"
            aria-label="Close dialog"
            onClick={closeDialog}
          >
            <X />
          </button>
          {selected ? (
            <>
              <p className="eyebrow">
                AZURE / {selected.category === 'phone' ? 'Smartphone' : 'Accessory'} Architecture
              </p>
              <div className="dialog-product-image">
                <ProductImage item={selected} eager />
              </div>
              <h2>{selected.name}</h2>
              <p>{selected.description}</p>
              <dl>
                <div>
                  <dt>Target Focus</dt>
                  <dd>{selected.focus}</dd>
                </div>
                <div>
                  <dt>Chassis Format</dt>
                  <dd>{selected.size}</dd>
                </div>
                <div>
                  <dt>Exterior Finish</dt>
                  <dd>{selected.finish}</dd>
                </div>
                <div>
                  <dt>Structural Material</dt>
                  <dd>{selected.material}</dd>
                </div>
              </dl>
              <button className="btn primary dialog-cta" onClick={() => save(selected)}>
                {isSaved(selected.id) ? 'Shortlisted in your collection' : `Add ${selected.name} to shortlist`}
                {isSaved(selected.id) ? <Check size={17} /> : <Plus size={17} />}
              </button>
            </>
          ) : (
            <>
              <p className="eyebrow">Curated Shortlist</p>
              <h2>Saved Devices &amp; Gear ({saved.length})</h2>
              {saved.length ? (
                <>
                  <div className="saved-list">
                    {saved.map((item) => {
                      const product = catalog.find((p) => p.id === item.model)!;
                      return (
                        <div key={item.id}>
                          <div className="saved-thumb">
                            <ProductImage item={product} />
                          </div>
                          <div>
                            <h3>{product.name}</h3>
                            <p>{item.finish} / {product.material}</p>
                          </div>
                          <button
                            className="icon-button"
                            aria-label={`Remove ${product.name}`}
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <button className="text-link" onClick={clearBag}>
                    Clear shortlist
                  </button>
                </>
              ) : (
                <div className="empty-state">
                  <Bookmark size={30} />
                  <p>Select any smartphone or accessory to shortlist your favorite concepts.</p>
                  <a className="btn primary" href="#collection" onClick={closeDialog}>
                    View the smartphones <ArrowUpRight size={17} />
                  </a>
                </div>
              )}
            </>
          )}
        </div>
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
