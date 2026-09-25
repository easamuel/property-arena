import { FormEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MarketplaceHeader from '@/components/navbar/MarketplaceHeader';
import SiteFooter from '@/components/footer/SiteFooter';
import { REQUESTS_SERVICE, PropertyRequest } from '@/services/requests';
import { useToast } from '@/hooks/useToast';
import { useAuthStore } from '@/store/authStore';

const RequestDetail = () => {
  const { id } = useParams();
  const toast = useToast();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [request, setRequest] = useState<PropertyRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    REQUESTS_SERVICE.getById(id)
      .then((res) => {
        if (!cancelled) setRequest(res.data);
      })
      .catch((err) => {
        if (!cancelled) toast.error(err instanceof Error ? err.message : 'Could not load request');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, toast]);

  const onRespond = async (e: FormEvent) => {
    e.preventDefault();
    if (!id || !message.trim()) return;
    setSubmitting(true);
    try {
      await REQUESTS_SERVICE.respond(id, message.trim());
      toast.success('Your response was sent.');
      setMessage('');
      const refreshed = await REQUESTS_SERVICE.getById(id);
      setRequest(refreshed.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not send response');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-muted">
      <MarketplaceHeader />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link to="/requests" className="text-sm font-medium text-primary-green hover:underline">
          ← All requests
        </Link>

        {loading ? (
          <p className="mt-8 text-sm text-gray-500">Loading…</p>
        ) : !request ? (
          <p className="mt-8 text-sm text-gray-500">Request not found.</p>
        ) : (
          <article className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <span className="rounded-full bg-primary-green/10 px-3 py-1 text-xs font-semibold uppercase text-primary-green">
              {request.purpose} · {request.status}
            </span>
            <h1 className="mt-3 text-2xl font-extrabold text-gray-900">{request.propertyType}</h1>
            <p className="mt-2 text-sm text-gray-600">{(request.locations ?? []).join(', ')}</p>

            <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-gray-500">Budget</dt>
                <dd className="font-medium text-gray-900">
                  {request.budgetMin ?? '—'} – {request.budgetMax ?? '—'}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Bed / Bath</dt>
                <dd className="font-medium text-gray-900">
                  {request.bedrooms ?? 'Any'} / {request.bathrooms ?? 'Any'}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-gray-500">Features</dt>
                <dd className="font-medium text-gray-900">
                  {(request.features ?? []).length ? request.features.join(', ') : 'None specified'}
                </dd>
              </div>
              {request.notes && (
                <div className="sm:col-span-2">
                  <dt className="text-gray-500">Notes</dt>
                  <dd className="text-gray-800">{request.notes}</dd>
                </div>
              )}
              <div>
                <dt className="text-gray-500">Contact</dt>
                <dd className="font-medium text-gray-900">
                  {request.contactName}
                  <br />
                  {request.contactEmail}
                  <br />
                  {request.contactPhone}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Responses</dt>
                <dd className="font-medium text-gray-900">{request.responseCount}</dd>
              </div>
            </dl>

            {accessToken ? (
              <form onSubmit={onRespond} className="mt-8 border-t pt-6">
                <h2 className="text-sm font-bold text-gray-900">Respond as agent</h2>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Describe matching listings or next steps…"
                  required
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-3 rounded-lg bg-primary-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-green-hover disabled:opacity-60"
                >
                  {submitting ? 'Sending…' : 'Send response'}
                </button>
              </form>
            ) : (
              <p className="mt-8 border-t pt-6 text-sm text-gray-600">
                <Link to="/login" className="font-semibold text-primary-green hover:underline">
                  Sign in
                </Link>{' '}
                to respond to this request.
              </p>
            )}
          </article>
        )}
      </div>

      <SiteFooter />
    </div>
  );
};

export default RequestDetail;
