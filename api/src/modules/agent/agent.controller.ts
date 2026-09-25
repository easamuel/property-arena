import { Controller, Get, Param, Query } from '@nestjs/common';
import { AgentService } from './agent.service';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Get()
  getAllAgents(@Query() payload: any) {
    return this.agentService.getAllAgents(payload);
  }

  @Get('agentId/:agentId')
  getAgentByAgentId(@Param('agentId') agentId: string) {
    return this.agentService.getAgentByAgentId(agentId);
  }

  @Get(':id')
  getAgentById(@Param('id') id: string) {
    return this.agentService.getAgentById(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAgentDto: UpdateAgentDto) {
  //   return this.agentService.update(+id, updateAgentDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.agentService.remove(+id);
  // }
}
