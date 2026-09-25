import { BaseDAL } from '@database/dals';
import { Agent, AgentDocument } from '../schemas/agent.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { DB_TABLE_NAMES } from '@shared/constants';
import { Connection } from 'mongoose';
import { Model } from '@database/schema/types';

@Injectable()
export class AgentDAL extends BaseDAL<Agent, AgentDocument> {
  constructor(
    @InjectModel(DB_TABLE_NAMES.AGENT) agents: Model<AgentDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(agents, connection);
  }
}
