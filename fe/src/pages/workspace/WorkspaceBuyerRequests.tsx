import { useMemo, useState } from 'react';
import { WS_BUYER_REQUESTS } from '@/data/workspace-demo';
import { WsPanel, WsStatus } from '@/components/workspace/WsUi';

const TABS = ['All Requests', 'New', 'In-Progress', 'Closed'] as const;

export default function WorkspaceBuyerRequests() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('All Requests');

  const rows = useMemo(() => {
    if (tab === 'All Requests') return WS_BUYER_REQUESTS;
    return WS_BUYER_REQUESTS.filter((r) => r.status === tab);
  }, [tab]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Match open buyer briefs to your inventory.</p>
      <WsPanel>
        <div className="flex flex-wrap gap-1 border-b border-emerald-900/5 px-3 pt-3">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-t-lg px-3 py-2 text-sm font-semibold transition ${
                tab === t
                  ? 'border-b-2 border-emerald-600 text-emerald-700'
                  : 'text-gray-500 hover:text-[#0b2f24]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#f6f9f7] text-[11px] uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3 sm:px-5">Client</th>
                <th className="px-4 py-3 sm:px-5">Looking for</th>
                <th className="px-4 py-3 sm:px-5">Location</th>
                <th className="px-4 py-3 sm:px-5">Budget</th>
                <th className="px-4 py-3 sm:px-5">Date</th>
                <th className="px-4 py-3 sm:px-5">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-emerald-900/5 hover:bg-emerald-50/40">
                  <td className="px-4 py-3 font-semibold text-[#0b2f24] sm:px-5">{row.client}</td>
                  <td className="px-4 py-3 text-gray-600 sm:px-5">{row.property}</td>
                  <td className="px-4 py-3 text-gray-600 sm:px-5">{row.location}</td>
                  <td className="px-4 py-3 font-medium text-[#0b2f24] sm:px-5">{row.budget}</td>
                  <td className="px-4 py-3 text-gray-500 sm:px-5">{row.date}</td>
                  <td className="px-4 py-3 sm:px-5">
                    <WsStatus status={row.status} />
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-500">
                    No requests in this tab.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </WsPanel>
    </div>
  );
}
