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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const handleHomeClick = () => {
    setLayoutMode('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen w-64 bg-sec-dark-blue text-white">
      <div className="flex items-center justify-between px-4 py-3 md:hidden">
        <span className="font-bold">Menu</span>
        <button type="button" onClick={onClose} className="text-xl text-white">
          ✕
        </button>
      </div>

      <div className="mb-6 flex items-center justify-center px-4 pt-5">
        <Logo size="md" />
      </div>
      <div className="p-4">
        <p className="mb-3 px-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
          {role === 'user' ? 'Buyer / Tenant' : role}
        </p>
        <nav className="space-y-2">
          <div className="mb-6">
            <button
              type="button"
              onClick={handleHomeClick}
              className="flex w-full items-center gap-3 rounded-md px-4 py-2 text-white transition-colors hover:bg-gray-800"
            >
              <span className="text-lg">
                <FaHome />
              </span>
              <span className="text-sm font-medium">Marketplace</span>
            </button>
          </div>
          {tabs.map((tab) => (
            <NavLink
              key={tab.route + tab.name}
              to={tab.route}
              end={tab.route === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-md px-4 py-2 transition-colors ${
                  isActive ? 'bg-white text-black' : 'text-white hover:bg-gray-800'
                }`
              }
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-sm font-medium">{tab.name}</span>
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 flex w-full items-center gap-3 rounded-md px-4 py-2 text-white transition-colors hover:bg-gray-800"
        >
          <span className="text-lg">
            <FaSignOutAlt />
          </span>
          <span className="text-sm font-medium">Sign out</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
