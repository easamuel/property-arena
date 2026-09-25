import { useAuthStore } from '../store/authStore';

/** API root including `/api/v1` when env is host-only. */
export const getApiBaseUrl = (): string => {
  const raw = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';
  if (!raw) return '/api/v1';
  if (raw.endsWith('/api/v1')) return raw;
  return `${raw}/api/v1`;
};

const resolveUrl = (input: RequestInfo): RequestInfo => {
  if (typeof input !== 'string') return input;
  if (input.startsWith('http://') || input.startsWith('https://')) return input;
  const base = getApiBaseUrl();
  if (input.startsWith('/api/v1')) return `${base.replace(/\/api\/v1$/, '')}${input}`;
  if (input.startsWith('/')) return `${base}${input}`;
  return input;
};

export class APIError extends Error {
  public status: number;
  public statusText: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public response?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, status: number, statusText: string, response?: any) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.statusText = statusText;
    this.response = response;
  }
}

export const API = async (
  input: RequestInfo,
  init: RequestInit & { auth?: boolean } = {}
) => {
  const { auth, ...rest } = init;
  const headers = new Headers(rest.headers || {});
  headers.set('Content-Type', 'application/json');

  if (auth) {
    const token = useAuthStore.getState().accessToken;
    if (!token) throw new APIError('Not authenticated', 401, 'Unauthorized');
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(resolveUrl(input), { ...rest, headers });

  if (response.status === 401) {
    // useAuthStore.getState().logout();
    // window.location.reload();
    // return;

    throw new APIError('Unauthorized', 401, 'Unauthorized');
  }

  if (!response.ok) {
    let errorResponse;
    try {
      errorResponse = await response.json();
    } catch {
      // If response body is not JSON, use statusText
      errorResponse = { message: response.statusText };
    }

    const errorMessage = errorResponse.message || response.statusText || 'API error';
    throw new APIError(errorMessage, response.status, response.statusText, errorResponse);
  }

  return response.json();
};