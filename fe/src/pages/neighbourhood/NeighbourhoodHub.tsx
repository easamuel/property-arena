import { Link } from 'react-router-dom';
import MarketplaceHeader from '@/components/navbar/MarketplaceHeader';
import SiteFooter from '@/components/footer/SiteFooter';
import SeoHead from '@/components/seo/SeoHead';
import { guideData, totalAreasCovered } from '@/data/guide';

const NeighbourhoodHub = () => (
  <div className="min-h-screen bg-surface">
    <SeoHead
      title="Neighbourhood Guides"
      description={`City and area guides across Nigeria — ${guideData.length} states, ${totalAreasCovered}+ neighbourhoods with photos and live listing links.`}
      path="/neighbourhood"
    />
    <MarketplaceHeader />
    <section className="border-b border-line bg-gradient-to-br from-[#0b1f14] via-[#143022] to-[#1a3d28] px-4 py-14 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-green">Neighbourhood Guides</p>
        <h1 className="mt-2 max-w-2xl text-3xl font-extrabold sm:text-4xl">
          Know the street before you commit to the house
        </h1>
        <p className="mt-3 max-w-xl text-sm text-white/70">
          {guideData.length} states · {totalAreasCovered}+ areas — lifestyle notes and live listing links for Nigerian buyers and renters.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-white/80">
          <span className="rounded-full bg-white/10 px-3 py-1.5">{guideData.length} states covered</span>
          <span className="rounded-full bg-white/10 px-3 py-1.5">{totalAreasCovered}+ neighbourhoods</span>
          <span className="rounded-full bg-white/10 px-3 py-1.5">Updated with listing links</span>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {guideData.map((city) => (
          <Link
            key={city.slug}
            to={`/neighbourhood/${city.slug}`}
            className="group overflow-hidden rounded-2xl bg-surface-elevated shadow-sm ring-1 ring-line transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative h-44 overflow-hidden">
              <img
                src={city.image}
                alt={city.location}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h2 className="text-lg font-bold">{city.location}</h2>
                <p className="text-xs text-white/80">
                  {city.subLocations?.length
                    ? `${city.subLocations.length} areas`
                    : 'City overview'}
                </p>
              </div>
            </div>
            <div className="p-4">
              <p className="line-clamp-2 text-sm text-ink-secondary">{city.description}</p>
              <span className="mt-3 inline-block text-sm font-semibold text-brand-green">
                Browse areas →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
    <SiteFooter />
  </div>
);

export default NeighbourhoodHub;
