import { NIGERIA_GUIDES } from '@/data/nigeria-areas';
import { buildSeoPath, labelToSlug, type SeoListingKind } from '@/lib/seo';

export type ResolvedPlace = {
  state: string;
  area?: string;
  /** Human label for query-string /properties fallbacks */
  label: string;
};

/** State-level aliases (search text → canonical state used in SEO paths). */
const STATE_ALIASES: Record<string, string> = {
  lagos: 'Lagos',
  abuja: 'Abuja',
  fct: 'Abuja',
  'federal capital territory': 'Abuja',
  rivers: 'Rivers',
  'port harcourt': 'Rivers',
  ph: 'Rivers',
  oyo: 'Oyo',
  ibadan: 'Oyo',
  ogun: 'Ogun',
  abeokuta: 'Ogun',
  anambra: 'Anambra',
  enugu: 'Enugu',
  delta: 'Delta',
  asaba: 'Delta',
  warri: 'Delta',
  edo: 'Edo',
  'benin city': 'Edo',
  benin: 'Edo',
  'akwa ibom': 'Akwa Ibom',
  uyo: 'Akwa Ibom',
  'cross river': 'Cross River',
  calabar: 'Cross River',
  imo: 'Imo',
  owerri: 'Imo',
  abia: 'Abia',
  aba: 'Abia',
  kano: 'Kano',
  kaduna: 'Kaduna',
  ondo: 'Ondo',
  akure: 'Ondo',
  osun: 'Osun',
  osogbo: 'Osun',
  ekiti: 'Ekiti',
  'ado-ekiti': 'Ekiti',
  'ado ekiti': 'Ekiti',
  kogi: 'Kogi',
  lokoja: 'Kogi',
  kwara: 'Kwara',
  ilorin: 'Kwara',
  plateau: 'Plateau',
  jos: 'Plateau',
  borno: 'Borno',
  maiduguri: 'Borno',
  sokoto: 'Sokoto',
  bayelsa: 'Bayelsa',
  yenagoa: 'Bayelsa',
};

type AreaIndex = { state: string; area: string };

let areaIndex: Map<string, AreaIndex> | null = null;

function getAreaIndex() {
  if (areaIndex) return areaIndex;
  areaIndex = new Map();
  for (const guide of NIGERIA_GUIDES) {
    const state = guide.location;
    for (const a of guide.areas) {
      const key = a.name.toLowerCase();
      // Prefer first (usually primary) mapping; skip if already set
      if (!areaIndex.has(key)) {
        areaIndex.set(key, { state, area: a.name });
      }
    }
  }
  return areaIndex;
}

/**
 * Resolve free-text search (e.g. "Lekki", "Lekki, Lagos", "Abuja") into
 * canonical state + optional area for SEO listing URLs.
 */
export function resolveSearchLocation(raw: string): ResolvedPlace {
  const trimmed = raw.trim().replace(/\s+/g, ' ');
  if (!trimmed) {
    return { state: 'Lagos', label: 'Lagos' };
  }

  const lower = trimmed.toLowerCase();

  // "Area, State" form
  if (trimmed.includes(',')) {
    const [left, ...rest] = trimmed.split(',').map((s) => s.trim()).filter(Boolean);
    const right = rest.join(', ');
    const stateFromRight = STATE_ALIASES[right.toLowerCase()] || right;
    const areaHit = getAreaIndex().get(left.toLowerCase());
    if (areaHit) {
      return {
        state: areaHit.state,
        area: areaHit.area,
        label: `${areaHit.area}, ${areaHit.state}`,
      };
    }
    return {
      state: stateFromRight,
      area: left,
      label: `${left}, ${stateFromRight}`,
    };
  }

  // Exact state alias
  if (STATE_ALIASES[lower]) {
    const state = STATE_ALIASES[lower];
    return { state, label: state };
  }

  // Exact area name (Lekki, Gwarinpa, …)
  const areaHit = getAreaIndex().get(lower);
  if (areaHit) {
    return {
      state: areaHit.state,
      area: areaHit.area,
      label: `${areaHit.area}, ${areaHit.state}`,
    };
  }

  // Slug-like input
  const asSlug = labelToSlug(trimmed);
  for (const [name, hit] of getAreaIndex()) {
    if (labelToSlug(name) === asSlug) {
      return {
        state: hit.state,
        area: hit.area,
        label: `${hit.area}, ${hit.state}`,
      };
    }
  }

  // Fallback: treat as state/city name
  const titled = trimmed
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
  return { state: titled, label: titled };
}

export type SearchTab = 'Buy' | 'Rent' | 'Land' | 'Short Let' | 'Commercial';

export function tabToSeoKind(tab: SearchTab): SeoListingKind | 'commercial' {
  if (tab === 'Buy') return 'for-sale';
  if (tab === 'Rent') return 'for-rent';
  if (tab === 'Land') return 'land';
  if (tab === 'Short Let') return 'shortlet';
  return 'commercial';
}

/** Build the correct browse URL for a hero/search submission. */
export function buildListingSearchUrl(
  tab: SearchTab,
  locationRaw: string,
  propertyType?: string,
): string {
  const place = resolveSearchLocation(locationRaw || 'Lagos');
  const kind = tabToSeoKind(tab);

  if (kind === 'commercial') {
    const params = new URLSearchParams();
    params.set('propertyType', 'commercial');
    params.set('location', place.label);
    if (propertyType && propertyType.toLowerCase() !== 'commercial') {
      // keep commercial as type; ignore conflicting residential types
    }
    return `/properties?${params.toString()}`;
  }

  let path = buildSeoPath(kind, place.state, place.area);
  if (propertyType && kind !== 'land') {
    const pt = propertyType.toLowerCase();
    if (pt && pt !== 'land' && pt !== 'commercial') {
      path += `?propertyType=${encodeURIComponent(pt)}`;
    }
  }
  return path;
}

export const POPULAR_DESTINATIONS = [
  {
    name: 'Lekki',
    state: 'Lagos',
    blurb: 'Estates · Expressway · New builds',
    img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=700&auto=format&fit=crop',
  },
  {
    name: 'Ikoyi',
    state: 'Lagos',
    blurb: 'Luxury · Embassies · Waterfront',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=700&auto=format&fit=crop',
  },
  {
    name: 'Gwarinpa',
    state: 'Abuja',
    blurb: 'Family estates · FCT living',
    img: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=700&auto=format&fit=crop',
  },
  {
    name: 'Ajah',
    state: 'Lagos',
    blurb: 'Duplexes · Land · Growth corridor',
    img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=700&auto=format&fit=crop',
  },
  {
    name: 'Ikeja',
    state: 'Lagos',
    blurb: 'GRA · Malls · Airport access',
    img: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=700&auto=format&fit=crop',
  },
] as const;
