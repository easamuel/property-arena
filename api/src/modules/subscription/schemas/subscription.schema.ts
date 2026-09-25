import { BaseSchema, Schema } from '@database/base.schema';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { DB_TABLE_NAMES } from '@shared/constants';
import { Document, SchemaTypes } from 'mongoose';

export enum SUBSCRIPTION_STATUS {
  PENDING = 'pending',
  TRIAL = 'trial',
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  GRACE_PERIOD = 'grace_period',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  SUSPENDED = 'suspended',
  FAILED = 'failed',
}

export enum BILLING_CYCLE {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum PAYMENT_GATEWAY_NAME {
  PAYSTACK = 'paystack',
  FLUTTERWAVE = 'flutterwave',
  MANUAL_ADMIN = 'manual_admin',
  MOCK = 'mock',
}

@Schema()
export class Subscription extends BaseSchema {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: DB_TABLE_NAMES.USERS,
    required: true,
  })
  user: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: DB_TABLE_NAMES.SUBSCRIPTION_PLAN,
    required: true,
  })
  plan: string;

  @Prop({
    type: String,
    enum: Object.values(SUBSCRIPTION_STATUS),
    default: SUBSCRIPTION_STATUS.PENDING,
  })
  status: SUBSCRIPTION_STATUS;

  @Prop({
    type: String,
    enum: Object.values(BILLING_CYCLE),
    required: true,
  })
  billingCycle: BILLING_CYCLE;

  @Prop()
  currentPeriodStart?: Date;

  @Prop()
  currentPeriodEnd?: Date;

  @Prop()
  startDate?: Date;

  @Prop()
  trialEndDate?: Date;

  @Prop()
  nextBillingDate?: Date;

  @Prop()
  gracePeriodEnd?: Date;

  @Prop()
  cancelledAt?: Date;

  @Prop()
  endedAt?: Date;

  @Prop({
    type: String,
    enum: Object.values(PAYMENT_GATEWAY_NAME),
  })
  gateway?: PAYMENT_GATEWAY_NAME;

  @Prop()
  gatewayCustomerCode?: string;

  @Prop()
  gatewaySubscriptionCode?: string;

  @Prop()
  gatewayAuthorizationCode?: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: DB_TABLE_NAMES.SUBSCRIPTION_TRANSACTION,
  })
  lastTransaction?: string;

  @Prop({ default: 0 })
  currentFeaturedCount: number; // Track current featured properties

  @Prop({ default: true })
  autoRenewal: boolean;

  @Prop({ default: 0 })
  renewalRetryCount: number;
}

export type SubscriptionDocument = Subscription & Document;
export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
