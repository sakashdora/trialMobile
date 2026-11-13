/**
 * The AZURE mark: a symmetric peak cut from two facets of titanium, with a single lens
 * sitting in the arch. One drawing, used by the header, footer, loader and favicon.
 *
 * `shine` fills the mark with a gradient the loader sweeps a highlight across.
 */
export function AzureGlyph({ className, shine = false }: { className?: string; shine?: boolean }) {
  const fill = shine ? 'url(#azure-shine)' : 'currentColor';
  return (
    <svg viewBox="0 0 40 36" aria-hidden="true" focusable="false" className={className}>
      {shine && (
        <defs>
          <linearGradient id="azure-shine" gradientUnits="userSpaceOnUse" x1="-30" y1="0" x2="-10" y2="0">
            <stop offset="0" stopColor="#ece6df" stopOpacity="0.5" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="1" stopColor="#ece6df" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      )}
      <path d="M20 1 1 35h11.5L20 20.5Z" fill={fill} />
      <path d="M20 1l19 34H27.5L20 20.5Z" fill={fill} opacity="0.7" />
      <circle cx="20" cy="30.6" r="2.7" fill={fill} />
    </svg>
  );
}

export function BrandMark({ size = 'md' }: { size?: 'md' | 'lg' }) {
  return (
    <a className={`brand brand-${size}`} href="#home" aria-label="AZURE Smartphones home">
      <AzureGlyph className="brand-glyph" />
      <span className="brand-word">AZURE</span>
    </a>
  );
}
