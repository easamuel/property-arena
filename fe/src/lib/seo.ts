/** Canonical SEO paths for location browse (NPC/PropertyPro-style, our naming). */

export type SeoListingKind = 'for-sale' | 'for-rent' | 'shortlet' | 'land';

export const SEO_KIND_TO_FILTERS: Record<
  SeoListingKind,
  { purpose: string; propertyType?: string; label: string }
> = {
  'for-sale': { purpose: 'sale', label: 'for Sale' },
  'for-rent': { purpose: 'rent', label: 'for Rent' },
  shortlet: { purpose: 'shortlet', label: 'Short Let' },
  land: { purpose: 'sale', propertyType: 'land', label: 'Land for Sale' },
};

export function slugToLabel(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function labelToSlug(label: string) {
  return label
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function buildSeoPath(kind: SeoListingKind, state: string, area?: string) {
  const base = `/${kind}/in/${labelToSlug(state)}`;
  return area ? `${base}/${labelToSlug(area)}` : base;
}

export function seoPageCopy(kind: SeoListingKind, state: string, area?: string) {
  const place = area ? `${slugToLabel(area)}, ${slugToLabel(state)}` : slugToLabel(state);
  const { label } = SEO_KIND_TO_FILTERS[kind];
  const title = `Property ${label} in ${place}`;
  const description = `Browse verified homes and land ${label.toLowerCase()} in ${place} on PropertyArena.ng. Filter by price, bedrooms and type.`;
  return { title, description, place };
}

/** Top routes to prerender at build time. */
export const PRERENDER_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/help',
  '/neighbourhood',
  '/neighbourhood/lagos',
  '/neighbourhood/lagos/lekki',
  '/neighbourhood/lagos/ikoyi',
  '/neighbourhood/abuja',
  '/neighbourhood/abuja/gwarinpa',
  '/neighbourhood/port-harcourt',
  '/articles',
  '/articles/buying-guide-nigeria',
  '/articles/investment-hotspots',
  '/articles/land-documentation',
  '/articles/market-outlook-2026',
  '/requests',
  '/for-sale/in/lagos',
  '/for-sale/in/lagos/lekki',
  '/for-sale/in/lagos/ikoyi',
  '/for-sale/in/lagos/ajah',
  '/for-sale/in/abuja',
  '/for-sale/in/abuja/gwarinpa',
  '/for-sale/in/rivers',
  '/for-sale/in/rivers/port-harcourt',
  '/for-rent/in/lagos',
  '/for-rent/in/lagos/lekki',
  '/for-rent/in/abuja',
  '/shortlet/in/lagos',
  '/shortlet/in/lagos/lekki',
  '/shortlet/in/abuja',
  '/land/in/lagos',
  '/land/in/abuja',
  '/land/in/delta',
];
