import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiBell,
  FiCalendar,
  FiCheckCircle,
  FiHeart,
  FiMapPin,
  FiMessageSquare,
  FiTrendingUp,
} from 'react-icons/fi';
import { FaBath, FaBed, FaCar } from 'react-icons/fa';
import { useAuthStore } from '@/store/authStore';
import {
  BUYER_ACTIVITY,
  BUYER_RECOMMENDED,
  BUYER_STATS,
} from '@/data/buyer-demo';
import { BuyerCard, BuyerSectionTitle, BuyerStatus, buyerTone } from '@/components/buyer/BuyerUi';

const statIcons = {
  saved: FiHeart,
  alerts: FiBell,
  messages: FiMessageSquare,
  appointments: FiCalendar,
};

export default function BuyerHome() {
  const user = useAuthStore((s) => s.user);
  const firstName = String(user?.name || 'there').split(' ')[0];
  const memberYear = user?.createdAt
    ? new Date(user.createdAt).getFullYear()
    : new Date().getFullYear();

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_18.5rem]">
      <div className="min-w-0 space-y-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Welcome back, {firstName}{' '}
            <span aria-hidden className="buyer-wave">
              👋
            </span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Your saved homes, alerts, and upcoming viewings — all in one place.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {BUYER_STATS.map((stat) => {
            const Icon = statIcons[stat.key as keyof typeof statIcons] || FiHeart;
            return (
              <BuyerCard key={stat.key} className="p-3.5 sm:p-4">
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${buyerTone[stat.tone]}`}
                  >
                    <Icon size={16} />
                  </span>
                  <Link
                    to={stat.to}
                    className="text-[11px] font-semibold text-emerald-700 hover:underline"
                  >
                    View all
                  </Link>
                </div>
                <p className="mt-3 text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">{stat.label}</p>
              </BuyerCard>
            );
          })}
        </div>

        <section>
          <BuyerSectionTitle
            title="Recommended for you"
            action={
              <Link to="/properties" className="text-xs font-bold text-emerald-700 hover:underline">
                Browse all
              </Link>
            }
          />
          <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
            {BUYER_RECOMMENDED.map((item) => (
              <Link
                key={item.id}
                to="/properties"
                className="group w-[min(78vw,16.5rem)] shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_10px_30px_-18px_rgba(15,23,42,0.28)] transition hover:-translate-y-0.5 hover:shadow-md sm:w-64"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.thumb}
                    alt=""
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {item.verified ? (
                    <span className="absolute left-2 top-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      Verified
                    </span>
                  ) : null}
                  <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-emerald-600 shadow-sm">
                    <FiHeart />
                  </span>
                </div>
                <div className="p-3.5">
                  <p className="text-base font-bold text-gray-900">
                    {item.price}
                    {item.period ? (
                      <span className="text-xs font-medium text-gray-500">{item.period}</span>
                    ) : null}
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-gray-800">{item.title}</p>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-gray-500">
                    <FiMapPin className="shrink-0" /> {item.location}
                  </p>
                  <div className="mt-2.5 flex items-center gap-3 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <FaBed className="text-emerald-600" /> {item.beds}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <FaBath className="text-emerald-600" /> {item.baths}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <FaCar className="text-emerald-600" /> {item.parking}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <BuyerCard>
          <div className="border-b border-gray-100 px-4 py-3 sm:px-5">
            <h2 className="text-base font-bold text-gray-900">Recent Activity</h2>
          </div>
          <ul className="divide-y divide-gray-100">
            {BUYER_ACTIVITY.map((row) => (
              <li key={row.id} className="flex items-start gap-3 px-4 py-3.5 sm:px-5">
                <span
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    row.kind === 'saved'
                      ? buyerTone.green
                      : row.kind === 'alert'
                        ? buyerTone.amber
                        : row.kind === 'message'
                          ? buyerTone.purple
                          : buyerTone.blue
                  }`}
                >
                  {row.kind === 'saved' ? (
                    <FiHeart size={15} />
                  ) : row.kind === 'alert' ? (
                    <FiBell size={15} />
                  ) : row.kind === 'message' ? (
                    <FiMessageSquare size={15} />
                  ) : (
                    <FiCalendar size={15} />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800">{row.text}</p>
                  <p className="mt-0.5 text-xs text-gray-400">{row.time}</p>
                </div>
                {row.status ? <BuyerStatus status={row.status} /> : null}
                {row.thumb ? (
                  <img src={row.thumb} alt="" className="h-11 w-14 rounded-lg object-cover" />
                ) : null}
              </li>
            ))}
          </ul>
        </BuyerCard>
      </div>

      <aside className="space-y-4">
        <BuyerCard className="p-4 sm:p-5">
          <h3 className="text-sm font-bold text-gray-900">Account Overview</h3>
          <div className="mt-3 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
              {firstName.slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold text-gray-900">{user?.name || 'Member'}</p>
              <p className="truncate text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500">Member since {memberYear}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <FiCheckCircle /> Verified
          </div>
        </BuyerCard>

        <BuyerCard className="p-4 sm:p-5">
          <h3 className="text-sm font-bold text-gray-900">Quick Links</h3>
          <ul className="mt-3 space-y-1">
            {[
              { to: '/buyer/settings', label: 'Become a Verified Buyer' },
              { to: '/sell', label: 'Post a Property' },
              { to: '/buyer/alerts', label: 'Manage Alerts' },
              { to: '/buyer/settings', label: 'Help & Support' },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="flex items-center justify-between rounded-xl px-2 py-2 text-sm text-gray-600 transition hover:bg-emerald-50 hover:text-emerald-800"
                >
                  {link.label}
                  <FiArrowRight className="text-emerald-600" />
                </Link>
              </li>
            ))}
          </ul>
        </BuyerCard>

        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-500 p-5 text-white shadow-lg">
          <p className="text-lg font-bold">Go Premium</p>
          <p className="mt-1 text-sm text-emerald-50/90">
            Unlock exclusive deals, faster alerts, and priority support.
          </p>
          <Link
            to="/subscription"
            className="mt-4 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
          >
            Upgrade Now
          </Link>
        </div>

        <BuyerCard className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-gray-900">Market Insights</h3>
            <span className="text-[11px] text-gray-400">Lagos · This month</span>
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs text-gray-500">Average Property Price</p>
              <p className="mt-0.5 text-xl font-bold text-gray-900">₦320,000,000</p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <FiTrendingUp /> +8.5%
              </p>
              <svg viewBox="0 0 160 40" className="mt-2 h-10 w-full" aria-hidden>
                <polyline
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2.5"
                  points="0,28 20,24 40,26 60,18 80,20 100,12 120,14 140,8 160,10"
                />
              </svg>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-500">New Listings</p>
              <p className="mt-0.5 text-xl font-bold text-gray-900">1,245</p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <FiTrendingUp /> +12.3%
              </p>
            </div>
          </div>
        </BuyerCard>
      </aside>
    </div>
  );
}
