import { Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { DB_TABLE_NAMES } from "@shared/constants";
import { CategorySchema } from "./schemas/category.schema";
import { CategoryDAL } from "./dals/category.dal";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DB_TABLE_NAMES.CATEGORY, schema: CategorySchema },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryDAL],
  exports: [CategoryService],
})
export class CategoryModule {}
