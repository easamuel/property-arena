import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Logger } from 'winston';
import { LOGGER } from '@shared/constants';
import {
  ChargeAuthorizationParams,
  ChargeResult,
  InitializeTransactionParams,
  InitializeTransactionResult,
  NormalizedWebhookEvent,
  PaymentGatewayService,
  VerifyTransactionResult,
} from '../interfaces/payment-gateway.interface';

/**
 * Local/dev payment adapter. Exercises HMAC verification, idempotency,
 * and charge flows without calling live gateways.
 */
@Injectable()
export class MockPaymentProvider implements PaymentGatewayService {
  private readonly logger: Logger;
  private readonly charges = new Map<string, ChargeResult>();

  constructor(
    private readonly configService: ConfigService,
    @Inject(LOGGER) logger: Logger,
  ) {
    this.logger = logger.child({ service: MockPaymentProvider.name });
  }

  private get webhookSecret(): string {
    return (
      this.configService.get<string>('paystack.webhookSecret') ||
      this.configService.get<string>('MOCK_WEBHOOK_SECRET') ||
      process.env.MOCK_WEBHOOK_SECRET ||
      'property-arena-mock-webhook-secret'
    );
  }

  async initializeTransaction(
    params: InitializeTransactionParams,
  ): Promise<InitializeTransactionResult> {
    this.logger.info('Mock payment initialize', {
      reference: params.reference,
      amountKobo: params.amountKobo,
    });

    const frontendUrl =
      this.configService.get<string>('app.frontendUrl') ||
      'http://127.0.0.1:43122';

    return {
      authorizationUrl: `${frontendUrl.replace(/\/$/, '')}/subscription/confirm?reference=${encodeURIComponent(params.reference)}&mock=1`,
      accessCode: `mock_access_${params.reference}`,
      reference: params.reference,
    };
  }

  async verifyTransaction(reference: string): Promise<VerifyTransactionResult> {
    const cached = this.charges.get(reference);
    if (cached) {
      return {
        reference,
        gatewayReference: cached.gatewayReference,
        status: cached.status === 'success' ? 'success' : 'failed',
        amountKobo: cached.amountKobo,
        currency: 'NGN',
        paidAt: new Date(),
        authorizationCode: cached.authorizationCode,
        raw: cached.raw,
      };
    }

    // Default: treat unknown refs as successful for mock checkout completion
    // when explicitly verified after a mock webhook or confirm endpoint.
    return {
      reference,
      gatewayReference: `mock_txn_${reference}`,
      status: 'success',
      amountKobo: 0,
      currency: 'NGN',
      paidAt: new Date(),
      authorizationCode: `AUTH_MOCK_${reference.slice(-8)}`,
      raw: { mock: true, reference },
    };
  }

  verifyWebhookSignature(rawBody: Buffer, signatureHeader: string): boolean {
    if (!rawBody || !signatureHeader) {
      return false;
    }
    const hash = crypto
      .createHmac('sha512', this.webhookSecret)
      .update(rawBody)
      .digest('hex');
    const a = Buffer.from(hash);
    const b = Buffer.from(signatureHeader);
    if (a.length !== b.length) {
      return false;
    }
    return crypto.timingSafeEqual(a, b);
  }

  parseWebhookEvent(rawBody: Buffer): NormalizedWebhookEvent {
    const parsed = JSON.parse(rawBody.toString('utf8')) as {
      event?: string;
      data?: { reference?: string; id?: string | number };
    };
    return {
      event: parsed.event || 'charge.success',
      reference: parsed.data?.reference,
      gatewayEventId: parsed.data?.id ? String(parsed.data.id) : undefined,
      raw: parsed as Record<string, unknown>,
    };
  }

  async chargeAuthorization(
    params: ChargeAuthorizationParams,
  ): Promise<ChargeResult> {
    this.logger.info('Mock chargeAuthorization', {
      reference: params.reference,
      amountKobo: params.amountKobo,
    });

    // Simulate failure when authorization code explicitly requests it
    const fail = params.authorizationCode?.includes('FAIL');
    const result: ChargeResult = {
      reference: params.reference,
      gatewayReference: `mock_charge_${params.reference}`,
      status: fail ? 'failed' : 'success',
      amountKobo: params.amountKobo,
      authorizationCode: params.authorizationCode,
      raw: { mock: true, fail },
    };
    this.charges.set(params.reference, result);
    return result;
  }
}
