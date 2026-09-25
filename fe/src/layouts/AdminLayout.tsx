import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  FiBarChart2,
  FiCalendar,
  FiCreditCard,
  FiFileText,
  FiGrid,
  FiHelpCircle,
  FiHome,
  FiImage,
  FiLogOut,
  FiRadio,
  FiPackage,
  FiPlus,
  FiSearch,
  FiSettings,
  FiUsers,
  FiUserCheck,
  FiBriefcase,
  FiMessageSquare,
  FiRepeat,
  FiBookOpen,
} from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import Logo from '@/components/brand/Logo';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/create-property', label: 'Post a Property', icon: FiPlus },
  { to: '/admin/properties', label: 'Properties', icon: FiHome },
  { to: '/admin/users', label: 'Users', icon: FiUsers },
  { to: '/admin/agents', label: 'Agents', icon: FiUserCheck },
  { to: '/admin/developers', label: 'Developers', icon: FiBriefcase },
  { to: '/admin/leads', label: 'Leads & Enquiries', icon: FiMessageSquare },
  { to: '/admin/bookings', label: 'Bookings & Inspections', icon: FiCalendar },
  { to: '/admin/transactions', label: 'Transactions', icon: FiRepeat },
  { to: '/admin/payments', label: 'Payments', icon: FiCreditCard },
  { to: '/admin/packages', label: 'Packages & Pricing', icon: FiPackage },
  { to: '/admin/promotions', label: 'Promotions & Ads', icon: FiRadio },
  { to: '/admin/media', label: 'Media Library', icon: FiImage },
  { to: '/admin/reports', label: 'Reports & Analytics', icon: FiBarChart2 },
  { to: '/admin/pages', label: 'Pages Management', icon: FiFileText },
  { to: '/admin/articles', label: 'Articles & Guides', icon: FiBookOpen },
  { to: '/admin/settings', label: 'Settings', icon: FiSettings },
];

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/post-property': 'Post a Property',
  '/admin/properties': 'Properties',
  '/admin/users': 'Users',
  '/admin/agents': 'Agents',
  '/admin/developers': 'Developers',
  '/admin/leads': 'Leads & Enquiries',
  '/admin/bookings': 'Bookings & Inspections',
  '/admin/transactions': 'Transactions',
  '/admin/payments': 'Payments',
  '/admin/packages': 'Packages & Pricing',
  '/admin/promotions': 'Promotions & Ads',
  '/admin/media': 'Media Library',
  '/admin/reports': 'Reports & Analytics',
  '/admin/pages': 'Pages Management',
  '/admin/articles': 'Articles & Guides',
  '/admin/blog': 'Blog Management',
  '/admin/settings': 'Settings',
};

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!accessToken) {
      navigate('/login', { replace: true });
      return;
    }
    if (user && user.role?.toLowerCase() !== 'admin') {
      navigate('/', { replace: true });
    }
  }, [accessToken, user, navigate]);

  if (!accessToken || (user && user.role?.toLowerCase() !== 'admin')) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f5f7] text-sm text-gray-600">
        Checking admin access…
      </div>
    );
  }

  const pageTitle =
    NAV_ITEMS.find((item) =>
      item.end ? location.pathname === item.to : location.pathname.startsWith(item.to) && item.to !== '/admin'
    )?.label ?? PAGE_TITLES[location.pathname] ?? 'Admin';

  const isActive = (to: string, end?: boolean) =>
    end ? location.pathname === to : location.pathname === to || location.pathname.startsWith(`${to}/`);

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#f4f5f7] font-sans">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-admin-red text-white">
        <div className="border-b border-white/10 px-5 py-5">
          <Logo size="md" to="/admin" />
          <p className="mt-1 text-[10px] uppercase tracking-wider text-white/70">…your property, our priority</p>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => {
            const active = isActive(to, end);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active ? 'bg-white/15 font-semibold' : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0 opacity-90" />
                <span className="leading-tight">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 border-t border-white/10 p-4">
          <div className="rounded-xl bg-black/15 p-4">
            <FiHelpCircle className="mb-2 h-5 w-5" />
            <p className="text-sm font-semibold">Need Help?</p>
            <p className="mt-1 text-xs text-white/80">Our support team is here to help.</p>
            <button
              type="button"
              className="mt-3 w-full rounded-lg bg-white py-2 text-xs font-semibold text-admin-red"
            >
              Contact Support
            </button>
          </div>
          <Link to="/" className="flex items-center gap-2 text-sm text-white/90 hover:text-white">
            <FiHome className="h-4 w-4" />
            Back to Main Site
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 text-sm text-white/90 hover:text-white"
          >
            <FiLogOut className="h-4 w-4" />
            Signout
          </button>
        </div>
      </aside>

      <div className="ml-64 flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6">
          <h1 className="shrink-0 text-xl font-bold text-gray-900">{pageTitle}</h1>
          <div className="mx-auto hidden max-w-xl flex-1 md:block">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search properties, users, orders…"
                className="w-full rounded-full border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-admin-red focus:outline-none focus:ring-1 focus:ring-admin-red"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-green text-sm font-bold text-white">
              {(user?.name || 'A').slice(0, 1).toUpperCase()}
            </div>
            <div className="hidden text-sm sm:block">
              <p className="font-semibold text-gray-900">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500">{user?.role || 'admin'}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
