import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from '@modules/user/user.service';
import { ROLE_ENUM } from '@modules/user/schemas/user.schema';
import { DB_TABLE_NAMES } from '@shared/constants';
import {
  CURRENCY_TYPE,
  LISTING_PURPOSE,
  PRICE_FREQUENCY,
  PROPERTY_STATUS,
  PROPERTY_TYPE,
  PropertyDocument,
} from '@modules/property/schemas/property.schema';

const SEED_IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=900&auto=format&fit=crop',
];

/** Curated nationwide spots so SEO location pages and search resolve real inventory. */
const SEED_SPOTS: { area: string; state: string }[] = [
  { area: 'Lekki Phase 1', state: 'Lagos' },
  { area: 'Ikoyi', state: 'Lagos' },
  { area: 'Gbagada', state: 'Lagos' },
  { area: 'Yaba', state: 'Lagos' },
  { area: 'Ajah', state: 'Lagos' },
  { area: 'Ikeja GRA', state: 'Lagos' },
  { area: 'Surulere', state: 'Lagos' },
  { area: 'Abule Egba', state: 'Lagos' },
  { area: 'Gwarinpa', state: 'Abuja' },
  { area: 'Wuse', state: 'Abuja' },
  { area: 'Maitama', state: 'Abuja' },
  { area: 'Lugbe', state: 'Abuja' },
  { area: 'Port Harcourt', state: 'Rivers' },
  { area: 'GRA Phase 2', state: 'Rivers' },
  { area: 'Bodija', state: 'Oyo' },
  { area: 'Ibadan', state: 'Oyo' },
  { area: 'Abeokuta', state: 'Ogun' },
  { area: 'Magboro', state: 'Ogun' },
  { area: 'Calabar', state: 'Cross River' },
  { area: 'State Housing', state: 'Cross River' },
  { area: 'Marian', state: 'Cross River' },
  { area: 'Ikom', state: 'Cross River' },
  { area: 'Obudu', state: 'Cross River' },
  { area: 'Ogoja', state: 'Cross River' },
  { area: 'Enugu', state: 'Enugu' },
  { area: 'Independence Layout', state: 'Enugu' },
  { area: 'Owerri', state: 'Imo' },
  { area: 'New Owerri', state: 'Imo' },
  { area: 'Uyo', state: 'Akwa Ibom' },
  { area: 'Asaba', state: 'Delta' },
  { area: 'Warri', state: 'Delta' },
  { area: 'Benin City', state: 'Edo' },
  { area: 'Awka', state: 'Anambra' },
  { area: 'Onitsha', state: 'Anambra' },
  { area: 'Aba', state: 'Abia' },
  { area: 'Kano', state: 'Kano' },
  { area: 'Kaduna', state: 'Kaduna' },
  { area: 'Akure', state: 'Ondo' },
  { area: 'Osogbo', state: 'Osun' },
  { area: 'Ado-Ekiti', state: 'Ekiti' },
  { area: 'Ilorin', state: 'Kwara' },
  { area: 'Lokoja', state: 'Kogi' },
  { area: 'Jos', state: 'Plateau' },
  { area: 'Makurdi', state: 'Benue' },
  { area: 'Abakaliki', state: 'Ebonyi' },
  { area: 'Yenagoa', state: 'Bayelsa' },
  { area: 'Minna', state: 'Niger' },
  { area: 'Suleja', state: 'Niger' },
  { area: 'Lafia', state: 'Nasarawa' },
  { area: 'Karu', state: 'Nasarawa' },
  { area: 'Yola', state: 'Adamawa' },
  { area: 'Bauchi', state: 'Bauchi' },
  { area: 'Gombe', state: 'Gombe' },
  { area: 'Maiduguri', state: 'Borno' },
  { area: 'Sokoto', state: 'Sokoto' },
  { area: 'Dutse', state: 'Jigawa' },
  { area: 'Katsina', state: 'Katsina' },
  { area: 'Birnin Kebbi', state: 'Kebbi' },
  { area: 'Jalingo', state: 'Taraba' },
  { area: 'Damaturu', state: 'Yobe' },
  { area: 'Gusau', state: 'Zamfara' },
];

const TYPE_CYCLE = [
  PROPERTY_TYPE.HOUSE,
  PROPERTY_TYPE.FLATS_OR_APARTMENTS,
  PROPERTY_TYPE.HOUSE,
  PROPERTY_TYPE.LAND,
  PROPERTY_TYPE.FLATS_OR_APARTMENTS,
  PROPERTY_TYPE.COMMERCIAL,
  PROPERTY_TYPE.CO_WORKING_SPACE,
];

const PURPOSE_CYCLE = [
  LISTING_PURPOSE.SALE,
  LISTING_PURPOSE.SALE,
  LISTING_PURPOSE.RENT,
  LISTING_PURPOSE.SALE,
  LISTING_PURPOSE.SHORTLET,
];

export async function seedNationwideProperties(app: INestApplication): Promise<void> {
  const propertyModel = app.get<Model<PropertyDocument>>(
    getModelToken(DB_TABLE_NAMES.PROPERTY),
  );
  const userService = app.get(UserService);

  const existingCount = await propertyModel.countDocuments({ isDeleted: { $ne: true } });
  if (existingCount >= 80) {
    // eslint-disable-next-line no-console
    console.log(`[seed] Properties already seeded (${existingCount}) — skip`);
    return;
  }

  let owner = await userService.findOne({ email: 'agent@propertyarena.ng' });
  if (!owner) {
    const { hash } = await import('bcryptjs');
    const password = await hash('Agent123!', 10);
    owner = await userService.createOne({
      email: 'agent@propertyarena.ng',
      name: 'PropertyArena Seed Agent',
      password,
      role: ROLE_ENUM.AGENT,
      isActive: true,
      isEmailVerified: true,
      lastLoggedIn: new Date(),
      loginAttempts: 0,
      promoTrialUsed: false,
    } as never);
  }

  const ownerId = String((owner as { _id?: unknown; id?: unknown })._id || (owner as { id?: unknown }).id);
  const docs = [];

  for (let i = 0; i < SEED_SPOTS.length; i += 1) {
    const spot = SEED_SPOTS[i];
    const purpose = PURPOSE_CYCLE[i % PURPOSE_CYCLE.length];
    const propertyType = TYPE_CYCLE[i % TYPE_CYCLE.length];
    const isLandOrCommercial =
      propertyType === PROPERTY_TYPE.LAND ||
      propertyType === PROPERTY_TYPE.COMMERCIAL ||
      propertyType === PROPERTY_TYPE.CO_WORKING_SPACE;
    const beds = isLandOrCommercial ? undefined : String((i % 5) + 1);
    const price =
      purpose === LISTING_PURPOSE.RENT
        ? 900000 + (i % 18) * 120000
        : purpose === LISTING_PURPOSE.SHORTLET
          ? 35000 + (i % 12) * 7000
          : propertyType === PROPERTY_TYPE.LAND
            ? 12000000 + (i % 25) * 2000000
            : 28000000 + (i % 35) * 6500000;

    const purposeLabel =
      purpose === LISTING_PURPOSE.RENT
        ? 'for Rent'
        : purpose === LISTING_PURPOSE.SHORTLET
          ? 'Short Let'
          : 'for Sale';

    const title = isLandOrCommercial
      ? `${propertyType === PROPERTY_TYPE.LAND ? 'Plot of land' : propertyType === PROPERTY_TYPE.CO_WORKING_SPACE ? 'Co-working space' : 'Commercial space'} in ${spot.area}`
      : `${beds} Bedroom home ${purposeLabel} — ${spot.area}`;

    docs.push({
      title,
      description: `Verified listing in ${spot.area}, ${spot.state}. Browse more homes across Nigeria on PropertyArena.`,
      price,
      currency: CURRENCY_TYPE.NGN,
      priceFrequency:
        purpose === LISTING_PURPOSE.SHORTLET
          ? PRICE_FREQUENCY.PER_DAY
          : purpose === LISTING_PURPOSE.RENT
            ? PRICE_FREQUENCY.PER_YEAR
            : PRICE_FREQUENCY.FULL,
      propertyType,
      listingPurpose: purpose,
      status: PROPERTY_STATUS.AVAILABLE,
      address: `${spot.area}, ${spot.state}, Nigeria`,
      location: `${spot.area}, ${spot.state}`,
      bedroom: beds,
      landArea: isLandOrCommercial ? String(300 + (i % 8) * 50) : String(140 + (i % 6) * 35),
      media: [{ url: SEED_IMAGES[i % SEED_IMAGES.length], type: 'image' }],
      features: ['Verified', 'Nationwide'],
      owner: ownerId,
      isDeleted: false,
      propertyId: `SEED-${String(i + 1).padStart(4, '0')}`,
    });
  }

  // Extra Cross River + Gbagada depth for SEO demos
  const extras = [
    { area: 'Gbagada', state: 'Lagos', purpose: LISTING_PURPOSE.SALE, type: PROPERTY_TYPE.HOUSE, beds: '3' },
    { area: 'Gbagada', state: 'Lagos', purpose: LISTING_PURPOSE.RENT, type: PROPERTY_TYPE.FLATS_OR_APARTMENTS, beds: '2' },
    { area: 'Calabar', state: 'Cross River', purpose: LISTING_PURPOSE.SALE, type: PROPERTY_TYPE.HOUSE, beds: '4' },
    { area: 'Calabar South', state: 'Cross River', purpose: LISTING_PURPOSE.SALE, type: PROPERTY_TYPE.FLATS_OR_APARTMENTS, beds: '3' },
    { area: 'State Housing', state: 'Cross River', purpose: LISTING_PURPOSE.RENT, type: PROPERTY_TYPE.FLATS_OR_APARTMENTS, beds: '2' },
    { area: 'Parliamentary', state: 'Cross River', purpose: LISTING_PURPOSE.SALE, type: PROPERTY_TYPE.HOUSE, beds: '5' },
    { area: 'Ikom', state: 'Cross River', purpose: LISTING_PURPOSE.SALE, type: PROPERTY_TYPE.LAND, beds: undefined },
    { area: 'Obudu', state: 'Cross River', purpose: LISTING_PURPOSE.SHORTLET, type: PROPERTY_TYPE.HOUSE, beds: '3' },
  ];

  extras.forEach((ex, idx) => {
    const i = SEED_SPOTS.length + idx;
    docs.push({
      title: ex.beds
        ? `${ex.beds} Bedroom property in ${ex.area}`
        : `Land for sale in ${ex.area}`,
      description: `Seed listing for ${ex.area}, ${ex.state}.`,
      price: ex.purpose === LISTING_PURPOSE.RENT ? 1500000 : ex.purpose === LISTING_PURPOSE.SHORTLET ? 55000 : 45000000 + idx * 5000000,
      currency: CURRENCY_TYPE.NGN,
      priceFrequency:
        ex.purpose === LISTING_PURPOSE.SHORTLET
          ? PRICE_FREQUENCY.PER_DAY
          : ex.purpose === LISTING_PURPOSE.RENT
            ? PRICE_FREQUENCY.PER_YEAR
            : PRICE_FREQUENCY.FULL,
      propertyType: ex.type,
      listingPurpose: ex.purpose,
      status: PROPERTY_STATUS.AVAILABLE,
      address: `${ex.area}, ${ex.state}, Nigeria`,
      location: `${ex.area}, ${ex.state}`,
      bedroom: ex.beds,
      landArea: '200',
      media: [{ url: SEED_IMAGES[idx % SEED_IMAGES.length], type: 'image' }],
      features: ['Verified'],
      owner: ownerId,
      isDeleted: false,
      propertyId: `SEED-X-${String(i + 1).padStart(3, '0')}`,
    });
  });

  await propertyModel.insertMany(docs);
  // eslint-disable-next-line no-console
  console.log(`[seed] Inserted ${docs.length} nationwide properties`);
}
