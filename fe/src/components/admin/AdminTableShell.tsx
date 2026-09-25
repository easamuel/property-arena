import type { ReactNode } from 'react';
import { FiFilter, FiRefreshCw } from 'react-icons/fi';

type AdminTableShellProps = {
  title?: string;
  searchPlaceholder?: string;
  filters?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  showDefaultFilters?: boolean;
};

const AdminTableShell = ({
  title,
  searchPlaceholder = 'Search…',
  filters,
  actions,
  children,
  footer,
  showDefaultFilters = true,
}: AdminTableShellProps) => (
  <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
    {(title || showDefaultFilters || actions) && (
      <div className="flex flex-col gap-4 border-b border-gray-100 p-4 lg:flex-row lg:items-center lg:justify-between">
        {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
        <div className="flex flex-1 flex-wrap items-center gap-2 lg:justify-end">
          <input
            type="search"
            placeholder={searchPlaceholder}
            className="min-w-[180px] flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-admin-red focus:outline-none focus:ring-1 focus:ring-admin-red lg:max-w-xs"
          />
          {filters}
          {showDefaultFilters && (
            <>
              <select className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600">
                <option>All Status</option>
              </select>
              <button type="button" className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
                <FiFilter className="h-4 w-4" />
                More
              </button>
              <button type="button" className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
                <FiRefreshCw className="h-4 w-4" />
                Reset
              </button>
            </>
          )}
          {actions}
        </div>
      </div>
    )}
    <div className="overflow-x-auto">{children}</div>
    {footer && <div className="border-t border-gray-100 px-4 py-3 text-sm text-gray-500">{footer}</div>}
  </div>
);

export default AdminTableShell;
