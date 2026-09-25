import { Injectable } from "@nestjs/common";
import { InjectModel, InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { BaseDAL } from "src/database/dals";
import { DB_TABLE_NAMES } from "src/shared";

import { Model } from "src/database/schema/types";
import { Category, CategoryDocument } from "../schemas/category.schema";

@Injectable()
export class CategoryDAL extends BaseDAL<Category, CategoryDocument> {
  constructor(
    @InjectModel(DB_TABLE_NAMES.CATEGORY) categories: Model<CategoryDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(categories, connection);
  }
}
