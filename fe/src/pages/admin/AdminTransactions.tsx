import { useEffect, useState } from 'react';
import StatusBadge from '@/components/admin/StatusBadge';
import { ADMIN_SERVICE } from '@/services/admin';
import { formatKobo } from '@/services/subscription';

type Subscriber = {
  id?: string;
  _id?: string;
  status: string;
  billingCycle?: string;
  user?: string;
  plan?: string;
  currentPeriodEnd?: string;
};

type PaymentRow = {
  id?: string;
  _id?: string;
  reference?: string;
  amount?: number;
  currency?: string;
  status?: string;
  gateway?: string;
  createdAt?: string;
};

const NEXT: Record<string, string> = {
  pending: 'active',
  trial: 'active',
  active: 'suspended',
  past_due: 'active',
  grace_period: 'expired',
  suspended: 'active',
  cancelled: 'active',
  expired: 'active',
  failed: 'pending',
};

const AdminTransactions = () => {
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [error, setError] = useState('');

  const load = () => {
    Promise.all([ADMIN_SERVICE.listSubscribers(), ADMIN_SERVICE.listTransactions()])
      .then(([subRes, payRes]) => {
        setSubs((subRes as { data?: Subscriber[] }).data || []);
        setPayments((payRes as { data?: PaymentRow[] }).data || []);
      })
      .catch((err: Error) => setError(err.message || 'Admin subscription data is unavailable'));
  };

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (row: Subscriber) => {
    const id = ADMIN_SERVICE.idOf(row);
    const status = NEXT[row.status] || 'active';
    try {
      await ADMIN_SERVICE.setSubscriptionStatus(id, status);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update subscription');
    }
  };

  return (
    <div className="space-y-8">
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <section className="overflow-hidden rounded-xl bg-white shadow-sm">
        <h2 className="border-b px-4 py-3 text-lg font-semibold">Subscribers</h2>
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Subscription</th>
              <th className="px-4 py-3">Cycle</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Period end</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((row) => (
              <tr key={ADMIN_SERVICE.idOf(row)} className="border-t">
                <td className="px-4 py-3 font-mono text-xs">{ADMIN_SERVICE.idOf(row)}</td>
                <td className="px-4 py-3">{row.billingCycle}</td>
                <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                <td className="px-4 py-3">{row.currentPeriodEnd ? new Date(row.currentPeriodEnd).toLocaleDateString() : '—'}</td>
                <td className="px-4 py-3">
                  <button type="button" className="text-xs font-semibold text-admin-red" onClick={() => changeStatus(row)}>
                    Set {NEXT[row.status] || 'active'}
                  </button>
                </td>
              </tr>
            ))}
            {!subs.length && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-500">No subscriptions yet.</td></tr>
            )}
          </tbody>
        </table>
      </section>
      <section className="overflow-hidden rounded-xl bg-white shadow-sm">
        <h2 className="border-b px-4 py-3 text-lg font-semibold">Payment records</h2>
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Gateway</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((row) => (
              <tr key={ADMIN_SERVICE.idOf(row)} className="border-t">
                <td className="px-4 py-3">{row.reference || ADMIN_SERVICE.idOf(row)}</td>
                <td className="px-4 py-3">{formatKobo(row.amount || 0, row.currency || 'NGN')}</td>
                <td className="px-4 py-3">{row.gateway || '—'}</td>
                <td className="px-4 py-3"><StatusBadge status={row.status || 'pending'} /></td>
                <td className="px-4 py-3">{row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}</td>
              </tr>
            ))}
            {!payments.length && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-500">No payment records yet. Successful Paystack or Flutterwave charges appear here after webhook verification.</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminTransactions;
