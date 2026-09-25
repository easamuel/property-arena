import { API } from './api';
import { getApiBaseUrl } from './api';

const base = getApiBaseUrl();

export type AdminUser = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive?: boolean;
  createdAt?: string;
  lastLoggedIn?: string;
};

export type AdminProperty = {
  id?: string;
  _id?: string;
  title: string;
  propertyId?: string;
  propertyType?: string;
  location?: string;
  address?: string;
  price?: number;
  currency?: string;
  status?: string;
  reviewNotes?: string;
  createdAt?: string;
};

export type AdminPlan = {
  id?: string;
  _id?: string;
  name: string;
  slug: string;
  userType: string;
  description?: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency?: string;
  trialDays?: number;
  isActive?: boolean;
  badgeLabel?: string;
  badgeColor?: string;
  badgeIcon?: string;
  features?: { featureKey: string; value: number | boolean | string }[];
};

const idOf = (row: { id?: string; _id?: string }) => row.id || row._id || '';

export const ADMIN_SERVICE = {
  idOf,
  listUsers: (page = 1) =>
    API(`${base}/users?page=${page}&limit=20`, { method: 'GET', auth: true }),
  setUserActive: (id: string, isActive: boolean) =>
    API(`${base}/users/${id}/active`, {
      method: 'PATCH',
      auth: true,
      body: JSON.stringify({ isActive }),
    }),
  setUserRole: (id: string, role: string) =>
    API(`${base}/users/${id}/role`, {
      method: 'PATCH',
      auth: true,
      body: JSON.stringify({ role }),
    }),
  listProperties: (page = 1) =>
    API(`${base}/properties?page=${page}&limit=20`, { method: 'GET' }),
  moderateProperty: (id: string, body: { status?: string; reviewNotes?: string }) =>
    API(`${base}/properties/${id}/moderate`, {
      method: 'PATCH',
      auth: true,
      body: JSON.stringify(body),
    }),
  listPlans: () => API(`${base}/subscription/plans/all`, { method: 'GET', auth: true }),
  createPlan: (body: Record<string, unknown>) =>
    API(`${base}/subscription/plans`, {
      method: 'POST',
      auth: true,
      body: JSON.stringify(body),
    }),
  updatePlan: (id: string, body: Record<string, unknown>) =>
    API(`${base}/subscription/plans/${id}`, {
      method: 'PATCH',
      auth: true,
      body: JSON.stringify(body),
    }),
  listSubscribers: (page = 1) =>
    API(`${base}/subscription/admin/subscribers?page=${page}&limit=20`, {
      method: 'GET',
      auth: true,
    }),
  listTransactions: (page = 1) =>
    API(`${base}/subscription/admin/transactions?page=${page}&limit=20`, {
      method: 'GET',
      auth: true,
    }),
  setSubscriptionStatus: (id: string, status: string) =>
    API(`${base}/subscription/admin/${id}/status`, {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ status }),
    }),
  listRecords: (kind: string) =>
    API(`${base}/platform/${kind}`, { method: 'GET', auth: true }),
  createRecord: (kind: string, data: Record<string, unknown>) =>
    API(`${base}/platform/${kind}`, { method: 'POST', auth: true, body: JSON.stringify(data) }),
  updateRecord: (kind: string, id: string, data: Record<string, unknown>) =>
    API(`${base}/platform/${kind}/${id}`, { method: 'PATCH', auth: true, body: JSON.stringify(data) }),
  deleteRecord: (kind: string, id: string) =>
    API(`${base}/platform/${kind}/${id}`, { method: 'DELETE', auth: true }),
  getSettings: () => API(`${base}/platform/settings/site`, { method: 'GET', auth: true }),
  saveSettings: (data: Record<string, unknown>) =>
    API(`${base}/platform/settings/site`, { method: 'PATCH', auth: true, body: JSON.stringify(data) }),
  reports: () => API(`${base}/platform/reports/summary`, { method: 'GET', auth: true }),
  submitPublic: (kind: 'lead' | 'booking', data: Record<string, unknown>) =>
    API(`${base}/platform/public/${kind}`, { method: 'POST', body: JSON.stringify(data) }),
  listPublicContent: (kind: string, limit?: number) =>
    API(
      `${base}/platform/content/${kind}${limit ? `?limit=${limit}` : ''}`,
      { method: 'GET' },
    ),
  getPublicBySlug: (kind: string, slug: string) =>
    API(`${base}/platform/content/${kind}/${encodeURIComponent(slug)}`, { method: 'GET' }),
  getSubscriptionBadge: (userId: string) =>
    API(`${base}/subscription/badge/${userId}`, { method: 'GET' }),
};
