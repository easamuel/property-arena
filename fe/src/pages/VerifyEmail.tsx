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
import { API, getApiBaseUrl } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/useToast';

type Status = 'verifying' | 'success' | 'error' | 'waiting';

const homeForRole = (role?: string) =>
  role?.toLowerCase() === 'admin' ? '/admin' : '/dashboard';

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
  const setSession = useAuthStore((s) => s.setSession);

  const [status, setStatus] = useState<Status>(token ? 'verifying' : 'waiting');
  const [message, setMessage] = useState('');
  const [liveHint, setLiveHint] = useState('Waiting for you to open the link…');
  const requested = useRef(false);

  // Device A: poll profile until another device verifies
  useEffect(() => {
    if (token || !accessToken) return;

    let cancelled = false;
    let ticks = 0;

    const poll = async () => {
      try {
        const res = await API(`${getApiBaseUrl()}/users/me`, { method: 'GET', auth: true });
        if (cancelled) return;
        const me = res?.data;
        if (me?.isEmailVerified) {
          setUser(me);
          setStatus('success');
          setLiveHint('Verified on another device — opening your arena…');
          window.setTimeout(() => {
            navigate(homeForRole(me.role), { replace: true });
          }, 900);
          return;
        }
        ticks += 1;
        if (ticks % 4 === 0) {
          setLiveHint('Still waiting — check your phone or inbox…');
        }
      } catch {
        /* keep waiting */
      }
    };

    void poll();
    const id = window.setInterval(poll, 2500);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [token, accessToken, setUser, navigate]);

  // Device B: open link with token → verify, sign in, go to dashboard
  useEffect(() => {
    if (!token || requested.current) return;
    requested.current = true;

    AUTH_SERVICE.verifyEmail(token)
      .then((res) => {
        setStatus('success');
        const nextUser = res.data?.user as Record<string, unknown> | undefined;
        const nextToken = res.data?.tokens?.accessToken;
        if (nextUser && nextToken) {
          setSession(
            { ...nextUser, isEmailVerified: true },
            nextToken,
          );
          window.setTimeout(() => {
            navigate(homeForRole(String(nextUser.role || '')), { replace: true });
          }, 1100);
          return;
        }
        const current = useAuthStore.getState().user;
        if (current && (!res.data?.email || current.email === res.data.email)) {
          setUser({ ...current, isEmailVerified: true });
        }
        window.setTimeout(() => {
          const auth = useAuthStore.getState();
          if (auth.accessToken) {
            navigate(homeForRole(auth.user?.role), { replace: true });
          } else {
            navigate('/login?redirect=/dashboard', { replace: true });
          }
        }, 1100);
      })
      .catch((err: any) => {
        setStatus('error');
        setMessage(getErrorMessage(err, 'We could not verify your email. Please try again.'));
      });
  }, [token, setUser, setSession, navigate]);

  if (token) {
    return (
      <AuthLayout>
        <div className="text-center" role={status === 'error' ? 'alert' : 'status'} aria-live="polite">
          {status === 'verifying' && (
            <>
              <StatusIcon tone="info">
                <Spinner className="h-7 w-7" />
              </StatusIcon>
              <h2 className="text-2xl font-bold tracking-tight text-ink">Verifying your email…</h2>
              <p className="mt-2 text-sm text-ink-muted">This will only take a moment.</p>
            </>
          )}
          {status === 'success' && (
            <>
              <StatusIcon tone="success">
                <FiCheckCircle size={28} />
              </StatusIcon>
              <h2 className="text-2xl font-bold tracking-tight text-ink">Email verified</h2>
              <p className="mt-2 text-sm text-ink-muted">
                Taking you into your PropertyArena workspace…
              </p>
              <AuthButton
                type="button"
                className="mt-6"
                onClick={() => {
                  const auth = useAuthStore.getState();
                  navigate(
                    auth.accessToken
                      ? homeForRole(auth.user?.role)
                      : '/login?redirect=/dashboard',
                    { replace: true },
                  );
                }}
              >
                Open dashboard
              </AuthButton>
            </>
          )}
          {status === 'error' && (
            <>
              <StatusIcon tone="error">
                <FiAlertTriangle size={28} />
              </StatusIcon>
              <h2 className="text-2xl font-bold tracking-tight text-ink">Verification failed</h2>
              <p className="mt-2 text-sm text-ink-muted">{message}</p>
              <ResendPanel initialEmail={email || user?.email || ''} />
              <Link to="/login" className="mt-4 inline-block text-sm font-medium text-ink-secondary hover:underline">
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
        <Link
          to={accessToken ? homeForRole(user?.role) : '/login'}
          className="font-semibold text-ink-secondary hover:text-ink hover:underline"
        >
          {accessToken ? "I'll do this later" : 'Back to sign in'}
        </Link>
      }
    >
      <div className="text-center" role="status" aria-live="polite">
        {status === 'success' ? (
          <>
            <StatusIcon tone="success">
              <FiCheckCircle size={28} />
            </StatusIcon>
            <h2 className="text-2xl font-bold tracking-tight text-ink">You&apos;re verified</h2>
            <p className="mt-2 text-sm text-ink-muted">{liveHint}</p>
          </>
        ) : (
          <>
            <StatusIcon tone="success">
              <FiMail size={28} />
            </StatusIcon>
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              {navState.justSignedUp ? 'Account created! Check your inbox' : 'Check your inbox'}
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              We sent a verification link to{' '}
              {displayEmail ? (
                <span className="font-semibold text-ink">{displayEmail}</span>
              ) : (
                'your email address'
              )}
              . Open it on this device or any other — this page updates the moment you verify.
            </p>
            {accessToken && (
              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-3 py-1.5 text-xs font-semibold text-brand-green-dark">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-green" />
                </span>
                {liveHint}
              </p>
            )}
            <ResendPanel initialEmail={displayEmail} initialDevLink={navState.devLink} />
            <p className="mt-5 text-xs text-ink-muted">Can&apos;t find it? Check your spam or promotions folder.</p>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
