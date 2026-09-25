import { useEffect, useState } from 'react';
import { ADMIN_SERVICE, AdminUser } from '@/services/admin';
import StatusBadge from '@/components/admin/StatusBadge';

const RoleList = ({ role, title }: { role: string; title: string }) => {
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    ADMIN_SERVICE.listUsers()
      .then((res) => {
        const users = (res as { data?: AdminUser[] }).data || [];
        setRows(users.filter((user) => user.role === role));
      })
      .catch((err: Error) => setError(err.message || 'Sign in as admin'));
  }, [role]);

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <h2 className="border-b px-4 py-3 text-lg font-semibold">{title}</h2>
      {error && <p className="px-4 py-3 text-sm text-red-700">{error}</p>}
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((user) => (
            <tr key={user.id || user._id || user.email} className="border-t">
              <td className="px-4 py-3 font-medium">{user.name}</td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">{user.phone || '—'}</td>
              <td className="px-4 py-3">
                <StatusBadge status={user.isActive === false ? 'Suspended' : 'Active'} />
              </td>
            </tr>
          ))}
          {!rows.length && !error && (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No {role} accounts yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default function AdminAgents() {
  return <RoleList role="agent" title="Agents" />;
}
