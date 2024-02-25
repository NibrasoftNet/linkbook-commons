export interface PaginationResult<T> {
  items: T[];
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  totalPages: number;
}

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}
