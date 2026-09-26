import { WsPanel, WsSectionHeader } from '@/components/workspace/WsUi';

export default function WorkspaceSettings() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <WsPanel>
        <WsSectionHeader title="Preferences" />
        <div className="space-y-3 p-5">
          {[
            ['Email notifications', true],
            ['SMS alerts for new leads', true],
            ['Weekly performance digest', false],
            ['Show phone on public listings', true],
          ].map(([label, checked]) => (
            <label
              key={String(label)}
              className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm"
            >
              <span className="font-medium text-[#0b2f24]">{label}</span>
              <input type="checkbox" defaultChecked={Boolean(checked)} className="h-4 w-4 accent-emerald-600" />
            </label>
          ))}
        </div>
      </WsPanel>

      <WsPanel>
        <WsSectionHeader title="Workspace defaults" />
        <div className="space-y-3 p-5">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-gray-600">Default listing currency</span>
            <select className="w-full rounded-lg border border-gray-200 px-3 py-2.5">
              <option>NGN (₦)</option>
              <option>USD ($)</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-gray-600">Primary market</span>
            <select className="w-full rounded-lg border border-gray-200 px-3 py-2.5">
              <option>Lagos</option>
              <option>Abuja</option>
              <option>Port Harcourt</option>
            </select>
          </label>
          <button type="button" className="rounded-lg bg-[#0b2f24] px-4 py-2.5 text-sm font-bold text-white">
            Save settings
          </button>
        </div>
      </WsPanel>
    </div>
  );
}
