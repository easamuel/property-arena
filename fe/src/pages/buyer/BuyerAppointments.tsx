import { useMemo, useState } from 'react';
import { BUYER_APPOINTMENTS } from '@/data/buyer-demo';
import { BuyerCard, BuyerStatus } from '@/components/buyer/BuyerUi';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function BuyerAppointments() {
  const [tab, setTab] = useState<'Upcoming' | 'Past'>('Upcoming');
  const rows = useMemo(() => BUYER_APPOINTMENTS.filter((r) => r.status === tab), [tab]);
  const selected = 27;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Appointments</h1>
        <p className="mt-1 text-sm text-gray-500">Upcoming and past property viewings.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <BuyerCard className="h-fit p-4">
          <p className="text-sm font-bold text-gray-900">September 2026</p>
          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-gray-400">
            {DAYS.map((d, i) => (
              <span key={`${d}-${i}`}>{d}</span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const hot = day === 27 || day === 28;
              return (
                <span
                  key={day}
                  className={`flex h-8 items-center justify-center rounded-lg text-xs ${
                    day === selected
                      ? 'bg-emerald-600 font-bold text-white'
                      : hot
                        ? 'bg-emerald-50 font-semibold text-emerald-700'
                        : 'text-gray-600'
                  }`}
                >
                  {day}
                </span>
              );
            })}
          </div>
        </BuyerCard>

        <div className="space-y-3">
          <div className="flex gap-1 rounded-xl bg-white p-1 shadow-sm ring-1 ring-gray-100">
            {(['Upcoming', 'Past'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  tab === t ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {rows.map((row) => (
            <BuyerCard key={row.id} className="p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-gray-900">{row.property}</p>
                  <p className="mt-1 text-sm text-emerald-700">{row.when}</p>
                  <p className="mt-0.5 text-xs text-gray-500">with {row.agent}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <BuyerStatus status={row.status === 'Upcoming' ? 'Confirmed' : 'Closed'} />
                  <button
                    type="button"
                    className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    View
                  </button>
                  {tab === 'Upcoming' ? (
                    <button
                      type="button"
                      className="rounded-xl border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                    >
                      Reschedule
                    </button>
                  ) : null}
                </div>
              </div>
            </BuyerCard>
          ))}
        </div>
      </div>
    </div>
  );
}
