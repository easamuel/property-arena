import { useEffect, useState } from 'react';
import StatCard from '@/components/admin/StatCard';
import { ADMIN_SERVICE } from '@/services/admin';
import { FiHome, FiUsers, FiMessageSquare, FiCalendar } from 'react-icons/fi';

type Summary = {
  users: number;
  properties: number;
  leads: number;
  bookings: number;
  pages: number;
  promotions: number;
  articles: number;
};

const AdminReports = () => {
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    ADMIN_SERVICE.reports()
      .then((res) => setData((res as { data: Summary }).data))
      .catch((err: Error) => setError(err.message || 'Reports need an admin session'));
  }, []);

  return (
    <div className="space-y-4">
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Users" value={data?.users ?? '—'} icon={<FiUsers />} />
        <StatCard label="Properties" value={data?.properties ?? '—'} icon={<FiHome />} />
        <StatCard label="Leads" value={data?.leads ?? '—'} icon={<FiMessageSquare />} />
        <StatCard label="Bookings" value={data?.bookings ?? '—'} icon={<FiCalendar />} />
        <StatCard label="Pages" value={data?.pages ?? '—'} />
        <StatCard label="Promotions" value={data?.promotions ?? '—'} />
        <StatCard label="Articles" value={data?.articles ?? '—'} />
      </div>
    </div>
  );
};

export default AdminReports;
