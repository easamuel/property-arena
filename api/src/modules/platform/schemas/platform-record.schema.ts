import { BaseSchema, Schema } from '@database/base.schema';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema()
export class PlatformRecord extends BaseSchema {
  @Prop({ required: true, index: true })
  kind: string;

  @Prop({ type: SchemaTypes.Mixed, default: {} })
  data: Record<string, unknown>;
}

export type PlatformRecordDocument = PlatformRecord & Document;
export const PlatformRecordSchema = SchemaFactory.createForClass(PlatformRecord);
