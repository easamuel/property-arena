/* eslint-disable @typescript-eslint/no-unused-vars */
import { FaBell, FaChevronDown, FaSearch } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ROLE_ENUM } from '@/constants';
import { useLayoutMode } from '@/hooks/useLayoutMode';

const NavBarr = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsModalOpen((prev) => !prev);
  const closeDropdown = () => setIsModalOpen(false);
  const { setLayoutMode } = useLayoutMode();

  const ALLOWED_MAIN_LAYOUT_ROLES = [
    ROLE_ENUM.ADMIN,
    ROLE_ENUM.AGENT,
    ROLE_ENUM.LANDLORD,
    ROLE_ENUM.DEVELOPER,
  ];

  const canAccessMainLayout = isAuthenticated && ALLOWED_MAIN_LAYOUT_ROLES.includes(user?.role);

  const handleSwitchToMainLayout = () => {
    setLayoutMode('main');    // Switch to Main layout
    closeDropdown();
    navigate('/dashboard'); // or '/dashboard' or wherever you want
  };


  return (
    <div className="h-16 bg-white text-white px-6 shadow-lg relative z-50 rounded-md">
      <div className="flex justify-between items-center h-full">
        {/* Logo */}
        <div className="flex items-center bg-white text-black gap-2">
          <img
            src="https://res.cloudinary.com/dhhknhoo2/image/upload/v1751968463/property-arena/LOGO-2_jkdasi.jpg"
            alt="Logo"
            className="h-12 w-12 object-contain"
          />
          <span className="text-xl font-extrabold text-primary-red">PropertyArena</span>
        </div>

        {/* Search Bar - Centered */}
        <div className="flex-grow px-10">
          <div className="relative max-w-md">
            <input
              name='search'
              type="text"
              placeholder="Search properties..."
              className="w-full pr-12 pl-4 py-2 rounded-md border-[8px] text-black border-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green"
            />
            <div className="absolute h-full right-0 top-1/2 -translate-y-1/2 bg-primary-green p-2 rounded-md flex items-center">
              <FaSearch className="text-white text-[20px]" />
            </div>
          </div>

        </div>

        {/* Right Side - User / Auth Links */}
        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <button className="relative text-primary-green">
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

                      {/* Conditionally show switch to main layout */}
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
                className="text-sm bg-white text-black px-4 py-1 rounded hover:bg-gray-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm bg-primary-red px-4 py-1 rounded hover:bg-secondary-red"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Overlay to close modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeDropdown}
        />
      )}
    </div>
  );
};

export default NavBarr;
