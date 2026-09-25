import { ValidationError } from '@nestjs/common';
import moment from 'moment';

// import { QueryPopulateOptions } from 'src/database/schemas';

import { PaginationRequestDTO } from '../shared/pagination';
import { stringGenerator } from '../shared/random-string-generator';
import { QueryPopulateOptions } from 'src/database/schema/types';

type FormattedValidationErrors = {
  [x: string]: string | FormattedValidationErrors;
};

export class Util {
  static formatValidationErrors(
    errorsToFromat: ValidationError[],
  ): FormattedValidationErrors {
    return errorsToFromat.reduce((accumulator, error: ValidationError) => {
      let constraints: string | FormattedValidationErrors;
      if (Array.isArray(error.children) && error.children.length) {
        constraints = this.formatValidationErrors(error.children);
      } else {
        const hasContraints = !!error.constraints;
        if (hasContraints) {
          let items = Object.values(error.constraints);
          const lastItem = items.pop();
          items = [items.join(', '), lastItem].filter((item) => item);
          constraints = items.join(' and ');
        } else {
          constraints = '';
        }
      }
      return {
        ...accumulator,
        [error.property]: constraints,
      };
    }, {} as FormattedValidationErrors);
  }

  static generateRandomString(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    if (length <= 0) {
      throw new Error('Length must be a positive integer.');
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters[randomIndex];
    }

    return result;
  }

  static getPaginateOptions(
    paginateDTO: PaginationRequestDTO,
    populate?: QueryPopulateOptions,
    sort?: string | Record<string, unknown>,
    select?: string | Record<string, unknown> | string[],
  ) {
    const { page = 1, limit = 10 } = paginateDTO;
    let { all } = paginateDTO;

    if (+limit === -1) {
      all = 'true';
    }

    const pagination = !(
      all === '1' ||
      all === 'true' ||
      all === 'yes' ||
      all === 'on'
    );

    const opts = {
      customLabels: {
        docs: 'data',
        totalPages: 'pageCount',
        limit: 'limit',
        totalDocs: 'total',
        prevPage: 'previousPage',
      },
      page,
      limit,
      pagination,
      select,
      populate,
      sort,
    };
    if (!populate) {
      delete opts.populate;
    }
    if (!sort) {
      delete opts.sort;
    }

    return opts;
  }

  static calculatePercentageIncrease(trend: number[]): number {
    if (trend.length < 2) return 0;
    const last = trend[trend.length - 1];
    const secondLast = trend[trend.length - 2];
    if (last === 0) return 0;
    if (secondLast === 0) return 100;
    return ((last - secondLast) / secondLast) * 100;
  }

  static formatDate(date: Date, format?: string): string {
    return moment(date).format(format || 'Do MMM, YYYY');
  }
  static formatCurrency(amount: number) {
    return Math.floor(amount * 100) / 100;
  }

  static generateIdentifier(existingIdentifiers?: string[]) {
    const references = existingIdentifiers || [];
    let identifier = null;
    let checkExistence = true;
    while (checkExistence) {
      identifier = stringGenerator({
        length: 15,
        outputOption: 'alphanumeric',
        capitalization: 'lowercase',
      });
      checkExistence = references.includes(identifier);
    }
    return identifier;
  }
}
