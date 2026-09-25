import { PartialType } from '@nestjs/swagger';
import { PaginationRequestDTO } from '@shared/pagination';
import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
  IsArray,
  ValidateNested,
  IsMongoId,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  PROPERTY_STATUS,
  PROPERTY_TYPE,
  MediaType,
  DocumentType,
  LISTING_PURPOSE,
  CURRENCY_TYPE,
  AREA_MEASUREMENT,
  PRICE_FREQUENCY,
} from '../schemas/property.schema';

class AddressDto {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsOptional()
  zipCode?: string;
}

class MediaDto {
  @IsString()
  url: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  caption?: string;
}

class DocumentDto {
  @IsString()
  name: string;

  @IsString()
  file: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  uploadedAt?: Date;
}

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  oldPrice?: number;

  @IsOptional()
  @IsEnum(CURRENCY_TYPE)
  currency: CURRENCY_TYPE;

  @IsOptional()
  @IsEnum(PRICE_FREQUENCY)
  priceFrequency: PRICE_FREQUENCY;

  @IsEnum(LISTING_PURPOSE)
  listingPurpose: LISTING_PURPOSE;

  @IsEnum(PROPERTY_TYPE)
  propertyType: PROPERTY_TYPE;

  @IsOptional()
  @IsEnum(PROPERTY_STATUS)
  status?: PROPERTY_STATUS;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsString()
  landArea?: string;

  @IsOptional()
  @IsEnum(AREA_MEASUREMENT)
  landAreaMeasurement?: AREA_MEASUREMENT;

  @IsOptional()
  @IsString()
  garagesOrParkingSpaces?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  bedroom?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  media?: MediaType[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentDto)
  document?: DocumentDto[];

  @IsOptional()
  @IsString()
  agentId?: string;

  @IsOptional()
  @IsString()
  reviewNotes?: string;

  @IsOptional()
  @IsString()
  agentDisplayOption?: string;

  @IsOptional()
  @IsString()
  selectedAgentId?: string;
}

export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {}

export class ListPropertyQueryDto extends PaginationRequestDTO {
  @IsString()
  @IsOptional()
  @IsEnum(PROPERTY_TYPE)
  propertyType?: PROPERTY_TYPE;

  @IsString()
  @IsOptional()
  @IsEnum(PROPERTY_STATUS)
  status?: PROPERTY_STATUS;

  @IsOptional()
  @IsEnum(LISTING_PURPOSE)
  listingPurpose?: LISTING_PURPOSE;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  bedroom?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;
}

export class DeletePropertiesDto {
  @IsMongoId({ each: true })
  @IsArray()
  @IsNotEmpty()
  propertyIds: string[];
}

export class GetFeaturedPropertiesDTO extends PaginationRequestDTO {
  @IsOptional()
  @IsBoolean()
  excludeRecentlyShown?: boolean = true;
}
