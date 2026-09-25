import { BaseSchema, Schema } from '@database/base.schema';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { DB_TABLE_NAMES } from '@shared/constants';
import { Document, SchemaTypes } from 'mongoose';

export enum REQUEST_PURPOSE {
  SALE = 'sale',
  RENT = 'rent',
  SHORTLET = 'shortlet',
  LEASE = 'lease',
}

export enum REQUEST_STATUS {
  OPEN = 'open',
  MATCHED = 'matched',
  CLOSED = 'closed',
}

export enum REQUEST_VISIBILITY {
  PUBLIC = 'public',
  AGENTS_ONLY = 'agents_only',
}

@Schema({ _id: false })
export class RequestResponseEntry {
  @Prop({ type: SchemaTypes.ObjectId, ref: DB_TABLE_NAMES.USERS, required: true })
  responderId: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

const RequestResponseSchema = SchemaFactory.createForClass(RequestResponseEntry);

@Schema()
export class PropertyRequest extends BaseSchema {
  @Prop({ type: String, enum: Object.values(REQUEST_PURPOSE), required: true })
  purpose: REQUEST_PURPOSE;

  @Prop({ required: true })
  propertyType: string;

  @Prop({ type: [String], default: [] })
  locations: string[];

  @Prop()
  budgetMin?: number;

  @Prop()
  budgetMax?: number;

  @Prop()
  bedrooms?: number;

  @Prop()
  bathrooms?: number;

  @Prop({ type: [String], default: [] })
  features: string[];

  @Prop()
  notes?: string;

  @Prop({ required: true })
  contactName: string;

  @Prop({ required: true })
  contactEmail: string;

  @Prop({ required: true })
  contactPhone: string;

  @Prop({
    type: String,
    enum: Object.values(REQUEST_STATUS),
    default: REQUEST_STATUS.OPEN,
  })
  status: REQUEST_STATUS;

  @Prop({
    type: String,
    enum: Object.values(REQUEST_VISIBILITY),
    default: REQUEST_VISIBILITY.PUBLIC,
  })
  visibility: REQUEST_VISIBILITY;

  @Prop({ type: SchemaTypes.ObjectId, ref: DB_TABLE_NAMES.USERS })
  ownerId?: string;

  @Prop({ default: 0 })
  responseCount: number;

  @Prop({ type: [RequestResponseSchema], default: [] })
  responses: RequestResponseEntry[];
}

export type PropertyRequestDocument = PropertyRequest & Document;
export const PropertyRequestSchema = SchemaFactory.createForClass(PropertyRequest);
