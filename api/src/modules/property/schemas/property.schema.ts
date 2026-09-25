import { BaseSchema, Schema } from '@database/base.schema';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { DB_TABLE_NAMES } from '@shared/constants';
import { Document, SchemaTypes } from 'mongoose';

export enum CURRENCY_TYPE {
  NGN = 'ngn',
  USD = 'usd',
}

export enum AREA_MEASUREMENT {
  SQM = 'sqm', // Square Meter
  SQFT = 'sqft', // Square Foot
  ACRE = 'acre', // Acre
  HECTARE = 'hectare', // Hectare
}
export enum PROPERTY_STATUS {
  AVAILABLE = 'available',
  PENDING = 'pending',
  SOLD = 'sold',
  RENTED = 'rented',
}

export enum PROPERTY_TYPE {
  CO_WORKING_SPACE = 'co-working space',
  COMMERCIAL = 'commercial property',
  FLATS_OR_APARTMENTS = 'flats or apartments',
  HOUSE = 'house',
  LAND = 'land',
}

export enum LISTING_PURPOSE {
  SALE = 'sale',
  RENT = 'rent',
  LEASE = 'lease',
  SHORTLET = 'shortlet',
}

export enum PRICE_FREQUENCY {
  PER_DAY = 'per day',
  PER_WEEK = 'per week',
  PER_MONTH = 'per month',
  PER_YEAR = 'per year',
  PER_SQM = 'per sqm',
  PER_SQFT = 'per sqft',
  PER_ROOM = 'per room',
  FULL = 'full',
}

export enum FEATURED_STATUS {
  NOT_FEATURED = 'not_featured',
  FEATURED = 'featured',
  EXPIRED = 'expired',
}

export enum PROPERTY_SUB_TYPE {}

export type MediaType = {
  url: string;
  type: string;
  caption?: string;
};

export type DocumentType = {
  name: string;
  file: string;
  type?: string;
  uploadedAt?: Date;
};

@Schema()
export class Property extends BaseSchema {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: SchemaTypes.Number, min: 0 })
  price: number;

  @Prop({ required: true })
  currency: CURRENCY_TYPE;

  @Prop()
  oldPrice?: number;

  @Prop({ enum: PRICE_FREQUENCY, required: true })
  priceFrequency: PRICE_FREQUENCY;

  @Prop()
  isIntallmentPaymentAllowed?: boolean;

  @Prop()
  propertyId?: string;

  @Prop({ type: String, enum: PROPERTY_TYPE, required: true })
  propertyType: PROPERTY_TYPE;

  @Prop({
    type: String,
    enum: LISTING_PURPOSE,
    required: true,
  })
  listingPurpose?: LISTING_PURPOSE;

  @Prop({
    type: String,
    enum: PROPERTY_STATUS,
    default: PROPERTY_STATUS.AVAILABLE,
  })
  status?: PROPERTY_STATUS;

  @Prop({
    required: true,
  })
  address: string;

  @Prop()
  landArea?: string;

  @Prop({
    type: String,
    enum: AREA_MEASUREMENT,
    default: AREA_MEASUREMENT.SQM,
  })
  landAreaMeasurement?: AREA_MEASUREMENT;

  @Prop()
  garagesOrParkingSpaces?: string;

  @Prop()
  location?: string;

  @Prop()
  bedroom?: string;

  @Prop([{ type: String }])
  features?: string[];

  @Prop({ type: [SchemaTypes.Mixed], required: false })
  media?: MediaType[];

  @Prop({ type: [SchemaTypes.Mixed], required: false })
  document?: DocumentType[];

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: DB_TABLE_NAMES.USERS,
  })
  owner: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: DB_TABLE_NAMES.AGENT,
  })
  agent?: string;

  @Prop()
  reviewNotes?: string;

  @Prop()
  agentDisplayOption?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: DB_TABLE_NAMES.AGENT })
  selectedAgent?: string;

  // Featured Properties Fields
  @Prop({ default: false })
  isFeatured?: boolean;

  @Prop({
    type: String,
    enum: Object.values(FEATURED_STATUS),
    default: FEATURED_STATUS.NOT_FEATURED,
  })
  featuredStatus?: FEATURED_STATUS;

  @Prop()
  featuredStartDate?: Date;

  @Prop()
  featuredEndDate?: Date;

  @Prop({ default: 1 })
  featuredPriority?: number; // Higher number = higher priority

  @Prop({ default: 1 })
  featuredViewCount?: number; // Track views for rotation logic

  @Prop()
  lastFeaturedDisplay?: Date; // Track when last shown

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Subscription',
  })
  subscription?: string;
}

export type PropertyDocument = Property & Document;
export const PropertySchema = SchemaFactory.createForClass(Property);

PropertySchema.index({ title: 'text', address: 'text', location: 'text', description: 'text' });
PropertySchema.index({ listingPurpose: 1, propertyType: 1, price: 1 });
PropertySchema.index({ location: 1, price: 1 });
PropertySchema.index({ status: 1, isDeleted: 1, createdAt: -1 });
