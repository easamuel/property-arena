import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { IconType } from 'react-icons';
import {
  FiArrowRight,
  FiBriefcase,
  FiHome,
  FiKey,
  FiLayers,
  FiMapPin,
  FiPlus,
  FiSearch,
  FiSend,
  FiTrendingUp,
} from 'react-icons/fi';
import { PROPERTY_SERVICE } from '@/services/property';
import { useAuthStore } from '@/store/authStore';

type Listing = {
  id?: string;
  _id?: string;
  title?: string;
  status?: string;
  price?: number;
  location?: string;
  address?: string;
  city?: string;
  state?: string;
};

type AccountRole = 'user' | 'agent' | 'developer' | 'landlord' | 'admin';

type Action = { to: string; label: string; sub: string; icon: IconType };
type Tile = { title: string; body: string; to: string; cta: string };
type StatDef = {
  label: string;
  value: (ctx: { total: number; available: number; draftish: number; loading: boolean; error: boolean }) => string;
  hint: string;
  icon: IconType;
};

type RoleDesk = {
  badge: string;
  tagline: string;
  primary: { to: string; label: string; icon: IconType };
  secondary: { to: string; label: string; icon: IconType };
  stats: StatDef[];
  actions: Action[];
  boardTitle: string;
  boardHint: string;
  showListings: boolean;
  emptyTitle: string;
  emptyBody: string;
  emptyCta?: { to: string; label: string };
  tiles?: Tile[];
};

const ROLE_DESKS: Record<AccountRole, RoleDesk> = {
  user: {
    badge: 'Buyer / Tenant arena',
    tagline:
      'Search homes, post what you need, and track agent responses — built for you, not for listers.',
    primary: { to: '/properties', label: 'Explore listings', icon: FiSearch },
    secondary: { to: '/request-property', label: 'Request a property', icon: FiHome },
    stats: [
      {
        label: 'Your path',
        value: () => 'Browse',
        hint: 'Start with live inventory',
        icon: FiSearch,
      },
      {
        label: 'Neighbourhoods',
        value: () => '50+',
        hint: 'Guides across Nigeria',
        icon: FiMapPin,
      },
      {
        label: 'Next step',
        value: () => 'Request',
        hint: 'Tell agents your brief',
        icon: FiSend,
      },
    ],
    actions: [
      { to: '/properties', label: 'Buy & rent', sub: 'Nationwide search', icon: FiSearch },
      { to: '/request-property', label: 'Post a request', sub: 'Agents come to you', icon: FiSend },
      { to: '/neighbourhood', label: 'Area guides', sub: 'Lifestyle before lease', icon: FiMapPin },
      { to: '/dashboard/requests', label: 'My requests', sub: 'Track responses', icon: FiHome },
    ],
    boardTitle: 'Your next moves',
    boardHint: 'No listing board — just the routes that get you a viewing.',
    showListings: false,
    emptyTitle: '',
    emptyBody: '',
    tiles: [
      {
        title: 'Tell the market what you need',
        body: 'Budget, beds, area — agents respond with matches.',
        to: '/request-property',
        cta: 'Post request',
      },
      {
        title: 'Browse live inventory',
        body: 'For sale, rent, short let and land — Nigeria-wide.',
        to: '/properties',
        cta: 'Open marketplace',
      },
      {
        title: 'Read the neighbourhood',
        body: 'Depth like NPC, clarity like PropertyArena.',
        to: '/neighbourhood',
        cta: 'Explore guides',
      },
    ],
  },
  agent: {
    badge: 'Agent arena',
    tagline: 'Listings, buyer requests and featured reach — your deal desk.',
    primary: { to: '/create-property', label: 'Post a property', icon: FiPlus },
    secondary: { to: '/requests', label: 'Browse buyer requests', icon: FiSend },
    stats: [
      {
        label: 'Your listings',
        value: ({ total, loading, error }) => (loading ? '…' : error ? '—' : String(total)),
        hint: 'Live inventory',
        icon: FiBriefcase,
      },
      {
        label: 'Available now',
        value: ({ available, loading, error }) =>
          loading ? '…' : error ? '—' : String(available),
        hint: 'Ready for enquiries',
        icon: FiTrendingUp,
      },
      {
        label: 'In progress',
        value: ({ draftish, loading, error }) =>
          loading ? '…' : error ? '—' : String(draftish),
        hint: 'Draft / other status',
        icon: FiMapPin,
      },
    ],
    actions: [
      { to: '/create-property', label: 'List a home', sub: 'Photos, price, purpose', icon: FiPlus },
      { to: '/my-listing', label: 'Manage listings', sub: 'Edit & feature', icon: FiBriefcase },
      { to: '/requests', label: 'Buyer requests', sub: 'Match inventory', icon: FiSend },
      { to: '/subscription', label: 'Grow reach', sub: 'Plans & featured slots', icon: FiTrendingUp },
    ],
    boardTitle: 'My agency listings',
    boardHint: 'Status, price and place — your operations strip.',
    showListings: true,
    emptyTitle: 'Your board is empty',
    emptyBody: 'Drop your first listing and ride the wave of enquiries.',
    emptyCta: { to: '/create-property', label: 'Create listing' },
  },
  developer: {
    badge: 'Developer arena',
    tagline: 'Showcase projects and units — stock, release and sell with clarity.',
    primary: { to: '/create-property', label: 'Add a unit / project', icon: FiLayers },
    secondary: { to: '/subscription', label: 'Boost project reach', icon: FiTrendingUp },
    stats: [
      {
        label: 'Units listed',
        value: ({ total, loading, error }) => (loading ? '…' : error ? '—' : String(total)),
        hint: 'Project inventory',
        icon: FiLayers,
      },
      {
        label: 'On market',
        value: ({ available, loading, error }) =>
          loading ? '…' : error ? '—' : String(available),
        hint: 'Available to buyers',
        icon: FiTrendingUp,
      },
      {
        label: 'Pipeline',
        value: ({ draftish, loading, error }) =>
          loading ? '…' : error ? '—' : String(draftish),
        hint: 'Coming soon / draft',
        icon: FiBriefcase,
      },
    ],
    actions: [
      { to: '/create-property', label: 'Add inventory', sub: 'Units & estates', icon: FiPlus },
      { to: '/my-listing', label: 'Project stock', sub: 'Edit & publish', icon: FiLayers },
      { to: '/subscription', label: 'Feature projects', sub: 'Premium placement', icon: FiTrendingUp },
      { to: '/sell', label: 'Sell with guidance', sub: 'Post Property flow', icon: FiHome },
    ],
    boardTitle: 'Project & unit inventory',
    boardHint: 'Developer stock desk — not a general agent board.',
    showListings: true,
    emptyTitle: 'No units yet',
    emptyBody: 'Add your first project unit so buyers can find you.',
    emptyCta: { to: '/create-property', label: 'Add unit' },
  },
  landlord: {
    badge: 'Landlord arena',
    tagline: 'Rent out your properties, track availability, and fill vacancies faster.',
    primary: { to: '/create-property', label: 'List a rental', icon: FiKey },
    secondary: { to: '/my-listing', label: 'Manage rentals', icon: FiHome },
    stats: [
      {
        label: 'Your rentals',
        value: ({ total, loading, error }) => (loading ? '…' : error ? '—' : String(total)),
        hint: 'Properties you own',
        icon: FiKey,
      },
      {
        label: 'Vacant / available',
        value: ({ available, loading, error }) =>
          loading ? '…' : error ? '—' : String(available),
        hint: 'Open for tenants',
        icon: FiHome,
      },
      {
        label: 'Other status',
        value: ({ draftish, loading, error }) =>
          loading ? '…' : error ? '—' : String(draftish),
        hint: 'Occupied / draft',
        icon: FiMapPin,
      },
    ],
    actions: [
      { to: '/create-property', label: 'List for rent', sub: 'Flats, houses, short let', icon: FiPlus },
      { to: '/my-listing', label: 'My rentals', sub: 'Edit availability', icon: FiKey },
      { to: '/subscription', label: 'Get more tenants', sub: 'Featured rentals', icon: FiTrendingUp },
      { to: '/sell', label: 'Post Property', sub: 'Guided listing path', icon: FiHome },
    ],
    boardTitle: 'My rental properties',
    boardHint: 'Landlord inventory — rent-first, not agency CRM.',
    showListings: true,
    emptyTitle: 'No rentals listed',
    emptyBody: 'List a vacancy and let serious tenants find you.',
    emptyCta: { to: '/create-property', label: 'List a rental' },
  },
  admin: {
    badge: 'Admin',
    tagline: 'Platform control lives in the admin console.',
    primary: { to: '/admin', label: 'Open admin', icon: FiBriefcase },
    secondary: { to: '/dashboard', label: 'Stay here', icon: FiHome },
    stats: [
      {
        label: 'Console',
        value: () => 'Admin',
        hint: 'Users, listings, payments',
        icon: FiBriefcase,
      },
      {
        label: 'Listings (you)',
        value: ({ total, loading, error }) => (loading ? '…' : error ? '—' : String(total)),
        hint: 'Personal listings if any',
        icon: FiHome,
      },
      {
        label: 'Available',
        value: ({ available, loading, error }) =>
          loading ? '…' : error ? '—' : String(available),
        hint: 'Your available stock',
        icon: FiTrendingUp,
      },
    ],
    actions: [
      { to: '/admin', label: 'Admin home', sub: 'Full control panel', icon: FiBriefcase },
      { to: '/admin/properties', label: 'Moderate listings', sub: 'Approve / reject', icon: FiHome },
      { to: '/admin/users', label: 'Users', sub: 'Roles & access', icon: FiSend },
      { to: '/admin/reports', label: 'Reports', sub: 'Platform health', icon: FiTrendingUp },
    ],
    boardTitle: 'Your listings (optional)',
    boardHint: 'Admin work happens under /admin — this is personal stock only.',
    showListings: true,
    emptyTitle: 'No personal listings',
    emptyBody: 'Use the admin console for platform work.',
    emptyCta: { to: '/admin', label: 'Go to admin' },
  },
};

const normalizeRole = (raw?: string): AccountRole => {
  const r = String(raw || 'user').toLowerCase();
  if (r === 'agent' || r === 'developer' || r === 'landlord' || r === 'admin' || r === 'user') {
    return r;
  }
  return 'user';
};

const WaveBand = () => (
  <svg
    className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full text-[#0b3d2e]"
    viewBox="0 0 1440 64"
    preserveAspectRatio="none"
    aria-hidden={true}
  >
    <path
      fill="currentColor"
      d="M0,32 C240,64 480,0 720,24 C960,48 1200,56 1440,16 L1440,64 L0,64 Z"
      className="opacity-90"
    />
    <path
      fill="currentColor"
      d="M0,40 C200,8 400,56 720,40 C1040,24 1240,8 1440,36 L1440,64 L0,64 Z"
      className="opacity-40"
    />
  </svg>
);

const Dashboard = () => {
  const user = useAuthStore((s) => s.user);
  const role = normalizeRole(user?.role);
  const desk = ROLE_DESKS[role];
  const firstName = String(user?.name || 'there').split(' ')[0];

  const [rows, setRows] = useState<Listing[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(desk.showListings);

  useEffect(() => {
    if (!desk.showListings) {
      setLoading(false);
      setRows([]);
      setError('');
      return;
    }
    let cancelled = false;
    setLoading(true);
    PROPERTY_SERVICE.getUserProperties(1, 20)
      .then((res) => {
        if (cancelled) return;
        setRows((res as { data?: Listing[] }).data || []);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message || 'Could not load your listings');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [desk.showListings, role]);

  const stats = useMemo(() => {
    const available = rows.filter((r) => (r.status || '').toLowerCase() === 'available').length;
    return { total: rows.length, available, draftish: rows.length - available };
  }, [rows]);

  const PrimaryIcon = desk.primary.icon;
  const SecondaryIcon = desk.secondary.icon;

  return (
    <div className="relative min-h-full overflow-hidden bg-[#f3f7f4]">
      <div
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#5dbb46]/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 top-40 h-80 w-80 rounded-full bg-[#0f7a4a]/15 blur-3xl"
        aria-hidden
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0b3d2e] via-[#145c3f] to-[#1a7a4c] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 40%, #fff 1px, transparent 1px)',
            backgroundSize: '28px 28px, 42px 42px',
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-3 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-10 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200/90 sm:text-xs">
            {desk.badge}
          </p>
          <h1 className="mt-2 max-w-2xl font-serif text-[1.85rem] font-bold leading-tight tracking-tight sm:mt-3 sm:text-4xl md:text-5xl">
            Welcome back, {firstName}.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-emerald-50/85 sm:text-base">{desk.tagline}</p>

          <div className="mt-6 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:flex-wrap sm:gap-3">
            <Link
              to={desk.primary.to}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#0b3d2e] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-emerald-50"
            >
              <PrimaryIcon /> {desk.primary.label}
            </Link>
            <Link
              to={desk.secondary.to}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              <SecondaryIcon /> {desk.secondary.label}
            </Link>
          </div>
        </div>
        <WaveBand />
      </section>

      <div className="relative z-10 mx-auto -mt-5 max-w-6xl space-y-6 px-3 pb-12 sm:-mt-6 sm:space-y-8 sm:px-6 sm:pb-14 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {desk.stats.map((card, i) => (
            <div
              key={card.label}
              className="group relative overflow-hidden rounded-[1.35rem] bg-white/95 p-4 shadow-[0_18px_40px_-28px_rgba(11,61,46,0.45)] ring-1 ring-emerald-900/5 backdrop-blur transition duration-300 hover:-translate-y-1 sm:p-5"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-[#5dbb46]/20 to-transparent transition group-hover:scale-110" />
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800/55">
                    {card.label}
                  </p>
                  <p className="mt-1.5 font-serif text-2xl font-bold text-[#0b3d2e] sm:mt-2 sm:text-3xl">
                    {card.value({ ...stats, loading, error: Boolean(error) })}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">{card.hint}</p>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#0b3d2e]/8 text-[#0b3d2e] sm:h-10 sm:w-10">
                  <card.icon size={18} />
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
          {desk.actions.map((action) => (
            <Link
              key={`${action.to}-${action.label}`}
              to={action.to}
              className="flex items-center gap-3 rounded-[1.25rem] bg-white/80 px-3.5 py-3 ring-1 ring-emerald-900/5 transition hover:bg-white hover:shadow-md sm:px-4"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5dbb46]/15 text-[#0b3d2e]">
                <action.icon size={16} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-[#0b3d2e]">{action.label}</span>
                <span className="block truncate text-xs text-gray-500">{action.sub}</span>
              </span>
              <FiArrowRight className="shrink-0 text-brand-green" />
            </Link>
          ))}
        </div>

        {error && desk.showListings && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <section className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_24px_60px_-36px_rgba(11,61,46,0.55)] ring-1 ring-emerald-900/5">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-emerald-900/5 px-4 py-4 sm:px-6">
            <div className="min-w-0">
              <h2 className="font-serif text-lg font-bold text-[#0b3d2e] sm:text-xl">{desk.boardTitle}</h2>
              <p className="mt-0.5 text-xs text-gray-500">{desk.boardHint}</p>
            </div>
            {desk.showListings && desk.emptyCta && (
              <Link
                to={desk.emptyCta.to}
                className="text-sm font-bold text-brand-green-dark hover:underline"
              >
                {desk.emptyCta.label}
              </Link>
            )}
          </div>

          {desk.showListings ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#f3f7f4] text-[11px] uppercase tracking-wider text-emerald-900/50">
                  <tr>
                    <th className="px-5 py-3 sm:px-6">Title</th>
                    <th className="px-5 py-3 sm:px-6">Location</th>
                    <th className="px-5 py-3 sm:px-6">Price</th>
                    <th className="px-5 py-3 sm:px-6">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.id || row._id}
                      className="border-t border-emerald-900/5 transition hover:bg-emerald-50/40"
                    >
                      <td className="px-5 py-3.5 font-semibold text-[#0b3d2e] sm:px-6">
                        {row.title}
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 sm:px-6">
                        {row.location ||
                          row.address ||
                          [row.city, row.state].filter(Boolean).join(', ') ||
                          '—'}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-[#0b3d2e] sm:px-6">
                        {row.price != null ? `₦${Number(row.price).toLocaleString()}` : '—'}
                      </td>
                      <td className="px-5 py-3.5 sm:px-6">
                        <span className="inline-flex rounded-full bg-[#5dbb46]/12 px-2.5 py-0.5 text-xs font-semibold capitalize text-[#0b3d2e]">
                          {row.status || '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!rows.length && !error && !loading && (
                    <tr>
                      <td colSpan={4} className="px-5 py-12 text-center sm:px-6">
                        <p className="font-serif text-lg font-bold text-[#0b3d2e]">
                          {desk.emptyTitle}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">{desk.emptyBody}</p>
                        {desk.emptyCta && (
                          <Link
                            to={desk.emptyCta.to}
                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0b3d2e] px-4 py-2 text-sm font-bold text-white hover:bg-[#145c3f]"
                          >
                            <FiPlus /> {desk.emptyCta.label}
                          </Link>
                        )}
                      </td>
                    </tr>
                  )}
                  {loading && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-10 text-center text-sm text-gray-500 sm:px-6"
                      >
                        Loading your listings…
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
              {(desk.tiles || []).map((tile) => (
                <div
                  key={tile.to}
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#f3f7f4] to-white p-5 ring-1 ring-emerald-900/5"
                >
                  <div className="absolute -bottom-8 -right-6 h-24 w-24 rounded-full bg-[#5dbb46]/15" />
                  <h3 className="relative font-serif text-lg font-bold text-[#0b3d2e]">
                    {tile.title}
                  </h3>
                  <p className="relative mt-2 text-sm text-gray-600">{tile.body}</p>
                  <Link
                    to={tile.to}
                    className="relative mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-green-dark hover:underline"
                  >
                    {tile.cta} <FiArrowRight />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
