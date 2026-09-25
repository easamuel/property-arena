import { BaseSchema, Schema } from '@database/base.schema';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ROLE_ENUM } from '@modules/user/schemas/user.schema';
import { Document } from 'mongoose';

// Plans are only offered to professional user types; buyers/tenants (ROLE_ENUM.USER) stay free.
export const PLAN_USER_TYPE = {
  AGENT: ROLE_ENUM.AGENT,
  DEVELOPER: ROLE_ENUM.DEVELOPER,
  LANDLORD: ROLE_ENUM.LANDLORD,
} as const;

export type PlanUserType = (typeof PLAN_USER_TYPE)[keyof typeof PLAN_USER_TYPE];

@Schema()
export class SubscriptionPlan extends BaseSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({
    type: String,
    enum: Object.values(PLAN_USER_TYPE),
    required: true,
  })
  userType: PlanUserType;

  @Prop()
  description?: string;

  // Stored in kobo (smallest NGN unit) to avoid floating point issues.
  @Prop({ required: true, min: 0 })
  monthlyPrice: number;

  @Prop({ required: true, min: 0 })
  yearlyPrice: number;

  @Prop({ default: 'NGN' })
  currency: string;

  @Prop({ default: 0 })
  trialDays: number;

  @Prop({ default: 3 })
  gracePeriodDays: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  /** Shown on listings / profiles for active subscribers of this plan. */
  @Prop()
  badgeLabel?: string;

  @Prop({ default: 'green' })
  badgeColor?: string;

  @Prop()
  badgeIcon?: string;
}

export type SubscriptionPlanDocument = SubscriptionPlan & Document;
export const SubscriptionPlanSchema =
  SchemaFactory.createForClass(SubscriptionPlan);
