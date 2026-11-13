export interface ProductFinish {
  name: string;
  colorHex: string;
  image?: string;
}

export interface StorageOption {
  size: string;
  priceDelta: number;
}

export interface ProductSpec {
  id: string;
  name: string;
  tagline: string;
  badge?: string;
  category:
    | 'handset'
    | 'charger'
    | 'cable'
    | 'case'
    | 'audio'
    | 'phone'
    | 'charging'
    | 'protection';
  startingPrice: number;
  currency: string;
  image: string;
  description: string;
  finishes: ProductFinish[];
  specs: Record<string, string>;
  highlights: string[];
  storageOptions?: StorageOption[];
  interactiveFeature?: string;
}

export interface ComparisonDevice {
  id: string;
  name: string;
  tagline: string;
  startingPrice: number;
  image: string;
  display: string;
  chip: string;
  camera: string;
  battery: string;
  finish: string;
  storage: string;
}
