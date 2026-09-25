import { FormEvent, useState } from 'react';
import { FiCheck, FiMapPin } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import MarketplaceHeader from '@/components/navbar/MarketplaceHeader';
import SiteFooter from '@/components/footer/SiteFooter';
import { useToast } from '@/hooks/useToast';
import { REQUESTS_SERVICE } from '@/services/requests';

const STEPS = ['Your Requirements', 'Your Details', 'Review & Submit'];

const FEATURES = [
  'Swimming Pool',
  'Parking Space',
  '24/7 Security',
  'Furnished',
  'Serviced Apartment',
  'Gym',
  'Elevator',
  'Garden',
  'Study Room',
  'Other',
];

const HERO =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop';

const RequestProperty = () => {
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [purpose, setPurpose] = useState<'sale' | 'rent' | 'shortlet' | 'lease'>('sale');
  const [features, setFeatures] = useState<string[]>([]);
  const [form, setForm] = useState({
    propertyType: '',
    location: 'Lekki, Lagos',
    budgetMin: '',
    budgetMax: '',
    bedrooms: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const toggleFeature = (f: string) => {
    setFeatures((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
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
      toast.success('Property request submitted. Agents can now view and respond.');
      setStep(0);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not submit request');
    }
  };

  return (
    <div className="min-h-screen bg-surface-muted">
      <MarketplaceHeader />

      <section className="relative overflow-hidden py-16 text-white sm:py-20">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${HERO}')` }} />
        <div className="absolute inset-0 bg-[#0E1A17]/80" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-green">Request a Property</p>
          <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">Let Us Find the Right Property for You</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/75">
            Tell us what you need and our verified agents will match you with off-market and listed opportunities.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
            {['100% Free Service', 'Expert Property Match', 'Access Off-Market Properties'].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-green/20 text-primary-green">
                  <FiCheck />
                </span>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
                i === step ? 'bg-primary-green text-white' : 'border border-gray-200 bg-white text-gray-500'
              }`}
            >
              <span className="font-bold">{i + 1}</span> {s}
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">I want to *</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'sale' as const, label: 'Buy' },
                    { id: 'rent' as const, label: 'Rent' },
                    { id: 'shortlet' as const, label: 'Short Let' },
                    { id: 'lease' as const, label: 'Lease' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPurpose(p.id)}
                      className={`rounded-lg px-5 py-2 text-sm font-semibold ${
                        purpose === p.id ? 'bg-primary-green text-white' : 'border border-gray-200'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Property Type *</span>
                <select
                  value={form.propertyType}
                  onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5"
                  required
                >
                  <option value="">Select type</option>
                  <option>Duplex</option>
                  <option>Apartment</option>
                  <option>Bungalow</option>
                  <option>Land</option>
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Preferred Location *</span>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-red" />
                  <input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3"
                    required
                  />
                </div>
              </label>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block text-sm">
                  <span className="mb-1 block font-medium">Min Budget</span>
                  <input
                    value={form.budgetMin}
                    onChange={(e) => setForm({ ...form, budgetMin: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5"
                    placeholder="₦"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium">Max Budget</span>
                  <input
                    value={form.budgetMax}
                    onChange={(e) => setForm({ ...form, budgetMax: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5"
                    placeholder="₦"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium">Bedrooms</span>
                  <select
                    value={form.bedrooms}
                    onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5"
                  >
                    <option value="">Any</option>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n}>{n}+</option>
                    ))}
                  </select>
                </label>
              </div>
              <div>
                <span className="mb-2 block text-sm font-medium">Must-have Features</span>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {FEATURES.map((f) => (
                    <label key={f} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={features.includes(f)}
                        onChange={() => toggleFeature(f)}
                        className="rounded text-primary-green"
                      />
                      {f}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Full Name *</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5"
                  required
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Email *</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5"
                  required
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Phone *</span>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5"
                  required
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Additional Notes</span>
                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5"
                />
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
              <p><span className="font-semibold">Purpose:</span> {purpose}</p>
              <p><span className="font-semibold">Type:</span> {form.propertyType || '—'}</p>
              <p><span className="font-semibold">Location:</span> {form.location}</p>
              <p>
                <span className="font-semibold">Budget:</span> {form.budgetMin || '—'} – {form.budgetMax || '—'}
              </p>
              <p><span className="font-semibold">Contact:</span> {form.name} · {form.email} · {form.phone}</p>
              <p><span className="font-semibold">Features:</span> {features.join(', ') || 'None'}</p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-between gap-4 border-t pt-6">
            <button type="button" onClick={back} disabled={step === 0} className="text-sm text-gray-500 disabled:opacity-40">
              ← Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className="rounded-lg bg-primary-green px-6 py-3 text-sm font-semibold text-white hover:bg-primary-green-hover"
              >
                Continue →
              </button>
            ) : (
              <button
                type="submit"
                className="rounded-lg bg-primary-green px-6 py-3 text-sm font-semibold text-white hover:bg-primary-green-hover"
              >
                Submit Request
              </button>
            )}
          </div>
        </form>

        <section className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h3 className="font-bold text-gray-900">How it works</h3>
            <ol className="mt-4 space-y-3 text-sm text-gray-600">
              <li className="flex gap-2"><span className="font-bold text-primary-green">1.</span> Share your requirements</li>
              <li className="flex gap-2"><span className="font-bold text-primary-green">2.</span> We match verified agents</li>
              <li className="flex gap-2"><span className="font-bold text-primary-green">3.</span> Tour and close with confidence</li>
            </ol>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h3 className="font-bold text-gray-900">Client love</h3>
            <div className="mt-2 flex gap-1 text-amber-400 text-sm">
              {[1, 2, 3, 4, 5].map((i) => (
                <FaStar key={i} />
              ))}
            </div>
            <p className="mt-3 text-sm text-gray-600">
              “Requested a 3-bed in Ikoyi and got three solid options the next day.”
            </p>
            <p className="mt-2 text-xs font-semibold">— Ibrahim M.</p>
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
};

export default RequestProperty;
