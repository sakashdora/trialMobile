import { $, $$, money } from '../shared/ui.js';
import { products, phones, accessories } from '../data/products.js';

export function initCatalog() {
  $('#phone-grid').innerHTML = phones
    .map((id) => {
      const p = products[id];
      return `
<article class="phone-card" data-model="${id}">
  <div class="card-top">
    <span>${p.tag}</span><span class="card-badge">${p.badge}</span>
  </div>
  <button class="phone-image-button" data-product="${id}" aria-label="View ${p.name}">
    <img
      src="${p.image}"
      alt="${p.name} in ${p.finish}"
      loading="lazy"
      width="1086"
      height="1448"
    />
  </button>
  <div class="phone-info">
    <h3>${p.name}</h3>
    <p>${p.description}</p>
    <div class="finish-line" style="--finish: ${p.color}">
      <i aria-hidden="true"></i>${p.finish}
    </div>
    <div class="product-bottom">
      <div>
        <strong>${money(p.base)}</strong><small>Starting price</small>
      </div>
      <button class="button light btn" data-product="${id}" aria-label="Configure ${p.name}">
        Configure ${p.short} <span>↗</span>
      </button>
    </div>
  </div>
</article>
`;
    })
    .join('');
  $('#accessory-grid').innerHTML = accessories
    .map((id) => {
      const p = products[id];
      return `
<article class="accessory-card" data-category="${p.category}">
  <button class="accessory-img" data-product="${id}" aria-label="View ${p.name}">
    <img
      src="${p.image}"
      alt="${p.name} concept in ${p.finish}"
      width="1254"
      height="1254"
      loading="lazy"
    />
  </button>
  <div class="accessory-info">
    <p class="eyebrow">${p.category.toUpperCase()}</p>
    <h3>${p.name}</h3>
    <p>${p.description}</p>
    <div class="product-bottom">
      <div><strong>${money(p.base)}</strong><small>Starting price</small></div>
      <button class="button outline btn" data-product="${id}" aria-label="Configure ${p.name}">
        Configure <span>↗</span>
      </button>
    </div>
  </div>
</article>
`;
    })
    .join('');
  $$('[data-filter]').forEach(
    (b) =>
      (b.onclick = () => {
        const filter = b.dataset.filter;
        $$('[data-filter]').forEach((x) => {
          x.classList.toggle('active', x === b);
          x.setAttribute('aria-pressed', String(x === b));
        });
        let n = 0;
        $$('.accessory-card').forEach((card) => {
          card.hidden = filter !== 'all' && card.dataset.category !== filter;
          if (!card.hidden) n++;
        });
        $('#accessory-count').textContent = n + ' essential' + (n === 1 ? '' : 's');
      }),
  );
}
