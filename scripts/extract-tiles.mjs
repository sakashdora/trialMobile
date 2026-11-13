import { createCanvas, loadImage } from 'canvas';
import fs from 'node:fs';
import path from 'node:path';

async function extract() {
  const outDir = 'd:/AZURE/azure-mobile/public/assets/collection-v3/items';
  fs.mkdirSync(outDir, { recursive: true });

  // 1. Phones: 1619 x 971 -> 5 cols x 2 rows
  const phonesImg = await loadImage('d:/AZURE/azure-mobile/public/assets/collection-v3/phones.png');
  const pW = phonesImg.width / 5; // 323.8
  const pH = phonesImg.height / 2; // 485.5

  const phoneIds = [
    'one', 'air', 'pro', 'max', 'mini',
    'plus', 'studio', 'edge', 'fold', 'flip'
  ];

  for (let i = 0; i < phoneIds.length; i++) {
    const col = i % 5;
    const row = Math.floor(i / 5);
    const canvas = createCanvas(Math.round(pW), Math.round(pH));
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      phonesImg,
      col * pW, row * pH, pW, pH,
      0, 0, canvas.width, canvas.height
    );
    const buf = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(outDir, `${phoneIds[i]}.png`), buf);
  }
  console.log('Extracted 10 phones successfully');

  // 2. Accessories: 1254 x 1254 -> 2 cols x 2 rows
  const accImg = await loadImage('d:/AZURE/azure-mobile/public/assets/collection-v3/accessories.png');
  const aW = accImg.width / 2;
  const aH = accImg.height / 2;
  const accIds = ['case', 'charger', 'stand', 'earbuds'];

  for (let i = 0; i < accIds.length; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const canvas = createCanvas(Math.round(aW), Math.round(aH));
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      accImg,
      col * aW, row * aH, aW, aH,
      0, 0, canvas.width, canvas.height
    );
    const buf = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(outDir, `${accIds[i]}.png`), buf);
  }
  console.log('Extracted 4 accessories successfully');
}

extract().catch((err) => {
  console.error(err);
  process.exit(1);
});

