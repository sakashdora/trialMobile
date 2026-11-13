import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

test('approved collection renders ten phones and four accessories without sales claims', async () => {
  const vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
  });
  try {
    const { default: App } = await vite.ssrLoadModule('/src/App.tsx');
    const html = renderToStaticMarkup(React.createElement(App));
    assert.equal((html.match(/class="phone-card"/g) || []).length, 10);
    assert.equal((html.match(/class="accessory-card"/g) || []).length, 4);
    for (const name of [
      'One Pro',
      'One Air',
      'One Mini',
      'One Pro Max',
      'One Fold',
      'One Flip',
      'One Studio',
      'Charging essentials',
    ])
      assert.ok(html.includes(name));
    assert.equal((html.match(/<option /g) || []).length, 20);
    assert.ok(html.includes('story-word'));
    assert.ok(html.includes('no order or payment is taken'));
    assert.doesNotMatch(
      html,
      /assets\/images\/products|assets\/videos|<video|dispatch initiated|aerospace|2-year|A19/,
    );
  } finally {
    await vite.close();
  }
});

test('concept shortlist storage is separate from the legacy shopping bag', async () => {
  const vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
  });
  const previousWindow = globalThis.window;
  const previousStorage = globalThis.localStorage;
  try {
    const { BagProvider, useBag } = await vite.ssrLoadModule('/src/context/BagContext.tsx');
    globalThis.window = {};
    const reads = [];
    globalThis.localStorage = {
      getItem(key) {
        reads.push(key);
        return null;
      },
    };
    function Consumer() {
      assert.equal(useBag().itemCount, 0);
      return null;
    }
    renderToStaticMarkup(
      React.createElement(
        BagProvider,
        { storageKey: 'azure-concept-shortlist' },
        React.createElement(Consumer),
      ),
    );
    assert.deepEqual(reads, ['azure-concept-shortlist']);
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
    if (previousStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = previousStorage;
    await vite.close();
  }
});
