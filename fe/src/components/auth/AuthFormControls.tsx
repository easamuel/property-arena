import React, { useId, useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiEye, FiEyeOff, FiInfo } from 'react-icons/fi';

const inputBase =
  'block w-full rounded-xl border bg-field px-3.5 py-3 text-[15px] text-ink placeholder:text-ink-muted shadow-sm transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60';

const inputState = (hasError: boolean) =>
  hasError
    ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
    : 'border-field-border hover:border-line-strong focus:border-brand-green focus:ring-brand-green/20';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: React.ReactNode;
  labelAction?: React.ReactNode;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  hint,
  labelAction,
  id,
  className,
  ...props
}) => {
  const autoId = useId();
  const inputId = id ?? autoId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
        {labelAction}
      </div>
      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={`${inputBase} ${inputState(!!error)}`}
        {...props}
      />
      <FieldMessage id={inputId} error={error} hint={hint} />
    </div>
  );
};

interface PasswordFieldProps extends Omit<TextFieldProps, 'type'> {
  children?: React.ReactNode;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  error,
  hint,
  labelAction,
  id,
  className,
  children,
  ...props
}) => {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [visible, setVisible] = useState(false);
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
        {labelAction}
      </div>
      <div className="relative">
        <input
          id={inputId}
          type={visible ? 'text' : 'password'}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`${inputBase} ${inputState(!!error)} pr-12`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-ink-muted transition hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-green"
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          aria-controls={inputId}
        >
          {visible ? <FiEyeOff size={19} /> : <FiEye size={19} />}
        </button>
      </div>
      {children}
      <FieldMessage id={inputId} error={error} hint={hint} />
    </div>
  );
};

const FieldMessage: React.FC<{ id: string; error?: string; hint?: React.ReactNode }> = ({
  id,
  error,
  hint,
}) => {
  if (error) {
    return (
      <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600">
        <FiAlertCircle aria-hidden className="shrink-0" />
        {error}
      </p>
    );
  }
  if (hint) {
    return (
      <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-muted">
        {hint}
      </p>
    );
  }
  return null;
};

export const getPasswordStrength = (password: string) => {
  const checks = {
    length: password.length >= 8,
    mixedCase: /[a-z]/.test(password) && /[A-Z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
  let score = Object.values(checks).filter(Boolean).length;
  if (password.length >= 12 && score >= 3) score = 4;
  if (!checks.length) score = Math.min(score, 1);
  return { score, checks };
};

const STRENGTH_LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = [
  'bg-red-500',
  'bg-red-500',
  'bg-amber-500',
  'bg-lime-500',
  'bg-brand-green',
];
const STRENGTH_TEXT = [
  'text-red-600',
  'text-red-600',
  'text-amber-600',
  'text-lime-700',
  'text-brand-green-dark',
];

export const PasswordStrengthMeter: React.FC<{ password: string }> = ({ password }) => {
  if (!password) return null;
  const { score, checks } = getPasswordStrength(password);

  const rules = [
    { ok: checks.length, label: '8+ characters' },
    { ok: checks.mixedCase, label: 'Upper & lowercase' },
    { ok: checks.number, label: 'A number' },
    { ok: checks.symbol, label: 'A symbol' },
  ];

  return (
    <div className="mt-2.5" aria-live="polite">
      <div className="flex gap-1.5" aria-hidden>
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              score >= i ? STRENGTH_COLORS[score] : 'bg-chip'
            }`}
          />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-ink-muted">
        Password strength:{' '}
        <span className={`font-semibold ${STRENGTH_TEXT[score]}`}>{STRENGTH_LABELS[score]}</span>
      </p>
      <ul className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        {rules.map((r) => (
          <li
            key={r.label}
            className={`flex items-center gap-1.5 ${r.ok ? 'text-brand-green' : 'text-ink-muted'}`}
          >
            <FiCheckCircle aria-hidden className={r.ok ? '' : 'opacity-40'} />
            <span>
              {r.label}
              <span className="sr-only">{r.ok ? ' (met)' : ' (not met)'}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const Spinner: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary';
}

export const AuthButton: React.FC<SubmitButtonProps> = ({
  loading,
  loadingText,
  variant = 'primary',
  disabled,
  children,
  className = '',
  type = 'submit',
  ...props
}) => {
  const styles =
    variant === 'primary'
      ? 'bg-brand-green text-white shadow-md shadow-brand-green/25 hover:bg-brand-green-dark focus-visible:ring-brand-green/40'
      : 'bg-surface-elevated text-ink ring-1 ring-inset ring-line hover:bg-chip focus-visible:ring-line';
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-[15px] font-semibold transition focus:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${styles} ${className}`}
      {...props}
    >
      {loading && <Spinner />}
      <span>{loading && loadingText ? loadingText : children}</span>
    </button>
  );
};

export const AlertBanner: React.FC<{
  tone?: 'error' | 'success' | 'info';
  children: React.ReactNode;
}> = ({ tone = 'error', children }) => {
  const map = {
    error: {
      cls: 'bg-red-50 text-red-800 ring-red-200 dark:bg-red-500/15 dark:text-red-200 dark:ring-red-500/30',
      Icon: FiAlertCircle,
    },
    success: {
      cls: 'bg-green-50 text-green-800 ring-green-200 dark:bg-brand-green/15 dark:text-brand-green dark:ring-brand-green/30',
      Icon: FiCheckCircle,
    },
    info: {
      cls: 'bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-500/15 dark:text-sky-200 dark:ring-sky-500/30',
      Icon: FiInfo,
    },
  }[tone];
  const { Icon } = map;
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`mb-5 flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm ring-1 ring-inset ${map.cls}`}
    >
      <Icon aria-hidden className="mt-0.5 shrink-0" size={17} />
      <div>{children}</div>
    </div>
  );
};

export const DevLinkBox: React.FC<{ link?: string }> = ({ link }) => {
  if (!link) return null;
  return (
    <div className="mt-5 rounded-xl border border-dashed border-amber-300 bg-amber-50 p-3 text-left text-xs text-amber-900">
      <p className="mb-1 font-semibold uppercase tracking-wide">Development link</p>
      <p className="mb-2 text-amber-800">Email delivery isn&apos;t configured, so here is the link directly:</p>
      <a href={link} className="break-all font-mono text-amber-900 underline hover:text-amber-700">
        {link}
      </a>
    </div>
  );
};

export const StatusIcon: React.FC<{ tone: 'success' | 'error' | 'info'; children: React.ReactNode }> = ({
  tone,
  children,
}) => {
  const cls = {
    success: 'bg-brand-green/10 text-brand-green ring-brand-green/25',
    error: 'bg-red-50 text-brand-red ring-red-200 dark:bg-red-500/15 dark:ring-red-500/30',
    info: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/15 dark:text-sky-200 dark:ring-sky-500/30',
  }[tone];
  return (
    <div
      className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full ring-8 ${cls}`}
      aria-hidden
    >
      {children}
    </div>
  );
};

export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorMessage = (err: any, fallback = 'Something went wrong. Please try again.') => {
  if (!err) return fallback;
  if (err.status >= 500 || !err.status) {
    return err.message?.includes('fetch') ? 'Unable to reach the server. Check your connection.' : fallback;
  }
  const errors = err.response?.errors;
  if (errors && typeof errors === 'object' && !Array.isArray(errors)) {
    const first = Object.values(errors)[0];
    if (typeof first === 'string') return first;
  }
  return err.message || fallback;
};
