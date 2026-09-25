import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { ADMIN_SERVICE, AdminUser } from '@/services/admin';
import StatusBadge from '@/components/admin/StatusBadge';

const AdminAgents = () => {
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  const load = () => {
    ADMIN_SERVICE.listUsers()
      .then((res) => {
        const users = (res as { data?: AdminUser[] }).data || [];
        setRows(users.filter((user) => user.role === 'agent' || user.role === 'developer'));
      })
      .catch((err: Error) => setError(err.message || 'Sign in as admin'));
  };

  useEffect(() => {
    load();
  }, []);

  const toggleVerify = async (user: AdminUser) => {
    const id = ADMIN_SERVICE.idOf(user);
    if (!id) return;
    setBusyId(id);
    setError('');
    try {
      await ADMIN_SERVICE.setAgentVerified(id, !user.isAgentVerified);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update verification');
    } finally {
      setBusyId('');
    }
  };

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="border-b px-4 py-3">
        <h2 className="text-lg font-semibold">Agents &amp; Developers</h2>
        <p className="mt-1 text-sm text-gray-600">
          Grant the PropertyArena verification badge. Verified agents show a checkmark on their public profile.
        </p>
      </div>
      {error && <p className="px-4 py-3 text-sm text-red-700">{error}</p>}
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Verified</th>
            <th className="px-4 py-3">Profile</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((user) => {
            const id = ADMIN_SERVICE.idOf(user);
            return (
              <tr key={id || user.email} className="border-t">
                <td className="px-4 py-3 font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    {user.name}
                    {user.isAgentVerified && (
                      <FaCheckCircle className="text-emerald-600" title="Verified" />
                    )}
                  </span>
                  <p className="text-xs font-normal text-gray-500 capitalize">{user.role}</p>
                </td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.phone || '—'}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={user.isActive === false ? 'Suspended' : 'Active'} />
                </td>
                <td className="px-4 py-3">
                  {user.isAgentVerified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                      <FaCheckCircle /> Verified
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">Not verified</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {id ? (
                    <Link
                      to={`/agents/${id}`}
                      className="text-xs font-semibold text-emerald-700 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      View page →
                    </Link>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    disabled={!id || busyId === id}
                    onClick={() => toggleVerify(user)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-50 ${
                      user.isAgentVerified
                        ? 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {busyId === id
                      ? 'Saving…'
                      : user.isAgentVerified
                        ? 'Remove badge'
                        : 'Verify agent'}
                  </button>
                </td>
              </tr>
            );
          })}
          {!rows.length && !error && (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                No agent or developer accounts yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAgents;
