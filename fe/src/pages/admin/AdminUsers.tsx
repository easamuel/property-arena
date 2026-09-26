import { useEffect, useState } from 'react';
import StatCard from '@/components/admin/StatCard';
import StatusBadge from '@/components/admin/StatusBadge';
import { ADMIN_SERVICE, AdminUser } from '@/services/admin';
import { FiUsers } from 'react-icons/fi';

const ROLES = ['user', 'agent', 'agency', 'developer', 'landlord', 'admin'];

const AdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  const load = () => {
    setError('');
    ADMIN_SERVICE.listUsers()
      .then((res) => setUsers((res as { data?: AdminUser[] }).data || []))
      .catch((err: Error) => setError(err.message || 'Could not load users'));
  };

  useEffect(() => {
    load();
  }, []);

  const act = async (id: string, run: () => Promise<unknown>) => {
    setBusyId(id);
    setError('');
    try {
      await run();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setBusyId('');
    }
  };

  const active = users.filter((u) => u.isActive !== false).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Users loaded" value={users.length} icon={<FiUsers />} />
        <StatCard label="Active" value={active} accent="green" />
        <StatCard label="Suspended" value={users.length - active} accent="red" />
      </div>
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const id = ADMIN_SERVICE.idOf(user);
              return (
                <tr key={id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="rounded border border-gray-200 px-2 py-1 text-sm"
                      value={user.role}
                      disabled={busyId === id}
                      onChange={(e) => act(id, () => ADMIN_SERVICE.setUserRole(id, e.target.value))}
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">{user.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={user.isActive === false ? 'Suspended' : 'Active'} />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      disabled={busyId === id}
                      className="rounded border border-gray-200 px-3 py-1 text-xs font-semibold"
                      onClick={() => act(id, () => ADMIN_SERVICE.setUserActive(id, user.isActive === false))}
                    >
                      {user.isActive === false ? 'Restore' : 'Suspend'}
                    </button>
                  </td>
                </tr>
              );
            })}
            {!users.length && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No users yet. Sign in with an admin account to load the live list.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
