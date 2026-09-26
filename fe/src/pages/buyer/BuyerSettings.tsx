import { FormEvent, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { BuyerCard } from '@/components/buyer/BuyerUi';

const TABS = ['Profile', 'Preferences', 'Notifications'] as const;

export default function BuyerSettings() {
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState<(typeof TABS)[number]>('Profile');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [saved, setSaved] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Account Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Update your profile and notification preferences.</p>
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

      <BuyerCard className="p-4 sm:p-6">
        {tab === 'Profile' ? (
          <form onSubmit={onSubmit} className="grid gap-5 md:grid-cols-[7rem_1fr]">
            <div className="flex flex-col items-center gap-2">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 text-2xl font-bold text-white">
                {(name || 'U').slice(0, 1).toUpperCase()}
              </span>
              <button type="button" className="text-xs font-semibold text-emerald-700 hover:underline">
                Change photo
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1 block font-medium text-gray-600">Full Name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-gray-600">Email</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-gray-600">Phone</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234…"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
                />
              </label>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
                >
                  Save changes
                </button>
                {saved ? <span className="ml-3 text-sm text-emerald-600">Saved</span> : null}
              </div>
            </div>
          </form>
        ) : null}

        {tab === 'Preferences' ? (
          <div className="space-y-3">
            {[
              ['Show price in Naira (₦)', true],
              ['Prefer short-let suggestions', false],
              ['Include land in recommendations', true],
            ].map(([label, checked]) => (
              <label
                key={String(label)}
                className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm"
              >
                <span className="font-medium text-gray-800">{label}</span>
                <input type="checkbox" defaultChecked={Boolean(checked)} className="h-4 w-4 accent-emerald-600" />
              </label>
            ))}
          </div>
        ) : null}

        {tab === 'Notifications' ? (
          <div className="space-y-3">
            {[
              ['Email alerts for new matches', true],
              ['SMS for appointment reminders', true],
              ['Marketing tips from PropertyArena', false],
            ].map(([label, checked]) => (
              <label
                key={String(label)}
                className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm"
              >
                <span className="font-medium text-gray-800">{label}</span>
                <input type="checkbox" defaultChecked={Boolean(checked)} className="h-4 w-4 accent-emerald-600" />
              </label>
            ))}
          </div>
        ) : null}
      </BuyerCard>
    </div>
  );
}
