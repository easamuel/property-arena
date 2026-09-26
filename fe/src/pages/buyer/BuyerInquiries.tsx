import { useMemo, useState } from 'react';
import { BUYER_INQUIRIES } from '@/data/buyer-demo';
import { BuyerCard, BuyerStatus } from '@/components/buyer/BuyerUi';

const TABS = ['All', 'Pending', 'Viewed', 'Closed'] as const;

export default function BuyerInquiries() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('All');
  const rows = useMemo(
    () => (tab === 'All' ? BUYER_INQUIRIES : BUYER_INQUIRIES.filter((r) => r.status === tab)),
    [tab],
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">My Inquiries</h1>
        <p className="mt-1 text-sm text-gray-500">Track enquiries you sent to agents and landlords.</p>
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-xl bg-white p-1 shadow-sm ring-1 ring-gray-100">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              tab === t ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <BuyerCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#f8faf9] text-[11px] uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3 sm:px-5">Property</th>
                <th className="px-4 py-3 sm:px-5">Date</th>
                <th className="px-4 py-3 sm:px-5">Status</th>
                <th className="px-4 py-3 sm:px-5">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-gray-100 hover:bg-emerald-50/40">
                  <td className="px-4 py-3 sm:px-5">
                    <div className="flex items-center gap-3">
                      <img src={row.thumb} alt="" className="h-12 w-16 rounded-lg object-cover" />
                      <span className="font-semibold text-gray-900">{row.property}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 sm:px-5">{row.date}</td>
                  <td className="px-4 py-3 sm:px-5">
                    <BuyerStatus status={row.status} />
                  </td>
                  <td className="px-4 py-3 sm:px-5">
                    <button
                      type="button"
                      className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {!rows.length ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-gray-500">
                    No inquiries in this tab.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </BuyerCard>
    </div>
  );
}
