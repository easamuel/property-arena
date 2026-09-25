import { BaseSchema, Schema } from '@database/base.schema';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { DB_TABLE_NAMES } from '@shared/constants';
import { Document, SchemaTypes } from 'mongoose';
import { FEATURE_KEY } from './subscription-feature.schema';

@Schema()
export class SubscriptionUsage extends BaseSchema {
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
    type: String,
    enum: Object.values(FEATURE_KEY),
    required: true,
  })
  featureKey: FEATURE_KEY;

  @Prop({ default: 0, min: 0 })
  usageCount: number;

  @Prop({ required: true })
  periodStart: Date;

  @Prop({ required: true })
  periodEnd: Date;
}

export type SubscriptionUsageDocument = SubscriptionUsage & Document;
export const SubscriptionUsageSchema =
  SchemaFactory.createForClass(SubscriptionUsage);

SubscriptionUsageSchema.index(
  { subscription: 1, featureKey: 1, periodStart: 1, periodEnd: 1 },
  { unique: true },
);
