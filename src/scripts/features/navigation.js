import { $, $$ } from '../shared/ui.js';

export function initNavigation() {
  const menuBtn = $('.menu-button') || $('.nav__toggle');
  const nav = $('nav') || $('#main-nav');
  const header = $('header');

  if (menuBtn && nav) {
    function toggleMenu() {
      const open = nav.classList.toggle('open');
      if (header) header.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    function closeMenu() {
      nav.classList.remove('open');
      if (header) header.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Open menu');
    }

    menuBtn.onclick = toggleMenu;
    $$('nav a').forEach((a) => (a.onclick = closeMenu));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        if (entry.isIntersecting)
          $$('nav a').forEach((a) => {
            const active = a.hash === '#' + entry.target.id;
            a.classList.toggle('current', active);
            if (active) a.setAttribute('aria-current', 'location');
            else a.removeAttribute('aria-current');
          });
    },
    { rootMargin: '-10% 0px -65% 0px' },
  );
  $$('section[id]').forEach((section) => sectionObserver.observe(section));
}
