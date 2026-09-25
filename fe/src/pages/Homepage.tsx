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
import { usePropertyStore } from '@/store/propertyStore';
import { ADMIN_SERVICE } from '@/services/admin';
import { buildSeoPath } from '@/lib/seo';
import {
  POPULAR_DESTINATIONS,
  buildListingSearchUrl,
  type SearchTab,
} from '@/lib/locations';

const HERO_IMG =
  'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?q=80&w=1470&auto=format&fit=crop';

const FALLBACK_IMG =
  'https://res.cloudinary.com/dhhknhoo2/image/upload/v1751956131/property.jpg';

const SEARCH_TABS: SearchTab[] = ['Buy', 'Rent', 'Land', 'Short Let', 'Commercial'];

const TRUST = [
  { icon: FaShieldAlt, label: 'Verified Properties', sub: '100% Quality Check' },
  { icon: FaLock, label: 'Secure Payments', sub: 'Safe & Transparent' },
  { icon: FaUserTie, label: 'Expert Agents', sub: 'Professional Support' },
  { icon: FaVideo, label: 'Virtual Tours', sub: 'See Before You Buy' },
  { icon: FaTags, label: 'Best Deals', sub: 'Amazing Offers' },
];

const PURPOSES = [
  { title: 'Buy a Home', desc: 'Find your perfect home', to: '/for-sale/in/lagos', icon: FaHome },
  { title: 'Rent a Home', desc: 'Short & long term', to: '/for-rent/in/lagos', icon: FaKey },
  { title: 'Land for Sale', desc: 'Residential & commercial', to: '/land/in/lagos', icon: FaMap },
  { title: 'Short Let', desc: 'Daily & monthly stays', to: '/shortlet/in/lagos', icon: FaBed },
  { title: 'Commercial', desc: 'Offices & spaces', to: '/properties?propertyType=commercial', icon: FaBuilding },
];

const FALLBACK_FEATURED = [
  {
    id: 'f1',
    title: '4 Bedroom Duplex',
    location: 'Lagos, Nigeria',
    price: '₦500,000,000',
    beds: 4,
    baths: 3,
    area: '550sqm',
    img: FALLBACK_IMG,
  },
  {
    id: 'f2',
    title: '1 plot of land for sale at Wuse, Abuja',
    location: 'Abuja Federal Capital Territory, Nigeria',
    price: '₦50,000,000',
    beds: null as number | null,
    baths: null as number | null,
    area: '500sqm',
    img: FALLBACK_IMG,
  },
  {
    id: 'f3',
    title: 'Prop in Ajah Lagos',
    location: 'Lagos, Nigeria',
    price: '₦590,000',
    beds: 3,
    baths: null as number | null,
    area: null as string | null,
    img: FALLBACK_IMG,
  },
  {
    id: 'f4',
    title: '2 Bedroom Flat in Ajah',
    location: 'Lagos, Nigeria',
    price: '₦3,500,000',
    beds: 2,
    baths: null as number | null,
    area: null as string | null,
    img: FALLBACK_IMG,
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
  {
    name: 'Lekki',
    state: 'Lagos',
    img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Ikoyi',
    state: 'Lagos',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Gwarinpa',
    state: 'Abuja',
    img: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Asaba',
    state: 'Delta',
    img: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Port Harcourt',
    state: 'Rivers',
    img: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Ibadan',
    state: 'Oyo',
    img: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=600&auto=format&fit=crop',
  },
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
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop',
    slug: 'buying-guide-nigeria',
  },
  {
    tag: 'Investment',
    title: 'Top Real Estate Investment Hotspots',
    read: '6 min read',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop',
    slug: 'investment-hotspots',
  },
  {
    tag: 'Legal',
    title: 'Land Documentation Process Explained',
    read: '4 min read',
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop',
    slug: 'land-documentation',
  },
  {
    tag: 'Trends',
    title: '2026 Real Estate Market Outlook',
    read: '5 min read',
    img: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&auto=format&fit=crop',
    slug: 'market-outlook-2026',
  },
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
  const [marketTab, setMarketTab] = useState<'sales' | 'rental'>('sales');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [articles, setArticles] = useState(GUIDES);

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
    return featuredListings.slice(0, 4).map((raw) => {
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
        img: item.image || item.media?.[0]?.url || FALLBACK_IMG,
      };
    });
  })();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate(buildListingSearchUrl(tab, location, propertyType));
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

      {/* Hero — full-bleed with Google-style search */}
      <section className="relative">
        <div className="relative flex min-h-[72vh] items-center overflow-hidden py-16 sm:min-h-[78vh]">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[8s] ease-out"
            style={{
              backgroundImage: `url('${HERO_IMG}')`,
              transform: heroReady ? 'scale(1.06)' : 'scale(1)',
            }}
          />
          <div className="absolute inset-0 bg-black/55" />
          <div
            className={`relative z-10 mx-auto w-full max-w-5xl px-4 text-center transition-all duration-700 ${
              heroReady ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <span className="mb-5 inline-flex rounded-full bg-brand-green px-4 py-1.5 text-xs font-semibold tracking-wide text-white shadow-sm sm:text-sm">
              Nigeria&apos;s Smartest Property Marketplace
            </span>
            <h1 className="mb-3 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              Find. Compare. Own
              <br />
              <span className="text-brand-green">Your Dream Property</span>
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-base text-white/85 sm:text-lg">
              Search homes, land and short lets across Nigeria
            </p>

            <form
              onSubmit={handleSearch}
              className="mx-auto w-full max-w-3xl rounded-3xl border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-md sm:p-4"
            >
              <div className="mb-3 flex flex-wrap justify-center gap-1.5 sm:gap-2">
                {SEARCH_TABS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`rounded-full px-3.5 py-2 text-xs font-bold transition sm:px-4 sm:text-sm ${
                      tab === t
                        ? 'bg-white text-brand-green shadow-md'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-xl sm:flex-row sm:items-center dark:bg-surface-elevated">
                <div className="flex min-w-0 flex-1 items-center gap-2 px-2">
                  <FaSearch className="shrink-0 text-ink-muted" />
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Search Lekki, Ikoyi, Gwarinpa, Ajah…"
                    className="min-w-0 flex-1 border-0 bg-transparent py-3 text-base text-ink outline-none placeholder:text-ink-muted sm:text-lg"
                    aria-label="Search location"
                  />
                </div>
                <div className="hidden h-8 w-px bg-line sm:block" />
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="mx-1 rounded-xl border-0 bg-chip px-3 py-3 text-sm font-medium text-ink-secondary outline-none sm:max-w-[9rem]"
                  aria-label="Property type"
                >
                  <option value="">Any type</option>
                  <option value="Duplex">Duplex</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Bungalow">Bungalow</option>
                  <option value="Land">Land</option>
                  <option value="Commercial">Commercial</option>
                </select>
                <button
                  type="submit"
                  className="shrink-0 rounded-xl bg-brand-green px-6 py-3.5 text-sm font-bold text-white transition hover:bg-brand-green-dark sm:rounded-2xl sm:px-8 sm:text-base"
                >
                  Search
                </button>
              </div>

              <p className="mt-4 mb-2 text-left text-[11px] font-bold uppercase tracking-wider text-white/60 sm:text-center">
                Popular destinations · {tab}
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
                {POPULAR_DESTINATIONS.map((place) => (
                  <button
                    key={place.name}
                    type="button"
                    onClick={() => goPopular(place.name, place.state)}
                    className="group relative overflow-hidden rounded-2xl text-left ring-1 ring-white/20 transition hover:-translate-y-0.5 hover:ring-brand-green/60"
                  >
                    <img
                      src={place.img}
                      alt={`${place.name}, ${place.state}`}
                      className="h-24 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-28"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-2.5 text-white">
                      <p className="text-sm font-bold leading-tight">{place.name}</p>
                      <p className="text-[10px] text-white/75">{place.state}</p>
                    </div>
                  </button>
                ))}
              </div>
            </form>

            <div className="mx-auto mt-10 grid max-w-xl grid-cols-3 gap-4 sm:gap-8">
              {[
                { value: '50,000+', label: 'Verified Listings' },
                { value: '25,000+', label: 'Happy Clients' },
                { value: '3,000+', label: 'Active Agents' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-xl font-bold text-white sm:text-2xl">{stat.value}</p>
                  <p className="mt-1 text-[11px] text-white/70 sm:text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
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

      {/* Browse by purpose — icon cards like live */}
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

      {/* Featured */}
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
                to={p.id.startsWith('f') ? `/properties?location=${encodeURIComponent(p.location.split(',')[0])}` : `/properties/${p.id}`}
                className="group overflow-hidden rounded-xl bg-surface-elevated shadow-sm ring-1 ring-line transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded bg-brand-green px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                    Featured
                  </span>
                  <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-gray-400 shadow-sm transition hover:text-brand-red">
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

      {/* Admin-managed homepage banner */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <AdSlot placement="homepage_banner" />
      </div>

      {/* Why + Partners + Market */}
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
            <p className="mt-4 text-[11px] text-ink-muted">Illustrative figures · Q2 2024 Market Report</p>
          </div>

          <AdSlot placement="homepage_sidebar" className="lg:pt-0" />
        </div>
      </section>

      {/* Top locations */}
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

      {/* Video + Testimonial + Confidence */}
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
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop"
                alt="Video tour"
                className="h-48 w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green text-white shadow-lg transition hover:scale-105">
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

      {/* Guides */}
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
                <img src={g.img} alt={g.title} className="h-40 w-full object-cover transition duration-500 group-hover:scale-105" />
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

      {/* Newsletter */}
      <section className="relative overflow-hidden bg-[#0b1f14] py-14">
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop')",
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

      <SiteFooter />
    </div>
  );
};

export default HomePage;
