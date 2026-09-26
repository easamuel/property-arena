import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaHeart } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/brand/Logo';

const NAV_LINKS = [
  { label: 'Buy', to: '/properties?purpose=sale' },
  { label: 'Rent', to: '/properties?purpose=rent' },
  { label: 'Short Let', to: '/properties?purpose=shortlet' },
  { label: 'Land', to: '/properties?propertyType=land' },
  { label: 'Commercial', to: '/properties?propertyType=commercial' },
  { label: 'Sell', to: '/sell' },
  { label: 'Request a Property', to: '/request-property' },
  { label: 'Guides', to: '/neighbourhood/lagos' },
];

const DarkHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const role = String(user?.role || '').toLowerCase();
  const accountTo =
    role === 'admin'
      ? '/admin'
      : ['agent', 'developer', 'landlord', 'agency'].includes(role)
        ? '/workspace'
        : '/buyer';

  return (
    <header className="sticky top-0 z-50 bg-[#0B1B3A] text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo size="sm" />

        <nav className="hidden items-center gap-5 lg:flex">
          {NAV_LINKS.map(({ label, to }) => (
            <NavLink key={label} to={to} className="text-sm font-medium text-white/90 transition hover:text-amber-300">
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to={isAuthenticated ? accountTo : `/login?redirect=${accountTo}`}
            aria-label="Saved properties"
            className="rounded-full p-2 text-white/90 transition hover:bg-white/10"
          >
            <FaHeart />
          </Link>
          {isAuthenticated ? (
            <Link
              to={accountTo}
              className="hidden rounded-lg bg-amber-400 px-4 py-1.5 text-sm font-bold text-[#0B1B3A] transition hover:bg-amber-300 sm:inline-flex"
            >
              My account
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden rounded-lg border border-white/40 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:inline-flex"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="hidden rounded-lg bg-amber-400 px-4 py-1.5 text-sm font-bold text-[#0B1B3A] transition hover:bg-amber-300 sm:inline-flex"
              >
                Register
              </Link>
            </>
          )}
          <button
            type="button"
            className="rounded-lg p-2 text-white lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0B1B3A] px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map(({ label, to }) => (
              <Link key={label} to={to} onClick={() => setMobileOpen(false)} className="text-sm font-medium text-white/90">
                {label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              {isAuthenticated ? (
                <Link
                  to={accountTo}
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-lg bg-amber-400 py-2 text-center text-sm font-bold text-[#0B1B3A]"
                >
                  My account
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 rounded-lg border border-white/40 py-2 text-center text-sm font-semibold"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 rounded-lg bg-amber-400 py-2 text-center text-sm font-bold text-[#0B1B3A]"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default DarkHeader;
