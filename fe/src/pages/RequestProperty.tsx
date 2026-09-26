import { FormEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { FaHome, FaKey, FaBed, FaMap } from 'react-icons/fa';
import MarketplaceHeader from '@/components/navbar/MarketplaceHeader';
import SiteFooter from '@/components/footer/SiteFooter';
import SeoHead from '@/components/seo/SeoHead';
import SafetyTips from '@/components/trust/SafetyTips';
import AdSlot from '@/components/ads/AdSlot';
import { useToast } from '@/hooks/useToast';
import { REQUESTS_SERVICE } from '@/services/requests';
import FaqSection from '@/components/seo/FaqSection';
import { REQUEST_FAQS } from '@/data/page-faqs';

const STEPS = ['What you need', 'Budget & place', 'Contact', 'Review'];

const PURPOSES = [
  { id: 'sale' as const, label: 'Buy', icon: FaHome, hint: 'Own a home or land' },
  { id: 'rent' as const, label: 'Rent', icon: FaKey, hint: 'Long-term lease' },
  { id: 'shortlet' as const, label: 'Short let', icon: FaBed, hint: 'Days or months' },
  { id: 'lease' as const, label: 'Land / lease', icon: FaMap, hint: 'Plots & commercial' },
];

const TYPES = [
  'Duplex',
  'Apartment / Flat',
  'Terrace',
  'Bungalow',
  'Mini flat',
  'Self contain',
  'Penthouse',
  'Land',
  'Commercial',
  'Office',
];

const FEATURES = [
  'Serviced',
  'Furnished',
  'Newly built',
  'Parking',
  '24/7 Security',
  'BQ',
  'Pool',
  'Gym',
  'Elevator',
  'Garden',
];

const RequestProperty = () => {
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [purpose, setPurpose] = useState<'sale' | 'rent' | 'shortlet' | 'lease'>('sale');
  const [features, setFeatures] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    propertyType: 'Duplex',
    location: '',
    budgetMin: '',
    budgetMax: '',
    bedrooms: '3',
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const preview = useMemo(() => {
    const purposeLabel = PURPOSES.find((p) => p.id === purpose)?.label || purpose;
    const budget =
      form.budgetMin || form.budgetMax
        ? `₦${form.budgetMin || '0'} – ₦${form.budgetMax || 'open'}`
        : 'Budget flexible';
    return {
      title: `${purposeLabel}: ${form.propertyType || 'Property'}`,
      location: form.location || 'Location to be confirmed',
      beds: form.bedrooms ? `${form.bedrooms} bed` : 'Any beds',
      budget,
      features: features.slice(0, 4),
    };
  }, [purpose, form, features]);

  const toggleFeature = (f: string) => {
    setFeatures((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  };

  const canNext = () => {
    if (step === 0) return !!form.propertyType && !!purpose;
    if (step === 1) return form.location.trim().length > 2;
    if (step === 2) return form.name.trim() && form.email.trim() && form.phone.trim();
    return true;
  };

  const next = () => {
    if (!canNext()) {
      toast.error('Please complete this step before continuing');
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canNext()) return;
    setSubmitting(true);
    try {
      await REQUESTS_SERVICE.create({
        purpose,
        propertyType: form.propertyType,
        locations: form.location
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        budgetMin: form.budgetMin ? Number(form.budgetMin) : undefined,
        budgetMax: form.budgetMax ? Number(form.budgetMax) : undefined,
        bedrooms: form.bedrooms ? parseInt(form.bedrooms, 10) : undefined,
        features,
        notes: form.notes || undefined,
        contactName: form.name,
        contactEmail: form.email,
        contactPhone: form.phone,
      });
      toast.success('Request posted — verified agents can respond.');
      setStep(0);
      setFeatures([]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not submit request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-muted">
      <SeoHead
        title="Request a Property"
        description="Tell PropertyArena agents what you want to buy, rent or short-let. Post once — free for buyers and tenants — and get matched responses."
        path="/request-property"
      />
      <MarketplaceHeader />

      <section className="border-b border-line bg-surface-elevated">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-green">Property request</p>
          <h1 className="mt-2 max-w-2xl text-3xl font-extrabold text-ink sm:text-4xl">
            Tell agents exactly what you want
          </h1>
          <p className="mt-2 max-w-xl text-sm text-ink-muted">
            Describe your budget, location and bedrooms. Verified agents browse open requests and reply with matching
            homes — including options that may not be listed yet. Free for buyers and tenants.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <div>
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`flex min-w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  i === step
                    ? 'bg-brand-green text-white'
                    : i < step
                      ? 'bg-brand-green/15 text-brand-green'
                      : 'bg-chip text-ink-muted'
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 text-[10px]">
                  {i < step ? <FiCheck /> : i + 1}
                </span>
                {s}
              </div>
            ))}
          </div>

          <form onSubmit={submit} className="rounded-3xl bg-surface-elevated p-5 shadow-sm ring-1 ring-line sm:p-8">
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-ink">What are you looking for?</h2>
                  <p className="mt-1 text-sm text-ink-muted">Pick a purpose — this shapes how agents respond.</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {PURPOSES.map(({ id, label, icon: Icon, hint }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setPurpose(id)}
                        className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                          purpose === id
                            ? 'border-brand-green bg-brand-green/5 ring-2 ring-brand-green/30'
                            : 'border-line hover:border-brand-green/40'
                        }`}
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                          <Icon />
                        </span>
                        <span>
                          <span className="block font-bold text-ink">{label}</span>
                          <span className="text-xs text-ink-muted">{hint}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-ink">Property type</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {TYPES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm({ ...form, propertyType: t })}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          form.propertyType === t
                            ? 'bg-ink text-surface'
                            : 'bg-chip text-ink-secondary hover:bg-brand-green/10'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-ink">Must-haves</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {FEATURES.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => toggleFeature(f)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          features.includes(f)
                            ? 'bg-brand-green text-white'
                            : 'border border-line text-ink-secondary'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-ink">Where and how much?</h2>
                <label className="block text-sm font-semibold text-ink">
                  Preferred location(s)
                  <input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Lekki Phase 1, Ajah, Gwarinpa"
                    className="mt-1.5 w-full rounded-xl border border-field-border bg-field px-4 py-3 text-sm outline-none focus:border-brand-green"
                    required
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="text-sm font-semibold text-ink">
                    Bedrooms
                    <select
                      value={form.bedrooms}
                      onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-field-border bg-field px-3 py-3 text-sm"
                    >
                      <option value="">Any</option>
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={String(n)}>
                          {n}+
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm font-semibold text-ink">
                    Min budget (₦)
                    <input
                      value={form.budgetMin}
                      onChange={(e) => setForm({ ...form, budgetMin: e.target.value })}
                      inputMode="numeric"
                      placeholder="10000000"
                      className="mt-1.5 w-full rounded-xl border border-field-border bg-field px-3 py-3 text-sm"
                    />
                  </label>
                  <label className="text-sm font-semibold text-ink">
                    Max budget (₦)
                    <input
                      value={form.budgetMax}
                      onChange={(e) => setForm({ ...form, budgetMax: e.target.value })}
                      inputMode="numeric"
                      placeholder="150000000"
                      className="mt-1.5 w-full rounded-xl border border-field-border bg-field px-3 py-3 text-sm"
                    />
                  </label>
                </div>
                <label className="block text-sm font-semibold text-ink">
                  Extra notes
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    placeholder="Estate preference, title needs, move-in date…"
                    className="mt-1.5 w-full rounded-xl border border-field-border bg-field px-4 py-3 text-sm"
                  />
                </label>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-ink">How agents reach you</h2>
                <p className="text-sm text-ink-muted">Shared only with agents who respond to this request.</p>
                {(['name', 'email', 'phone'] as const).map((key) => (
                  <label key={key} className="block text-sm font-semibold text-ink">
                    {key === 'name' ? 'Full name' : key === 'email' ? 'Email' : 'Phone / WhatsApp'}
                    <input
                      required
                      type={key === 'email' ? 'email' : 'text'}
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-field-border bg-field px-4 py-3 text-sm"
                    />
                  </label>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-ink">Review your brief</h2>
                <dl className="space-y-3 rounded-2xl bg-chip p-4 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-muted">Purpose</dt>
                    <dd className="font-semibold text-ink">{preview.title}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-muted">Location</dt>
                    <dd className="text-right font-semibold text-ink">{preview.location}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-muted">Beds / budget</dt>
                    <dd className="font-semibold text-ink">
                      {preview.beds} · {preview.budget}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-muted">Contact</dt>
                    <dd className="text-right font-semibold text-ink">
                      {form.name}
                      <br />
                      {form.email}
                    </dd>
                  </div>
                </dl>
                <SafetyTips compact />
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
              <button
                type="button"
                onClick={back}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-ink-secondary disabled:opacity-40"
              >
                <FiArrowLeft /> Back
              </button>
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-green px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-green-dark"
                >
                  Continue <FiArrowRight />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-green px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-green-dark disabled:opacity-60"
                >
                  {submitting ? 'Posting…' : 'Post request'}
                </button>
              )}
            </div>
          </form>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-surface-elevated p-5 shadow-sm ring-1 ring-line">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Live preview</p>
            <h3 className="mt-2 text-lg font-bold text-ink">{preview.title}</h3>
            <p className="mt-1 text-sm text-ink-secondary">{preview.location}</p>
            <p className="mt-3 text-sm font-semibold text-brand-green">
              {preview.beds} · {preview.budget}
            </p>
            {preview.features.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {preview.features.map((f) => (
                  <span key={f} className="rounded-full bg-chip px-2 py-0.5 text-[10px] font-semibold text-ink-muted">
                    {f}
                  </span>
                ))}
              </div>
            )}
            <p className="mt-4 text-xs text-ink-muted">
              Agents see this card on{' '}
              <Link to="/requests" className="font-semibold text-brand-green hover:underline">
                Browse requests
              </Link>
              .
            </p>
          </div>
          <AdSlot placement="requests_sidebar" />
        </aside>
      </div>

      <FaqSection title="Property request FAQ" items={REQUEST_FAQS} />
      <SiteFooter />
    </div>
  );
};

export default RequestProperty;
