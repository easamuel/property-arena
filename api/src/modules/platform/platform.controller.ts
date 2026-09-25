import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PlatformService } from './platform.service';
import { AdminGuard } from '@middlewares/admin.guard';
import { SkipAuth } from '@decorators/skip-auth.decorator';

@Controller('platform')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @UseGuards(AdminGuard)
  @Get('reports/summary')
  reports() {
    return this.platformService.reports();
  }

  @UseGuards(AdminGuard)
  @Get('settings/site')
  getSettings() {
    return this.platformService.getSettings();
  }

  @UseGuards(AdminGuard)
  @Patch('settings/site')
  saveSettings(@Body() body: Record<string, unknown>) {
    return this.platformService.saveSettings(body);
  }

  @SkipAuth()
  @Post('public/:kind')
  createPublic(@Param('kind') kind: string, @Body() body: Record<string, unknown>) {
    return this.platformService.create(kind, body, true);
  }

  @SkipAuth()
  @Get('content/:kind')
  listPublic(@Param('kind') kind: string, @Query('limit') limit?: string) {
    const parsed = limit ? Number(limit) : undefined;
    return this.platformService.listPublic(
      kind,
      parsed && !Number.isNaN(parsed) ? { limit: parsed } : undefined,
    );
  }

  @SkipAuth()
  @Get('content/:kind/:slug')
  getPublicBySlug(@Param('kind') kind: string, @Param('slug') slug: string) {
    return this.platformService.getPublicBySlug(kind, slug);
  }

  @UseGuards(AdminGuard)
  @Get(':kind')
  list(@Param('kind') kind: string) {
    return this.platformService.list(kind);
  }

  @UseGuards(AdminGuard)
  @Post(':kind')
  create(@Param('kind') kind: string, @Body() body: Record<string, unknown>) {
    return this.platformService.create(kind, body);
  }

  @UseGuards(AdminGuard)
  @Patch(':kind/:id')
  update(
    @Param('kind') kind: string,
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.platformService.update(kind, id, body);
  }

  @UseGuards(AdminGuard)
  @Delete(':kind/:id')
  remove(@Param('kind') kind: string, @Param('id') id: string) {
    return this.platformService.remove(kind, id);
  }
}
