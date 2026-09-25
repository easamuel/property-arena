import { Link } from 'react-router-dom';
import { FaCheckCircle, FaBolt, FaStar, FaCrown } from 'react-icons/fa';

const PERKS = [
  {
    icon: FaCrown,
    title: 'Premium badge',
    body: 'Clear mark on every listing and profile — buyers spot serious sellers instantly.',
  },
  {
    icon: FaBolt,
    title: 'Priority ranking',
    body: 'Featured slots and higher placement in search, location pages and request matching.',
  },
  {
    icon: FaStar,
    title: 'More leads & media',
    body: 'Extra listings, richer galleries and monthly lead caps matched to your plan.',
  },
  {
    icon: FaCheckCircle,
    title: 'Trust signals',
    body: 'Verified contact flows, confidence boost and sponsored placement options.',
  },
];

type Props = { className?: string };

/** How premium / paid agents stand out — PropertyArena’s own framing. */
export function ArenaSelectPremium({ className = '' }: Props) {
  return (
    <section
      className={`overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b1f14] via-[#143022] to-[#1a3d28] text-white ${className}`}
    >
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:p-10">
        <div>
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Premium agents don’t whisper — they stand out
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/75">
            Our paid-seller tier gives priority placement, higher lead capacity and clearer trust cues — crafted for
            Nigerian buyers who move fast but carefully.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/subscription"
              className="rounded-xl bg-brand-green px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-green-dark"
            >
              See plans &amp; badges
            </Link>
            <Link
              to="/signup?role=agent"
              className="rounded-xl border border-white/25 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Become an agent
            </Link>
          </div>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {PERKS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <Icon className="text-brand-green" />
              <p className="mt-3 text-sm font-bold">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/65">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ArenaSelectPremium;
