import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiCamera,
  FiCheck,
  FiShield,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from 'react-icons/fi';
import MarketplaceHeader from '@/components/navbar/MarketplaceHeader';
import SiteFooter from '@/components/footer/SiteFooter';
import SeoHead from '@/components/seo/SeoHead';
import FaqSection from '@/components/seo/FaqSection';
import { POST_PROPERTY_FAQS } from '@/data/page-faqs';
import { MEDIA } from '@/data/media';
import { useAuth } from '@/hooks/useAuth';

const STEPS = [
  {
    n: '01',
    title: 'Tell us about the property',
    body: 'Type, purpose, bedrooms, price and a clear description buyers can trust.',
  },
  {
    n: '02',
    title: 'Add location & photos',
    body: 'Pin the area accurately and upload bright photos — they drive most enquiries.',
  },
  {
    n: '03',
    title: 'Go live & get leads',
    body: 'We review quickly. Respond fast and upgrade when you want more reach.',
  },
];

const PERKS = [
  { icon: FiUsers, title: 'Serious demand', body: 'Reach buyers and renters searching Nigeria every day.' },
  { icon: FiTrendingUp, title: 'Smarter placement', body: 'Featured and Arena Select options when you are ready to scale.' },
  { icon: FiShield, title: 'Trust signals', body: 'Verified flow, clear profiles and enquiry tools that feel professional.' },
  { icon: FiZap, title: 'Fast to publish', body: 'A focused form — no clutter — so good listings go live sooner.' },
];

const SellProperty = () => {
  const { isAuthenticated } = useAuth();
  const ctaTo = isAuthenticated ? '/create-property' : '/signup?role=agent&redirect=/create-property';
  const [email, setEmail] = useState('');

  const onTeaser = (e: FormEvent) => {
    e.preventDefault();
    window.location.href = ctaTo;
  };

  return (
    <div className="min-h-screen bg-surface">
      <SeoHead
        title="Post a Property | PropertyArena"
        description="List your home, land or commercial space on PropertyArena. Reach verified buyers and renters across Nigeria."
        path="/sell"
      />
      <MarketplaceHeader />

      {/* Full-bleed hero — brand + one CTA, image as plane */}
      <section className="relative min-h-[min(78vh,640px)] overflow-hidden text-white">
        <img
          src={MEDIA.pool}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_40%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1612]/92 via-[#0a1612]/70 to-[#0a1612]/35" />
        <div className="relative mx-auto flex min-h-[min(78vh,640px)] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-green">Post a property</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            PropertyArena
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/85">
            List once. Reach people already searching for homes, land and commercial space across Nigeria.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to={ctaTo}
              className="inline-flex items-center gap-2 rounded-full bg-brand-green px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-green/30 transition hover:bg-brand-green-dark"
            >
              Start listing <FiArrowRight />
            </Link>
            <Link
              to="/subscription"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Compare plans
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-surface-elevated py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">Why sellers choose us</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-secondary">
            Built for Nigerian real estate — clear listings, serious enquiries, fewer dead ends.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PERKS.map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <Icon className="h-6 w-6 text-brand-green" />
                <h3 className="mt-3 text-base font-bold text-ink">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center sm:px-6 lg:px-8">
          <div>
            <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">Three steps to go live</h2>
            <ol className="mt-8 space-y-8">
              {STEPS.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span className="font-mono text-sm font-bold text-brand-green">{s.n}</span>
                  <div>
                    <h3 className="text-lg font-bold text-ink">{s.title}</h3>
                    <p className="mt-1 text-sm text-ink-secondary">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link
              to={ctaTo}
              className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-brand-green hover:underline"
            >
              Continue to listing form <FiArrowRight />
            </Link>
          </div>
          <div className="relative overflow-hidden rounded-3xl">
            <img src={MEDIA.interior} alt="Bright living space" className="aspect-[4/5] w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <FiCamera /> Strong photos win more leads
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-[#0b1a14] py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Ready when you are</h2>
          <p className="mt-3 text-sm text-white/70">
            Create your seller account and publish your first listing in minutes.
          </p>
          <form onSubmit={onTeaser} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your work email"
              className="flex-1 rounded-full border-0 bg-white px-5 py-3 text-sm text-ink outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-brand-green px-6 py-3 text-sm font-bold text-white hover:bg-brand-green-dark"
            >
              Get started
            </button>
          </form>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-white/60">
            {['No cluttered forms', 'Nationwide reach', 'Upgrade anytime'].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <FiCheck className="text-brand-green" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FaqSection
        title="Posting FAQ"
        subtitle="What sellers ask before they list on PropertyArena."
        items={POST_PROPERTY_FAQS}
      />

      <SiteFooter />
    </div>
  );
};

export default SellProperty;
