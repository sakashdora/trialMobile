import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDown, Plus, Check, X, Menu, Bookmark, Trash2 } from 'lucide-react';
import { BagProvider, useBag } from './context/BagContext';
import { models, accessories, catalog, type Concept } from './data/collection';
import './premium.css';

function ProductImage({ item, eager = false }: { item: Concept; eager?: boolean }) {
  const cols = item.category === 'phone' ? 5 : 2;
  const column = item.tile % cols,
    row = Math.floor(item.tile / cols);
  // The contact sheet's open Fold extends slightly into the Edge cell.
  const zoom = item.id === 'edge' ? 1.12 : 1;
  const inset = (zoom - 1) * 50;
  return (
    <div className={`product-image ${item.category}`}>
      <img
        src={`/assets/collection-v3/${item.category === 'phone' ? 'phones' : 'accessories'}.png`}
        alt={`${item.name} in ${item.finish}, concept rendering`}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        style={{
          width: `${cols * 100 * zoom}%`,
          height: `${200 * zoom}%`,
          left: `${-column * 100 * zoom - inset + (item.id === 'fold' ? 5 : 0)}%`,
          top: `${-row * 100 * zoom - inset}%`,
        }}
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
  const story = useRef<HTMLElement>(null);
  const saved = items.filter((item) => catalog.some((product) => product.id === item.model));
  const isSaved = (id: string) => saved.some((item) => item.model === id);
  const save = (item: Concept) => {
    if (!isSaved(item.id))
      addItem({
        model: item.id,
        name: `AZURE ${item.name}`,
        price: 0,
        image: '',
        finish: item.finish,
        storage: 'Concept',
      });
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
  useEffect(() => {
    const section = story.current;
    if (!section) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const words = section.querySelectorAll<HTMLElement>('.story-word');
    let frame = 0;
    const update = () => {
      frame = 0;
      const box = section.getBoundingClientRect();
      const p = preference.matches
        ? 1
        : Math.max(0, Math.min(1, (window.innerHeight * 0.75 - box.top) / (box.height * 0.75)));
      section.style.setProperty('--progress', String(p));
      words.forEach((word, i) =>
        word.classList.toggle('lit', preference.matches || p > i / words.length),
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    preference.addEventListener('change', schedule);
    update();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      preference.removeEventListener('change', schedule);
      cancelAnimationFrame(frame);
    };
  }, []);
  const visible = models.filter((item) => filter === 'All phones' || item.kind === filter);
  const nav = [
    ['Phones', '#collection'],
    ['Cases', '#cases'],
    ['Charging', '#charging'],
    ['Accessories', '#accessories'],
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
        aria-label={`View ${item.name}`}
      >
        <ProductImage item={item} />
      </button>
      <div className="product-info">
        <button className="product-name" onClick={() => setSelected(item)}>
          <h3>{item.name}</h3>
        </button>
        <div className="product-bottom">
          <span className="finish">
            <i style={{ background: item.color }} />
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
      <header className="site-header">
        <a className="brand" href="#home" aria-label="AZURE home">
          AZURE
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
            <Bookmark size={17} />
            <span>Saved</span>
            <b>{saved.length.toString().padStart(2, '0')}</b>
          </button>
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
        <section className="hero" id="home">
          <img
            className="hero-image"
            src="/assets/collection-v3/hero.png"
            alt="Three AZURE concept phones in titanium, ivory and midnight on dark slate"
          />
          <div className="hero-shade" />
          <div className="hero-content wrap">
            <p className="eyebrow hero-enter">The AZURE concept collection</p>
            <h1>
              <span>A phone for</span>
              <span>every side</span>
              <span>of you.</span>
            </h1>
            <p className="hero-intro hero-enter">Ten phones. A world of possibilities.</p>
            <a className="btn light hero-enter" href="#collection">
              View the collection <ArrowUpRight size={17} />
            </a>
            <a className="scroll-hint" href="#collection">
              Scroll to discover <ArrowDown size={15} />
            </a>
          </div>
        </section>
        <section id="collection" className="collection-section">
          <div className="wrap">
            <div className="section-heading">
              <div>
                <p className="eyebrow">01 / Find your One</p>
                <h2>
                  Ten phones.
                  <br className="mobile-break" /> Find your One.
                </h2>
              </div>
              <a href="#compare" className="text-link">
                Compare models <ArrowUpRight size={16} />
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
              <span aria-live="polite">{visible.length} concepts</span>
            </div>
            <div className="phone-grid">{visible.map(card)}</div>
            <p className="collection-note">
              The complete concept collection. Choose a phone to see its design direction.
            </p>
          </div>
        </section>
        <section
          className="story-section"
          id="design"
          ref={story}
          aria-label="Designed to move with you"
        >
          <div className="story-sticky">
            <div className="story-art" aria-hidden="true" />
            <div className="story-copy wrap">
              <p className="eyebrow">02 / Form meets feeling</p>
              <h2 aria-label="Designed to move with you.">
                {['Designed', 'to', 'move', 'with', 'you.'].map((word, i) => (
                  <span className="story-word" aria-hidden="true" key={i}>
                    {word}{' '}
                  </span>
                ))}
              </h2>
              <p>
                A shape that feels right.
                <br />A finish that feels like you.
              </p>
            </div>
            <span className="story-index" aria-hidden="true">
              AZURE / IN DETAIL
            </span>
          </div>
        </section>
        <section className="accessories-section" id="accessories">
          <div className="wrap">
            <div className="section-heading">
              <div>
                <p className="eyebrow">03 / Complete your everyday</p>
                <h2>The finishing touches.</h2>
              </div>
              <p>From your pocket to your desk.</p>
            </div>
            <div className="accessory-grid">{accessories.map(card)}</div>
          </div>
        </section>
        <section className="compare-section" id="compare">
          <div className="wrap">
            <div className="section-heading">
              <div>
                <p className="eyebrow">04 / Side by side</p>
                <h2>Which One is yours?</h2>
              </div>
              <p>Compare the design directions.</p>
            </div>
            <div className="comparison">
              <div className="compare-labels">
                <span>Choose a phone</span>
                <span>Focus</span>
                <span>Format</span>
                <span>Finish</span>
              </div>
              {comparison.map((id, index) => {
                const item = models.find((m) => m.id === id)!;
                return (
                  <div className="compare-column" key={index}>
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
                          {model.name}
                        </option>
                      ))}
                    </select>
                    <span>{item.focus}</span>
                    <span>{item.size}</span>
                    <span>
                      <i style={{ background: item.color }} />
                      {item.finish}
                    </span>
                    <button className="btn secondary" onClick={() => save(item)}>
                      {isSaved(id) ? 'Saved' : `Save ${item.name}`}
                      {isSaved(id) ? <Check size={15} /> : <Plus size={15} />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <section className="closing-section">
          <div className="wrap">
            <h2>Your phone. Your way.</h2>
            <button className="btn light" onClick={() => setBagOpen(true)}>
              View your collection <ArrowUpRight size={17} />
            </button>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <a className="brand" href="#home">
            AZURE
          </a>
          <a className="text-link" href="#home">
            Back to top ↑
          </a>
        </div>
        <p>
          AZURE is a concept collection. Images are concept renders. Specifications, pricing and
          compatibility are not confirmed. No purchases are processed.
        </p>
      </footer>
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
                AZURE / {selected.category === 'phone' ? 'Phone' : 'Accessory'} concept
              </p>
              <div className="dialog-product-image">
                <ProductImage item={selected} eager />
              </div>
              <h2>{selected.name}</h2>
              <p>{selected.description}</p>
              <dl>
                <div>
                  <dt>Focus</dt>
                  <dd>{selected.focus}</dd>
                </div>
                <div>
                  <dt>Format</dt>
                  <dd>{selected.size}</dd>
                </div>
                <div>
                  <dt>Finish</dt>
                  <dd>{selected.finish}</dd>
                </div>
              </dl>
              <button className="btn primary" onClick={() => save(selected)}>
                {isSaved(selected.id) ? 'Saved to your collection' : `Save ${selected.name}`}
                {isSaved(selected.id) ? <Check size={17} /> : <Plus size={17} />}
              </button>
              <p className="dialog-note">
                Concept only. Final specifications, pricing and compatibility are not confirmed.
              </p>
            </>
          ) : (
            <>
              <p className="eyebrow">Your collection</p>
              <h2>Saved items ({saved.length})</h2>
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
                            <p>{item.finish} / Concept</p>
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
                    Clear collection
                  </button>
                </>
              ) : (
                <div className="empty-state">
                  <Bookmark size={30} />
                  <p>Save a phone or accessory that catches your eye.</p>
                  <a className="btn primary" href="#collection" onClick={closeDialog}>
                    View the collection <ArrowUpRight size={17} />
                  </a>
                </div>
              )}
              <p className="dialog-note">Saved on this browser; no order or payment is taken.</p>
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
