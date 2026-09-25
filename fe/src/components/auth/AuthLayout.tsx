import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiLock, FiMoon, FiShield, FiSun, FiUsers } from 'react-icons/fi';
import { useTheme } from '@/theme/ThemeProvider';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80';

const TRUST_POINTS = [
  {
    icon: FiCheckCircle,
    title: 'Verified listings',
    body: 'Every property is reviewed before it goes live.',
  },
  {
    icon: FiLock,
    title: 'Secure payments',
    body: 'Bank-grade encryption on every transaction.',
  },
  {
    icon: FiUsers,
    title: 'Trusted agents',
    body: 'Work with vetted agents, developers and landlords.',
  },
];

const STATS = [
  { value: '12k+', label: 'Active listings' },
  { value: '2,500+', label: 'Verified agents' },
  { value: '36', label: 'States covered' },
];

interface AuthLayoutProps {
  title?: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children, footer, wide }) => {
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen w-full bg-surface-muted lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <aside
        className="relative hidden overflow-hidden bg-ink lg:block"
        aria-label="About PropertyArena"
      >
        <img
          src={HERO_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/55 to-black/85" />
        <div className="relative z-10 flex h-full min-h-screen flex-col justify-between p-10 text-white xl:p-14">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="inline-flex w-fit items-center rounded-2xl bg-white/95 px-3 py-2 shadow-lg ring-1 ring-white/20 transition hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-green/60"
            >
              <img src="/logo.png" alt="PropertyArena home" className="h-12 w-auto object-contain" />
            </Link>
            <button
              type="button"
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition hover:bg-white/20"
            >
              {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
          </div>

          <div className="max-w-lg">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90 ring-1 ring-white/20 backdrop-blur">
              <FiShield aria-hidden className="text-brand-green" />
              Trusted across Nigeria
            </p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight xl:text-5xl">
              Nigeria&apos;s smartest property marketplace
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Buy, rent and sell homes in Lagos, Abuja and beyond with confidence.
            </p>

            <ul className="mt-10 space-y-5">
              {TRUST_POINTS.map(({ icon: Icon, title: t, body }) => (
                <li key={t} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green/20 text-brand-green ring-1 ring-brand-green/40">
                    <Icon aria-hidden size={20} />
                  </span>
                  <div>
                    <p className="font-semibold">{t}</p>
                    <p className="text-sm text-white/70">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <dl className="grid max-w-lg grid-cols-3 gap-4 border-t border-white/15 pt-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="text-xs uppercase tracking-wide text-white/60">{s.label}</dt>
                <dd className="mt-1 text-2xl font-bold">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </aside>

      <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface-elevated text-ink shadow-sm transition hover:bg-chip lg:hidden"
        >
          {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        <div className={`w-full ${wide ? 'max-w-xl' : 'max-w-md'}`}>
          <Link
            to="/"
            className="mx-auto mb-6 flex w-fit rounded-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-green/40 lg:hidden"
          >
            <img src="/logo.png" alt="PropertyArena home" className="h-16 w-auto object-contain" />
          </Link>

          <div className="rounded-2xl bg-surface-elevated p-6 shadow-xl ring-1 ring-line sm:p-8">
            {(title || subtitle) && (
              <header className="mb-6">
                {title && (
                  <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-[1.7rem]">
                    {title}
                  </h2>
                )}
                {subtitle && <p className="mt-1.5 text-sm text-ink-muted">{subtitle}</p>}
              </header>
            )}
            {children}
          </div>

          {footer && <div className="mt-6 text-center text-sm text-ink-muted">{footer}</div>}

          <p className="mt-8 text-center text-xs text-ink-muted/80">
            &copy; {new Date().getFullYear()} PropertyArena. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
