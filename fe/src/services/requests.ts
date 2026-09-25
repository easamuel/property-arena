import { API, getApiBaseUrl } from './api';

const base = `${getApiBaseUrl()}/requests`;

export type RequestPurpose = 'sale' | 'rent' | 'shortlet' | 'lease';
export type RequestStatus = 'open' | 'matched' | 'closed';
export type RequestVisibility = 'public' | 'agents_only';

export type PropertyRequest = {
  id?: string;
  _id?: string;
  purpose: RequestPurpose;
  propertyType: string;
  locations: string[];
  budgetMin?: number;
  budgetMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  features: string[];
  notes?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: RequestStatus;
  visibility: RequestVisibility;
  responseCount: number;
  createdAt?: string;
};

export type CreatePropertyRequestPayload = {
  purpose: RequestPurpose;
  propertyType: string;
  locations: string[];
  budgetMin?: number;
  budgetMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  features?: string[];
  notes?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  visibility?: RequestVisibility;
};

export type ListRequestsParams = {
  page?: number;
  limit?: number;
  purpose?: RequestPurpose;
  propertyType?: string;
  location?: string;
  budgetMin?: number;
  budgetMax?: number;
};

type ApiListResponse = {
  message: string;
  data: {
    items: PropertyRequest[];
    total: number;
    page: number;
    limit: number;
  };
};

type ApiItemResponse = {
  message: string;
  data: PropertyRequest;
};

type ApiArrayResponse = {
  message: string;
  data: PropertyRequest[];
};

export const REQUESTS_SERVICE = {
  create: (payload: CreatePropertyRequestPayload) =>
    API(`${base}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }) as Promise<ApiItemResponse>,

  list: (params: ListRequestsParams = {}) => {
    const filtered: Record<string, string> = {};
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v) !== '') {
        filtered[k] = String(v);
      }
    });
    const qs = Object.keys(filtered).length ? `?${new URLSearchParams(filtered).toString()}` : '';
    return API(`${base}${qs}`, { method: 'GET' }) as Promise<ApiListResponse>;
  },

  getById: (id: string) =>
    API(`${base}/${id}`, { method: 'GET' }) as Promise<ApiItemResponse>,

  listMine: () =>
    API(`${base}/mine`, { method: 'GET', auth: true }) as Promise<ApiArrayResponse>,

  update: (id: string, payload: Partial<CreatePropertyRequestPayload> & { status?: RequestStatus }) =>
    API(`${base}/${id}`, {
      method: 'PATCH',
      auth: true,
      body: JSON.stringify(payload),
    }) as Promise<ApiItemResponse>,

  respond: (id: string, message: string) =>
    API(`${base}/${id}/respond`, {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ message }),
    }) as Promise<ApiItemResponse>,
};
