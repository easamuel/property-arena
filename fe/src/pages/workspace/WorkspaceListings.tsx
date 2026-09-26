import { useMemo, useState } from 'react';
import { FiMoreVertical, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { WS_LISTINGS, formatNaira } from '@/data/workspace-demo';
import { WsPanel, WsStatus } from '@/components/workspace/WsUi';

export default function WorkspaceListings() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All Status');

  const rows = useMemo(() => {
    return WS_LISTINGS.filter((row) => {
      const hay = `${row.title} ${row.location} ${row.type}`.toLowerCase();
      const matchQ = !q || hay.includes(q.toLowerCase());
      const matchStatus = status === 'All Status' || row.status === status;
      return matchQ && matchStatus;
    });
  }, [q, status]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">{rows.length} properties in your inventory</p>
        <Link
          to="/workspace/post-property"
          className="inline-flex items-center justify-center rounded-lg bg-[#0b2f24] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0f4a38]"
        >
          + Post a Property
        </Link>
      </div>

      <WsPanel>
        <div className="flex flex-col gap-3 border-b border-emerald-900/5 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search listings…"
              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-3 text-sm focus:border-emerald-600 focus:outline-none"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Pending</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#f6f9f7] text-[11px] uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3 sm:px-5">Property</th>
                <th className="px-4 py-3 sm:px-5">Location</th>
                <th className="px-4 py-3 sm:px-5">Type</th>
                <th className="px-4 py-3 sm:px-5">Price</th>
                <th className="px-4 py-3 sm:px-5">Status</th>
                <th className="px-4 py-3 sm:px-5" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-emerald-900/5 hover:bg-emerald-50/40">
                  <td className="px-4 py-3 sm:px-5">
                    <div className="flex items-center gap-3">
                      <img src={row.thumb} alt="" className="h-12 w-16 rounded-md object-cover" />
                      <div>
                        <p className="font-semibold text-[#0b2f24]">{row.title}</p>
                        <p className="text-xs text-gray-400">{row.views} views</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 sm:px-5">{row.location}</td>
                  <td className="px-4 py-3 text-gray-600 sm:px-5">{row.type}</td>
                  <td className="px-4 py-3 font-semibold text-[#0b2f24] sm:px-5">
                    {formatNaira(row.price)}
                  </td>
                  <td className="px-4 py-3 sm:px-5">
                    <WsStatus status={row.status} />
                  </td>
                  <td className="px-4 py-3 sm:px-5">
                    <button type="button" className="rounded-lg p-2 text-gray-400 hover:bg-gray-100" aria-label="Actions">
                      <FiMoreVertical />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WsPanel>
    </div>
  );
}
