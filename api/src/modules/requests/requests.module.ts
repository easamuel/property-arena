import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_TABLE_NAMES } from '@shared/constants';
import { UserModule } from '@modules/user/user.module';
import { TokenService } from '@helpers/jwt.token.service';
import { PlatformRecordSchema } from '@modules/platform/schemas/platform-record.schema';
import { PropertyRequestSchema } from './schemas/property-request.schema';
import { PropertyRequestDAL } from './dals/property-request.dal';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DB_TABLE_NAMES.REQUESTS, schema: PropertyRequestSchema },
      { name: DB_TABLE_NAMES.PLATFORM, schema: PlatformRecordSchema },
    ]),
    UserModule,
  ],
  controllers: [RequestsController],
  providers: [RequestsService, PropertyRequestDAL, TokenService],
  exports: [RequestsService],
})
export class RequestsModule {}
