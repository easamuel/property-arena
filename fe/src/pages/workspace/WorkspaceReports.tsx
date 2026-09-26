import { WS_PERFORMANCE } from '@/data/workspace-demo';
import { WsPanel, WsSectionHeader } from '@/components/workspace/WsUi';

const TYPE_SPLIT = [
  { label: 'Apartment', value: 38, color: '#059669' },
  { label: 'Duplex', value: 24, color: '#0ea5e9' },
  { label: 'Land', value: 22, color: '#f59e0b' },
  { label: 'Short Let', value: 16, color: '#8b5cf6' },
];

export default function WorkspaceReports() {
  const max = Math.max(...WS_PERFORMANCE.map((p) => p.enquiries), 1);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Listings', value: '8' },
          { label: 'Enquiries', value: '47' },
          { label: 'Viewings', value: '19' },
          { label: 'Closed Deals', value: '3' },
        ].map((card) => (
          <WsPanel key={card.label} className="p-5">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="mt-1 text-3xl font-bold text-[#0b2f24]">{card.value}</p>
          </WsPanel>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <WsPanel className="lg:col-span-2">
          <WsSectionHeader title="Enquiries Trend" />
          <div className="flex h-52 items-end gap-2 px-5 pb-5 pt-2">
            {WS_PERFORMANCE.map((p) => (
              <div key={p.day} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-emerald-500/90"
                  style={{ height: `${(p.enquiries / max) * 100}%`, minHeight: 8 }}
                />
                <span className="text-[10px] text-gray-400">{p.day.replace('Sep ', '')}</span>
              </div>
            ))}
          </div>
        </WsPanel>

        <WsPanel>
          <WsSectionHeader title="Property Type" />
          <div className="flex flex-col items-center gap-5 p-5">
            <div
              className="h-36 w-36 rounded-full"
              style={{
                background: `conic-gradient(${TYPE_SPLIT.map((t, i) => {
                  const start = TYPE_SPLIT.slice(0, i).reduce((s, x) => s + x.value, 0);
                  return `${t.color} ${start}% ${start + t.value}%`;
                }).join(', ')})`,
              }}
              aria-hidden
            />
            <ul className="w-full space-y-2">
              {TYPE_SPLIT.map((t) => (
                <li key={t.label} className="flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-2 text-gray-600">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                    {t.label}
                  </span>
                  <span className="font-semibold text-[#0b2f24]">{t.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </WsPanel>
      </div>
    </div>
  );
}
