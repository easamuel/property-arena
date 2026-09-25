import { Injectable } from "@nestjs/common";
import { InjectModel, InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { BaseDAL } from "src/database/dals";
import { DB_TABLE_NAMES } from "src/shared";

import { Model } from "src/database/schema/types";
import {
  Transaction,
  TransactionDocument,
} from "../schemas/transaction.schema";

@Injectable()
export class TransactionDAL extends BaseDAL<Transaction, TransactionDocument> {
  constructor(
    @InjectModel(DB_TABLE_NAMES.TRANSACTION)
    transactions: Model<TransactionDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(transactions, connection);
  }
}
