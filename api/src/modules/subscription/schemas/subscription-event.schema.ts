import { BaseSchema, Schema } from '@database/base.schema';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { DB_TABLE_NAMES } from '@shared/constants';
import { Document, SchemaTypes } from 'mongoose';

export enum SUBSCRIPTION_EVENT_TYPE {
  TRIAL_STARTED = 'trial_started',
  CHECKOUT_INITIATED = 'checkout_initiated',
  ACTIVATED = 'activated',
  PAYMENT_FAILED = 'payment_failed',
  LIMIT_EXCEEDED = 'limit_exceeded',
  RENEWAL_SUCCEEDED = 'renewal_succeeded',
  RENEWAL_FAILED = 'renewal_failed',
  ENTERED_GRACE = 'entered_grace',
  EXPIRED = 'expired',
  REMINDER_SENT = 'reminder_sent',
  WEBHOOK_PROCESSED = 'webhook_processed',
}

@Schema()
export class SubscriptionEvent extends BaseSchema {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: DB_TABLE_NAMES.SUBSCRIPTION,
    required: true,
  })
  subscription: string;

  @Prop({
    type: String,
    enum: Object.values(SUBSCRIPTION_EVENT_TYPE),
    required: true,
  })
  eventType: SUBSCRIPTION_EVENT_TYPE;

  // Idempotency key for gateway webhook events - unique+sparse so it's only
  // enforced when present (locally-generated events like TRIAL_STARTED omit it).
  @Prop({ unique: true, sparse: true })
  gatewayEventId?: string;

  @Prop({ type: SchemaTypes.Mixed })
  payload?: Record<string, unknown>;
}

export type SubscriptionEventDocument = SubscriptionEvent & Document;
export const SubscriptionEventSchema =
  SchemaFactory.createForClass(SubscriptionEvent);
