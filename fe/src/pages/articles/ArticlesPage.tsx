import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MarketplaceHeader from '@/components/navbar/MarketplaceHeader';
import SiteFooter from '@/components/footer/SiteFooter';
import { ADMIN_SERVICE } from '@/services/admin';

type ArticleRow = {
  id?: string;
  _id?: string;
  data?: {
    title?: string;
    slug?: string;
    tag?: string;
    coverImage?: string;
    excerpt?: string;
    readMinutes?: string | number;
    status?: string;
  };
};

const FALLBACK = [
  {
    title: 'Complete Guide to Buying Property in Nigeria',
    slug: 'buying-guide-nigeria',
    tag: 'Buying Guide',
    coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop',
    excerpt: 'Title checks, inspections, and how to avoid common traps.',
    readMinutes: 5,
  },
  {
    title: 'Top Real Estate Investment Hotspots',
    slug: 'investment-hotspots',
    tag: 'Investment',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop',
    excerpt: 'Where capital is flowing across Lagos, Abuja and beyond.',
    readMinutes: 6,
  },
  {
    title: 'Land Documentation Process Explained',
    slug: 'land-documentation',
    tag: 'Legal',
    coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop',
    excerpt: 'C of O, Governor’s Consent, and what to ask your lawyer.',
    readMinutes: 4,
  },
  {
    title: '2026 Real Estate Market Outlook',
    slug: 'market-outlook-2026',
    tag: 'Trends',
    coverImage: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&auto=format&fit=crop',
    excerpt: 'Prices, rent pressure, and what buyers should watch.',
    readMinutes: 5,
  },
];

const ArticlesPage = () => {
  const [articles, setArticles] = useState(FALLBACK);

  useEffect(() => {
    ADMIN_SERVICE.listPublicContent('article')
      .then((res: { data?: ArticleRow[] }) => {
        const rows = (res.data || [])
          .map((r) => r.data)
          .filter(Boolean) as typeof FALLBACK;
        if (rows.length) setArticles(rows);
      })
      .catch(() => undefined);
  }, []);

  return (
    <div className="min-h-screen bg-surface-muted">
      <MarketplaceHeader />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-ink">Articles &amp; Guides</h1>
        <p className="mt-2 text-sm text-gray-500">Expert tips curated by PropertyArena — editable from admin.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((a) => (
            <Link
              key={a.slug || a.title}
              to={a.slug ? `/articles/${a.slug}` : '/articles'}
              className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-md dark:bg-surface-elevated dark:ring-line"
            >
              <img
                src={a.coverImage || FALLBACK[0].coverImage}
                alt={a.title}
                className="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="p-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-green">{a.tag}</span>
                <h2 className="mt-2 line-clamp-2 font-bold text-ink">{a.title}</h2>
                <p className="mt-2 line-clamp-2 text-xs text-gray-500">{a.excerpt}</p>
                <p className="mt-2 text-xs text-gray-400">{a.readMinutes} min read</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
};

export default ArticlesPage;
