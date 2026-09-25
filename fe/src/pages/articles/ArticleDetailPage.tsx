import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MarketplaceHeader from '@/components/navbar/MarketplaceHeader';
import SiteFooter from '@/components/footer/SiteFooter';
import SeoHead from '@/components/seo/SeoHead';
import { ADMIN_SERVICE } from '@/services/admin';

type ArticleData = {
  title?: string;
  slug?: string;
  tag?: string;
  coverImage?: string;
  excerpt?: string;
  readMinutes?: string | number;
  body?: string;
};

const FALLBACK_ARTICLES: Record<string, ArticleData> = {
  'buying-guide-nigeria': {
    title: 'Complete Guide to Buying Property in Nigeria',
    tag: 'Buying Guide',
    readMinutes: 5,
    coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop',
    body: `Buying property in Nigeria starts with clarity on budget, location and title.\n\n1. Decide buy vs rent and set a realistic budget including agency fees and legal costs.\n2. Shortlist neighbourhoods using guides on PropertyArena — Lekki, Ikoyi, Gwarinpa and more.\n3. Insist on verified title documents and work with a licensed surveyor/lawyer.\n4. Inspect in person or via video tour before committing.\n5. Never transfer funds outside documented escrow or bank channels.\n\nUse Request a Property if you cannot find a match — agents respond on open requests.`,
  },
  'investment-hotspots': {
    title: 'Top Real Estate Investment Hotspots',
    tag: 'Investment',
    readMinutes: 6,
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop',
    body: `Lagos corridor growth (Lekki–Ajah), Abuja districts with infrastructure spend, and Port Harcourt residential pockets remain active for long-term investors.\n\nCompare price per sqm on for-sale location pages, check rental yields via for-rent listings, and favour titled land with clear access roads.`,
  },
  'land-documentation': {
    title: 'Land Documentation Process Explained',
    tag: 'Legal',
    readMinutes: 4,
    coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop',
    body: `Typical steps: survey plan → deed of assignment → governor's consent / C of O where applicable → stamping and registration.\n\nAlways verify with the state lands registry. PropertyArena listings that mark verification help, but final due diligence is yours.`,
  },
  'market-outlook-2026': {
    title: '2026 Real Estate Market Outlook',
    tag: 'Trends',
    readMinutes: 5,
    coverImage: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&auto=format&fit=crop',
    body: `Expect continued demand for mid-market apartments and short-let stock in major cities, with land banking still popular outside dense cores.\n\nWatch FX and mortgage product availability — they shape affordability more than headline asking prices alone.`,
  },
};

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError('');
    ADMIN_SERVICE.getPublicBySlug('article', slug)
      .then((res: { data?: { data?: ArticleData } }) => {
        setArticle(res.data?.data || FALLBACK_ARTICLES[slug] || null);
        if (!res.data?.data && !FALLBACK_ARTICLES[slug]) {
          setError('Article not found');
        }
      })
      .catch(() => {
        const fb = FALLBACK_ARTICLES[slug];
        if (fb) setArticle(fb);
        else setError('Article not found');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="min-h-screen bg-surface">
      <SeoHead
        title={article?.title || 'Article'}
        description={article?.excerpt || article?.body?.slice(0, 140) || 'PropertyArena guides'}
        path={`/articles/${slug || ''}`}
      />
      <MarketplaceHeader />
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/articles" className="text-sm font-semibold text-brand-green hover:underline">
          ← All articles
        </Link>
        {error && <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {loading && !article && <p className="mt-8 text-sm text-gray-500">Loading…</p>}
        {article && (
          <>
            <p className="mt-6 text-xs font-bold uppercase tracking-wide text-brand-green">{article.tag}</p>
            <h1 className="mt-2 text-3xl font-extrabold text-ink">{article.title}</h1>
            <p className="mt-2 text-sm text-gray-500">
              {article.readMinutes ? `${article.readMinutes} min read` : null}
            </p>
            {article.coverImage && (
              <img
                src={article.coverImage}
                alt=""
                className="mt-6 h-64 w-full rounded-2xl object-cover sm:h-80"
              />
            )}
            <p className="mt-6 text-base leading-relaxed text-ink-secondary whitespace-pre-wrap">
              {article.body || article.excerpt || 'Content coming soon.'}
            </p>
          </>
        )}
      </article>
      <SiteFooter />
    </div>
  );
};

export default ArticleDetailPage;
