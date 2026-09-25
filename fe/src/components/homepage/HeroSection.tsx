import { usePropertyStore } from '@/store/propertyStore';
import { useEffect, useState } from 'react';
import { FaChevronDown, FaSearch } from 'react-icons/fa';
import { EnumSelect } from '../EnumSelect';
import { createSearchParams, Link, useNavigate, useLocation } from 'react-router-dom';

const HeroSection = () => {
  const { enums, fetchEnums, fetchProperties } = usePropertyStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [filters, setFilters] = useState({
    propertyType: '',
    status: '',
    search: '',
    location: '',
    listingPurpose: 'buy',
  });

  useEffect(() => {
    fetchEnums();

    const qp = Object.fromEntries(new URLSearchParams(location.search));
    if (Object.keys(qp).length) {
      setFilters((prev) => ({ ...prev, ...qp }));
      fetchProperties(qp as Record<string, string>);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (extraParams: Record<string, string> = {}) => {
    const merged = { ...filters, ...extraParams };
    const paramsObject = Object.fromEntries(
      Object.entries(merged).filter(([, v]) => v !== '' && v !== undefined && v !== null)
    );
    const searchString = createSearchParams(paramsObject as Record<string, string>).toString();
    navigate({
      pathname: '/properties',
      search: searchString ? `?${searchString}` : '',
    });
    fetchProperties(paramsObject as Record<string, string>);
  };

  const handleTabChange = (purpose: string) => {
    setFilters({ ...filters, listingPurpose: purpose });
  };

  return (
    <div className="relative min-h-[85vh] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1600&auto=format&fit=crop')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />

      <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-4 py-16 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full bg-primary-green/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow">
              Nigeria&apos;s Smartest Property Marketplace
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Find. Compare. Own{' '}
              <span className="text-primary-green">Your Dream Property</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-gray-200">
              Thousands of verified properties. One trusted marketplace.
            </p>
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-white/90">
              <div><strong className="text-white">50,000+</strong> Verified Listings</div>
              <div><strong className="text-white">25,000+</strong> Happy Clients</div>
              <div><strong className="text-white">3,000+</strong> Active Agents</div>
            </div>
            <Link
              to="/create-property"
              className="mt-8 inline-flex rounded-lg bg-primary-green px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-primary-green-hover"
            >
              Post Property
            </Link>
          </div>

          <div className="hidden rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md lg:block">
            <p className="text-sm font-semibold text-white">Luxury Home</p>
            <p className="text-2xl font-bold text-primary-green">₦450,000,000</p>
            <p className="text-sm text-gray-200">5 Beds · 4 Baths · Lekki Phase 1</p>
          </div>
        </div>

        <div className="mt-12 w-full">
          <div className="bg-white text-sm px-4 py-2 rounded-t-xl flex flex-wrap gap-3 shadow border-b-0 w-fit">
            {['buy', 'rent', 'land', 'shortlet', 'commercial'].map((purpose) => (
              <button
                key={purpose}
                onClick={() => handleTabChange(purpose)}
                className={`px-2 capitalize transition-colors ${
                  filters.listingPurpose === purpose
                    ? 'font-semibold text-black border-b-2 border-primary-green'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {purpose === 'shortlet' ? 'Short Let' : purpose}
              </button>
            ))}
          </div>

          <div className="rounded-b-xl rounded-tr-xl bg-white/95 p-4 shadow-xl backdrop-blur sm:p-6">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-4">
                <label className="text-xs font-semibold text-gray-600">Location</label>
                <input
                  type="text"
                  placeholder="Lagos, Nigeria"
                  className="mt-1 w-full rounded-lg border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
              </div>
              <div className="lg:col-span-3">
                <EnumSelect
                  label="Property Type"
                  enumObject={enums?.PROPERTY_TYPE ?? {}}
                  value={filters.propertyType}
                  onChange={(val) => setFilters({ ...filters, propertyType: val })}
                  placeholder="Duplex"
                />
              </div>
              <div className="lg:col-span-3">
                <label className="text-xs font-semibold text-gray-600">Price Range</label>
                <div className="mt-1 flex items-center rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-500">
                  <span className="flex-1">₦10M – ₦500M</span>
                  <FaChevronDown className="text-gray-400" />
                </div>
              </div>
              <div className="lg:col-span-2">
                <button
                  onClick={() => handleSearch()}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-green py-3 text-sm font-bold text-white hover:bg-primary-green-hover"
                >
                  <FaSearch />
                  Search Properties
                </button>
              </div>
            </div>
            <button type="button" className="mt-3 text-xs font-medium text-primary-green hover:underline">
              Advanced Search ↓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
