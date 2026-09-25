import { Module } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { TransactionsController } from "./transactions.controller";
import { TransactionSchema } from "./schemas/transaction.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { DB_TABLE_NAMES } from "@shared/constants";
import { TransactionDAL } from "./dals/transaction.dal";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DB_TABLE_NAMES.TRANSACTION, schema: TransactionSchema },
    ]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionDAL],
  exports: [TransactionsService],
})
export class TransactionsModule {}
