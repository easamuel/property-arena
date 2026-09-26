// src/components/SideBar.tsx
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaPlusCircle,
  FaListAlt,
  FaRegCreditCard,
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaSearch,
  FaMapMarkedAlt,
  FaClipboardList,
  FaBuilding,
  FaComments,
  FaCalendarAlt,
  FaChartBar,
  FaHandshake,
  FaBell,
  FaCog,
  FaQuestionCircle,
  FaEnvelope,
  FaTags,
  FaUsers,
  FaShieldAlt,
} from 'react-icons/fa';
import { useAuthStore } from '@/store/authStore';
import { useLayoutMode } from '@/hooks/useLayoutMode';
import Logo from '@/components/brand/Logo';

type Tab = { name: string; icon: React.ReactNode; route: string; end?: boolean };

const PRO_TABS: Tab[] = [
  { name: 'Dashboard', icon: <FaTachometerAlt />, route: '/workspace', end: true },
  { name: 'Post a Property', icon: <FaPlusCircle />, route: '/workspace/post-property' },
  { name: 'My Listings', icon: <FaListAlt />, route: '/workspace/listings' },
  { name: 'Buyer Requests', icon: <FaUsers />, route: '/workspace/buyer-requests' },
  { name: 'Messages', icon: <FaComments />, route: '/workspace/messages' },
  { name: 'Leads & Enquiries', icon: <FaEnvelope />, route: '/workspace/leads' },
  { name: 'Bookings & Inspections', icon: <FaCalendarAlt />, route: '/workspace/bookings' },
  { name: 'Deals', icon: <FaHandshake />, route: '/workspace/deals' },
  { name: 'Reports', icon: <FaChartBar />, route: '/workspace/reports' },
  { name: 'Packages & Pricing', icon: <FaTags />, route: '/workspace/packages' },
  { name: 'Subscription', icon: <FaRegCreditCard />, route: '/workspace/subscription' },
  { name: 'Billing History', icon: <FaClipboardList />, route: '/workspace/billing' },
  { name: 'Profile', icon: <FaUser />, route: '/workspace/profile' },
  { name: 'Get Verified (KYC)', icon: <FaShieldAlt />, route: '/workspace/kyc' },
  { name: 'Notifications', icon: <FaBell />, route: '/workspace/notifications' },
  { name: 'Settings', icon: <FaCog />, route: '/workspace/settings' },
  { name: 'Help & Support', icon: <FaQuestionCircle />, route: '/workspace/help' },
];

const TABS_BY_ROLE: Record<string, Tab[]> = {
  user: [
    { name: 'Dashboard', icon: <FaTachometerAlt />, route: '/buyer', end: true },
    { name: 'Saved', icon: <FaSearch />, route: '/buyer/saved' },
    { name: 'My requests', icon: <FaClipboardList />, route: '/dashboard/requests' },
    { name: 'Neighbourhoods', icon: <FaMapMarkedAlt />, route: '/neighbourhood' },
    { name: 'Profile', icon: <FaUser />, route: '/buyer/settings' },
  ],
  agent: PRO_TABS,
  agency: PRO_TABS,
  developer: PRO_TABS,
  landlord: PRO_TABS,
  admin: [
    { name: 'Dashboard', icon: <FaTachometerAlt />, route: '/dashboard', end: true },
    { name: 'Admin console', icon: <FaBuilding />, route: '/admin' },
    { name: 'Profile', icon: <FaUser />, route: '/profile' },
  ],
};

type SideBarProps = {
  onClose?: () => void;
};

const SideBar: React.FC<SideBarProps> = ({ onClose }) => {
  const logout = useAuthStore((state) => state.logout);
  const role = String(useAuthStore((state) => state.user?.role) || 'user').toLowerCase();
  const navigate = useNavigate();
  const { setLayoutMode } = useLayoutMode();
  const tabs = TABS_BY_ROLE[role] || TABS_BY_ROLE.user;
  const isPro = ['agent', 'agency', 'developer', 'landlord'].includes(role);

  const goMarketplaceHome = () => {
    setLayoutMode('user');
    navigate('/');
    onClose?.();
  };

  const handleLogout = () => {
    logout();
    setLayoutMode('user');
    navigate('/login');
    onClose?.();
  };

  return (
    <div className="flex h-full min-h-dvh w-full flex-col bg-[#0b2f24] text-white">
      <div className="flex items-center justify-between gap-2 px-4 pb-2 pt-4 md:pt-5">
        <Logo
          size="md"
          to={isPro ? '/workspace' : '/'}
          className="max-w-[9.5rem]"
          onNavigate={() => {
            if (!isPro) setLayoutMode('user');
            onClose?.();
          }}
        />
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg md:hidden"
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      <p className="px-5 pb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200/55">
        {role === 'user' ? 'Buyer / Tenant' : `${role} workspace`}
      </p>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        <button
          type="button"
          onClick={goMarketplaceHome}
          className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left text-white/90 transition hover:bg-white/10"
        >
          <span className="text-base text-brand-green">
            <FaHome />
          </span>
          <span className="text-sm font-medium">Marketplace home</span>
        </button>

        {tabs.map((tab) => (
          <NavLink
            key={tab.route + tab.name}
            to={tab.route}
            end={tab.end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 transition ${
                isActive
                  ? 'bg-[#16a34a] text-white shadow-lg shadow-black/20'
                  : 'text-white/85 hover:bg-white/10'
              }`
            }
          >
            <span className="text-base">{tab.icon}</span>
            <span className="text-sm font-medium">{tab.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-white/90 transition hover:bg-white/10"
        >
          <FaSignOutAlt />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
