import puppeteer from 'puppeteer-core';
import path from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0' });

  // 1. Hero
  await page.screenshot({ path: 'd:/AZURE/azure-mobile/shot-desktop-hero.png' });

  // 2. Collection
  const collectionEl = await page.$('#collection');
  if (collectionEl) {
    await collectionEl.scrollIntoView();
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: 'd:/AZURE/azure-mobile/shot-desktop-collection.png' });
  }

  // 3. Architecture
  const archEl = await page.$('#architecture');
  if (archEl) {
    await archEl.scrollIntoView();
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: 'd:/AZURE/azure-mobile/shot-desktop-architecture.png' });
  }

  // 4. Comparison
  const compEl = await page.$('#compare');
  if (compEl) {
    await compEl.scrollIntoView();
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: 'd:/AZURE/azure-mobile/shot-desktop-compare.png' });
  }

  // Mobile viewport
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'd:/AZURE/azure-mobile/shot-mobile-hero.png' });

  const mCol = await page.$('#collection');
  if (mCol) {
    await mCol.scrollIntoView();
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: 'd:/AZURE/azure-mobile/shot-mobile-collection.png' });
  }

  await browser.close();
  console.log('ALL SCREENSHOTS CAPTURED');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

