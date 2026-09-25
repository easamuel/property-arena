import type { BaseSchema } from '../schema/base.schema';

export type ConvertStringsToArray<T> = {
  [K in keyof T]: T[K] extends string
    ?
        | string
        | string[]
        | { contains: string }
        | { exists: boolean }
        | { ne: string }
        | { nin: string[] }
        | { in: string[] }
    : T[K] extends number
      ?
          | number
          | number[]
          | { gt?: number; gte?: number; lt?: number; lte?: number }
          | { exists: boolean }
          | { ne: number }
          | { nin: number[] }
          | { in: number[] }
      : T[K] extends Date
        ?
            | Date
            | { gt?: Date; gte?: Date; lt?: Date; lte?: Date }
            | { exists: boolean }
            | { ne: Date }
        : T[K] | { exists: boolean } | { ne: T[K] };
} & {
  $or?: ConvertStringsToArray<T>[];
};

type NotEqualQuery<T> = { ne: T };
type ContainsQuery = { contains: string };
type ExistsQuery = { exists: boolean };
type DateFilterQuery = { gt?: Date; gte?: Date; lt?: Date; lte?: Date };
type NINQuery = { nin: string[] };
type INQuery = { in: string[] };

export class QueryParser {
  static parseQuery<T extends BaseSchema>(
    query: ConvertStringsToArray<Partial<T>>,
  ): ConvertStringsToArray<Partial<T>> {
    Object.entries(query).forEach(([key, value]) => {
      if (
        key === '$or' &&
        Array.isArray(value) &&
        value.every((v) => typeof v !== 'string') &&
        value.every((v) => typeof v !== 'number')
      ) {
        query[key] = this.parseOrCondition(value);
      } else if (this.isStringArray(value) || this.isNumberArray(value)) {
        query[key] = this.parseArrayToIn(value);
      } else if (typeof value === 'object') {
        query[key] = this.parseObjectCondition(value); // { status : { $in : ['pending', 'approved'] } }
      }
    });

    return query;
  }

  private static parseOrCondition<T extends BaseSchema>(
    conditions: ConvertStringsToArray<Partial<T>>[],
  ): ConvertStringsToArray<Partial<T>>[] {
    return conditions.map((condition) => this.parseQuery(condition));
  }

  private static isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every((v) => typeof v === 'string');
  }

  private static isNumberArray(value: unknown): value is number[] {
    return Array.isArray(value) && value.every((v) => typeof v === 'number');
  }

  private static parseArrayToIn(value: string[] | number[]): {
    $in: string[] | number[];
  } {
    return { $in: value };
  }

  private static parseObjectCondition<T extends object>(
    value: T,
  ): Record<string, unknown> | T {
    if (this.isContainsQuery(value)) return this.parseContains(value);
    if (this.isExistsQuery(value)) return this.parseExists(value);
    if (this.isNotEqualQuery(value)) return this.parseNotEqual(value);
    if (this.hasDateOperators(value)) return this.parseDateFilters(value);
    if (this.isNINQuery(value)) return this.parseNIN(value);
    if (this.isINQuery(value)) return this.parseIN(value);

    return value;
  }

  private static parseContains(value: ContainsQuery): {
    $regex: string;
    $options: string;
  } {
    return { $regex: value.contains, $options: 'i' };
  }

  private static parseNIN(value: NINQuery): { $nin: string[] } {
    return { $nin: value.nin };
  }

  private static parseIN(value: INQuery): { $in: string[] } {
    return { $in: value.in };
  }

  private static parseExists(value: ExistsQuery): { $exists: boolean } {
    return { $exists: value.exists };
  }

  private static parseNotEqual<T>(value: NotEqualQuery<T>): { $ne: T } {
    return { $ne: value.ne };
  }

  private static hasDateOperators(value: unknown): value is DateFilterQuery {
    return (
      typeof value === 'object' &&
      value !== null &&
      ('gt' in value || 'gte' in value || 'lt' in value || 'lte' in value)
    );
  }

  private static parseDateFilters(
    value: DateFilterQuery,
  ): Record<string, Date> {
    const query: Record<string, Date> = {};
    if (value.gt) query.$gt = value.gt;
    if (value.gte) query.$gte = value.gte;
    if (value.lt) query.$lt = value.lt;
    if (value.lte) query.$lte = value.lte;
    return query;
  }

  private static isContainsQuery(value: unknown): value is ContainsQuery {
    return typeof value === 'object' && value !== null && 'contains' in value;
  }

  private static isExistsQuery(value: unknown): value is ExistsQuery {
    return typeof value === 'object' && value !== null && 'exists' in value;
  }

  private static isNotEqualQuery<T>(value: unknown): value is NotEqualQuery<T> {
    return typeof value === 'object' && value !== null && 'ne' in value;
  }

  private static isNINQuery(value: unknown): value is NINQuery {
    return typeof value === 'object' && value !== null && 'nin' in value;
  }

  private static isINQuery(value: unknown): value is INQuery {
    return typeof value === 'object' && value !== null && 'in' in value;
  }
}
