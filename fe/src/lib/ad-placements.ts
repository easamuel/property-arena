export type AdPlacement =
  | 'homepage_sidebar'
  | 'homepage_banner'
  | 'homepage_mid'
  | 'listing_sidebar'
  | 'listing_inline'
  | 'search_sidebar'
  | 'search_top'
  | 'requests_sidebar'
  | 'guides_sidebar'
  | 'footer_strip';

export const AD_PLACEMENT_OPTIONS: { value: AdPlacement; label: string }[] = [
  { value: 'homepage_banner', label: 'Homepage — top banner' },
  { value: 'homepage_mid', label: 'Homepage — mid page' },
  { value: 'homepage_sidebar', label: 'Homepage — sidebar' },
  { value: 'search_top', label: 'Search / listings — top' },
  { value: 'search_sidebar', label: 'Search / listings — sidebar' },
  { value: 'listing_sidebar', label: 'Listing detail — sidebar' },
  { value: 'listing_inline', label: 'Listing detail — inline' },
  { value: 'requests_sidebar', label: 'Requests — sidebar' },
  { value: 'guides_sidebar', label: 'Neighbourhood guides — sidebar' },
  { value: 'footer_strip', label: 'Global footer strip' },
];

export const AD_PLACEMENT_VALUES = AD_PLACEMENT_OPTIONS.map((o) => o.value);
