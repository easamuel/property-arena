import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaBath,
  FaBed,
  FaBuilding,
  FaChartLine,
  FaCheckCircle,
  FaExpand,
  FaHeart,
  FaHome,
  FaKey,
  FaLock,
  FaMapMarkerAlt,
  FaPlay,
  FaSearch,
  FaShieldAlt,
  FaStar,
  FaTags,
  FaUserTie,
  FaVideo,
  FaMap,
  FaBalanceScale,
  FaCalculator,
} from 'react-icons/fa';
import MarketplaceHeader from '@/components/navbar/MarketplaceHeader';
import SiteFooter from '@/components/footer/SiteFooter';
import AdSlot from '@/components/ads/AdSlot';
import SeoHead from '@/components/seo/SeoHead';
import SoldProperties from '@/components/marketplace/SoldProperties';
import ListYourPropertyCTA from '@/components/marketplace/ListYourPropertyCTA';
import ArenaSelectPremium from '@/components/marketplace/ArenaSelectPremium';
import { usePropertyStore } from '@/store/propertyStore';
import { ADMIN_SERVICE } from '@/services/admin';
import { buildSeoPath } from '@/lib/seo';
import { MEDIA, galleryAt } from '@/data/media';
import {
  POPULAR_DESTINATIONS,
  buildListingSearchUrl,
  type SearchTab,
} from '@/lib/locations';
import GoogleLiveSearch from '@/components/search/GoogleLiveSearch';

const SEARCH_TABS: SearchTab[] = ['Buy', 'Rent', 'Land', 'Short Let', 'Commercial'];

const TRUST = [
  { icon: FaShieldAlt, label: 'Verified Properties', sub: '100% Quality Check' },
  { icon: FaLock, label: 'Secure Payments', sub: 'Safe & Transparent' },
  { icon: FaUserTie, label: 'Expert Agents', sub: 'Professional Support' },
  { icon: FaVideo, label: 'Virtual Tours', sub: 'See Before You Buy' },
  { icon: FaTags, label: 'Best Deals', sub: 'Amazing Offers' },
];

const PURPOSES = [
  { title: 'Buy a Home', desc: 'Find your perfect home', to: '/properties?purpose=sale&location=Nigeria', icon: FaHome },
  { title: 'Rent a Home', desc: 'Short & long term', to: '/properties?purpose=rent&location=Nigeria', icon: FaKey },
  { title: 'Land for Sale', desc: 'Residential & commercial', to: '/properties?purpose=sale&propertyType=land&location=Nigeria', icon: FaMap },
  { title: 'Short Let', desc: 'Daily & monthly stays', to: '/properties?purpose=shortlet&location=Nigeria', icon: FaBed },
  { title: 'Commercial', desc: 'Offices & spaces', to: '/properties?propertyType=commercial&location=Nigeria', icon: FaBuilding },
];

const FALLBACK_FEATURED = [
  {
    id: 'f1',
    title: '4 Bedroom Duplex with BQ',
    location: 'Lekki Phase 1, Lagos',
    price: '₦320,000,000',
    beds: 4,
    baths: 5,
    area: '450sqm',
    img: MEDIA.duplex,
  },
  {
    id: 'f2',
    title: 'Plot of land for sale at Wuse',
    location: 'Wuse, Abuja',
    price: '₦50,000,000',
    beds: null as number | null,
    baths: null as number | null,
    area: '500sqm',
    img: MEDIA.land,
  },
  {
    id: 'f3',
    title: 'Luxury waterfront apartment',
    location: 'Ikoyi, Lagos',
    price: '₦185,000,000',
    beds: 3,
    baths: 3,
    area: '210sqm',
    img: MEDIA.apartment,
  },
  {
    id: 'f4',
    title: 'Contemporary terrace home',
    location: 'Ajah, Lagos',
    price: '₦145,000,000',
    beds: 4,
    baths: 4,
    area: '280sqm',
    img: MEDIA.terrace,
  },
];

const PARTNERS = [
  'Landmark',
  'Shelter Afrique',
  'PWAN Group',
  'Veritasi Homes',
  'RevolutionPlus',
  'ADC',
];

const SALES_TRENDS = [
  { city: 'Lagos', change: '+12.5%' },
  { city: 'Abuja', change: '+9.3%' },
  { city: 'Port Harcourt', change: '+7.8%' },
  { city: 'Ibadan', change: '+6.4%' },
  { city: 'Enugu', change: '+5.2%' },
];

const RENTAL_TRENDS = [
  { city: 'Lagos', change: '+8.1%' },
  { city: 'Abuja', change: '+6.4%' },
  { city: 'Port Harcourt', change: '+5.9%' },
  { city: 'Ibadan', change: '+4.2%' },
  { city: 'Enugu', change: '+3.8%' },
];

const LOCATIONS = [
  { name: 'Lekki', state: 'Lagos', img: MEDIA.duplex },
  { name: 'Ikoyi', state: 'Lagos', img: MEDIA.pool },
  { name: 'Gwarinpa', state: 'Abuja', img: MEDIA.bungalow },
  { name: 'Asaba', state: 'Delta', img: MEDIA.street },
  { name: 'Port Harcourt', state: 'Rivers', img: MEDIA.citySkyline },
  { name: 'Ibadan', state: 'Oyo', img: MEDIA.apartment2 },
];

const CONFIDENCE = [
  { icon: FaChartLine, title: 'Price Intelligence', desc: 'Know market value' },
  { icon: FaMapMarkerAlt, title: 'Neighborhood Insights', desc: 'Schools, roads, lifestyle' },
  { icon: FaBalanceScale, title: 'Legal Assistance', desc: 'Documentation guide' },
  { icon: FaCalculator, title: 'Mortgage Calculator', desc: 'Plan your budget' },
];

const GUIDES = [
  {
    tag: 'Buying Guide',
    title: 'Complete Guide to Buying Property in Nigeria',
    read: '5 min read',
    img: MEDIA.interior,
    slug: 'buying-guide-nigeria',
  },
  {
    tag: 'Investment',
    title: 'Top Real Estate Investment Hotspots',
    read: '6 min read',
    img: MEDIA.citySkyline,
    slug: 'investment-hotspots',
  },
  {
    tag: 'Legal',
    title: 'Land Documentation Process Explained',
    read: '4 min read',
    img: MEDIA.land,
    slug: 'land-documentation',
  },
  {
    tag: 'Trends',
    title: '2026 Real Estate Market Outlook',
    read: '5 min read',
    img: MEDIA.duplexNight,
    slug: 'market-outlook-2026',
  },
];

const PRICE_RANGES = [
  { label: 'Any price', min: '', max: '' },
  { label: 'Under ₦20m', min: '', max: '20000000' },
  { label: '₦20m – ₦50m', min: '20000000', max: '50000000' },
  { label: '₦50m – ₦100m', min: '50000000', max: '100000000' },
  { label: '₦100m – ₦250m', min: '100000000', max: '250000000' },
  { label: '₦250m+', min: '250000000', max: '' },
];

const TYPES_BY_TAB: Record<SearchTab, { value: string; label: string }[]> = {
  Buy: [
    { value: 'Duplex', label: 'Duplex' },
    { value: 'Apartment', label: 'Flat / Apartment' },
    { value: 'Terrace', label: 'Terrace' },
    { value: 'Bungalow', label: 'Bungalow' },
    { value: 'Mansion', label: 'Mansion' },
    { value: 'Mini Flat', label: 'Mini flat' },
    { value: 'Penthouse', label: 'Penthouse' },
  ],
  Rent: [
    { value: 'Apartment', label: 'Flat / Apartment' },
    { value: 'Mini Flat', label: 'Mini flat' },
    { value: 'Self Contain', label: 'Self contain' },
    { value: 'Duplex', label: 'Duplex' },
    { value: 'Terrace', label: 'Terrace' },
    { value: 'Bungalow', label: 'Bungalow' },
    { value: 'Shared Apartment', label: 'Shared apartment' },
  ],
  Land: [
    { value: 'Residential Land', label: 'Residential plot' },
    { value: 'Commercial Land', label: 'Commercial plot' },
    { value: 'Industrial Land', label: 'Industrial land' },
    { value: 'Farmland', label: 'Farmland' },
    { value: 'Mixed Use Land', label: 'Mixed-use land' },
  ],
  'Short Let': [
    { value: 'Apartment', label: 'Apartment' },
    { value: 'Studio', label: 'Studio' },
    { value: 'Duplex', label: 'Duplex' },
    { value: 'Penthouse', label: 'Penthouse' },
    { value: 'Serviced Apartment', label: 'Serviced apartment' },
  ],
  Commercial: [
    { value: 'Office', label: 'Office space' },
    { value: 'Shop', label: 'Shop / Retail' },
    { value: 'Warehouse', label: 'Warehouse' },
    { value: 'Co Working Space', label: 'Co-working space' },
    { value: 'Showroom', label: 'Showroom' },
    { value: 'Plaza', label: 'Plaza / Complex' },
  ],
};

const LAND_SIZES = [
  { value: '', label: 'Any size' },
  { value: 'half-plot', label: 'Half plot' },
  { value: 'full-plot', label: 'Full plot' },
  { value: '2-plots', label: '2 plots' },
  { value: '500sqm', label: '500 sqm' },
  { value: '1000sqm', label: '1,000 sqm' },
  { value: '1-acre', label: '1 acre' },
  { value: '2-acres', label: '2 acres' },
  { value: '1-hectare', label: '1 hectare' },
  { value: 'hectares', label: 'Hectares+' },
];

const COMMERCIAL_SIZES = [
  { value: '', label: 'Any size' },
  { value: 'under-50', label: 'Under 50 sqm' },
  { value: '50-100', label: '50 – 100 sqm' },
  { value: '100-250', label: '100 – 250 sqm' },
  { value: '250-500', label: '250 – 500 sqm' },
  { value: '500+', label: '500+ sqm' },
];

const formatPrice = (price: number | string | undefined) => {
  if (price == null) return 'Price on request';
  if (typeof price === 'number') return `₦${price.toLocaleString()}`;
  return String(price);
};

const HomePage = () => {
  const navigate = useNavigate();
  const { featuredListings, fetchFeaturedProperties } = usePropertyStore();
  const [tab, setTab] = useState<SearchTab>('Buy');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState('Any price');
  const [bedrooms, setBedrooms] = useState('');
  const [landSize, setLandSize] = useState('');
  const [marketTab, setMarketTab] = useState<'sales' | 'rental'>('sales');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [heroReady, setHeroReady] = useState(true);
  const [articles, setArticles] = useState(GUIDES);

  const switchTab = (next: SearchTab) => {
    setTab(next);
    setPropertyType('');
    setBedrooms('');
    setLandSize('');
  };

  useEffect(() => {
    fetchFeaturedProperties({ page: 1, limit: 4 });
    const t = requestAnimationFrame(() => setHeroReady(true));
    ADMIN_SERVICE.listPublicContent('article')
      .then((res: { data?: { data?: Record<string, unknown> }[] }) => {
        const rows = (res.data || [])
          .map((r) => r.data)
          .filter(Boolean)
          .map((d) => ({
            tag: String(d?.tag || 'Guide'),
            title: String(d?.title || 'Article'),
            read: `${d?.readMinutes || 5} min read`,
            img: String(d?.coverImage || GUIDES[0].img),
            slug: String(d?.slug || ''),
          }));
        if (rows.length) setArticles(rows);
      })
      .catch(() => undefined);
    return () => cancelAnimationFrame(t);
  }, [fetchFeaturedProperties]);

  const isProd = import.meta.env.PROD;
  const featured = (() => {
    if (!featuredListings?.length) {
      return isProd ? [] : FALLBACK_FEATURED;
    }
    return featuredListings.slice(0, 4).map((raw, i) => {
      const item = raw as typeof raw & {
        _id?: string;
        image?: string;
        media?: { url?: string }[];
        address?: string;
        bedrooms?: number;
        bathrooms?: number;
        size?: number | string;
        area?: string;
      };
      return {
        id: String(item.id || item._id || item.title),
        title: item.title || 'Featured Property',
        location: item.location || item.address || 'Nigeria',
        price: formatPrice(item.price),
        beds: item.bedrooms ?? null,
        baths: item.bathrooms ?? null,
        area: item.area || (item.size != null ? `${item.size}sqm` : null),
        img: item.image || item.media?.[0]?.url || galleryAt(i),
      };
    });
  })();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const typeForUrl =
      tab === 'Land'
        ? propertyType || 'Land'
        : tab === 'Commercial'
          ? propertyType || 'Commercial'
          : propertyType;
    let url = buildListingSearchUrl(tab, location, typeForUrl);
    const range = PRICE_RANGES.find((r) => r.label === priceRange);
    const params = new URLSearchParams(url.includes('?') ? url.split('?')[1] : '');
    if (range?.min) params.set('minPrice', range.min);
    if (range?.max) params.set('maxPrice', range.max);
    if (tab !== 'Land' && tab !== 'Commercial' && bedrooms) {
      params.set('bedroom', bedrooms);
    }
    if ((tab === 'Land' || tab === 'Commercial') && landSize) {
      params.set('size', landSize);
    }
    const qs = params.toString();
    const path = url.split('?')[0];
    navigate(qs ? `${path}?${qs}` : path);
  };

  const goPopular = (name: string, state: string) => {
    navigate(buildListingSearchUrl(tab, `${name}, ${state}`, propertyType));
  };

  const trends = marketTab === 'sales' ? SALES_TRENDS : RENTAL_TRENDS;

  return (
    <div className="min-h-screen bg-surface">
      <SeoHead
        title="PropertyArena.ng — Find. Compare. Own."
        description="Nigeria's smartest property marketplace. Buy, rent, short let and land from verified agents."
        path="/"
      />
      <MarketplaceHeader />

      {/* Hero — NPC / PropertyPro style: dark plane + neat white search card */}
      <section className="relative bg-[#071510]">
        {/* Clip decorative media only — keep content overflow visible for live search */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div
            className="absolute inset-0 bg-cover bg-center opacity-35 transition-transform duration-[8s] ease-out"
            style={{
              backgroundImage: `url('${MEDIA.hero}')`,
              transform: heroReady ? 'scale(1.05)' : 'scale(1)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#071510] via-[#0b1f14]/92 to-[#143022]/85" />
          <div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-brand-green/25 blur-3xl" />
        </div>

        <div
          className={`relative z-10 mx-auto w-full max-w-5xl px-4 pb-16 pt-14 transition-all duration-700 sm:px-6 sm:pt-16 lg:px-8 ${
            heroReady ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          }`}
        >
          <div className="mb-8 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/15">
              <FaShieldAlt className="text-brand-green" />
              Nigeria&apos;s property marketplace
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
              Find the right property
            </h1>
            <p className="mt-3 max-w-xl text-base text-white/75 sm:text-lg">
              Search homes, land and commercial property for sale and rent — across every major city in Nigeria.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="w-full max-w-5xl"
          >
            {/* Purpose tabs above the Google-style bar */}
            <div className="mb-3 flex flex-wrap gap-1.5 sm:gap-2">
              {SEARCH_TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => switchTab(t)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition sm:text-sm ${
                    tab === t
                      ? 'bg-white text-brand-green shadow-md'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Google-format long search bar — one continuous pill */}
            <div className="flex w-full flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-black/10 sm:flex-row sm:items-center sm:rounded-full sm:p-1.5 sm:pl-4 dark:bg-surface-elevated">
              <div className="flex min-w-0 flex-1 items-center gap-3 px-2 py-2 sm:px-0 sm:py-0">
                <FaSearch className="shrink-0 text-lg text-ink-muted" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Search state, locality, area or keyword…"
                  className="min-w-0 flex-1 border-0 bg-transparent text-base text-ink outline-none placeholder:text-ink-muted sm:text-lg"
                  aria-label="Search location"
                />
              </div>

              <div className="hidden h-8 w-px shrink-0 bg-line sm:block" />

              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full shrink-0 rounded-xl border-0 bg-chip px-3 py-2.5 text-sm font-medium text-ink outline-none sm:w-auto sm:min-w-[9.5rem] sm:rounded-none sm:bg-transparent"
                aria-label={tab === 'Land' ? 'Land type' : tab === 'Commercial' ? 'Space type' : 'Property type'}
              >
                <option value="">
                  {tab === 'Land' ? 'Any land type' : tab === 'Commercial' ? 'Any space' : 'Any type'}
                </option>
                {TYPES_BY_TAB[tab].map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <div className="hidden h-8 w-px shrink-0 bg-line sm:block" />

              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full shrink-0 rounded-xl border-0 bg-chip px-3 py-2.5 text-sm font-medium text-ink outline-none sm:w-auto sm:min-w-[8.5rem] sm:rounded-none sm:bg-transparent"
                aria-label="Price range"
              >
                {PRICE_RANGES.map((r) => (
                  <option key={r.label} value={r.label}>
                    {r.label}
                  </option>
                ))}
              </select>

              <div className="hidden h-8 w-px shrink-0 bg-line sm:block" />

              {tab === 'Land' ? (
                <select
                  value={landSize}
                  onChange={(e) => setLandSize(e.target.value)}
                  className="w-full shrink-0 rounded-xl border-0 bg-chip px-3 py-2.5 text-sm font-medium text-ink outline-none sm:w-auto sm:min-w-[8rem] sm:rounded-none sm:bg-transparent"
                  aria-label="Land size"
                >
                  {LAND_SIZES.map((s) => (
                    <option key={s.value || 'any'} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              ) : tab === 'Commercial' ? (
                <select
                  value={landSize}
                  onChange={(e) => setLandSize(e.target.value)}
                  className="w-full shrink-0 rounded-xl border-0 bg-chip px-3 py-2.5 text-sm font-medium text-ink outline-none sm:w-auto sm:min-w-[8rem] sm:rounded-none sm:bg-transparent"
                  aria-label="Floor size"
                >
                  {COMMERCIAL_SIZES.map((s) => (
                    <option key={s.value || 'any'} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full shrink-0 rounded-xl border-0 bg-chip px-3 py-2.5 text-sm font-medium text-ink outline-none sm:w-auto sm:min-w-[7rem] sm:rounded-none sm:bg-transparent"
                  aria-label="Bedrooms"
                >
                  <option value="">Any beds</option>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={String(n)}>
                      {n}+ bed
                    </option>
                  ))}
                </select>
              )}

              <button
                type="submit"
                className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-green px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-green-dark sm:w-auto sm:rounded-full sm:px-8"
              >
                <FaSearch /> Search
              </button>
            </div>
          </form>

          {/* Google-style live search under the filter card — high z so dropdown clears next section */}
          <div className="relative z-[60] mt-5 isolate">
            <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-wider text-white/50">
              Or search live across Nigeria
            </p>
            <GoogleLiveSearch />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {[
              { value: '50,000+', label: 'Active listings' },
              { value: '3,000+', label: 'Active agents' },
              { value: '200+', label: 'Areas covered' },
              { value: '36+', label: 'States covered' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-xl font-extrabold text-white sm:text-2xl">{stat.value}</p>
                <p className="mt-0.5 text-xs text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular destinations — neat image cards */}
      <section className="border-b border-line bg-surface-elevated py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-brand-green">Popular destinations</p>
              <h2 className="text-xl font-extrabold text-ink sm:text-2xl">Where buyers search most · {tab}</h2>
            </div>
            <Link to="/properties?purpose=sale&location=Nigeria" className="text-sm font-semibold text-brand-green hover:underline">
              Browse Nigeria
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {POPULAR_DESTINATIONS.map((place) => (
              <button
                key={place.name}
                type="button"
                onClick={() => goPopular(place.name, place.state)}
                className="group overflow-hidden rounded-2xl bg-surface text-left ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={place.img}
                    alt={`${place.name}, ${place.state}`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                    <p className="text-sm font-bold">{place.name}</p>
                    <p className="text-[10px] text-white/80">{place.state}</p>
                  </div>
                </div>
                <p className="line-clamp-1 px-3 py-2 text-[11px] text-ink-muted">{place.blurb}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface-muted">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:grid-cols-5 lg:px-8">
          {TRUST.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                <Icon />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{label}</p>
                <p className="text-xs text-ink-muted">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold text-ink sm:text-3xl">Browse Properties By Purpose</h2>
            <Link to="/properties" className="shrink-0 text-sm font-semibold text-brand-green hover:underline">
              Explore all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {PURPOSES.map(({ title, desc, to, icon: Icon }) => (
              <Link
                key={title}
                to={to}
                className="group flex flex-col items-center rounded-xl border border-line bg-surface-elevated px-4 py-8 text-center shadow-sm transition hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-md"
              >
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10 text-2xl text-brand-green transition group-hover:bg-brand-green group-hover:text-white">
                  <Icon />
                </span>
                <p className="font-bold text-ink">{title}</p>
                <p className="mt-1 text-sm text-ink-muted">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-muted py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-ink sm:text-3xl">Featured Properties</h2>
              <p className="mt-1 text-sm text-ink-muted">Verified • Updated Daily</p>
            </div>
            <Link to="/properties" className="shrink-0 text-sm font-semibold text-brand-green hover:underline">
              View all properties
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {!featured.length && (
              <p className="col-span-full rounded-xl border border-dashed border-line bg-surface-elevated px-6 py-10 text-center text-sm text-ink-muted">
                Featured listings will appear here once agents publish them.{' '}
                <Link to="/properties" className="font-semibold text-brand-green hover:underline">
                  Browse all properties
                </Link>
              </p>
            )}
            {featured.map((p) => (
              <Link
                key={p.id}
                to={
                  p.id.startsWith('f')
                    ? `/properties?location=${encodeURIComponent(p.location.split(',')[0])}`
                    : `/properties/${p.id}`
                }
                className="group overflow-hidden rounded-xl bg-surface-elevated shadow-sm ring-1 ring-line transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute left-3 top-3 rounded bg-brand-green px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                    Featured
                  </span>
                  <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-gray-400 shadow-sm">
                    <FaHeart className="text-sm" />
                  </span>
                </div>
                <div className="p-4">
                  <p className="line-clamp-2 font-bold text-ink group-hover:text-brand-green">{p.title}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
                    <FaMapMarkerAlt className="shrink-0 text-brand-red" />
                    <span className="line-clamp-1">{p.location}</span>
                  </p>
                  <p className="mt-2 text-lg font-bold text-brand-green">{p.price}</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-ink-muted">
                    {p.beds != null && (
                      <span className="flex items-center gap-1">
                        <FaBed /> {p.beds} Bedroom
                      </span>
                    )}
                    {p.baths != null && (
                      <span className="flex items-center gap-1">
                        <FaBath /> {p.baths}
                      </span>
                    )}
                    {p.area && (
                      <span className="flex items-center gap-1">
                        <FaExpand /> {p.area}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <AdSlot placement="homepage_banner" />
      </div>

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SoldProperties />
        </div>
      </section>

      <ListYourPropertyCTA />

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <AdSlot placement="homepage_mid" />
      </div>

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ArenaSelectPremium />
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_1fr_1fr_240px] lg:px-8">
          <div className="rounded-xl border border-line bg-surface-elevated p-6 shadow-sm">
            <h3 className="text-lg font-bold text-ink">
              Why Choose <span className="text-brand-green">PropertyArena</span>?
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-ink-secondary">
              {[
                'Largest verified property database',
                'Direct contact with real agents',
                'Advanced search & filters',
                'Virtual tours & high quality images',
                'Market insights & property alerts',
                'Secure & trusted platform',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <FaCheckCircle className="mt-0.5 shrink-0 text-brand-green" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/sell"
              className="mt-6 flex w-full items-center justify-center rounded-lg bg-brand-green px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-green-dark"
            >
              List Your Property
            </Link>
            <p className="mt-2 text-center text-xs text-ink-muted">It&apos;s free &amp; easy to get started</p>
          </div>

          <div className="rounded-xl border border-line bg-surface-elevated p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">Our Trusted Partners</h3>
              <Link to="/signup?role=agent" className="text-sm font-semibold text-brand-green hover:underline">
                View all
              </Link>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {PARTNERS.map((name) => (
                <div
                  key={name}
                  className="flex h-16 items-center justify-center rounded-lg border border-line bg-chip text-sm font-semibold text-ink-muted transition hover:border-brand-green/30 hover:text-ink-secondary"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-line bg-surface-elevated p-6 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-ink">Market Overview (Nigeria)</h3>
              <Link to="/properties" className="shrink-0 text-sm font-semibold text-brand-green hover:underline">
                View full report
              </Link>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setMarketTab('sales')}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  marketTab === 'sales' ? 'bg-brand-green text-white' : 'bg-chip text-ink-secondary hover:opacity-90'
                }`}
              >
                Property Sales
              </button>
              <button
                type="button"
                onClick={() => setMarketTab('rental')}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  marketTab === 'rental' ? 'bg-brand-green text-white' : 'bg-chip text-ink-secondary hover:opacity-90'
                }`}
              >
                Rental Trends
              </button>
            </div>
            <ul className="mt-4 space-y-2.5">
              {trends.map((t) => (
                <li key={t.city} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-ink-secondary">{t.city}</span>
                  <span className="font-bold text-brand-green">{t.change}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[11px] text-ink-muted">Illustrative figures · Market report</p>
          </div>

          <AdSlot placement="homepage_sidebar" className="lg:pt-0" />
        </div>
      </section>

      <section className="bg-surface-muted py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-ink sm:text-3xl">Top Locations</h2>
              <p className="mt-1 text-sm text-ink-muted">Explore places people love to live</p>
            </div>
            <Link to="/properties" className="shrink-0 text-sm font-semibold text-brand-green hover:underline">
              See all locations
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {LOCATIONS.map((loc) => (
              <Link
                key={loc.name}
                to={buildSeoPath('for-sale', loc.state, loc.name)}
                className="group relative h-52 overflow-hidden rounded-xl sm:h-56"
              >
                <img
                  src={loc.img}
                  alt={loc.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                  <p className="font-bold">{loc.name}</p>
                  <p className="text-xs text-white/80">{loc.state}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="overflow-hidden rounded-xl border border-line bg-surface-elevated shadow-sm">
            <div className="flex items-center justify-between px-5 pt-5">
              <div>
                <h3 className="text-lg font-bold text-ink">Video Tours</h3>
                <p className="text-sm text-ink-muted">See properties in action</p>
              </div>
              <Link to="/properties" className="text-sm font-semibold text-brand-green hover:underline">
                View all
              </Link>
            </div>
            <div className="relative m-5 overflow-hidden rounded-lg">
              <img src={MEDIA.interior} alt="Video tour" className="h-48 w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green text-white shadow-lg">
                  <FaPlay className="ml-1" />
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-surface-elevated p-6 shadow-sm">
            <h3 className="text-lg font-bold text-ink">What Our Clients Say</h3>
            <p className="mt-1 text-sm text-ink-muted">Real people, real experiences</p>
            <div className="mt-5 flex gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((i) => (
                <FaStar key={i} />
              ))}
            </div>
            <p className="mt-4 text-4xl leading-none text-brand-green">&ldquo;</p>
            <p className="text-sm leading-relaxed text-ink-secondary">
              PropertyArena made it easy for me to find my dream home in Lekki. The process was smooth and transparent.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/100?img=12"
                alt="Chinedu Okafor"
                className="h-11 w-11 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-ink">Chinedu Okafor</p>
                <p className="text-xs text-ink-muted">Homeowner, Lagos</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-surface-elevated p-6 shadow-sm">
            <h3 className="text-lg font-bold text-ink">Explore With Confidence</h3>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {CONFIDENCE.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-lg border border-line bg-chip p-3 transition hover:border-brand-green/30 hover:bg-brand-green/5"
                >
                  <Icon className="mb-2 text-brand-green" />
                  <p className="text-xs font-bold text-ink">{title}</p>
                  <p className="mt-0.5 text-[11px] text-ink-muted">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-muted py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-ink sm:text-3xl">Latest Guides &amp; Articles</h2>
              <p className="mt-1 text-sm text-ink-muted">Expert tips to help you make the right move</p>
            </div>
            <Link to="/articles" className="shrink-0 text-sm font-semibold text-brand-green hover:underline">
              View all articles
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {articles.map((g) => (
              <Link
                key={g.slug || g.title}
                to={g.slug ? `/articles/${g.slug}` : '/articles'}
                className="group overflow-hidden rounded-xl bg-surface-elevated shadow-sm ring-1 ring-line transition hover:-translate-y-1 hover:shadow-md"
              >
                <img
                  src={g.img}
                  alt={g.title}
                  className="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="p-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand-green">{g.tag}</span>
                  <h3 className="mt-2 line-clamp-2 font-bold text-ink group-hover:text-brand-green">{g.title}</h3>
                  <p className="mt-2 text-xs text-ink-muted">{g.read}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#0b1f14] py-14">
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-20"
          style={{
            backgroundImage: `url('${MEDIA.duplexNight}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div className="max-w-lg text-white">
            <h3 className="text-2xl font-bold sm:text-3xl">Get the best property deals straight to your inbox</h3>
            <p className="mt-2 text-sm text-white/70">
              Be the first to know about new listings, price drops &amp; exclusive offers.
            </p>
          </div>
          <form
            className="flex w-full max-w-md gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setSubscribed(true);
              setNewsletterEmail('');
            }}
          >
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 rounded-lg border-0 bg-white px-4 py-3 text-sm text-gray-900 outline-none ring-2 ring-transparent focus:ring-brand-green"
            />
            <button
              type="submit"
              className="rounded-lg bg-brand-green px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-green-dark"
            >
              {subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <AdSlot placement="footer_strip" />
      </div>

      <SiteFooter />
    </div>
  );
};

export default HomePage;
