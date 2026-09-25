import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { SkipAuth } from '@decorators/skip-auth.decorator';
import { CurrentUser } from '@decorators/currentUser.decorator';
import { AuthUser } from '@middlewares/auth.guard';
import { RequestsService } from './requests.service';
import {
  CreatePropertyRequestDto,
  ListPropertyRequestsQueryDto,
  RespondToRequestDto,
  UpdatePropertyRequestDto,
} from './dto/request.dto';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @SkipAuth()
  @Post()
  create(@Body() dto: CreatePropertyRequestDto) {
    return this.requestsService.create(dto);
  }

  @SkipAuth()
  @Get()
  list(@Query() query: ListPropertyRequestsQueryDto, @Req() req: Request) {
    return this.requestsService.listPublic(query, req);
  }

  @Get('mine')
  listMine(@CurrentUser() user: AuthUser) {
    return this.requestsService.listMine(user);
  }

  @SkipAuth()
  @Get(':id')
  getById(@Param('id') id: string, @Req() req: Request) {
    return this.requestsService.getById(id, req);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePropertyRequestDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.requestsService.update(id, dto, user);
  }

  @Post(':id/respond')
  respond(
    @Param('id') id: string,
    @Body() dto: RespondToRequestDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.requestsService.respond(id, dto, user);
  }
}
