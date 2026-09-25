import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { SubscriptionPlanDAL } from '@modules/subscription/dals/subscription-plan.dal';
import { SubscriptionFeatureDAL } from '@modules/subscription/dals/subscription-feature.dal';
import { PLAN_USER_TYPE } from '@modules/subscription/schemas/subscription-plan.schema';
import { FEATURE_KEY } from '@modules/subscription/schemas/subscription-feature.schema';

// Prices are in kobo (smallest NGN unit): ₦1 = 100 kobo.
const PLAN_SEEDS = [
  {
    name: 'Landlord Starter',
    slug: 'landlord-starter',
    userType: PLAN_USER_TYPE.LANDLORD,
    description: 'For landlords listing a handful of properties.',
    monthlyPrice: 250_000,
    yearlyPrice: 2_500_000,
    trialDays: 30,
    sortOrder: 1,
    features: {
      [FEATURE_KEY.MAX_LISTINGS]: 5,
      [FEATURE_KEY.MAX_FEATURED_LISTINGS]: 1,
      [FEATURE_KEY.FEATURED_DURATION_DAYS]: 7,
      [FEATURE_KEY.MAX_LEADS_PER_MONTH]: 20,
      [FEATURE_KEY.MAX_PROPERTY_REQUESTS_PER_MONTH]: 10,
      [FEATURE_KEY.PRIORITY_RANK]: 1,
    },
  },
  {
    name: 'Landlord Pro',
    slug: 'landlord-pro',
    userType: PLAN_USER_TYPE.LANDLORD,
    description: 'For landlords managing a growing portfolio.',
    monthlyPrice: 600_000,
    yearlyPrice: 6_000_000,
    trialDays: 30,
    sortOrder: 2,
    features: {
      [FEATURE_KEY.MAX_LISTINGS]: 20,
      [FEATURE_KEY.MAX_FEATURED_LISTINGS]: 3,
      [FEATURE_KEY.FEATURED_DURATION_DAYS]: 14,
      [FEATURE_KEY.MAX_LEADS_PER_MONTH]: 100,
      [FEATURE_KEY.MAX_PROPERTY_REQUESTS_PER_MONTH]: 50,
      [FEATURE_KEY.PRIORITY_RANK]: 2,
    },
  },
  {
    name: 'Agent Starter',
    slug: 'agent-starter',
    userType: PLAN_USER_TYPE.AGENT,
    description: 'For independent agents just getting started.',
    monthlyPrice: 500_000,
    yearlyPrice: 5_000_000,
    trialDays: 30,
    sortOrder: 3,
    features: {
      [FEATURE_KEY.MAX_LISTINGS]: 15,
      [FEATURE_KEY.MAX_FEATURED_LISTINGS]: 2,
      [FEATURE_KEY.FEATURED_DURATION_DAYS]: 7,
      [FEATURE_KEY.MAX_LEADS_PER_MONTH]: 50,
      [FEATURE_KEY.MAX_PROPERTY_REQUESTS_PER_MONTH]: 30,
      [FEATURE_KEY.PRIORITY_RANK]: 2,
    },
  },
  {
    name: 'Agent Pro',
    slug: 'agent-pro',
    userType: PLAN_USER_TYPE.AGENT,
    description: 'For active agents closing deals every month.',
    monthlyPrice: 1_200_000,
    yearlyPrice: 12_000_000,
    trialDays: 30,
    sortOrder: 4,
    features: {
      [FEATURE_KEY.MAX_LISTINGS]: 50,
      [FEATURE_KEY.MAX_FEATURED_LISTINGS]: 5,
      [FEATURE_KEY.FEATURED_DURATION_DAYS]: 14,
      [FEATURE_KEY.MAX_LEADS_PER_MONTH]: 200,
      [FEATURE_KEY.MAX_PROPERTY_REQUESTS_PER_MONTH]: 150,
      [FEATURE_KEY.PRIORITY_RANK]: 3,
    },
  },
  {
    name: 'Agent Elite',
    slug: 'agent-elite',
    userType: PLAN_USER_TYPE.AGENT,
    description: 'For top-performing agents and small teams.',
    monthlyPrice: 2_500_000,
    yearlyPrice: 25_000_000,
    trialDays: 30,
    sortOrder: 5,
    features: {
      [FEATURE_KEY.MAX_LISTINGS]: 150,
      [FEATURE_KEY.MAX_FEATURED_LISTINGS]: 10,
      [FEATURE_KEY.FEATURED_DURATION_DAYS]: 21,
      [FEATURE_KEY.MAX_LEADS_PER_MONTH]: -1,
      [FEATURE_KEY.MAX_PROPERTY_REQUESTS_PER_MONTH]: -1,
      [FEATURE_KEY.PRIORITY_RANK]: 4,
    },
  },
  {
    name: 'Developer Growth',
    slug: 'developer-growth',
    userType: PLAN_USER_TYPE.DEVELOPER,
    description: 'For developers launching multiple projects.',
    monthlyPrice: 2_000_000,
    yearlyPrice: 20_000_000,
    trialDays: 30,
    sortOrder: 6,
    features: {
      [FEATURE_KEY.MAX_LISTINGS]: 100,
      [FEATURE_KEY.MAX_FEATURED_LISTINGS]: 8,
      [FEATURE_KEY.FEATURED_DURATION_DAYS]: 21,
      [FEATURE_KEY.MAX_LEADS_PER_MONTH]: 300,
      [FEATURE_KEY.MAX_PROPERTY_REQUESTS_PER_MONTH]: 200,
      [FEATURE_KEY.PRIORITY_RANK]: 3,
    },
  },
  {
    name: 'Developer Enterprise',
    slug: 'developer-enterprise',
    userType: PLAN_USER_TYPE.DEVELOPER,
    description: 'For large-scale developers with unlimited listing needs.',
    monthlyPrice: 5_000_000,
    yearlyPrice: 50_000_000,
    trialDays: 30,
    sortOrder: 7,
    features: {
      [FEATURE_KEY.MAX_LISTINGS]: -1,
      [FEATURE_KEY.MAX_FEATURED_LISTINGS]: 20,
      [FEATURE_KEY.FEATURED_DURATION_DAYS]: 30,
      [FEATURE_KEY.MAX_LEADS_PER_MONTH]: -1,
      [FEATURE_KEY.MAX_PROPERTY_REQUESTS_PER_MONTH]: -1,
      [FEATURE_KEY.PRIORITY_RANK]: 5,
    },
  },
];

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });

  const subscriptionPlanDAL = app.get(SubscriptionPlanDAL, { strict: false });
  const subscriptionFeatureDAL = app.get(SubscriptionFeatureDAL, {
    strict: false,
  });

  for (const seedPlan of PLAN_SEEDS) {
    const { features, ...planFields } = seedPlan;

    let plan = await subscriptionPlanDAL.findOne({ slug: seedPlan.slug });

    if (plan) {
      plan = await subscriptionPlanDAL.updateOne({ _id: plan._id }, {
        ...planFields,
        isActive: true,
      } as never);
      console.log(`Updated plan: ${seedPlan.name}`);
    } else {
      plan = await subscriptionPlanDAL.create({
        ...planFields,
        isActive: true,
      } as never);
      console.log(`Created plan: ${seedPlan.name}`);
    }

    await subscriptionFeatureDAL.deleteMany({ plan: plan._id });
    await Promise.all(
      Object.entries(features).map(([featureKey, value]) =>
        subscriptionFeatureDAL.create({
          plan: plan._id,
          featureKey: featureKey as FEATURE_KEY,
          value,
        } as never),
      ),
    );
  }

  console.log(`Seeded ${PLAN_SEEDS.length} subscription plans.`);
  await app.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Failed to seed subscription plans:', err);
  process.exit(1);
});
