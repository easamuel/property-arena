import { BuyerCard } from '@/components/buyer/BuyerUi';

export default function BuyerSecurity() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Security</h1>
        <p className="mt-1 text-sm text-gray-500">Protect your PropertyArena account.</p>
      </div>

      <BuyerCard className="space-y-3 p-4 sm:p-6">
        <label className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm">
          <span className="font-medium text-gray-800">Two-factor authentication</span>
          <input type="checkbox" className="h-4 w-4 accent-emerald-600" />
        </label>
        <label className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm">
          <span className="font-medium text-gray-800">Login alerts by email</span>
          <input type="checkbox" defaultChecked className="h-4 w-4 accent-emerald-600" />
        </label>
      </BuyerCard>

      <BuyerCard className="p-4 sm:p-6">
        <h2 className="text-sm font-bold text-gray-900">Change password</h2>
        <form className="mt-4 max-w-md space-y-3" onSubmit={(e) => e.preventDefault()}>
          <input
            type="password"
            placeholder="Current password"
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
          />
          <input
            type="password"
            placeholder="New password"
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
          />
          <button
            type="submit"
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
          >
            Update password
          </button>
        </form>
      </BuyerCard>
    </div>
  );
}
