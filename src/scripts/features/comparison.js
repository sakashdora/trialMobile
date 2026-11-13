import { $, money } from '../shared/ui.js';
import { products, phones } from '../data/products.js';

export function initComparison() {
  function renderCompare() {
    const left = $('#compare-left').value,
      right = $('#compare-right').value,
      a = products[left],
      b = products[right];
    const imgLeft = $('#compare-img-left');
    const imgRight = $('#compare-img-right');
    if (imgLeft) {
      imgLeft.src = a.image;
      imgLeft.alt = a.name;
    }
    if (imgRight) {
      imgRight.src = b.image;
      imgRight.alt = b.name;
    }
    $('#compare-head').innerHTML =
      '<tr><th scope="col">SPECIFICATIONS</th><th scope="col">' +
      `<div class="compare-phone-title">${a.name}</div>` +
      '</th><th scope="col">' +
      `<div class="compare-phone-title">${b.name}</div>` +
      '</th></tr>';
    const rows = [
      ['Designed for', a.personality, b.personality],
      ['Display concept', a.display, b.display],
      ['Camera concept', a.camera, b.camera],
      ['Finish shown', a.finish, b.finish],
      ['Storage options', a.storage.join(' / '), b.storage.join(' / ')],
      ['Starting price', money(a.base), money(b.base)],
    ];
    $('#compare-body').innerHTML =
      rows
        .map(
          (r) => `
<tr>
  <th scope="row">${r[0]}</th>
  <td>${r[1]}</td>
  <td>${r[2]}</td>
</tr>
`,
        )
        .join('') +
      `
<tr>
  <th scope="row">Make it yours</th>
  <td>
    <button class="button light btn" data-product="${left}">Configure ${a.short} ↗</button>
  </td>
  <td>
    <button class="button light btn" data-product="${right}">Configure ${b.short} ↗</button>
  </td>
</tr>
`;
  }
  $('#compare-left').onchange = () => {
    if ($('#compare-left').value === $('#compare-right').value)
      $('#compare-right').value = phones.find((x) => x !== $('#compare-left').value);
    renderCompare();
  };
  $('#compare-right').onchange = () => {
    if ($('#compare-left').value === $('#compare-right').value)
      $('#compare-left').value = phones.find((x) => x !== $('#compare-right').value);
    renderCompare();
  };
  renderCompare();
}
