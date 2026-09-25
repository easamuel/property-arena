import { API } from './api';
import { API_ROUTES } from '@/constants';

export type PlanFeature = {
  featureKey: string;
  value: number | boolean | string;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  slug: string;
  userType: string;
  description?: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  trialDays: number;
  features?: PlanFeature[];
};

export function formatKobo(kobo: number, currency = 'NGN'): string {
  const naira = kobo / 100;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(naira);
}

export async function fetchSubscriptionPlans(userType?: string) {
  const url = userType
    ? `${API_ROUTES.GET_SUBSCRIPTION_PLANS}?userType=${encodeURIComponent(userType)}`
    : API_ROUTES.GET_SUBSCRIPTION_PLANS;
  return API(url, { method: 'GET' }) as Promise<{
    message: string;
    data: SubscriptionPlan[];
  }>;
}

export async function checkoutPlan(planId: string, billingCycle: 'monthly' | 'yearly') {
  return API(API_ROUTES.SUBSCRIPTION_CHECKOUT, {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ planId, billingCycle }),
  });
}
