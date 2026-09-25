import type { ReactNode } from 'react';

type Accent = 'green' | 'red' | 'blue' | 'purple' | 'orange';

type StatCardProps = {
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon?: ReactNode;
  iconClassName?: string;
  accent?: Accent;
};

const accentStyles: Record<Accent, string> = {
  green: 'bg-emerald-50 text-emerald-600',
  red: 'bg-red-50 text-admin-red',
  blue: 'bg-blue-50 text-blue-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-amber-50 text-amber-600',
};

export function StatCard({
  label,
  value,
  trend,
  trendUp = true,
  icon,
  iconClassName,
  accent = 'green',
}: StatCardProps) {
  const resolvedTrendUp = trend?.startsWith('-') ? false : trendUp;
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`mt-2 text-xs font-medium ${resolvedTrendUp ? 'text-emerald-600' : 'text-red-500'}`}>
              {trend.includes('from') ? trend : `${trend} from last week`}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${iconClassName ?? accentStyles[accent]}`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;

export { default as StatusBadge } from './StatusBadge';
