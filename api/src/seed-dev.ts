import { INestApplication } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from '@modules/user/user.service';
import { ROLE_ENUM } from '@modules/user/schemas/user.schema';
import { SubscriptionPlanDAL } from '@modules/subscription/dals/subscription-plan.dal';
import { SubscriptionFeatureDAL } from '@modules/subscription/dals/subscription-feature.dal';
import { FEATURE_KEY } from '@modules/subscription/schemas/subscription-feature.schema';
import { PLAN_USER_TYPE } from '@modules/subscription/schemas/subscription-plan.schema';
import { DB_TABLE_NAMES } from '@shared/constants';
import { PlatformRecordDocument } from '@modules/platform/schemas/platform-record.schema';

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@propertyarena.ng';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';

const CMS_PAGES = [
  { slug: 'about', title: 'About PropertyArena', status: 'published', body: "Nigeria's property marketplace — verified listings, neighbourhood guides, and request matching." },
  { slug: 'careers', title: 'Careers', status: 'published', body: 'Email careers@propertyarena.ng with your CV.' },
  { slug: 'contact', title: 'Contact Us', status: 'published', body: 'support@propertyarena.ng' },
  { slug: 'help', title: 'Help Center', status: 'published', body: 'Use Forgot password, Post Property, and Request a Property from the main site.' },
  { slug: 'terms', title: 'Terms of Use', status: 'published', body: 'List accurately and follow Nigerian law. Fraudulent accounts may be suspended.' },
  { slug: 'privacy', title: 'Privacy Policy', status: 'published', body: 'We do not sell personal data. privacy@propertyarena.ng' },
  { slug: 'cookies', title: 'Cookie Policy', status: 'published', body: 'Essential cookies for auth and theme preferences.' },
];

const CMS_ARTICLES = [
  {
    slug: 'buying-guide-nigeria',
    title: 'Complete Guide to Buying Property in Nigeria',
    tag: 'Buying Guide',
    status: 'published',
    readMinutes: 5,
    coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop',
    body: 'Budget, location, title checks, and inspection — the essentials before you buy.',
  },
  {
    slug: 'investment-hotspots',
    title: 'Top Real Estate Investment Hotspots',
    tag: 'Investment',
    status: 'published',
    readMinutes: 6,
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop',
    body: 'Lagos corridor, Abuja growth districts, and Port Harcourt residential pockets.',
  },
  {
    slug: 'land-documentation',
    title: 'Land Documentation Process Explained',
    tag: 'Legal',
    status: 'published',
    readMinutes: 4,
    coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop',
    body: 'Survey plan, deed of assignment, consent/C of O, stamping and registration.',
  },
  {
    slug: 'market-outlook-2026',
    title: '2026 Real Estate Market Outlook',
    tag: 'Trends',
    status: 'published',
    readMinutes: 5,
    coverImage: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&auto=format&fit=crop',
    body: 'Mid-market apartments and short-let demand remain strong in major cities.',
  },
];

/** Promotions: status must be Active/published for public AdSlot reads. */
const CMS_PROMOS = [
  {
    slug: 'home-banner-1',
    title: 'Featured homes this week',
    status: 'Active',
    placement: 'homepage_banner',
    ctaLabel: 'Browse for sale',
    ctaUrl: '/for-sale/in/lagos',
    imageUrl:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    body: 'Duplexes and apartments from verified agents.',
  },
  {
    slug: 'home-sidebar-1',
    title: 'List with PropertyArena',
    status: 'Active',
    placement: 'homepage_sidebar',
    ctaLabel: 'Post a property',
    ctaUrl: '/create-property',
    imageUrl:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80',
    body: 'Reach serious buyers across Nigeria.',
  },
  {
    slug: 'home-mid-1',
    title: 'Arena Select agents',
    status: 'Active',
    placement: 'homepage_mid',
    ctaLabel: 'See plans',
    ctaUrl: '/subscription',
    imageUrl:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80',
    body: 'Gold badge · priority ranking · more leads.',
  },
  {
    slug: 'search-sidebar-1',
    title: 'Land deals in Abule Egba',
    status: 'Active',
    placement: 'search_sidebar',
    ctaLabel: 'View land',
    ctaUrl: '/land/in/lagos/abule-egba',
    imageUrl:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80',
    body: 'Plots verified for title readiness.',
  },
  {
    slug: 'listing-sidebar-1',
    title: 'Need a mortgage intro?',
    status: 'Active',
    placement: 'listing_sidebar',
    ctaLabel: 'Talk to us',
    ctaUrl: '/contact',
    imageUrl:
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
    body: 'Partner lenders for qualified buyers.',
  },
  {
    slug: 'requests-sidebar-1',
    title: 'Agents: browse open requests',
    status: 'Active',
    placement: 'requests_sidebar',
    ctaLabel: 'Open requests',
    ctaUrl: '/requests',
    imageUrl:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80',
    body: 'Respond to buyer briefs and win leads.',
  },
];

export async function seedDevData(app: INestApplication): Promise<void> {
  const userService = app.get(UserService);
  const planDal = app.get(SubscriptionPlanDAL);
  const featureDal = app.get(SubscriptionFeatureDAL);
  const platform = app.get<Model<PlatformRecordDocument>>(
    getModelToken(DB_TABLE_NAMES.PLATFORM),
  );

  const existingAdmin = await userService.findOne({ email: ADMIN_EMAIL });
  if (!existingAdmin) {
    const password = await hash(ADMIN_PASSWORD, 10);
    await userService.createOne({
      email: ADMIN_EMAIL,
      name: 'PropertyArena Admin',
      password,
      role: ROLE_ENUM.ADMIN,
      isActive: true,
      isEmailVerified: true,
      lastLoggedIn: new Date(),
      loginAttempts: 0,
      promoTrialUsed: false,
    } as never);
    // eslint-disable-next-line no-console
    console.log(`[seed] Admin ready → ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  }

  const planDefs = [
    {
      name: 'Agent Starter',
      slug: 'agent-starter',
      userType: PLAN_USER_TYPE.AGENT,
      description: 'First-month free starter for individual agents',
      monthlyPrice: 1000000,
      yearlyPrice: 10000000,
      trialDays: 30,
      listings: 5,
      featured: 1,
    },
    {
      name: 'Agent Growth',
      slug: 'agent-growth',
      userType: PLAN_USER_TYPE.AGENT,
      description: 'More listings and featured slots for growing agents',
      monthlyPrice: 2500000,
      yearlyPrice: 25000000,
      trialDays: 30,
      listings: 15,
      featured: 3,
    },
    {
      name: 'Developer Pro',
      slug: 'developer-pro',
      userType: PLAN_USER_TYPE.DEVELOPER,
      description: 'For property developers and project marketers',
      monthlyPrice: 5000000,
      yearlyPrice: 50000000,
      trialDays: 30,
      listings: 50,
      featured: 10,
    },
    {
      name: 'Landlord Basic',
      slug: 'landlord-basic',
      userType: PLAN_USER_TYPE.LANDLORD,
      description: 'For landlords listing rentals and sales',
      monthlyPrice: 800000,
      yearlyPrice: 8000000,
      trialDays: 30,
      listings: 3,
      featured: 1,
    },
  ];

  for (const def of planDefs) {
    const existing = await planDal.findOne({ slug: def.slug });
    if (existing) continue;
    const plan = (await planDal.create({
      name: def.name,
      slug: def.slug,
      userType: def.userType,
      description: def.description,
      monthlyPrice: def.monthlyPrice,
      yearlyPrice: def.yearlyPrice,
      currency: 'NGN',
      trialDays: def.trialDays,
      isActive: true,
      sortOrder: 1,
    } as never)) as { _id: string };

    const planId = String(plan._id);

    await Promise.all([
      featureDal.create({
        plan: planId,
        featureKey: FEATURE_KEY.MAX_LISTINGS,
        value: def.listings,
      } as never),
      featureDal.create({
        plan: planId,
        featureKey: FEATURE_KEY.MAX_FEATURED_LISTINGS,
        value: def.featured,
      } as never),
      featureDal.create({
        plan: planId,
        featureKey: FEATURE_KEY.FEATURED_DURATION_DAYS,
        value: 7,
      } as never),
      featureDal.create({
        plan: planId,
        featureKey: FEATURE_KEY.MAX_LEADS_PER_MONTH,
        value: 50,
      } as never),
      featureDal.create({
        plan: planId,
        featureKey: FEATURE_KEY.MAX_PROPERTY_REQUESTS_PER_MONTH,
        value: 20,
      } as never),
      featureDal.create({
        plan: planId,
        featureKey: FEATURE_KEY.PRIORITY_RANK,
        value: 10,
      } as never),
    ]);
  }

  const upsertCms = async (kind: string, items: Record<string, unknown>[]) => {
    for (const data of items) {
      const slug = String(data.slug || '');
      const existing = await platform.findOne({ kind, 'data.slug': slug }).exec();
      if (existing) continue;
      await platform.create({ kind, data });
    }
  };

  await upsertCms('page', CMS_PAGES);
  await upsertCms('article', CMS_ARTICLES);
  await upsertCms('promotion', CMS_PROMOS);
  // eslint-disable-next-line no-console
  console.log('[seed] CMS pages, articles, promotions ready');
}
