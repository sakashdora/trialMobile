export interface GalleryScene {
  id: string;
  index: number;
  image: string;
  alt: string;
  kicker: string;
  title: string;
  credit: string;
  url: string;
  tabLabel?: string;
  focalLength?: string;
  aperture?: string;
  iso?: string;
  shutter?: string;
  location?: string;
  lens?: string;
}

export interface GalleryPhoto {
  id: string;
  index: number;
  kicker: string;
  title: string;
  location: string;
  lens: string;
  image: string;
  credit: {
    photographer: string;
    source: string;
    url: string;
  };
}
