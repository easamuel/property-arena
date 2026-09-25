import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StatCard } from '@/components/admin/StatCard';
import { ADMIN_SERVICE, AdminUser } from '@/services/admin';
import { HiOutlineOfficeBuilding, HiOutlineUsers, HiOutlineUserGroup, HiOutlineClipboardList, HiOutlineCash } from 'react-icons/hi';
import { formatKobo } from '@/services/subscription';

type Summary = { users: number; properties: number; leads: number; bookings: number };

const links = [
  { to: '/admin/properties', title: 'Properties', desc: 'Review and change listing status' },
  { to: '/admin/users', title: 'Users', desc: 'Change roles and suspend accounts' },
  { to: '/admin/packages', title: 'Packages', desc: 'Create and activate plans' },
  { to: '/admin/transactions', title: 'Subscriptions', desc: 'Subscribers and payment records' },
  { to: '/admin/leads', title: 'Leads', desc: 'Enquiries saved from the site' },
  { to: '/admin/reports', title: 'Reports', desc: 'Live counts from the database' },
];

export default function AdminDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [agents, setAgents] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      ADMIN_SERVICE.reports(),
      ADMIN_SERVICE.listUsers(),
      ADMIN_SERVICE.listTransactions(),
    ])
      .then(([reportRes, userRes, txRes]) => {
        setSummary((reportRes as { data: Summary }).data);
        const users = (userRes as { data?: AdminUser[] }).data || [];
        setAgents(users.filter((user) => user.role === 'agent').length);
        const payments = (txRes as { data?: { amount?: number; status?: string }[] }).data || [];
        setRevenue(
          payments
            .filter((row) => row.status === 'success' || row.status === 'successful')
            .reduce((sum, row) => sum + (row.amount || 0), 0),
        );
      })
      .catch((err: Error) => setError(err.message || 'Sign in as admin to load live totals'));
  }, []);

  return (
    <div className="space-y-6">
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Properties" value={summary?.properties ?? '—'} icon={<HiOutlineOfficeBuilding className="h-5 w-5" />} />
        <StatCard label="Users" value={summary?.users ?? '—'} accent="red" icon={<HiOutlineUsers className="h-5 w-5" />} />
        <StatCard label="Agents" value={error ? '—' : agents} icon={<HiOutlineUserGroup className="h-5 w-5" />} />
        <StatCard label="Leads" value={summary?.leads ?? '—'} accent="blue" icon={<HiOutlineClipboardList className="h-5 w-5" />} />
        <StatCard label="Successful payments" value={error ? '—' : formatKobo(revenue)} accent="purple" icon={<HiOutlineCash className="h-5 w-5" />} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {links.map((item) => (
          <Link key={item.to} to={item.to} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm hover:border-admin-red/40">
            <div className="text-lg font-bold">{item.title}</div>
            <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
