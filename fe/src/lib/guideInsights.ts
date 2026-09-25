export type GuideTopic = 'Lifestyle' | 'Access' | 'Schools' | 'Security';

const TOPICS: GuideTopic[] = ['Lifestyle', 'Access', 'Schools', 'Security'];

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(arr: T[], seed: number, salt: number): T {
  return arr[(seed + salt * 17) % arr.length];
}

function joinParagraphs(parts: string[]): string {
  return parts.filter(Boolean).join('\n\n');
}

/** Nigerian real-estate neighbourhood insights tailored to place + state. */
export function getGuideInsights(place: string, state: string): Record<GuideTopic, string> {
  const label = place.trim() || state.trim() || 'this area';
  const region = state.trim() || 'Nigeria';
  const seed = hashSeed(`${label}|${region}`.toLowerCase());
  const isStateLevel = label.toLowerCase() === region.toLowerCase();

  const vibe = pick(
    [
      'quietly residential',
      'commercially active',
      'family-oriented',
      'investor-focused',
      'fast-growing',
      'established and settled',
    ],
    seed,
    1,
  );
  const housing = pick(
    [
      'duplexes and terraces',
      'purpose-built flats',
      'detached homes and bungalows',
      'mixed estates and street housing',
      'land and new-build stock',
      'short-let apartments and mid-rises',
    ],
    seed,
    2,
  );
  const amenity = pick(
    [
      'markets, pharmacies and roadside services',
      'malls, eateries and weekend hangouts',
      'places of worship and community halls',
      'sports clubs and recreation spots',
      'neighbourhood shops and mini-marts',
    ],
    seed,
    3,
  );
  const road = pick(
    [
      'the main expressway and feeder roads',
      'inner streets that link to arterial roads',
      'bus corridors and informal transit hubs',
      'estate gates and controlled access roads',
      'bridges, junctions and peak-hour bottlenecks',
    ],
    seed,
    4,
  );
  const commute = pick(
    [
      'CBD offices and government districts',
      'airport and inter-city terminals',
      'industrial and commercial belts',
      'university and hospital corridors',
      'neighbouring estates and satellite towns',
    ],
    seed,
    5,
  );
  const schoolMix = pick(
    [
      'private nurseries and primary schools',
      'secondary day schools and exam centres',
      'faith-based and international-curriculum options',
      'crèche-to-secondary clusters within a short drive',
    ],
    seed,
    6,
  );
  const safety = pick(
    [
      'estate security and gated access',
      'street-level vigilance and community watch',
      'CCTV and controlled visitor entry in newer developments',
      'police posts and neighbourhood associations',
    ],
    seed,
    7,
  );

  const placeRef = isStateLevel ? `${region} State` : `${label} in ${region}`;

  const lifestyle = joinParagraphs([
    `${placeRef} feels ${vibe} for many Nigerian households — a mix of ${housing} rather than a single housing type. Buyers comparing listings on PropertyArena often start here because daily life is readable: you can walk or short-drive to ${amenity} without leaving the wider ${region} ecosystem.`,
    `Evenings and weekends set the tone. Some streets stay lively with small businesses; quieter pockets favour family compounds and estates. If you are relocating, visit at different times of day — weekday traffic, Saturday markets and Sunday calm all say different things about whether ${label} matches your lifestyle.`,
    `Short-let demand and long-term rentals often coexist. Investors weigh yield against vacancy; owner-occupiers care more about neighbours, noise and how finished the surrounding roads and drainage feel. Use live listings to compare asking prices street by street, not just by LGA name.`,
    seed % 3 === 0
      ? `New developments keep reshaping ${label}: half-built sites sit beside older streets, so inspect access, power backup and water before you commit. A “good deal” on paper can become expensive if the micro-location still needs basic infrastructure.`
      : `When you shortlist homes in ${label}, ask agents about service charges, estate rules and generator norms. Those soft costs shape monthly living as much as rent or mortgage in ${region}.`,
  ]);

  const access = joinParagraphs([
    `Getting in and out of ${placeRef} hinges on ${road}. Peak hours can stretch a short map distance into a long trip, so test the route you would actually use for work, school runs or airport transfers.`,
    `Most residents combine private cars, ride-hailing and local buses. Proximity to ${commute} is a common search filter on PropertyArena — useful if your household splits time between ${label} and other ${region} hubs.`,
    `Within the neighbourhood, last-mile roads matter. Some estates enjoy paved internal streets; others still rely on laterite or unfinished drains that flood in the rains. Always confirm the final approach to the gate or compound, not just the highway exit.`,
    seed % 2 === 0
      ? `Future road projects and new commercial nodes can lift values in ${label}, but they also bring construction traffic. Factor both the upside and the disruption into your timeline if you are buying land or an unfinished unit.`
      : `If you need reliable logistics — deliveries, staff commute, or client visits — favour listings closer to known junctions in ${region} rather than the most secluded cul-de-sac unless security and estate management are excellent.`,
  ]);

  const schools = joinParagraphs([
    `Families looking at ${placeRef} usually map ${schoolMix} within a practical morning radius. Distance on a map is less useful than the real drop-off route during school-run congestion.`,
    `Public and private options coexist across ${region}. Many parents mix neighbourhood schools with after-school lessons or weekend programmes. When viewing a home, ask neighbours which schools they actually use — marketing brochures rarely capture that local knowledge.`,
    `For boarding or specialised curricula, households in ${label} often travel farther within ${region} or to neighbouring states. Budget for that travel if your preferred school is not walking distance.`,
    seed % 4 !== 1
      ? `Nursery and primary proximity tends to matter more for daily life than secondary; teenagers may commute independently once transport options are clear. Factor age of children into whether ${label} is a five-year home or a longer stay.`
      : `If education quality is your top filter, shortlist homes first by school catchment and only then by finishes. A slightly older house near a trusted school often beats a glossy unit with a difficult school run.`,
  ]);

  const security = joinParagraphs([
    `Security expectations in ${placeRef} range from open street living to ${safety}. Newer estates typically advertise 24-hour guards, while older streets rely more on community networks and personal precautions.`,
    `As with anywhere in Nigeria, verify what “secure” means for a specific listing: manned gate, visitor logs, street lighting, drainage that does not create dark corners, and how power outages affect cameras or intercoms.`,
    `PropertyArena encourages in-person or video verification and never paying outside documented channels. Meet agents in public first, confirm identity, and walk the immediate perimeter of any home in ${label} before you transfer funds.`,
    seed % 3 === 2
      ? `Ask about recent incidents openly — serious agents in ${region} will discuss neighbourhood watch, police response and estate levies without drama. Opaque answers are a signal to dig deeper or walk away.`
      : `Insurance, strong doors and sensible landscaping still matter even inside gated communities. Treat estate security as a layer, not a substitute for personal due diligence when buying or renting in ${label}.`,
  ]);

  return {
    Lifestyle: lifestyle,
    Access: access,
    Schools: schools,
    Security: security,
  };
}

export const GUIDE_TOPICS = TOPICS;
