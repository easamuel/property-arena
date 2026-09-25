import { Link } from 'react-router-dom';
import { FaShieldAlt, FaUserSecret, FaHandshake, FaExclamationTriangle } from 'react-icons/fa';

const TIPS = [
  {
    icon: FaShieldAlt,
    title: 'Meet in public first',
    body: 'Inspect with a trusted person. Prefer estate gates, agent offices or bank halls for document review.',
  },
  {
    icon: FaUserSecret,
    title: 'Never pay outside escrow',
    body: 'Avoid cash, gift cards or personal transfers. Use bank transfers to verified company accounts only.',
  },
  {
    icon: FaHandshake,
    title: 'Verify title before deposit',
    body: 'Ask for survey plan, C of O / Governor’s Consent and confirm with a lawyer or lands registry.',
  },
  {
    icon: FaExclamationTriangle,
    title: 'Report suspicious listings',
    body: 'Pressure to pay urgently, mismatched photos or refusal to show ID are red flags — flag them to us.',
  },
];

type Props = {
  compact?: boolean;
  className?: string;
};

/** Marketplace safety guidance — shown on home, listings and requests. */
export function SafetyTips({ compact = false, className = '' }: Props) {
  return (
    <section className={`rounded-2xl border border-amber-200/80 bg-amber-50/80 p-5 dark:border-amber-500/30 dark:bg-amber-500/10 sm:p-6 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            Safety Tips
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-ink sm:text-xl">
            Stay safe while you buy, rent or enquire
          </h2>
          {!compact && (
            <p className="mt-1 max-w-2xl text-sm text-ink-muted">
              PropertyArena never asks for fees to “release” a listing. Agents and buyers should protect each other.
            </p>
          )}
        </div>
        <Link
          to="/help"
          className="shrink-0 text-sm font-semibold text-brand-green hover:underline"
        >
          Full safety guide →
        </Link>
      </div>
      <ul className={`mt-5 grid gap-3 ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
        {TIPS.map(({ icon: Icon, title, body }) => (
          <li
            key={title}
            className="rounded-xl bg-white/80 p-4 ring-1 ring-amber-100 dark:bg-surface-elevated dark:ring-white/10"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200">
              <Icon className="text-sm" />
            </span>
            <p className="mt-3 text-sm font-bold text-ink">{title}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-muted">{body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default SafetyTips;
