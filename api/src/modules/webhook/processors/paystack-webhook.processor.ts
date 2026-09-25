import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { Logger } from 'winston';
import { LOGGER, QUEUE_NAMES } from '@shared/constants';
import { SubscriptionService } from '@modules/subscription/subscription.service';
import { PAYMENT_AUDIT_ACTION } from '@modules/payment/payment-audit.constants';
import {
  AUDIT_CATEGORY,
  AUDIT_STATUS,
} from '@modules/audit/schemas/audit-log.schema';
import { AuditLogService } from '@modules/audit/audit-log.service';

export interface PaystackWebhookJobData {
  event: {
    event: string;
    data?: Record<string, unknown>;
  };
}

@Processor(QUEUE_NAMES.PAYMENT_WEBHOOK)
export class PaystackWebhookProcessor extends WorkerHost {
  private readonly logger: Logger;

  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly auditLogService: AuditLogService,
    @Inject(LOGGER) logger: Logger,
  ) {
    super();
    this.logger = logger.child({ service: PaystackWebhookProcessor.name });
  }

  async process(job: Job<PaystackWebhookJobData>): Promise<void> {
    const { event } = job.data;
    const reference = (event.data as { reference?: string } | undefined)
      ?.reference;

    this.logger.info('Processing Paystack webhook event', {
      jobId: job.id,
      attemptsMade: job.attemptsMade,
      event: event.event,
      reference,
    });

    await this.auditLogService.record({
      category: AUDIT_CATEGORY.PAYMENT,
      action: PAYMENT_AUDIT_ACTION.WEBHOOK_PROCESSING_STARTED,
      status: AUDIT_STATUS.INFO,
      message: `Processing webhook event ${event.event}`,
      reference,
      meta: { jobId: job.id, attemptsMade: job.attemptsMade },
    });

    try {
      await this.subscriptionService.handlePaystackWebhookEvent(event);

      this.logger.info('Paystack webhook event processed successfully', {
        jobId: job.id,
        event: event.event,
        reference,
      });
    } catch (error) {
      this.logger.error('Failed to process Paystack webhook event', {
        jobId: job.id,
        event: event.event,
        reference,
        error: (error as Error).message,
        stack: (error as Error).stack,
      });

      await this.auditLogService.record({
        category: AUDIT_CATEGORY.PAYMENT,
        action: PAYMENT_AUDIT_ACTION.WEBHOOK_PROCESSING_FAILED,
        status: AUDIT_STATUS.FAILURE,
        message: (error as Error).message,
        reference,
        meta: { jobId: job.id, attemptsMade: job.attemptsMade },
      });

      // Rethrow so BullMQ retries with the configured backoff instead of
      // silently swallowing a processing failure.
      throw error;
    }
  }
}
