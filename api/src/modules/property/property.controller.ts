import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import {
  CreatePropertyDto,
  DeletePropertiesDto,
  ListPropertyQueryDto,
  UpdatePropertyDto,
} from './dto/property.dto';
import { CurrentUser } from '@decorators/currentUser.decorator';
import { AuthUser } from '@middlewares/auth.guard';
import { SkipAuth } from '@decorators/skip-auth.decorator';
import { AdminGuard } from '@middlewares/admin.guard';
import { PROPERTY_STATUS } from './schemas/property.schema';
import { PROPERTY_ENUMS } from 'src/enums/property.enum';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Body() createPropertyDto: CreatePropertyDto,
  ) {
    return this.propertyService.createProperty(user, createPropertyDto);
  }

  @SkipAuth()
  @Get()
  getAllProperties(@Query() query: ListPropertyQueryDto) {
    return this.propertyService.getAllProperties(query);
  }

  @Get('user')
  getUserProperties(
    @CurrentUser() user: AuthUser,
    @Query() query: ListPropertyQueryDto,
  ) {
    return this.propertyService.getUserProperties(user, query);
  }

  @SkipAuth()
  @Get('featured')
  getFeaturedProperties(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.propertyService.getFeaturedProperties({
      page: Number(page),
      limit: Number(limit),
    });
  }

  @SkipAuth()
  @Get('enums')
  getPropertyEnums() {
    return { message: 'Enums fetched successfully', data: PROPERTY_ENUMS };
  }

  @Delete()
  deleteProperties(
    @CurrentUser() user: AuthUser,
    @Body() payload: DeletePropertiesDto,
  ) {
    return this.propertyService.deleteProperties(payload, user);
  }

  @Delete(':id')
  deleteProperty(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.propertyService.deleteProperties({ propertyIds: [id] }, user);
  }

  @SkipAuth()
  @Get(':id')
  findOnePropertry(@Param('id') id: string) {
    return this.propertyService.findOnePropertry(id);
  }

  @UseGuards(AdminGuard)
  @Patch(':id/moderate')
  moderate(
    @Param('id') id: string,
    @Body() body: { status?: PROPERTY_STATUS; reviewNotes?: string },
  ) {
    return this.propertyService.moderateProperty(id, body);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertyService.updateProperty(id, updatePropertyDto, user);
  }

  @Post(':id/feature')
  featureProperty(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.propertyService.featureProperty(id, user.id);
  }

  @Post(':id/track-view')
  trackView(@Param('id') id: string) {
    return this.propertyService.trackFeaturedView(id);
  }
}
