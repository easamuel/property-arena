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
  FaKey,
  FaLayerGroup,
} from 'react-icons/fa';
import { useAuthStore } from '@/store/authStore';
import { useLayoutMode } from '@/hooks/useLayoutMode';
import Logo from '@/components/brand/Logo';

type Tab = { name: string; icon: React.ReactNode; route: string };

const TABS_BY_ROLE: Record<string, Tab[]> = {
  user: [
    { name: 'Dashboard', icon: <FaTachometerAlt />, route: '/dashboard' },
    { name: 'Browse', icon: <FaSearch />, route: '/properties' },
    { name: 'My requests', icon: <FaClipboardList />, route: '/dashboard/requests' },
    { name: 'Neighbourhoods', icon: <FaMapMarkedAlt />, route: '/neighbourhood' },
    { name: 'Profile', icon: <FaUser />, route: '/profile' },
  ],
  agent: [
    { name: 'Dashboard', icon: <FaTachometerAlt />, route: '/dashboard' },
    { name: 'Post a property', icon: <FaPlusCircle />, route: '/create-property' },
    { name: 'My listings', icon: <FaListAlt />, route: '/my-listing' },
    { name: 'Buyer requests', icon: <FaClipboardList />, route: '/requests' },
    { name: 'Subscription', icon: <FaRegCreditCard />, route: '/subscription' },
    { name: 'Profile', icon: <FaUser />, route: '/profile' },
  ],
  developer: [
    { name: 'Dashboard', icon: <FaTachometerAlt />, route: '/dashboard' },
    { name: 'Add unit / project', icon: <FaLayerGroup />, route: '/create-property' },
    { name: 'Project stock', icon: <FaBuilding />, route: '/my-listing' },
    { name: 'Subscription', icon: <FaRegCreditCard />, route: '/subscription' },
    { name: 'Profile', icon: <FaUser />, route: '/profile' },
  ],
  landlord: [
    { name: 'Dashboard', icon: <FaTachometerAlt />, route: '/dashboard' },
    { name: 'List a rental', icon: <FaKey />, route: '/create-property' },
    { name: 'My rentals', icon: <FaHome />, route: '/my-listing' },
    { name: 'Subscription', icon: <FaRegCreditCard />, route: '/subscription' },
    { name: 'Profile', icon: <FaUser />, route: '/profile' },
  ],
  admin: [
    { name: 'Dashboard', icon: <FaTachometerAlt />, route: '/dashboard' },
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
    <div className="flex h-full min-h-dvh w-full flex-col bg-gradient-to-b from-[#12141c] to-[#0c0e14] text-white">
      <div className="flex items-center justify-between gap-2 px-4 pb-2 pt-4 md:pt-5">
        <Logo
          size="md"
          className="max-w-[9.5rem]"
          onNavigate={() => {
            setLayoutMode('user');
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

      <p className="px-5 pb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
        {role === 'user' ? 'Buyer / Tenant' : role} workspace
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
            end={tab.route === '/dashboard'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 transition ${
                isActive
                  ? 'bg-white text-[#0b3d2e] shadow-lg shadow-black/20'
                  : 'text-white/85 hover:bg-white/10'
              }`
            }
          >
            <span className="text-base">{tab.icon}</span>
            <span className="text-sm font-medium">{tab.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          <span className="text-base">
            <FaSignOutAlt />
          </span>
          <span className="text-sm font-medium">Sign out</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
