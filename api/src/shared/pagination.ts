import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsPositive } from 'class-validator';

export class PaginationRequestDTO {
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  page?: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  all?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  sort?: string;
}
