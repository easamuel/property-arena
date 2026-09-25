import { Link } from 'react-router-dom';
import { FaComments } from 'react-icons/fa';
import MarketplaceHeader from '@/components/navbar/MarketplaceHeader';
import SiteFooter from '@/components/footer/SiteFooter';
import SeoHead from '@/components/seo/SeoHead';

/** Messaging UI ships as an empty state until realtime chat is wired. */
const Messages = () => (
  <div className="min-h-screen bg-surface-muted">
    <SeoHead title="Messages" description="Secure messaging with agents on PropertyArena." path="/messages" noIndex />
    <MarketplaceHeader />
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10 text-2xl text-brand-green">
        <FaComments />
      </span>
      <h1 className="mt-6 text-2xl font-extrabold text-ink">Inbox coming soon</h1>
      <p className="mt-2 text-sm text-gray-500">
        For now, enquire from any listing page or post a property request — agents respond there.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          to="/properties"
          className="rounded-lg bg-brand-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-dark"
        >
          Browse listings
        </Link>
        <Link
          to="/request-property"
          className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold dark:border-line-strong"
        >
          Post a request
        </Link>
      </div>
    </div>
    <SiteFooter />
  </div>
);

export default Messages;
