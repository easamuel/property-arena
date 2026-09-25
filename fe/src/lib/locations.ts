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
  adamawa: 'Adamawa',
  yola: 'Adamawa',
  bauchi: 'Bauchi',
  benue: 'Benue',
  makurdi: 'Benue',
  ebonyi: 'Ebonyi',
  abakaliki: 'Ebonyi',
  gombe: 'Gombe',
  jigawa: 'Jigawa',
  dutse: 'Jigawa',
  katsina: 'Katsina',
  kebbi: 'Kebbi',
  'birnin kebbi': 'Kebbi',
  nasarawa: 'Nasarawa',
  lafia: 'Nasarawa',
  karu: 'Nasarawa',
  niger: 'Niger',
  minna: 'Niger',
  suleja: 'Niger',
  taraba: 'Taraba',
  jalingo: 'Taraba',
  yobe: 'Yobe',
  damaturu: 'Yobe',
  zamfara: 'Zamfara',
  gusau: 'Zamfara',
};

type AreaIndex = { state: string; area: string };

let areaIndex: Map<string, AreaIndex> | null = null;

function getAreaIndex() {
  const expected = NIGERIA_GUIDES.reduce((n, g) => n + g.areas.length, 0);
  if (areaIndex && areaIndex.size >= expected) return areaIndex;
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
  if (!trimmed || trimmed.toLowerCase() === 'nigeria' || trimmed.toLowerCase() === 'all') {
    return { state: 'Nigeria', label: 'Nigeria' };
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
  const kind = tabToSeoKind(tab);
  const trimmed = locationRaw.trim();
  const nationwide = !trimmed || trimmed.toLowerCase() === 'nigeria' || trimmed.toLowerCase() === 'all';

  // Empty / Nigeria → nationwide /properties (not Lagos-only SEO path)
  if (nationwide || kind === 'commercial') {
    const params = new URLSearchParams();
    if (kind === 'commercial') {
      params.set('propertyType', propertyType || 'commercial');
    } else {
      if (tab === 'Buy') params.set('purpose', 'sale');
      else if (tab === 'Rent') params.set('purpose', 'rent');
      else if (tab === 'Short Let') params.set('purpose', 'shortlet');
      else if (tab === 'Land') {
        params.set('purpose', 'sale');
        params.set('propertyType', propertyType || 'land');
      }
      if (propertyType && tab !== 'Land') params.set('propertyType', propertyType);
    }
    if (!nationwide) params.set('location', trimmed);
    else params.set('location', 'Nigeria');
    return `/properties?${params.toString()}`;
  }

  const place = resolveSearchLocation(trimmed);
  // commercial already returned above; kind is a real SEO path kind here
  const seoKind = kind as SeoListingKind;
  let path = buildSeoPath(seoKind, place.state, place.area);
  if (propertyType && seoKind !== 'land') {
    const pt = propertyType.toLowerCase();
    if (pt && pt !== 'land' && pt !== 'commercial') {
      path += `?propertyType=${encodeURIComponent(pt)}`;
    }
  }
  return path;
}

import { MEDIA } from '@/data/media';

export const POPULAR_DESTINATIONS = [
  {
    name: 'Lekki',
    state: 'Lagos',
    blurb: 'Estates · Expressway · New builds',
    img: MEDIA.duplex,
  },
  {
    name: 'Ikoyi',
    state: 'Lagos',
    blurb: 'Luxury · Embassies · Waterfront',
    img: MEDIA.pool,
  },
  {
    name: 'Gwarinpa',
    state: 'Abuja',
    blurb: 'Family estates · FCT living',
    img: MEDIA.bungalow,
  },
  {
    name: 'Ajah',
    state: 'Lagos',
    blurb: 'Duplexes · Land · Growth corridor',
    img: MEDIA.terrace,
  },
  {
    name: 'Ikeja',
    state: 'Lagos',
    blurb: 'GRA · Malls · Airport access',
    img: MEDIA.apartment,
  },
] as const;

/** Nationwide states for SEO facet chips on for-sale / listings. */
export const NIGERIA_STATES = [
  'Abia',
  'Abuja',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
] as const;

export const SEO_BEDROOM_FACETS = [1, 2, 3, 4, 5, 6] as const;

export const SEO_TYPE_FACETS = [
  'Flats / Apartments',
  'House',
  'Duplex',
  'Mini Flat',
  'Self Contain',
  'Penthouse',
  'Studio Apartment',
  'Boys Quarters',
  'Shared Apartment',
  'Land',
  'Commercial Property',
  'Co Working Space',
] as const;

export const SEO_TAG_FACETS = [
  'Serviced Properties',
  'Furnished Properties',
  'Newly Built Properties',
  'Cheap Properties',
  'Luxury Properties',
] as const;

/** Primary states shown first in refine chips (NPC-style). */
export const SEO_STATE_FACETS = [
  'Abuja',
  'Akwa Ibom',
  'Cross River',
  'Enugu',
  'Imo',
  'Kaduna',
  'Lagos',
  'Ogun',
  'Oyo',
  'Rivers',
] as const;

export type PlaceSuggestion = {
  label: string;
  hint: string;
  state: string;
  area?: string;
};

let placeCatalog: PlaceSuggestion[] | null = null;

/** Full searchable catalog: every state + every neighbourhood/area in guides. */
export function getPlaceCatalog(): PlaceSuggestion[] {
  // Rebuild when guide area count grows (HMR / catalog expansion)
  const expected =
    NIGERIA_STATES.length + NIGERIA_GUIDES.reduce((n, g) => n + g.areas.length, 0);
  if (placeCatalog && placeCatalog.length >= expected) return placeCatalog;
  const items: PlaceSuggestion[] = NIGERIA_STATES.map((state) => ({
    label: state,
    hint: 'State',
    state,
  }));
  for (const guide of NIGERIA_GUIDES) {
    for (const a of guide.areas) {
      items.push({
        label: a.name,
        hint: `Area · ${guide.location}`,
        state: guide.location,
        area: a.name,
      });
    }
  }
  placeCatalog = items;
  return items;
}

/** Typeahead places for Google-style search — works even with zero listings. */
export function searchPlaces(query: string, limit = 8): PlaceSuggestion[] {
  const needle = query.trim().toLowerCase();
  const all = getPlaceCatalog();
  if (!needle) {
    return [
      ...SEO_STATE_FACETS.map((s) => ({ label: s, hint: 'State', state: s })),
      ...all.filter((p) => p.area).slice(0, 4),
    ].slice(0, limit);
  }
  const scored = all
    .map((p) => {
      const label = p.label.toLowerCase();
      let score = 0;
      if (label === needle) score = 100;
      else if (label.startsWith(needle)) score = 80;
      else if (label.includes(needle)) score = 50;
      else if (p.state.toLowerCase().includes(needle)) score = 20;
      else if (p.hint.toLowerCase().includes(needle)) score = 10;
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.p.label.localeCompare(b.p.label));

  const seen = new Set<string>();
  const out: PlaceSuggestion[] = [];
  for (const { p } of scored) {
    const key = `${p.state}|${p.area || ''}|${p.label}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
    if (out.length >= limit) break;
  }
  return out;
}
