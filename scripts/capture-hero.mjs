import puppeteer from 'puppeteer-core';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });
  const page = await browser.newPage();
  
  // Desktop
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 3500));
  await page.screenshot({ path: 'd:/AZURE/azure-mobile/shot-hero-new-desktop.png' });

  // Wide desktop (1920x1080)
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 3500));
  await page.screenshot({ path: 'd:/AZURE/azure-mobile/shot-hero-new-wide.png' });

  // Mobile (390x844)
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 3500));
  await page.screenshot({ path: 'd:/AZURE/azure-mobile/shot-hero-new-mobile.png' });

  await browser.close();
  console.log('HERO_CAPTURED');
}
run().catch(e => {
  console.error(e);
  process.exit(1);
});

