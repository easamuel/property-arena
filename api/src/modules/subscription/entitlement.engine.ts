import { HttpStatus, Injectable } from '@nestjs/common';
import { CustomHttpException } from '@shared/exception.handler';
import { FEATURE_KEY } from './schemas/subscription-feature.schema';
import {
  SUBSCRIPTION_STATUS,
  Subscription,
} from './schemas/subscription.schema';
import { SubscriptionDAL } from './dals/subscription.dal';
import { SubscriptionFeatureDAL } from './dals/subscription-feature.dal';
import { SubscriptionUsageDAL } from './dals/subscription-usage.dal';
import { SubscriptionEventDAL } from './dals/subscription-event.dal';
import { SUBSCRIPTION_EVENT_TYPE } from './schemas/subscription-event.schema';
import { UserService } from '@modules/user/user.service';
import { ROLE_ENUM } from '@modules/user/schemas/user.schema';

/** Statuses that unlock plan entitlements (including grace). */
export const ENTITLED_STATUSES: SUBSCRIPTION_STATUS[] = [
  SUBSCRIPTION_STATUS.TRIAL,
  SUBSCRIPTION_STATUS.ACTIVE,
  SUBSCRIPTION_STATUS.GRACE_PERIOD,
];

export type EntitlementActionKey =
  | 'active_listings'
  | 'featured_listings'
  | 'lead_access'
  | 'property_requests';

const ACTION_TO_FEATURE: Record<EntitlementActionKey, FEATURE_KEY> = {
  active_listings: FEATURE_KEY.MAX_LISTINGS,
  featured_listings: FEATURE_KEY.MAX_FEATURED_LISTINGS,
  lead_access: FEATURE_KEY.MAX_LEADS_PER_MONTH,
  property_requests: FEATURE_KEY.MAX_PROPERTY_REQUESTS_PER_MONTH,
};

export interface EntitlementResult {
  allowed: true;
  subscription: Subscription;
  featureKey: FEATURE_KEY;
  limit: number;
  currentUsage: number;
  remaining: number;
}

/**
 * Canonical gatekeeper: domain modules MUST call this instead of reading
 * raw payment / subscription fields to decide access.
 */
@Injectable()
export class EntitlementEngine {
  constructor(
    private readonly subscriptionDAL: SubscriptionDAL,
    private readonly subscriptionFeatureDAL: SubscriptionFeatureDAL,
    private readonly subscriptionUsageDAL: SubscriptionUsageDAL,
    private readonly subscriptionEventDAL: SubscriptionEventDAL,
    private readonly userService: UserService,
  ) {}

  async canPerformAction(
    userId: string,
    actionKey: EntitlementActionKey,
    quantity = 1,
  ): Promise<EntitlementResult> {
    const user = await this.userService.findOne({ _id: userId });
    if (user?.role === ROLE_ENUM.ADMIN) {
      return {
        allowed: true,
        subscription: { _id: 'admin', user: userId } as Subscription,
        featureKey: ACTION_TO_FEATURE[actionKey],
        limit: -1,
        currentUsage: 0,
        remaining: -1,
      };
    }

    const subscription = await this.subscriptionDAL.findOne({
      user: userId,
      status: { in: ENTITLED_STATUSES },
    });

    if (!subscription) {
      throw new CustomHttpException(
        'Active subscription required to perform this action.',
        HttpStatus.FORBIDDEN,
      );
    }

    const featureKey = ACTION_TO_FEATURE[actionKey];
    const planFeature = await this.subscriptionFeatureDAL.findOne({
      plan: subscription.plan,
      featureKey,
    });

    if (!planFeature) {
      throw new CustomHttpException(
        `Your current plan does not include access to ${actionKey}.`,
        HttpStatus.FORBIDDEN,
      );
    }

    const limit = Number(planFeature.value);
    const periodStart =
      subscription.currentPeriodStart ?? subscription.createdAt ?? new Date();
    const periodEnd =
      subscription.currentPeriodEnd ??
      new Date(periodStart.getTime() + 30 * 24 * 60 * 60 * 1000);

    const currentUsage = await this.getUsageCount(
      String(subscription._id),
      featureKey,
      periodStart,
      periodEnd,
    );

    // -1 means unlimited
    if (limit !== -1 && currentUsage + quantity > limit) {
      await this.subscriptionEventDAL.create({
        subscription: subscription._id,
        eventType: SUBSCRIPTION_EVENT_TYPE.LIMIT_EXCEEDED,
        payload: {
          actionKey,
          featureKey,
          limit,
          currentUsage,
          quantity,
        },
      } as never);

      throw new CustomHttpException(
        `You have reached your limit of ${limit} for ${actionKey}. Upgrade to unlock more.`,
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    return {
      allowed: true,
      subscription,
      featureKey,
      limit,
      currentUsage,
      remaining: limit === -1 ? -1 : Math.max(0, limit - currentUsage),
    };
  }

  async consumeQuota(
    userId: string,
    actionKey: EntitlementActionKey,
    quantity = 1,
  ): Promise<EntitlementResult> {
    const result = await this.canPerformAction(userId, actionKey, quantity);
    if (String(result.subscription._id) === 'admin') {
      return result;
    }
    const periodStart =
      result.subscription.currentPeriodStart ??
      result.subscription.createdAt ??
      new Date();
    const periodEnd =
      result.subscription.currentPeriodEnd ??
      new Date(periodStart.getTime() + 30 * 24 * 60 * 60 * 1000);

    await this.incrementUsage(
      userId,
      String(result.subscription._id),
      result.featureKey,
      periodStart,
      periodEnd,
      quantity,
    );

    return {
      ...result,
      currentUsage: result.currentUsage + quantity,
      remaining:
        result.limit === -1
          ? -1
          : Math.max(0, result.limit - (result.currentUsage + quantity)),
    };
  }

  async releaseQuota(
    userId: string,
    actionKey: EntitlementActionKey,
    quantity = 1,
  ): Promise<void> {
    const result = await this.canPerformAction(userId, actionKey, 0);
    const periodStart =
      result.subscription.currentPeriodStart ??
      result.subscription.createdAt ??
      new Date();
    const periodEnd =
      result.subscription.currentPeriodEnd ??
      new Date(periodStart.getTime() + 30 * 24 * 60 * 60 * 1000);
    await this.incrementUsage(
      userId,
      String(result.subscription._id),
      result.featureKey,
      periodStart,
      periodEnd,
      -Math.abs(quantity),
    );
  }

  async getUsageCount(
    subscriptionId: string,
    featureKey: FEATURE_KEY,
    periodStart: Date,
    periodEnd: Date,
  ): Promise<number> {
    const row = await this.subscriptionUsageDAL.findOne({
      subscription: subscriptionId,
      featureKey,
      periodStart,
      periodEnd,
    });
    return row?.usageCount ?? 0;
  }

  async incrementUsage(
    userId: string,
    subscriptionId: string,
    featureKey: FEATURE_KEY,
    periodStart: Date,
    periodEnd: Date,
    by = 1,
  ): Promise<void> {
    const existing = await this.subscriptionUsageDAL.findOne({
      subscription: subscriptionId,
      featureKey,
      periodStart,
      periodEnd,
    });

    if (existing) {
      await this.subscriptionUsageDAL.updateOne(
        { _id: existing._id },
        undefined,
        undefined,
        undefined,
        { usageCount: by },
      );
      return;
    }

    await this.subscriptionUsageDAL.create({
      user: userId,
      subscription: subscriptionId,
      featureKey,
      usageCount: by,
      periodStart,
      periodEnd,
    } as never);
  }

  async resetUsageForPeriod(
    userId: string,
    subscriptionId: string,
    periodStart: Date,
    periodEnd: Date,
  ): Promise<void> {
    const keys = Object.values(FEATURE_KEY);
    for (const featureKey of keys) {
      const existing = await this.subscriptionUsageDAL.findOne({
        subscription: subscriptionId,
        featureKey,
        periodStart,
        periodEnd,
      });
      if (existing) {
        continue;
      }
      await this.subscriptionUsageDAL.create({
        user: userId,
        subscription: subscriptionId,
        featureKey,
        usageCount: 0,
        periodStart,
        periodEnd,
      } as never);
    }
  }
}
