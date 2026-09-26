import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
import { PROPERTY_SERVICE } from '@/services/property';
import { filterDemoListings } from '@/data/demo-listings';
import {
  buildListingSearchUrl,
  resolveSearchLocation,
  searchPlaces,
  type SearchTab,
} from '@/lib/locations';

type Hit = {
  id: string;
  title: string;
  location: string;
  price: number;
  purpose: string;
  img: string;
};

type Props = {
  className?: string;
  /** Homepage purpose tab — drives placeholder + search destination */
  tab?: SearchTab;
  placeholder?: string;
};

const TAB_PLACEHOLDERS: Record<SearchTab, string> = {
  Buy: 'Search homes for sale by area, state or keyword…',
  Rent: 'Search rentals by area, estate or keyword…',
  Land: 'Search land and plots by location…',
  'Short Let': 'Search short lets and stays by area…',
  Commercial: 'Search offices, shops and commercial space…',
};

/** Google-style live search — typeahead places + listings as you type. */
export function GoogleLiveSearch({ className = '', tab = 'Buy', placeholder }: Props) {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);

  const placeHints = useMemo(() => searchPlaces(q, 8), [q]);
  const inputPlaceholder = placeholder || TAB_PLACEHOLDERS[tab];

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    const needle = q.trim();
    if (needle.length < 2) {
      setHits([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const t = window.setTimeout(async () => {
      try {
        const res = await PROPERTY_SERVICE.getProperties({
          search: needle,
          limit: 8,
          page: 1,
        });
        if (cancelled) return;
        const data = (
          res as {
            data?: {
              id?: string;
              propertyId?: string;
              title?: string;
              location?: string;
              address?: string;
              price?: number;
              listingPurpose?: string;
              media?: { url?: string }[];
            }[];
          }
        )?.data;
        const fromApi: Hit[] = Array.isArray(data)
          ? data.map((p, i) => ({
              id: String(p.id || p.propertyId || `api-${i}`),
              title: p.title || 'Property',
              location: p.location || p.address || 'Nigeria',
              price: Number(p.price) || 0,
              purpose: p.listingPurpose || 'sale',
              img: p.media?.[0]?.url || filterDemoListings({ search: needle, limit: 1 })[0]?.img || '',
            }))
          : [];
        const fromDemo = filterDemoListings({ search: needle, limit: 8 }).map((d) => ({
          id: d.id,
          title: d.title,
          location: d.location,
          price: d.price,
          purpose: d.purpose,
          img: d.img,
        }));
        const merged = [...fromApi];
        for (const d of fromDemo) {
          if (!merged.some((m) => m.id === d.id || m.title === d.title)) merged.push(d);
        }
        setHits(merged.slice(0, 8));
      } catch {
        if (!cancelled) {
          setHits(
            filterDemoListings({ search: needle, limit: 8 }).map((d) => ({
              id: d.id,
              title: d.title,
              location: d.location,
              price: d.price,
              purpose: d.purpose,
              img: d.img,
            })),
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 220);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [q]);

  const goSearch = (raw?: string) => {
    const term = (raw ?? q).trim();
    setOpen(false);
    if (!term) {
      navigate(buildListingSearchUrl(tab, 'Nigeria'));
      return;
    }
    const place = resolveSearchLocation(term);
    if (place.state && place.state !== 'Nigeria') {
      navigate(buildListingSearchUrl(tab, place.label));
      return;
    }
    navigate(buildListingSearchUrl(tab, term));
  };

  const goPlace = (label: string, state: string, area?: string) => {
    setQ(label);
    setOpen(false);
    const loc = area ? `${area}, ${state}` : state;
    navigate(buildListingSearchUrl(tab, loc));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    goSearch();
  };

  const showPanel = open && (q.trim().length > 0 || placeHints.length > 0);

  return (
    <div ref={rootRef} className={`relative z-[60] mx-auto w-full max-w-3xl ${className}`}>
      <form onSubmit={onSubmit} className="relative">
        <div className="flex items-center gap-3 rounded-full border border-line bg-white px-5 py-3.5 shadow-lg transition focus-within:border-brand-green/40 focus-within:shadow-xl dark:bg-surface-elevated">
          <FaSearch className="shrink-0 text-ink-muted" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={inputPlaceholder}
            className="min-w-0 flex-1 border-0 bg-transparent text-base text-ink outline-none placeholder:text-ink-muted"
            aria-label="Live property search"
            autoComplete="off"
          />
          {q && (
            <button
              type="button"
              onClick={() => {
                setQ('');
                setHits([]);
              }}
              className="rounded-full p-1 text-ink-muted hover:bg-chip"
              aria-label="Clear"
            >
              <FaTimes className="text-sm" />
            </button>
          )}
          <button
            type="submit"
            className="hidden shrink-0 rounded-full bg-brand-green px-5 py-2 text-sm font-bold text-white hover:bg-brand-green-dark sm:inline-flex"
          >
            Search
          </button>
        </div>
      </form>

      {showPanel && (
        <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-[70] max-h-[min(70vh,28rem)] overflow-y-auto overflow-x-hidden rounded-2xl border border-line bg-white shadow-2xl dark:bg-surface-elevated">
          {placeHints.length > 0 && (
            <div className="border-b border-line px-2 py-2">
              <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                Places &amp; areas
              </p>
              <ul>
                {placeHints.map((s) => (
                  <li key={`${s.state}-${s.area || s.label}`}>
                    <button
                      type="button"
                      onClick={() => goPlace(s.label, s.state, s.area)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-chip"
                    >
                      <FaMapMarkerAlt className="shrink-0 text-brand-green" />
                      <span className="font-semibold text-ink">{s.label}</span>
                      <span className="ml-auto text-xs text-ink-muted">{s.hint}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="px-2 py-2">
            <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
              {loading
                ? 'Searching…'
                : hits.length
                  ? 'Live results'
                  : q.trim().length >= 2
                    ? 'No listings yet — browse the area'
                    : 'Start typing'}
            </p>
            {hits.length > 0 && (
              <ul>
                {hits.map((h) => (
                  <li key={h.id}>
                    <Link
                      to={`/properties/${h.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-chip"
                    >
                      <img src={h.img} alt="" className="h-12 w-14 shrink-0 rounded-lg object-cover" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink">{h.title}</span>
                        <span className="block truncate text-xs text-ink-muted">{h.location}</span>
                      </span>
                      <span className="shrink-0 text-xs font-bold text-brand-green">
                        {h.price > 0 ? `₦${h.price.toLocaleString()}` : '—'}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {q.trim().length >= 2 && (
              <button
                type="button"
                onClick={() => goSearch()}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-brand-green hover:bg-brand-green/5"
              >
                <FaSearch /> See all results for “{q.trim()}”
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GoogleLiveSearch;
