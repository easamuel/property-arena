import { FormEvent, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { WsPanel } from '@/components/workspace/WsUi';

const TABS = ['Personal Info', 'Security', 'Change Password'] as const;

export default function WorkspaceProfile() {
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState<(typeof TABS)[number]>('Personal Info');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [address, setAddress] = useState('');
  const [saved, setSaved] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[14rem_1fr]">
      <WsPanel className="h-fit overflow-hidden p-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold ${
              tab === t ? 'bg-emerald-50 text-emerald-800' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t}
          </button>
        ))}
      </WsPanel>

      <WsPanel className="p-5 sm:p-6">
        {tab === 'Personal Info' && (
          <form onSubmit={onSubmit} className="grid gap-5 md:grid-cols-[8rem_1fr]">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#0b2f24] text-2xl font-bold text-white">
                {(name || 'U').slice(0, 1).toUpperCase()}
              </div>
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
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-gray-600">Email</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-gray-600">Phone</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234…"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5"
                />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1 block font-medium text-gray-600">Bio</span>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5"
                />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1 block font-medium text-gray-600">Address</span>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5"
                />
              </label>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="rounded-lg bg-[#0b2f24] px-4 py-2.5 text-sm font-bold text-white"
                >
                  Save changes
                </button>
                {saved ? <span className="ml-3 text-sm text-emerald-600">Saved</span> : null}
              </div>
            </div>
          </form>
        )}

        {tab === 'Security' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Protect your workspace account.</p>
            <label className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm">
              <span className="font-medium text-[#0b2f24]">Two-factor authentication</span>
              <input type="checkbox" className="h-4 w-4 accent-emerald-600" />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm">
              <span className="font-medium text-[#0b2f24]">Login alerts</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-emerald-600" />
            </label>
          </div>
        )}

        {tab === 'Change Password' && (
          <form className="mx-auto max-w-md space-y-3" onSubmit={(e) => e.preventDefault()}>
            <input type="password" placeholder="Current password" className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm" />
            <input type="password" placeholder="New password" className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm" />
            <input type="password" placeholder="Confirm new password" className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm" />
            <button type="submit" className="rounded-lg bg-[#0b2f24] px-4 py-2.5 text-sm font-bold text-white">
              Update password
            </button>
          </form>
        )}
      </WsPanel>
    </div>
  );
}
