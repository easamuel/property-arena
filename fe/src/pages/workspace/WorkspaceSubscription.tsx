import { Link } from 'react-router-dom';
import { WsPanel, WsSectionHeader, WsStatus } from '@/components/workspace/WsUi';
import { WS_BILLING, formatNaira } from '@/data/workspace-demo';

export default function WorkspaceSubscription() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <WsPanel>
        <WsSectionHeader title="Active Plan" />
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-2xl font-bold text-[#0b2f24]">Professional</p>
              <p className="mt-1 text-sm text-gray-500">25 listings · Featured slots · Lead access</p>
            </div>
            <WsStatus status="Active" />
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Next renewal <span className="font-semibold text-[#0b2f24]">1 Oct 2026</span> ·{' '}
            {formatNaira(25000)}/month
          </p>
          <Link
            to="/workspace/packages"
            className="mt-5 inline-flex rounded-lg bg-[#0b2f24] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0f4a38]"
          >
            Change Plan
          </Link>
        </div>
      </WsPanel>

      <WsPanel>
        <WsSectionHeader title="Billing Info" />
        <div className="space-y-4 p-5">
          <div className="rounded-xl border border-emerald-900/5 bg-[#f8faf8] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Card on file</p>
            <p className="mt-1 font-semibold text-[#0b2f24]">•••• •••• •••• 4242</p>
            <p className="text-xs text-gray-500">Expires 09/28</p>
          </div>
          <div>
            <p className="text-sm font-bold text-[#0b2f24]">Recent charges</p>
            <ul className="mt-2 space-y-2">
              {WS_BILLING.slice(0, 2).map((row) => (
                <li key={row.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{row.description}</span>
                  <span className="font-semibold text-[#0b2f24]">{formatNaira(row.amount)}</span>
                </li>
              ))}
            </ul>
            <Link to="/workspace/billing" className="mt-3 inline-block text-xs font-bold text-emerald-700 hover:underline">
              View billing history
            </Link>
          </div>
        </div>
      </WsPanel>
    </div>
  );
}
