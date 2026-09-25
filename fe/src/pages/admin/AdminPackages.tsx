import { FormEvent, useEffect, useState } from 'react';
import StatCard from '@/components/admin/StatCard';
import StatusBadge from '@/components/admin/StatusBadge';
import { formatKobo } from '@/services/subscription';
import { ADMIN_SERVICE, AdminPlan } from '@/services/admin';
import { FiPackage } from 'react-icons/fi';
import { SubscriberBadge } from '@/components/brand/SubscriberBadge';

const emptyForm = {
  name: '',
  slug: '',
  userType: 'agent',
  description: '',
  monthlyPrice: '',
  yearlyPrice: '',
  trialDays: '30',
  maxListings: '5',
  badgeLabel: '',
  badgeColor: 'green',
};

const AdminPackages = () => {
  const [plans, setPlans] = useState<AdminPlan[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const load = () => {
    ADMIN_SERVICE.listPlans()
      .then((res) => setPlans((res as { data?: AdminPlan[] }).data || []))
      .catch((err: Error) => setError(err.message || 'Could not load plans'));
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await ADMIN_SERVICE.createPlan({
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
        userType: form.userType,
        description: form.description,
        monthlyPrice: Math.round(Number(form.monthlyPrice) * 100),
        yearlyPrice: Math.round(Number(form.yearlyPrice) * 100),
        trialDays: Number(form.trialDays) || 0,
        isActive: true,
        currency: 'NGN',
        badgeLabel: form.badgeLabel || undefined,
        badgeColor: form.badgeColor || 'green',
        features: [{ featureKey: 'max_listings', value: Number(form.maxListings) || 0 }],
      });
      setForm(emptyForm);
      setOpen(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create plan');
    }
  };

  const toggle = async (plan: AdminPlan) => {
    const id = ADMIN_SERVICE.idOf(plan);
    try {
      await ADMIN_SERVICE.updatePlan(id, { isActive: plan.isActive === false });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update plan');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <StatCard label="Plans" value={plans.length} icon={<FiPackage />} />
        <button type="button" className="rounded-lg bg-admin-red px-4 py-2 text-sm font-semibold text-white" onClick={() => setOpen((v) => !v)}>
          + Add New Package
        </button>
      </div>
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {open && (
        <form onSubmit={onSubmit} className="grid gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-3">
          <input required placeholder="Plan name" className="rounded border px-3 py-2 text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Slug" className="rounded border px-3 py-2 text-sm" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <select className="rounded border px-3 py-2 text-sm" value={form.userType} onChange={(e) => setForm({ ...form, userType: e.target.value })}>
            <option value="agent">Agent</option>
            <option value="developer">Developer</option>
            <option value="landlord">Landlord</option>
          </select>
          <input required type="number" placeholder="Monthly price (₦)" className="rounded border px-3 py-2 text-sm" value={form.monthlyPrice} onChange={(e) => setForm({ ...form, monthlyPrice: e.target.value })} />
          <input required type="number" placeholder="Yearly price (₦)" className="rounded border px-3 py-2 text-sm" value={form.yearlyPrice} onChange={(e) => setForm({ ...form, yearlyPrice: e.target.value })} />
          <input type="number" placeholder="Trial days" className="rounded border px-3 py-2 text-sm" value={form.trialDays} onChange={(e) => setForm({ ...form, trialDays: e.target.value })} />
          <input type="number" placeholder="Listing limit" className="rounded border px-3 py-2 text-sm" value={form.maxListings} onChange={(e) => setForm({ ...form, maxListings: e.target.value })} />
          <input placeholder="Badge label (e.g. Premium Pro)" className="rounded border px-3 py-2 text-sm" value={form.badgeLabel} onChange={(e) => setForm({ ...form, badgeLabel: e.target.value })} />
          <select className="rounded border px-3 py-2 text-sm" value={form.badgeColor} onChange={(e) => setForm({ ...form, badgeColor: e.target.value })}>
            <option value="green">Badge: Green</option>
            <option value="gold">Badge: Gold</option>
            <option value="blue">Badge: Blue</option>
            <option value="red">Badge: Red</option>
          </select>
          <input placeholder="Description" className="rounded border px-3 py-2 text-sm md:col-span-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button type="submit" className="rounded bg-admin-red px-4 py-2 text-sm font-semibold text-white">Save plan</button>
        </form>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => (
          <div key={ADMIN_SERVICE.idOf(plan)} className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <StatusBadge status={plan.isActive === false ? 'Inactive' : 'Active'} />
            </div>
            <p className="mt-1 text-xs uppercase text-gray-500">{plan.userType}</p>
            {plan.badgeLabel ? (
              <div className="mt-2">
                <SubscriberBadge label={plan.badgeLabel} color={plan.badgeColor} />
              </div>
            ) : null}
            <p className="mt-3 text-2xl font-bold text-admin-red">{formatKobo(plan.monthlyPrice || 0)}<span className="text-sm font-medium text-gray-500">/mo</span></p>
            <p className="text-sm text-gray-500">{formatKobo(plan.yearlyPrice || 0)} / year · {plan.trialDays || 0} trial days</p>
            <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
            <button type="button" className="mt-4 text-sm font-semibold text-admin-red" onClick={() => toggle(plan)}>
              {plan.isActive === false ? 'Activate' : 'Deactivate'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPackages;
