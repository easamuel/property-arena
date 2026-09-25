import { Link } from 'react-router-dom';
import Logo from '@/components/brand/Logo';

const NotFound = () => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
    <Logo size="lg" />
    <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-brand-red">Error 404</p>
    <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">We couldn&apos;t find that page</h1>
    <p className="mt-3 max-w-md text-gray-500">The link may be broken or the page may have moved. Try searching for a property instead.</p>
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      <Link to="/properties" className="rounded-lg bg-brand-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-dark">
        Browse properties
      </Link>
      <Link to="/" className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
        Go to homepage
      </Link>
    </div>
  </div>
);

export default NotFound;
