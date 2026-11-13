import puppeteer from 'puppeteer-core';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0' });
  
  // Wait 3.5 seconds for loader animation to finish
  await new Promise(r => setTimeout(r, 3500));

  const comp = await page.$('#compare');
  if (comp) {
    await comp.scrollIntoView();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'd:/AZURE/azure-mobile/shot-current-compare.png' });
  }

  const foot = await page.$('footer');
  if (foot) {
    await foot.scrollIntoView();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'd:/AZURE/azure-mobile/shot-current-footer.png' });
  }

  // Mobile
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 3500));

  const compM = await page.$('#compare');
  if (compM) {
    await compM.scrollIntoView();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'd:/AZURE/azure-mobile/shot-mobile-compare.png' });
  }
  const footM = await page.$('footer');
  if (footM) {
    await footM.scrollIntoView();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'd:/AZURE/azure-mobile/shot-mobile-footer.png' });
  }

  await browser.close();
  console.log('CAPTURED_WAIT');
}
run().catch(e => {
  console.error(e);
  process.exit(1);
});
