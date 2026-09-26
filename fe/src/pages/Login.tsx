/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLogin } from '@/hooks';
import AuthLayout from '@/components/auth/AuthLayout';
import {
  AlertBanner,
  AuthButton,
  PasswordField,
  TextField,
  getErrorMessage,
  isValidEmail,
} from '@/components/auth/AuthFormControls';

const getSafeRedirect = (value: string | null) =>
  value && value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\')
    ? value
    : null;

const getRoleHome = (role?: string) => {
  const r = role?.toLowerCase();
  if (r === 'admin') return '/admin';
  if (['agent', 'landlord', 'developer', 'agency'].includes(r || '')) return '/workspace';
  return '/dashboard';
};

type Errors = { email?: string; password?: string };

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<keyof Errors, boolean>>({
    email: false,
    password: false,
  });
  const [apiError, setApiError] = useState('');
  const { login, loading } = useLogin();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = getSafeRedirect(params.get('redirect'));

  const validate = (values = { email, password }): Errors => {
    const next: Errors = {};
    if (!values.email.trim()) next.email = 'Enter your email address';
    else if (!isValidEmail(values.email)) next.email = 'Enter a valid email address';
    if (!values.password) next.password = 'Enter your password';
    return next;
  };

  const onBlur = (field: keyof Errors) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate());
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    const next = validate();
    setErrors(next);
    setTouched({ email: true, password: true });
    if (Object.keys(next).length) return;

    try {
      const user = await login(email.trim().toLowerCase(), password, remember);
      navigate(redirect ?? getRoleHome(user?.role), { replace: true });
    } catch (err: any) {
      if (err?.status === 403 || err?.status === 401) {
        setApiError('Incorrect email or password. Please try again.');
      } else {
        setApiError(getErrorMessage(err));
      }
    }
  };

  const signupHref = redirect ? `/signup?redirect=${encodeURIComponent(redirect)}` : '/signup';

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage your listings, saved homes and enquiries."
      footer={
        <>
          New to PropertyArena?{' '}
          <Link
            to={signupHref}
            className="font-semibold text-brand-green-dark hover:underline focus:outline-none focus-visible:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      {apiError && <AlertBanner>{apiError}</AlertBanner>}

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <TextField
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (touched.email) setErrors(validate({ email: e.target.value, password }));
          }}
          onBlur={() => onBlur('email')}
          error={touched.email ? errors.email : undefined}
          disabled={loading}
          autoFocus
        />

        <PasswordField
          label="Password"
          name="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (touched.password) setErrors(validate({ email, password: e.target.value }));
          }}
          onBlur={() => onBlur('password')}
          error={touched.password ? errors.password : undefined}
          disabled={loading}
          labelAction={
            <Link
              to="/forgot-password"
              className="rounded text-sm font-medium text-brand-green-dark hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
            >
              Forgot password?
            </Link>
          }
        />

        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-field-border accent-brand-green focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated"
          />
          Keep me signed in
        </label>

        <AuthButton loading={loading} loadingText="Signing in…">
          Sign in
        </AuthButton>
      </form>

      <p className="mt-6 text-center text-xs text-ink-muted">
        By continuing you agree to PropertyArena&apos;s Terms of Service and Privacy Policy.
      </p>
    </AuthLayout>
  );
};

export default Login;
