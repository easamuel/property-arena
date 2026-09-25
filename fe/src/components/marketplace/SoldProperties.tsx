import { Link } from 'react-router-dom';
import { MEDIA } from '@/data/media';

export type SoldItem = {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  type: string;
  img: string;
  to: string;
};

/** SEO-friendly sold strip — real Nigerian area names, crawlable links. */
export const SOLD_PROPERTIES: SoldItem[] = [
  {
    id: 'sold-1',
    title: 'Land for sale — Ige Estate, Ajasa Command',
    subtitle: 'Half plot of land',
    location: 'Ige Estate Off Ikola Road, Ajasa Command Via Ekoro, Abule Egba, Lagos',
    type: 'Land',
    img: MEDIA.land,
    to: '/for-sale/in/lagos/abule-egba?propertyType=land',
  },
  {
    id: 'sold-2',
    title: 'Land for sale — Ifako Ijaiye, Abule Egba',
    subtitle: 'Land measuring 45ft by 60ft',
    location: 'Ifako Ijaiye, Abule Egba, Lagos',
    type: 'Land',
    img: MEDIA.land2,
    to: '/for-sale/in/lagos/abule-egba?propertyType=land',
  },
  {
    id: 'sold-3',
    title: 'Land for sale — Abule Taylor, Abule Egba',
    subtitle: 'Quarter plot of land',
    location: 'Abule Taylor, Abule Egba, Lagos',
    type: 'Land',
    img: MEDIA.land,
    to: '/for-sale/in/lagos/abule-egba?propertyType=land',
  },
  {
    id: 'sold-4',
    title: 'Land for sale — Iyana Odo Meiran',
    subtitle: 'Quarter plot of land',
    location: 'Iyana Odo Meiran, Abule Egba, Lagos',
    type: 'Land',
    img: MEDIA.land2,
    to: '/for-sale/in/lagos/abule-egba?propertyType=land',
  },
  {
    id: 'sold-5',
    title: '4 Bedroom duplex — Lekki Phase 1',
    subtitle: 'Recently closed sale',
    location: 'Lekki Phase 1, Lagos',
    type: 'House',
    img: MEDIA.duplex,
    to: '/for-sale/in/lagos/lekki',
  },
  {
    id: 'sold-6',
    title: '3 Bedroom flat — Gwarinpa',
    subtitle: 'Recently closed sale',
    location: 'Gwarinpa, Abuja',
    type: 'Apartment',
    img: MEDIA.apartment,
    to: '/for-sale/in/abuja/gwarinpa',
  },
];

type Props = { className?: string };

export function SoldProperties({ className = '' }: Props) {
  return (
    <section className={className}>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-brand-green">Market proof</p>
          <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">Sold Properties</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Closed deals across Lagos and beyond — browse similar homes still available.
          </p>
        </div>
        <Link to="/sold-properties" className="shrink-0 text-sm font-semibold text-brand-green hover:underline">
          See more →
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SOLD_PROPERTIES.slice(0, 3).map((item) => (
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
              <h3 className="mt-1 line-clamp-2 text-sm font-bold text-ink group-hover:text-brand-green">
                {item.title}
              </h3>
              <p className="mt-1 line-clamp-1 text-xs text-ink-muted">{item.subtitle}</p>
              <p className="mt-2 line-clamp-2 text-xs text-ink-secondary">{item.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default SoldProperties;
