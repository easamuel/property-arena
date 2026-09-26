import type { ReactNode } from 'react';
import StatusBadge from '@/components/admin/StatusBadge';

export function BuyerCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-gray-100 bg-white shadow-[0_10px_30px_-18px_rgba(15,23,42,0.28)] ${className}`}
    >
      {children}
    </div>
  );
}

export function BuyerSectionTitle({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-base font-bold text-gray-900 sm:text-lg">{title}</h2>
      {action}
    </div>
  );
}

export function BuyerStatus({ status }: { status: string }) {
  return <StatusBadge status={status} />;
}

export const buyerTone: Record<string, string> = {
  green: 'bg-emerald-50 text-emerald-700',
  blue: 'bg-sky-50 text-sky-700',
  purple: 'bg-violet-50 text-violet-700',
  amber: 'bg-amber-50 text-amber-700',
};
