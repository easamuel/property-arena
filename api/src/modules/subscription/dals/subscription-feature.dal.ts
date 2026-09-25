import { DB_TABLE_NAMES } from '@shared/constants';
import {
  SubscriptionFeature,
  SubscriptionFeatureDocument,
} from '../schemas/subscription-feature.schema';
import { BaseDAL } from '@database/dals';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Model } from '@database/schema/types';

@Injectable()
export class SubscriptionFeatureDAL extends BaseDAL<
  SubscriptionFeature,
  SubscriptionFeatureDocument
> {
  constructor(
    @InjectModel(DB_TABLE_NAMES.SUBSCRIPTION_FEATURE)
    subscriptionFeature: Model<SubscriptionFeatureDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(subscriptionFeature, connection);
  }
}
