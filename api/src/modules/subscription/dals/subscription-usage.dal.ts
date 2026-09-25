import { DB_TABLE_NAMES } from '@shared/constants';
import {
  SubscriptionUsage,
  SubscriptionUsageDocument,
} from '../schemas/subscription-usage.schema';
import { BaseDAL } from '@database/dals';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Model } from '@database/schema/types';

@Injectable()
export class SubscriptionUsageDAL extends BaseDAL<
  SubscriptionUsage,
  SubscriptionUsageDocument
> {
  constructor(
    @InjectModel(DB_TABLE_NAMES.SUBSCRIPTION_USAGE)
    usage: Model<SubscriptionUsageDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(usage, connection);
  }
}
