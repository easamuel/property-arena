import { BaseSchema, Schema } from '@database/base.schema';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { DB_TABLE_NAMES } from '@shared/constants';
import { Document, SchemaTypes } from 'mongoose';

// Broad grouping so entries from unrelated domains (payment gateway events,
// admin mutations, ...) can share one collection without colliding.
export enum AUDIT_CATEGORY {
  PAYMENT = 'payment',
  ADMIN = 'admin',
}

export enum AUDIT_STATUS {
  INFO = 'info',
  SUCCESS = 'success',
  FAILURE = 'failure',
}

@Schema()
export class AuditLog extends BaseSchema {
  @Prop({
    type: String,
    enum: Object.values(AUDIT_CATEGORY),
    required: true,
    index: true,
  })
  category: AUDIT_CATEGORY;

  // Domain-specific action name, e.g. "webhook_received" (payment),
  // "subscription_plan_updated" (admin). Kept as a free-form indexed string
  // rather than one global enum, since each category owns its own vocabulary.
  @Prop({ required: true, index: true })
  action: string;

  @Prop({
    type: String,
    enum: Object.values(AUDIT_STATUS),
    required: true,
  })
  status: AUDIT_STATUS;

  // Who performed the action - the admin/user id for admin actions. Omitted
  // for system-initiated events such as a gateway webhook.
  @Prop({ type: SchemaTypes.ObjectId, ref: DB_TABLE_NAMES.USERS })
  actor?: string;

  // Free-form identifier tying this entry to a specific record - a payment
  // reference, a subscription id, a plan id, etc.
  @Prop({ index: true })
  reference?: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: SchemaTypes.Mixed })
  meta?: Record<string, unknown>;
}

export type AuditLogDocument = AuditLog & Document;
export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
