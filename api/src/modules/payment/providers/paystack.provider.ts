import { HttpService } from '@nestjs/axios';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { firstValueFrom } from 'rxjs';
import { Logger } from 'winston';
import { CustomHttpException } from '@shared/exception.handler';
import { LOGGER } from '@shared/constants';
import {
  InitializeTransactionParams,
  InitializeTransactionResult,
  PaymentGatewayService,
  VerifyTransactionResult,
} from '../interfaces/payment-gateway.interface';

interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    reference: string;
    id: number;
    status: string;
    amount: number;
    currency: string;
    paid_at: string | null;
    [key: string]: unknown;
  };
}

@Injectable()
export class PaystackProvider implements PaymentGatewayService {
  private readonly logger: Logger;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(LOGGER) logger: Logger,
  ) {
    this.logger = logger.child({ service: PaystackProvider.name });
  }

  private get secretKey(): string {
    const key = this.configService.get<string>('paystack.secretKey');
    if (!key) {
      throw new CustomHttpException(
        'Paystack secret key is not configured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return key;
  }

  private get baseUrl(): string {
    return (
      this.configService.get<string>('paystack.baseUrl') ||
      'https://api.paystack.co'
    );
  }

  private get authHeaders() {
    return { Authorization: `Bearer ${this.secretKey}` };
  }

  async initializeTransaction(
    params: InitializeTransactionParams,
  ): Promise<InitializeTransactionResult> {
    this.logger.info('Initializing Paystack transaction', {
      reference: params.reference,
      amountKobo: params.amountKobo,
      callbackUrl: params.callbackUrl,
    });

    let data: PaystackInitializeResponse;
    try {
      ({ data } = await firstValueFrom(
        this.httpService.post<PaystackInitializeResponse>(
          `${this.baseUrl}/transaction/initialize`,
          {
            email: params.email,
            amount: params.amountKobo,
            reference: params.reference,
            callback_url: params.callbackUrl,
            metadata: params.metadata,
          },
          { headers: this.authHeaders },
        ),
      ));
    } catch (error) {
      this.logger.error('Paystack transaction initialize request failed', {
        reference: params.reference,
        error: (error as Error).message,
      });
      throw error;
    }

    if (!data.status) {
      this.logger.error('Paystack transaction initialize rejected', {
        reference: params.reference,
        message: data.message,
      });
      throw new CustomHttpException(
        data.message || 'Failed to initialize payment',
        HttpStatus.BAD_GATEWAY,
      );
    }

    this.logger.info('Paystack transaction initialized', {
      reference: data.data.reference,
    });

    return {
      authorizationUrl: data.data.authorization_url,
      accessCode: data.data.access_code,
      reference: data.data.reference,
    };
  }

  async verifyTransaction(reference: string): Promise<VerifyTransactionResult> {
    this.logger.info('Verifying Paystack transaction', { reference });

    let data: PaystackVerifyResponse;
    try {
      ({ data } = await firstValueFrom(
        this.httpService.get<PaystackVerifyResponse>(
          `${this.baseUrl}/transaction/verify/${encodeURIComponent(reference)}`,
          { headers: this.authHeaders },
        ),
      ));
    } catch (error) {
      this.logger.error('Paystack transaction verify request failed', {
        reference,
        error: (error as Error).message,
      });
      throw error;
    }

    if (!data.status) {
      this.logger.error('Paystack transaction verify rejected', {
        reference,
        message: data.message,
      });
      throw new CustomHttpException(
        data.message || 'Failed to verify payment',
        HttpStatus.BAD_GATEWAY,
      );
    }

    const paystackStatus = data.data.status; // 'success' | 'failed' | 'abandoned'
    const normalizedStatus: VerifyTransactionResult['status'] =
      paystackStatus === 'success'
        ? 'success'
        : paystackStatus === 'abandoned'
          ? 'abandoned'
          : 'failed';

    this.logger.info('Paystack transaction verified', {
      reference,
      status: normalizedStatus,
      amountKobo: data.data.amount,
    });

    return {
      reference: data.data.reference,
      gatewayReference: String(data.data.id),
      status: normalizedStatus,
      amountKobo: data.data.amount,
      currency: data.data.currency,
      paidAt: data.data.paid_at ? new Date(data.data.paid_at) : undefined,
      raw: data.data,
    };
  }

  verifyWebhookSignature(rawBody: Buffer, signatureHeader: string): boolean {
    if (!rawBody || !signatureHeader) {
      this.logger.warn('Paystack webhook missing body or signature header');
      return false;
    }

    const hash = crypto
      .createHmac('sha512', this.secretKey)
      .update(rawBody)
      .digest('hex');

    const hashBuffer = Buffer.from(hash);
    const signatureBuffer = Buffer.from(signatureHeader);

    if (hashBuffer.length !== signatureBuffer.length) {
      this.logger.warn('Paystack webhook signature length mismatch');
      return false;
    }

    const isValid = crypto.timingSafeEqual(hashBuffer, signatureBuffer);
    if (!isValid) {
      this.logger.warn('Paystack webhook signature verification failed');
    }

    return isValid;
  }

  async chargeAuthorization(
    params: import('../interfaces/payment-gateway.interface').ChargeAuthorizationParams,
  ): Promise<import('../interfaces/payment-gateway.interface').ChargeResult> {
    this.logger.info('Charging Paystack authorization', {
      reference: params.reference,
      amountKobo: params.amountKobo,
    });

    let data: {
      status: boolean;
      message: string;
      data: {
        reference: string;
        id: number;
        status: string;
        amount: number;
        authorization?: { authorization_code?: string };
        [key: string]: unknown;
      };
    };

    try {
      ({ data } = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/transaction/charge_authorization`,
          {
            authorization_code: params.authorizationCode,
            email: params.email,
            amount: params.amountKobo,
            reference: params.reference,
            metadata: params.metadata,
          },
          { headers: this.authHeaders },
        ),
      ));
    } catch (error) {
      this.logger.error('Paystack charge_authorization failed', {
        reference: params.reference,
        error: (error as Error).message,
      });
      throw error;
    }

    if (!data.status) {
      throw new CustomHttpException(
        data.message || 'Failed to charge authorization',
        HttpStatus.BAD_GATEWAY,
      );
    }

    const ok = data.data.status === 'success';
    return {
      reference: data.data.reference || params.reference,
      gatewayReference: String(data.data.id),
      status: ok ? 'success' : 'failed',
      amountKobo: data.data.amount,
      authorizationCode:
        data.data.authorization?.authorization_code ||
        params.authorizationCode,
      raw: data.data,
    };
  }
}
