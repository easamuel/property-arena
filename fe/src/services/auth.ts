import { API, getApiBaseUrl } from './api';

export interface AuthMessageResponse {
  success: boolean;
  message: string;
  data?: {
    devLink?: string;
    emailed?: boolean;
    email?: string;
    user?: Record<string, unknown>;
    tokens?: { accessToken?: string };
  };
}

const post = (path: string, body: Record<string, unknown>): Promise<AuthMessageResponse> =>
  API(`${getApiBaseUrl()}/auth/${path}`, {
    method: 'POST',
    body: JSON.stringify(body),
    auth: false,
  });

const forgotPassword = (email: string) => post('forgot-password', { email });

const resetPassword = (token: string, password: string) =>
  post('reset-password', { token, password });

const verifyEmail = (token: string) => post('verify-email', { token });

const resendVerification = (email: string) => post('resend-verification', { email });

export const AUTH_SERVICE = {
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
};
