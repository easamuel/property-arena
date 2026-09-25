import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_TABLE_NAMES } from '@shared/constants';
import { UserModule } from '@modules/user/user.module';
import { PropertyModule } from '@modules/property/property.module';
import { PlatformRecordSchema } from './schemas/platform-record.schema';
import { PlatformService } from './platform.service';
import { PlatformController } from './platform.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DB_TABLE_NAMES.PLATFORM, schema: PlatformRecordSchema },
    ]),
    UserModule,
    PropertyModule,
  ],
  controllers: [PlatformController],
  providers: [PlatformService],
})
export class PlatformModule {}
