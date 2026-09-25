import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FaBath,
  FaBed,
  FaCheckCircle,
  FaEnvelope,
  FaExpand,
  FaGlobe,
  FaMapMarkerAlt,
  FaPhone,
  FaStar,
  FaWhatsapp,
} from 'react-icons/fa';
import MarketplaceHeader from '@/components/navbar/MarketplaceHeader';
import SiteFooter from '@/components/footer/SiteFooter';
import SeoHead from '@/components/seo/SeoHead';
import { ADMIN_SERVICE } from '@/services/admin';

const FIRST = [
  'Ayo',
  'Chioma',
  'Ibrahim',
  'Ngozi',
  'Tunde',
  'Fatima',
  'Emeka',
  'Ada',
  'Kunle',
  'Blessing',
  'Yusuf',
  'Amaka',
];
const LAST = [
  'Okoro',
  'Adeyemi',
  'Bello',
  'Okafor',
  'Mohammed',
  'Eze',
  'Balogun',
  'Uche',
  'Danladi',
  'Ibrahim',
];
const TITLES = [
  'Senior Property Consultant',
  'Residential Specialist',
  'Luxury Sales Advisor',
  'Letting & Sales Agent',
  'Investment Property Advisor',
];
const AREA_SETS = [
  ['Lekki', 'Ajah', 'Ikoyi'],
  ['Ikeja', 'Magodo', 'Gbagada'],
  ['Gwarinpa', 'Maitama', 'Wuse 2'],
  ['Trans Amadi', 'GRA Phase 2', 'Peter Odili'],
  ['Bodija', 'Ikolaba', 'Jericho'],
];

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function buildAgent(agentId: string) {
  const h = hashId(agentId || 'demo-agent');
  const first = FIRST[h % FIRST.length];
  const last = LAST[(h >> 3) % LAST.length];
  const name = `${first} ${last}`;
  const initials = `${first[0]}${last[0]}`.toUpperCase();
  const title = TITLES[h % TITLES.length];
  const areas = AREA_SETS[h % AREA_SETS.length];
  const location = `${areas[0]}, ${h % 2 === 0 ? 'Lagos' : h % 3 === 0 ? 'Abuja' : 'Rivers'}`;
  const phoneLocal = `080${String(30000000 + (h % 69999999)).padStart(8, '0')}`;
  const phoneTel = `+234${phoneLocal.slice(1)}`;
  const wa = `234${phoneLocal.slice(1)}`;
  const emailSlug = `${first}.${last}`.toLowerCase().replace(/\s+/g, '');
  const website = `https://${emailSlug.replace('.', '')}.propertyarena.ng`;
  const verified = h % 5 !== 0;
  const listings = 18 + (h % 40);
  const sold = 40 + (h % 120);
  const years = 3 + (h % 12);
  const rating = Number((4.2 + (h % 8) * 0.1).toFixed(1));
  const reviews = 24 + (h % 200);
  const photo =
    h % 4 === 0
      ? `https://i.pravatar.cc/240?u=${encodeURIComponent(agentId || name)}`
      : undefined;

  return {
    name,
    initials,
    title,
    location,
    areas,
    phoneLocal,
    phoneTel,
    wa,
    email: `${emailSlug}@propertyarena.ng`,
    website,
    verified,
    listings,
    sold,
    years,
    rating,
    reviews,
    photo,
    about: `${name} helps buyers, renters and investors across ${areas.join(', ')} and neighbouring corridors. With ${years}+ years on the ground, ${first} focuses on clear title conversations, honest pricing and follow-through after viewing — the unglamorous work that closes deals in Nigeria.`,
  };
}

const BASE_LISTINGS = [
  {
    id: 'demo-1',
    title: '4 Bedroom Luxury Duplex',
    location: 'Lekki Phase 1',
    price: '₦320,000,000',
    beds: 4,
    baths: 5,
    area: '450 sqm',
    type: 'sale' as const,
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
    type: 'rent' as const,
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
    type: 'sale' as const,
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop',
  },
  {
    id: 'demo-4',
    title: 'Executive Short Let Flat',
    location: 'Victoria Island',
    price: '₦150,000/night',
    beds: 2,
    baths: 2,
    area: '120 sqm',
    type: 'shortlet' as const,
    img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop',
  },
  {
    id: 'demo-5',
    title: '3 Bedroom Flat',
    location: 'Gwarinpa',
    price: '₦6,200,000/yr',
    beds: 3,
    baths: 3,
    area: '160 sqm',
    type: 'rent' as const,
    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
  },
  {
    id: 'demo-6',
    title: 'Serviced Studio Short Let',
    location: 'Wuse 2',
    price: '₦85,000/night',
    beds: 1,
    baths: 1,
    area: '55 sqm',
    type: 'shortlet' as const,
    img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
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
  const demo = useMemo(() => buildAgent(agentId || 'demo-agent'), [agentId]);
  const [agent, setAgent] = useState(demo);

  useEffect(() => {
    setAgent(demo);
    const id = agentId || '';
    if (!id || id === 'demo-agent' || id.length < 12) return;
    let cancelled = false;
    ADMIN_SERVICE.getPublicAgent(id)
      .then((res: { data?: Record<string, unknown> }) => {
        if (cancelled) return;
        const d = res.data;
        if (!d) return;
        const name = String(d.name || demo.name);
        const phoneRaw = String(d.phone || demo.phoneLocal).replace(/\D/g, '');
        const local =
          phoneRaw.length >= 10
            ? phoneRaw.startsWith('234')
              ? `0${phoneRaw.slice(3)}`
              : phoneRaw.startsWith('0')
                ? phoneRaw
                : `0${phoneRaw}`
            : demo.phoneLocal;
        const tel = local.startsWith('0') ? `+234${local.slice(1)}` : demo.phoneTel;
        const wa = tel.replace(/\D/g, '');
        setAgent({
          ...demo,
          name,
          initials: name
            .split(/\s+/)
            .map((p) => p[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
          phoneLocal: local,
          phoneTel: tel,
          wa,
          email: String(d.email || demo.email),
          website: String(d.website || demo.website),
          photo: d.avatarUrl ? String(d.avatarUrl) : demo.photo,
          verified: Boolean(d.isAgentVerified),
          location: String(d.address || demo.location),
          title: d.role === 'developer' ? 'Property Developer' : demo.title,
          about: `${name} is a PropertyArena ${d.role === 'developer' ? 'developer' : 'agent'} serving ${demo.areas.join(', ')}. Contact them directly by phone, WhatsApp or email — or visit their website for more listings.`,
        });
      })
      .catch(() => {
        /* keep demo / hashed profile */
      });
    return () => {
      cancelled = true;
    };
  }, [agentId, demo]);

  const properties = useMemo(() => {
    const rotated = [...BASE_LISTINGS];
    const offset = hashId(agentId || 'demo') % rotated.length;
    const ordered = [...rotated.slice(offset), ...rotated.slice(0, offset)].map((p, i) => ({
      ...p,
      location: agent.areas[i % agent.areas.length],
      id: `${p.id}-${agentId || 'demo'}`,
    }));
    return filter === 'all' ? ordered : ordered.filter((p) => p.type === filter);
  }, [filter, agentId, agent.areas]);

  return (
    <div className="min-h-screen bg-surface-muted">
      <SeoHead
        title={`${agent.name} — Property Agent`}
        description={agent.about.slice(0, 160)}
        path={`/agents/${agentId || 'demo-agent'}`}
        image={agent.photo}
      />
      <MarketplaceHeader />

      <section className="relative overflow-hidden border-b border-line bg-surface-elevated">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              'linear-gradient(135deg, rgba(20,80,60,0.08) 0%, transparent 45%), linear-gradient(to bottom, #0c2a3a0d, transparent 40%)',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {agent.photo ? (
              <img
                src={agent.photo}
                alt={agent.name}
                className="h-24 w-24 rounded-full object-cover ring-4 ring-brand-green/20"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-green text-3xl font-extrabold text-white ring-4 ring-brand-green/20">
                {agent.initials}
              </div>
            )}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">{agent.name}</h1>
                {agent.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-green/15 px-2.5 py-0.5 text-xs font-bold text-brand-green">
                    <FaCheckCircle /> Verified
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-ink-secondary">
                {agent.title} · <FaMapMarkerAlt className="inline text-brand-green" /> {agent.location}
              </p>
              <div className="mt-2 flex items-center gap-1 text-sm text-amber-500">
                {[1, 2, 3, 4, 5].map((i) => (
                  <FaStar key={i} className={i <= Math.round(agent.rating) ? '' : 'opacity-30'} />
                ))}
                <span className="ml-1 text-ink-secondary">
                  {agent.rating} ({agent.reviews} reviews)
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={`tel:${agent.phoneTel}`}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-dark"
              >
                <FaPhone /> Call
              </a>
              <a
                href={`https://wa.me/${agent.wa}?text=${encodeURIComponent(`Hi ${agent.name}, I found you on PropertyArena.`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95"
              >
                <FaWhatsapp /> WhatsApp
              </a>
              <a
                href={`mailto:${agent.email}`}
                className="inline-flex items-center gap-2 rounded-lg border border-line-strong px-4 py-2.5 text-sm font-semibold text-ink hover:bg-chip"
              >
                <FaEnvelope /> Email
              </a>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:max-w-xl sm:grid-cols-4">
            {[
              { label: 'Listings', value: agent.listings },
              { label: 'Sold', value: agent.sold },
              { label: 'Years', value: agent.years },
              { label: 'Rating', value: agent.rating },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-surface px-4 py-3 text-center ring-1 ring-line">
                <p className="text-xl font-extrabold text-ink">{s.value}</p>
                <p className="text-xs text-ink-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-8 lg:px-8">
        <div>
          <h2 className="text-lg font-bold text-ink">About</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{agent.about}</p>

          <h2 className="mt-8 text-lg font-bold text-ink">Service areas</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {agent.areas.map((a) => (
              <li
                key={a}
                className="rounded-full bg-brand-green/10 px-3 py-1 text-xs font-semibold text-brand-green"
              >
                {a}
              </li>
            ))}
          </ul>

          <div className="mb-6 mt-10 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold text-ink">Properties by {agent.name}</h2>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    filter === f.id
                      ? 'bg-brand-green text-white'
                      : 'bg-surface-elevated text-ink-secondary ring-1 ring-line'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <Link
                key={p.id}
                to={`/properties/${p.id}`}
                className="overflow-hidden rounded-2xl bg-surface-elevated shadow-sm ring-1 ring-line transition hover:shadow-md"
              >
                <img src={p.img} alt={p.title} className="h-40 w-full object-cover" />
                <div className="p-4">
                  <p className="font-bold text-ink">{p.title}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
                    <FaMapMarkerAlt className="text-brand-green" /> {p.location}
                  </p>
                  <p className="mt-2 font-extrabold text-brand-green">{p.price}</p>
                  <div className="mt-2 flex gap-3 text-xs text-ink-muted">
                    <span className="flex items-center gap-1">
                      <FaBed /> {p.beds}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaBath /> {p.baths}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaExpand /> {p.area}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <aside className="mt-8 space-y-4 lg:mt-0 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-surface-elevated p-5 shadow-sm ring-1 ring-line">
            <h3 className="font-bold text-ink">Contact</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-secondary">
              <li>
                <a href={`tel:${agent.phoneTel}`} className="hover:text-brand-green">
                  {agent.phoneLocal}
                </a>
              </li>
              <li>
                <a href={`mailto:${agent.email}`} className="hover:text-brand-green">
                  {agent.email}
                </a>
              </li>
              <li>
                <a
                  href={agent.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-brand-green hover:underline"
                >
                  <FaGlobe className="text-xs" /> Website
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </section>

      <SiteFooter />
    </div>
  );
};

export default AgentProfile;
