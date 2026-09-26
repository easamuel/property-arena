import { FaBell, FaBars, FaChevronDown, FaMoon, FaSun } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useLayoutMode } from '@/hooks/useLayoutMode';
import { useTheme } from '@/theme/ThemeProvider';

type TopbarProps = {
  onMenuClick?: () => void;
};

const Topbar = ({ onMenuClick }: TopbarProps) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { layoutMode, setLayoutMode } = useLayoutMode();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const toggleDropdown = () => setIsModalOpen((prev) => !prev);
  const closeDropdown = () => setIsModalOpen(false);

  const canSwitchLayout =
    isAuthenticated &&
    ['admin', 'agent', 'landlord', 'developer'].includes(String(user?.role || '').toLowerCase());

  const handleSwitchLayout = () => {
    const next = layoutMode === 'main' ? 'user' : 'main';
    setLayoutMode(next);
    closeDropdown();
    if (next === 'user') {
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-sec-dark-blue text-white">
      <div className="flex h-14 items-center justify-between gap-3 px-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/15 md:hidden"
            aria-label="Open menu"
          >
            <FaBars />
          </button>
          <p className="truncate text-sm font-semibold tracking-tight text-white/90 sm:text-base">
            PropertyArena
          </p>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            {theme === 'dark' ? <FaSun className="text-amber-300" /> : <FaMoon />}
          </button>

          {isAuthenticated ? (
            <>
              <Link
                to="/messages"
                aria-label="Messages"
                className="relative hidden h-10 w-10 items-center justify-center rounded-xl text-white/80 transition hover:bg-white/10 hover:text-white sm:inline-flex"
              >
                <FaBell />
              </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 transition hover:bg-white/10"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/80 bg-brand-green text-sm font-bold uppercase">
                    {(user?.name || user?.email || 'U').slice(0, 1)}
                  </span>
                  <FaChevronDown className="hidden text-xs sm:block" />
                </button>

                {isModalOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={closeDropdown} aria-hidden />
                    <div className="absolute right-0 z-50 mt-2 w-[min(18rem,calc(100vw-1.5rem))] rounded-2xl border border-line bg-surface-elevated p-4 text-ink shadow-2xl">
                      <div className="mb-2">
                        <p className="truncate text-base font-semibold">{user?.name}</p>
                        <p className="truncate text-sm text-ink-muted">{user?.email}</p>
                      </div>
                      <hr className="my-2 border-line" />
                      <div className="flex flex-col gap-1">
                        <Link
                          to="/profile"
                          onClick={closeDropdown}
                          className="rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-chip"
                        >
                          My profile
                        </Link>
                        <Link
                          to="/dashboard"
                          onClick={closeDropdown}
                          className="rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-chip"
                        >
                          Dashboard
                        </Link>
                        {canSwitchLayout && (
                          <button
                            type="button"
                            onClick={handleSwitchLayout}
                            className="rounded-xl bg-brand-green px-3 py-2 text-left text-sm font-semibold text-white transition hover:bg-brand-green-dark"
                          >
                            {layoutMode === 'main'
                              ? 'Switch to marketplace view'
                              : 'Switch to workspace view'}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            closeDropdown();
                            navigate('/login');
                          }}
                          className="rounded-xl px-3 py-2 text-left text-sm font-medium text-brand-red transition hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          Log out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-ink transition hover:bg-white/90"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="hidden rounded-xl bg-brand-green px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-green-dark sm:inline-flex"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
