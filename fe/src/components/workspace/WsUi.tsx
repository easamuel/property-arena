import type { ReactNode } from 'react';
import StatusBadge from '@/components/admin/StatusBadge';

export function WsPanel({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-emerald-900/5 bg-white shadow-[0_12px_40px_-28px_rgba(11,47,36,0.45)] ${className}`}
    >
      {children}
    </div>
  );
}

export function WsSectionHeader({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-emerald-900/5 px-4 py-3.5 sm:px-5">
      <h2 className="text-sm font-bold text-[#0b2f24] sm:text-base">{title}</h2>
      {action}
    </div>
  );
}

export function WsStatus({ status }: { status: string }) {
  return <StatusBadge status={status} />;
}

export function formatNaira(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}
