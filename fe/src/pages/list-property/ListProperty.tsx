import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FaBath,
  FaBed,
  FaExpand,
  FaFilter,
  FaHeart,
  FaList,
  FaMap,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimes,
} from 'react-icons/fa';
import MarketplaceHeader from '@/components/navbar/MarketplaceHeader';
import SiteFooter from '@/components/footer/SiteFooter';
import AdSlot from '@/components/ads/AdSlot';
import SeoHead from '@/components/seo/SeoHead';
import { PROPERTY_SERVICE } from '@/services/property';
import { PropertyData } from '@/types/property';
import { buildSeoPath } from '@/lib/seo';

const SAMPLE_IMG = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop',
];

const SAMPLE_LISTINGS = [
  {
    id: 'demo-1',
    title: '4 Bedroom Fully Detached Duplex with BQ',
    location: 'Lekki Phase 1, Lagos',
    price: 320000000,
    bedroom: '4',
    baths: '5',
    area: '450 sqm',
    badge: 'FEATURED',
    agent: 'Ayo Tester',
    img: SAMPLE_IMG[0],
  },
  {
    id: 'demo-2',
    title: 'Luxury Waterfront Apartment',
    location: 'Lekki, Lagos',
    price: 185000000,
    bedroom: '3',
    baths: '3',
    area: '210 sqm',
    badge: 'VERIFIED',
    agent: 'Prime Nest Realty',
    img: SAMPLE_IMG[1],
  },
  {
    id: 'demo-3',
    title: 'Contemporary Smart Home Terrace',
    location: 'Chevron Drive, Lekki',
    price: 145000000,
    bedroom: '4',
    baths: '4',
    area: '280 sqm',
    badge: 'FEATURED',
    agent: 'UrbanKey Homes',
    img: SAMPLE_IMG[2],
  },
];

const LOCATIONS = ['Lekki', 'Ikoyi', 'Victoria Island', 'Ajah', 'Yaba', 'Ikeja'];
const PROPERTY_TYPES = ['Duplex', 'Apartment', 'Bungalow', 'Terrace', 'Land', 'Commercial'];
const TRANSACTION_TYPES = ['Buy', 'Rent', 'Short Let', 'Land', 'Commercial'] as const;
const SORT_OPTIONS = [
  { label: 'Newest', value: '-createdAt' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
] as const;

const purposeFromTxn = (t: string) => {
  if (t === 'Buy') return 'sale';
  if (t === 'Rent') return 'rent';
  if (t === 'Short Let') return 'shortlet';
  if (t === 'Land') return 'sale';
  return 'sale';
};

const typeFromTxn = (t: string): string | undefined => {
  if (t === 'Land') return 'Land';
  if (t === 'Commercial') return 'Commercial';
  return undefined;
};

const txnFromFilters = (purpose: string, propertyType: string) => {
  if (propertyType.toLowerCase().includes('land')) return 'Land';
  if (propertyType.toLowerCase().includes('commercial')) return 'Commercial';
  if (purpose === 'rent') return 'Rent';
  if (purpose === 'shortlet') return 'Short Let';
  return 'Buy';
};

const toApiPurpose = (purpose: string) => {
  const value = purpose.toLowerCase();
  if (value === 'shortlet') return 'shortlet';
  if (value === 'rent') return 'rent';
  if (value === 'lease') return 'lease';
  if (value === 'sale' || value === 'buy') return 'sale';
  return undefined;
};

const toApiPropertyType = (value: string) => {
  const type = value.toLowerCase();
  if (!type) return undefined;
  if (type.includes('apartment') || type.includes('flat')) return 'flats or apartments';
  if (type.includes('land')) return 'land';
  if (type.includes('commercial') || type.includes('office') || type.includes('shop')) {
    return 'commercial property';
  }
  if (type.includes('co-working')) return 'co-working space';
  if (['duplex', 'house', 'terrace', 'bungalow', 'detached', 'mansion'].some((k) => type.includes(k))) {
    return 'house';
  }
  return undefined;
};

const formatNaira = (n: number) => `₦${n.toLocaleString()}`;

const allowDemoFallback = !import.meta.env.PROD;

type SeoFilters = {
  purpose: string;
  propertyType?: string;
  location: string;
};

type Props = {
  seoFilters?: SeoFilters;
  seoHeading?: string;
  seoCanonicalPath?: string;
};

type DisplayCard = {
  id: string;
  title: string;
  location: string;
  price: number;
  bedroom: string;
  baths: string;
  area: string;
  badge: string;
  agent: string;
  img: string;
};

const PropertyList = ({ seoFilters, seoHeading, seoCanonicalPath }: Props = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<'list' | 'map'>('list');
  const [apiListings, setApiListings] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [totalHint, setTotalHint] = useState(0);

  const purpose = seoFilters?.purpose || searchParams.get('purpose') || 'sale';
  const locationQ =
    seoFilters?.location || searchParams.get('location') || 'Lagos, Nigeria';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const bedroom = searchParams.get('bedroom') || '';
  const propertyType =
    seoFilters?.propertyType || searchParams.get('propertyType') || '';
  const sort = searchParams.get('sort') || '-createdAt';

  const [barLocation, setBarLocation] = useState(locationQ);
  const [barType, setBarType] = useState(propertyType || 'Duplex');
  const [barMin, setBarMin] = useState(minPrice);
  const [barMax, setBarMax] = useState(maxPrice);
  const [barBeds, setBarBeds] = useState(bedroom);
  const [txn, setTxn] = useState(txnFromFilters(purpose, propertyType));
  const [selectedLocations, setSelectedLocations] = useState<string[]>(() => {
    const first = locationQ.split(',')[0]?.trim();
    return first ? [first] : ['Lagos'];
  });
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    propertyType ? [propertyType] : [],
  );
  const [priceSlider, setPriceSlider] = useState(Number(maxPrice) || 500000000);

  useEffect(() => {
    setBarLocation(locationQ);
    setBarMin(minPrice);
    setBarMax(maxPrice);
    setBarBeds(bedroom);
    setTxn(txnFromFilters(purpose, propertyType));
    if (propertyType) setBarType(propertyType);
  }, [locationQ, minPrice, maxPrice, bedroom, purpose, propertyType]);

  const updateParams = (patch: Record<string, string | undefined>) => {
    if (seoCanonicalPath) {
      // Keep SEO URL stable; only mutate non-location query facets
      const next = new URLSearchParams(searchParams);
      Object.entries(patch).forEach(([k, v]) => {
        if (k === 'purpose' || k === 'location' || k === 'propertyType') return;
        if (v === undefined || v === '') next.delete(k);
        else next.set(k, v);
      });
      setSearchParams(next, { replace: true });
      return;
    }
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === undefined || v === '') next.delete(k);
      else next.set(k, v);
    });
    setSearchParams(next);
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const apiType = toApiPropertyType(propertyType);
        const res = await PROPERTY_SERVICE.getProperties({
          listingPurpose: toApiPurpose(purpose),
          location: locationQ.split(',')[0]?.trim() || undefined,
          bedroom: bedroom || undefined,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          propertyType: apiType,
          sort,
          limit: 20,
          page: 1,
        });
        if (!cancelled) {
          const data = (res as { data?: PropertyData[]; meta?: { total?: number } })?.data ?? [];
          const meta = (res as { meta?: { total?: number } })?.meta;
          setApiListings(Array.isArray(data) ? data : []);
          setTotalHint(meta?.total ?? (Array.isArray(data) ? data.length : 0));
        }
      } catch {
        if (!cancelled) {
          setApiListings([]);
          setTotalHint(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [purpose, locationQ, bedroom, minPrice, maxPrice, propertyType, sort]);

  const cards: DisplayCard[] = useMemo(() => {
    if (apiListings.length > 0) {
      return apiListings.map((p, i) => ({
        id: p.id || p.propertyId || `api-${i}`,
        title: p.title || 'Untitled Property',
        location: p.location || p.address || 'Nigeria',
        price: Number(p.price) || 0,
        bedroom: String(p.bedroom || '—'),
        baths: '—',
        area: p.landArea ? `${p.landArea} ${p.landAreaMeasurement || ''}`.trim() : '—',
        badge: (p as PropertyData & { isFeatured?: boolean }).isFeatured ? 'FEATURED' : 'LISTED',
        agent: 'PropertyArena Agent',
        img: p.media?.[0]?.url || SAMPLE_IMG[i % SAMPLE_IMG.length],
      }));
    }
    if (allowDemoFallback) return SAMPLE_LISTINGS;
    return [];
  }, [apiListings]);

  const handleBarSearch = (e: FormEvent) => {
    e.preventDefault();
    if (seoCanonicalPath) {
      updateParams({
        minPrice: barMin || undefined,
        maxPrice: barMax || undefined,
        bedroom: barBeds || undefined,
      });
      return;
    }
    const nextPurpose = purposeFromTxn(txn);
    const nextType = typeFromTxn(txn) || barType;
    updateParams({
      purpose: nextPurpose,
      location: barLocation,
      propertyType: nextType,
      minPrice: barMin || undefined,
      maxPrice: barMax || undefined,
      bedroom: barBeds || undefined,
    });
  };

  const toggleLocation = (label: string) => {
    if (seoCanonicalPath) return;
    setSelectedLocations((prev) => {
      const next = prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label];
      const city = next[0] || 'Lagos';
      updateParams({ location: `${city}, Nigeria` });
      return next.length ? next : [label];
    });
  };

  const toggleType = (t: string) => {
    if (seoCanonicalPath && seoFilters?.propertyType) return;
    setSelectedTypes((prev) => {
      const next = prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t];
      updateParams({ propertyType: next[0] || undefined });
      return next;
    });
  };

  const heading =
    seoHeading ||
    `${totalHint || cards.length || 0} Properties in ${locationQ}`;

  const FiltersPanel = (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Transaction
        </p>
        <div className="flex flex-wrap gap-2">
          {TRANSACTION_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              disabled={!!seoCanonicalPath}
              onClick={() => {
                setTxn(t);
                const p = purposeFromTxn(t);
                const pt = typeFromTxn(t);
                updateParams({ purpose: p, propertyType: pt });
              }}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                txn === t ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300'
              } ${seoCanonicalPath ? 'opacity-60' : ''}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Location</p>
        <ul className="space-y-2">
          {LOCATIONS.map((loc) => (
            <li key={loc}>
              <label className="flex cursor-pointer items-center justify-between text-sm text-ink-secondary">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    disabled={!!seoCanonicalPath}
                    checked={selectedLocations.includes(loc)}
                    onChange={() => toggleLocation(loc)}
                    className="rounded text-brand-green"
                  />
                  {loc}
                </span>
                {!seoCanonicalPath && (
                  <Link
                    to={buildSeoPath('for-sale', 'Lagos', loc)}
                    className="text-[10px] font-semibold text-brand-green hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    SEO
                  </Link>
                )}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Property Type
        </p>
        <ul className="space-y-2">
          {PROPERTY_TYPES.map((t) => (
            <li key={t}>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-secondary">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(t)}
                  onChange={() => toggleType(t)}
                  className="rounded text-brand-green"
                />
                {t}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Price Range
        </p>
        <input
          type="range"
          min={5000000}
          max={1000000000}
          step={5000000}
          value={priceSlider}
          onChange={(e) => setPriceSlider(Number(e.target.value))}
          onMouseUp={() => updateParams({ maxPrice: String(priceSlider), minPrice: minPrice || '0' })}
          onTouchEnd={() => updateParams({ maxPrice: String(priceSlider), minPrice: minPrice || '0' })}
          className="w-full accent-brand-green"
        />
        <p className="mt-1 text-xs text-gray-500">Up to {formatNaira(priceSlider)}</p>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Bedrooms</p>
        <div className="flex flex-wrap gap-2">
          {['1', '2', '3', '4', '5'].map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => updateParams({ bedroom: bedroom === b ? undefined : b })}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold ${
                bedroom === b ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-600 dark:bg-white/10'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-muted">
      {!seoCanonicalPath && (
        <SeoHead
          title={`Properties in ${locationQ}`}
          description={`Browse verified listings in ${locationQ} on PropertyArena.`}
          path={`/properties?purpose=${purpose}&location=${encodeURIComponent(locationQ)}`}
        />
      )}
      <MarketplaceHeader />

      <div className="border-b border-line bg-surface-elevated">
        <form
          onSubmit={handleBarSearch}
          className="mx-auto flex max-w-7xl flex-wrap items-end gap-3 px-4 py-4 sm:px-6 lg:px-8"
        >
          <label className="min-w-[10rem] flex-1 text-xs font-medium text-gray-500">
            Location
            <input
              value={barLocation}
              onChange={(e) => setBarLocation(e.target.value)}
              disabled={!!seoCanonicalPath}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm dark:border-line dark:bg-surface-muted"
              placeholder="Lekki, Lagos"
            />
          </label>
          <label className="min-w-[8rem] text-xs font-medium text-gray-500">
            Property Type
            <select
              value={barType}
              onChange={(e) => setBarType(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm dark:border-line dark:bg-surface-muted"
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="w-28 text-xs font-medium text-gray-500">
            Min Price
            <input
              value={barMin}
              onChange={(e) => setBarMin(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm dark:border-line dark:bg-surface-muted"
              placeholder="10000000"
              inputMode="numeric"
            />
          </label>
          <label className="w-28 text-xs font-medium text-gray-500">
            Max Price
            <input
              value={barMax}
              onChange={(e) => setBarMax(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm dark:border-line dark:bg-surface-muted"
              placeholder="500000000"
              inputMode="numeric"
            />
          </label>
          <label className="w-28 text-xs font-medium text-gray-500">
            Beds
            <select
              value={barBeds}
              onChange={(e) => setBarBeds(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm dark:border-line dark:bg-surface-muted"
            >
              <option value="">Any</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={String(n)}>
                  {n}+
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="min-h-[42px] rounded-lg bg-brand-green px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-green-dark"
          >
            Search
          </button>
          <button
            type="button"
            className="inline-flex min-h-[42px] items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold lg:hidden dark:border-line-strong"
            onClick={() => setFiltersOpen(true)}
          >
            <FaFilter /> Filters
          </button>
        </form>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr_240px] lg:px-8">
        <aside className="hidden h-fit rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 dark:bg-surface-elevated dark:ring-line lg:block">
          <h3 className="mb-4 text-sm font-bold text-ink">Filters</h3>
          {FiltersPanel}
        </aside>

        <main className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
                {heading}
              </h1>
              {loading && <p className="text-xs text-gray-400">Refreshing listings…</p>}
              {!loading && cards.length === 0 && (
                <p className="mt-1 text-sm text-gray-500">
                  No listings match these filters yet.{' '}
                  <Link to="/request-property" className="font-semibold text-brand-green hover:underline">
                    Post a request
                  </Link>
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-lg border border-gray-200 bg-white p-0.5 dark:border-line-strong dark:bg-surface-muted">
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className={`flex min-h-[36px] items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold ${
                    view === 'list' ? 'bg-ink text-surface' : 'text-ink-muted'
                  }`}
                >
                  <FaList /> List
                </button>
                <button
                  type="button"
                  onClick={() => setView('map')}
                  className={`flex min-h-[36px] items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold ${
                    view === 'map' ? 'bg-ink text-surface' : 'text-ink-muted'
                  }`}
                >
                  <FaMap /> Map
                </button>
              </div>
              <select
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value })}
                className="min-h-[36px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 dark:border-line-strong dark:bg-surface-muted dark:text-gray-200"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    Sort: {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {view === 'map' ? (
            <div className="flex h-72 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-[#dce8df] to-[#c5d8f0] text-center dark:from-[#1a2a1f] dark:to-[#152030] sm:h-96">
              <FaMapMarkerAlt className="mb-2 text-2xl text-brand-red" />
              <p className="text-sm font-semibold text-ink">{locationQ}</p>
              <p className="mt-1 max-w-sm px-4 text-xs text-gray-600 dark:text-gray-400">
                Map pins ship with listing coordinates. Browse the list for now — pins appear when agents add geo data.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cards.map((card) => (
                <article
                  key={card.id}
                  className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 dark:bg-surface-elevated dark:ring-line sm:flex-row"
                >
                  <div className="relative h-48 w-full shrink-0 sm:h-auto sm:w-56">
                    <img src={card.img} alt={card.title} className="h-full w-full object-cover" />
                    <span
                      className={`absolute left-3 top-3 rounded px-2 py-0.5 text-[10px] font-bold uppercase text-white ${
                        card.badge === 'FEATURED' ? 'bg-brand-green' : 'bg-gray-800'
                      }`}
                    >
                      {card.badge}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                    <div>
                      <h2 className="text-lg font-bold text-ink">{card.title}</h2>
                      <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                        <FaMapMarkerAlt className="text-brand-red" /> {card.location}
                      </p>
                      <p className="mt-2 text-xl font-extrabold text-brand-green">
                        {card.price > 0 ? formatNaira(card.price) : 'Price on request'}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaBed /> {card.bedroom} Beds
                        </span>
                        <span className="flex items-center gap-1">
                          <FaBath /> {card.baths} Baths
                        </span>
                        <span className="flex items-center gap-1">
                          <FaExpand /> {card.area}
                        </span>
                      </div>
                      <p className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                        <FaCheckCircle className="text-brand-green" /> Listed by {card.agent}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 dark:border-line-strong dark:text-gray-200"
                      >
                        <FaHeart className="text-brand-red" /> Save
                      </button>
                      <Link
                        to={`/properties/${card.id}`}
                        className="inline-flex min-h-[40px] items-center rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:bg-brand-green-dark"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>

        <aside className="hidden space-y-4 lg:block">
          <AdSlot placement="search_sidebar" />
          <div className="rounded-2xl bg-white p-4 text-sm shadow-sm ring-1 ring-gray-100 dark:bg-surface-elevated dark:ring-line">
            <p className="font-bold text-ink">Browse by SEO URL</p>
            <ul className="mt-2 space-y-1.5 text-brand-green">
              <li>
                <Link to="/for-sale/in/lagos/lekki" className="hover:underline">
                  Sale · Lekki
                </Link>
              </li>
              <li>
                <Link to="/for-rent/in/lagos" className="hover:underline">
                  Rent · Lagos
                </Link>
              </li>
              <li>
                <Link to="/shortlet/in/lagos" className="hover:underline">
                  Short let · Lagos
                </Link>
              </li>
              <li>
                <Link to="/land/in/abuja" className="hover:underline">
                  Land · Abuja
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Mobile filter sheet */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-5 dark:bg-surface-elevated">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">Filters</h3>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>
            {FiltersPanel}
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="mt-6 w-full rounded-lg bg-brand-green py-3 text-sm font-bold text-white"
            >
              Show results
            </button>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
};

export default PropertyList;
