import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiBriefcase,
  FiHome,
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
  purpose?: string;
  views?: number;
};

const PRO_ROLES = new Set(['agent', 'developer', 'landlord', 'admin']);

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
  const role = String(user?.role || 'user').toLowerCase();
  const isPro = PRO_ROLES.has(role);
  const firstName = String(user?.name || 'there').split(' ')[0];

  const [rows, setRows] = useState<Listing[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  const stats = useMemo(() => {
    const available = rows.filter((r) => (r.status || '').toLowerCase() === 'available').length;
    const draftish = rows.length - available;
    return { total: rows.length, available, draftish };
  }, [rows]);

  return (
    <div className="relative min-h-full overflow-hidden bg-[#f3f7f4]">
      {/* Atmosphere */}
      <div
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#5dbb46]/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 top-40 h-80 w-80 rounded-full bg-[#0f7a4a]/15 blur-3xl"
        aria-hidden
      />

      {/* Wavy hero */}
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
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200/90">
            Your arena
          </p>
          <h1 className="mt-3 max-w-2xl font-serif text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            Welcome back, {firstName}.
          </h1>
          <p className="mt-3 max-w-xl text-sm text-emerald-50/85 sm:text-base">
            {isPro
              ? 'Listings, leads and neighbourhood demand — one wavy strip away from your next deal.'
              : 'Save searches, post requests, and move from browsing to booked viewing without the noise.'}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {isPro ? (
              <>
                <Link
                  to="/create-property"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#0b3d2e] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-emerald-50"
                >
                  <FiPlus /> Post a property
                </Link>
                <Link
                  to="/requests"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >
                  <FiSend /> Browse buyer requests
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/properties"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#0b3d2e] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-emerald-50"
                >
                  <FiSearch /> Explore listings
                </Link>
                <Link
                  to="/request-property"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >
                  <FiHome /> Request a property
                </Link>
              </>
            )}
          </div>
        </div>
        <WaveBand />
      </section>

      <div className="relative z-10 mx-auto -mt-6 max-w-6xl space-y-8 px-4 pb-14 sm:px-6 lg:px-8">
        {/* Pulse stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: isPro ? 'Your listings' : 'Saved journey',
              value: loading ? '…' : error ? '—' : String(stats.total),
              hint: isPro ? 'Live inventory' : 'Start with a request',
              icon: FiBriefcase,
            },
            {
              label: isPro ? 'Available now' : 'Neighbourhoods',
              value: loading ? '…' : error ? '—' : isPro ? String(stats.available) : '50+',
              hint: isPro ? 'Ready for enquiries' : 'Guides across Nigeria',
              icon: FiTrendingUp,
            },
            {
              label: isPro ? 'In progress' : 'Next step',
              value: loading ? '…' : error ? '—' : isPro ? String(stats.draftish) : 'Request',
              hint: isPro ? 'Draft / other status' : 'Tell agents what you need',
              icon: FiMapPin,
            },
          ].map((card, i) => (
            <div
              key={card.label}
              className="group relative overflow-hidden rounded-2xl border border-emerald-900/5 bg-white/90 p-5 shadow-[0_18px_40px_-28px_rgba(11,61,46,0.45)] backdrop-blur transition duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-[#5dbb46]/25 to-transparent transition group-hover:scale-110" />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800/55">
                    {card.label}
                  </p>
                  <p className="mt-2 font-serif text-3xl font-bold text-[#0b3d2e]">{card.value}</p>
                  <p className="mt-1 text-xs text-gray-500">{card.hint}</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b3d2e]/8 text-[#0b3d2e]">
                  <card.icon size={18} />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action ribbon — NPC/PropertyPro density, PropertyArena personality */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(isPro
            ? [
                { to: '/create-property', label: 'List a home', sub: 'Photos, price, purpose', icon: FiPlus },
                { to: '/my-listing', label: 'Manage listings', sub: 'Edit & feature', icon: FiBriefcase },
                { to: '/subscription', label: 'Grow reach', sub: 'Plans & featured slots', icon: FiTrendingUp },
                { to: '/sell', label: 'Post Property', sub: 'Guided seller path', icon: FiHome },
              ]
            : [
                { to: '/properties', label: 'Buy & rent', sub: 'Nationwide search', icon: FiSearch },
                { to: '/request-property', label: 'Post a request', sub: 'Agents come to you', icon: FiSend },
                { to: '/neighbourhood', label: 'Area guides', sub: 'Lifestyle before lease', icon: FiMapPin },
                { to: '/dashboard/requests', label: 'My requests', sub: 'Track responses', icon: FiHome },
              ]
          ).map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="flex items-center gap-3 rounded-2xl border border-dashed border-emerald-800/15 bg-[#0b3d2e]/[0.03] px-4 py-3 transition hover:border-brand-green hover:bg-white hover:shadow-md"
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

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {/* Listings / empty state */}
        <section className="overflow-hidden rounded-3xl border border-emerald-900/5 bg-white shadow-[0_24px_60px_-36px_rgba(11,61,46,0.55)]">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-emerald-900/5 px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#0b3d2e]">
                {isPro ? 'My properties' : 'Your next moves'}
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                {isPro
                  ? 'A cleaner Operations strip than classic Nigeria portals — status, price, place.'
                  : 'No cluttered lead tables — just the paths that get you a viewing.'}
              </p>
            </div>
            {isPro && (
              <Link
                to="/create-property"
                className="text-sm font-bold text-brand-green-dark hover:underline"
              >
                Post a property
              </Link>
            )}
          </div>

          {isPro ? (
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
                        {row.location || row.address || [row.city, row.state].filter(Boolean).join(', ') || '—'}
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
                          Your board is empty
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Drop your first listing and ride the wave of enquiries.
                        </p>
                        <Link
                          to="/create-property"
                          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0b3d2e] px-4 py-2 text-sm font-bold text-white hover:bg-[#145c3f]"
                        >
                          <FiPlus /> Create listing
                        </Link>
                      </td>
                    </tr>
                  )}
                  {loading && (
                    <tr>
                      <td colSpan={4} className="px-5 py-10 text-center text-sm text-gray-500 sm:px-6">
                        Loading your listings…
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
              {[
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
                  body: 'Guides shaped like NPC depth, with PropertyArena clarity.',
                  to: '/neighbourhood',
                  cta: 'Explore guides',
                },
              ].map((tile) => (
                <div
                  key={tile.to}
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#f3f7f4] to-white p-5 ring-1 ring-emerald-900/5"
                >
                  <div className="absolute -bottom-8 -right-6 h-24 w-24 rounded-full bg-[#5dbb46]/15" />
                  <h3 className="relative font-serif text-lg font-bold text-[#0b3d2e]">{tile.title}</h3>
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
