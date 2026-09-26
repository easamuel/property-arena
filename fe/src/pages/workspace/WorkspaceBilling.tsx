import { FiDownload } from 'react-icons/fi';
import { WS_BILLING, formatNaira } from '@/data/workspace-demo';
import { WsPanel, WsStatus } from '@/components/workspace/WsUi';

export default function WorkspaceBilling() {
  return (
    <WsPanel>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#f6f9f7] text-[11px] uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3 sm:px-5">Date</th>
              <th className="px-4 py-3 sm:px-5">Description</th>
              <th className="px-4 py-3 sm:px-5">Amount</th>
              <th className="px-4 py-3 sm:px-5">Status</th>
              <th className="px-4 py-3 sm:px-5">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {WS_BILLING.map((row) => (
              <tr key={row.id} className="border-t border-emerald-900/5 hover:bg-emerald-50/40">
                <td className="px-4 py-3 text-gray-600 sm:px-5">{row.date}</td>
                <td className="px-4 py-3 font-semibold text-[#0b2f24] sm:px-5">{row.description}</td>
                <td className="px-4 py-3 font-semibold text-[#0b2f24] sm:px-5">
                  {formatNaira(row.amount)}
                </td>
                <td className="px-4 py-3 sm:px-5">
                  <WsStatus status={row.status} />
                </td>
                <td className="px-4 py-3 sm:px-5">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:underline"
                  >
                    <FiDownload /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WsPanel>
  );
}
