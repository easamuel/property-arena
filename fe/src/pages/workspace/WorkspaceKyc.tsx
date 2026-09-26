import { FormEvent, useMemo, useState } from 'react';
import { FiCheck, FiShield, FiUpload } from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import { normalizeWorkspaceRole } from '@/lib/workspace';
import { WsPanel } from '@/components/workspace/WsUi';

const ID_TYPES = ['NIN', "Driver's Licence", 'International Passport', "Voter's Card"] as const;

type FormState = {
  fullName: string;
  phone: string;
  idType: (typeof ID_TYPES)[number];
  idNumber: string;
  businessName: string;
  cacNumber: string;
  address: string;
  state: string;
  idFileName: string;
  proofFileName: string;
};

const STORAGE_KEY = 'pa-workspace-kyc';

function loadDraft(userId?: string): Partial<FormState> & { submittedAt?: string } {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}:${userId || 'anon'}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export default function WorkspaceKyc() {
  const user = useAuthStore((s) => s.user);
  const role = normalizeWorkspaceRole(user?.role);
  const draft = useMemo(() => loadDraft(user?.id), [user?.id]);
  const [step, setStep] = useState(1);
  const [submittedAt, setSubmittedAt] = useState(draft.submittedAt || '');
  const [form, setForm] = useState<FormState>({
    fullName: draft.fullName || user?.name || '',
    phone: draft.phone || '',
    idType: (draft.idType as FormState['idType']) || 'NIN',
    idNumber: draft.idNumber || '',
    businessName: draft.businessName || '',
    cacNumber: draft.cacNumber || '',
    address: draft.address || '',
    state: draft.state || 'Lagos',
    idFileName: draft.idFileName || '',
    proofFileName: draft.proofFileName || '',
  });

  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
  const needsBusiness = role === 'agency' || role === 'developer' || role === 'agent';

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const persist = (extra?: { submittedAt?: string }) => {
    try {
      localStorage.setItem(
        `${STORAGE_KEY}:${user?.id || 'anon'}`,
        JSON.stringify({ ...form, ...extra }),
      );
    } catch {
      /* ignore */
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const at = new Date().toISOString();
    persist({ submittedAt: at });
    setSubmittedAt(at);
    setStep(4);
  };

  if (submittedAt && step === 4) {
    return (
      <WsPanel className="mx-auto max-w-xl p-6 text-center sm:p-8">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
          <FiCheck />
        </span>
        <h1 className="mt-4 text-xl font-bold text-[#0b2f24]">Verification submitted</h1>
        <p className="mt-2 text-sm text-gray-600">
          Thanks {form.fullName.split(' ')[0] || 'there'}. Our team will review your {roleLabel.toLowerCase()}{' '}
          KYC within 24–48 hours. You can keep listing while we verify.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmittedAt('');
            setStep(1);
            try {
              localStorage.removeItem(`${STORAGE_KEY}:${user?.id || 'anon'}`);
            } catch {
              /* ignore */
            }
          }}
          className="mt-6 text-sm font-semibold text-emerald-700 hover:underline"
        >
          Edit and resubmit
        </button>
      </WsPanel>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Get verified</p>
        <h1 className="mt-1 text-xl font-bold text-[#0b2f24] sm:text-2xl">
          {roleLabel} KYC — quick & simple
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Inspired by leading Nigerian portals: prove who you are, optionally add business details, upload
          one ID photo. Takes under 3 minutes.
        </p>
      </div>

      <div className="flex gap-2">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={`h-1.5 flex-1 rounded-full ${step >= n ? 'bg-emerald-600' : 'bg-gray-200'}`}
          />
        ))}
      </div>

      <WsPanel className="p-4 sm:p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <div className="flex items-start gap-3 rounded-xl bg-emerald-50 px-3 py-3 text-sm text-emerald-900">
                <FiShield className="mt-0.5 shrink-0" />
                <p>We only use this to verify your {roleLabel.toLowerCase()} account and build trust with buyers.</p>
              </div>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-gray-600">Full legal name</span>
                <input
                  required
                  value={form.fullName}
                  onChange={(e) => setField('fullName', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-gray-600">Phone (WhatsApp preferred)</span>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setField('phone', e.target.value)}
                  placeholder="+234…"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-gray-600">ID type</span>
                  <select
                    value={form.idType}
                    onChange={(e) => setField('idType', e.target.value as FormState['idType'])}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
                  >
                    {ID_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-gray-600">ID number</span>
                  <input
                    required
                    value={form.idNumber}
                    onChange={(e) => setField('idNumber', e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={() => {
                  persist();
                  setStep(2);
                }}
                className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
              >
                Continue
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-sm text-gray-600">
                {needsBusiness
                  ? 'Add your company or trade name (CAC optional for now).'
                  : 'Confirm where you operate from. Business docs are optional for landlords.'}
              </p>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-gray-600">
                  {needsBusiness ? 'Agency / company name' : 'Display / trade name (optional)'}
                </span>
                <input
                  required={needsBusiness}
                  value={form.businessName}
                  onChange={(e) => setField('businessName', e.target.value)}
                  placeholder={needsBusiness ? 'e.g. Arena Nest Realty' : 'Optional'}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-gray-600">CAC / BN number (optional)</span>
                <input
                  value={form.cacNumber}
                  onChange={(e) => setField('cacNumber', e.target.value)}
                  placeholder="RC / BN…"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-gray-600">Office / contact address</span>
                <input
                  required
                  value={form.address}
                  onChange={(e) => setField('address', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-gray-600">State</span>
                <input
                  required
                  value={form.state}
                  onChange={(e) => setField('state', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
                />
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    persist();
                    setStep(3);
                  }}
                  className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-sm text-gray-600">
                Upload a clear photo of your ID. A utility bill or CAC certificate is optional but speeds up
                approval.
              </p>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 px-4 py-8 text-center">
                <FiUpload className="text-2xl text-emerald-700" />
                <span className="mt-2 text-sm font-semibold text-[#0b2f24]">Government ID photo</span>
                <span className="mt-1 text-xs text-gray-500">
                  {form.idFileName || 'PNG, JPG or PDF · max 5MB'}
                </span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="sr-only"
                  onChange={(e) => setField('idFileName', e.target.files?.[0]?.name || '')}
                />
              </label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center">
                <FiUpload className="text-xl text-gray-500" />
                <span className="mt-2 text-sm font-semibold text-gray-800">
                  Utility bill or CAC (optional)
                </span>
                <span className="mt-1 text-xs text-gray-500">
                  {form.proofFileName || 'Helps match your address / company'}
                </span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="sr-only"
                  onChange={(e) => setField('proofFileName', e.target.files?.[0]?.name || '')}
                />
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!form.idFileName}
                  className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Submit for review
                </button>
              </div>
            </>
          )}
        </form>
      </WsPanel>
    </div>
  );
}
