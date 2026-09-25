import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PROPERTY_SERVICE } from '@/services/property';

type Listing = {
  id?: string;
  _id?: string;
  title?: string;
  status?: string;
  price?: number;
  location?: string;
  address?: string;
};

const Dashboard = () => {
  const [rows, setRows] = useState<Listing[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    PROPERTY_SERVICE.getUserProperties(1, 20)
      .then((res) => setRows((res as { data?: Listing[] }).data || []))
      .catch((err: Error) => setError(err.message || 'Could not load your listings'));
  }, []);

  const published = rows.filter((row) => row.status === 'available').length;

  return (
    <div className="space-y-6 px-6 py-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Your listings</p>
          <p className="mt-1 text-2xl font-bold">{error ? '—' : rows.length}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Available</p>
          <p className="mt-1 text-2xl font-bold">{error ? '—' : published}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Other statuses</p>
          <p className="mt-1 text-2xl font-bold">{error ? '—' : rows.length - published}</p>
        </div>
      </div>
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="font-semibold">My properties</h2>
          <Link to="/create-property" className="text-sm font-semibold text-primary-green">Post a property</Link>
        </div>
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id || row._id} className="border-t">
                <td className="px-4 py-3 font-medium">{row.title}</td>
                <td className="px-4 py-3">{row.location || row.address || '—'}</td>
                <td className="px-4 py-3">{row.price != null ? `₦${Number(row.price).toLocaleString()}` : '—'}</td>
                <td className="px-4 py-3 capitalize">{row.status || '—'}</td>
              </tr>
            ))}
            {!rows.length && !error && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">You have no listings yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
