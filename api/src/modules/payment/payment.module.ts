import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PAYMENT_GATEWAY } from './payment.constants';
import { PaystackProvider } from './providers/paystack.provider';
import { FlutterwaveProvider } from './providers/flutterwave.provider';
import { MockPaymentProvider } from './providers/mock.provider';

@Module({
  imports: [HttpModule],
  providers: [
    PaystackProvider,
    FlutterwaveProvider,
    MockPaymentProvider,
    {
      provide: PAYMENT_GATEWAY,
      inject: [
        ConfigService,
        PaystackProvider,
        FlutterwaveProvider,
        MockPaymentProvider,
      ],
      useFactory: (
        config: ConfigService,
        paystack: PaystackProvider,
        flutterwave: FlutterwaveProvider,
        mock: MockPaymentProvider,
      ) => {
        const preferred = (
          config.get<string>('PAYMENT_GATEWAY') ||
          process.env.PAYMENT_GATEWAY ||
          ''
        ).toLowerCase();

        if (preferred === 'mock') {
          return mock;
        }
        if (preferred === 'flutterwave' && process.env.FLUTTERWAVE_SECRET_KEY) {
          return flutterwave;
        }
        if (process.env.PAYSTACK_SECRET_KEY) {
          return paystack;
        }
        if (process.env.FLUTTERWAVE_SECRET_KEY) {
          return flutterwave;
        }
        // Local/dev fallback — never block boot on missing gateway secrets
        return mock;
      },
    },
  ],
  exports: [PAYMENT_GATEWAY, PaystackProvider, FlutterwaveProvider, MockPaymentProvider],
})
export class PaymentModule {}
