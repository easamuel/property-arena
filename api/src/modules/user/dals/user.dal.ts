import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { BaseDAL } from 'src/database/dals';
import { DB_TABLE_NAMES } from 'src/shared';

import { Model } from 'src/database/schema/types';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserDAL extends BaseDAL<User, UserDocument> {
  constructor(
    @InjectModel(DB_TABLE_NAMES.USERS) users: Model<UserDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(users, connection);
  }
}
