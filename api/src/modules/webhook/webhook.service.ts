import { HttpStatus, Inject, Injectable, Optional } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Logger } from 'winston';
import { CustomHttpException } from '@shared/exception.handler';
import { LOGGER, QUEUE_NAMES } from '@shared/constants';
import { PAYMENT_GATEWAY } from '@modules/payment/payment.constants';
import { PaymentGatewayService } from '@modules/payment/interfaces/payment-gateway.interface';
import { PAYMENT_AUDIT_ACTION } from '@modules/payment/payment-audit.constants';
import {
  AUDIT_CATEGORY,
  AUDIT_STATUS,
} from '@modules/audit/schemas/audit-log.schema';
import { AuditLogService } from '@modules/audit/audit-log.service';
import { PaystackWebhookJobData } from './processors/paystack-webhook.processor';
import { SubscriptionService } from '@modules/subscription/subscription.service';
import { isQueuesEnabled } from '@shared/queues-enabled';

@Injectable()
export class WebhookService {
  private readonly logger: Logger;

  constructor(
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayService,
    private readonly auditLogService: AuditLogService,
    private readonly subscriptionService: SubscriptionService,
    @Inject(LOGGER) logger: Logger,
    @Optional()
    @InjectQueue(QUEUE_NAMES.PAYMENT_WEBHOOK)
    private readonly paymentWebhookQueue?: Queue<PaystackWebhookJobData>,
  ) {
    this.logger = logger.child({ service: WebhookService.name });
  }

  async handlePaystackWebhook(
    rawBody: Buffer | undefined,
    signature: string,
    body: Record<string, unknown>,
  ) {
    const event = typeof body?.event === 'string' ? body.event : undefined;
    const reference = (body?.data as { reference?: string } | undefined)
      ?.reference;
    const gatewayEventId = (body?.data as { id?: number | string } | undefined)
      ?.id;

    this.logger.info('Paystack webhook received', { event, reference });
    await this.auditLogService.record({
      category: AUDIT_CATEGORY.PAYMENT,
      action: PAYMENT_AUDIT_ACTION.WEBHOOK_RECEIVED,
      status: AUDIT_STATUS.INFO,
      message: `Received webhook event ${event ?? 'unknown'}`,
      reference,
      meta: { event },
    });

    if (
      !rawBody ||
      !signature ||
      !this.paymentGateway.verifyWebhookSignature(rawBody, signature)
    ) {
      this.logger.warn('Rejected Paystack webhook with invalid signature', {
        event,
        reference,
      });
      await this.auditLogService.record({
        category: AUDIT_CATEGORY.PAYMENT,
        action: PAYMENT_AUDIT_ACTION.WEBHOOK_SIGNATURE_INVALID,
        status: AUDIT_STATUS.FAILURE,
        message: 'Webhook signature verification failed',
        reference,
        meta: { event },
      });
      throw new CustomHttpException(
        'Invalid webhook signature',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!isQueuesEnabled() || !this.paymentWebhookQueue) {
      await this.subscriptionService.handlePaystackWebhookEvent(
        body as { event: string; data?: Record<string, unknown> },
      );
      return { message: 'Webhook processed inline' };
    }

    const job = await this.paymentWebhookQueue.add(
      'process-paystack-event',
      { event: body as { event: string; data?: Record<string, unknown> } },
      { jobId: gatewayEventId ? `paystack-${gatewayEventId}` : undefined },
    );

    this.logger.info('Paystack webhook queued for processing', {
      jobId: job.id,
      event,
      reference,
    });
    await this.auditLogService.record({
      category: AUDIT_CATEGORY.PAYMENT,
      action: PAYMENT_AUDIT_ACTION.WEBHOOK_QUEUED,
      status: AUDIT_STATUS.INFO,
      message: `Queued webhook event ${event ?? 'unknown'} for processing`,
      reference,
      meta: { jobId: job.id },
    });

    return { message: 'Webhook received' };
  }
}
