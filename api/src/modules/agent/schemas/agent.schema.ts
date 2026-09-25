import { BaseSchema, Schema } from '@database/base.schema';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { DB_TABLE_NAMES } from '@shared/constants';
import { Document } from 'mongoose';
import { SchemaTypes } from 'mongoose';

export enum AGENT_STATUS {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  DEACTIVATED = 'deactivated',
}
@Schema()
export class Agent extends BaseSchema {
  @Prop()
  agentId: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: DB_TABLE_NAMES.USERS,
  })
  user: string;

  @Prop({ enum: AGENT_STATUS, default: AGENT_STATUS.INACTIVE })
  status: AGENT_STATUS;
}

export type AgentDocument = Agent & Document;
export const AgentSchema = SchemaFactory.createForClass(Agent);
