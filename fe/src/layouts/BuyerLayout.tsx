import { FormEvent, useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  FiBell,
  FiHeart,
  FiLogOut,
  FiMenu,
  FiMessageSquare,
  FiMoon,
  FiSearch,
  FiSun,
  FiX,
} from 'react-icons/fi';
import Logo from '@/components/brand/Logo';
import DashboardModeSwitcher from '@/components/DashboardModeSwitcher';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/theme/ThemeProvider';
import { BUYER_NAV, buyerPageTitle, isBuyerRole } from '@/lib/buyer';
import { isWorkspaceRole } from '@/lib/workspace';
import { getSavedCount, subscribeSaved } from '@/lib/savedListings';

const BuyerLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    setSavedCount(getSavedCount());
    return subscribeSaved(() => setSavedCount(getSavedCount()));
  }, []);

  useEffect(() => {
    if (!accessToken) {
      navigate('/login', { replace: true });
      return;
    }
    if (user?.role?.toLowerCase() === 'admin') {
      navigate('/admin', { replace: true });
      return;
    }
    if (isWorkspaceRole(user?.role)) {
      navigate('/workspace', { replace: true });
    }
  }, [accessToken, user, navigate]);

  if (!accessToken || !user || isWorkspaceRole(user.role) || user.role?.toLowerCase() === 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-muted text-sm text-ink-muted">
        Loading your account…
      </div>
    );
  }

  if (!isBuyerRole(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-muted text-sm text-ink-muted">
        Redirecting…
      </div>
    );
  }

  const firstName = String(user.name || 'there').split(' ')[0];
  const pageTitle = buyerPageTitle(location.pathname);

  const isActive = (to: string, end?: boolean) =>
    end
      ? location.pathname === to
      : location.pathname === to || location.pathname.startsWith(`${to}/`);

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/properties?q=${encodeURIComponent(q)}` : '/properties');
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-surface-elevated">
      <div className="flex items-center justify-between border-b border-line px-4 py-4 lg:hidden">
        <p className="text-sm font-bold text-ink">Menu</p>
        <button
          type="button"
          className="rounded-lg p-2 text-ink-muted hover:bg-chip"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <FiX size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {BUYER_NAV.map(({ to, label, icon: Icon, end, badge }) => {
          const active = isActive(to, end);
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                active
                  ? 'bg-emerald-50 font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                  : 'text-ink-secondary hover:bg-chip hover:text-ink'
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-emerald-600' : 'text-ink-muted'}`} />
              <span className="min-w-0 flex-1">{label}</span>
              {badge ? (
                <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-line p-4">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-secondary transition hover:bg-chip hover:text-ink"
        >
          <FiLogOut className="h-4 w-4" />
          Sign Out
        </button>

        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/70 p-4 dark:from-emerald-500/10 dark:to-emerald-500/5">
          <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">List your property</p>
          <p className="mt-1 text-xs leading-relaxed text-emerald-800/80 dark:text-emerald-200/70">
            Reach serious buyers and tenants across Nigeria.
          </p>
          <Link
            to="/sell"
            className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
          >
            Post Property
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-muted text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-surface-elevated/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-3 sm:px-5 lg:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-ink hover:bg-chip lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <FiMenu size={20} />
          </button>

          <Logo size="sm" to="/" className="shrink-0" />

          <div className="hidden sm:block">
            <DashboardModeSwitcher />
          </div>

          <form onSubmit={onSearch} className="mx-auto hidden min-w-0 max-w-xl flex-1 md:block">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for properties, locations…"
                className="w-full rounded-full border border-line bg-field py-2.5 pl-4 pr-12 text-sm text-ink placeholder:text-ink-muted focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-600 text-white transition hover:bg-emerald-700"
                aria-label="Search"
              >
                <FiSearch size={14} />
              </button>
            </div>
          </form>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <div className="sm:hidden">
              <DashboardModeSwitcher compact />
            </div>
            <button
              type="button"
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="rounded-full p-2 text-ink-muted transition hover:bg-chip hover:text-ink"
            >
              {theme === 'dark' ? <FiSun className="text-amber-400" size={18} /> : <FiMoon size={18} />}
            </button>
            {savedCount > 0 ? (
              <Link
                to="/buyer/saved"
                className="relative hidden items-center gap-1.5 rounded-full px-2.5 py-2 text-sm text-brand-red transition hover:bg-chip sm:inline-flex"
                aria-label={`Saved (${savedCount})`}
              >
                <FiHeart className="fill-current" />
                <span className="hidden lg:inline">Saved</span>
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-bold text-white sm:static sm:ml-0.5">
                  {savedCount > 9 ? '9+' : savedCount}
                </span>
              </Link>
            ) : null}
            <Link
              to="/buyer/alerts"
              className="relative rounded-full p-2 text-ink-muted transition hover:bg-chip"
              aria-label="Alerts"
            >
              <FiBell size={18} />
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                3
              </span>
            </Link>
            <Link
              to="/buyer/messages"
              className="relative rounded-full p-2 text-ink-muted transition hover:bg-chip"
              aria-label="Messages"
            >
              <FiMessageSquare size={18} />
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                2
              </span>
            </Link>
            <Link
              to="/buyer/settings"
              className="ml-1 hidden items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-chip sm:flex"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                {firstName.slice(0, 1).toUpperCase()}
              </span>
              <span className="hidden text-sm font-semibold text-ink md:inline">{firstName}</span>
            </Link>
          </div>
        </div>

        <form onSubmit={onSearch} className="border-t border-line px-3 py-2 md:hidden">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search properties, locations…"
              className="w-full rounded-full border border-line bg-field py-2.5 pl-4 pr-12 text-sm text-ink focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-600 text-white"
              aria-label="Search"
            >
              <FiSearch size={14} />
            </button>
          </div>
        </form>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu overlay"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[min(20rem,88vw)] overflow-y-auto shadow-2xl">
            {sidebar}
          </aside>
        </div>
      ) : null}

      <div className="mx-auto grid max-w-[1400px] gap-0 lg:grid-cols-[15.5rem_minmax(0,1fr)]">
        <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] overflow-y-auto border-r border-line bg-surface-elevated lg:block">
          {sidebar}
        </aside>

        <div className="min-w-0">
          <div className="px-3 pb-2 pt-4 sm:px-5 lg:hidden">
            <h1 className="text-lg font-bold text-ink">{pageTitle}</h1>
          </div>
          <main className="min-h-[70vh] px-3 py-4 sm:px-5 sm:py-5 lg:px-6">
            <Outlet />
          </main>
          <footer className="flex flex-col gap-2 border-t border-line px-3 py-4 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-5 lg:px-6">
            <p>© {new Date().getFullYear()} PropertyArena. All rights reserved.</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/terms" className="hover:text-emerald-700">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="hover:text-emerald-700">
                Privacy Policy
              </Link>
              <Link to="/help" className="hover:text-emerald-700">
                Help
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default BuyerLayout;
