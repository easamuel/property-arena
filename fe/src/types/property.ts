import { MediaItem } from "@/components/property/PropertyGalleryStep";


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

export interface PropertyFormData {
  id?: string;
  title: string;
  propertyType: string;
  address: string;
  description: string;
  price: number;
  oldPrice?: number;
  currency: string;
  priceFrequency: string;
  isIntallmentPaymentAllowed: false;
  listingPurpose: string;

  status: string;
  garagesOrParkingSpaces: string;
  landArea: string;
  landAreaMeasurement: string;
  location: string;
  bedroom: string;
  document: [];

  // Gallery
  media: MediaItem[];

  // Features
  features: string[];

  // Agent & Review
  agent?: string;
  agentDisplayOption: 'none',
  selectedAgent: '';
  selectedAgentId?: string;
  reviewNotes: '',
}

export interface PropertyData extends PropertyFormData {
  id: string;
  propertyId: string;
}
export interface CreatePropertyRequest {
  propertyData: PropertyFormData;
}

export interface CreatePropertyResponse {
  id: string;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  property: any;
}
