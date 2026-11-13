export interface ComparisonDeviceSpec {
  id: 'pro' | 'air' | 'one';
  name: string;
  shortName: string;
  tagline: string;
  badge: string;
  startingPrice: number;
  formattedPrice: string;
  image: string;
  display: string;
  silicon: string;
  camera: string;
  battery: string;
  materials: string;
  finishes: string;
  storage: string[];
  personality?: string;
  displayConcept?: string;
  cameraConcept?: string;
}

export const PHONE_IDS = ['pro', 'air', 'one'] as const;
export type PhoneId = (typeof PHONE_IDS)[number];

export const comparisonDevices: Record<PhoneId, ComparisonDeviceSpec> = {
  pro: {
    id: 'pro',
    name: 'AZURE One Pro',
    shortName: 'One Pro',
    tagline: 'THE ULTIMATE AZURE — BUILT BEYOND LIMITS',
    badge: 'Flagship',
    startingPrice: 69999,
    formattedPrice: '₹69,999',
    image: '/assets/images/products/azure-pro.png',
    display: '6.7″ LTPO OLED ProMotion (1–120Hz, 3,000 nits peak)',
    silicon: 'A19 Ultra (TSMC 3nm N3P, 18.6B transistors, 39 TOPS)',
    camera: '48MP Triple Periscope (5x optical zoom, Tetraprism 3D glass)',
    battery: 'Up to 33 hours video playback, Qi2 15W wireless charging',
    materials: 'Grade-5 Aerospace Titanium Chassis with Ceramic Shield',
    finishes: 'Cosmic Azure, Natural, Desert, White, Black Titanium',
    storage: ['256 GB', '512 GB'],
    personality: 'Create without holding back',
    displayConcept: '6.7″ LTPO OLED ProMotion (1–120Hz adaptive)',
    cameraConcept: '48MP ProVision Periscope (5x optical reach)',
  },
  air: {
    id: 'air',
    name: 'AZURE One Air',
    shortName: 'One Air',
    tagline: 'ULTRALIGHT TITANIUM — A LIGHTER PRESENCE',
    badge: 'Ultralight',
    startingPrice: 59999,
    formattedPrice: '₹59,999',
    image: '/assets/images/products/one-air.jpg',
    display: '6.5″ Super Retina OLED (120Hz refresh, 2,400 nits peak)',
    silicon: 'A19 Standard (TSMC 3nm N3E, 16-Core Neural Engine)',
    camera: '48MP Dual Camera System (2x optical telephoto crop, 12MP Ultra-Wide)',
    battery: 'Up to 28 hours video playback, 30W wired fast charge',
    materials: 'Grade-5 Titanium Frame with Satin Matte Glass Back',
    finishes: 'Pearl Silver, Space Gray, Cloud Blue',
    storage: ['256 GB', '512 GB'],
    personality: 'Less to carry. More to explore.',
    displayConcept: '6.5″ Super Retina OLED (120Hz refresh)',
    cameraConcept: '48MP Dual Camera with 2x optical crop',
  },
  one: {
    id: 'one',
    name: 'AZURE One',
    shortName: 'One',
    tagline: 'THE EVERYDAY ORIGINAL — ELEVATED PRECISION',
    badge: 'Essential',
    startingPrice: 44999,
    formattedPrice: '₹44,999',
    image: '/assets/images/products/one.jpg',
    display: '6.1″ OLED Dynamic Display (90Hz refresh, 2,000 nits peak)',
    silicon: 'A18 Bionic Neural Processor',
    camera: '48MP Dual Camera Visor with Cinematic 4K60 HDR',
    battery: 'Up to 24 hours video playback, 20W wired fast charge',
    materials: '100% Recycled Aerospace Aluminum and Ceramic-Infused Front',
    finishes: 'Sage, Midnight, Starlight',
    storage: ['128 GB', '256 GB'],
    personality: 'Everyday, elevated',
    displayConcept: '6.1″ OLED Dynamic Display (90Hz refresh)',
    cameraConcept: '48MP Dual Camera Visor with 4K60 HDR',
  },
};

export interface ComparisonRow {
  label: string;
  getValue: (device: ComparisonDeviceSpec) => string;
}

export const comparisonSpecRows: ComparisonRow[] = [
  {
    label: 'Display',
    getValue: (d) => d.display,
  },
  {
    label: 'Silicon Processor',
    getValue: (d) => d.silicon,
  },
  {
    label: 'Camera Optics',
    getValue: (d) => d.camera,
  },
  {
    label: 'Chassis & Materials',
    getValue: (d) => d.materials,
  },
  {
    label: 'Battery & Charging',
    getValue: (d) => d.battery,
  },
  {
    label: 'Storage Options',
    getValue: (d) => d.storage.join(' / '),
  },
  {
    label: 'Available Finishes',
    getValue: (d) => d.finishes,
  },
  {
    label: 'Starting Price',
    getValue: (d) => d.formattedPrice,
  },
];

/**
 * Deterministic collision avoidance resolver.
 * Ensures the opposite selector auto-switches to an alternate model when collision occurs.
 */
export function resolveCollision(selectedId: PhoneId, collidedId: PhoneId): PhoneId {
  if (selectedId !== collidedId) return collidedId;
  return PHONE_IDS.find((id) => id !== selectedId) || (selectedId === 'pro' ? 'air' : 'pro');
}

/**
 * Returns pair comparison data with collision avoidance applied.
 */
export function getComparison(
  leftId: PhoneId,
  rightId: PhoneId,
): { left: ComparisonDeviceSpec; right: ComparisonDeviceSpec } {
  const resolvedRight = leftId === rightId ? resolveCollision(leftId, rightId) : rightId;
  return {
    left: comparisonDevices[leftId],
    right: comparisonDevices[resolvedRight],
  };
}
