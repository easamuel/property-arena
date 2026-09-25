import { HttpService } from '@nestjs/axios';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { firstValueFrom } from 'rxjs';
import { Logger } from 'winston';
import { CustomHttpException } from '@shared/exception.handler';
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

@Injectable()
export class FlutterwaveProvider implements PaymentGatewayService {
  private readonly logger: Logger;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(LOGGER) logger: Logger,
  ) {
    this.logger = logger.child({ service: FlutterwaveProvider.name });
  }

  private get secretKey(): string {
    const key = this.configService.get<string>('flutterwave.secretKey');
    if (!key) {
      throw new CustomHttpException(
        'Flutterwave secret key is not configured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return key;
  }

  private get secretHash(): string {
    return (
      this.configService.get<string>('flutterwave.secretHash') ||
      this.secretKey
    );
  }

  private get baseUrl(): string {
    return (
      this.configService.get<string>('flutterwave.baseUrl') ||
      'https://api.flutterwave.com/v3'
    );
  }

  async initializeTransaction(
    params: InitializeTransactionParams,
  ): Promise<InitializeTransactionResult> {
    this.logger.info('Initializing Flutterwave transaction', {
      reference: params.reference,
      amountKobo: params.amountKobo,
    });

    const amountNaira = params.amountKobo / 100;
    const { data } = await firstValueFrom(
      this.httpService.post(
        `${this.baseUrl}/payments`,
        {
          tx_ref: params.reference,
          amount: amountNaira,
          currency: 'NGN',
          redirect_url: params.callbackUrl,
          customer: { email: params.email },
          meta: params.metadata,
        },
        {
          headers: { Authorization: `Bearer ${this.secretKey}` },
        },
      ),
    );

    if (!data?.status || data.status !== 'success') {
      throw new CustomHttpException(
        data?.message || 'Failed to initialize Flutterwave payment',
        HttpStatus.BAD_GATEWAY,
      );
    }

    return {
      authorizationUrl: data.data.link,
      accessCode: data.data.link,
      reference: params.reference,
    };
  }

  async verifyTransaction(reference: string): Promise<VerifyTransactionResult> {
    const { data } = await firstValueFrom(
      this.httpService.get(
        `${this.baseUrl}/transactions/verify_by_reference?tx_ref=${encodeURIComponent(reference)}`,
        { headers: { Authorization: `Bearer ${this.secretKey}` } },
      ),
    );

    if (!data?.status || data.status !== 'success') {
      throw new CustomHttpException(
        data?.message || 'Failed to verify Flutterwave payment',
        HttpStatus.BAD_GATEWAY,
      );
    }

    const tx = data.data;
    const status: VerifyTransactionResult['status'] =
      tx.status === 'successful'
        ? 'success'
        : tx.status === 'failed'
          ? 'failed'
          : 'pending';

    return {
      reference: tx.tx_ref || reference,
      gatewayReference: String(tx.id),
      status,
      amountKobo: Math.round(Number(tx.amount) * 100),
      currency: tx.currency || 'NGN',
      paidAt: tx.created_at ? new Date(tx.created_at) : undefined,
      authorizationCode: tx.card?.token,
      raw: tx,
    };
  }

  verifyWebhookSignature(rawBody: Buffer, signatureHeader: string): boolean {
    if (!rawBody || !signatureHeader) {
      return false;
    }
    // Flutterwave sends verif-hash header equal to the secret hash (constant-time compare)
    const expected = Buffer.from(this.secretHash);
    const received = Buffer.from(signatureHeader);
    if (expected.length !== received.length) {
      return false;
    }
    return crypto.timingSafeEqual(expected, received);
  }

  parseWebhookEvent(rawBody: Buffer): NormalizedWebhookEvent {
    const parsed = JSON.parse(rawBody.toString('utf8')) as {
      event?: string;
      data?: { tx_ref?: string; id?: string | number };
    };
    return {
      event: parsed.event || 'charge.completed',
      reference: parsed.data?.tx_ref,
      gatewayEventId: parsed.data?.id ? String(parsed.data.id) : undefined,
      raw: parsed as Record<string, unknown>,
    };
  }

  async chargeAuthorization(
    params: ChargeAuthorizationParams,
  ): Promise<ChargeResult> {
    const { data } = await firstValueFrom(
      this.httpService.post(
        `${this.baseUrl}/tokenized-charges`,
        {
          token: params.authorizationCode,
          email: params.email,
          amount: params.amountKobo / 100,
          currency: 'NGN',
          tx_ref: params.reference,
          meta: params.metadata,
        },
        { headers: { Authorization: `Bearer ${this.secretKey}` } },
      ),
    );

    const ok = data?.status === 'success' && data?.data?.status === 'successful';
    return {
      reference: params.reference,
      gatewayReference: String(data?.data?.id ?? params.reference),
      status: ok ? 'success' : 'failed',
      amountKobo: params.amountKobo,
      authorizationCode: params.authorizationCode,
      raw: data?.data ?? data,
    };
  }
}
