import { useEffect, useState } from 'react';
import StatCard from '@/components/admin/StatCard';
import StatusBadge from '@/components/admin/StatusBadge';
import { ADMIN_SERVICE, AdminProperty } from '@/services/admin';
import { FiHome } from 'react-icons/fi';

const STATUSES = ['available', 'pending', 'sold', 'rented'];

const AdminProperties = () => {
  const [rows, setRows] = useState<AdminProperty[]>([]);
  const [error, setError] = useState('');
  const [note, setNote] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState('');

  const load = () => {
    ADMIN_SERVICE.listProperties()
      .then((res) => setRows((res as { data?: AdminProperty[] }).data || []))
      .catch((err: Error) => setError(err.message || 'Could not load properties'));
  };

  useEffect(() => {
    load();
  }, []);

  const moderate = async (id: string, status: string) => {
    setBusyId(id);
    setError('');
    try {
      await ADMIN_SERVICE.moderateProperty(id, { status, reviewNotes: note[id] });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Moderation failed. Sign in as admin.');
    } finally {
      setBusyId('');
    }
  };

  return (
    <div className="space-y-6">
      <StatCard label="Properties" value={rows.length} icon={<FiHome />} />
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Review</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const id = ADMIN_SERVICE.idOf(row);
              return (
                <tr key={id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{row.title}</p>
                    <p className="text-xs text-gray-500">{row.propertyId || row.propertyType}</p>
                  </td>
                  <td className="px-4 py-3">{row.location || row.address}</td>
                  <td className="px-4 py-3">
                    {row.price != null ? `₦${Number(row.price).toLocaleString()}` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status || 'pending'} />
                    <select
                      className="mt-2 block rounded border border-gray-200 px-2 py-1 text-xs"
                      value={row.status || 'pending'}
                      disabled={busyId === id}
                      onChange={(e) => moderate(id, e.target.value)}
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      className="w-48 rounded border border-gray-200 px-2 py-1 text-xs"
                      placeholder="Rejection or review note"
                      value={note[id] || row.reviewNotes || ''}
                      onChange={(e) => setNote((prev) => ({ ...prev, [id]: e.target.value }))}
                    />
                    <button
                      type="button"
                      className="mt-2 block text-xs font-semibold text-admin-red"
                      disabled={busyId === id}
                      onClick={() => moderate(id, 'pending')}
                    >
                      Save note as pending
                    </button>
                  </td>
                </tr>
              );
            })}
            {!rows.length && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No properties returned by the API.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProperties;
