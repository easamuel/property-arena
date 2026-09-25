import { PaginationRequestDTO } from "@shared/pagination";
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class ListCategoryQueryDto extends PaginationRequestDTO {}
