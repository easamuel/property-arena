import { Module, forwardRef } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_TABLE_NAMES, QUEUE_NAMES } from '@shared/constants';
import { SubscriptionSchema } from './schemas/subscription.schema';
import { SubscriptionPlanSchema } from './schemas/subscription-plan.schema';
import { SubscriptionFeatureSchema } from './schemas/subscription-feature.schema';
import { SubscriptionTransactionSchema } from './schemas/subscription-transaction.schema';
import { SubscriptionEventSchema } from './schemas/subscription-event.schema';
import { SubscriptionUsageSchema } from './schemas/subscription-usage.schema';
import { NotificationSchema } from './schemas/notification.schema';
import { SubscriptionDAL } from './dals/subscription.dal';
import { SubscriptionPlanDAL } from './dals/subscription-plan.dal';
import { SubscriptionFeatureDAL } from './dals/subscription-feature.dal';
import { SubscriptionTransactionDAL } from './dals/subscription-transaction.dal';
import { SubscriptionEventDAL } from './dals/subscription-event.dal';
import { SubscriptionUsageDAL } from './dals/subscription-usage.dal';
import { PaymentModule } from '@modules/payment/payment.module';
import { UserModule } from '@modules/user/user.module';
import { EntitlementEngine } from './entitlement.engine';
import { BullModule } from '@nestjs/bullmq';
import { PropertyModule } from '@modules/property/property.module';
import {
  BillingSchedulerService,
  BillingReminderProcessor,
  SubscriptionRenewalProcessor,
  GracePeriodExpiryProcessor,
  UsageQuotaResetProcessor,
} from './workers/billing.workers';
import { isQueuesEnabled } from '@shared/queues-enabled';

const queuesOn = isQueuesEnabled();

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DB_TABLE_NAMES.SUBSCRIPTION, schema: SubscriptionSchema },
      {
        name: DB_TABLE_NAMES.SUBSCRIPTION_PLAN,
        schema: SubscriptionPlanSchema,
      },
      {
        name: DB_TABLE_NAMES.SUBSCRIPTION_FEATURE,
        schema: SubscriptionFeatureSchema,
      },
      {
        name: DB_TABLE_NAMES.SUBSCRIPTION_TRANSACTION,
        schema: SubscriptionTransactionSchema,
      },
      {
        name: DB_TABLE_NAMES.SUBSCRIPTION_EVENT,
        schema: SubscriptionEventSchema,
      },
      {
        name: DB_TABLE_NAMES.SUBSCRIPTION_USAGE,
        schema: SubscriptionUsageSchema,
      },
      { name: DB_TABLE_NAMES.NOTIFICATION, schema: NotificationSchema },
    ]),
    ...(queuesOn
      ? [
          BullModule.registerQueue(
            { name: QUEUE_NAMES.BILLING_REMINDER },
            { name: QUEUE_NAMES.SUBSCRIPTION_RENEWAL },
            { name: QUEUE_NAMES.GRACE_PERIOD_EXPIRY },
            { name: QUEUE_NAMES.USAGE_QUOTA_RESET },
          ),
        ]
      : []),
    PaymentModule,
    UserModule,
    forwardRef(() => PropertyModule),
  ],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    EntitlementEngine,
    SubscriptionDAL,
    SubscriptionPlanDAL,
    SubscriptionFeatureDAL,
    SubscriptionTransactionDAL,
    SubscriptionEventDAL,
    SubscriptionUsageDAL,
    ...(queuesOn
      ? [
          BillingSchedulerService,
          BillingReminderProcessor,
          SubscriptionRenewalProcessor,
          GracePeriodExpiryProcessor,
          UsageQuotaResetProcessor,
        ]
      : []),
  ],
  exports: [SubscriptionService, EntitlementEngine],
})
export class SubscriptionModule {}
