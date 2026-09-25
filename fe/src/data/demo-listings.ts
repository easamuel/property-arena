import { MEDIA, galleryAt } from '@/data/media';
import { NIGERIA_GUIDES } from '@/data/nigeria-areas';

export type DemoListing = {
  id: string;
  title: string;
  location: string;
  state: string;
  area: string;
  price: number;
  bedroom: string;
  baths: string;
  areaSize: string;
  badge: string;
  agent: string;
  img: string;
  purpose: 'sale' | 'rent' | 'shortlet';
  propertyType: string;
};

const TITLES = [
  'Bedroom Fully Detached Duplex with BQ',
  'Luxury Waterfront Apartment',
  'Contemporary Smart Home Terrace',
  'Bedroom Flat',
  'Serviced Mini Flat',
  'Self Contain Studio',
  'Penthouse with City View',
  'Plot of Land',
  'Commercial Shop Space',
  'Co-Working Desk Suite',
  'Bungalow in Quiet Estate',
  'Semi-Detached Duplex',
];

const AGENTS = [
  'Arena Nest Realty',
  'Prime Nest Realty',
  'UrbanKey Homes',
  'Capital Nest',
  'LandGate Realty',
  'Horizon Estates',
  'TrustPark Agents',
  'GreenKey Properties',
];

const TYPES_CYCLE = [
  'house',
  'flats or apartments',
  'house',
  'flats or apartments',
  'flats or apartments',
  'flats or apartments',
  'flats or apartments',
  'land',
  'commercial property',
  'co-working space',
  'house',
  'house',
];

/** Build a large nationwide demo catalog from every guide area (SEO-friendly coverage). */
function buildCatalog(): DemoListing[] {
  const out: DemoListing[] = [];
  let i = 0;
  const purposesPerArea: Array<'sale' | 'rent' | 'shortlet'> = ['sale', 'rent', 'shortlet'];

  for (const guide of NIGERIA_GUIDES) {
    // Dense coverage for SEO: all Lagos/Abuja areas; up to 10 elsewhere
    const cap =
      guide.location === 'Lagos' || guide.location === 'Abuja'
        ? guide.areas.length
        : guide.location === 'Rivers' ||
            guide.location === 'Oyo' ||
            guide.location === 'Ogun' ||
            guide.location === 'Cross River'
          ? Math.min(guide.areas.length, 12)
          : Math.min(guide.areas.length, 8);
    const picks = guide.areas.slice(0, cap);
    for (const a of picks) {
      // Every area gets sale + rent + shortlet so SEO purpose pages never look empty
      for (const purpose of purposesPerArea) {
        const type = TYPES_CYCLE[i % TYPES_CYCLE.length];
        const beds =
          type === 'land' || type.includes('commercial') || type.includes('co-working')
            ? '—'
            : String((i % 5) + 1);
        const priceBase =
          purpose === 'rent'
            ? 800000 + (i % 20) * 150000
            : purpose === 'shortlet'
              ? 45000 + (i % 15) * 8000
              : type === 'land'
                ? 8000000 + (i % 30) * 2500000
                : 25000000 + (i % 40) * 7500000;
        const titleBit = TITLES[i % TITLES.length];
        const purposeTag =
          purpose === 'shortlet' ? 'Short Let' : purpose === 'rent' ? 'for Rent' : 'for Sale';
        const title =
          beds !== '—' && titleBit.includes('Bedroom')
            ? `${beds} ${titleBit} — ${a.name}`
            : `${titleBit} — ${a.name}`;
        out.push({
          id: `demo-${guide.location.toLowerCase().replace(/\s+/g, '-')}-${purpose}-${i}`,
          title: purpose === 'shortlet' && !title.toLowerCase().includes('short')
            ? `${beds !== '—' ? `${beds} Bedroom home` : titleBit} Short Let — ${a.name}`
            : title.includes(a.name)
              ? title
              : `${title} (${purposeTag})`,
          location: `${a.name}, ${guide.location}`,
          state: guide.location,
          area: a.name,
          price: priceBase,
          bedroom: beds,
          baths: beds === '—' ? '—' : String(Math.max(1, Number(beds) - (i % 2))),
          areaSize:
            type === 'land' ? `${300 + (i % 10) * 50} sqm` : `${120 + (i % 8) * 40} sqm`,
          badge: i % 7 === 0 ? 'FEATURED' : i % 5 === 0 ? 'VERIFIED' : 'LISTED',
          agent: AGENTS[i % AGENTS.length],
          img:
            type === 'land'
              ? MEDIA.land
              : type.includes('commercial') || type.includes('co-working')
                ? MEDIA.office
                : galleryAt(i),
          purpose,
          propertyType: type,
        });
        i += 1;
      }
    }
  }
  return out;
}

export const DEMO_LISTINGS: DemoListing[] = buildCatalog();

export function listingMatchesLocation(listingLocation: string, locationQ: string): boolean {
  const q = (locationQ || '').trim().toLowerCase();
  if (!q || q === 'nigeria' || q === 'all') return true;
  const blob = listingLocation.toLowerCase();
  if (blob.includes(q)) return true;
  if (q.includes(',')) {
    const [left, ...rest] = q.split(',').map((s) => s.trim()).filter(Boolean);
    const right = rest.join(', ');
    // Area pages ("Gbagada, Lagos"): require the area name so we don't dump all Lagos listings
    if (left && right) return blob.includes(left);
    return Boolean((left && blob.includes(left)) || (right && blob.includes(right)));
  }
  const tokens = q.split(/\s+/).filter((t) => t.length > 2);
  if (tokens.length > 1) return tokens.every((t) => blob.includes(t));
  return tokens.some((t) => blob.includes(t));
}

export function filterDemoListings(opts: {
  location?: string;
  purpose?: string;
  propertyType?: string;
  bedroom?: string;
  search?: string;
  limit?: number;
}): DemoListing[] {
  const purpose = (opts.purpose || '').toLowerCase();
  const type = (opts.propertyType || '').toLowerCase();
  const beds = (opts.bedroom || '').replace(/\D/g, '');
  const search = (opts.search || '').trim().toLowerCase();

  let rows = DEMO_LISTINGS.filter((d) => listingMatchesLocation(d.location, opts.location || ''));

  if (purpose && purpose !== 'all') {
    const p = purpose === 'lease' ? 'rent' : purpose;
    rows = rows.filter((d) => d.purpose === p);
  }
  if (type) {
    rows = rows.filter((d) => {
      const dt = d.propertyType.toLowerCase();
      if (type.includes('land')) return dt === 'land';
      if (type.includes('commercial')) return dt.includes('commercial');
      if (type.includes('co-working') || type.includes('coworking')) return dt.includes('co-working');
      if (type.includes('flat') || type.includes('apartment')) return dt.includes('flat');
      if (type.includes('house') || type.includes('duplex') || type.includes('bungalow') || type.includes('terrace')) {
        return dt === 'house';
      }
      return dt.includes(type) || type.includes(dt);
    });
  }
  if (beds) {
    rows = rows.filter((d) => d.bedroom !== '—' && Number(d.bedroom) >= Number(beds));
  }
  if (search) {
    rows = rows.filter((d) =>
      `${d.title} ${d.location} ${d.propertyType}`.toLowerCase().includes(search),
    );
  }
  return rows.slice(0, opts.limit ?? 40);
}

export function getDemoListingById(id: string): DemoListing | undefined {
  if (!id) return undefined;
  return DEMO_LISTINGS.find((d) => d.id === id);
}
