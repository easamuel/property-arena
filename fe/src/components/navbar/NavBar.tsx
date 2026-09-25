import { FaBell, FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ROLE_ENUM } from '@/constants';
import { useLayoutMode } from '@/hooks/useLayoutMode';

const NavBar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsModalOpen((prev) => !prev);
  const closeDropdown = () => setIsModalOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const { setLayoutMode } = useLayoutMode();

  const ALLOWED_MAIN_LAYOUT_ROLES = [
    ROLE_ENUM.ADMIN,
    ROLE_ENUM.AGENT,
    ROLE_ENUM.LANDLORD,
    ROLE_ENUM.DEVELOPER,
  ];

  const canAccessMainLayout = isAuthenticated && ALLOWED_MAIN_LAYOUT_ROLES.includes(user?.role);

  const handleSwitchToMainLayout = () => {
    setLayoutMode('main');
    closeDropdown();
    closeMobileMenu();
    navigate('/dashboard');
  };

  // Define green color for reuse
  const primaryGreen = '#5FBB47';

  const navigationLinks = [
    { label: 'Buy', to: '/buy' },
    { label: 'Rent', to: '/rent' },
    { label: 'Shortlet', to: '/shortlet' },
    { label: 'Agents', to: '/agents' },
    { label: 'Services', to: '/services' },
    { label: 'Sell A property', to: '/sell' },
    { label: 'Buy a property', to: '/buy' },
    { label: 'Blog', to: '/blog' },
  ];

  return (
    <>
      <div className="h-16 bg-white px-6 shadow-lg relative z-50 rounded-md">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-black cursor-pointer">
            <img
              src="https://res.cloudinary.com/dhhknhoo2/image/upload/v1751968463/property-arena/LOGO-2_jkdasi.jpg"
              alt="Logo"
              className="h-12 w-12 object-contain"
            />
            <span className="text-xl font-extrabold text-primary-red">PropertyArena</span>
          </Link>


          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex gap-6 flex-grow justify-center">
            {navigationLinks.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="text-[--color-primary-green] hover:underline whitespace-nowrap"
                style={{ color: primaryGreen }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right Side - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Post a property button */}
            <button
              type="button"
              onClick={handleSwitchToMainLayout}
              className="px-4 py-2 rounded text-white font-semibold"
              style={{ backgroundColor: primaryGreen }}
            >
              Post a property
            </button>

            {isAuthenticated ? (
              <>
                <button className="relative" style={{ color: primaryGreen }}>
                  <FaBell className="text-xl" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-primary-red rounded-full" />
                </button>

                <div className="relative">
                  <div
                    onClick={toggleDropdown}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <img
                      src="https://i.pravatar.cc/300"
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover border-2 border-white"
                    />
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

                        {canAccessMainLayout && (
                          <button
                            onClick={handleSwitchToMainLayout}
                            className="text-sm bg-primary-red text-white px-4 py-2 rounded hover:bg-secondary-red"
                            type="button"
                          >
                            Switch to Post Property
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
                  className="text-sm px-4 py-1 rounded border font-semibold"
                  style={{ color: primaryGreen, borderColor: primaryGreen, backgroundColor: 'white' }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-sm px-4 py-1 rounded font-semibold"
                  style={{ backgroundColor: primaryGreen, color: 'white' }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Side */}
          <div className="lg:hidden flex items-center gap-4">
            {isAuthenticated && (
              <button className="relative" style={{ color: primaryGreen }}>
                <FaBell className="text-xl" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-primary-red rounded-full" />
              </button>
            )}

            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="p-2"
              style={{ color: primaryGreen }}
            >
              {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div className={`fixed top-16 right-0 w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="p-6">
          {/* User Section for Mobile */}
          {isAuthenticated && (
            <div className="mb-6 pb-6 border-b">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="https://i.pravatar.cc/300"
                  alt="User"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white"
                />
                <div>
                  <p className="text-lg font-semibold">{user?.name}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="text-sm hover:bg-gray-100 px-3 py-2 rounded"
                >
                  My Profile
                </Link>

                {canAccessMainLayout && (
                  <button
                    onClick={handleSwitchToMainLayout}
                    className="text-sm bg-primary-red text-white px-4 py-2 rounded hover:bg-secondary-red text-left"
                    type="button"
                  >
                    Switch to Post Property
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="mb-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: primaryGreen }}>
              Navigation
            </h3>
            <div className="flex flex-col space-y-3">
              {navigationLinks.map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  onClick={closeMobileMenu}
                  className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded"
                  style={{
                    borderLeft: `3px solid ${primaryGreen}`,
                    paddingLeft: '12px'
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleSwitchToMainLayout}
              className="w-full px-4 py-3 rounded text-white font-semibold"
              style={{ backgroundColor: primaryGreen }}
            >
              Post a property
            </button>

            {!isAuthenticated ? (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex-1 text-center text-sm px-4 py-2 rounded border font-semibold"
                  style={{ color: primaryGreen, borderColor: primaryGreen, backgroundColor: 'white' }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMobileMenu}
                  className="flex-1 text-center text-sm px-4 py-2 rounded font-semibold"
                  style={{ backgroundColor: primaryGreen, color: 'white' }}
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  logout();
                  closeMobileMenu();
                }}
                className="w-full text-sm text-red-600 hover:bg-gray-100 px-4 py-3 rounded border border-red-200"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Overlay to close user dropdown */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeDropdown}
        />
      )}
    </>
  );
};

export default NavBar;