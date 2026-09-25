import { Module, forwardRef } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { DB_TABLE_NAMES } from '@shared/constants';
import { PropertySchema } from './schemas/property.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PropertyDAL } from './dals/property.dal';
import { SubscriptionModule } from '@modules/subscription/subscription.module';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DB_TABLE_NAMES.PROPERTY, schema: PropertySchema },
    ]),
    forwardRef(() => SubscriptionModule),
    UserModule,
  ],
  controllers: [PropertyController],
  providers: [PropertyService, PropertyDAL],
  exports: [PropertyService, PropertyDAL],
})
export class PropertyModule {}
