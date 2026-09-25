import { Controller, Headers, HttpCode, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { SkipAuth } from '@decorators/skip-auth.decorator';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @SkipAuth()
  @HttpCode(200)
  @Post('paystack')
  handlePaystackWebhook(
    @Req() req: Request & { rawBody?: Buffer },
    @Headers('x-paystack-signature') signature: string,
  ) {
    return this.webhookService.handlePaystackWebhook(
      req.rawBody,
      signature,
      req.body,
    );
  }
}
