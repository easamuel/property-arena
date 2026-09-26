import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FiLogOut, FiMenu, FiSearch, FiX, FiBell } from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import Logo from '@/components/brand/Logo';
import DashboardModeSwitcher from '@/components/DashboardModeSwitcher';
import {
  WORKSPACE_NAV,
  getWorkspaceCopy,
  isWorkspaceRole,
  normalizeWorkspaceRole,
  workspacePageTitle,
} from '@/lib/workspace';

const WorkspaceLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!accessToken) {
      navigate('/login', { replace: true });
      return;
    }
    if (user && !isWorkspaceRole(user.role)) {
      navigate('/dashboard', { replace: true });
    }
  }, [accessToken, user, navigate]);

  if (!accessToken || (user && !isWorkspaceRole(user.role))) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f6f4] text-sm text-gray-600">
        Checking workspace access…
      </div>
    );
  }

  const role = normalizeWorkspaceRole(user?.role);
  const copy = getWorkspaceCopy(role);
  const pageTitle = workspacePageTitle(location.pathname);
  const firstName = String(user?.name || 'there').split(' ')[0];
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  const isActive = (to: string, end?: boolean) =>
    end
      ? location.pathname === to
      : location.pathname === to || location.pathname.startsWith(`${to}/`);

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-[#0b2f24] text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <Logo size="md" to="/workspace" variant="onDark" />
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200/80">
          {copy.sectionTitle}
        </p>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {WORKSPACE_NAV.map((section) => (
          <div key={section.title}>
            <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-200/55">
              {section.title === 'Workspace' ? copy.sectionTitle : section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map(({ to, label, icon: Icon, end, badge }) => {
                const active = isActive(to, end);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      active
                        ? 'bg-[#16a34a] font-semibold text-white shadow-sm'
                        : 'text-white/85 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0 opacity-90" />
                    <span className="min-w-0 flex-1 leading-tight">{label}</span>
                    {badge ? (
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                          active ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
                        }`}
                      >
                        {badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-white/90 transition hover:bg-white/10 hover:text-white"
        >
          <FiLogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f3f6f4] font-sans">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">{sidebar}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/45"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[min(18rem,88vw)] shadow-2xl">{sidebar}</div>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col lg:ml-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-emerald-900/8 bg-white/95 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-[#0b2f24] hover:bg-emerald-50 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>

          <h1 className="shrink-0 text-lg font-bold text-[#0b2f24] sm:text-xl">{pageTitle}</h1>

          <div className="hidden md:block">
            <DashboardModeSwitcher />
          </div>

          <div className="mx-auto hidden max-w-xl flex-1 lg:block">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search properties, clients, enquiries…"
                className="w-full rounded-full border border-gray-200 bg-[#f8faf8] py-2 pl-10 pr-4 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <div className="md:hidden">
              <DashboardModeSwitcher compact />
            </div>
            <Link
              to="/workspace/notifications"
              className="relative rounded-full p-2 text-gray-600 hover:bg-emerald-50 hover:text-[#0b2f24]"
              aria-label="Notifications"
            >
              <FiBell size={18} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b2f24] text-sm font-bold text-white">
                {firstName.slice(0, 1).toUpperCase()}
              </div>
              <div className="hidden text-sm sm:block">
                <p className="font-semibold text-gray-900">{firstName}</p>
                <p className="text-xs text-gray-500">{roleLabel}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
