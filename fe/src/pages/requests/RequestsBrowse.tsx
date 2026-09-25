import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin } from 'react-icons/fi';
import MarketplaceHeader from '@/components/navbar/MarketplaceHeader';
import SiteFooter from '@/components/footer/SiteFooter';
import SeoHead from '@/components/seo/SeoHead';
import { REQUESTS_SERVICE, PropertyRequest, RequestPurpose } from '@/services/requests';

const PURPOSE_OPTIONS: { value: RequestPurpose | ''; label: string }[] = [
  { value: '', label: 'Any purpose' },
  { value: 'sale', label: 'Buy / Sale' },
  { value: 'rent', label: 'Rent' },
  { value: 'shortlet', label: 'Short let' },
  { value: 'lease', label: 'Lease' },
];

const formatBudget = (min?: number, max?: number) => {
  if (min == null && max == null) return 'Budget flexible';
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n);
  if (min != null && max != null) return `${fmt(min)} – ${fmt(max)}`;
  if (min != null) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
};

const requestId = (r: PropertyRequest) => r.id ?? r._id ?? '';

const RequestsBrowse = () => {
  const [items, setItems] = useState<PropertyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    purpose: '' as RequestPurpose | '',
    propertyType: '',
    location: '',
  });

  const load = async (override?: typeof filters) => {
    setLoading(true);
    try {
      const f = override ?? filters;
      const res = await REQUESTS_SERVICE.list({
        purpose: f.purpose || undefined,
        propertyType: f.propertyType || undefined,
        location: f.location || undefined,
        limit: 30,
      });
      setItems(res.data.items ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFilter = (e: FormEvent) => {
    e.preventDefault();
    load(filters);
  };

  return (
    <div className="min-h-screen bg-surface-muted">
      <SeoHead
        title="Browse Property Requests"
        description="See open buyer and tenant requests across Nigeria. Agents can respond with matching listings."
        path="/requests"
      />
      <MarketplaceHeader />

      <section className="border-b border-gray-100 bg-white py-10 dark:border-line dark:bg-surface-elevated">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-green">Property Requests</p>
          <h1 className="mt-1 text-3xl font-extrabold text-ink">Browse buyer &amp; tenant requests</h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-secondary">
            Verified agents can respond to open requests. Contact details are masked until you sign in as an agent.
          </p>
          <Link
            to="/request-property"
            className="mt-4 inline-flex min-h-[44px] items-center rounded-lg bg-brand-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-dark"
          >
            Post your request
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <form
          onSubmit={onFilter}
          className="mb-8 grid gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-line dark:bg-surface-elevated sm:grid-cols-4"
        >
          <select
            value={filters.purpose}
            onChange={(e) => setFilters({ ...filters, purpose: e.target.value as RequestPurpose | '' })}
            className="min-h-[44px] rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-line dark:bg-surface-muted"
          >
            {PURPOSE_OPTIONS.map((o) => (
              <option key={o.label} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <input
            placeholder="Property type"
            value={filters.propertyType}
            onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
            className="min-h-[44px] rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-line dark:bg-surface-muted"
          />
          <input
            placeholder="Location"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="min-h-[44px] rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-line dark:bg-surface-muted"
          />
          <button
            type="submit"
            className="min-h-[44px] rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:bg-brand-green-dark"
          >
            Apply filters
          </button>
        </form>

        {loading ? (
          <p className="text-sm text-gray-500">Loading requests…</p>
        ) : items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            No open requests match your filters.
          </p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {items.map((req) => (
              <li key={requestId(req)}>
                <Link
                  to={`/requests/${requestId(req)}`}
                  className="block rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-primary-green/30 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-full bg-primary-green/10 px-2.5 py-0.5 text-xs font-semibold uppercase text-primary-green">
                      {req.purpose}
                    </span>
                    <span className="text-xs text-gray-400">{req.responseCount} responses</span>
                  </div>
                  <h2 className="mt-2 text-lg font-bold text-gray-900">{req.propertyType}</h2>
                  <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                    <FiMapPin className="shrink-0 text-primary-red" />
                    {(req.locations ?? []).join(', ') || 'Any location'}
                  </p>
                  <p className="mt-2 text-sm font-medium text-gray-800">{formatBudget(req.budgetMin, req.budgetMax)}</p>
                  {(req.bedrooms != null || req.bathrooms != null) && (
                    <p className="mt-1 text-xs text-gray-500">
                      {req.bedrooms != null ? `${req.bedrooms}+ beds` : ''}
                      {req.bedrooms != null && req.bathrooms != null ? ' · ' : ''}
                      {req.bathrooms != null ? `${req.bathrooms}+ baths` : ''}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <SiteFooter />
    </div>
  );
};

export default RequestsBrowse;
