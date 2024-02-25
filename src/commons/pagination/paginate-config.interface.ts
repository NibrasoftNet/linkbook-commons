// Define a type that represents the keys of a type T that are strings
import { OrderDirection } from './pagination.interface';

type StringKeys<T> = Extract<keyof T, string>;

// Define a mapped type to extract only relations from the entity T
type RelationsOfType<T> = {
  [K in StringKeys<T>]?: T[K] extends object ? K : never;
}[StringKeys<T>];

// Define a mapped type to extract only non-relation columns from the entity T
type ColumnsOfType<T> = {
  [K in StringKeys<T>]?: T[K] extends object ? never : K;
}[StringKeys<T>];

export interface PaginateConfig<T> {
  relations?: RelationsOfType<T>[];
  loadEagerRelations?: boolean;
  sortableColumns?: ColumnsOfType<T>[];
  sortDirection?: OrderDirection;
  defaultSortBy?: [ColumnsOfType<T>, OrderDirection];
  maxLimit?: number;
  searchableColumns?: ColumnsOfType<T>[];
  filterableColumns?: {
    key: ColumnsOfType<T>;
    operator: FilterOperator[];
  }[];
}

export enum FilterOperator {
  EQ = 'eq',
  NE = 'ne',
  GT = 'gt',
  LT = 'lt',
  GTE = 'gte',
  LTE = 'lte',
  IN = 'in',
  NOT_IN = 'not_in',
  LIKE = 'like',
  ILIKE = 'ilike',
  NOT = 'not',
  IS_NULL = 'is_null',
  IS_NOT_NULL = 'is_not_null',
}
