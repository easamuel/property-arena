import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBath, FaBed } from 'react-icons/fa';
import { FiMoreHorizontal } from 'react-icons/fi';
import { BUYER_MY_PROPERTIES } from '@/data/buyer-demo';
import { BuyerCard, BuyerStatus } from '@/components/buyer/BuyerUi';

const TABS = ['All', 'For Sale', 'For Rent'] as const;

export default function BuyerProperties() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('All');
  const rows = useMemo(
    () => (tab === 'All' ? BUYER_MY_PROPERTIES : BUYER_MY_PROPERTIES.filter((r) => r.tab === tab)),
    [tab],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">My Properties</h1>
          <p className="mt-1 text-sm text-gray-500">Listings you posted or manage as a buyer/owner.</p>
        </div>
        <Link
          to="/sell"
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
        >
          + Post Property
        </Link>
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

      <div className="space-y-3">
        {rows.map((row) => (
          <BuyerCard key={row.id} className="overflow-hidden">
            <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:p-4">
              <img src={row.thumb} alt="" className="h-36 w-full rounded-xl object-cover sm:h-24 sm:w-32" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold text-gray-900">{row.title}</p>
                  <BuyerStatus status={row.status} />
                </div>
                <p className="mt-0.5 text-sm text-gray-500">{row.location}</p>
                <p className="mt-1 font-semibold text-emerald-700">{row.price}</p>
                <div className="mt-1.5 flex gap-3 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <FaBed className="text-emerald-600" /> {row.beds}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FaBath className="text-emerald-600" /> {row.baths}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:flex-col sm:items-stretch lg:flex-row">
                <Link
                  to="/properties"
                  className="rounded-xl border border-gray-200 px-3 py-2 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  View
                </Link>
                <Link
                  to="/create-property"
                  className="rounded-xl border border-emerald-200 px-3 py-2 text-center text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  className="rounded-xl border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
                  aria-label="More"
                >
                  <FiMoreHorizontal />
                </button>
              </div>
            </div>
          </BuyerCard>
        ))}
        {!rows.length ? (
          <BuyerCard className="p-8 text-center text-sm text-gray-500">No properties in this tab.</BuyerCard>
        ) : null}
      </div>
    </div>
  );
}
