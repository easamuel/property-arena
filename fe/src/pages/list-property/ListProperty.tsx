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
import { galleryAt } from '@/data/media';
import {
  SEO_BEDROOM_FACETS,
  SEO_STATE_FACETS,
  SEO_TYPE_FACETS,
} from '@/lib/locations';
import { filterDemoListings } from '@/data/demo-listings';

const PROPERTY_TYPES = [
  'Duplex',
  'Flats / Apartments',
  'House',
  'Bungalow',
  'Terrace',
  'Mini Flat',
  'Self Contain',
  'Penthouse',
  'Land',
  'Commercial Property',
  'Co Working Space',
];
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

  const purpose =
    seoFilters?.purpose ||
    searchParams.get('purpose') ||
    (searchParams.get('search') ? 'all' : 'sale');
  const locationQ =
    seoFilters?.location || searchParams.get('location') || 'Nigeria';
  const searchQ = searchParams.get('search') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const bedroom = searchParams.get('bedroom') || '';
  const propertyType =
    seoFilters?.propertyType || searchParams.get('propertyType') || '';
  const sort = searchParams.get('sort') || '-createdAt';
  const [seoExpanded, setSeoExpanded] = useState(false);

  const [barLocation, setBarLocation] = useState(locationQ);
  const [barType, setBarType] = useState(propertyType || '');
  const [barMin, setBarMin] = useState(minPrice);
  const [barMax, setBarMax] = useState(maxPrice);
  const [barBeds, setBarBeds] = useState(bedroom);
  const [txn, setTxn] = useState(txnFromFilters(purpose === 'all' ? 'sale' : purpose, propertyType));
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    propertyType ? [propertyType] : [],
  );

  useEffect(() => {
    setBarLocation(locationQ);
    setBarMin(minPrice);
    setBarMax(maxPrice);
    setBarBeds(bedroom);
    setTxn(txnFromFilters(purpose === 'all' ? 'sale' : purpose, propertyType));
    if (propertyType) setBarType(propertyType);
  }, [locationQ, minPrice, maxPrice, bedroom, purpose, propertyType]);

  const updateParams = (patch: Record<string, string | undefined>) => {
    if (seoCanonicalPath) {
      // Keep SEO location/purpose stable; allow type/beds/price query facets
      const next = new URLSearchParams(searchParams);
      Object.entries(patch).forEach(([k, v]) => {
        if (k === 'purpose' || k === 'location') return;
        if (k === 'propertyType' && seoFilters?.propertyType) return;
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
        const locToken = locationQ.split(',')[0]?.trim();
        const nationwide = !locToken || locToken.toLowerCase() === 'nigeria';
        const res = await PROPERTY_SERVICE.getProperties({
          listingPurpose: toApiPurpose(purpose),
          location: nationwide ? undefined : locToken,
          search: searchQ || undefined,
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
  }, [purpose, locationQ, searchQ, bedroom, minPrice, maxPrice, propertyType, sort]);

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
        img: p.media?.[0]?.url || galleryAt(i),
      }));
    }
    if (!allowDemoFallback) return [];
    // Never show unrelated Lagos demos on a Cross River (etc.) page
    return filterDemoListings({
      location: locationQ,
      purpose: purpose === 'all' ? undefined : purpose,
      propertyType: toApiPropertyType(propertyType) || propertyType,
      bedroom,
      search: searchQ,
      limit: 20,
    }).map((d) => ({
      id: d.id,
      title: d.title,
      location: d.location,
      price: d.price,
      bedroom: d.bedroom,
      baths: d.baths,
      area: d.areaSize,
      badge: d.badge,
      agent: d.agent,
      img: d.img,
    }));
  }, [apiListings, locationQ, purpose, propertyType, bedroom, searchQ]);

  const handleBarSearch = (e: FormEvent) => {
    e.preventDefault();
    if (seoCanonicalPath) {
      updateParams({
        minPrice: barMin || undefined,
        maxPrice: barMax || undefined,
        bedroom: barBeds || undefined,
        propertyType: seoFilters?.propertyType ? undefined : barType || undefined,
      });
      return;
    }
    const nextPurpose = purposeFromTxn(txn);
    const nextType = typeFromTxn(txn) || barType;
    updateParams({
      purpose: nextPurpose,
      location: barLocation || 'Nigeria',
      propertyType: nextType || undefined,
      minPrice: barMin || undefined,
      maxPrice: barMax || undefined,
      bedroom: barBeds || undefined,
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

  const typeLabel = propertyType || 'Property';
  const purposeLabel =
    purpose === 'all'
      ? ''
      : purpose === 'rent'
        ? 'for Rent'
        : purpose === 'shortlet'
          ? 'Short Let'
          : 'for Sale';
  const placeLabel =
    !locationQ || locationQ.toLowerCase() === 'nigeria' ? 'Nigeria' : locationQ;
  const demoFallback = allowDemoFallback
    ? filterDemoListings({
        location: locationQ,
        purpose: purpose === 'all' ? undefined : purpose,
        propertyType: toApiPropertyType(propertyType) || propertyType,
        bedroom,
        search: searchQ,
        limit: 20,
      })
    : [];
  const resultCount = totalHint || cards.length || demoFallback.length;
  const avgPrice = cards.length
    ? Math.round(cards.reduce((s, c) => s + (c.price || 0), 0) / cards.length)
    : 189983073;
  const maxListed = cards.length ? Math.max(...cards.map((c) => c.price || 0), 0) : 1000000000;
  const minListed = cards.length
    ? Math.min(...cards.filter((c) => c.price > 0).map((c) => c.price), 500000)
    : 500000;

  const heading =
    seoHeading ||
    (purposeLabel
      ? `${typeLabel} ${purposeLabel} in ${placeLabel}`
      : `${typeLabel} in ${placeLabel}`);

  const activeFilterCount = [bedroom, propertyType, minPrice || maxPrice, locationQ !== 'Nigeria' ? locationQ : ''].filter(Boolean).length;

  const clearFilters = () => {
    if (seoCanonicalPath) {
      updateParams({ bedroom: undefined, minPrice: undefined, maxPrice: undefined, sort: '-createdAt' });
      setBarBeds('');
      setBarMin('');
      setBarMax('');
      return;
    }
    setSearchParams({ purpose, location: 'Nigeria' });
    setBarLocation('Nigeria');
    setBarType('');
    setBarBeds('');
    setBarMin('');
    setBarMax('');
    setSelectedTypes([]);
  };

  return (
    <div className="min-h-screen bg-surface-muted">
      {!seoCanonicalPath && (
        <SeoHead
          title={`${heading} | PropertyArena`}
          description={`${typeLabel}${purposeLabel ? ` ${purposeLabel.toLowerCase()}` : ''} in ${placeLabel}. Browse verified listings on PropertyArena.`}
          path={`/properties?purpose=${purpose}&location=${encodeURIComponent(locationQ)}`}
        />
      )}
      <MarketplaceHeader />

      <div className="sticky top-0 z-30 border-b border-line bg-surface-elevated/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="mb-3 flex flex-wrap gap-2">
            {TRANSACTION_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                disabled={!!seoCanonicalPath}
                onClick={() => {
                  setTxn(t);
                  const nextType = typeFromTxn(t);
                  const hideBeds = t === 'Land' || t === 'Commercial';
                  if (hideBeds) setBarBeds('');
                  updateParams({
                    purpose: purposeFromTxn(t),
                    propertyType: nextType,
                    bedroom: hideBeds ? undefined : bedroom || undefined,
                  });
                }}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                  txn === t ? 'bg-brand-green text-white' : 'bg-chip text-ink-secondary hover:bg-brand-green/10'
                } ${seoCanonicalPath ? 'opacity-60' : ''}`}
              >
                {t}
              </button>
            ))}
          </div>

          <form onSubmit={handleBarSearch} className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-line bg-field px-4 py-2.5">
              <FaMapMarkerAlt className="shrink-0 text-brand-green" />
              <input
                value={barLocation}
                onChange={(e) => setBarLocation(e.target.value)}
                disabled={!!seoCanonicalPath}
                className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none"
                placeholder="Search Nigeria, Lagos, Abuja, Lekki…"
              />
            </div>
            <select
              value={barType}
              onChange={(e) => setBarType(e.target.value)}
              className="rounded-full border border-line bg-field px-4 py-2.5 text-sm"
            >
              <option value="">Any type</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {txn !== 'Land' && txn !== 'Commercial' && (
              <select
                value={barBeds}
                onChange={(e) => setBarBeds(e.target.value)}
                className="rounded-full border border-line bg-field px-4 py-2.5 text-sm"
              >
                <option value="">Any beds</option>
                {SEO_BEDROOM_FACETS.map((n) => (
                  <option key={n} value={String(n)}>{n}+</option>
                ))}
              </select>
            )}
            <button type="submit" className="rounded-full bg-brand-green px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-green-dark">
              Search
            </button>
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-semibold"
            >
              <FaFilter /> More{activeFilterCount > 0 ? ` · ${activeFilterCount}` : ''}
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <AdSlot placement="search_top" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_260px] lg:px-8">
        <main className="min-w-0">
          <div className="mb-4">
            <h1 className="text-xl font-extrabold text-ink sm:text-2xl">{heading}</h1>
            <p className={`mt-2 text-sm leading-relaxed text-ink-secondary ${seoExpanded ? '' : 'line-clamp-2'}`}>
              The average price is {formatNaira(avgPrice)}. Range {formatNaira(minListed)} – {formatNaira(maxListed)}.
              {' '}{resultCount.toLocaleString()} {typeLabel.toLowerCase()}
              {purposeLabel ? ` ${purposeLabel.toLowerCase()}` : ''} in {placeLabel}
              {' '}updated {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}.
              {txn === 'Land' || txn === 'Commercial'
                ? ' Refine by price, type and state across Nigeria.'
                : ' Refine by price, beds, type and state across Nigeria.'}
            </p>
            <button type="button" onClick={() => setSeoExpanded((v) => !v)} className="mt-1 text-xs font-semibold text-brand-green hover:underline">
              {seoExpanded ? 'Show less' : 'Show more'}
            </button>

            <div className="mt-4 flex flex-wrap gap-2">
              {txn !== 'Land' && txn !== 'Commercial' && SEO_BEDROOM_FACETS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => updateParams({ bedroom: bedroom === String(n) ? undefined : String(n) })}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    bedroom === String(n) ? 'bg-brand-green text-white' : 'bg-chip text-ink-secondary hover:bg-brand-green/10'
                  }`}
                >
                  {n} Bed
                </button>
              ))}
              {txn !== 'Land' && txn !== 'Commercial' && (
                <span className="mx-1 hidden h-6 w-px bg-line sm:inline-block" />
              )}
              {SEO_TYPE_FACETS.slice(0, 8).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleType(t)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    selectedTypes.includes(t) || propertyType === t
                      ? 'bg-ink text-surface'
                      : 'border border-line text-ink-secondary hover:border-brand-green/40'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {SEO_STATE_FACETS.map((state) => (
                <Link
                  key={state}
                  to={
                    purpose === 'rent'
                      ? buildSeoPath('for-rent', state)
                      : purpose === 'shortlet'
                        ? buildSeoPath('shortlet', state)
                        : buildSeoPath('for-sale', state)
                  }
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    locationQ.toLowerCase().includes(state.toLowerCase())
                      ? 'bg-brand-green/15 text-brand-green'
                      : 'bg-chip text-ink-secondary hover:bg-brand-green/10'
                  }`}
                >
                  {state}
                </Link>
              ))}
              <Link to="/properties?purpose=sale&location=Nigeria" className="rounded-full px-3 py-1 text-xs font-semibold text-brand-green hover:underline">
                All Nigeria →
              </Link>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-ink">
              Result 1 – {Math.min(20, cards.length || resultCount)} of {resultCount.toLocaleString()}
              {loading ? <span className="ml-2 text-xs font-normal text-ink-muted">Refreshing…</span> : null}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {activeFilterCount > 0 && (
                <button type="button" onClick={clearFilters} className="text-xs font-semibold text-brand-red hover:underline">
                  Clear filters
                </button>
              )}
              <div className="flex rounded-lg border border-line bg-surface-elevated p-0.5">
                <button type="button" onClick={() => setView('list')} className={`flex min-h-[36px] items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold ${view === 'list' ? 'bg-ink text-surface' : 'text-ink-muted'}`}>
                  <FaList /> List
                </button>
                <button type="button" onClick={() => setView('map')} className={`flex min-h-[36px] items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold ${view === 'map' ? 'bg-ink text-surface' : 'text-ink-muted'}`}>
                  <FaMap /> Map
                </button>
              </div>
              <select value={sort} onChange={(e) => updateParams({ sort: e.target.value })} className="min-h-[36px] rounded-lg border border-line bg-surface-elevated px-3 py-2 text-xs font-medium">
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>Sort: {o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {!loading && cards.length === 0 && (
            <p className="mb-4 rounded-xl border border-dashed border-line bg-surface-elevated px-4 py-8 text-center text-sm text-ink-muted">
              No listings match these filters yet.{' '}
              <Link to="/request-property" className="font-semibold text-brand-green hover:underline">Post a request</Link>
            </p>
          )}

          {view === 'map' ? (
            <div className="flex h-72 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-[#dce8df] to-[#c5d8f0] text-center dark:from-[#1a2a1f] dark:to-[#152030] sm:h-96">
              <FaMapMarkerAlt className="mb-2 text-2xl text-brand-red" />
              <p className="text-sm font-semibold text-ink">{locationQ}</p>
              <p className="mt-1 max-w-sm px-4 text-xs text-ink-muted">Map pins appear when agents add geo data.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cards.map((card) => (
                <article key={card.id} className="flex flex-col overflow-hidden rounded-2xl bg-surface-elevated shadow-sm ring-1 ring-line sm:flex-row">
                  <div className="relative h-48 w-full shrink-0 sm:h-auto sm:w-56">
                    <img src={card.img} alt={card.title} className="h-full w-full object-cover" />
                    <span className={`absolute left-3 top-3 rounded px-2 py-0.5 text-[10px] font-bold uppercase text-white ${card.badge === 'FEATURED' ? 'bg-brand-green' : 'bg-gray-800'}`}>
                      {card.badge}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                    <div>
                      <h2 className="text-lg font-bold text-ink">{card.title}</h2>
                      <p className="mt-1 flex items-center gap-1 text-sm text-ink-muted">
                        <FaMapMarkerAlt className="text-brand-red" /> {card.location}
                      </p>
                      <p className="mt-2 text-xl font-extrabold text-brand-green">
                        {card.price > 0 ? formatNaira(card.price) : 'Price on request'}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-ink-muted">
                        {txn !== 'Land' &&
                          txn !== 'Commercial' &&
                          !String(card.title || '').toLowerCase().includes('land') && (
                            <>
                              <span className="flex items-center gap-1"><FaBed /> {card.bedroom} Beds</span>
                              <span className="flex items-center gap-1"><FaBath /> {card.baths} Baths</span>
                            </>
                          )}
                        <span className="flex items-center gap-1"><FaExpand /> {card.area}</span>
                      </div>
                      <p className="mt-2 flex items-center gap-1 text-xs text-ink-muted">
                        <FaCheckCircle className="text-brand-green" /> Listed by {card.agent}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="button" className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-semibold">
                        <FaHeart className="text-brand-red" /> Save
                      </button>
                      <Link to={`/properties/${card.id}`} className="inline-flex min-h-[40px] items-center rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:bg-brand-green-dark">
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
          <div className="rounded-2xl bg-surface-elevated p-4 text-sm shadow-sm ring-1 ring-line">
            <p className="font-bold text-ink">Popular searches</p>
            <ul className="mt-2 space-y-1.5 text-brand-green">
              <li><Link to="/for-sale/in/lagos/lekki" className="hover:underline">Sale · Lekki</Link></li>
              <li><Link to="/for-sale/in/abuja" className="hover:underline">Sale · Abuja</Link></li>
              <li><Link to="/for-rent/in/rivers" className="hover:underline">Rent · Rivers</Link></li>
              <li><Link to="/land/in/ogun" className="hover:underline">Land · Ogun</Link></li>
              <li><Link to="/for-sale/in/enugu" className="hover:underline">Sale · Enugu</Link></li>
              <li><Link to="/properties?purpose=sale&location=Nigeria" className="hover:underline">All Nigeria</Link></li>
            </ul>
          </div>
        </aside>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50">
          <button type="button" className="absolute inset-0 bg-black/50" aria-label="Close" onClick={() => setFiltersOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-surface-elevated p-5 sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[380px] sm:rounded-none sm:rounded-l-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">More filters</h3>
              <button type="button" onClick={() => setFiltersOpen(false)} className="rounded-full p-2 text-ink-muted hover:bg-chip" aria-label="Close">
                <FaTimes />
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Price (₦)</p>
                <div className="grid grid-cols-2 gap-2">
                  <input value={barMin} onChange={(e) => setBarMin(e.target.value)} placeholder="Min" inputMode="numeric" className="rounded-xl border border-line bg-field px-3 py-2.5 text-sm" />
                  <input value={barMax} onChange={(e) => setBarMax(e.target.value)} placeholder="Max" inputMode="numeric" className="rounded-xl border border-line bg-field px-3 py-2.5 text-sm" />
                </div>
              </div>
              {txn !== 'Land' && txn !== 'Commercial' && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Bedrooms</p>
                  <div className="flex flex-wrap gap-2">
                    {SEO_BEDROOM_FACETS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBarBeds(barBeds === String(b) ? '' : String(b))}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold ${
                          barBeds === String(b) ? 'bg-brand-green text-white' : 'bg-chip text-ink-secondary'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Property type</p>
                <div className="flex flex-wrap gap-2">
                  {PROPERTY_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setBarType(barType === t ? '' : t)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        barType === t ? 'bg-ink text-surface' : 'border border-line text-ink-secondary'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <button type="button" onClick={clearFilters} className="flex-1 rounded-xl border border-line py-3 text-sm font-semibold">
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  const hideBeds = txn === 'Land' || txn === 'Commercial';
                  updateParams({
                    minPrice: barMin || undefined,
                    maxPrice: barMax || undefined,
                    bedroom: hideBeds ? undefined : barBeds || undefined,
                    propertyType: barType || undefined,
                    location: seoCanonicalPath ? undefined : barLocation || 'Nigeria',
                  });
                  setFiltersOpen(false);
                }}
                className="flex-1 rounded-xl bg-brand-green py-3 text-sm font-bold text-white"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
};

export default PropertyList;
