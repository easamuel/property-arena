import { DB_TABLE_NAMES } from '@shared/constants';
import {
  SubscriptionEvent,
  SubscriptionEventDocument,
} from '../schemas/subscription-event.schema';
import { BaseDAL } from '@database/dals';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Model } from '@database/schema/types';

@Injectable()
export class SubscriptionEventDAL extends BaseDAL<
  SubscriptionEvent,
  SubscriptionEventDocument
> {
  constructor(
    @InjectModel(DB_TABLE_NAMES.SUBSCRIPTION_EVENT)
    subscriptionEvent: Model<SubscriptionEventDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(subscriptionEvent, connection);
  }
}
