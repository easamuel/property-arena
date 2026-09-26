type StatusBadgeProps = {
  status: string;
  variant?: 'green' | 'yellow' | 'red' | 'blue' | 'purple' | 'gray' | 'orange';
};

const variantStyles: Record<NonNullable<StatusBadgeProps['variant']>, string> = {
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  yellow: 'bg-amber-50 text-amber-700 border-amber-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  gray: 'bg-gray-100 text-gray-600 border-gray-200',
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
};

const statusVariant = (status: string): StatusBadgeProps['variant'] => {
  const s = status.toLowerCase();
  if (['published', 'active', 'completed', 'successful', 'converted', 'new', 'paid', 'confirmed', 'closed'].includes(s))
    return 'green';
  if (['pending', 'draft', 'qualified', 'contacted', 'in-progress', 'negotiating', 'follow up'].includes(s))
    return s === 'draft' ? 'gray' : 'orange';
  if (['inactive', 'cancelled', 'failed', 'suspended'].includes(s)) return 'red';
  if (['rent payment', 'scheduled', 'interested'].includes(s)) return s === 'interested' ? 'purple' : 'blue';
  if (['service charge', 'refunded'].includes(s)) return 'purple';
  return 'gray';
};

const StatusBadge = ({ status, variant }: StatusBadgeProps) => {
  const v = variant ?? statusVariant(status);
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${variantStyles[v!]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
