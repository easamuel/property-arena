import { Link } from 'react-router-dom';
import MarketplaceHeader from '@/components/navbar/MarketplaceHeader';
import SiteFooter from '@/components/footer/SiteFooter';
import SeoHead from '@/components/seo/SeoHead';
import { SOLD_PROPERTIES } from '@/components/marketplace/SoldProperties';

const SoldPropertiesPage = () => (
  <div className="min-h-screen bg-surface-muted">
    <SeoHead
      title="Sold Properties"
      description="Recently closed property deals across Lagos, Abuja and beyond — browse similar homes still available on PropertyArena."
      path="/sold-properties"
    />
    <MarketplaceHeader />
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
        <Link to="/" className="hover:text-brand-green">
          Home
        </Link>
        <span>/</span>
        <span className="text-ink">Sold properties</span>
      </nav>
      <p className="text-[11px] font-bold uppercase tracking-wider text-brand-green">Market proof</p>
      <h1 className="mt-1 text-3xl font-extrabold text-ink sm:text-4xl">Sold Properties</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-muted">
        Closed deals across Lagos and beyond — browse similar homes still available on PropertyArena.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SOLD_PROPERTIES.map((item) => (
          <Link
            key={item.id}
            to={item.to}
            className="group overflow-hidden rounded-2xl bg-surface-elevated ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={item.img}
                alt={item.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute left-3 top-3 rounded bg-ink/85 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Sold
              </span>
            </div>
            <div className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">{item.type}</p>
              <h2 className="mt-1 line-clamp-2 text-sm font-bold text-ink group-hover:text-brand-green">
                {item.title}
              </h2>
              <p className="mt-1 line-clamp-1 text-xs text-ink-muted">{item.subtitle}</p>
              <p className="mt-2 line-clamp-2 text-xs text-ink-secondary">{item.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
    <SiteFooter />
  </div>
);

export default SoldPropertiesPage;
