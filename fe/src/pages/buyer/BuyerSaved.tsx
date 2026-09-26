import { Link } from 'react-router-dom';
import { FaBath, FaBed, FaCar } from 'react-icons/fa';
import { FiHeart, FiMapPin } from 'react-icons/fi';
import { BUYER_SAVED } from '@/data/buyer-demo';
import { BuyerSectionTitle } from '@/components/buyer/BuyerUi';

export default function BuyerSaved() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Saved Properties</h1>
        <p className="mt-1 text-sm text-gray-500">Homes you bookmarked to revisit later.</p>
      </div>

      <BuyerSectionTitle title={`${BUYER_SAVED.length} saved`} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {BUYER_SAVED.map((item) => (
          <Link
            key={item.id}
            to="/properties"
            className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_10px_30px_-18px_rgba(15,23,42,0.28)] transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={item.thumb}
                alt=""
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute left-0 top-3 rounded-r-full bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white shadow">
                Saved
              </span>
              <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-emerald-600">
                <FiHeart className="fill-current" />
              </span>
            </div>
            <div className="p-4">
              <p className="text-lg font-bold text-gray-900">
                {item.price}
                {item.period ? <span className="text-xs font-medium text-gray-500">{item.period}</span> : null}
              </p>
              <p className="mt-1 font-semibold text-gray-800">{item.title}</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                <FiMapPin /> {item.location}
              </p>
              <div className="mt-3 flex gap-3 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <FaBed className="text-emerald-600" /> {item.beds}
                </span>
                <span className="inline-flex items-center gap-1">
                  <FaBath className="text-emerald-600" /> {item.baths}
                </span>
                <span className="inline-flex items-center gap-1">
                  <FaCar className="text-emerald-600" /> {item.parking}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
