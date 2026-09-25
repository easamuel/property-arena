import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { AgentDAL } from './dals/agent.dal';
import { AgentSchema } from './schemas/agent.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_TABLE_NAMES } from '@shared/constants';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DB_TABLE_NAMES.AGENT, schema: AgentSchema },
    ]),
  ],
  controllers: [AgentController],
  providers: [AgentService, AgentDAL],
  exports: [AgentService],
})
export class AgentModule {}
