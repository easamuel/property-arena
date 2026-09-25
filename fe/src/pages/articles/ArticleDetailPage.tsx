import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaDownload, FaPrint } from 'react-icons/fa';
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
  pdfUrl?: string;
};

const FALLBACK_ARTICLES: Record<string, ArticleData> = {
  'buying-guide-nigeria': {
    title: 'Complete Guide to Buying Property in Nigeria',
    tag: 'Buying Guide',
    readMinutes: 12,
    coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop',
    excerpt:
      'A practical walkthrough of budget, neighbourhood choice, title checks and safe payment when buying property in Nigeria.',
    body: `Buying property in Nigeria rewards patience more than speed. The market moves on relationships, paperwork and local knowledge — not just asking prices on a listing page. This guide walks you through a clear sequence so you spend money only after the risk picture is understandable.

Start with honesty about budget. Include the purchase price, legal fees, agency commission where applicable, survey or valuation costs, stamp duties, and a buffer for repairs or unfinished works. Many buyers under-count soft costs and then rush into a poorly documented deal just to “lock something in.” Write the full number down before you shortlist anything.

Decide whether you are buying to live, to rent out, or to hold land. Owner-occupiers care about schools, commute and neighbours. Investors care about title clarity, rental demand and exit liquidity. Land bankers care about access roads, flooding history and whether the layout is recognised by the state. Mixing these goals mid-search usually wastes months.

Use neighbourhood guides and live listings on PropertyArena to compare areas — Lekki corridors, Ikoyi pockets, Abuja districts, Port Harcourt residential belts and mainland Lagos estates all price differently for similar bedroom counts. Look at price per square metre where you can, but also at what “finished” means in that micro-market: some areas sell shells; others sell turnkey.

Never skip physical inspection if you can help it. Photos hide drainage issues, noisy generators next door, incomplete estate roads and boundary disputes. If you cannot travel, insist on a live video walkthrough with the agent, and ask a trusted local to visit the gate and street. Record what you see.

Title is the heart of Nigerian property risk. Ask early for the documents that apply: Certificate of Occupancy, Governor’s Consent, Deed of Assignment, survey plan, allocation papers, or company resolutions where a corporate seller is involved. Then verify through a lawyer and, where needed, the state lands registry — do not treat a PDF in a WhatsApp chat as final proof.

Engage a licensed surveyor if boundaries matter (they always do for land and detached homes). Confirm that the beaconed land matches what you were shown. Encroachment and double allocation remain real problems in growing corridors; early survey spend is cheaper than litigation.

Structure payment safely. Prefer documented bank transfers tied to a formal agreement, and use escrow or staged releases when the deal is complex. Avoid cash drops, “urgent” weekend transfers to personal accounts you cannot reconcile, and pressure tactics that forbid your lawyer from reviewing terms. Serious sellers expect due diligence time.

Agency and introductions are normal in Nigerian real estate, but clarify who represents whom. Ask whether fees are seller-paid, buyer-paid or split, and get it in writing. If an agent cannot explain the chain of ownership clearly, pause.

After agreement, push for registration and consent processes to complete — not just a handshake and keys. Keep copies of everything. If you later refinance, resell or gift the asset, incomplete paperwork becomes expensive.

If you cannot find a match, use Request a Property on PropertyArena. Open requests let agents respond with options that fit your budget and location, which often surfaces off-market inventory faster than endless scrolling.

Finally, treat every listing as advertising until verified. PropertyArena helps you discover and enquire, but your lawyer, surveyor and common sense close the deal. Buy slowly, document thoroughly, and favour clarity over the thrill of a “last plot.”`,
  },
  'investment-hotspots': {
    title: 'Top Real Estate Investment Hotspots',
    tag: 'Investment',
    readMinutes: 11,
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop',
    excerpt:
      'Where Nigerian property capital is concentrating — corridors, yields and how to compare opportunities without hype.',
    body: `Investment hotspots in Nigeria are rarely about a single viral estate name. They are corridors where infrastructure, jobs and housing demand meet — and where titled inventory still exists at prices that leave room for yield or appreciation.

Lagos remains the deepest market. The Lekki–Ajah axis continues to absorb residential demand as families push east of the islands. Mid-ticket duplexes and terraces often rent faster than ultra-luxury stock, while land toward Ibeju and Epe still attracts longer-horizon buyers who can wait for roads and services. Always separate “story” from current access: a future expressway does not pay today’s void periods.

Island and GRA pockets — Ikoyi, Victoria Island, parts of Ikeja — hold prestige and corporate rental demand, but entry prices are high and liquidity can be slower. Investors here often prioritise quality of tenant and currency of lease over scooping the cheapest unit on a street.

Abuja’s strength is planned districts and government-linked demand. Areas with completed infrastructure and clear layouts tend to hold value better than speculative outskirts without services. Watch where new ministries, hospitals and commercial clusters pull weekday traffic — rental demand follows people, not brochure maps alone.

Port Harcourt and other Rivers residential pockets stay relevant for oil-and-gas cycle tenants and local professionals. Yields can look attractive when purchase prices are disciplined, but you must underwrite security, estate management and maintenance reality — not just headline rent.

Secondary cities — Ibadan, parts of Ogun bordering Lagos, Enugu, Benin, Calabar and northern commercial centres — offer lower ticket sizes. The trade-off is thinner resale markets and fewer institutional tenants. These work better for investors who know the ground personally or partner with reliable local managers.

Compare opportunities with three lenses: price per usable square metre, achievable net rent after agency and voids, and title/exit risk. A cheap plot with cloudy documentation is not a bargain. A slightly dearer titled flat in a liquid neighbourhood often outperforms on risk-adjusted return.

Short-let strategies in major cities can produce strong gross income, but they require operations: cleaning, guest management, furnishing wear, and platform risk. Model occupancy conservatively and keep a cash reserve for quiet months.

Land banking still appeals outside dense cores. Success depends on legal clarity, physical access, flooding history and whether your capital can sit idle. If you need cash flow within two years, buy income-producing stock instead of raw bush with a story.

Use PropertyArena for-sale and for-rent location pages side by side. Seeing both asking sale prices and asking rents in the same neighbourhood is the simplest way to sanity-check yield narratives. Then verify on the ground before you wire funds.

Diversify by ticket size and city if your portfolio allows it — but do not diversify into deals you cannot diligence. Concentration in one well-understood corridor often beats a scatter of “hot tips” across Nigeria.`,
  },
  'land-documentation': {
    title: 'Land Documentation Process Explained',
    tag: 'Legal',
    readMinutes: 10,
    coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop',
    excerpt:
      'Survey plans, deeds, consent and registration — the sequence Nigerian buyers should understand before paying for land.',
    body: `Land documentation in Nigeria is a process, not a single paper. Different states use overlapping but not identical vocabulary, and family land, excised land, government allocation and company-owned plots can follow different paths. This overview helps you ask better questions; it is not a substitute for a qualified lawyer in the relevant state.

Begin with identity of the seller. Is it an individual, a family head with authority, a company, or an attorney under a power of attorney? Demand proof that the person signing can actually convey title. Many disputes start with a confident seller who never had the right to sell.

A survey plan prepared by a licensed surveyor describes the land’s shape and beacons. It should match what you walk on the ground. If beacons are missing or the plan is outdated, fix that before you celebrate a price. Encroachment discovered after payment is a painful classroom.

The Deed of Assignment (or equivalent transfer instrument) records the sale from assignor to assignee. Your lawyer should draft or thoroughly review it, not rubber-stamp a template downloaded from a chat group. Parties, consideration, description of land and warranties matter.

Where the root of title is a Certificate of Occupancy or state grant, Governor’s Consent (or the state’s equivalent approval) is often required for a valid transfer. Timelines and fees vary by state. Budget for them; do not assume the seller’s “we’ll sort consent later” is costless or quick.

Stamping and registration perfect the transaction for public notice and enforceability against third parties. Skipping registration to “save money” is a false economy if another buyer appears with a competing claim.

Family land and customary interests add layers: family meetings, consents, and sometimes litigation history. Ask for evidence of family authorisation and check whether the land sits in an excision, acquisition or known dispute zone. Local knowledge from a sober lawyer beats optimism.

Excised land and layouts marketed by developers should be checked against government records and physical planning realities. Beautiful layout maps are marketing; gazette and survey truth are what courts prefer.

Company sellers should provide resolutions, CAC status where relevant, and clear signing authority. Buying from a company that is itself mid-dispute is borrowing someone else’s problem.

Throughout, keep a document file: receipts, bank proofs, IDs, survey, deed drafts, consent applications and correspondence. Digital copies help, but wet-ink originals still matter in many registries.

PropertyArena may surface listings marked with verification cues, but final due diligence remains yours. Use the platform to find land and agents, then run the legal sequence properly before you call the plot yours.

If anything in the chain feels rushed, opaque or hostile to independent checks, walk away. In Nigerian land, the deal you refuse is often the profit you keep.`,
  },
  'market-outlook-2026': {
    title: '2026 Real Estate Market Outlook',
    tag: 'Trends',
    readMinutes: 9,
    coverImage: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&auto=format&fit=crop',
    excerpt:
      'What to watch in 2026: mid-market demand, short-lets, FX pressure and where disciplined buyers still find room.',
    body: `The 2026 Nigerian real estate outlook is less about a single national price chart and more about segmented demand. Cities and corridors will keep diverging: liquid mid-market stock in major metros behaves differently from speculative fringe land.

Expect continued appetite for well-located apartments and modest duplexes that professionals can actually afford relative to incomes and rents. Ultra-prime units will still trade, but thinner buyer pools mean longer marketing periods unless pricing is realistic.

Short-let inventory in Lagos, Abuja and other travel hubs should remain active where tourism, corporate travel and events support occupancy. Operators who treat hospitality as a business — not a passive listing — will outperform owners who under-furnish and over-price.

Land banking outside dense cores will stay popular among cash buyers seeking naira hedges, but infrastructure delivery and title clarity will separate winners from stranded plots. Flooding, access and layout recognition deserve more weight than social-media hype.

FX and inflation continue to shape affordability. Imported finishing materials, generator costs and dollar-linked rents in some segments pressure both developers and tenants. Ask how a project’s pricing assumes currency moves; vague answers are a risk flag.

Mortgage depth remains limited compared with many markets, so cash and instalment developer plans still dominate. Any genuine expansion in workable mortgage products would unlock mid-market demand — watch policy and bank offerings, but do not underwrite a purchase on rumours alone.

Construction and labour costs keep developers cautious on speculative builds. That can support prices for completed, titled stock in good locations while delaying oversupply in weaker ones. For buyers, completed inventory with clear paperwork often beats off-plan promises unless the developer’s track record is exceptional.

Technology and marketplaces — including PropertyArena — improve discovery and enquiry speed. Transparency on neighbourhoods, sold evidence and agent profiles helps serious parties find each other faster, but it does not remove the need for legal diligence.

Investors should favour underwriting: net yield, void risk, management quality and exit liquidity. Speculators should admit they are timing stories, not rents. Both can succeed; confusion between the two loses money.

For 2026 planning, build a watchlist of two or three corridors you understand, track asking prices and rents monthly, and keep dry powder for mispriced distress or patient off-market deals. Discipline beats FOMO in a noisy market.

Stay sceptical of guaranteed appreciation narratives. Nigeria’s property market rewards local knowledge, clean documents and time — not slogans. Use data where you can, walk the street, and buy only what you can defend to your future self.`,
  },
};

function downloadHtmlDocument(article: ArticleData, slug: string) {
  const title = article.title || 'Article';
  const body = (article.body || article.excerpt || '').replace(/\n/g, '<br/>');
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${title.replace(/</g, '')} | PropertyArena</title>
  <style>
    @media print { body { margin: 0; } }
    body { font-family: Georgia, "Times New Roman", serif; max-width: 720px; margin: 40px auto; padding: 0 24px; color: #1a1a1a; line-height: 1.65; }
    h1 { font-size: 1.75rem; margin-bottom: 0.5rem; }
    .meta { color: #555; font-size: 0.9rem; margin-bottom: 1.5rem; }
    .body { font-size: 1rem; white-space: pre-wrap; }
    .hint { margin-top: 2rem; font-size: 0.85rem; color: #666; border-top: 1px solid #ddd; padding-top: 1rem; }
  </style>
</head>
<body>
  <h1>${title.replace(/</g, '')}</h1>
  <p class="meta">${[article.tag, article.readMinutes ? `${article.readMinutes} min read` : '']
    .filter(Boolean)
    .join(' · ')}</p>
  <div class="body">${body}</div>
  <p class="hint">Open this file and use your browser’s Print → Save as PDF for a PDF copy. Source: PropertyArena.ng</p>
  <script>/* print stylesheet hint for browsers */</script>
</body>
</html>`;
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slug}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError('');
    ADMIN_SERVICE.getPublicBySlug('article', slug)
      .then((res: { data?: { data?: ArticleData } & ArticleData }) => {
        const payload = res.data;
        const nested = payload?.data && typeof payload.data === 'object' ? payload.data : null;
        const articleData = (nested && 'title' in nested ? nested : payload) as ArticleData | undefined;
        const fb = FALLBACK_ARTICLES[slug];
        const merged: ArticleData = {
          ...(fb || {}),
          ...(articleData || {}),
        };
        // Prefer long editorial fallback when DB seed is a short stub
        if (fb?.body && (merged.body || '').length + 80 < fb.body.length) {
          merged.body = fb.body;
          if (!merged.excerpt) merged.excerpt = fb.excerpt;
          if (!merged.readMinutes) merged.readMinutes = fb.readMinutes;
        }
        if (merged.title || fb) {
          setArticle(merged);
        } else {
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

  const handleDownload = () => {
    if (!article || !slug) return;
    if (article.pdfUrl) {
      const a = document.createElement('a');
      a.href = article.pdfUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.download = `${slug}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }
    downloadHtmlDocument(article, slug);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-surface">
      <SeoHead
        title={article?.title || 'Article'}
        description={article?.excerpt || article?.body?.slice(0, 140) || 'PropertyArena guides'}
        path={`/articles/${slug || ''}`}
        image={article?.coverImage}
      />
      <style>{`
        @media print {
          header, footer, .no-print { display: none !important; }
          .print-article { max-width: none !important; padding: 0 !important; }
        }
      `}</style>
      <div className="no-print">
        <MarketplaceHeader />
      </div>
      <article ref={printRef} className="print-article mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/articles" className="no-print text-sm font-semibold text-brand-green hover:underline">
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
            <div className="no-print mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-4 py-2 text-sm font-bold text-white hover:bg-brand-green-dark"
              >
                <FaDownload className="text-xs" /> Download PDF / Print
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 rounded-lg border border-line-strong px-4 py-2 text-sm font-semibold text-ink hover:bg-chip"
              >
                <FaPrint className="text-xs" /> Print page
              </button>
            </div>
            {article.coverImage && (
              <img
                src={article.coverImage}
                alt=""
                className="mt-6 h-64 w-full rounded-2xl object-cover sm:h-80"
              />
            )}
            <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-secondary">
              {(article.body || article.excerpt || 'Content coming soon.')
                .split(/\n\n+/)
                .map((para, i) => (
                  <p key={i} className="whitespace-pre-wrap">
                    {para}
                  </p>
                ))}
            </div>
          </>
        )}
      </article>
      <div className="no-print">
        <SiteFooter />
      </div>
    </div>
  );
};

export default ArticleDetailPage;
