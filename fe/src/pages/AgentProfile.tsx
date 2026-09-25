import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FaBath,
  FaBed,
  FaCheckCircle,
  FaExpand,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaStar,
} from 'react-icons/fa';
import MarketplaceHeader from '@/components/navbar/MarketplaceHeader';
import SiteFooter from '@/components/footer/SiteFooter';

const AGENT = {
  name: 'Ayo Tester',
  title: 'Senior Property Consultant',
  location: 'Lekki, Lagos',
  verified: true,
  rating: 4.9,
  reviews: 128,
  listings: 46,
  sold: 112,
  clients: 320,
  about:
    'Ayo helps buyers and renters find verified homes across Lagos. Specialising in Lekki, Ikoyi and Victoria Island luxury residential.',
};

const LISTINGS = [
  {
    id: 'demo-1',
    title: '4 Bedroom Luxury Duplex',
    location: 'Lekki Phase 1',
    price: '₦320,000,000',
    beds: 4,
    baths: 5,
    area: '450 sqm',
    type: 'sale',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop',
  },
  {
    id: 'demo-2',
    title: 'Waterfront Apartment',
    location: 'Ikoyi',
    price: '₦8,500,000/yr',
    beds: 3,
    baths: 3,
    area: '210 sqm',
    type: 'rent',
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop',
  },
  {
    id: 'demo-3',
    title: 'Smart Home Terrace',
    location: 'Chevron, Lekki',
    price: '₦145,000,000',
    beds: 4,
    baths: 4,
    area: '280 sqm',
    type: 'sale',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop',
  },
  {
    id: 'demo-1',
    title: 'Executive Short Let Flat',
    location: 'Victoria Island',
    price: '₦150,000/night',
    beds: 2,
    baths: 2,
    area: '120 sqm',
    type: 'shortlet',
    img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop',
  },
];

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'sale', label: 'For Sale' },
  { id: 'rent', label: 'For Rent' },
  { id: 'shortlet', label: 'Short Let' },
] as const;

const AgentProfile = () => {
  const { agentId } = useParams();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all');

  const properties = useMemo(
    () => (filter === 'all' ? LISTINGS : LISTINGS.filter((p) => p.type === filter)),
    [filter]
  );

  return (
    <div className="min-h-screen bg-surface-muted">
      <MarketplaceHeader />

      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-green text-3xl font-extrabold text-white">
              AT
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">{AGENT.name}</h1>
                {AGENT.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-green/15 px-2.5 py-0.5 text-xs font-bold text-primary-green">
                    <FaCheckCircle /> Verified
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {AGENT.title} · <FaMapMarkerAlt className="inline text-primary-red" /> {AGENT.location}
              </p>
              <p className="mt-1 text-xs text-gray-400">Agent ID: {agentId}</p>
              <div className="mt-2 flex items-center gap-1 text-amber-400 text-sm">
                {[1, 2, 3, 4, 5].map((i) => (
                  <FaStar key={i} />
                ))}
                <span className="ml-1 text-gray-600">
                  {AGENT.rating} ({AGENT.reviews} reviews)
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-green px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-green-hover"
              >
                <FaPhone /> Call
              </button>
              <Link
                to="/messages"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                <FaEnvelope /> Message
              </Link>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 sm:max-w-md">
            {[
              { label: 'Listings', value: AGENT.listings },
              { label: 'Sold', value: AGENT.sold },
              { label: 'Clients', value: AGENT.clients },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-gray-50 px-4 py-3 text-center">
                <p className="text-xl font-extrabold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-gray-600">{AGENT.about}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-extrabold text-gray-900">Properties by {AGENT.name}</h2>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  filter === f.id ? 'bg-primary-green text-white' : 'bg-white text-gray-600 ring-1 ring-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {properties.map((p, i) => (
            <Link
              key={`${p.id}-${i}`}
              to={`/properties/${p.id}`}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
            >
              <img src={p.img} alt={p.title} className="h-40 w-full object-cover" />
              <div className="p-4">
                <p className="font-bold text-gray-900">{p.title}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                  <FaMapMarkerAlt className="text-primary-red" /> {p.location}
                </p>
                <p className="mt-2 font-extrabold text-primary-green">{p.price}</p>
                <div className="mt-2 flex gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><FaBed /> {p.beds}</span>
                  <span className="flex items-center gap-1"><FaBath /> {p.baths}</span>
                  <span className="flex items-center gap-1"><FaExpand /> {p.area}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default AgentProfile;
