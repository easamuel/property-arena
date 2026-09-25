/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import AuthLayout from '@/components/auth/AuthLayout';
import {
  AlertBanner,
  AuthButton,
  PasswordField,
  PasswordStrengthMeter,
  StatusIcon,
  getErrorMessage,
} from '@/components/auth/AuthFormControls';
import { AUTH_SERVICE } from '@/services/auth';

const ResetPassword: React.FC = () => {
  const [params] = useSearchParams();
  const token = params.get('token')?.trim() ?? '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [touched, setTouched] = useState({ password: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [apiError, setApiError] = useState('');
  const [tokenInvalid, setTokenInvalid] = useState(false);

  const errors = {
    password: !password
      ? 'Create a new password'
      : password.length < 8
        ? 'Use at least 8 characters'
        : undefined,
    confirm: !confirm
      ? 'Confirm your new password'
      : confirm !== password
        ? 'Passwords do not match'
        : undefined,
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setTouched({ password: true, confirm: true });
    if (errors.password || errors.confirm) return;
    setLoading(true);
    try {
      await AUTH_SERVICE.resetPassword(token, password);
      setDone(true);
    } catch (err: any) {
      if (err?.status === 400 && /invalid or has expired/i.test(err?.message ?? '')) {
        setTokenInvalid(true);
      } else {
        setApiError(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token || tokenInvalid) {
    return (
      <AuthLayout>
        <div className="text-center" role="alert">
          <StatusIcon tone="error">
            <FiAlertTriangle size={28} />
          </StatusIcon>
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            {token ? 'Link expired' : 'Invalid reset link'}
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            {token
              ? 'This password reset link is invalid or has expired. Request a new one to continue.'
              : 'This link is missing its reset token. Please use the full link from your email, or request a new one.'}
          </p>
          <Link
            to="/forgot-password"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-brand-green px-4 py-3 text-[15px] font-semibold text-white shadow-md shadow-brand-green/25 transition hover:bg-brand-green-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-green/40"
          >
            Request a new link
          </Link>
          <Link to="/login" className="mt-4 inline-block text-sm font-medium text-ink-secondary hover:underline">
            Back to sign in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (done) {
    return (
      <AuthLayout>
        <div className="text-center" role="status">
          <StatusIcon tone="success">
            <FiCheckCircle size={28} />
          </StatusIcon>
          <h2 className="text-2xl font-bold tracking-tight text-ink">Password updated</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Your password has been reset successfully. You can now sign in with your new password.
          </p>
          <AuthButton type="button" className="mt-6" onClick={() => navigate('/login', { replace: true })}>
            Continue to sign in
          </AuthButton>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set a new password" subtitle="Choose a strong password you don't use anywhere else.">
      {apiError && <AlertBanner>{apiError}</AlertBanner>}
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <PasswordField
          label="New password"
          name="new-password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          error={touched.password ? errors.password : undefined}
          disabled={loading}
          autoFocus
        >
          <PasswordStrengthMeter password={password} />
        </PasswordField>
        <PasswordField
          label="Confirm new password"
          name="confirm-password"
          autoComplete="new-password"
          placeholder="Re-enter new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
          error={touched.confirm ? errors.confirm : undefined}
          disabled={loading}
        />
        <AuthButton loading={loading} loadingText="Updating password…">
          Reset password
        </AuthButton>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
