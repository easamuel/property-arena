/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiMail } from 'react-icons/fi';
import AuthLayout from '@/components/auth/AuthLayout';
import {
  AlertBanner,
  AuthButton,
  DevLinkBox,
  StatusIcon,
  TextField,
  getErrorMessage,
  isValidEmail,
} from '@/components/auth/AuthFormControls';
import { AUTH_SERVICE } from '@/services/auth';
import { useToast } from '@/hooks/useToast';

const BackToLogin: React.FC = () => (
  <Link
    to="/login"
    className="inline-flex items-center gap-1.5 rounded font-semibold text-ink-secondary hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
  >
    <FiArrowLeft aria-hidden /> Back to sign in
  </Link>
);

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [sent, setSent] = useState(false);
  const [devLink, setDevLink] = useState<string>();
  const [emailed, setEmailed] = useState(true);
  const [apiError, setApiError] = useState('');
  const toast = useToast();

  const emailError = !email.trim()
    ? 'Enter your email address'
    : !isValidEmail(email)
      ? 'Enter a valid email address'
      : undefined;

  const request = async () => {
    const res = await AUTH_SERVICE.forgotPassword(email.trim().toLowerCase());
    setDevLink(res.data?.devLink);
    setEmailed(typeof res.data?.emailed === 'boolean' ? res.data.emailed : !res.data?.devLink);
    return res;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setApiError('');
    if (emailError) return;
    setLoading(true);
    try {
      await request();
      setSent(true);
    } catch (err: any) {
      setApiError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    setResending(true);
    try {
      await request();
      toast.success('We sent another reset link.');
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setResending(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout footer={<BackToLogin />}>
        <div className="text-center" role="status">
          <StatusIcon tone="success">
            <FiMail size={28} />
          </StatusIcon>
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            {emailed ? 'Check your email' : 'Reset link ready'}
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            {emailed ? (
              <>
                If an account exists for <span className="font-semibold text-ink">{email.trim()}</span>,
                you&apos;ll receive a link to reset your password. The link expires in 1 hour.
              </>
            ) : (
              <>
                We couldn&apos;t send email from the server right now. Use the secure reset link below
                (valid for 1 hour), or ask an admin to set <code className="text-xs">RESEND_API_KEY</code>.
              </>
            )}
          </p>
          <div className="mt-6 space-y-3">
            <AuthButton type="button" variant="secondary" loading={resending} loadingText="Resending…" onClick={onResend}>
              Resend link
            </AuthButton>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="w-full rounded text-sm font-medium text-brand-green-dark hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
            >
              Use a different email
            </button>
          </div>
          {emailed ? (
            <p className="mt-5 text-xs text-ink-muted">Didn&apos;t get it? Check your spam or promotions folder.</p>
          ) : null}
          <DevLinkBox link={devLink} label={emailed ? 'Also available' : 'Your reset link'} />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter the email you signed up with and we'll send you a secure reset link."
      footer={<BackToLogin />}
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
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          error={touched ? emailError : undefined}
          disabled={loading}
          autoFocus
        />
        <AuthButton loading={loading} loadingText="Sending link…">
          Send reset link
        </AuthButton>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
