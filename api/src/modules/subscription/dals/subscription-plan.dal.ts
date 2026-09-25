import { DB_TABLE_NAMES } from '@shared/constants';
import {
  SubscriptionPlan,
  SubscriptionPlanDocument,
} from '../schemas/subscription-plan.schema';
import { BaseDAL } from '@database/dals';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Model } from '@database/schema/types';

@Injectable()
export class SubscriptionPlanDAL extends BaseDAL<
  SubscriptionPlan,
  SubscriptionPlanDocument
> {
  constructor(
    @InjectModel(DB_TABLE_NAMES.SUBSCRIPTION_PLAN)
    subscriptionPlan: Model<SubscriptionPlanDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(subscriptionPlan, connection);
  }
}
