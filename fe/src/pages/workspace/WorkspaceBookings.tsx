import { WS_BOOKINGS } from '@/data/workspace-demo';
import { WsPanel, WsSectionHeader, WsStatus } from '@/components/workspace/WsUi';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function WorkspaceBookings() {
  const today = 26;
  const cells = Array.from({ length: 30 }, (_, i) => i + 1);
  const scheduled = new Set([27, 28, 30]);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_18rem]">
      <WsPanel>
        <WsSectionHeader title="Upcoming Inspections" />
        <ul className="divide-y divide-emerald-900/5">
          {WS_BOOKINGS.map((row) => (
            <li key={row.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div>
                <p className="font-semibold text-[#0b2f24]">{row.property}</p>
                <p className="text-xs text-gray-500">
                  {row.location} · with {row.client}
                </p>
                <p className="mt-1 text-sm font-medium text-emerald-700">{row.when}</p>
              </div>
              <WsStatus status={row.status} />
            </li>
          ))}
        </ul>
      </WsPanel>

      <WsPanel className="h-fit p-4">
        <p className="text-sm font-bold text-[#0b2f24]">September 2026</p>
        <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-gray-400">
          {DAYS.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((day) => {
            const isToday = day === today;
            const hasEvent = scheduled.has(day);
            return (
              <span
                key={day}
                className={`flex h-8 items-center justify-center rounded-lg text-xs ${
                  isToday
                    ? 'bg-[#0b2f24] font-bold text-white'
                    : hasEvent
                      ? 'bg-emerald-100 font-semibold text-emerald-800'
                      : 'text-gray-600'
                }`}
              >
                {day}
              </span>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-gray-500">Green days have scheduled inspections.</p>
      </WsPanel>
    </div>
  );
}
