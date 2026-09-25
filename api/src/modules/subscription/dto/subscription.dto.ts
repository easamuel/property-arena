import { PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  PLAN_USER_TYPE,
  PlanUserType,
} from '../schemas/subscription-plan.schema';
import { FEATURE_KEY } from '../schemas/subscription-feature.schema';
import { BILLING_CYCLE } from '../schemas/subscription.schema';

export class SubscriptionFeatureInputDto {
  @IsEnum(FEATURE_KEY)
  featureKey: FEATURE_KEY;

  @IsNotEmpty()
  value: number | boolean | string;
}

export class CreateSubscriptionPlanDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsEnum(PLAN_USER_TYPE)
  userType: PlanUserType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  monthlyPrice: number;

  @IsNumber()
  @Min(0)
  yearlyPrice: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  trialDays?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubscriptionFeatureInputDto)
  features?: SubscriptionFeatureInputDto[];

  @IsOptional()
  @IsString()
  badgeLabel?: string;

  @IsOptional()
  @IsString()
  badgeColor?: string;

  @IsOptional()
  @IsString()
  badgeIcon?: string;
}

export class UpdateSubscriptionPlanDto extends PartialType(
  CreateSubscriptionPlanDto,
) {}

export class CheckoutDto {
  @IsMongoId()
  planId: string;

  @IsEnum(BILLING_CYCLE)
  billingCycle: BILLING_CYCLE;

  // Must be a same-origin relative path (e.g. "/subscription/confirm") so the
  // gateway callback can't be pointed at an external domain.
  @IsOptional()
  @IsString()
  @Matches(/^\/(?!\/)[a-zA-Z0-9\-_/?=&%.]*$/, {
    message: 'redirectPath must be a relative path starting with "/"',
  })
  redirectPath?: string;
}
