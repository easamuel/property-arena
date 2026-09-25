type BadgeTone = 'gold' | 'green' | 'blue' | 'red' | 'slate';

const TONES: Record<BadgeTone, string> = {
  gold: 'bg-amber-100 text-amber-900 ring-amber-300/60 dark:bg-amber-500/20 dark:text-amber-200',
  green: 'bg-brand-green/15 text-brand-green-dark ring-brand-green/30 dark:text-brand-green',
  blue: 'bg-sky-100 text-sky-800 ring-sky-300/60 dark:bg-sky-500/20 dark:text-sky-200',
  red: 'bg-red-100 text-red-800 ring-red-300/60 dark:bg-red-500/20 dark:text-red-200',
  slate: 'bg-gray-100 text-gray-700 ring-gray-300/60 dark:bg-white/10 dark:text-gray-200',
};

function resolveTone(color?: string): BadgeTone {
  const c = (color || 'green').toLowerCase();
  if (c === 'gold' || c === 'amber' || c.includes('ffd')) return 'gold';
  if (c === 'blue' || c === 'sky') return 'blue';
  if (c === 'red' || c === 'rose') return 'red';
  if (c === 'slate' || c === 'gray' || c === 'grey') return 'slate';
  return 'green';
}

type Props = {
  label: string;
  color?: string;
  size?: 'sm' | 'md';
  className?: string;
};

/** Distinguishes paid / verified subscribers on cards and profiles. */
export function SubscriberBadge({ label, color, size = 'sm', className = '' }: Props) {
  if (!label) return null;
  const tone = resolveTone(color);
  const sizing = size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[10px]';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold uppercase tracking-wide ring-1 ${TONES[tone]} ${sizing} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" aria-hidden />
      {label}
    </span>
  );
}

export default SubscriberBadge;
