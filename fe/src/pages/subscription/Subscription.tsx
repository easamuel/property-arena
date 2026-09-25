import SubscriptionCard from '@/components/subcription/SubscriptionCard';
import { useEffect, useState } from 'react';
import {
  fetchSubscriptionPlans,
  formatKobo,
  type SubscriptionPlan,
} from '@/services/subscription';

function featureRows(plan: SubscriptionPlan): [string, string][] {
  const rows: [string, string][] = [];
  for (const f of plan.features || []) {
    const label = f.featureKey.replace(/_/g, ' ');
    const value =
      f.value === -1 ? 'Unlimited' : String(f.value);
    rows.push([label, value]);
  }
  if (plan.trialDays > 0) {
    rows.unshift(['Free trial', `${plan.trialDays} days`]);
  }
  return rows;
}

export default function Subscription() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchSubscriptionPlans();
        if (!cancelled) setPlans(res.data || []);
      } catch (e) {
        if (!cancelled) {
          setError((e as Error).message || 'Failed to load plans');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-surface-muted py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Packages & Pricing
          </h1>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            First month free on eligible plans. Unlock listings, leads, and featured placement.
          </p>
        </div>

        {loading && (
          <div className="text-center text-gray-500 py-16">Loading plans…</div>
        )}
        {error && (
          <div className="text-center text-red-600 py-8 bg-red-50 rounded-xl">{error}</div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <SubscriptionCard
                key={plan.id || plan.slug}
                name={plan.name}
                label={plan.userType}
                price={formatKobo(plan.monthlyPrice)}
                note={plan.description || `${plan.trialDays}-day trial`}
                features={featureRows(plan)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
