import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiMapPin } from 'react-icons/fi';
import { BuyerSectionTitle } from '@/components/buyer/BuyerUi';
import {
  getSavedListings,
  subscribeSaved,
  toggleSavedListing,
  type SavedListing,
} from '@/lib/savedListings';

export default function BuyerSaved() {
  const [rows, setRows] = useState<SavedListing[]>([]);

  useEffect(() => {
    const sync = () => setRows(getSavedListings());
    sync();
    return subscribeSaved(sync);
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-ink sm:text-2xl">Saved Properties</h1>
        <p className="mt-1 text-sm text-ink-muted">Homes you liked — tap the heart again to remove.</p>
      </div>

      <BuyerSectionTitle title={`${rows.length} saved`} />

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface-elevated px-6 py-14 text-center">
          <FiHeart className="mx-auto text-2xl text-ink-muted" />
          <p className="mt-3 text-sm font-semibold text-ink">No liked properties yet</p>
          <p className="mt-1 text-xs text-ink-muted">Open a listing and tap Save to add it here.</p>
          <Link
            to="/properties"
            className="mt-4 inline-flex rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
          >
            Browse listings
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-line bg-surface-elevated shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <Link to={`/properties/${item.id}`} className="block">
                <div className="relative aspect-[4/3] overflow-hidden bg-chip">
                  {item.thumb ? (
                    <img
                      src={item.thumb}
                      alt=""
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : null}
                  <span className="absolute left-0 top-3 rounded-r-full bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white shadow">
                    Liked
                  </span>
                </div>
              </Link>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-lg font-bold text-ink">
                      {item.price != null && item.price > 0
                        ? `₦${item.price.toLocaleString()}`
                        : 'Price on request'}
                    </p>
                    <Link
                      to={`/properties/${item.id}`}
                      className="mt-1 block truncate font-semibold text-ink hover:text-emerald-600"
                    >
                      {item.title}
                    </Link>
                    {item.location ? (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
                        <FiMapPin /> {item.location}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    aria-label="Remove from likes"
                    onClick={() =>
                      toggleSavedListing({
                        id: item.id,
                        title: item.title,
                        location: item.location,
                        price: item.price,
                        thumb: item.thumb,
                      })
                    }
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red"
                  >
                    <FiHeart className="fill-current" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
