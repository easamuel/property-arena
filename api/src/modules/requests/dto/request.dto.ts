import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationRequestDTO } from '@shared/pagination';
import {
  REQUEST_PURPOSE,
  REQUEST_STATUS,
  REQUEST_VISIBILITY,
} from '../schemas/property-request.schema';

export class CreatePropertyRequestDto {
  @IsEnum(REQUEST_PURPOSE)
  purpose: REQUEST_PURPOSE;

  @IsString()
  @IsNotEmpty()
  propertyType: string;

  @IsArray()
  @IsString({ each: true })
  locations: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  budgetMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  budgetMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bathrooms?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @IsString()
  notes?: string;

  @IsString()
  @IsNotEmpty()
  contactName: string;

  @IsEmail()
  contactEmail: string;

  @IsString()
  @IsNotEmpty()
  contactPhone: string;

  @IsOptional()
  @IsEnum(REQUEST_VISIBILITY)
  visibility?: REQUEST_VISIBILITY;
}

export class UpdatePropertyRequestDto {
  @IsOptional()
  @IsEnum(REQUEST_PURPOSE)
  purpose?: REQUEST_PURPOSE;

  @IsOptional()
  @IsString()
  propertyType?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  locations?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  budgetMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  budgetMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bathrooms?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  contactName?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsEnum(REQUEST_STATUS)
  status?: REQUEST_STATUS;

  @IsOptional()
  @IsEnum(REQUEST_VISIBILITY)
  visibility?: REQUEST_VISIBILITY;
}

export class ListPropertyRequestsQueryDto extends PaginationRequestDTO {
  @IsOptional()
  @IsEnum(REQUEST_PURPOSE)
  purpose?: REQUEST_PURPOSE;

  @IsOptional()
  @IsString()
  propertyType?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  budgetMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  budgetMax?: number;
}

export class RespondToRequestDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
