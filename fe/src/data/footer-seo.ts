import { buildSeoPath } from '@/lib/seo';

export type FooterSeoLink = { label: string; to: string };

/** Crawlable location × purpose links (NPC / PropertyPro footer strategy). */
export const FOOTER_PROPERTIES_FOR_SALE: FooterSeoLink[] = [
  { label: 'Property for sale in Lagos', to: buildSeoPath('for-sale', 'Lagos') },
  { label: 'Property for sale in Abuja', to: buildSeoPath('for-sale', 'Abuja') },
  { label: 'Property for sale in Rivers', to: buildSeoPath('for-sale', 'Rivers') },
  { label: 'Property for sale in Ogun', to: buildSeoPath('for-sale', 'Ogun') },
  { label: 'Property for sale in Oyo', to: buildSeoPath('for-sale', 'Oyo') },
  { label: 'Property for sale in Enugu', to: buildSeoPath('for-sale', 'Enugu') },
  { label: 'Homes for sale in Lekki', to: buildSeoPath('for-sale', 'Lagos', 'Lekki') },
  { label: 'Homes for sale in Ikoyi', to: buildSeoPath('for-sale', 'Lagos', 'Ikoyi') },
  { label: 'Homes for sale in Ajah', to: buildSeoPath('for-sale', 'Lagos', 'Ajah') },
  { label: 'Homes for sale in Ikeja', to: buildSeoPath('for-sale', 'Lagos', 'Ikeja') },
  { label: 'Homes for sale in Gwarinpa', to: buildSeoPath('for-sale', 'Abuja', 'Gwarinpa') },
  { label: 'Homes for sale in Port Harcourt', to: buildSeoPath('for-sale', 'Rivers', 'Port Harcourt') },
];

export const FOOTER_PROPERTIES_FOR_RENT: FooterSeoLink[] = [
  { label: 'Property for rent in Lagos', to: buildSeoPath('for-rent', 'Lagos') },
  { label: 'Property for rent in Abuja', to: buildSeoPath('for-rent', 'Abuja') },
  { label: 'Property for rent in Rivers', to: buildSeoPath('for-rent', 'Rivers') },
  { label: 'Property for rent in Ogun', to: buildSeoPath('for-rent', 'Ogun') },
  { label: 'Flats for rent in Lekki', to: `${buildSeoPath('for-rent', 'Lagos', 'Lekki')}?propertyType=flats` },
  { label: 'Houses for rent in Ikeja', to: `${buildSeoPath('for-rent', 'Lagos', 'Ikeja')}?propertyType=house` },
  { label: 'Flats for rent in Abuja', to: `${buildSeoPath('for-rent', 'Abuja')}?propertyType=flats` },
  { label: 'Houses for rent in Gwarinpa', to: `${buildSeoPath('for-rent', 'Abuja', 'Gwarinpa')}?propertyType=house` },
  { label: 'Property for rent in Victoria Island', to: buildSeoPath('for-rent', 'Lagos', 'Victoria Island') },
  { label: 'Property for rent in Yaba', to: buildSeoPath('for-rent', 'Lagos', 'Yaba') },
];

export const FOOTER_SHORTLET_LAND: FooterSeoLink[] = [
  { label: 'Short let in Lagos', to: buildSeoPath('shortlet', 'Lagos') },
  { label: 'Short let in Lekki', to: buildSeoPath('shortlet', 'Lagos', 'Lekki') },
  { label: 'Short let in Abuja', to: buildSeoPath('shortlet', 'Abuja') },
  { label: 'Short let in Victoria Island', to: buildSeoPath('shortlet', 'Lagos', 'Victoria Island') },
  { label: 'Land for sale in Lagos', to: buildSeoPath('land', 'Lagos') },
  { label: 'Land for sale in Abuja', to: buildSeoPath('land', 'Abuja') },
  { label: 'Land for sale in Ogun', to: buildSeoPath('land', 'Ogun') },
  { label: 'Land for sale in Ajah', to: buildSeoPath('land', 'Lagos', 'Ajah') },
  { label: 'Land for sale in Ibeju Lekki', to: buildSeoPath('land', 'Lagos', 'Ibeju Lekki') },
];

export const FOOTER_POPULAR_TYPES: FooterSeoLink[] = [
  { label: 'Houses for sale', to: '/properties?purpose=sale&propertyType=house&location=Nigeria' },
  { label: 'Flats & apartments for sale', to: '/properties?purpose=sale&propertyType=flats&location=Nigeria' },
  { label: 'Duplexes for sale', to: '/properties?purpose=sale&propertyType=duplex&location=Nigeria' },
  { label: 'Commercial property for sale', to: '/properties?purpose=sale&propertyType=commercial&location=Nigeria' },
  { label: 'Houses for rent', to: '/properties?purpose=rent&propertyType=house&location=Nigeria' },
  { label: 'Flats for rent', to: '/properties?purpose=rent&propertyType=flats&location=Nigeria' },
  { label: 'Self contain for rent', to: '/properties?purpose=rent&propertyType=self+contain&location=Nigeria' },
  { label: 'Mini flats for rent', to: '/properties?purpose=rent&propertyType=mini+flat&location=Nigeria' },
];

export const FOOTER_POPULAR_AREAS: FooterSeoLink[] = [
  { label: 'Lekki Phase 1', to: buildSeoPath('for-sale', 'Lagos', 'Lekki Phase 1') },
  { label: 'Ikoyi', to: buildSeoPath('for-sale', 'Lagos', 'Ikoyi') },
  { label: 'Ajah', to: buildSeoPath('for-sale', 'Lagos', 'Ajah') },
  { label: 'Ikeja GRA', to: buildSeoPath('for-sale', 'Lagos', 'Ikeja') },
  { label: 'Ajegunle', to: buildSeoPath('for-sale', 'Lagos', 'Ajegunle') },
  { label: 'Surulere', to: buildSeoPath('for-rent', 'Lagos', 'Surulere') },
  { label: 'Magodo', to: buildSeoPath('for-sale', 'Lagos', 'Magodo') },
  { label: 'Gwarinpa', to: buildSeoPath('for-sale', 'Abuja', 'Gwarinpa') },
  { label: 'Maitama', to: buildSeoPath('for-sale', 'Abuja', 'Maitama') },
  { label: 'Wuse 2', to: buildSeoPath('for-rent', 'Abuja', 'Wuse 2') },
  { label: 'Trans Amadi', to: buildSeoPath('for-sale', 'Rivers', 'Trans Amadi') },
  { label: 'Bodija', to: buildSeoPath('for-sale', 'Oyo', 'Bodija') },
  { label: 'Neighbourhood guides', to: '/neighbourhood' },
];
