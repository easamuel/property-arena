import { BaseSchema, Schema } from '@database/base.schema';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { DB_TABLE_NAMES } from '@shared/constants';
import { Document, SchemaTypes } from 'mongoose';

// -1 means unlimited for numeric feature values.
export enum FEATURE_KEY {
  MAX_LISTINGS = 'max_listings',
  MAX_FEATURED_LISTINGS = 'max_featured_listings',
  FEATURED_DURATION_DAYS = 'featured_duration_days',
  MAX_LEADS_PER_MONTH = 'max_leads_per_month',
  MAX_PROPERTY_REQUESTS_PER_MONTH = 'max_property_requests_per_month',
  PRIORITY_RANK = 'priority_rank',
}

@Schema()
export class SubscriptionFeature extends BaseSchema {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: DB_TABLE_NAMES.SUBSCRIPTION_PLAN,
    required: true,
  })
  plan: string;

  @Prop({
    type: String,
    enum: Object.values(FEATURE_KEY),
    required: true,
  })
  featureKey: FEATURE_KEY;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  value: number | boolean | string;
}

export type SubscriptionFeatureDocument = SubscriptionFeature & Document;
export const SubscriptionFeatureSchema =
  SchemaFactory.createForClass(SubscriptionFeature);
