import { chromium } from 'playwright';
import fs from 'node:fs';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  
  // Desktop 1440x900
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });

  await page.screenshot({ path: 'd:/AZURE/azure-mobile/screenshot-desktop-hero.png' });

  // Scroll to collection
  const collection = page.locator('#collection');
  await collection.scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'd:/AZURE/azure-mobile/screenshot-desktop-collection.png' });

  // Scroll to architecture
  const architecture = page.locator('#architecture');
  await architecture.scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'd:/AZURE/azure-mobile/screenshot-desktop-architecture.png' });

  // Scroll to accessories & compare
  const compare = page.locator('#compare');
  await compare.scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'd:/AZURE/azure-mobile/screenshot-desktop-compare.png' });

  // Click on first phone card to open modal
  const firstCard = page.locator('.phone-card button.product-visual-button').first();
  await firstCard.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'd:/AZURE/azure-mobile/screenshot-desktop-modal.png' });

  // Mobile 390x844
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  await mobilePage.screenshot({ path: 'd:/AZURE/azure-mobile/screenshot-mobile-hero.png' });

  const mobileColl = mobilePage.locator('#collection');
  await mobileColl.scrollIntoViewIfNeeded();
  await mobilePage.screenshot({ path: 'd:/AZURE/azure-mobile/screenshot-mobile-collection.png' });

  await browser.close();
  console.log('Screenshots captured successfully');
}

capture().catch((e) => {
  console.error(e);
  process.exit(1);
});

