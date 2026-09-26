import { useState } from 'react';
import { FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { WS_PACKAGES, formatNaira } from '@/data/workspace-demo';
import { WsPanel } from '@/components/workspace/WsUi';

export default function WorkspacePackages() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm text-gray-500">
          Unlock more listings, featured placement, and lead access.
        </p>
        <div className="inline-flex rounded-full border border-gray-200 bg-white p-1 text-sm">
          <button
            type="button"
            onClick={() => setAnnual(false)}
            className={`rounded-full px-4 py-1.5 font-semibold ${!annual ? 'bg-[#0b2f24] text-white' : 'text-gray-600'}`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            className={`rounded-full px-4 py-1.5 font-semibold ${annual ? 'bg-[#0b2f24] text-white' : 'text-gray-600'}`}
          >
            Annual
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {WS_PACKAGES.map((plan) => (
          <WsPanel
            key={plan.id}
            className={`relative flex flex-col p-6 ${plan.popular ? 'ring-2 ring-emerald-500' : ''}`}
          >
            {plan.popular ? (
              <span className="absolute -top-2.5 right-4 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Popular
              </span>
            ) : null}
            <h3 className="text-lg font-bold text-[#0b2f24]">{plan.name}</h3>
            <p className="mt-3">
              <span className="text-3xl font-bold text-[#0b2f24]">
                {formatNaira(annual ? plan.yearly : plan.monthly)}
              </span>
              <span className="text-sm text-gray-500">/{annual ? 'year' : 'month'}</span>
            </p>
            <ul className="mt-5 flex-1 space-y-2.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                  <FiCheck className="mt-0.5 shrink-0 text-emerald-600" /> {f}
                </li>
              ))}
            </ul>
            <Link
              to="/workspace/subscription"
              className={`mt-6 block rounded-lg py-2.5 text-center text-sm font-bold ${
                plan.popular
                  ? 'bg-[#0b2f24] text-white hover:bg-[#0f4a38]'
                  : 'border border-emerald-900/15 text-[#0b2f24] hover:bg-emerald-50'
              }`}
            >
              Choose Plan
            </Link>
          </WsPanel>
        ))}
      </div>
    </div>
  );
}
