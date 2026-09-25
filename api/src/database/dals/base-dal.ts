import { ClientSession, Connection, Document, FilterQuery } from 'mongoose';

import { Util, PaginationRequestDTO } from 'src/shared';
import config from 'src/config/configuration';

import { ConvertStringsToArray, QueryParser } from './query-parser';
import { BaseSchema } from '../schema/base.schema';
import { Model } from '../schema/types';

type QueryPopulate = {
  path: string;
  select?: string;
  populate?: QueryPopulate[];
};

type SortQuery<T> = {
  [key in keyof T]?: 1 | -1;
};

export class Transaction {
  constructor(public readonly session: ClientSession) {}
}

export class BaseDAL<T extends BaseSchema, D extends Document & T> {
  constructor(
    protected readonly model: Model<D>,
    protected readonly connection: Connection,
  ) {}

  async create<K extends T | T[]>(doc: K, transaction?: Transaction) {
    if (transaction) {
      const isArray = Array.isArray(doc);
      const created = await this.model.create(isArray ? doc : [doc], {
        session: transaction.session,
      });

      return (isArray ? created : created[0]) as unknown as Promise<
        K extends T ? T : T[]
      >;
    }

    return this.model.create(doc) as unknown as Promise<K extends T ? T : T[]>;
  }

  find(
    query: ConvertStringsToArray<Partial<T>>,
    select?: string[],
    populate?: QueryPopulate[],
    sort?: SortQuery<T>,
  ): Promise<T[]> {
    QueryParser.parseQuery(query);

    const q = this.model.find(query);
    if (select) {
      q.select(select);
    }

    if (populate) {
      q.populate(populate);
    }

    if (sort) {
      q.sort(sort);
    }

    return q;
  }

  findOne(
    query: ConvertStringsToArray<Partial<T>>,
    select?: string[],
    populate?: QueryPopulate[],
    sort?: SortQuery<T>,
  ): Promise<T | null> {
    QueryParser.parseQuery(query);

    const q = this.model.findOne(query);
    if (select) {
      q.select(select);
    }

    if (populate) {
      q.populate(populate);
    }

    if (sort) {
      q.sort(sort);
    }

    return q;
  }

  async exists(query: ConvertStringsToArray<Partial<T>>): Promise<boolean> {
    QueryParser.parseQuery(query);

    return !!(await this.model.exists(query));
  }

  updateOne(
    query: ConvertStringsToArray<Partial<T>>,
    update?: Partial<T>,
    unset?: Partial<Record<keyof T, boolean>>,
    transaction?: Transaction,
    inc?: Partial<Record<keyof T, number>>,
  ) {
    QueryParser.parseQuery(query);

    const mongoUpdate = {
      ...(update ? { $set: update } : {}),
      ...(unset ? { $unset: unset } : {}),
      ...(inc ? { $inc: inc } : {}),
    } as unknown as Parameters<typeof this.model.findOneAndUpdate>[1];

    return this.model.findOneAndUpdate(query, mongoUpdate, {
      new: true,
      upsert: false,
      session: transaction?.session,
    });
  }

  updateMany(
    query: ConvertStringsToArray<Partial<T>>,
    update?: Partial<T>,
    unset?: Partial<Record<keyof T, boolean>>,
    transaction?: Transaction,
  ) {
    QueryParser.parseQuery(query);

    const mongoUpdate = {
      ...(update ? { $set: update } : {}),
      ...(unset ? { $unset: unset } : {}),
    } as unknown as Parameters<typeof this.model.updateMany>[1];

    return this.model
      .updateMany(query, mongoUpdate, { session: transaction?.session })
      .then((updateResponse) => updateResponse.modifiedCount);
  }

  paginate(
    query: ConvertStringsToArray<Partial<T>>,
    options: PaginationRequestDTO,
    select?: string[],
    searchFields?: string[],
    populate?: QueryPopulate[],
  ) {
    QueryParser.parseQuery(query);

    const mongoQuery = query as FilterQuery<T>;
    const paginationOptions = Util.getPaginateOptions(
      options,
      populate,
      { createdAt: -1 },
      select,
    );

    if (searchFields && options.search) {
      mongoQuery.$or = searchFields.map((field) => ({
        [field]: { $regex: options.search, $options: 'i' },
      })) as FilterQuery<T>[];
    }

    return this.model.paginate(
      mongoQuery,
      paginationOptions,
    ) as unknown as Promise<{
      data: T[];
      total: number;
      limit: number;
      pageCount: number;
      currentPage: number;
      hasPrevPage: boolean;
      hasNextPage: boolean;
      pagingCounter: number;
      offset: number;
    }>;
  }

  bulkUpdate(
    payload: {
      filter: ConvertStringsToArray<Partial<T>>;
      update?: Partial<T>;
      unset?: Partial<Record<keyof T, boolean>>;
    }[],
    transaction?: Transaction,
  ) {
    const bulkOps: Parameters<typeof this.model.bulkWrite>[0] = payload.map(
      (i) => ({
        updateOne: {
          filter: QueryParser.parseQuery(i.filter),
          update: {
            ...(i.update ? { $set: i.update } : {}),
            ...(i.unset ? { $unset: i.unset } : {}),
          },
        },
      }),
    );

    return this.model
      .bulkWrite(bulkOps, { session: transaction?.session })
      .then((res) => res.modifiedCount);
  }

  count(query: ConvertStringsToArray<Partial<T>>) {
    QueryParser.parseQuery(query);

    return this.model.countDocuments(query);
  }

  findOrCreate(
    query: ConvertStringsToArray<Partial<T>>,
    doc: T,
    transaction?: Transaction,
  ) {
    QueryParser.parseQuery(query);
    return this.model.findOneAndUpdate(
      query,
      { $setOnInsert: doc },
      { new: true, upsert: true, session: transaction?.session },
    );
  }

  deleteMany(
    query: ConvertStringsToArray<Partial<T>>,
    transaction?: Transaction,
  ) {
    QueryParser.parseQuery(query);

    return this.model.deleteMany(query, { session: transaction?.session });
  }

  transaction<K>(callback: (transaction: Transaction) => Promise<K>) {
    const { database } = config();
    if (!database.enableTransactions) {
      // If transactions are disabled, execute the callback without a session
      return callback(new Transaction(null as unknown as ClientSession));
    }
    return this.connection.transaction((session) => {
      const transactionHandle = new Transaction(session);
      return callback(transactionHandle);
    });
  }
}
