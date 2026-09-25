import { useLocation } from 'react-router-dom';
import MarketplaceHeader from '@/components/navbar/MarketplaceHeader';

interface MainLayoutProps {
  children: React.ReactNode;
}

const CUSTOM_HEADER_EXACT = new Set([
  '/',
  '/properties',
  '/sell',
  '/request-property',
  '/requests',
  '/messages',
  '/articles',
  '/neighbourhood',
  '/about',
  '/careers',
  '/contact',
  '/help',
  '/terms',
  '/privacy',
  '/cookies',
  '/sold-properties',
]);

const hasCustomHeader = (pathname: string) => {
  if (CUSTOM_HEADER_EXACT.has(pathname)) return true;
  if (pathname.startsWith('/properties/')) return true;
  if (pathname.startsWith('/agents/')) return true;
  if (pathname.startsWith('/neighbourhood/')) return true;
  if (pathname.startsWith('/articles/')) return true;
  if (pathname.startsWith('/requests/')) return true;
  if (pathname.startsWith('/for-sale/')) return true;
  if (pathname.startsWith('/for-rent/')) return true;
  if (pathname.startsWith('/shortlet/')) return true;
  if (pathname.startsWith('/land/')) return true;
  if (pathname.startsWith('/pages/')) return true;
  return false;
};

const UserLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const customHeader = hasCustomHeader(pathname);

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col">
        {!customHeader && <MarketplaceHeader />}
        <main className="flex-1 bg-surface-muted">{children}</main>
      </div>
    </div>
  );
};

export default UserLayout;
