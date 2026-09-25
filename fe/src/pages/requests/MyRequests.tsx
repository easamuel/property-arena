import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MarketplaceHeader from '@/components/navbar/MarketplaceHeader';
import SiteFooter from '@/components/footer/SiteFooter';
import { REQUESTS_SERVICE, PropertyRequest } from '@/services/requests';
import { useToast } from '@/hooks/useToast';

const rid = (r: PropertyRequest) => r.id ?? r._id ?? '';

const MyRequests = () => {
  const toast = useToast();
  const [items, setItems] = useState<PropertyRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    REQUESTS_SERVICE.listMine()
      .then((res) => {
        if (!cancelled) setItems(res.data ?? []);
      })
      .catch((err) => {
        if (!cancelled) toast.error(err instanceof Error ? err.message : 'Could not load your requests');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [toast]);

  const closeRequest = async (id: string) => {
    try {
      await REQUESTS_SERVICE.update(id, { status: 'closed' });
      setItems((prev) => prev.map((r) => (rid(r) === id ? { ...r, status: 'closed' } : r)));
      toast.success('Request closed.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-surface-muted">
      <MarketplaceHeader />

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-green">Dashboard</p>
            <h1 className="text-2xl font-extrabold text-gray-900">My property requests</h1>
          </div>
          <Link
            to="/request-property"
            className="rounded-lg bg-primary-green px-4 py-2 text-sm font-semibold text-white hover:bg-primary-green-hover"
          >
            New request
          </Link>
        </div>

        {loading ? (
          <p className="mt-8 text-sm text-gray-500">Loading…</p>
        ) : items.length === 0 ? (
          <p className="mt-8 rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            You have no requests yet.{' '}
            <Link to="/request-property" className="font-semibold text-primary-green">
              Submit one
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-8 space-y-4">
            {items.map((req) => (
              <li
                key={rid(req)}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div>
                  <p className="text-xs font-semibold uppercase text-primary-green">{req.status}</p>
                  <Link to={`/requests/${rid(req)}`} className="text-lg font-bold text-gray-900 hover:text-primary-green">
                    {req.propertyType} — {req.purpose}
                  </Link>
                  <p className="text-sm text-gray-600">{(req.locations ?? []).join(', ')}</p>
                  <p className="mt-1 text-xs text-gray-500">{req.responseCount} agent responses</p>
                </div>
                {req.status !== 'closed' && (
                  <button
                    type="button"
                    onClick={() => closeRequest(rid(req))}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Mark closed
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <SiteFooter />
    </div>
  );
};

export default MyRequests;
