import { once } from 'node:events';
import http from 'node:http';
import { createStaticServer } from '../../scripts/serve.mjs';

/**
 * Creates and starts a test HTTP server on an ephemeral port.
 * @param {object} options
 * @param {boolean} [options.preview=true] - Whether to serve from dist/ or src/
 * @returns {Promise<{ origin: string, fetchText: (path: string) => Promise<string>, fetchResponse: (path: string, init?: RequestInit) => Promise<Response>, close: () => Promise<void> }>}
 */
export async function startTestServer({ preview = true } = {}) {
  const server = createStaticServer({ preview });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');

  const port = server.address().port;
  const origin = `http://127.0.0.1:${port}`;

  return {
    origin,
    port,
    server,
    async fetchResponse(path = '/', init) {
      const url = path.startsWith('http')
        ? path
        : `${origin}${path.startsWith('/') ? '' : '/'}${path}`;
      return fetch(url, init);
    },
    async fetchText(path = '/') {
      const res = await this.fetchResponse(path);
      if (!res.ok) {
        throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`);
      }
      return res.text();
    },
    async fetchBuffer(path = '/') {
      const res = await this.fetchResponse(path);
      if (!res.ok) {
        throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`);
      }
      return Buffer.from(await res.arrayBuffer());
    },
    async close() {
      return new Promise((resolve) => server.close(resolve));
    },
  };
}
