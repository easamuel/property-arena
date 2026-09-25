import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import MarketplaceHeader from '@/components/navbar/MarketplaceHeader';
import SiteFooter from '@/components/footer/SiteFooter';
import SeoHead from '@/components/seo/SeoHead';
import { guideMapBySlug } from '@/data/guide';
import { buildSeoPath } from '@/lib/seo';

const NeighbourhoodDetails = () => {
  const { slug, areaSlug } = useParams<{ slug?: string; areaSlug?: string }>();
  const [areaQuery, setAreaQuery] = useState('');

  const city = slug ? guideMapBySlug[slug] : undefined;
  const area = areaSlug ? city?.subLocations?.find((s) => s.slug === areaSlug) : undefined;

  const filteredAreas = useMemo(() => {
    const list = city?.subLocations || [];
    const q = areaQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.description || '').toLowerCase().includes(q),
    );
  }, [city, areaQuery]);

  if (!slug) {
    return (
      <div className="min-h-screen bg-surface">
        <MarketplaceHeader />
        <p className="p-8 text-sm text-ink-muted">Loading…</p>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="min-h-screen bg-surface">
        <MarketplaceHeader />
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-2xl font-bold text-ink">Guide not found</h1>
          <Link to="/neighbourhood" className="mt-4 inline-block text-brand-green hover:underline">
            ← All neighbourhood guides
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (areaSlug && !area) {
    return (
      <div className="min-h-screen bg-surface">
        <MarketplaceHeader />
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-2xl font-bold text-ink">Area not found</h1>
          <Link to={`/neighbourhood/${slug}`} className="mt-4 inline-block text-brand-green hover:underline">
            ← Back to {city.location}
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const title = area?.name || city.location;
  const image = area?.image || city.image;
  const description = area?.description || city.description;
  const listingQuery = encodeURIComponent(area?.name || city.location);
  const seoState = city.location === 'Rivers' ? 'Rivers' : city.location;

  return (
    <div className="min-h-screen bg-surface-muted">
      <SeoHead
        title={`${title} Neighbourhood Guide`}
        description={(description || '').slice(0, 160)}
        path={area ? `/neighbourhood/${slug}/${area.slug}` : `/neighbourhood/${slug}`}
        image={image}
      />
      <MarketplaceHeader />

      <section className="relative h-64 overflow-hidden sm:h-80">
        <img src={image} alt={title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <nav className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-white/70">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link to="/neighbourhood" className="hover:text-white">Neighbourhood Guides</Link>
            <span>/</span>
            {area ? (
              <>
                <Link to={`/neighbourhood/${slug}`} className="hover:text-white">{city.location}</Link>
                <span>/</span>
                <span className="text-white">{area.name}</span>
              </>
            ) : (
              <span className="text-white">{city.location}</span>
            )}
          </nav>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{title}</h1>
          <p className="mt-1 text-sm text-white/80">
            {area
              ? `${city.location} neighbourhood`
              : `${city.subLocations?.length || 0} areas covered`}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_280px] lg:px-8">
        <div className="rounded-2xl bg-surface-elevated p-6 shadow-sm ring-1 ring-line sm:p-8">
          <h2 className="text-xl font-bold text-ink">About {title}</h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink-secondary">
            {description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {['Lifestyle', 'Access', 'Schools', 'Security'].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-line bg-chip px-3 py-1.5 text-xs font-semibold text-ink-secondary"
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={`/properties?location=${listingQuery}`}
              className="rounded-lg bg-brand-green px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-green-dark"
            >
              View listings in {title}
            </Link>
            <Link
              to={buildSeoPath('for-sale', seoState, area?.name)}
              className="rounded-lg border border-line-strong px-5 py-2.5 text-sm font-semibold text-ink"
            >
              For sale in {title}
            </Link>
            <Link
              to="/request-property"
              className="rounded-lg border border-line-strong px-5 py-2.5 text-sm font-semibold text-ink"
            >
              Request a property here
            </Link>
          </div>

          {!area && city.subLocations && city.subLocations.length > 0 && (
            <div className="mt-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-ink">All areas in {city.location}</h3>
                  <p className="mt-1 text-sm text-ink-muted">
                    {filteredAreas.length} of {city.subLocations.length} neighbourhoods
                  </p>
                </div>
                <label className="relative block w-full sm:max-w-xs">
                  <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-ink-muted" />
                  <input
                    value={areaQuery}
                    onChange={(e) => setAreaQuery(e.target.value)}
                    placeholder="Filter areas…"
                    className="w-full rounded-xl border border-field-border bg-field py-2.5 pl-9 pr-3 text-sm text-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
                  />
                </label>
              </div>

              {filteredAreas.length === 0 ? (
                <p className="mt-6 text-sm text-ink-muted">No areas match “{areaQuery}”.</p>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredAreas.map((sub) => (
                    <Link
                      key={sub.slug}
                      to={`/neighbourhood/${slug}/${sub.slug}`}
                      className="group overflow-hidden rounded-xl bg-surface ring-1 ring-line transition hover:shadow-md"
                    >
                      <img
                        src={sub.image}
                        alt={sub.name}
                        className="h-32 w-full object-cover transition group-hover:scale-105"
                      />
                      <div className="bg-surface-elevated p-3">
                        <p className="font-bold text-ink">{sub.name}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{sub.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-surface-elevated p-5 shadow-sm ring-1 ring-line">
            <h3 className="font-bold text-ink">Quick links</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  to={buildSeoPath('for-sale', seoState, area?.name)}
                  className="text-brand-green hover:underline"
                >
                  Buy in {title}
                </Link>
              </li>
              <li>
                <Link
                  to={buildSeoPath('for-rent', seoState, area?.name)}
                  className="text-brand-green hover:underline"
                >
                  Rent in {title}
                </Link>
              </li>
              <li>
                <Link
                  to={`/properties?purpose=shortlet&location=${listingQuery}`}
                  className="text-brand-green hover:underline"
                >
                  Short let in {title}
                </Link>
              </li>
              <li>
                <Link to="/neighbourhood" className="text-brand-green hover:underline">
                  All state guides
                </Link>
              </li>
            </ul>
          </div>
          {!area && city.subLocations && city.subLocations.length > 12 && (
            <div className="rounded-2xl bg-surface-elevated p-5 shadow-sm ring-1 ring-line">
              <h3 className="font-bold text-ink">Popular areas</h3>
              <ul className="mt-3 max-h-64 space-y-1.5 overflow-y-auto text-sm">
                {city.subLocations.slice(0, 20).map((sub) => (
                  <li key={sub.slug}>
                    <Link
                      to={`/neighbourhood/${slug}/${sub.slug}`}
                      className="text-ink-secondary hover:text-brand-green"
                    >
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <SiteFooter />
    </div>
  );
};

export default NeighbourhoodDetails;
