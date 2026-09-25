import { useEffect, useState } from 'react';
import { ADMIN_SERVICE } from '@/services/admin';
import {
  FiSettings,
  FiImage,
  FiMail,
  FiCreditCard,
  FiUsers,
  FiBell,
  FiSearch,
  FiShield,
  FiShare2,
  FiTool,
  FiDatabase,
  FiInfo,
} from 'react-icons/fi';

const sections = [
  { id: 'general', label: 'General Settings', desc: 'Site name, email and basic preferences.', icon: FiSettings },
  { id: 'identity', label: 'Site Identity', desc: 'Logo, favicon and branding.', icon: FiImage },
  { id: 'email', label: 'Email Settings', desc: 'SMTP and notification emails.', icon: FiMail },
  { id: 'payment', label: 'Payment Settings', desc: 'Paystack, Flutterwave gateways.', icon: FiCreditCard },
  { id: 'roles', label: 'User & Role Settings', desc: 'Roles, permissions and access.', icon: FiUsers },
  { id: 'notification', label: 'Notification Settings', desc: 'Push, email and SMS alerts.', icon: FiBell },
  { id: 'seo', label: 'SEO Settings', desc: 'Meta tags and search indexing.', icon: FiSearch },
  { id: 'security', label: 'Security Settings', desc: '2FA, password policies.', icon: FiShield },
  { id: 'social', label: 'Social Media Settings', desc: 'Social links and sharing.', icon: FiShare2 },
  { id: 'maintenance', label: 'Maintenance Mode', desc: 'Take the site offline for updates.', icon: FiTool },
  { id: 'backup', label: 'Backup & Restore', desc: 'Database and file backups.', icon: FiDatabase },
  { id: 'system', label: 'System Information', desc: 'Version, environment and health.', icon: FiInfo },
];

type FormState = {
  siteName: string;
  tagline: string;
  adminEmail: string;
  phone: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  language: string;
  description: string;
  currency: string;
  currencyPosition: string;
  thousandSeparator: string;
  decimalSeparator: string;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  showSuggestions: boolean;
  multiLanguage: boolean;
  darkMode: boolean;
  stickyHeader: boolean;
};

const initialForm: FormState = {
  siteName: 'PropertyARENA',
  tagline: '…your property, our priority',
  adminEmail: 'admin@propertyarena.com',
  phone: '+234 800 123 4567',
  timezone: 'West Africa Time (Lagos)',
  dateFormat: 'May 20, 2025',
  timeFormat: '12 Hours',
  language: 'English',
  description:
    "Nigeria's smartest property marketplace connecting buyers, sellers, agents and developers in one platform.",
  currency: 'NGN (Nigerian Naira)',
  currencyPosition: 'Before amount (₦100)',
  thousandSeparator: 'Comma (,)',
  decimalSeparator: 'Dot (.)',
  allowRegistration: true,
  requireEmailVerification: true,
  showSuggestions: true,
  multiLanguage: false,
  darkMode: false,
  stickyHeader: true,
};

const AdminSettings = () => {
  const [active, setActive] = useState('general');
  const [form, setForm] = useState<FormState>(initialForm);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    ADMIN_SERVICE.getSettings()
      .then((res) => {
        const saved = (res as { data?: Partial<FormState> | null }).data;
        if (saved) setForm((prev) => ({ ...prev, ...saved }));
      })
      .catch(() => setNotice('Sign in as admin to load saved settings.'));
  }, []);

  const save = async () => {
    setNotice('');
    try {
      await ADMIN_SERVICE.saveSettings(form);
      setNotice('Settings saved.');
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Could not save settings');
    }
  };

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      <div className="space-y-2 lg:col-span-1">
        {sections.map((s) => {
          const Icon = s.icon;
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(s.id)}
              className={`w-full rounded-xl border p-4 text-left transition-colors ${
                isActive ? 'border-admin-red bg-red-50' : 'border-gray-100 bg-white hover:bg-gray-50'
              }`}
            >
              <p className={`flex items-center gap-2 font-semibold ${isActive ? 'text-admin-red' : 'text-gray-900'}`}>
                <Icon className="h-4 w-4 shrink-0" />
                {s.label}
              </p>
              <p className="mt-1 text-xs text-gray-500">{s.desc}</p>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-3">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
            <p className="text-sm text-gray-500">Update your website general settings and preferences.</p>
          </div>
          <button type="button" onClick={save} className="rounded-lg bg-admin-red px-4 py-2 text-sm font-semibold text-white hover:bg-red-800">
            Save Changes
          </button>
        </div>
        {notice && <p className="mb-4 text-sm text-gray-600">{notice}</p>}

        {active === 'general' ? (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-gray-700">Site Name</span>
                <input
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-admin-red focus:outline-none focus:ring-1 focus:ring-admin-red"
                  value={form.siteName}
                  onChange={(e) => setField('siteName', e.target.value)}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-gray-700">Tagline</span>
                <input
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-admin-red focus:outline-none focus:ring-1 focus:ring-admin-red"
                  value={form.tagline}
                  onChange={(e) => setField('tagline', e.target.value)}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-gray-700">Admin Email</span>
                <input
                  type="email"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-admin-red focus:outline-none focus:ring-1 focus:ring-admin-red"
                  value={form.adminEmail}
                  onChange={(e) => setField('adminEmail', e.target.value)}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-gray-700">Phone Number</span>
                <input
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-admin-red focus:outline-none focus:ring-1 focus:ring-admin-red"
                  value={form.phone}
                  onChange={(e) => setField('phone', e.target.value)}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-gray-700">Timezone</span>
                <select
                  className="w-full rounded-lg border border-gray-200 px-3 py-2"
                  value={form.timezone}
                  onChange={(e) => setField('timezone', e.target.value)}
                >
                  <option>West Africa Time (Lagos)</option>
                  <option>UTC</option>
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-gray-700">Date Format</span>
                <select
                  className="w-full rounded-lg border border-gray-200 px-3 py-2"
                  value={form.dateFormat}
                  onChange={(e) => setField('dateFormat', e.target.value)}
                >
                  <option>May 20, 2025</option>
                  <option>20/05/2025</option>
                  <option>2025-05-20</option>
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-gray-700">Time Format</span>
                <select
                  className="w-full rounded-lg border border-gray-200 px-3 py-2"
                  value={form.timeFormat}
                  onChange={(e) => setField('timeFormat', e.target.value)}
                >
                  <option>12 Hours</option>
                  <option>24 Hours</option>
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-gray-700">Default Language</span>
                <select
                  className="w-full rounded-lg border border-gray-200 px-3 py-2"
                  value={form.language}
                  onChange={(e) => setField('language', e.target.value)}
                >
                  <option>English</option>
                  <option>Yoruba</option>
                  <option>Hausa</option>
                  <option>Igbo</option>
                </select>
              </label>
              <label className="block text-sm md:col-span-2">
                <span className="mb-1 block font-medium text-gray-700">Site Description</span>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-admin-red focus:outline-none focus:ring-1 focus:ring-admin-red"
                  value={form.description}
                  onChange={(e) => setField('description', e.target.value)}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-gray-700">Currency</span>
                <select
                  className="w-full rounded-lg border border-gray-200 px-3 py-2"
                  value={form.currency}
                  onChange={(e) => setField('currency', e.target.value)}
                >
                  <option>NGN (Nigerian Naira)</option>
                  <option>USD (US Dollar)</option>
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-gray-700">Currency Position</span>
                <select
                  className="w-full rounded-lg border border-gray-200 px-3 py-2"
                  value={form.currencyPosition}
                  onChange={(e) => setField('currencyPosition', e.target.value)}
                >
                  <option>Before amount (₦100)</option>
                  <option>After amount (100₦)</option>
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-gray-700">Thousand Separator</span>
                <select
                  className="w-full rounded-lg border border-gray-200 px-3 py-2"
                  value={form.thousandSeparator}
                  onChange={(e) => setField('thousandSeparator', e.target.value)}
                >
                  <option>Comma (,)</option>
                  <option>Dot (.)</option>
                  <option>Space ( )</option>
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-gray-700">Decimal Separator</span>
                <select
                  className="w-full rounded-lg border border-gray-200 px-3 py-2"
                  value={form.decimalSeparator}
                  onChange={(e) => setField('decimalSeparator', e.target.value)}
                >
                  <option>Dot (.)</option>
                  <option>Comma (,)</option>
                </select>
              </label>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(
                [
                  ['allowRegistration', 'Allow user registration'],
                  ['requireEmailVerification', 'Require email verification'],
                  ['showSuggestions', 'Show property suggestions'],
                  ['multiLanguage', 'Enable multi-language'],
                  ['darkMode', 'Enable dark mode'],
                  ['stickyHeader', 'Enable sticky header'],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(e) => setField(key, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-admin-red focus:ring-admin-red"
                  />
                  {label}
                </label>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
            <p className="font-medium text-gray-900">{sections.find((s) => s.id === active)?.label}</p>
            <p className="mt-2 text-sm text-gray-500">
              Configuration for this section will appear here. General settings are fully interactive with local state.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
