import { getGuideInsights } from '@/lib/guideInsights';
import type { FaqItem } from '@/components/seo/FaqSection';
import { buildSeoPath, labelToSlug } from '@/lib/seo';

export type ListingInsightInput = {
  title: string;
  location: string;
  area: string;
  state: string;
  type: string;
  purpose: string;
  price?: number | string;
  beds?: string | number;
  baths?: string | number;
  landArea?: string;
  rawDescription?: string;
  rawFeatures?: string[];
};

function purposePhrase(purpose: string) {
  if (purpose === 'rent') return 'for rent';
  if (purpose === 'shortlet') return 'for short let';
  return 'for sale';
}

function isLand(type: string, purpose: string) {
  const t = type.toLowerCase();
  return t.includes('land') || t.includes('plot') || purpose === 'lease';
}

function isCommercial(type: string) {
  return /commercial|office|shop|warehouse|co.?working/i.test(type);
}

function formatPrice(price?: number | string) {
  if (price == null || price === '') return null;
  const n = typeof price === 'number' ? price : Number(String(price).replace(/[^\d.]/g, ''));
  if (!Number.isFinite(n) || n <= 0) return String(price);
  return `₦${n.toLocaleString()}`;
}

/** Expand thin seed/API copy into a keyword-rich, useful description. */
export function buildRichListingDescription(input: ListingInsightInput): string {
  const area = input.area || input.location.split(',')[0]?.trim() || 'this location';
  const state = input.state || 'Nigeria';
  const purpose = purposePhrase(input.purpose);
  const typeLabel = input.type || 'Property';
  const priceLabel = formatPrice(input.price);
  const land = isLand(input.type, input.purpose);
  const commercial = isCommercial(input.type);
  const guides = getGuideInsights(area, state);

  const raw = (input.rawDescription || '').trim();
  const thinSeed = !raw || /^seed listing/i.test(raw) || raw.length < 80;

  const opener = land
    ? `${typeLabel} ${purpose} in ${area}, ${state}${input.landArea ? ` — approximately ${input.landArea}` : ''}${priceLabel ? ` at ${priceLabel}` : ''}. This PropertyArena listing is positioned for buyers comparing land for sale in ${area} and wider ${state} corridors.`
    : commercial
      ? `${typeLabel} ${purpose} in ${area}, ${state}${priceLabel ? ` priced around ${priceLabel}` : ''}. Ideal if you are searching commercial property ${purpose} in ${area} or nearby business districts in ${state}.`
      : `${input.beds ? `${input.beds} bedroom ` : ''}${typeLabel} ${purpose} in ${area}, ${state}${priceLabel ? ` listed at ${priceLabel}` : ''}. A strong match if you want ${typeLabel.toLowerCase()} ${purpose} in ${area} with clear next steps on viewing and paperwork.`;

  const body = thinSeed
    ? [
        opener,
        `About ${area}: ${guides.Lifestyle.split('\n\n')[0]}`,
        `Getting around: ${guides.Access.split('\n\n')[0]}`,
        land
          ? `Before you commit to land for sale in ${area}, ${state}, request survey details, confirm access roads, and review title (C of O, Governor’s Consent or equivalent) with a qualified professional.`
          : `Before paying, inspect in person, confirm the asking terms for this ${typeLabel.toLowerCase()} ${purpose} in ${area}, and never transfer funds outside documented channels.`,
        `Enquire on PropertyArena to request photos, documents and a guided conversation with the listing agent marketing this property in ${area}, ${state}.`,
      ].join('\n\n')
    : [
        opener,
        raw,
        `Looking for similar ${typeLabel.toLowerCase()} ${purpose} in ${area} or elsewhere in ${state}? Use the neighbourhood guide and related search links below to keep exploring on PropertyArena.`,
      ].join('\n\n');

  return body;
}

/** Richer amenity / highlight list — never leave buyers with only “Verified”. */
export function buildListingFeatures(input: ListingInsightInput): string[] {
  const area = input.area || 'this area';
  const land = isLand(input.type, input.purpose);
  const commercial = isCommercial(input.type);
  const base = (input.rawFeatures || []).filter((f) => f && !/^verified$/i.test(f.trim()));

  const extras = land
    ? [
        input.landArea ? `Approx. ${input.landArea}` : 'Plot size on request',
        'Title discussion: Consent / C of O',
        'Road / estate access to confirm on viewing',
        `Land for sale context — ${area}`,
        'Survey & beacon check recommended',
        'Enquire for documents pack',
        'PropertyArena safety checklist applies',
      ]
    : commercial
      ? [
          'Suitable for business use (confirm zoning)',
          'Power & service arrangements on request',
          'Parking / loading to confirm on site',
          `Commercial ${purposePhrase(input.purpose)} — ${area}`,
          'Flexible viewing by appointment',
          'Enquire for floor plate details',
          'PropertyArena safety checklist applies',
        ]
      : [
          input.beds ? `${input.beds} bedroom layout` : 'Bedroom count on listing',
          input.baths ? `${input.baths} bathroom(s)` : 'Bathroom details on viewing',
          'Fitted / service status to confirm',
          'Security & estate rules to confirm',
          `Homes ${purposePhrase(input.purpose)} in ${area}`,
          'Guided viewing available',
          'PropertyArena safety checklist applies',
        ];

  const merged = [...base, ...extras];
  const seen = new Set<string>();
  return merged.filter((f) => {
    const key = f.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 12);
}

/** City / purpose FAQs for ranking + trust (FAQPage JSON-LD via FaqSection). */
export function buildListingFaqs(input: ListingInsightInput): FaqItem[] {
  const area = input.area || input.state || 'this area';
  const state = input.state || 'Nigeria';
  const purpose = purposePhrase(input.purpose);
  const typeLabel = input.type || 'property';
  const land = isLand(input.type, input.purpose);
  const guides = getGuideInsights(area, state);

  return [
    {
      q: `Is this ${typeLabel.toLowerCase()} still available ${purpose} in ${area}?`,
      a: `Availability changes quickly. Use Call, WhatsApp or the enquiry form on this PropertyArena page — the agent marketing this ${typeLabel.toLowerCase()} ${purpose} in ${area}, ${state} will confirm status, viewing slots and current asking terms.`,
    },
    {
      q: `What should I check before buying or renting in ${area}, ${state}?`,
      a: land
        ? `For land for sale in ${area}, insist on survey, access confirmation and title review (C of O / Governor’s Consent where applicable). Walk the plot, confirm beacons and never pay without documented due diligence.`
        : `Inspect the ${typeLabel.toLowerCase()} in person, match photos to the building, clarify what’s included in the price or rent, and verify identity of the agent. Read our safety tips before any transfer.`,
    },
    {
      q: `What is ${area} like for everyday living?`,
      a: guides.Lifestyle.split('\n\n')[0],
    },
    {
      q: `How is access and commuting around ${area}?`,
      a: guides.Access.split('\n\n')[0],
    },
    {
      q: `Are there schools near ${area}, ${state}?`,
      a: guides.Schools.split('\n\n')[0],
    },
    {
      q: `How do I find more ${typeLabel.toLowerCase()} ${purpose} in ${area}?`,
      a: `Use the related links on this page for ${typeLabel.toLowerCase()} ${purpose} in ${area} and across ${state}, or open the neighbourhood guide for ${area} to compare lifestyle before you enquire again on PropertyArena.`,
    },
  ];
}

export function buildListingSeoHubs(input: ListingInsightInput): { label: string; to: string }[] {
  const area = input.area || '';
  const state = input.state || 'Nigeria';
  const purposeKey =
    input.purpose === 'rent' ? 'for-rent' : input.purpose === 'shortlet' ? 'shortlet' : 'for-sale';
  const land = isLand(input.type, input.purpose);
  const purpose = purposePhrase(input.purpose);
  const typeLabel = land ? 'Land' : input.type || 'Property';

  const links: { label: string; to: string }[] = [
    {
      label: `${typeLabel} ${purpose} in ${state}`,
      to: buildSeoPath(purposeKey as 'for-sale' | 'for-rent' | 'shortlet' | 'land', state),
    },
  ];
  if (area) {
    links.unshift({
      label: `${typeLabel} ${purpose} in ${area}, ${state}`,
      to: buildSeoPath(purposeKey as 'for-sale' | 'for-rent' | 'shortlet' | 'land', state, area),
    });
    links.push({
      label: `Area guide — ${area}`,
      to: `/neighbourhood/${labelToSlug(state)}/${labelToSlug(area)}`,
    });
  }
  if (land) {
    links.push({
      label: `Land for sale in ${state}`,
      to: buildSeoPath('land', state),
    });
  }
  links.push(
    { label: 'Request a similar property', to: '/request-property' },
    { label: 'Post your property', to: '/sell' },
  );
  return links;
}
