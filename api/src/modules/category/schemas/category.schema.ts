import { BaseSchema, Schema } from "@database/base.schema";
import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { DB_TABLE_NAMES } from "@shared/constants";
import { Document, SchemaTypes } from "mongoose";

@Schema()
export class Category extends BaseSchema {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: false })
  description?: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: DB_TABLE_NAMES.USERS,
  })
  creator: string;
}

export type CategoryDocument = Category & Document;
export const CategorySchema = SchemaFactory.createForClass(Category);
