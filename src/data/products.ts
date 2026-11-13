import { ProductSpec } from '../types/product';

export const flagshipPhones: ProductSpec[] = [
  {
    id: 'pro',
    name: 'AZURE One Pro',
    tagline: 'THE ULTIMATE AZURE — BUILT BEYOND LIMITS',
    badge: 'Flagship',
    category: 'handset',
    startingPrice: 69999,
    currency: '₹',
    image: '/assets/images/products/azure-pro.png',
    description:
      'Sculpted grade-5 aerospace titanium chassis, ProVision periscope optics, and TSMC 3nm A19 Ultra silicon. Designed to deliver uncompromising speed and timeless elegance.',
    finishes: [
      {
        name: 'Cosmic Azure',
        colorHex: '#38bdf8',
        image: '/assets/images/products/azure-pro.png',
      },
      {
        name: 'Natural Titanium',
        colorHex: '#9a9895',
        image: '/assets/images/products/azure-pro.png',
      },
      {
        name: 'Desert Titanium',
        colorHex: '#c5a98d',
        image: '/assets/images/products/azure-pro.png',
      },
      {
        name: 'White Titanium',
        colorHex: '#f2f2f2',
        image: '/assets/images/products/azure-pro.png',
      },
      {
        name: 'Black Titanium',
        colorHex: '#282828',
        image: '/assets/images/products/azure-pro.png',
      },
    ],
    specs: {
      Display: '6.7″ LTPO OLED ProMotion (1–120Hz, 3,000 nits peak)',
      Chip: 'A19 Ultra (TSMC 3nm N3P, 18.6B transistors, 39 TOPS Neural Engine)',
      Camera: '48MP ProVision Periscope (5x optical zoom, Tetraprism 3D glass, OIS gen-2)',
      Material: 'Grade-5 Aerospace Titanium Chassis with Micro-Blasted Ceramic Shield Backplate',
      Battery: 'Up to 33 hours video playback, Qi2 15W wireless charging',
      Ports: 'USB-C Thunderbolt 4 (40 Gbps data throughput)',
    },
    highlights: [
      'Sculpted triple-camera periscope surround with 5x optical reach',
      '6.7″ edge-to-edge LTPO OLED ProMotion with 3,000 nits outdoor peak',
      'Grade-5 aerospace titanium perimeter with contoured micro-radius edges',
      'A19 Ultra TSMC 3nm silicon with 39 TOPS real-time neural intelligence',
    ],
    storageOptions: [
      { size: '256 GB', priceDelta: 0 },
      { size: '512 GB', priceDelta: 10000 },
    ],
    interactiveFeature: '360° Turntable and Exploded Assembly Stage',
  },
  {
    id: 'air',
    name: 'AZURE One Air',
    tagline: 'ULTRALIGHT TITANIUM — A LIGHTER PRESENCE',
    badge: 'Ultralight',
    category: 'handset',
    startingPrice: 59999,
    currency: '₹',
    image: '/assets/images/products/one-air.jpg',
    description:
      'A slim 6.9mm profile crafted from aerospace titanium and satin glass. Featherweight balance with dual-lens cinematic capture and all-day endurance.',
    finishes: [
      {
        name: 'Pearl Silver',
        colorHex: '#d2d4d8',
        image: '/assets/images/products/one-air.jpg',
      },
      {
        name: 'Space Gray',
        colorHex: '#4a4b4d',
        image: '/assets/images/products/one-air.jpg',
      },
      {
        name: 'Cloud Blue',
        colorHex: '#7ca1b4',
        image: '/assets/images/products/one-air.jpg',
      },
    ],
    specs: {
      Display: '6.5″ Super Retina OLED (120Hz refresh, 2,400 nits peak)',
      Chip: 'A19 Standard (TSMC 3nm N3E, 16-Core Neural Engine)',
      Camera: '48MP Dual Camera System (2x optical telephoto crop, 12MP Ultra-Wide)',
      Material: 'Grade-5 Titanium Frame with Satin Matte Glass Back',
      Battery: 'Up to 28 hours video playback, 30W wired fast charge',
      Ports: 'USB-C 3.2 Gen 2 (10 Gbps)',
    },
    highlights: [
      'Ultralight 172g chassis engineered for effortless one-handed ergonomics',
      'Refined vertical dual-camera pill with sapphire lens covers',
      'Luminous Pearl Silver finish with vapor-deposited protective coat',
      'Unified USB-C charging across phone, earbuds, and accessories',
    ],
    storageOptions: [
      { size: '256 GB', priceDelta: 0 },
      { size: '512 GB', priceDelta: 10000 },
    ],
  },
  {
    id: 'one',
    name: 'AZURE One',
    tagline: 'THE EVERYDAY ORIGINAL — ELEVATED PRECISION',
    badge: 'Essential',
    category: 'handset',
    startingPrice: 44999,
    currency: '₹',
    image: '/assets/images/products/one.jpg',
    description:
      'Compact everyday design engineered with recycled aerospace aluminum and an iconic horizontal camera visor. Essential performance elevated to luxury standard.',
    finishes: [
      {
        name: 'Sage',
        colorHex: '#8f9f8d',
        image: '/assets/images/products/one.jpg',
      },
      {
        name: 'Midnight',
        colorHex: '#1e2329',
        image: '/assets/images/products/one.jpg',
      },
      {
        name: 'Starlight',
        colorHex: '#e8e6df',
        image: '/assets/images/products/one.jpg',
      },
    ],
    specs: {
      Display: '6.1″ OLED Dynamic Display (90Hz refresh, 2,000 nits peak)',
      Chip: 'A18 Bionic Neural Processor',
      Camera: '48MP Dual Camera Visor with Cinematic 4K60 HDR',
      Material: '100% Recycled Aerospace Aluminum and Ceramic-Infused Front',
      Battery: 'Up to 24 hours video playback',
      Ports: 'USB-C 3.0',
    },
    highlights: [
      'Compact 6.1-inch form factor that slips effortlessly into any pocket',
      'Iconic horizontal camera visor with flush optical lenses',
      'Quiet, nature-inspired Sage matte finish resisting fingerprint oils',
      'IP68 water and dust resistance up to 6 meters for 30 minutes',
    ],
    storageOptions: [
      { size: '128 GB', priceDelta: 0 },
      { size: '256 GB', priceDelta: 6000 },
    ],
  },
];

export const ecosystemAccessories: ProductSpec[] = [
  {
    id: 'magcharge',
    name: 'AZURE MagCharge 30W',
    tagline: '2-IN-1 MAGNETIC WIRELESS CHARGING DOCK',
    badge: 'Qi2 Wireless',
    category: 'charger',
    startingPrice: 5999,
    currency: '₹',
    image: '/assets/images/products/stand.jpg',
    description:
      'Dual-coil magnetic charging puck and cantilever stand with 15N neodymium latching force and active thermal regulation.',
    finishes: [
      { name: 'Space Black', colorHex: '#1c1c1e' },
      { name: 'Silver', colorHex: '#e5e5ea' },
    ],
    specs: {
      Output: '30W Total (15W Qi2 Fast Wireless + 15W Auxiliary Qi pad)',
      Magnets: '16x N52 Neodymium rare-earth magnetic alignment ring',
      Material: 'CNC Machined Anodized Aerospace Aluminum & Silicone Latch',
      Weight: '240g weighted anti-tip base',
    },
    highlights: [
      '15N magnetic latch holds phone securely in portrait or landscape standby mode',
      'Floating cantilever arm adjusts smoothly through 45-degree tilt range',
      'Simultaneous dual charging for AZURE One and Buds Acoustic',
    ],
  },
  {
    id: 'armorcable',
    name: 'AZURE ArmorCable 240W',
    tagline: 'THUNDERBOLT 4 TITANIUM BRAIDED LIFELINE',
    badge: 'Thunderbolt 4',
    category: 'cable',
    startingPrice: 3999,
    currency: '₹',
    image: '/assets/images/products/power.jpg',
    description:
      '240W Power Delivery 3.1 braided USB-C cable with grade-5 titanium connector housings and 40 Gbps data bandwidth.',
    finishes: [
      { name: 'Obsidian Graphite', colorHex: '#2d2d30' },
      { name: 'Cosmic Blue', colorHex: '#1e3a5f' },
    ],
    specs: {
      Power: '240W EPR (Extended Power Range) 48V / 5A',
      Bandwidth: '40 Gbps (Thunderbolt 4 / USB4 Gen 3x2)',
      Length: '1.8 meters (6 feet)',
      Construction: 'Double-braided ballistic Kevlar core with titanium end-caps',
    },
    highlights: [
      'Rated for 50,000 bend cycles without signal or power attenuation',
      'Supports 8K60 external display output and high-speed ProRes disk tethering',
      'Grade-5 titanium connector hoods with laser-etched AZURE monogram',
    ],
  },
  {
    id: 'shieldcase',
    name: 'AZURE ShieldCase',
    tagline: '600D AEROSPACE ARAMID PROTECTION',
    badge: '600D Aramid',
    category: 'case',
    startingPrice: 4999,
    currency: '₹',
    image: '/assets/images/products/case.jpg',
    description:
      'Real 600D aerospace aramid fiber case with CNC machined titanium camera bezel and 12-foot military drop resilience.',
    finishes: [
      { name: 'Twill Obsidian', colorHex: '#18181b' },
      { name: 'Forged Carbon', colorHex: '#27272a' },
    ],
    specs: {
      Protection: '12ft (3.6m) MIL-STD-810H drop test certified',
      Thickness: '0.85mm ultra-thin skin profile',
      Weight: '14 grams',
      Magnets: 'Integrated MagSafe ring with 12N attachment force',
    },
    highlights: [
      'Bullet-resistant aramid fiber weave provides 5x the strength of steel per weight',
      'Integrated titanium camera ring elevates sapphire lenses off abrasive surfaces',
      'Microfiber suede interior lining prevents micro-abrasions to titanium frame',
    ],
  },
];

export const allProducts: ProductSpec[] = [...flagshipPhones, ...ecosystemAccessories];

export const audioAccessories: ProductSpec[] = [
  {
    id: 'buds',
    name: 'AZURE Buds Acoustic',
    tagline: 'YOUR WORLD. YOUR SOUND.',
    badge: 'Acoustic',
    category: 'audio',
    startingPrice: 6999,
    currency: '₹',
    image: '/assets/images/products/buds.jpg',
    description:
      'High-fidelity wireless earbuds with custom 11mm beryllium acoustic drivers, active noise cancellation, and spatial audio with dynamic head tracking.',
    finishes: [
      { name: 'Graphite', colorHex: '#1c1c1e' },
      { name: 'Silver', colorHex: '#e5e5ea' },
    ],
    specs: {
      Drivers: '11mm Custom Beryllium Acoustic Transducers',
      Battery: 'Up to 30 hours with pebble wireless charging case',
      Connectivity: 'Bluetooth 5.4 with Low Latency LE Audio',
      Resistance: 'IP54 sweat and water resistance',
    },
    highlights: [
      'Active Noise Cancellation with Adaptive Transparency mode',
      'Personalized Spatial Audio with dynamic head tracking',
      'Pebble-shaped graphite wireless charging case with MagCharge alignment',
    ],
  },
];

export const catalogAccessories: ProductSpec[] = [...ecosystemAccessories, ...audioAccessories];

export const productMap: Record<string, ProductSpec> = allProducts.reduce(
  (acc, prod) => {
    acc[prod.id] = prod;
    return acc;
  },
  {} as Record<string, ProductSpec>,
);

export const products = flagshipPhones;
export const phones = ['pro', 'air', 'one'];
export const accessories = ['magcharge', 'armorcable', 'shieldcase'];
