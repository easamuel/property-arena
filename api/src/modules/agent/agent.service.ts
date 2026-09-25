import { HttpStatus, Injectable } from '@nestjs/common';
import { AgentDAL } from './dals/agent.dal';
import { Util } from '@shared/index';
import { CustomHttpException } from '@shared/exception.handler';

@Injectable()
export class AgentService {
  constructor(public readonly agentDAL: AgentDAL) {}
  async createAgent(payload: any, transaction?: any) {
    const agentId = await this.generateUniqueAgentId();

    const agent = await this.agentDAL.create(
      {
        ...payload,
        agentId,
      },
      transaction,
    );

    return agent;
  }

  async getAgentById(id: string) {
    const agent = await this.findAgent({ _id: id });
    return {
      message: 'Agent fetched successfully',
      data: agent,
    };
  }

  async getAgentByAgentId(agentId: string) {
    const agent = await this.findAgent({ agentId });

    return {
      message: 'Agent fetched successfully',
      data: agent,
    };
  }

  private async findAgent(query: Record<string, any>) {
    const agent = await this.agentDAL.findOne(query);

    if (!agent) {
      throw new CustomHttpException('agent not found', HttpStatus.BAD_REQUEST);
    }

    return agent;
  }

  // async getAgentByAgentId(id: string) {
  //   const agent = await this.agentDAL.findOne({ agentId: id });

  //   if (!agent) {
  //     throw new CustomHttpException('agent not found', HttpStatus.BAD_REQUEST);
  //   }

  // }

  async getAllAgents(queryFilters: any, selectFields?: string[] | null) {
    const query: Parameters<typeof this.agentDAL.paginate>[0] = {
      isDeleted: false,
    };

    if (queryFilters?.status) {
      query.status = queryFilters.status;
    }

    const agents = await this.agentDAL.paginate(
      query,
      queryFilters,
      selectFields ?? null,
    );

    return {
      message: 'Agents  fetched successfully',
      data: agents,
    };
  }

  async generateUniqueAgentId(): Promise<string> {
    const PREFIX = 'PAPR-AGT';
    const LENGTH = 6;
    let agentId: string;
    let exists = true;

    while (exists) {
      const randomPart = Util.generateRandomString(LENGTH);
      agentId = `${PREFIX}-${randomPart}`;
      exists = !!(await this.agentDAL.findOne({ agentId }));
    }

    return agentId;
  }
}
