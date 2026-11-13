export interface Concept {
  id: string;
  name: string;
  category: 'phone' | 'accessory';
  kind: string;
  description: string;
  finish: string;
  color: string;
  focus: string;
  size: string;
  material: string;
  tile: number;
}
export const models: Concept[] = [
  {
    id: 'one',
    name: 'One',
    kind: 'Everyday',
    description: 'The everyday original, with a clean silver finish and a familiar shape.',
    finish: 'Silver',
    color: '#b8b8b4',
    focus: 'Everyday use',
    size: 'Medium',
    material: 'Satin metal',
    tile: 0,
  },
  {
    id: 'air',
    name: 'One Air',
    kind: 'Everyday',
    description: 'A slimmer silhouette in soft ivory, made for a lighter-looking daily carry.',
    finish: 'Ivory',
    color: '#ded4c5',
    focus: 'Lightness',
    size: 'Medium',
    material: 'Soft satin',
    tile: 1,
  },
  {
    id: 'pro',
    name: 'One Pro',
    kind: 'Pro',
    description:
      'A camera-first design study with a graphite finish and a distinctive triple-lens surround.',
    finish: 'Graphite',
    color: '#777970',
    focus: 'Photography',
    size: 'Large',
    material: 'Brushed titanium',
    tile: 2,
  },
  {
    id: 'max',
    name: 'One Pro Max',
    kind: 'Pro',
    description: 'The larger Pro concept, with more screen space and a warm champagne finish.',
    finish: 'Champagne',
    color: '#c6b397',
    focus: 'Screen space',
    size: 'Extra large',
    material: 'Brushed titanium',
    tile: 3,
  },
  {
    id: 'mini',
    name: 'One Mini',
    kind: 'Compact',
    description:
      'A smaller format with soft blue tones, for those who prefer less in their pocket.',
    finish: 'Mist blue',
    color: '#93adb8',
    focus: 'One-handed use',
    size: 'Small',
    material: 'Satin metal',
    tile: 4,
  },
  {
    id: 'plus',
    name: 'One Plus',
    kind: 'Everyday',
    description: 'A generous everyday format, paired with a muted sage finish.',
    finish: 'Sage',
    color: '#929d87',
    focus: 'Everyday screen space',
    size: 'Large',
    material: 'Matte metal',
    tile: 5,
  },
  {
    id: 'studio',
    name: 'One Studio',
    kind: 'Pro',
    description: 'A creative-focused concept with a horizontal camera bar and charcoal body.',
    finish: 'Charcoal',
    color: '#575957',
    focus: 'Creative work',
    size: 'Large',
    material: 'Satin metal',
    tile: 6,
  },
  {
    id: 'edge',
    name: 'One Edge',
    kind: 'Everyday',
    description: 'A narrow silhouette with a gently curved screen and a cool silver-blue frame.',
    finish: 'Ice blue',
    color: '#b8cbd0',
    focus: 'Edge-to-edge viewing',
    size: 'Medium',
    material: 'Polished metal',
    tile: 7,
  },
  {
    id: 'fold',
    name: 'One Fold',
    kind: 'Folding',
    description: 'A book-style folding study that opens into a wider workspace.',
    finish: 'Midnight',
    color: '#29363f',
    focus: 'Flexible workspace',
    size: 'Book fold',
    material: 'Hinged metal',
    tile: 8,
  },
  {
    id: 'flip',
    name: 'One Flip',
    kind: 'Folding',
    description: 'A compact clamshell concept that folds down into a small, warm-toned square.',
    finish: 'Sand',
    color: '#c6b397',
    focus: 'Pocketable design',
    size: 'Clamshell fold',
    material: 'Hinged metal',
    tile: 9,
  },
].map((item) => ({ ...item, category: 'phone' as const }));
export const accessories: Concept[] = [
  {
    id: 'case',
    name: 'Everyday cases',
    kind: 'Cases',
    description:
      'A tactile sand-toned case concept. Model fit and material specifications are not yet confirmed.',
    finish: 'Sand',
    color: '#bc9e79',
    focus: 'Protection',
    size: 'Model-specific',
    material: 'Leather-look study',
    tile: 0,
  },
  {
    id: 'charger',
    name: 'Charging essentials',
    kind: 'Charging',
    description:
      'A compact wall-charger and braided cable concept. Plug type and charging standards are to be confirmed.',
    finish: 'Ivory',
    color: '#ded4c5',
    focus: 'Everyday charging',
    size: 'Wall charger + cable',
    material: 'Matte shell / braided cable',
    tile: 1,
  },
  {
    id: 'wireless',
    name: 'Wireless charging',
    kind: 'Charging',
    description:
      'A circular charging-stand concept in brushed champagne. Device compatibility is to be confirmed.',
    finish: 'Champagne',
    color: '#c6b397',
    focus: 'Desk charging',
    size: 'Desktop stand',
    material: 'Brushed metal',
    tile: 2,
  },
  {
    id: 'audio',
    name: 'Audio & accessories',
    kind: 'Audio',
    description:
      'A pair of cream earbuds and a compact charging-case concept. Audio and battery specifications are not yet confirmed.',
    finish: 'Cream',
    color: '#d8cfbd',
    focus: 'Listening',
    size: 'Earbuds + case',
    material: 'Matte shell',
    tile: 3,
  },
].map((item) => ({ ...item, category: 'accessory' as const }));
export const catalog = [...models, ...accessories];
