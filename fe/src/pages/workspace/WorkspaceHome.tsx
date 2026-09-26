import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiCalendar,
  FiMessageSquare,
  FiPlus,
  FiSend,
  FiTrendingUp,
  FiUsers,
  FiBriefcase,
  FiBarChart2,
} from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import { getWorkspaceCopy } from '@/lib/workspace';
import {
  WS_ENQUIRIES,
  WS_LISTINGS,
  WS_MESSAGES,
  WS_PERFORMANCE,
  WS_STATS,
  formatNaira,
} from '@/data/workspace-demo';
import { WsPanel, WsSectionHeader, WsStatus } from '@/components/workspace/WsUi';

function PerformanceChart() {
  const max = Math.max(...WS_PERFORMANCE.map((p) => p.views), 1);
  const w = 560;
  const h = 180;
  const pad = 16;
  const points = WS_PERFORMANCE.map((p, i) => {
    const x = pad + (i * (w - pad * 2)) / (WS_PERFORMANCE.length - 1);
    const y = h - pad - (p.views / max) * (h - pad * 2);
    return `${x},${y}`;
  }).join(' ');
  const enquiryPoints = WS_PERFORMANCE.map((p, i) => {
    const x = pad + (i * (w - pad * 2)) / (WS_PERFORMANCE.length - 1);
    const y = h - pad - (p.enquiries / max) * (h - pad * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="px-4 pb-4 pt-2 sm:px-5">
      <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-600" /> Property views
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-sky-500" /> Enquiries
        </span>
        <span className="ml-auto rounded-full border border-gray-200 px-2.5 py-1 text-[11px] font-medium">
          Last 7 days
        </span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-44 w-full" role="img" aria-label="Listing performance chart">
        <polyline fill="none" stroke="#059669" strokeWidth="3" strokeLinejoin="round" points={points} />
        <polyline fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinejoin="round" points={enquiryPoints} />
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-gray-400">
        {WS_PERFORMANCE.map((p) => (
          <span key={p.day}>{p.day.replace('Sep ', '')}</span>
        ))}
      </div>
    </div>
  );
}

export default function WorkspaceHome() {
  const user = useAuthStore((s) => s.user);
  const copy = getWorkspaceCopy(user?.role);
  const firstName = String(user?.name || 'there').split(' ')[0];

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b2f24] via-[#0f4a38] to-[#166534] text-white shadow-lg">
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&h=400&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b2f24]/95 via-[#0b2f24]/80 to-[#0b2f24]/45" />
        <div className="relative flex flex-col gap-6 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-7">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-200/90">
              {copy.arenaLabel}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back, {firstName}.
            </h2>
            <p className="mt-2 text-sm text-emerald-50/85">{copy.welcomeHint}</p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link
                to="/workspace/post-property"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-[#0b2f24] transition hover:bg-emerald-50"
              >
                <FiPlus /> {copy.primaryCta}
              </Link>
              <Link
                to="/workspace/buyer-requests"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
              >
                <FiSend /> {copy.secondaryCta}
              </Link>
            </div>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm sm:min-w-[11rem]">
            <p className="text-xs font-medium text-emerald-100/80">Your Performance</p>
            <p className="mt-1 text-lg font-bold">8 Active Listings</p>
            <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-emerald-300">
              <FiTrendingUp /> +33%
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {WS_STATS.map((stat) => (
          <WsPanel key={stat.key} className="p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              {stat.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-[#0b2f24]">{stat.value}</p>
            <div className="mt-1 flex items-center justify-between gap-2 text-xs">
              <span className="text-gray-500">{stat.hint}</span>
              {stat.trend ? <span className="font-semibold text-emerald-600">{stat.trend}</span> : null}
            </div>
          </WsPanel>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <WsPanel className="lg:col-span-2">
          <WsSectionHeader title="Your Listing Performance" />
          <PerformanceChart />
        </WsPanel>

        <WsPanel>
          <WsSectionHeader
            title="Recent Messages"
            action={
              <Link to="/workspace/messages" className="text-xs font-bold text-emerald-700 hover:underline">
                View all
              </Link>
            }
          />
          <ul className="divide-y divide-emerald-900/5">
            {WS_MESSAGES.slice(0, 4).map((msg) => (
              <li key={msg.id}>
                <Link
                  to="/workspace/messages"
                  className="flex items-start gap-3 px-4 py-3 transition hover:bg-emerald-50/50 sm:px-5"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: msg.color }}
                  >
                    {msg.initials}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-[#0b2f24]">{msg.name}</span>
                      <span className="shrink-0 text-[11px] text-gray-400">{msg.time}</span>
                    </span>
                    <span className="mt-0.5 line-clamp-1 text-xs text-gray-500">{msg.snippet}</span>
                  </span>
                  {msg.unread ? (
                    <span className="mt-1 rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                      {msg.unread}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </WsPanel>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <WsPanel className="xl:col-span-2">
          <WsSectionHeader
            title={copy.listingsLabel}
            action={
              <Link to="/workspace/listings" className="text-xs font-bold text-emerald-700 hover:underline">
                View all
              </Link>
            }
          />
          <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4 sm:p-5">
            {WS_LISTINGS.map((listing) => (
              <Link
                key={listing.id}
                to="/workspace/listings"
                className="group overflow-hidden rounded-xl border border-emerald-900/5 bg-[#f8faf8] transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={listing.thumb}
                    alt=""
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-2 top-2">
                    <WsStatus status={listing.status} />
                  </span>
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-bold text-[#0b2f24]">{listing.title}</p>
                  <p className="mt-0.5 truncate text-xs text-gray-500">{listing.location}</p>
                  <p className="mt-2 text-sm font-bold text-emerald-700">{formatNaira(listing.price)}</p>
                  <p className="mt-1 text-[11px] text-gray-400">{listing.views} views</p>
                </div>
              </Link>
            ))}
          </div>
        </WsPanel>

        <div className="space-y-5">
          <WsPanel>
            <WsSectionHeader title="Quick Actions" />
            <div className="grid grid-cols-2 gap-2 p-4">
              {[
                { to: '/workspace/post-property', label: 'Post a Property', icon: FiPlus },
                { to: '/workspace/listings', label: 'Manage Listings', icon: FiBriefcase },
                { to: '/workspace/buyer-requests', label: 'Buyer Requests', icon: FiUsers },
                { to: '/workspace/reports', label: 'View Reports', icon: FiBarChart2 },
              ].map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex flex-col items-start gap-2 rounded-xl border border-emerald-900/5 bg-[#f8faf8] p-3 text-left transition hover:border-emerald-600/30 hover:bg-white"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <Icon size={15} />
                  </span>
                  <span className="text-xs font-semibold text-[#0b2f24]">{label}</span>
                </Link>
              ))}
            </div>
          </WsPanel>

          <WsPanel>
            <WsSectionHeader
              title="Recent Enquiries"
              action={
                <Link to="/workspace/leads" className="text-xs font-bold text-emerald-700 hover:underline">
                  View all
                </Link>
              }
            />
            <ul className="divide-y divide-emerald-900/5">
              {WS_ENQUIRIES.map((row) => (
                <li key={row.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                  <img src={row.thumb} alt="" className="h-10 w-12 rounded-md object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#0b2f24]">{row.property}</p>
                    <p className="truncate text-xs text-gray-500">
                      {row.contact} · {row.time}
                    </p>
                  </div>
                  <WsStatus status={row.status} />
                </li>
              ))}
            </ul>
          </WsPanel>

          <div className="rounded-2xl bg-gradient-to-br from-[#0b2f24] to-[#166534] p-5 text-white">
            <p className="text-sm font-bold">Get More Visibility with Featured Listings</p>
            <p className="mt-1 text-xs text-emerald-100/80">
              Upgrade your package to appear higher in search.
            </p>
            <Link
              to="/workspace/packages"
              className="mt-4 inline-flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-xs font-bold text-[#0b2f24]"
            >
              Upgrade Package <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { to: '/workspace/messages', label: 'Open inbox', icon: FiMessageSquare, hint: '5 unread' },
          { to: '/workspace/bookings', label: 'Inspections', icon: FiCalendar, hint: '6 this month' },
          { to: '/workspace/deals', label: 'Deal pipeline', icon: FiTrendingUp, hint: '3 active' },
        ].map(({ to, label, icon: Icon, hint }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-3 rounded-2xl border border-emerald-900/5 bg-white p-4 transition hover:shadow-md"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Icon />
            </span>
            <span>
              <span className="block text-sm font-bold text-[#0b2f24]">{label}</span>
              <span className="text-xs text-gray-500">{hint}</span>
            </span>
            <FiArrowRight className="ml-auto text-emerald-600" />
          </Link>
        ))}
      </div>
    </div>
  );
}
