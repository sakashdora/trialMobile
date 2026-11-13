import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { readdir, readFile, stat, access } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const filename = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(filename) : [filename];
    }),
  );
  return nested.flat();
}

test('Vite production build generates clean static assets and adheres to hosting contract', async (t) => {
  // Ensure production build exists
  try {
    await access(path.join(distDir, 'index.html'));
  } catch {
    execSync('npm run build', { cwd: projectRoot, stdio: 'pipe' });
  }

  // 1. Verify dist/index.html exists and contains essential mounting and meta contracts
  const indexHtmlPath = path.join(distDir, 'index.html');
  const indexHtmlStat = await stat(indexHtmlPath);
  assert.ok(indexHtmlStat.isFile(), 'dist/index.html must exist as a file');

  const indexHtml = await readFile(indexHtmlPath, 'utf8');
  assert.ok(indexHtml.includes('id="root"'), 'dist/index.html must contain root mount element');
  assert.ok(indexHtml.includes('AZURE'), 'dist/index.html must include AZURE branding');
  assert.ok(
    indexHtml.includes('data-type="product"'),
    'dist/index.html must declare product page-type',
  );

  // 2. Verify dist/assets contains production JS and CSS bundles
  const distFiles = await walk(distDir);
  const relativeDistFiles = distFiles.map((f) =>
    path.relative(distDir, f).split(path.sep).join('/'),
  );

  const hasJsBundle = relativeDistFiles.some(
    (f) => f.startsWith('assets/index-') && f.endsWith('.js'),
  );
  const hasCssBundle = relativeDistFiles.some(
    (f) => f.startsWith('assets/index-') && f.endsWith('.css'),
  );
  const hasReactVendor = relativeDistFiles.some(
    (f) => f.startsWith('assets/react-vendor-') && f.endsWith('.js'),
  );
  const hasMotionVendor = relativeDistFiles.some(
    (f) => f.startsWith('assets/motion-vendor-') && f.endsWith('.js'),
  );

  assert.ok(hasJsBundle, 'Must contain compiled index JS bundle');
  assert.ok(hasCssBundle, 'Must contain compiled index CSS bundle');
  assert.ok(hasReactVendor, 'Must contain react-vendor chunk');
  assert.ok(hasMotionVendor, 'Must contain motion-vendor chunk');

  // 3. Verify public media assets are preserved in dist/assets
  const requiredAssets = [
    'assets/images/products/azure-pro.png',
    'assets/images/products/one-air.jpg',
    'assets/images/products/one.jpg',
    'assets/images/products/power.jpg',
    'assets/images/products/buds.jpg',
    'assets/images/products/stand.jpg',
    'assets/images/products/case.jpg',
    'assets/images/gallery/gallery-night.jpg',
    'assets/images/gallery/gallery-city.jpg',
    'assets/images/gallery/gallery-landscape.jpg',
    'assets/videos/smartphone-360-dark.webp',
    'assets/videos/smartphone-exploded-dark.webp',
  ];

  for (const asset of requiredAssets) {
    assert.ok(relativeDistFiles.includes(asset), `Missing required asset in dist: ${asset}`);
  }

  // Verify frame sequence counts
  const frames360 = relativeDistFiles.filter(
    (f) => f.startsWith('assets/videos/frames/frame-') && f.endsWith('.jpg'),
  );
  const framesExploded = relativeDistFiles.filter(
    (f) => f.startsWith('assets/videos/exploded/frame-') && f.endsWith('.jpg'),
  );

  assert.equal(frames360.length, 96, 'All 96 360-degree rotation frames must be present');
  assert.equal(framesExploded.length, 64, 'All 64 exploded assembly frames must be present');

  // 4. Test serving dist over HTTP
  await t.test('preview server serves static dist cleanly', async (t) => {
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    };

    const server = createServer(async (req, res) => {
      try {
        const urlPath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
        const filePath = path.join(distDir, urlPath.replace(/^\//, ''));
        const content = await readFile(filePath);
        const ext = path.extname(filePath);
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        res.end(content);
      } catch {
        res.writeHead(404);
        res.end('Not found');
      }
    });

    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    t.after(() => new Promise((resolve) => server.close(resolve)));

    const origin = `http://127.0.0.1:${server.address().port}`;

    // Test root index.html
    const indexRes = await fetch(`${origin}/`);
    assert.equal(indexRes.status, 200);
    const indexBody = await indexRes.text();
    assert.ok(indexBody.includes('id="root"'));

    // Test asset fetch
    const phoneImgRes = await fetch(`${origin}/assets/images/products/azure-pro.png`);
    assert.equal(phoneImgRes.status, 200);
    assert.equal(phoneImgRes.headers.get('content-type'), 'image/png');

    const frameRes = await fetch(`${origin}/assets/videos/frames/frame-0.jpg`);
    assert.equal(frameRes.status, 200);
    assert.equal(frameRes.headers.get('content-type'), 'image/jpeg');

    const notFoundRes = await fetch(`${origin}/non-existent-asset.jpg`);
    assert.equal(notFoundRes.status, 404);
  });
});
