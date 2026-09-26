import { useNavigate, useLocation } from 'react-router-dom';
import { FiGrid, FiHome } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useLayoutMode } from '@/hooks/useLayoutMode';
import { useTheme } from '@/theme/ThemeProvider';
import { isWorkspaceRole } from '@/lib/workspace';
import { isBuyerRole } from '@/lib/buyer';

type Props = {
  className?: string;
  compact?: boolean;
  /** Force light-on-dark chrome; otherwise follows app theme */
  tone?: 'light' | 'dark' | 'auto';
};

/**
 * Marketplace ↔ Dashboard switcher for buyer + pro roles.
 * Respects dark mode when tone is auto.
 */
export function DashboardModeSwitcher({
  className = '',
  compact = false,
  tone = 'auto',
}: Props) {
  const { isAuthenticated, user } = useAuth();
  const { layoutMode, setLayoutMode } = useLayoutMode();
  const { theme } = useTheme();
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

  const resolvedTone =
    tone === 'auto'
      ? // Dark app theme → light-on-dark chrome; light theme → standard ink chrome
        theme === 'dark'
        ? 'light'
        : 'dark'
      : tone;

  // When following theme, prefer token-based shell so dark dashboards stay readable
  const shell =
    tone === 'auto'
      ? 'border-line bg-chip/80'
      : resolvedTone === 'light'
        ? 'border-white/20 bg-white/10'
        : 'border-line bg-surface-elevated';
  const baseBtn =
    tone === 'auto'
      ? 'text-ink-secondary hover:bg-surface-elevated'
      : resolvedTone === 'light'
        ? 'text-white/85 hover:bg-white/10'
        : 'text-ink-secondary hover:bg-chip';
  const activeBtn =
    tone === 'auto'
      ? 'bg-emerald-600 text-white shadow-sm'
      : resolvedTone === 'light'
        ? 'bg-white text-[#0b2f24] shadow-sm'
        : 'bg-emerald-600 text-white shadow-sm';

  const goMarketplace = () => {
    setLayoutMode('user');
    navigate('/');
  };

  const goDashboard = () => {
    setLayoutMode(isBuyer ? 'user' : 'main');
    navigate(dashboardHome);
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border p-0.5 ${shell} ${className}`}
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
        {compact ? <span className="hidden sm:inline">{dashboardLabel}</span> : null}
      </button>
    </div>
  );
}

export default DashboardModeSwitcher;
