import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { createServer } from 'vite';

test('BagContext & formatPrice Resilience and Boundary Enforcement', async (t) => {
  const vite = await createServer({
    root: process.cwd(),
    server: { middlewareMode: true },
    appType: 'custom',
  });

  const { BagProvider, useBag } = await vite.ssrLoadModule('/src/context/BagContext.tsx');
  const { formatPrice } = await vite.ssrLoadModule('/src/lib/utils.ts');

  t.after(async () => {
    await vite.close();
  });

  await t.test('formatPrice handles edge cases, nulls, NaNs, and infinities gracefully', () => {
    assert.equal(formatPrice(undefined), '₹0');
    assert.equal(formatPrice(null), '₹0');
    assert.equal(formatPrice(NaN), '₹0');
    assert.equal(formatPrice(Infinity), '₹0');
    assert.equal(formatPrice(-Infinity), '₹0');
    assert.equal(formatPrice(0), '₹0');
    assert.equal(formatPrice(69999), '₹69,999');
    assert.equal(formatPrice(129999, '$'), '$1,29,999');
  });

  await t.test('useBag throws descriptive error when accessed outside BagProvider', () => {
    function BadConsumer() {
      useBag();
      return null;
    }
    assert.throws(
      () => {
        ReactDOMServer.renderToString(React.createElement(BadConsumer));
      },
      {
        message: 'useBag must be used within a BagProvider',
      },
    );
  });

  await t.test(
    'BagContext filters corrupt localStorage (nulls, non-objects, invalid schema, negative/non-numeric prices)',
    () => {
      const storage = new Map();
      globalThis.window = {};
      globalThis.localStorage = {
        getItem: (k) => storage.get(k) || null,
        setItem: (k, v) => storage.set(k, String(v)),
        removeItem: (k) => storage.delete(k),
        clear: () => storage.clear(),
      };

      const corruptEntries = [
        null,
        undefined,
        'not-an-object',
        12345,
        {},
        { id: 'missing-fields' },
        {
          id: '1',
          model: 'pro',
          name: 'Pro',
          finish: 'natural',
          price: 'invalid-string',
          image: '/img.png',
        },
        { id: '2', model: 'pro', name: 'Pro', finish: 'natural', price: NaN, image: '/img.png' },
        { id: '3', model: 'pro', name: 'Pro', finish: 'natural', price: -500, image: '/img.png' },
        { id: '4', model: 'pro', name: 'Pro', finish: 'natural', price: 69999, image: '/img.png' },
      ];
      storage.set('azure-preview-bag', JSON.stringify(corruptEntries));

      let bagState;
      function Consumer() {
        bagState = useBag();
        return React.createElement('div', null, formatPrice(bagState.totalPrice));
      }

      const html = ReactDOMServer.renderToString(
        React.createElement(BagProvider, null, React.createElement(Consumer)),
      );

      assert.ok(html.includes('₹69,999'));
      assert.equal(bagState.items.length, 1);
      assert.equal(bagState.items[0].id, '4');
      assert.equal(bagState.items[0].price, 69999);
      assert.equal(typeof bagState.totalPrice, 'number');
      assert.equal(bagState.totalPrice, 69999);
      assert.equal(bagState.itemCount, 1);
    },
  );

  await t.test('BagContext enforces 20 items cap on initial localStorage load', () => {
    const storage = new Map();
    globalThis.window = {};
    globalThis.localStorage = {
      getItem: (k) => storage.get(k) || null,
      setItem: (k, v) => storage.set(k, String(v)),
      removeItem: (k) => storage.delete(k),
      clear: () => storage.clear(),
    };

    const oversized = [];
    for (let i = 0; i < 30; i++) {
      oversized.push({
        id: `item-${i}`,
        model: 'pro',
        name: `Azure Pro ${i}`,
        finish: 'natural',
        price: 1000,
        image: '/img.png',
      });
    }
    storage.set('azure-preview-bag', JSON.stringify(oversized));

    let bagState;
    function Consumer() {
      bagState = useBag();
      return null;
    }

    ReactDOMServer.renderToString(
      React.createElement(BagProvider, null, React.createElement(Consumer)),
    );

    assert.equal(bagState.items.length, 20, 'Oversized bag must be sliced to 20 items maximum');
    assert.equal(bagState.itemCount, 20);
    assert.equal(bagState.totalPrice, 20000);
  });
});
