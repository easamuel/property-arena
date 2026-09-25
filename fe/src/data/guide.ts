import {
  AREA_IMAGES,
  NIGERIA_GUIDES,
  type AreaDef,
} from '@/data/nigeria-areas';

export interface SubLocation {
  id: number;
  name: string;
  image: string;
  slug: string;
  description?: string;
}

export interface GuideImage {
  id: number;
  image: string;
  location: string;
  slug: string;
  description?: string;
  subLocations?: SubLocation[];
}

export const makeSlug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

function buildAreas(areas: AreaDef[], cityId: number): SubLocation[] {
  return areas.map((a, i) => ({
    id: cityId * 1000 + i + 1,
    name: a.name,
    slug: makeSlug(a.name),
    image: AREA_IMAGES[i % AREA_IMAGES.length],
    description:
      a.blurb ||
      `${a.name} is a key neighbourhood for buyers and renters. Compare listings, check access roads, schools and estates, then enquire through PropertyArena.`,
  }));
}

export const guideData: GuideImage[] = NIGERIA_GUIDES.map((g, idx) => {
  const id = idx + 1;
  return {
    id,
    image: g.image,
    location: g.location,
    slug: g.slug || makeSlug(g.location),
    description: g.description,
    subLocations: buildAreas(g.areas, id),
  };
});

export const guideMapBySlug = guideData.reduce<Record<string, GuideImage>>((acc, g) => {
  acc[g.slug] = g;
  return acc;
}, {});

export const totalAreasCovered = guideData.reduce(
  (n, g) => n + (g.subLocations?.length || 0),
  0,
);
