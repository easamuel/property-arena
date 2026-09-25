import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { UserDAL } from './dals/user.dal';
import { DB_TABLE_NAMES } from '@shared/constants';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DB_TABLE_NAMES.USERS, schema: UserSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserDAL],
  exports: [UserService],
})
export class UserModule {}
