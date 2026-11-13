import { $, $$, openDialog } from '../shared/ui.js';
import { scenes } from '../data/gallery.js';

export function initGallery() {
  let scene = 0;
  function renderScene() {
    const s = scenes[scene];
    $('#gallery-image').src = s.image;
    $('#gallery-image').alt = s.alt;
    $('#gallery-kicker').textContent = s.kicker;
    $('#gallery-title').textContent = s.title;
    $('#photo-credit').textContent = 'Photography by ' + s.credit + ' ↗';
    $('#photo-credit').href = s.url;
    $$('[data-scene]').forEach((b) => {
      const active = Number(b.dataset.scene) === scene;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
  }
  $('#gallery-prev').onclick = () => {
    scene = (scene + scenes.length - 1) % scenes.length;
    renderScene();
  };
  $('#gallery-next').onclick = () => {
    scene = (scene + 1) % scenes.length;
    renderScene();
  };
  $$('[data-scene]').forEach(
    (b) =>
      (b.onclick = () => {
        scene = Number(b.dataset.scene);
        renderScene();
      }),
  );
  $('#expand-photo').onclick = () => {
    const s = scenes[scene];
    $('#large-photo').src = s.image;
    $('#large-photo').alt = s.alt;
    $('#large-photo-caption').textContent =
      s.title +
      ' · Photography by ' +
      s.credit +
      ' / Unsplash. Inspiration photography, not captured on AZURE.';
    openDialog('#photo-dialog');
  };
}
