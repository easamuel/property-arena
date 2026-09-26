import { BUYER_PAYMENTS } from '@/data/buyer-demo';
import { BuyerCard, BuyerStatus } from '@/components/buyer/BuyerUi';

export default function BuyerPayments() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Payments</h1>
        <p className="mt-1 text-sm text-gray-500">Your PropertyArena charges and invoices.</p>
      </div>

      <BuyerCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#f8faf9] text-[11px] uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3 sm:px-5">Date</th>
                <th className="px-4 py-3 sm:px-5">Description</th>
                <th className="px-4 py-3 sm:px-5">Amount</th>
                <th className="px-4 py-3 sm:px-5">Status</th>
                <th className="px-4 py-3 sm:px-5">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {BUYER_PAYMENTS.map((row) => (
                <tr key={row.id} className="border-t border-gray-100 hover:bg-emerald-50/40">
                  <td className="px-4 py-3 text-gray-500 sm:px-5">{row.date}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900 sm:px-5">{row.description}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900 sm:px-5">{row.amount}</td>
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
            </tbody>
          </table>
        </div>
      </BuyerCard>
    </div>
  );
}
