import { Link } from 'react-router-dom';
import { BUYER_ALERTS } from '@/data/buyer-demo';
import { BuyerCard } from '@/components/buyer/BuyerUi';

export default function BuyerAlerts() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Searches & Alerts</h1>
          <p className="mt-1 text-sm text-gray-500">Get notified when new homes match your criteria.</p>
        </div>
        <Link
          to="/properties"
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
        >
          + New Search Alert
        </Link>
      </div>

      <div className="space-y-3">
        {BUYER_ALERTS.map((alert) => (
          <BuyerCard key={alert.id} className="p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-gray-900">{alert.name}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {alert.matches} new matches · {alert.frequency} alerts
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    alert.active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {alert.active ? 'Active' : 'Paused'}
                </span>
                <button
                  type="button"
                  className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </button>
              </div>
            </div>
          </BuyerCard>
        ))}
      </div>
    </div>
  );
}
