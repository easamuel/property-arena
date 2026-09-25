import { Link } from 'react-router-dom';
import { MEDIA } from '@/data/media';

const BENEFITS = [
  {
    title: 'Live in minutes',
    body: 'Publish sale, rent or short-let stock with photos and map context — visible to serious browsers the same day.',
  },
  {
    title: 'Serious monthly enquiries',
    body: 'Reach buyers and renters already searching Nigerian corridors, not random social scrollers.',
  },
  {
    title: 'Free agent profile',
    body: 'A public page for your brand, service areas and listings — share one link instead of endless WhatsApp forwards.',
  },
];

/** Wider crops for the listing CTA band */
const BG_LIGHT = MEDIA.hero.replace('w=1600', 'w=1800');
const BG_DARK = MEDIA.duplexNight.replace('w=900', 'w=1800');

type Props = { className?: string };

/** Homepage band encouraging sellers to list on PropertyArena. */
export function ListYourPropertyCTA({ className = '' }: Props) {
  return (
    <section className={`relative isolate overflow-hidden border-y border-line ${className}`}>
      <div className="absolute inset-0" aria-hidden>
        <img
          src={BG_LIGHT}
          alt=""
          className="h-full w-full object-cover object-[center_40%] dark:hidden"
          loading="lazy"
        />
        <img
          src={BG_DARK}
          alt=""
          className="hidden h-full w-full object-cover object-[center_35%] dark:block"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-green/95 via-brand-green/80 to-brand-green/45 dark:from-[#0b100d]/95 dark:via-brand-green/75 dark:to-brand-green/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-green/50 via-transparent to-transparent dark:from-[#0b100d]/70" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/85">
            List on PropertyArena
          </p>
          <h2 className="mt-3 text-2xl font-extrabold leading-tight text-white sm:text-3xl">
            Put your property where Nigerian buyers already look
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/90">
            Skip the noisy group chats. List once, keep control of your photos and price, and let enquiries come through
            a marketplace built for Lagos, Abuja and every state in between.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/sell"
              className="bg-white px-5 py-2.5 text-sm font-bold text-brand-green transition hover:bg-white/90"
            >
              Sell a property
            </Link>
            <Link
              to="/create-property"
              className="border border-white/60 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-[2px] transition hover:bg-white/15"
            >
              Create a listing
            </Link>
          </div>
        </div>

        <ul className="divide-y divide-white/25 border-t border-white/25">
          {BENEFITS.map(({ title, body }) => (
            <li key={title} className="py-4 first:pt-4 last:pb-0">
              <p className="text-sm font-bold text-white">{title}</p>
              <p className="mt-1 text-sm leading-relaxed text-white/85">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ListYourPropertyCTA;
