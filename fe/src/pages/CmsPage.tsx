import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import MarketplaceHeader from '@/components/navbar/MarketplaceHeader';
import SiteFooter from '@/components/footer/SiteFooter';
import SeoHead from '@/components/seo/SeoHead';
import { ADMIN_SERVICE } from '@/services/admin';

const STATIC_PAGES: Record<string, { title: string; body: string }> = {
  about: {
    title: 'About PropertyArena',
    body: `PropertyArena.ng is Nigeria's property marketplace — connecting buyers, renters, landlords, agents and developers with verified listings, neighbourhood guides, and request matching.\n\nWe built PropertyArena to make finding and listing homes clearer, safer and faster across every state.`,
  },
  careers: {
    title: 'Careers',
    body: `We're growing a team that cares about Nigerian real estate.\n\nEmail careers@propertyarena.ng with your CV and a short note on what you'd like to build with us.`,
  },
  contact: {
    title: 'Contact Us',
    body: `Questions about listings, subscriptions or partnerships?\n\nEmail: support@propertyarena.ng\n\nAgents and developers: use Post Property or Become an Agent from the header.`,
  },
  help: {
    title: 'Help Center / FAQs',
    body: `How do I list a property?\nSign up as an agent, landlord or developer, choose a plan if required, then use Post Property.\n\nHow do property requests work?\nPost what you need on Request a Property. Agents browse open requests and respond.\n\nForgot password?\nUse Forgot password on the login page — you'll get a reset link.`,
  },
  terms: {
    title: 'Terms of Use',
    body: `By using PropertyArena.ng you agree to list accurate information, respect other users, and follow Nigerian law.\n\nWe may remove fraudulent listings and suspend accounts that abuse the platform. Listing content remains the responsibility of the poster.`,
  },
  privacy: {
    title: 'Privacy Policy',
    body: `We collect account details, listing data and enquiry information to operate the marketplace.\n\nWe do not sell your personal data. Contact and payment details are shared only as needed to complete a transaction or enquiry you initiate.\n\nQuestions: privacy@propertyarena.ng`,
  },
  cookies: {
    title: 'Cookie Policy',
    body: `We use essential cookies for sign-in and preferences (including light/dark theme), and optional analytics to improve the product.\n\nYou can clear cookies in your browser at any time.`,
  },
};

const CmsPage = () => {
  const params = useParams<{ slug?: string }>();
  const location = useLocation();
  const slug =
    params.slug ||
    location.pathname.replace(/^\/+|\/+$/g, '').split('/').pop() ||
    'about';

  const fallback = STATIC_PAGES[slug];
  const [title, setTitle] = useState(fallback?.title || slug);
  const [body, setBody] = useState(fallback?.body || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const staticFallback = STATIC_PAGES[slug];
    setLoading(true);
    ADMIN_SERVICE.getPublicBySlug('page', slug)
      .then((res: { data?: { data?: { title?: string; body?: string } } }) => {
        if (cancelled) return;
        const d = res.data?.data;
        if (d?.title) setTitle(d.title);
        if (d?.body) setBody(d.body);
        else if (staticFallback) {
          setTitle(staticFallback.title);
          setBody(staticFallback.body);
        }
      })
      .catch(() => {
        if (cancelled) return;
        if (staticFallback) {
          setTitle(staticFallback.title);
          setBody(staticFallback.body);
        } else {
          setTitle('Page not found');
          setBody('This page has not been published yet.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <div className="min-h-screen bg-surface">
      <SeoHead title={title} description={body.slice(0, 150)} path={`/${slug}`} />
      <MarketplaceHeader />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link to="/" className="text-sm font-semibold text-brand-green hover:underline">
          ← Home
        </Link>
        {loading ? (
          <p className="mt-8 text-sm text-gray-500">Loading…</p>
        ) : (
          <>
            <h1 className="mt-4 text-3xl font-extrabold text-ink">{title}</h1>
            <div className="mt-6 whitespace-pre-line text-sm leading-relaxed text-ink-secondary">
              {body}
            </div>
          </>
        )}
      </article>
      <SiteFooter />
    </div>
  );
};

export default CmsPage;
