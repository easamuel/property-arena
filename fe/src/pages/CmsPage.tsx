import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import MarketplaceHeader from '@/components/navbar/MarketplaceHeader';
import SiteFooter from '@/components/footer/SiteFooter';
import SeoHead from '@/components/seo/SeoHead';
import { ADMIN_SERVICE } from '@/services/admin';

export const HELP_FAQS: { q: string; a: string }[] = [
  {
    q: 'How do I list a property on PropertyArena?',
    a: 'Create an account as an agent, landlord or developer, complete your profile, then use Post Property or Create Property from the header. Choose sale, rent or short let, add photos, location and pricing, then submit. Some plans unlock more listings and featured placement.',
  },
  {
    q: 'How do property requests work?',
    a: 'Buyers and renters post what they need on Request a Property — budget, location, bedrooms and notes. Agents browse open requests and respond with matching inventory. You can track your own requests from the dashboard when signed in.',
  },
  {
    q: 'How do I reset my password?',
    a: 'On the login page, choose Forgot password, enter your email, and follow the reset link we send. If you do not see the email, check spam or contact support@propertyarena.ng.',
  },
  {
    q: 'Are listings verified?',
    a: 'We encourage verified agents and clear listing details, and we may remove fraudulent content. Always complete your own due diligence — title checks, in-person inspection and safe payment — before transferring funds.',
  },
  {
    q: 'How do subscriptions and Arena Select work?',
    a: 'Paid plans unlock higher listing limits, badges and priority placement. Visit Subscription to compare tiers. Arena Select marks premium sellers who invest in visibility and lead capacity.',
  },
  {
    q: 'How do I contact an agent about a listing?',
    a: 'Open the property page and use Call, WhatsApp or the enquiry form. Never send payments outside documented channels. Prefer meeting in public for first contact when dealing with high-value transactions.',
  },
  {
    q: 'Can I sell without becoming a full-time agent?',
    a: 'Yes. Use Sell or Create Property as a landlord or private seller where your account type allows. For frequent listings, an agent profile and plan usually perform better.',
  },
  {
    q: 'Who do I contact for partnerships or press?',
    a: 'Email support@propertyarena.ng with Partnerships or Press in the subject line. Include your organisation, proposal and preferred contact.',
  },
];

const STATIC_PAGES: Record<string, { title: string; body: string }> = {
  about: {
    title: 'About PropertyArena',
    body: `PropertyArena.ng is Nigeria's property marketplace — connecting buyers, renters, landlords, agents and developers with verified listings, neighbourhood guides, and request matching.

We built PropertyArena to make finding and listing homes clearer, safer and faster across every state. From Lagos corridors to Abuja districts and growing secondary cities, our goal is simple: serious people, clear listings, and tools that respect how Nigerian real estate actually works.`,
  },
  careers: {
    title: 'Careers',
    body: `We're growing a team that cares about Nigerian real estate — product, trust, and marketplace operations.

Email careers@propertyarena.ng with your CV and a short note on what you'd like to build with us. Tell us about a problem you've solved and why PropertyArena interests you.`,
  },
  contact: {
    title: 'Contact Us',
    body: `Questions about listings, subscriptions or partnerships?

Email: support@propertyarena.ng

Agents and developers: use Post Property or Become an Agent from the header. For urgent account issues, include your registered email and a clear description of the problem.`,
  },
  help: {
    title: 'Help Center',
    body: `Welcome to the PropertyArena Help Center. Browse common questions below, or email support@propertyarena.ng if you need a human.

We cover listing, requests, accounts, safety and subscriptions. Answers here are guidance — for legal title and contracts, always use qualified professionals.`,
  },
  terms: {
    title: 'Terms of Use',
    body: `Last updated: September 2026

These Terms of Use govern your access to PropertyArena.ng (“PropertyArena”, “we”, “us”). By creating an account, listing a property, posting a request, or otherwise using the site, you agree to these terms.

1. The marketplace
PropertyArena provides an online marketplace for property advertisements, neighbourhood information, articles and related tools. We are not a party to sale, lease or agency contracts between users unless we expressly say otherwise in writing. Listing content is provided by users; we do not guarantee accuracy, availability or title.

2. Eligibility and accounts
You must provide accurate registration details and keep login credentials confidential. You are responsible for activity under your account. We may suspend or terminate accounts that are fraudulent, abusive, or in breach of these terms or Nigerian law.

3. Listings and content
You agree that property details, photos, prices and claims you publish are truthful to the best of your knowledge. You must have authority to market the property. You grant PropertyArena a non-exclusive licence to host, display and promote your content for marketplace purposes. We may edit, refuse or remove content that appears misleading, illegal, or harmful to other users.

4. Enquiries and communications
Contact tools (forms, WhatsApp links, phone reveals, messaging) exist to connect interested parties. You must not use them for spam, harassment, phishing or fraud. Never request or send payments outside documented, traceable channels when dealing with strangers.

5. Fees and subscriptions
Some features require paid plans. Fees, listing limits and badges are described on subscription pages and may change with notice. Fees already paid are generally non-refundable except where required by law or our written policy.

6. Prohibited conduct
You must not scrape the site abusively, reverse-engineer systems without permission, upload malware, impersonate others, post discriminatory or illegal content, or interfere with other users’ access.

7. Intellectual property
PropertyArena branding, software and original editorial content are protected. You may not copy our site design or content for competing services without permission. User-uploaded photos remain subject to the rights of their owners; only upload media you are allowed to use.

8. Disclaimers
THE PLATFORM IS PROVIDED “AS IS.” TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. Real estate transactions carry risk; perform independent due diligence.

9. Limitation of liability
To the fullest extent permitted by law, PropertyArena and its team are not liable for indirect, incidental or consequential damages, or for losses arising from user-to-user dealings, payment fraud, or reliance on listing content. Our aggregate liability for claims relating to the service is limited to the fees you paid us in the three months before the claim, or ₦50,000, whichever is greater, unless law requires otherwise.

10. Indemnity
You agree to indemnify PropertyArena against claims arising from your content, your breach of these terms, or your property transactions facilitated through introductions on the site.

11. Changes
We may update these terms by posting a revised version. Continued use after changes constitutes acceptance. Material changes may also be notified by email where practical.

12. Governing law
These terms are governed by the laws of the Federal Republic of Nigeria. Disputes shall be subject to the courts of Nigeria, without prejudice to mandatory consumer protections.

13. Contact
Questions: support@propertyarena.ng`,
  },
  privacy: {
    title: 'Privacy Policy',
    body: `Last updated: September 2026

This Privacy Policy explains how PropertyArena.ng collects, uses and shares personal information when you use our marketplace.

1. Information we collect
Account data (name, email, phone, role), profile and agency details, listing content you submit, enquiry and request messages, technical logs (IP, device, browser), cookies and similar technologies, and payment or subscription references processed via our providers.

2. How we use information
We use data to operate and improve the marketplace, show listings, route enquiries, prevent fraud and abuse, provide customer support, send service and (where permitted) marketing messages, personalise experience including theme preferences, and meet legal obligations.

3. Sharing
We do not sell your personal data. We share information with: other users when you initiate an enquiry or publish a listing (e.g. contact details you choose to reveal); service providers (hosting, email, analytics, payments) under appropriate safeguards; and authorities when required by law or to protect rights and safety.

4. Retention
We retain account and listing data while your account is active and for a reasonable period afterward for disputes, backups and legal compliance. You may request deletion subject to legitimate retention needs.

5. Security
We apply administrative and technical measures appropriate to the risk. No online service is perfectly secure; protect your password and report suspected compromise promptly.

6. Your choices
You may update profile details, adjust marketing preferences where offered, clear cookies in your browser, and request access or deletion by emailing privacy@propertyarena.ng. Some data is necessary to provide the service; deleting it may close your account.

7. Children
PropertyArena is not directed at children under 18. We do not knowingly collect their data for marketplace accounts.

8. International processing
Infrastructure may process data in Nigeria and other countries where our providers operate. We take steps to protect information consistently with this policy.

9. Changes
We may update this policy by posting a new version with a revised date. Significant changes may be communicated by email or notice on the site.

10. Contact
privacy@propertyarena.ng`,
  },
  cookies: {
    title: 'Cookie Policy',
    body: `We use essential cookies for sign-in and preferences (including light/dark theme), and optional analytics to improve the product.

You can clear cookies in your browser at any time. Disabling essential cookies may prevent login and some features from working correctly.`,
  },
};

function HelpFaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mt-8 space-y-2">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="overflow-hidden rounded-xl ring-1 ring-line bg-surface-elevated">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold text-ink hover:bg-chip/60"
              aria-expanded={isOpen}
            >
              <span>{item.q}</span>
              <FaChevronDown
                className={`shrink-0 text-xs text-ink-muted transition ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isOpen && (
              <div className="border-t border-line px-4 py-3 text-sm leading-relaxed text-ink-secondary">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

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
  const [faqs, setFaqs] = useState(HELP_FAQS);

  useEffect(() => {
    let cancelled = false;
    const staticFallback = STATIC_PAGES[slug];
    setLoading(true);
    ADMIN_SERVICE.getPublicBySlug('page', slug)
      .then((res: { data?: { data?: { title?: string; body?: string } } }) => {
        if (cancelled) return;
        const d = res.data?.data;
        if (d?.title) setTitle(d.title);
        else if (staticFallback) setTitle(staticFallback.title);

        // Prefer rich static legal/help copy when DB seed is a short stub
        const apiBody = d?.body || '';
        if (staticFallback && staticFallback.body.length > apiBody.length + 80) {
          setBody(staticFallback.body);
        } else if (apiBody) {
          setBody(apiBody);
        } else if (staticFallback) {
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

  useEffect(() => {
    if (slug !== 'help') return;
    let cancelled = false;
    ADMIN_SERVICE.listPublicContent('help-faq')
      .then((res: { data?: Array<{ data?: { title?: string; body?: string } }> }) => {
        if (cancelled) return;
        const rows = res.data || [];
        const mapped = rows
          .map((row) => ({
            q: row.data?.title || '',
            a: row.data?.body || '',
          }))
          .filter((f) => f.q && f.a);
        if (mapped.length) setFaqs(mapped);
        else setFaqs(HELP_FAQS);
      })
      .catch(() => {
        if (!cancelled) setFaqs(HELP_FAQS);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const isHelp = slug === 'help';

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
            {isHelp && <HelpFaqAccordion items={faqs} />}
          </>
        )}
      </article>
      <SiteFooter />
    </div>
  );
};

export default CmsPage;
