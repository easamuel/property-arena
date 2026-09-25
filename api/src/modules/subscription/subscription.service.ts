import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import { Logger } from 'winston';
import { CustomHttpException } from '@shared/exception.handler';
import { LOGGER } from '@shared/constants';
import { PaginationRequestDTO } from '@shared/pagination';
import { ConvertStringsToArray } from '@database/dals/query-parser';
import { PAYMENT_GATEWAY } from '@modules/payment/payment.constants';
import { PaymentGatewayService } from '@modules/payment/interfaces/payment-gateway.interface';
import { PAYMENT_AUDIT_ACTION } from '@modules/payment/payment-audit.constants';
import {
  AUDIT_CATEGORY,
  AUDIT_STATUS,
} from '@modules/audit/schemas/audit-log.schema';
import { AuditLogService } from '@modules/audit/audit-log.service';
import numberStringGenerator from '@shared/numberStringGenerator';
import { UserService } from '@modules/user/user.service';
import { EntitlementEngine } from './entitlement.engine';

import { SubscriptionDAL } from './dals/subscription.dal';
import { SubscriptionPlanDAL } from './dals/subscription-plan.dal';
import { SubscriptionFeatureDAL } from './dals/subscription-feature.dal';
import { SubscriptionTransactionDAL } from './dals/subscription-transaction.dal';
import { SubscriptionEventDAL } from './dals/subscription-event.dal';

import {
  BILLING_CYCLE,
  PAYMENT_GATEWAY_NAME,
  SUBSCRIPTION_STATUS,
  Subscription,
} from './schemas/subscription.schema';
import {
  PlanUserType,
  SubscriptionPlan,
} from './schemas/subscription-plan.schema';
import {
  FEATURE_KEY,
  SubscriptionFeature,
} from './schemas/subscription-feature.schema';
import {
  SUBSCRIPTION_TRANSACTION_STATUS,
  SubscriptionTransaction,
} from './schemas/subscription-transaction.schema';
import {
  SUBSCRIPTION_EVENT_TYPE,
  SubscriptionEvent,
} from './schemas/subscription-event.schema';
import {
  CreateSubscriptionPlanDto,
  UpdateSubscriptionPlanDto,
} from './dto/subscription.dto';
import { SUBSCRIPTION_ADMIN_AUDIT_ACTION } from './subscription-audit.constants';

const ACTIVE_STATUSES = [
  SUBSCRIPTION_STATUS.TRIAL,
  SUBSCRIPTION_STATUS.ACTIVE,
  SUBSCRIPTION_STATUS.GRACE_PERIOD,
];
const DEFAULT_CHECKOUT_REDIRECT_PATH = '/subscription/confirm';

@Injectable()
export class SubscriptionService {
  private readonly logger: Logger;

  constructor(
    private readonly subscriptionDAL: SubscriptionDAL,
    private readonly subscriptionPlanDAL: SubscriptionPlanDAL,
    private readonly subscriptionFeatureDAL: SubscriptionFeatureDAL,
    private readonly subscriptionTransactionDAL: SubscriptionTransactionDAL,
    private readonly subscriptionEventDAL: SubscriptionEventDAL,
    private readonly configService: ConfigService,
    private readonly auditLogService: AuditLogService,
    private readonly userService: UserService,
    private readonly entitlementEngine: EntitlementEngine,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayService,
    @Inject(LOGGER) logger: Logger,
  ) {
    this.logger = logger.child({ service: SubscriptionService.name });
  }

  /** Canonical gate — domain modules must use this (or EntitlementEngine). */
  canPerformAction(
    userId: string,
    actionKey: Parameters<EntitlementEngine['canPerformAction']>[1],
    quantity = 1,
  ) {
    return this.entitlementEngine.canPerformAction(
      userId,
      actionKey,
      quantity,
    );
  }

  async findOne(query: ConvertStringsToArray<Partial<Subscription>>) {
    return this.subscriptionDAL.findOne(query);
  }

  async incrementSubscriptionFeatureCount(id: string) {
    return this.subscriptionDAL.updateOne(
      { _id: id },
      undefined,
      undefined,
      undefined,
      { currentFeaturedCount: 1 },
    );
  }

  async decreasSubscriptionFeatureCount(id: string) {
    return this.subscriptionDAL.updateOne(
      { _id: id },
      undefined,
      undefined,
      undefined,
      { currentFeaturedCount: -1 },
    );
  }

  // ---------------------------------------------------------------------
  // Plans
  // ---------------------------------------------------------------------

  async listActivePlans(userType?: PlanUserType) {
    const query: ConvertStringsToArray<Partial<SubscriptionPlan>> = {
      isActive: true,
    };
    if (userType) {
      query.userType = userType;
    }

    const plans = await this.subscriptionPlanDAL.find(
      query,
      undefined,
      undefined,
      { sortOrder: 1 },
    );

    return {
      message: 'Plans fetched successfully',
      data: await this.attachFeatures(plans),
    };
  }

  async listAllPlansAdmin() {
    const plans = await this.subscriptionPlanDAL.find(
      {},
      undefined,
      undefined,
      { sortOrder: 1 },
    );

    return {
      message: 'Plans fetched successfully',
      data: await this.attachFeatures(plans),
    };
  }

  async createPlan(payload: CreateSubscriptionPlanDto, adminId: string) {
    const { features, ...planData } = payload;

    const existing = await this.subscriptionPlanDAL.findOne({
      slug: planData.slug,
    });
    if (existing) {
      throw new CustomHttpException(
        'A plan with this slug already exists',
        HttpStatus.CONFLICT,
      );
    }

    const plan = await this.subscriptionPlanDAL.create(
      planData as SubscriptionPlan,
    );

    if (features?.length) {
      await Promise.all(
        features.map((feature) =>
          this.subscriptionFeatureDAL.create({
            plan: plan._id,
            featureKey: feature.featureKey,
            value: feature.value,
          } as SubscriptionFeature),
        ),
      );
    }

    this.logger.info('Subscription plan created', {
      adminId,
      planId: String(plan._id),
    });
    await this.auditLogService.record({
      category: AUDIT_CATEGORY.ADMIN,
      action: SUBSCRIPTION_ADMIN_AUDIT_ACTION.PLAN_CREATED,
      status: AUDIT_STATUS.SUCCESS,
      message: `Subscription plan "${plan.name}" created`,
      actor: adminId,
      reference: String(plan._id),
      meta: { payload },
    });

    return this.getPlanWithFeatures(plan._id);
  }

  async updatePlan(
    id: string,
    payload: UpdateSubscriptionPlanDto,
    adminId: string,
  ) {
    const { features, ...planData } = payload;

    const plan = await this.subscriptionPlanDAL.updateOne(
      { _id: id },
      planData as Partial<SubscriptionPlan>,
    );

    if (!plan) {
      throw new CustomHttpException('Plan not found', HttpStatus.NOT_FOUND);
    }

    this.logger.info('Subscription plan updated', { adminId, planId: id });
    await this.auditLogService.record({
      category: AUDIT_CATEGORY.ADMIN,
      action: SUBSCRIPTION_ADMIN_AUDIT_ACTION.PLAN_UPDATED,
      status: AUDIT_STATUS.SUCCESS,
      message: `Subscription plan "${plan.name}" updated`,
      actor: adminId,
      reference: id,
      meta: { payload },
    });

    if (features) {
      await this.subscriptionFeatureDAL.deleteMany({ plan: id });
      await Promise.all(
        features.map((feature) =>
          this.subscriptionFeatureDAL.create({
            plan: id,
            featureKey: feature.featureKey,
            value: feature.value,
          } as SubscriptionFeature),
        ),
      );
    }

    return this.getPlanWithFeatures(id);
  }

  private async getPlanWithFeatures(planId: string) {
    const plan = await this.subscriptionPlanDAL.findOne({ _id: planId });
    if (!plan) {
      throw new CustomHttpException('Plan not found', HttpStatus.NOT_FOUND);
    }
    const features = await this.subscriptionFeatureDAL.find({
      plan: planId,
    });

    return {
      message: 'Plan saved successfully',
      data: { ...this.toPlainObject(plan), features },
    };
  }

  private async attachFeatures(plans: SubscriptionPlan[]) {
    if (plans.length === 0) {
      return [];
    }

    const planIds = plans.map((plan) => String(plan._id));
    const features = await this.subscriptionFeatureDAL.find({
      plan: { in: planIds },
    });

    return plans.map((plan) => ({
      ...this.toPlainObject(plan),
      features: features.filter(
        (feature) => String(feature.plan) === String(plan._id),
      ),
    }));
  }

  private toPlainObject<T>(doc: T): T {
    const maybeDocument = doc as unknown as { toObject?: () => T };
    return typeof maybeDocument.toObject === 'function'
      ? maybeDocument.toObject()
      : doc;
  }

  // ---------------------------------------------------------------------
  // Subscriptions
  // ---------------------------------------------------------------------

  async getActiveSubscription(userId: string) {
    return this.subscriptionDAL.findOne(
      { user: userId, status: { in: ACTIVE_STATUSES } },
      undefined,
      [{ path: 'plan' }],
    );
  }

  async getMySubscription(userId: string) {
    const subscription = await this.subscriptionDAL.findOne(
      { user: userId },
      undefined,
      [{ path: 'plan' }],
      { createdAt: -1 },
    );

    return {
      message: 'Subscription fetched successfully',
      data: subscription,
    };
  }

  async getSubscriptionBadge(userId: string) {
    const subscription = await this.getActiveSubscription(userId);
    if (!subscription?.plan) {
      return {
        message: 'Badge fetched',
        data: { badgeLabel: null, badgeColor: null },
      };
    }
    const rawPlan = subscription.plan;
    const plan =
      typeof rawPlan === 'object' && rawPlan !== null
        ? (rawPlan as SubscriptionPlan)
        : await this.subscriptionPlanDAL.findOne({ _id: String(rawPlan) });
    return {
      message: 'Badge fetched',
      data: {
        badgeLabel: plan?.badgeLabel ?? null,
        badgeColor: plan?.badgeColor ?? null,
      },
    };
  }

  async getFeatureValue(
    userId: string,
    featureKey: FEATURE_KEY,
  ): Promise<number | boolean | string> {
    const subscription = await this.subscriptionDAL.findOne({
      user: userId,
      status: { in: ACTIVE_STATUSES },
    });

    if (!subscription) {
      throw new CustomHttpException(
        'You need an active subscription to access this feature.',
        HttpStatus.FORBIDDEN,
      );
    }

    const feature = await this.subscriptionFeatureDAL.findOne({
      plan: subscription.plan,
      featureKey,
    });

    if (!feature) {
      throw new CustomHttpException(
        'This feature is not available on your current plan.',
        HttpStatus.FORBIDDEN,
      );
    }

    return feature.value;
  }

  // ---------------------------------------------------------------------
  // Checkout / trial
  // ---------------------------------------------------------------------

  async initiateCheckout(
    userId: string,
    userEmail: string,
    planId: string,
    billingCycle: BILLING_CYCLE,
    redirectPath?: string,
  ) {
    const plan = await this.subscriptionPlanDAL.findOne({
      _id: planId,
      isActive: true,
    });

    if (!plan) {
      throw new CustomHttpException('Plan not found', HttpStatus.NOT_FOUND);
    }

    const hasUsedPromo = await this.userService.findOne({
      _id: userId,
      promoTrialUsed: true,
    });

    if (!hasUsedPromo && plan.trialDays > 0) {
      return this.startTrial(userId, plan, billingCycle);
    }

    return this.startPaidCheckout(
      userId,
      userEmail,
      plan,
      billingCycle,
      redirectPath,
    );
  }

  private async startTrial(
    userId: string,
    plan: SubscriptionPlan,
    billingCycle: BILLING_CYCLE,
  ) {
    const periodStart = new Date();
    const trialEndDate = moment(periodStart)
      .add(plan.trialDays, 'days')
      .toDate();

    const subscription = await this.subscriptionDAL.create({
      user: userId,
      plan: plan._id,
      status: SUBSCRIPTION_STATUS.TRIAL,
      billingCycle,
      startDate: periodStart,
      currentPeriodStart: periodStart,
      currentPeriodEnd: trialEndDate,
      trialEndDate,
      nextBillingDate: trialEndDate,
      autoRenewal: true,
    } as Subscription);

    // Enforce first-month-free exactly once per user lifecycle
    await this.userService.updateOne(
      { _id: userId },
      { promoTrialUsed: true },
    );

    await this.subscriptionEventDAL.create({
      subscription: subscription._id,
      eventType: SUBSCRIPTION_EVENT_TYPE.TRIAL_STARTED,
      payload: { planId: plan._id, amountKobo: 0 },
    } as SubscriptionEvent);

    return {
      message: 'Free trial started successfully',
      data: { trial: true, subscription },
    };
  }

  private async startPaidCheckout(
    userId: string,
    userEmail: string,
    plan: SubscriptionPlan,
    billingCycle: BILLING_CYCLE,
    redirectPath?: string,
  ) {
    const amountKobo =
      billingCycle === BILLING_CYCLE.YEARLY
        ? plan.yearlyPrice
        : plan.monthlyPrice;

    const reference = this.generateReference();

    this.logger.info('Starting paid checkout', {
      userId,
      planId: String(plan._id),
      billingCycle,
      reference,
    });

    const subscription = await this.subscriptionDAL.create({
      user: userId,
      plan: plan._id,
      status: SUBSCRIPTION_STATUS.PENDING,
      billingCycle,
      gateway: PAYMENT_GATEWAY_NAME.PAYSTACK,
    } as Subscription);

    const transaction = await this.subscriptionTransactionDAL.create({
      user: userId,
      subscription: subscription._id,
      plan: plan._id,
      billingCycle,
      amount: amountKobo,
      currency: plan.currency,
      reference,
      gateway: PAYMENT_GATEWAY_NAME.PAYSTACK,
      status: SUBSCRIPTION_TRANSACTION_STATUS.PENDING,
    } as SubscriptionTransaction);

    await this.subscriptionDAL.updateOne(
      { _id: subscription._id },
      { lastTransaction: transaction._id },
    );

    await this.subscriptionEventDAL.create({
      subscription: subscription._id,
      eventType: SUBSCRIPTION_EVENT_TYPE.CHECKOUT_INITIATED,
      payload: { reference },
    } as SubscriptionEvent);

    await this.auditLogService.record({
      category: AUDIT_CATEGORY.PAYMENT,
      action: PAYMENT_AUDIT_ACTION.CHECKOUT_INITIATED,
      status: AUDIT_STATUS.INFO,
      message: `Checkout initiated for plan ${plan.slug}`,
      actor: userId,
      reference,
      meta: {
        planId: String(plan._id),
        subscriptionId: String(subscription._id),
        billingCycle,
        amountKobo,
      },
    });

    const frontendUrl = this.configService.get<string>('app.frontendUrl');
    const path = redirectPath || DEFAULT_CHECKOUT_REDIRECT_PATH;

    try {
      const { authorizationUrl, accessCode } =
        await this.paymentGateway.initializeTransaction({
          email: userEmail,
          amountKobo,
          reference,
          callbackUrl: frontendUrl
            ? `${frontendUrl.replace(/\/$/, '')}${path}`
            : undefined,
          metadata: {
            userId,
            planId: String(plan._id),
            subscriptionId: String(subscription._id),
          },
        });

      this.logger.info('Paid checkout initialized', { userId, reference });

      return {
        message: 'Checkout initiated',
        data: { trial: false, authorizationUrl, accessCode, reference },
      };
    } catch (error) {
      this.logger.error('Failed to initialize paid checkout', {
        userId,
        reference,
        error: (error as Error).message,
      });
      await this.auditLogService.record({
        category: AUDIT_CATEGORY.PAYMENT,
        action: PAYMENT_AUDIT_ACTION.CHECKOUT_FAILED,
        status: AUDIT_STATUS.FAILURE,
        message: (error as Error).message,
        actor: userId,
        reference,
        meta: { subscriptionId: String(subscription._id) },
      });
      throw error;
    }
  }

  private generateReference(): string {
    const randomSuffix = numberStringGenerator({
      characterLength: 8,
      outputOption: 'alphanumeric',
      isCapitalized: true,
    });
    return `PA-${Date.now()}-${randomSuffix}`;
  }

  // ---------------------------------------------------------------------
  // Webhook handling
  // ---------------------------------------------------------------------

  /**
   * Browser callback is UI-only. This endpoint re-verifies with the gateway
   * before mutating subscription state (same invariant as webhooks).
   */
  async confirmCheckout(userId: string, reference: string) {
    const transaction = await this.subscriptionTransactionDAL.findOne({
      reference,
      user: userId,
    });
    if (!transaction) {
      throw new CustomHttpException(
        'Transaction not found',
        HttpStatus.NOT_FOUND,
      );
    }
    if (transaction.status === SUBSCRIPTION_TRANSACTION_STATUS.SUCCESS) {
      return {
        message: 'Transaction already processed',
        data: { reference, alreadyProcessed: true },
      };
    }

    await this.handlePaystackWebhookEvent({
      event: 'charge.success',
      data: { reference, id: `confirm-${reference}` },
    });

    return {
      message: 'Payment confirmed',
      data: { reference },
    };
  }

  async handlePaystackWebhookEvent(event: {
    event: string;
    data?: Record<string, unknown>;
  }) {
    if (event?.event !== 'charge.success') {
      this.logger.info('Ignoring non charge.success webhook event', {
        event: event?.event,
      });
      return;
    }

    const data = event.data as
      | { reference?: string; id?: number | string }
      | undefined;
    const reference = data?.reference;

    if (!reference) {
      this.logger.warn('Paystack webhook event missing reference', {
        event: event.event,
      });
      return;
    }

    const transaction = await this.subscriptionTransactionDAL.findOne({
      reference,
    });

    if (!transaction) {
      this.logger.warn('No subscription transaction found for reference', {
        reference,
      });
      return;
    }

    const gatewayEventId = data?.id ? String(data.id) : reference;

    try {
      await this.subscriptionEventDAL.create({
        subscription: transaction.subscription,
        eventType: SUBSCRIPTION_EVENT_TYPE.ACTIVATED,
        gatewayEventId,
        payload: event as unknown as Record<string, unknown>,
      } as SubscriptionEvent);
    } catch (error) {
      if (this.isDuplicateKeyError(error)) {
        // Already processed this exact gateway event - Paystack retried the webhook.
        this.logger.info('Duplicate Paystack webhook event ignored', {
          reference,
          gatewayEventId,
        });
        return;
      }
      throw error;
    }

    if (transaction.status === SUBSCRIPTION_TRANSACTION_STATUS.SUCCESS) {
      this.logger.info('Transaction already marked successful, skipping', {
        reference,
      });
      return;
    }

    // Never trust the webhook payload alone - re-verify server-side.
    const verification = await this.paymentGateway.verifyTransaction(reference);

    if (verification.status !== 'success') {
      this.logger.warn('Paystack transaction verification did not succeed', {
        reference,
        status: verification.status,
      });
      await this.auditLogService.record({
        category: AUDIT_CATEGORY.PAYMENT,
        action: PAYMENT_AUDIT_ACTION.TRANSACTION_VERIFY_FAILED,
        status: AUDIT_STATUS.FAILURE,
        message: `Verification returned status "${verification.status}"`,
        reference,
        meta: { subscriptionId: String(transaction.subscription) },
      });

      await this.subscriptionTransactionDAL.updateOne(
        { _id: transaction._id },
        {
          status: SUBSCRIPTION_TRANSACTION_STATUS.FAILED,
          rawGatewayResponse: verification.raw,
        },
      );
      await this.subscriptionDAL.updateOne(
        { _id: transaction.subscription },
        { status: SUBSCRIPTION_STATUS.FAILED },
      );
      await this.subscriptionEventDAL.create({
        subscription: transaction.subscription,
        eventType: SUBSCRIPTION_EVENT_TYPE.PAYMENT_FAILED,
        payload: verification.raw,
      } as SubscriptionEvent);
      await this.auditLogService.record({
        category: AUDIT_CATEGORY.PAYMENT,
        action: PAYMENT_AUDIT_ACTION.PAYMENT_FAILED,
        status: AUDIT_STATUS.FAILURE,
        message: 'Subscription marked failed after unsuccessful payment',
        reference,
        meta: { subscriptionId: String(transaction.subscription) },
      });
      return;
    }

    await this.auditLogService.record({
      category: AUDIT_CATEGORY.PAYMENT,
      action: PAYMENT_AUDIT_ACTION.TRANSACTION_VERIFIED,
      status: AUDIT_STATUS.SUCCESS,
      message: 'Transaction verified successfully with Paystack',
      reference,
      meta: { subscriptionId: String(transaction.subscription) },
    });

    await this.subscriptionTransactionDAL.updateOne(
      { _id: transaction._id },
      {
        status: SUBSCRIPTION_TRANSACTION_STATUS.SUCCESS,
        gatewayReference: verification.gatewayReference,
        paidAt: verification.paidAt ?? new Date(),
        rawGatewayResponse: verification.raw,
      },
    );

    const periodStart = new Date();
    const periodEnd =
      transaction.billingCycle === BILLING_CYCLE.YEARLY
        ? moment(periodStart).add(1, 'year').toDate()
        : moment(periodStart).add(1, 'month').toDate();

    await this.subscriptionDAL.updateOne(
      { _id: transaction.subscription },
      {
        status: SUBSCRIPTION_STATUS.ACTIVE,
        startDate: periodStart,
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
        nextBillingDate: periodEnd,
        lastTransaction: transaction._id,
        gatewayAuthorizationCode: verification.authorizationCode,
        autoRenewal: true,
        renewalRetryCount: 0,
      },
    );

    this.logger.info('Subscription activated after successful payment', {
      reference,
      subscriptionId: String(transaction.subscription),
    });
    await this.auditLogService.record({
      category: AUDIT_CATEGORY.PAYMENT,
      action: PAYMENT_AUDIT_ACTION.SUBSCRIPTION_ACTIVATED,
      status: AUDIT_STATUS.SUCCESS,
      message: 'Subscription activated',
      reference,
      meta: {
        subscriptionId: String(transaction.subscription),
        currentPeriodEnd: periodEnd,
      },
    });
  }

  async listSubscribersAdmin(query: PaginationRequestDTO) {
    const { data, ...meta } = await this.subscriptionDAL.paginate({}, query);
    return { message: 'Subscribers fetched successfully', data, meta };
  }

  async listTransactionsAdmin(query: PaginationRequestDTO) {
    const { data, ...meta } = await this.subscriptionTransactionDAL.paginate(
      {},
      query,
    );
    return { message: 'Transactions fetched successfully', data, meta };
  }

  async adminSetSubscriptionStatus(
    id: string,
    status: SUBSCRIPTION_STATUS,
    adminId: string,
  ) {
    const updated = await this.subscriptionDAL.updateOne({ _id: id }, { status });
    if (!updated) {
      throw new CustomHttpException('Subscription not found', HttpStatus.NOT_FOUND);
    }
    await this.auditLogService.record({
      category: AUDIT_CATEGORY.ADMIN,
      action: 'subscription.status_changed',
      status: AUDIT_STATUS.SUCCESS,
      message: `Subscription set to ${status}`,
      actor: adminId,
      reference: id,
      meta: { status },
    });
    return { message: 'Subscription updated', data: updated };
  }

  private isDuplicateKeyError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: number }).code === 11000
    );
  }
}
