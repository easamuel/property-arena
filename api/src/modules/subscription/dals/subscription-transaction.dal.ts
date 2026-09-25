import { DB_TABLE_NAMES } from '@shared/constants';
import {
  SubscriptionTransaction,
  SubscriptionTransactionDocument,
} from '../schemas/subscription-transaction.schema';
import { BaseDAL } from '@database/dals';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Model } from '@database/schema/types';

@Injectable()
export class SubscriptionTransactionDAL extends BaseDAL<
  SubscriptionTransaction,
  SubscriptionTransactionDocument
> {
  constructor(
    @InjectModel(DB_TABLE_NAMES.SUBSCRIPTION_TRANSACTION)
    subscriptionTransaction: Model<SubscriptionTransactionDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(subscriptionTransaction, connection);
  }
}
