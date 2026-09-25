import { DB_TABLE_NAMES } from '@shared/constants';
import {
  Subscription,
  SubscriptionDocument,
} from '../schemas/subscription.schema';
import { BaseDAL } from '@database/dals';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Model } from '@database/schema/types';

@Injectable()
export class SubscriptionDAL extends BaseDAL<
  Subscription,
  SubscriptionDocument
> {
  constructor(
    @InjectModel(DB_TABLE_NAMES.SUBSCRIPTION)
    subscription: Model<SubscriptionDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(subscription, connection);
  }
}
