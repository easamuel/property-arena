import { BaseSchema, Schema } from '@database/base.schema';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { DB_TABLE_NAMES } from '@shared/constants';
import { Document, SchemaTypes } from 'mongoose';
import { BILLING_CYCLE, PAYMENT_GATEWAY_NAME } from './subscription.schema';

export enum SUBSCRIPTION_TRANSACTION_STATUS {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  ABANDONED = 'abandoned',
  REFUNDED = 'refunded',
  REVERSED = 'reversed',
}

@Schema()
export class SubscriptionTransaction extends BaseSchema {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: DB_TABLE_NAMES.USERS,
    required: true,
  })
  user: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: DB_TABLE_NAMES.SUBSCRIPTION,
    required: true,
  })
  subscription: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: DB_TABLE_NAMES.SUBSCRIPTION_PLAN,
    required: true,
  })
  plan: string;

  @Prop({
    type: String,
    enum: Object.values(BILLING_CYCLE),
    required: true,
  })
  billingCycle: BILLING_CYCLE;

  // Amount in kobo, matching SubscriptionPlan.monthlyPrice/yearlyPrice.
  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ default: 'NGN' })
  currency: string;

  // Our generated reference, sent to the payment gateway on initialize.
  @Prop({ required: true, unique: true })
  reference: string;

  // The gateway's own transaction id, filled in on verify.
  @Prop()
  gatewayReference?: string;

  @Prop({
    type: String,
    enum: Object.values(PAYMENT_GATEWAY_NAME),
    required: true,
  })
  gateway: PAYMENT_GATEWAY_NAME;

  @Prop({
    type: String,
    enum: Object.values(SUBSCRIPTION_TRANSACTION_STATUS),
    default: SUBSCRIPTION_TRANSACTION_STATUS.PENDING,
  })
  status: SUBSCRIPTION_TRANSACTION_STATUS;

  @Prop()
  paidAt?: Date;

  @Prop({ type: SchemaTypes.Mixed })
  rawGatewayResponse?: Record<string, unknown>;
}

export type SubscriptionTransactionDocument = SubscriptionTransaction &
  Document;
export const SubscriptionTransactionSchema = SchemaFactory.createForClass(
  SubscriptionTransaction,
);
