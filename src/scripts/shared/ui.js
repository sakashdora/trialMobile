export const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
export const money = (n) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
let toastTimer, returnFocus;
export function toast(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3500);
}
export function openDialog(id) {
  returnFocus = document.activeElement;
  $(id).showModal();
  document.body.style.overflow = 'hidden';
}
export function initDialogs() {
  $$('dialog').forEach((d) => {
    d.querySelector('.close-dialog').onclick = () => d.close();
    d.addEventListener('close', () => {
      document.body.style.overflow = '';
      returnFocus?.focus({ preventScroll: true });
    });
    d.addEventListener('click', (e) => {
      if (e.target === d) {
        const r = d.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
          d.close();
      }
    });
  });
}
