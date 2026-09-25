/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { FiAlertTriangle, FiCheckCircle, FiMail } from 'react-icons/fi';
import AuthLayout from '@/components/auth/AuthLayout';
import {
  AuthButton,
  DevLinkBox,
  Spinner,
  StatusIcon,
  TextField,
  getErrorMessage,
  isValidEmail,
} from '@/components/auth/AuthFormControls';
import { AUTH_SERVICE } from '@/services/auth';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/useToast';

type Status = 'verifying' | 'success' | 'error';

const ResendPanel: React.FC<{ initialEmail: string; initialDevLink?: string }> = ({
  initialEmail,
  initialDevLink,
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [devLink, setDevLink] = useState(initialDevLink);
  const [touched, setTouched] = useState(false);
  const toast = useToast();
  const emailError = !isValidEmail(email) ? 'Enter a valid email address' : undefined;

  const onResend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setTouched(true);
    if (emailError) return;
    setLoading(true);
    try {
      const res = await AUTH_SERVICE.resendVerification(email.trim().toLowerCase());
      setDevLink(res.data?.devLink);
      toast.success('Verification email sent. Check your inbox.');
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onResend} noValidate className="mt-6 space-y-3 text-left">
      {!initialEmail && (
        <TextField
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          error={touched ? emailError : undefined}
          disabled={loading}
        />
      )}
      <AuthButton variant="secondary" loading={loading} loadingText="Sending…">
        Resend verification email
      </AuthButton>
      <DevLinkBox link={devLink} />
    </form>
  );
};

const VerifyEmail: React.FC = () => {
  const [params] = useSearchParams();
  const token = params.get('token')?.trim() ?? '';
  const email = params.get('email')?.trim() ?? '';
  const location = useLocation();
  const navigate = useNavigate();
  const navState = (location.state ?? {}) as { devLink?: string; justSignedUp?: boolean };
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const setUser = useAuthStore((s) => s.setUser);

  const [status, setStatus] = useState<Status>('verifying');
  const [message, setMessage] = useState('');
  const requested = useRef(false);

  useEffect(() => {
    if (!token || requested.current) return;
    requested.current = true;
    AUTH_SERVICE.verifyEmail(token)
      .then((res) => {
        setStatus('success');
        const current = useAuthStore.getState().user;
        if (current && (!res.data?.email || current.email === res.data.email)) {
          setUser({ ...current, isEmailVerified: true });
        }
      })
      .catch((err: any) => {
        setStatus('error');
        setMessage(getErrorMessage(err, 'We could not verify your email. Please try again.'));
      });
  }, [token, setUser]);

  const continuePath = accessToken
    ? user?.role === 'admin'
      ? '/admin'
      : ['agent', 'developer', 'landlord'].includes(user?.role)
        ? '/dashboard'
        : '/'
    : '/login';

  if (token) {
    return (
      <AuthLayout>
        <div className="text-center" role={status === 'error' ? 'alert' : 'status'} aria-live="polite">
          {status === 'verifying' && (
            <>
              <StatusIcon tone="info">
                <Spinner className="h-7 w-7" />
              </StatusIcon>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Verifying your email…</h2>
              <p className="mt-2 text-sm text-gray-600">This will only take a moment.</p>
            </>
          )}
          {status === 'success' && (
            <>
              <StatusIcon tone="success">
                <FiCheckCircle size={28} />
              </StatusIcon>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Email verified</h2>
              <p className="mt-2 text-sm text-gray-600">
                Thanks for confirming your email. Your PropertyArena account is ready to go.
              </p>
              <AuthButton type="button" className="mt-6" onClick={() => navigate(continuePath, { replace: true })}>
                {accessToken ? 'Continue' : 'Continue to sign in'}
              </AuthButton>
            </>
          )}
          {status === 'error' && (
            <>
              <StatusIcon tone="error">
                <FiAlertTriangle size={28} />
              </StatusIcon>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Verification failed</h2>
              <p className="mt-2 text-sm text-gray-600">{message}</p>
              <ResendPanel initialEmail={email || user?.email || ''} />
              <Link to="/login" className="mt-4 inline-block text-sm font-medium text-gray-700 hover:underline">
                Back to sign in
              </Link>
            </>
          )}
        </div>
      </AuthLayout>
    );
  }

  const displayEmail = email || user?.email || '';

  return (
    <AuthLayout
      footer={
        <Link to={accessToken ? continuePath : '/login'} className="font-semibold text-gray-700 hover:text-gray-900 hover:underline">
          {accessToken ? "I'll do this later" : 'Back to sign in'}
        </Link>
      }
    >
      <div className="text-center">
        <StatusIcon tone="success">
          <FiMail size={28} />
        </StatusIcon>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          {navState.justSignedUp ? 'Account created! Check your inbox' : 'Check your inbox'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          We sent a verification link to{' '}
          {displayEmail ? (
            <span className="font-semibold text-gray-900">{displayEmail}</span>
          ) : (
            'your email address'
          )}
          . Click the link to confirm your account. It expires in 24 hours.
        </p>
        <ResendPanel initialEmail={displayEmail} initialDevLink={navState.devLink} />
        <p className="mt-5 text-xs text-gray-500">Can&apos;t find it? Check your spam or promotions folder.</p>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
