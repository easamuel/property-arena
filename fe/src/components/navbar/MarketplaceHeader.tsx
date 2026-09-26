import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBars,
  FaChevronDown,
  FaHeart,
  FaMoon,
  FaSun,
  FaTimes,
} from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/brand/Logo';
import { useTheme } from '@/theme/ThemeProvider';
import { useLayoutMode } from '@/hooks/useLayoutMode';

type MegaLink = { label: string; to: string; hint?: string };
type MegaColumn = { title: string; links: MegaLink[] };
type NavItem =
  | { type: 'link'; label: string; to: string }
  | { type: 'mega'; label: string; columns: MegaColumn[] };

const NAV: NavItem[] = [
  {
    type: 'mega',
    label: 'Buy',
    columns: [
      {
        title: 'Homes',
        links: [
          { label: 'All for sale', to: '/properties?purpose=sale&location=Nigeria', hint: 'Nationwide' },
          { label: 'New homes', to: '/properties?purpose=sale&location=Nigeria', hint: 'Fresh developments' },
          { label: 'Luxury', to: '/properties?purpose=sale&minPrice=100000000', hint: '₦100M+' },
        ],
      },
      {
        title: 'By type',
        links: [
          { label: 'Duplex & houses', to: '/properties?purpose=sale&propertyType=house&location=Nigeria' },
          { label: 'Apartments', to: '/properties?purpose=sale&propertyType=apartment&location=Nigeria' },
          { label: 'Land', to: '/properties?purpose=sale&propertyType=land&location=Nigeria' },
        ],
      },
      {
        title: 'Popular cities',
        links: [
          { label: 'Lagos', to: '/for-sale/in/lagos' },
          { label: 'Abuja', to: '/for-sale/in/abuja' },
          { label: 'Port Harcourt', to: '/for-sale/in/rivers/port-harcourt' },
        ],
      },
    ],
  },
  {
    type: 'mega',
    label: 'Rent',
    columns: [
      {
        title: 'Rentals',
        links: [
          { label: 'Homes for rent', to: '/properties?purpose=rent&location=Nigeria', hint: 'Nationwide' },
          { label: 'Short lets', to: '/properties?purpose=shortlet&location=Nigeria', hint: 'Daily & monthly' },
          { label: 'Serviced apartments', to: '/properties?purpose=rent&location=Nigeria' },
        ],
      },
      {
        title: 'Commercial',
        links: [
          { label: 'Offices', to: '/properties?propertyType=commercial&purpose=rent' },
          { label: 'Shops & malls', to: '/properties?propertyType=commercial&purpose=rent' },
        ],
      },
      {
        title: 'Need help?',
        links: [
          { label: 'Post a request', to: '/request-property', hint: 'Agents come to you' },
          { label: 'Browse requests', to: '/requests' },
        ],
      },
    ],
  },
  { type: 'link', label: 'Short Let', to: '/properties?purpose=shortlet&location=Nigeria' },
  { type: 'link', label: 'Land', to: '/properties?purpose=sale&propertyType=land&location=Nigeria' },
  {
    type: 'mega',
    label: 'Explore',
    columns: [
      {
        title: 'Neighbourhood guides',
        links: [
          { label: 'All guides', to: '/neighbourhood', hint: 'Cities & areas' },
          { label: 'Lagos', to: '/neighbourhood/lagos' },
          { label: 'Abuja', to: '/neighbourhood/abuja' },
          { label: 'Port Harcourt', to: '/neighbourhood/port-harcourt' },
        ],
      },
      {
        title: 'For professionals',
        links: [
          { label: 'Become an agent', to: '/signup?role=agent' },
          { label: 'Post a property', to: '/sell' },
          { label: 'Plans & pricing', to: '/subscription' },
        ],
      },
      {
        title: 'Insights',
        links: [
          { label: 'Articles & tips', to: '/articles' },
          { label: 'Market overview', to: '/properties' },
          { label: 'Request a property', to: '/request-property' },
        ],
      },
    ],
  },
];

const MarketplaceHeader = () => {
  const { isAuthenticated, user } = useAuth();
  const { theme, toggle } = useTheme();
  const { layoutMode, setLayoutMode } = useLayoutMode();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const initials = user?.name?.[0] || user?.email?.[0] || 'U';
  const role = String(user?.role || '').toLowerCase();
  const accountTo = role === 'admin' ? '/admin' : '/dashboard';
  const canUseWorkspace = ['agent', 'developer', 'landlord', 'admin'].includes(role);

  const openWorkspace = () => {
    if (canUseWorkspace) setLayoutMode('main');
  };

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenMega(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMega(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const closeAll = () => {
    setOpenMega(null);
    setMobileOpen(false);
    setMobileSection(null);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface-nav shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-surface-nav">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:h-[4.25rem] lg:px-8">
        <Logo size="md" />

        <nav ref={navRef} className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            if (item.type === 'link') {
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-ink-secondary transition hover:bg-chip hover:text-brand-green"
                >
                  {item.label}
                </Link>
              );
            }
            const open = openMega === item.label;
            return (
              <div key={item.label} className="relative">
                <button
                  type="button"
                  aria-expanded={open}
                  onMouseEnter={() => setOpenMega(item.label)}
                  onClick={() => setOpenMega(open ? null : item.label)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    open
                      ? 'bg-brand-green/10 text-brand-green'
                      : 'text-ink-secondary hover:bg-chip hover:text-brand-green'
                  }`}
                >
                  {item.label}
                  <FaChevronDown className={`text-[10px] transition ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && (
                  <div
                    onMouseLeave={() => setOpenMega(null)}
                    className="absolute left-1/2 top-full z-50 mt-2 w-[min(90vw,36rem)] -translate-x-1/2 rounded-2xl border border-line bg-surface-elevated p-5 shadow-2xl ring-1 ring-black/5 dark:ring-white/5"
                  >
                    <div className="grid grid-cols-3 gap-6">
                      {item.columns.map((col) => (
                        <div key={col.title}>
                          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                            {col.title}
                          </p>
                          <ul className="space-y-0.5">
                            {col.links.map((link) => (
                              <li key={link.label}>
                                <Link
                                  to={link.to}
                                  onClick={closeAll}
                                  className="block rounded-lg px-2 py-2 transition hover:bg-brand-green/5"
                                >
                                  <span className="block text-sm font-semibold text-ink">{link.label}</span>
                                  {link.hint && (
                                    <span className="block text-xs text-ink-muted">{link.hint}</span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="rounded-full p-2 text-ink-muted transition hover:bg-chip hover:text-ink"
          >
            {theme === 'dark' ? <FaSun className="text-amber-400" /> : <FaMoon />}
          </button>
          <Link
            to={isAuthenticated ? '/dashboard' : '/login?redirect=/dashboard'}
            onClick={openWorkspace}
            aria-label="Saved"
            className="rounded-full p-2 text-ink-muted transition hover:bg-chip hover:text-brand-red"
          >
            <FaHeart />
          </Link>
          {isAuthenticated ? (
            <Link
              to={accountTo}
              onClick={openWorkspace}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green text-sm font-bold uppercase text-white"
              aria-label="Account"
            >
              {initials}
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden rounded-lg border border-line-strong px-3 py-2 text-sm font-semibold text-ink-secondary transition hover:bg-chip sm:inline-flex"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="hidden rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-surface transition hover:opacity-90 sm:inline-flex"
              >
                Sign Up
              </Link>
            </>
          )}
          <button
            type="button"
            className="rounded-lg p-2 text-ink-secondary lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-line bg-surface px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => {
              if (item.type === 'link') {
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={closeAll}
                    className="rounded-lg px-3 py-3 text-sm font-semibold text-ink"
                  >
                    {item.label}
                  </Link>
                );
              }
              const open = mobileSection === item.label;
              return (
                <div key={item.label} className="rounded-xl border border-line">
                  <button
                    type="button"
                    onClick={() => setMobileSection(open ? null : item.label)}
                    className="flex w-full items-center justify-between px-3 py-3 text-sm font-semibold text-ink"
                  >
                    {item.label}
                    <FaChevronDown className={`text-[10px] transition ${open ? 'rotate-180' : ''}`} />
                  </button>
                  {open && (
                    <div className="space-y-3 border-t border-line px-3 py-3">
                      {item.columns.map((col) => (
                        <div key={col.title}>
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                            {col.title}
                          </p>
                          {col.links.map((link) => (
                            <Link
                              key={link.label}
                              to={link.to}
                              onClick={closeAll}
                              className="block rounded-lg py-2 text-sm text-ink-secondary"
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {!isAuthenticated && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={closeAll}
                  className="rounded-lg border border-line-strong py-2.5 text-center text-sm font-semibold text-ink"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={closeAll}
                  className="rounded-lg bg-ink py-2.5 text-center text-sm font-semibold text-surface"
                >
                  Sign Up
                </Link>
              </div>
            )}
            {isAuthenticated && (
              <div className="mt-3 space-y-2 border-t border-line pt-3">
                <Link
                  to={accountTo}
                  onClick={() => {
                    openWorkspace();
                    closeAll();
                  }}
                  className="block rounded-xl bg-brand-green px-3 py-3 text-center text-sm font-bold text-white"
                >
                  Open dashboard
                </Link>
                {canUseWorkspace && layoutMode === 'user' && (
                  <button
                    type="button"
                    onClick={() => {
                      setLayoutMode('main');
                      closeAll();
                    }}
                    className="w-full rounded-xl border border-line px-3 py-2.5 text-sm font-semibold text-ink"
                  >
                    Switch to workspace view
                  </button>
                )}
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default MarketplaceHeader;
