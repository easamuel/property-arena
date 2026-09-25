import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import * as moment from 'moment';
import { Logger } from 'winston';
import { LOGGER, QUEUE_NAMES } from '@shared/constants';
import { SubscriptionDAL } from '@modules/subscription/dals/subscription.dal';
import { SubscriptionPlanDAL } from '@modules/subscription/dals/subscription-plan.dal';
import { SubscriptionTransactionDAL } from '@modules/subscription/dals/subscription-transaction.dal';
import { SubscriptionEventDAL } from '@modules/subscription/dals/subscription-event.dal';
import { EntitlementEngine } from '@modules/subscription/entitlement.engine';
import {
  BILLING_CYCLE,
  PAYMENT_GATEWAY_NAME,
  SUBSCRIPTION_STATUS,
  Subscription,
} from '@modules/subscription/schemas/subscription.schema';
import { SUBSCRIPTION_EVENT_TYPE } from '@modules/subscription/schemas/subscription-event.schema';
import {
  SUBSCRIPTION_TRANSACTION_STATUS,
  SubscriptionTransaction,
} from '@modules/subscription/schemas/subscription-transaction.schema';
import { PAYMENT_GATEWAY } from '@modules/payment/payment.constants';
import { PaymentGatewayService } from '@modules/payment/interfaces/payment-gateway.interface';
import { PropertyDAL } from '@modules/property/dals/property.dal';
import { FEATURED_STATUS } from '@modules/property/schemas/property.schema';
import { UserService } from '@modules/user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DB_TABLE_NAMES } from '@shared/constants';
import numberStringGenerator from '@shared/numberStringGenerator';

@Injectable()
export class BillingSchedulerService implements OnModuleInit {
  private readonly logger: Logger;

  constructor(
    @InjectQueue(QUEUE_NAMES.BILLING_REMINDER)
    private readonly reminderQueue: Queue,
    @InjectQueue(QUEUE_NAMES.SUBSCRIPTION_RENEWAL)
    private readonly renewalQueue: Queue,
    @InjectQueue(QUEUE_NAMES.GRACE_PERIOD_EXPIRY)
    private readonly graceQueue: Queue,
    @InjectQueue(QUEUE_NAMES.USAGE_QUOTA_RESET)
    private readonly usageQueue: Queue,
    @Inject(LOGGER) logger: Logger,
  ) {
    this.logger = logger.child({ service: BillingSchedulerService.name });
  }

  async onModuleInit() {
    // Repeatable jobs (UTC+1 ≈ Africa/Lagos). Cron is in server local/UTC;
    // 07:00 UTC ≈ 08:00 WAT for reminders; midnight WAT = 23:00 UTC prior day.
    await this.reminderQueue.add(
      'daily-reminders',
      {},
      {
        repeat: { pattern: '0 7 * * *' },
        jobId: 'billing-reminder-daily',
        removeOnComplete: 100,
      },
    );
    await this.renewalQueue.add(
      'renewal-sweep',
      {},
      {
        repeat: { every: 6 * 60 * 60 * 1000 },
        jobId: 'subscription-renewal-6h',
        removeOnComplete: 100,
      },
    );
    await this.graceQueue.add(
      'grace-expiry',
      {},
      {
        repeat: { every: 60 * 60 * 1000 },
        jobId: 'grace-period-hourly',
        removeOnComplete: 100,
      },
    );
    await this.usageQueue.add(
      'usage-reset',
      {},
      {
        repeat: { pattern: '0 23 * * *' },
        jobId: 'usage-quota-reset-daily',
        removeOnComplete: 100,
      },
    );
    this.logger.info('Billing repeatable jobs registered');
  }
}

@Processor(QUEUE_NAMES.BILLING_REMINDER)
export class BillingReminderProcessor extends WorkerHost {
  private readonly logger: Logger;

  constructor(
    private readonly subscriptionDAL: SubscriptionDAL,
    @InjectModel(DB_TABLE_NAMES.NOTIFICATION)
    private readonly notificationModel: Model<any>,
    private readonly subscriptionEventDAL: SubscriptionEventDAL,
    @Inject(LOGGER) logger: Logger,
  ) {
    super();
    this.logger = logger.child({ service: BillingReminderProcessor.name });
  }

  async process(_job: Job): Promise<void> {
    const now = moment();
    const in24h = moment().add(24, 'hours');
    const in3d = moment().add(3, 'days');

    const subscriptions = await this.subscriptionDAL.find({
      status: {
        in: [SUBSCRIPTION_STATUS.ACTIVE, SUBSCRIPTION_STATUS.TRIAL],
      },
    });

    for (const sub of subscriptions) {
      if (!sub.currentPeriodEnd) continue;
      const end = moment(sub.currentPeriodEnd);
      if (end.isBefore(in24h) || end.isAfter(in3d)) continue;

      await this.notificationModel.create({
        user: sub.user,
        title: 'Subscription renewal reminder',
        body: `Your Property Arena subscription renews on ${end.format('DD MMM YYYY')}.`,
        channel: 'IN_APP',
        metadata: { subscriptionId: String(sub._id) },
      });

      await this.subscriptionEventDAL.create({
        subscription: sub._id,
        eventType: SUBSCRIPTION_EVENT_TYPE.REMINDER_SENT,
        payload: { currentPeriodEnd: sub.currentPeriodEnd },
      } as never);

      this.logger.info('Billing reminder sent', {
        subscriptionId: String(sub._id),
        userId: String(sub.user),
      });
    }
  }
}

@Processor(QUEUE_NAMES.SUBSCRIPTION_RENEWAL)
export class SubscriptionRenewalProcessor extends WorkerHost {
  private readonly logger: Logger;

  constructor(
    private readonly subscriptionDAL: SubscriptionDAL,
    private readonly subscriptionPlanDAL: SubscriptionPlanDAL,
    private readonly subscriptionTransactionDAL: SubscriptionTransactionDAL,
    private readonly subscriptionEventDAL: SubscriptionEventDAL,
    private readonly entitlementEngine: EntitlementEngine,
    private readonly userService: UserService,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayService,
    @Inject(LOGGER) logger: Logger,
  ) {
    super();
    this.logger = logger.child({ service: SubscriptionRenewalProcessor.name });
  }

  async process(_job: Job): Promise<void> {
    const now = new Date();
    const due = await this.subscriptionDAL.find({
      autoRenewal: true,
      status: {
        in: [SUBSCRIPTION_STATUS.ACTIVE, SUBSCRIPTION_STATUS.PAST_DUE],
      },
    });

    for (const sub of due) {
      const billingDate = sub.nextBillingDate || sub.currentPeriodEnd;
      if (!billingDate || moment(billingDate).isAfter(now)) continue;
      if (!sub.gatewayAuthorizationCode) {
        this.logger.warn('Skipping renewal — no authorization on file', {
          subscriptionId: String(sub._id),
        });
        await this.enterGrace(sub);
        continue;
      }

      if (!this.paymentGateway.chargeAuthorization) {
        this.logger.warn('Gateway does not support chargeAuthorization');
        continue;
      }

      const plan = await this.subscriptionPlanDAL.findOne({ _id: sub.plan });
      if (!plan) continue;

      const amountKobo =
        sub.billingCycle === BILLING_CYCLE.YEARLY
          ? plan.yearlyPrice
          : plan.monthlyPrice;

      const user = await this.userService.findOne({ _id: sub.user });
      if (!user?.email) continue;

      const reference = `PA-REN-${Date.now()}-${numberStringGenerator({
        characterLength: 6,
        outputOption: 'alphanumeric',
        isCapitalized: true,
      })}`;

      const tx = await this.subscriptionTransactionDAL.create({
        user: sub.user,
        subscription: sub._id,
        plan: plan._id,
        billingCycle: sub.billingCycle,
        amount: amountKobo,
        currency: plan.currency,
        reference,
        gateway: sub.gateway || PAYMENT_GATEWAY_NAME.PAYSTACK,
        status: SUBSCRIPTION_TRANSACTION_STATUS.PENDING,
      } as SubscriptionTransaction);

      try {
        const charge = await this.paymentGateway.chargeAuthorization({
          authorizationCode: sub.gatewayAuthorizationCode,
          email: user.email,
          amountKobo,
          reference,
          metadata: { subscriptionId: String(sub._id), renewal: true },
        });

        if (charge.status !== 'success') {
          throw new Error('Charge did not succeed');
        }

        const periodStart = new Date();
        const periodEnd =
          sub.billingCycle === BILLING_CYCLE.YEARLY
            ? moment(periodStart).add(1, 'year').toDate()
            : moment(periodStart).add(1, 'month').toDate();

        await this.subscriptionTransactionDAL.updateOne(
          { _id: tx._id },
          {
            status: SUBSCRIPTION_TRANSACTION_STATUS.SUCCESS,
            gatewayReference: charge.gatewayReference,
            paidAt: new Date(),
            rawGatewayResponse: charge.raw,
          },
        );

        await this.subscriptionDAL.updateOne(
          { _id: sub._id },
          {
            status: SUBSCRIPTION_STATUS.ACTIVE,
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
            nextBillingDate: periodEnd,
            gracePeriodEnd: undefined,
            renewalRetryCount: 0,
            lastTransaction: tx._id,
            gatewayAuthorizationCode:
              charge.authorizationCode || sub.gatewayAuthorizationCode,
          },
        );

        await this.entitlementEngine.resetUsageForPeriod(
          String(sub.user),
          String(sub._id),
          periodStart,
          periodEnd,
        );

        await this.subscriptionEventDAL.create({
          subscription: sub._id,
          eventType: SUBSCRIPTION_EVENT_TYPE.RENEWAL_SUCCEEDED,
          payload: { reference },
        } as never);

        this.logger.info('Subscription renewed', {
          subscriptionId: String(sub._id),
          reference,
        });
      } catch (error) {
        this.logger.error('Renewal charge failed', {
          subscriptionId: String(sub._id),
          error: (error as Error).message,
        });
        await this.subscriptionTransactionDAL.updateOne(
          { _id: tx._id },
          { status: SUBSCRIPTION_TRANSACTION_STATUS.FAILED },
        );
        await this.subscriptionEventDAL.create({
          subscription: sub._id,
          eventType: SUBSCRIPTION_EVENT_TYPE.RENEWAL_FAILED,
          payload: { error: (error as Error).message },
        } as never);
        await this.enterGrace(sub);
      }
    }
  }

  private async enterGrace(sub: Subscription) {
    const plan = await this.subscriptionPlanDAL.findOne({ _id: sub.plan });
    const graceDays = plan?.gracePeriodDays ?? 3;
    const gracePeriodEnd = moment().add(graceDays, 'days').toDate();
    const retry = (sub.renewalRetryCount || 0) + 1;

    await this.subscriptionDAL.updateOne(
      { _id: sub._id },
      {
        status:
          retry === 1
            ? SUBSCRIPTION_STATUS.PAST_DUE
            : SUBSCRIPTION_STATUS.GRACE_PERIOD,
        gracePeriodEnd,
        renewalRetryCount: retry,
      },
    );

    if (retry >= 2) {
      await this.subscriptionDAL.updateOne(
        { _id: sub._id },
        { status: SUBSCRIPTION_STATUS.GRACE_PERIOD, gracePeriodEnd },
      );
    }

    await this.subscriptionEventDAL.create({
      subscription: sub._id,
      eventType: SUBSCRIPTION_EVENT_TYPE.ENTERED_GRACE,
      payload: { gracePeriodEnd, retry },
    } as never);
  }
}

@Processor(QUEUE_NAMES.GRACE_PERIOD_EXPIRY)
export class GracePeriodExpiryProcessor extends WorkerHost {
  private readonly logger: Logger;

  constructor(
    private readonly subscriptionDAL: SubscriptionDAL,
    private readonly subscriptionEventDAL: SubscriptionEventDAL,
    private readonly propertyDAL: PropertyDAL,
    @Inject(LOGGER) logger: Logger,
  ) {
    super();
    this.logger = logger.child({ service: GracePeriodExpiryProcessor.name });
  }

  async process(_job: Job): Promise<void> {
    const now = new Date();
    const expiredGrace = await this.subscriptionDAL.find({
      status: SUBSCRIPTION_STATUS.GRACE_PERIOD,
    });

    for (const sub of expiredGrace) {
      if (sub.gracePeriodEnd && moment(sub.gracePeriodEnd).isAfter(now)) {
        continue;
      }

      await this.subscriptionDAL.updateOne(
        { _id: sub._id },
        {
          status: SUBSCRIPTION_STATUS.EXPIRED,
          endedAt: now,
          autoRenewal: false,
        },
      );

      // Demote featured listings
      const featured = await this.propertyDAL.find({
        owner: sub.user,
        isFeatured: true,
      });
      for (const property of featured) {
        await this.propertyDAL.updateOne(
          { _id: property._id },
          {
            isFeatured: false,
            featuredStatus: FEATURED_STATUS.EXPIRED,
          },
        );
      }

      await this.subscriptionEventDAL.create({
        subscription: sub._id,
        eventType: SUBSCRIPTION_EVENT_TYPE.EXPIRED,
        payload: { reason: 'grace_period_ended' },
      } as never);

      this.logger.info('Subscription expired after grace', {
        subscriptionId: String(sub._id),
      });
    }

    // Also expire trials that ended without payment
    const trials = await this.subscriptionDAL.find({
      status: SUBSCRIPTION_STATUS.TRIAL,
    });
    for (const sub of trials) {
      if (sub.trialEndDate && moment(sub.trialEndDate).isAfter(now)) continue;
      await this.subscriptionDAL.updateOne(
        { _id: sub._id },
        { status: SUBSCRIPTION_STATUS.EXPIRED, endedAt: now },
      );
      await this.subscriptionEventDAL.create({
        subscription: sub._id,
        eventType: SUBSCRIPTION_EVENT_TYPE.EXPIRED,
        payload: { reason: 'trial_ended' },
      } as never);
    }
  }
}

@Processor(QUEUE_NAMES.USAGE_QUOTA_RESET)
export class UsageQuotaResetProcessor extends WorkerHost {
  private readonly logger: Logger;

  constructor(
    private readonly subscriptionDAL: SubscriptionDAL,
    private readonly entitlementEngine: EntitlementEngine,
    @Inject(LOGGER) logger: Logger,
  ) {
    super();
    this.logger = logger.child({ service: UsageQuotaResetProcessor.name });
  }

  async process(_job: Job): Promise<void> {
    const now = new Date();
    const active = await this.subscriptionDAL.find({
      status: {
        in: [
          SUBSCRIPTION_STATUS.ACTIVE,
          SUBSCRIPTION_STATUS.TRIAL,
          SUBSCRIPTION_STATUS.GRACE_PERIOD,
        ],
      },
    });

    for (const sub of active) {
      if (!sub.currentPeriodEnd || moment(sub.currentPeriodEnd).isAfter(now)) {
        continue;
      }
      // Period crossed — prepare next period usage rows at 0
      const periodStart = sub.currentPeriodEnd;
      const periodEnd =
        sub.billingCycle === BILLING_CYCLE.YEARLY
          ? moment(periodStart).add(1, 'year').toDate()
          : moment(periodStart).add(1, 'month').toDate();

      await this.entitlementEngine.resetUsageForPeriod(
        String(sub.user),
        String(sub._id),
        periodStart,
        periodEnd,
      );
      this.logger.info('Usage quota reset row prepared', {
        subscriptionId: String(sub._id),
      });
    }
  }
}
