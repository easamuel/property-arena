import { useState } from 'react';
import { WS_DEALS, formatNaira } from '@/data/workspace-demo';
import { WsPanel, WsStatus } from '@/components/workspace/WsUi';

export default function WorkspaceDeals() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-gray-500">Track negotiations from first interest to closed.</p>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg bg-[#0b2f24] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0f4a38]"
        >
          + Add Deal
        </button>
      </div>

      {open && (
        <WsPanel className="grid gap-3 p-4 sm:grid-cols-3">
          <input placeholder="Property" className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <input placeholder="Client" className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <input placeholder="Deal value (₦)" type="number" className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <button type="button" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white sm:col-span-3 sm:w-fit">
            Save deal
          </button>
        </WsPanel>
      )}

      <WsPanel>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#f6f9f7] text-[11px] uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3 sm:px-5">Property</th>
                <th className="px-4 py-3 sm:px-5">Client</th>
                <th className="px-4 py-3 sm:px-5">Value</th>
                <th className="px-4 py-3 sm:px-5">Status</th>
                <th className="px-4 py-3 sm:px-5">Date</th>
              </tr>
            </thead>
            <tbody>
              {WS_DEALS.map((row) => (
                <tr key={row.id} className="border-t border-emerald-900/5 hover:bg-emerald-50/40">
                  <td className="px-4 py-3 font-semibold text-[#0b2f24] sm:px-5">{row.property}</td>
                  <td className="px-4 py-3 text-gray-600 sm:px-5">{row.client}</td>
                  <td className="px-4 py-3 font-semibold text-[#0b2f24] sm:px-5">
                    {formatNaira(row.value)}
                  </td>
                  <td className="px-4 py-3 sm:px-5">
                    <WsStatus status={row.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-500 sm:px-5">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WsPanel>
    </div>
  );
}
