import { useNavigate, useLocation } from 'react-router-dom';
import { FiGrid, FiHome } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useLayoutMode } from '@/hooks/useLayoutMode';
import { isWorkspaceRole } from '@/lib/workspace';
import { isBuyerRole } from '@/lib/buyer';

type Props = {
  className?: string;
  /** Compact pill for cramped headers */
  compact?: boolean;
  /** Light text on dark dashboards */
  tone?: 'light' | 'dark';
};

/**
 * Marketplace ↔ Dashboard switcher for buyer + pro roles.
 * Works from homepage chrome and from /buyer or /workspace shells.
 */
export function DashboardModeSwitcher({
  className = '',
  compact = false,
  tone = 'dark',
}: Props) {
  const { isAuthenticated, user } = useAuth();
  const { layoutMode, setLayoutMode } = useLayoutMode();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (!isAuthenticated || !user) return null;

  const role = String(user.role || '').toLowerCase();
  const isPro = isWorkspaceRole(role);
  const isBuyer = isBuyerRole(role);
  const isAdmin = role === 'admin';

  if (!isPro && !isBuyer && !isAdmin) return null;

  const onDashboard =
    pathname.startsWith('/workspace') ||
    pathname.startsWith('/buyer') ||
    pathname.startsWith('/admin') ||
    layoutMode === 'main';

  const dashboardHome = isAdmin ? '/admin' : isPro ? '/workspace' : '/buyer';
  const dashboardLabel = isAdmin ? 'Admin' : isPro ? 'Workspace' : 'My account';

  const goMarketplace = () => {
    setLayoutMode('user');
    navigate('/');
  };

  const goDashboard = () => {
    setLayoutMode(isBuyer ? 'user' : 'main');
    navigate(dashboardHome);
  };

  const baseBtn =
    tone === 'light'
      ? 'border-white/25 text-white hover:bg-white/10'
      : 'border-gray-200 text-gray-700 hover:bg-gray-50';
  const activeBtn =
    tone === 'light'
      ? 'bg-white text-[#0b2f24] border-white'
      : 'bg-emerald-600 text-white border-emerald-600';

  return (
    <div
      className={`inline-flex items-center rounded-full border p-0.5 ${
        tone === 'light' ? 'border-white/20 bg-white/10' : 'border-gray-200 bg-white'
      } ${className}`}
      role="group"
      aria-label="View mode"
    >
      <button
        type="button"
        onClick={goMarketplace}
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold transition sm:px-3 ${
          !onDashboard ? activeBtn : baseBtn
        }`}
      >
        <FiHome className="h-3.5 w-3.5" />
        {!compact ? <span>Marketplace</span> : null}
      </button>
      <button
        type="button"
        onClick={goDashboard}
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold transition sm:px-3 ${
          onDashboard ? activeBtn : baseBtn
        }`}
      >
        <FiGrid className="h-3.5 w-3.5" />
        {!compact ? <span>{dashboardLabel}</span> : <span className="sm:hidden">Dash</span>}
        {!compact ? null : <span className="hidden sm:inline">{dashboardLabel}</span>}
      </button>
    </div>
  );
}

export default DashboardModeSwitcher;
