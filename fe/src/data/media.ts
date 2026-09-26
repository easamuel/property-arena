/** Curated residential/commercial photography — Unsplash CDN, wide crops for cards & heroes. */
export const MEDIA = {
  hero:
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop',
  duplex:
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=900&auto=format&fit=crop',
  duplexNight:
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=900&auto=format&fit=crop',
  apartment:
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=900&auto=format&fit=crop',
  apartment2:
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=900&auto=format&fit=crop',
  terrace:
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=900&auto=format&fit=crop',
  bungalow:
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=900&auto=format&fit=crop',
  land:
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=900&auto=format&fit=crop',
  land2:
    'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?q=80&w=900&auto=format&fit=crop',
  office:
    'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=900&auto=format&fit=crop',
  cityLagos:
    'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?q=80&w=900&auto=format&fit=crop',
  citySkyline:
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=900&auto=format&fit=crop',
  interior:
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=900&auto=format&fit=crop',
  pool:
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=900&auto=format&fit=crop',
  kitchen:
    'https://images.unsplash.com/photo-1556912173-46c336c7fd55?q=80&w=900&auto=format&fit=crop',
  street:
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=900&auto=format&fit=crop',
};

export const LISTING_GALLERY = [
  MEDIA.duplex,
  MEDIA.pool,
  MEDIA.interior,
  MEDIA.apartment,
  MEDIA.terrace,
  MEDIA.kitchen,
  MEDIA.bungalow,
  MEDIA.duplexNight,
];

export function galleryAt(i: number) {
  return LISTING_GALLERY[i % LISTING_GALLERY.length];
}
