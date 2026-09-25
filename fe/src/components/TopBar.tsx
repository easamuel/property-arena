import { FaBell, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ROLE_ENUM } from '@/constants';
import { useLayoutMode } from '@/hooks/useLayoutMode';

const Topbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { layoutMode, setLayoutMode } = useLayoutMode();

  const toggleDropdown = () => setIsModalOpen((prev) => !prev);
  const closeDropdown = () => setIsModalOpen(false);

  const ALLOWED_MAIN_LAYOUT_ROLES = [
    ROLE_ENUM.ADMIN,
    ROLE_ENUM.AGENT,
    ROLE_ENUM.LANDLORD,
    ROLE_ENUM.DEVELOPER,
  ];

  const canSwitchLayout = isAuthenticated && ALLOWED_MAIN_LAYOUT_ROLES.includes(user?.role);

  const handleSwitchLayout = () => {
    setLayoutMode(layoutMode === 'main' ? 'user' : 'main');
    closeDropdown();
  };

  return (
    <div className="h-12 bg-sec-dark-blue text-white px-6 shadow relative z-50">
      <div className="flex justify-between items-center h-12">
        <div className="text-xl font-semibold"></div>

        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link to="/messages" aria-label="Messages" className="relative">
                <FaBell className="text-xl" />
              </Link>

              <div className="relative">
                <div
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-brand-green text-sm font-bold uppercase">
                    {(user?.name || user?.email || 'U').slice(0, 1)}
                  </span>
                  <FaChevronDown className="text-sm" />
                </div>

                {isModalOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded shadow-lg p-4 z-50">
                    <div className="mb-2">
                      <p className="text-lg font-semibold">{user?.name}</p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>

                    <hr className="my-2" />

                    <div className="flex flex-col space-y-2">
                      <Link
                        to="/profile"
                        onClick={closeDropdown}
                        className="hover:bg-gray-100 px-2 py-1 rounded text-sm"
                      >
                        My Profile
                      </Link>
                      {canSwitchLayout && (
                        <button
                          type="button"
                          onClick={handleSwitchLayout}
                          className="text-left text-sm font-semibold bg-primary-green text-white hover:bg-primary-green-hover px-2 py-1 rounded"
                        >
                          Switch to {layoutMode === 'main' ? 'User' : 'Main'} Layout
                        </button>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          closeDropdown();
                        }}
                        className="text-left text-sm text-red-600 hover:bg-gray-100 px-2 py-1 rounded"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm bg-white text-black px-4 py-1 rounded hover:bg-gray-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm bg-brand-green px-4 py-1 rounded hover:bg-brand-green-dark"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Click outside to close modal (optional enhancement) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeDropdown}
        />
      )}
    </div>
  );
};

export default Topbar;
