import { Module, Optional } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '@shared/constants';
import { defaultQueueConfig } from '@shared/queue.config';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { PaystackWebhookProcessor } from './processors/paystack-webhook.processor';
import { SubscriptionModule } from '@modules/subscription/subscription.module';
import { PaymentModule } from '@modules/payment/payment.module';
import { isQueuesEnabled } from '@shared/queues-enabled';

const queuesOn = isQueuesEnabled();

@Module({
  imports: [
    SubscriptionModule,
    PaymentModule,
    ...(queuesOn
      ? [
          BullModule.registerQueue({
            ...defaultQueueConfig,
            name: QUEUE_NAMES.PAYMENT_WEBHOOK,
          }),
        ]
      : []),
  ],
  controllers: [WebhookController],
  providers: [
    WebhookService,
    ...(queuesOn ? [PaystackWebhookProcessor] : []),
  ],
  exports: [WebhookService],
})
export default class WebhookModule {}
