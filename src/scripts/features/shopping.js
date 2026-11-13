import { $, money, openDialog, toast } from '../shared/ui.js';
import { products } from '../data/products.js';

export function initShopping() {
  let bag = [],
    current = 'pro';
  try {
    const saved = JSON.parse(localStorage.getItem('azure-preview-bag') || '[]');
    if (Array.isArray(saved))
      bag = saved
        .filter(
          (i) =>
            i &&
            Object.hasOwn(products, i.model) &&
            typeof i.finish === 'string' &&
            (!products[i.model].storage || products[i.model].storage.includes(i.storage)),
        )
        .slice(0, 20)
        .map((i) => ({
          model: i.model,
          finish: products[i.model].finish,
          storage: products[i.model].storage ? i.storage : null,
        }));
  } catch {
    // Browser storage may be unavailable; the bag remains usable in memory.
  }
  const price = (i) =>
    products[i.model].base + (products[i.model].storage?.indexOf(i.storage) > 0 ? 10000 : 0);
  function persist() {
    try {
      localStorage.setItem('azure-preview-bag', JSON.stringify(bag));
    } catch {}
    $('#bag-count').textContent = bag.length;
  }
  function updatePrice() {
    $('#config-price').textContent = money(
      products[current].base +
        (products[current].storage && $('#storage').selectedIndex > 0 ? 10000 : 0),
    );
  }
  function openProduct(id) {
    const p = products[id];
    if (!p) return;
    current = id;
    $('#product-title').textContent = p.name;
    $('#product-category').textContent =
      p.category === 'phone' ? 'THE AZURE PHONE COLLECTION' : 'THE EVERYDAY ESSENTIALS';
    $('#product-image').src = p.image;
    $('#product-image').alt = p.name + ' in ' + p.finish;
    $('#product-description').textContent = p.description;
    $('#product-highlights').replaceChildren(
      ...p.highlights.map((text) => {
        const li = document.createElement('li');
        li.textContent = text;
        return li;
      }),
    );
    $('#finish').replaceChildren(new Option(p.finish, p.finish));
    $('#storage-field').hidden = !p.storage;
    $('#storage').replaceChildren(...(p.storage || []).map((x) => new Option(x, x)));
    updatePrice();
    openDialog('#product-dialog');
  }
  // Delegation also covers comparison controls rendered after selection changes.
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-product]');
    if (b) openProduct(b.dataset.product);
  });
  $('#storage').onchange = updatePrice;
  $('#configuration-form').onsubmit = (e) => {
    e.preventDefault();
    if (bag.length >= 20) {
      toast('Your preview bag holds up to 20 items. Remove an item to add another.');
      return;
    }
    const p = products[current];
    bag.push({ model: current, finish: p.finish, storage: p.storage ? $('#storage').value : null });
    persist();
    $('#product-dialog').close();
    toast(p.name + ' added to your preview bag');
  };
  function renderBag() {
    const root = $('#bag-items');
    root.replaceChildren();
    $('#bag-summary').replaceChildren();
    if (!bag.length) {
      const text = document.createElement('p');
      text.className = 'empty-bag';
      text.textContent =
        'Make room for something extraordinary. Explore the collection and save your favorite concepts here.';
      const btn = document.createElement('button');
      btn.className = 'button light';
      btn.textContent = 'Explore the collection ↗';
      btn.onclick = () => {
        $('#bag-dialog').close();
        $('#collection').scrollIntoView({
          behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth',
        });
      };
      root.append(text, btn);
      return;
    }
    bag.forEach((item, index) => {
      const p = products[item.model],
        row = document.createElement('div');
      row.className = 'bag-item';
      const img = document.createElement('img');
      img.src = p.image;
      img.alt = p.name;
      const info = document.createElement('div'),
        h = document.createElement('h3'),
        desc = document.createElement('p'),
        amount = document.createElement('strong');
      h.textContent = p.name;
      desc.textContent = item.finish + (item.storage ? ' · ' + item.storage : '');
      amount.textContent = money(price(item));
      info.append(h, desc, amount);
      const remove = document.createElement('button');
      remove.className = 'remove-item';
      remove.textContent = 'Remove';
      remove.setAttribute('aria-label', 'Remove ' + p.name);
      remove.onclick = () => {
        bag.splice(index, 1);
        persist();
        renderBag();
      };
      row.append(img, info, remove);
      root.append(row);
    });
    const total = document.createElement('div');
    total.className = 'bag-total';
    const label = document.createElement('span'),
      amount = document.createElement('strong');
    label.textContent = 'Preview total';
    amount.textContent = money(bag.reduce((sum, i) => sum + price(i), 0));
    total.append(label, amount);
    const note = document.createElement('p');
    note.className = 'disclosure';
    note.textContent =
      'Illustrative selection only. Checkout, taxes, delivery and payments are not connected.';
    $('#bag-summary').append(total, note);
  }
  $('.bag-button').onclick = () => {
    renderBag();
    openDialog('#bag-dialog');
  };
  persist();
}
