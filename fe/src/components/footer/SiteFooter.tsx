import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube } from 'react-icons/fa';
import Logo from '@/components/brand/Logo';

const COLUMNS = [
  {
    title: 'Explore',
    links: [
      { label: 'Buy Properties', to: '/for-sale/in/lagos' },
      { label: 'Rent Properties', to: '/for-rent/in/lagos' },
      { label: 'Land for Sale', to: '/land/in/lagos' },
      { label: 'Short Let', to: '/shortlet/in/lagos' },
      { label: 'Commercial Properties', to: '/properties?propertyType=commercial' },
      { label: 'New Developments', to: '/for-sale/in/lagos' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Blog', to: '/articles' },
      { label: 'News & Insights', to: '/articles' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'FAQs', to: '/help' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Buying Guide', to: '/articles/buying-guide-nigeria' },
      { label: 'Neighbourhood Guides', to: '/neighbourhood' },
      { label: 'Land Documentation', to: '/articles/land-documentation' },
      { label: 'Help Center', to: '/help' },
      { label: 'Request a Property', to: '/request-property' },
      { label: 'Terms of Use', to: '/terms' },
    ],
  },
  {
    title: 'For Agents',
    links: [
      { label: 'Agent Login', to: '/login' },
      { label: 'Become an Agent', to: '/signup?role=agent' },
      { label: 'Post Property', to: '/create-property' },
      { label: 'Subscriptions', to: '/subscription' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Partner Program', to: '/sell' },
    ],
  },
];

const SOCIAL = [
  { icon: FaFacebookF, href: 'https://facebook.com', label: 'Facebook' },
  { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: FaLinkedinIn, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: FaYoutube, href: 'https://youtube.com', label: 'YouTube' },
];

const SiteFooter = () => (
  <footer className="bg-[#0b1f14] text-white">
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.35fr_repeat(4,1fr)]">
        <div>
          <Logo size="md" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
            Nigeria&apos;s most trusted property marketplace. Find, buy, rent and invest with confidence.
          </p>
          <div className="mt-5 flex gap-2">
            {SOCIAL.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-brand-green hover:text-white"
              >
                <Icon className="text-sm" />
              </a>
            ))}
          </div>
          <div className="mt-6">
            <p className="text-sm font-semibold text-white/90">Download Our App</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-white/20 px-3 py-2 text-xs text-white/80 transition hover:border-brand-green hover:text-white"
              >
                Get it on Google Play
              </a>
              <a
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-white/20 px-3 py-2 text-xs text-white/80 transition hover:border-brand-green hover:text-white"
              >
                Download on the App Store
              </a>
            </div>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-white/55 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-white/45">
          <p className="mb-1 text-white/55">Secure payments by</p>
          <p className="font-medium tracking-wide text-white/70">Visa · Mastercard · Verve</p>
        </div>
        <div className="flex flex-col gap-2 text-xs text-white/45 sm:items-end">
          <p>© {new Date().getFullYear()} PropertyArena.ng. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/terms" className="hover:text-white">Terms of Use</Link>
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
