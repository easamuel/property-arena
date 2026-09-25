/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBriefcase, FiCheck, FiHome, FiKey, FiLayers } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { useSignup } from '@/hooks';
import AuthLayout from '@/components/auth/AuthLayout';
import {
  AlertBanner,
  AuthButton,
  PasswordField,
  PasswordStrengthMeter,
  TextField,
  getErrorMessage,
  isValidEmail,
} from '@/components/auth/AuthFormControls';

type Role = 'user' | 'agent' | 'developer' | 'landlord';

const ACCOUNT_TYPES: { role: Role; label: string; description: string; icon: IconType }[] = [
  { role: 'user', label: 'Buyer / Tenant', description: 'Find a home to buy or rent', icon: FiHome },
  { role: 'agent', label: 'Agent', description: 'List and market properties', icon: FiBriefcase },
  { role: 'developer', label: 'Developer', description: 'Showcase new projects', icon: FiLayers },
  { role: 'landlord', label: 'Landlord', description: 'Rent out your property', icon: FiKey },
];

type Field = 'name' | 'email' | 'password' | 'confirm' | 'terms';
type Errors = Partial<Record<Field, string>>;

const SignUp: React.FC = () => {
  const [role, setRole] = useState<Role>('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [terms, setTerms] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [apiError, setApiError] = useState('');
  const { signup, loading } = useSignup();
  const navigate = useNavigate();

  const validate = (): Errors => {
    const e: Errors = {};
    if (name.trim().length < 2) e.name = 'Enter your full name';
    if (!email.trim()) e.email = 'Enter your email address';
    else if (!isValidEmail(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Create a password';
    else if (password.length < 8) e.password = 'Use at least 8 characters';
    if (!confirm) e.confirm = 'Confirm your password';
    else if (confirm !== password) e.confirm = 'Passwords do not match';
    if (!terms) e.terms = 'You must accept the terms to continue';
    return e;
  };

  const errors = validate();
  const show = (f: Field) => (touched[f] ? errors[f] : undefined);
  const touch = (f: Field) => () => setTouched((t) => ({ ...t, [f]: true }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setTouched({ name: true, email: true, password: true, confirm: true, terms: true });
    if (Object.keys(errors).length) return;

    const normalizedEmail = email.trim().toLowerCase();
    try {
      const { devLink } = await signup(name.trim(), normalizedEmail, password, role);
      navigate(`/verify-email?email=${encodeURIComponent(normalizedEmail)}`, {
        replace: true,
        state: { devLink, justSignedUp: true },
      });
    } catch (err: any) {
      if (err?.status === 409) {
        setApiError('An account with this email already exists. Try signing in instead.');
      } else {
        setApiError(getErrorMessage(err));
      }
    }
  };

  return (
    <AuthLayout
      wide
      title="Create your account"
      subtitle="Join thousands of Nigerians buying, renting and selling smarter."
      footer={
        <>
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-brand-green-dark hover:underline focus:outline-none focus-visible:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      {apiError && <AlertBanner>{apiError}</AlertBanner>}

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-gray-800">I am a…</legend>
          <div role="radiogroup" className="grid grid-cols-2 gap-3">
            {ACCOUNT_TYPES.map(({ role: r, label, description, icon: Icon }) => {
              const selected = role === r;
              return (
                <label
                  key={r}
                  className={`relative flex cursor-pointer flex-col gap-1 rounded-xl border p-3.5 transition focus-within:ring-4 focus-within:ring-brand-green/25 ${
                    selected
                      ? 'border-brand-green bg-brand-green/5 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="accountType"
                    value={r}
                    checked={selected}
                    onChange={() => setRole(r)}
                    className="sr-only"
                    disabled={loading}
                  />
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      selected ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Icon aria-hidden size={18} />
                  </span>
                  <span className="mt-1 text-sm font-semibold text-gray-900">{label}</span>
                  <span className="text-xs leading-snug text-gray-500">{description}</span>
                  {selected && (
                    <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand-green text-white">
                      <FiCheck aria-hidden size={13} strokeWidth={3} />
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>

        <TextField
          label="Full name"
          name="name"
          autoComplete="name"
          placeholder="e.g. Adaeze Okafor"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={touch('name')}
          error={show('name')}
          disabled={loading}
        />

        <TextField
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={touch('email')}
          error={show('email')}
          disabled={loading}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <PasswordField
            label="Password"
            name="new-password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={touch('password')}
            error={show('password')}
            disabled={loading}
          />
          <PasswordField
            label="Confirm password"
            name="confirm-password"
            autoComplete="new-password"
            placeholder="Re-enter password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onBlur={touch('confirm')}
            error={show('confirm')}
            disabled={loading}
          />
        </div>
        <PasswordStrengthMeter password={password} />

        <div>
          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => {
                setTerms(e.target.checked);
                setTouched((t) => ({ ...t, terms: true }));
              }}
              aria-invalid={!!show('terms')}
              aria-describedby={show('terms') ? 'terms-error' : undefined}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-brand-green focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2"
              disabled={loading}
            />
            <span>
              I agree to PropertyArena&apos;s{' '}
              <span className="font-medium text-gray-900 underline decoration-gray-300">Terms of Service</span>{' '}
              and{' '}
              <span className="font-medium text-gray-900 underline decoration-gray-300">Privacy Policy</span>.
            </span>
          </label>
          {show('terms') && (
            <p id="terms-error" className="mt-1.5 text-sm text-red-600">
              {show('terms')}
            </p>
          )}
        </div>

        <AuthButton loading={loading} loadingText="Creating account…">
          Create account
        </AuthButton>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
