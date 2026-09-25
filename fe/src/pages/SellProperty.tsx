import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import MarketplaceHeader from '@/components/navbar/MarketplaceHeader';
import SiteFooter from '@/components/footer/SiteFooter';
import { useToast } from '@/hooks/useToast';

const STEPS = ['Property Details', 'Location & Price', 'Media Upload', 'Review & Publish'];

const FEATURES = [
  'Swimming Pool',
  'Parking Space',
  '24/7 Security',
  'Gym',
  'Generator',
  'Servant Quarters',
  'Study Room',
  'CCTV',
  'Balcony',
  'Elevator',
  'Fitted Kitchen',
  'BQ',
  'Smart Home',
  'Water Treatment',
  'Others',
];

const HERO =
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&auto=format&fit=crop';

const SellProperty = () => {
  const toast = useToast();
  const [listingType, setListingType] = useState<'sell' | 'rent'>('sell');
  const [step, setStep] = useState(0);
  const [features, setFeatures] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    toilets: '',
    description: '',
    state: 'Lagos',
    city: 'Lekki',
    address: '',
    price: '',
  });

  const toggleFeature = (f: string) => {
    setFeatures((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    toast.success('Property listing submitted for review!');
    setStep(0);
  };

  return (
    <div className="min-h-screen bg-surface-muted">
      <MarketplaceHeader />

      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${HERO}')` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E1A17]/92 via-[#0E1A17]/80 to-transparent" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 lg:grid-cols-2 lg:py-20 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary-green">Sell a Property</p>
            <h1 className="mt-2 text-3xl font-extrabold leading-tight md:text-4xl lg:text-5xl">
              Sell Your Property The Smart Way
            </h1>
            <p className="mt-4 max-w-lg text-white/80">
              List your property and connect with thousands of verified buyers. Get the best price with zero hassle.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              {['Reach Serious Buyers', 'Maximum Visibility', 'Fast & Easy Process', 'Trusted Platform'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <FiCheck className="text-primary-green" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -bottom-2 left-6 rounded-xl bg-white p-4 text-gray-900 shadow-xl">
              <p className="text-sm font-semibold">Trusted by 10,000+ sellers</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-amber-500">
                {[1, 2, 3, 4, 5].map((i) => (
                  <FaStar key={i} />
                ))}
                <span className="ml-1 text-gray-600">4.9/5 (2,100+ reviews)</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-6 flex flex-wrap gap-2">
              {STEPS.map((s, i) => (
                <div
                  key={s}
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
                    i === step
                      ? 'bg-primary-green text-white'
                      : i < step
                        ? 'bg-primary-green/15 text-primary-green'
                        : 'border border-gray-200 bg-white text-gray-500'
                  }`}
                >
                  <span className="font-bold">{i + 1}</span> {s}
                </div>
              ))}
            </div>

            <form onSubmit={submit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-lg font-bold text-gray-900">{STEPS[step]}</h2>
              <p className="text-sm text-gray-500">We&apos;ll help you attract the right buyers.</p>

              {step === 0 && (
                <div className="mt-6 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium">I want to *</label>
                    <div className="flex gap-2">
                      {(['sell', 'rent'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setListingType(t)}
                          className={`rounded-lg px-5 py-2 text-sm font-semibold capitalize ${
                            listingType === t ? 'bg-primary-green text-white' : 'border border-gray-200'
                          }`}
                        >
                          {t === 'rent' ? 'Rent Out' : 'Sell'}
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
                      <option>Terrace</option>
                    </select>
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium">Property Title *</span>
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5"
                      placeholder="e.g. 4 Bedroom Duplex with BQ in Lekki"
                      required
                    />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {(
                      [
                        ['Bedrooms', 'bedrooms'],
                        ['Bathrooms', 'bathrooms'],
                        ['Toilets', 'toilets'],
                      ] as const
                    ).map(([label, key]) => (
                      <label key={key} className="block text-sm">
                        <span className="mb-1 block font-medium">{label}</span>
                        <select
                          value={form[key]}
                          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2.5"
                        >
                          <option value="">—</option>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n}>{n}</option>
                          ))}
                        </select>
                      </label>
                    ))}
                  </div>
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium">Property Description *</span>
                    <textarea
                      rows={5}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5"
                      maxLength={1000}
                      required
                    />
                    <span className="text-xs text-gray-400">{form.description.length}/1000</span>
                  </label>
                  <div>
                    <span className="mb-2 block text-sm font-medium">Property Features</span>
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
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium">State *</span>
                    <input
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5"
                      required
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium">City / Area *</span>
                    <input
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5"
                      required
                    />
                  </label>
                  <label className="block text-sm sm:col-span-2">
                    <span className="mb-1 block font-medium">Street Address *</span>
                    <input
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5"
                      required
                    />
                  </label>
                  <label className="block text-sm sm:col-span-2">
                    <span className="mb-1 block font-medium">Asking Price (₦) *</span>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5"
                      required
                    />
                  </label>
                </div>
              )}

              {step === 2 && (
                <div className="mt-6">
                  <div className="flex h-48 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-center">
                    <p className="text-sm font-semibold text-gray-700">Drag & drop photos here</p>
                    <p className="mt-1 text-xs text-gray-400">JPG, PNG up to 10MB · demo upload only</p>
                    <button type="button" className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white">
                      Browse Files
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="mt-6 space-y-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
                  <p><span className="font-semibold">Title:</span> {form.title || '—'}</p>
                  <p><span className="font-semibold">Type:</span> {form.propertyType || '—'} · {listingType}</p>
                  <p><span className="font-semibold">Location:</span> {form.city}, {form.state}</p>
                  <p><span className="font-semibold">Price:</span> {form.price ? `₦${Number(form.price).toLocaleString()}` : '—'}</p>
                  <p><span className="font-semibold">Features:</span> {features.join(', ') || 'None selected'}</p>
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
                    Next: {STEPS[step + 1]} →
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="rounded-lg bg-primary-green px-6 py-3 text-sm font-semibold text-white hover:bg-primary-green-hover"
                  >
                    Publish Listing
                  </button>
                )}
              </div>
            </form>
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="font-semibold">Why sell on PropertyArena?</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                {['Massive exposure to verified buyers', 'Professional marketing support', 'Secure payments', 'Dedicated agent support'].map(
                  (t) => (
                    <li key={t} className="flex gap-2">
                      <FiCheck className="shrink-0 text-primary-green" />
                      {t}
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="font-semibold">Seller success in numbers</h3>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-center text-sm">
                <div>
                  <dt className="text-gray-500">Sold</dt>
                  <dd className="font-bold text-primary-green">10,000+</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Buyers</dt>
                  <dd className="font-bold">25,000+</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Sales value</dt>
                  <dd className="font-bold">₦50B+</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Satisfaction</dt>
                  <dd className="font-bold">98%</dd>
                </div>
              </dl>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="font-semibold">What sellers say</h3>
              <p className="mt-3 text-sm text-gray-600">
                “Listed my duplex and got serious offers within a week. The process was clear and professional.”
              </p>
              <p className="mt-2 text-xs font-semibold text-gray-800">— Funke A., Lekki</p>
            </div>
            <Link
              to="/create-property"
              className="block rounded-lg bg-primary-green py-3 text-center text-sm font-semibold text-white hover:bg-primary-green-hover"
            >
              List Your Property Now →
            </Link>
          </aside>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default SellProperty;
