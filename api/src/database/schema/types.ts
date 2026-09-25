import {
  Document,
  Model as M,
  PopulateOptions,
  PaginateModel,
  SortOrder,
} from 'mongoose';

export type FormattedValidationErrors = {
  [x: string]: string | FormattedValidationErrors;
};

export type Model<T extends Document> = M<T> & PaginateModel<T>;
export type DBModel<T extends Document> = Model<T> &
  PaginateModel<T> & {
    aggregatePaginate(aggregateQuery, options, callback);
  };

export type LogContext = Record<string, unknown> & {
  event: string;
};

export type QueryPopulateOptions = PopulateOptions | PopulateOptions[];

export type SortArgs =
  | string
  | {
      [key: string]:
        | SortOrder
        | {
            $meta: 'textScore';
          };
    };
