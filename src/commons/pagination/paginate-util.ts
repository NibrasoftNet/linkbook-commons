import { BadRequestException } from '@nestjs/common';
import { FilterOperator, PaginateConfig } from './paginate-config.interface';
import { PaginationArgs } from './pagination-args.dto';
import { PaginationResult } from './pagination.interface';
import { Repository, SelectQueryBuilder } from 'typeorm';

export class PaginateUtil<T> {
  constructor(
    private readonly repository: Repository<T> | SelectQueryBuilder<T>,
  ) {}

  async paginate(
    paginationArgs: PaginationArgs,
    paginateConfig: PaginateConfig<T>,
  ): Promise<PaginationResult<T>> {
    const { page, limit, search, filters, sortBy, sortDirection } =
      paginationArgs;
    const {
      relations,
      loadEagerRelations,
      maxLimit,
      defaultSortBy,
      searchableColumns,
      filterableColumns,
      sortableColumns,
    } = paginateConfig;

    const currentPage = page ?? 1;
    const itemsPerPage = limit ?? maxLimit ?? 10;
    const queryBuilder =
      this.repository instanceof Repository
        ? this.repository.createQueryBuilder('entity')
        : this.repository;
    // Apply relations
    if (relations && loadEagerRelations) {
      queryBuilder.leftJoinAndSelect(relations.join(', '), 'related');
    }

    const entity = queryBuilder.alias;

    if (search && search.trim() !== '') {
      const searchConditions = searchableColumns.map(
        (column) => `${entity}.${column} LIKE :search`,
      );
      const searchQuery = searchConditions.join(' OR ');
      queryBuilder.andWhere(`(${searchQuery})`, {
        search: `%${search}%`,
      });
    }

    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        let filterWhere: string = '';
        let filterParam: any = {};
        const { key, operator, value } = filter;

        if (operator) {
          if (
            !filterableColumns
              .filter((item) => item.key === filter.key)
              .find((op) => op.operator.includes(operator))
          ) {
            throw new BadRequestException(
              `operator ${operator} not included in config of ${key}`,
            );
          }

          switch (operator) {
            case FilterOperator.EQ:
              filterWhere = `${key} = :${key}`;
              filterParam = { [key]: value };
              break;
            case FilterOperator.NE:
              filterWhere = `${key} != :${key}`;
              filterParam = { [key]: value };
              break;
            case FilterOperator.GT:
              filterWhere = `${key} > :${key}`;
              filterParam = { [key]: value };
              break;
            case FilterOperator.LT:
              filterWhere = `${key} < :${key}`;
              filterParam = { [key]: value };
              break;
            case FilterOperator.GTE:
              filterWhere = `${key} >= :${key}`;
              filterParam = { [key]: value };
              break;
            case FilterOperator.LTE:
              filterWhere = `${key} <= :${key}`;
              filterParam = { [key]: value };
              break;
            case FilterOperator.IN:
              filterWhere = `${key} IN (:...${key})`;
              filterParam = { [key]: value };
              break;
            case FilterOperator.NOT_IN:
              filterWhere = `${key} NOT IN (:...${key})`;
              filterParam = { [key]: value };
              break;
            case FilterOperator.LIKE:
              filterWhere = `${key} LIKE :${key}`;
              filterParam = { [key]: `%${value}%` };
              break;
            case FilterOperator.ILIKE:
              filterWhere = `${key} ILIKE :${key}`;
              filterParam = { [key]: `%${value}%` };
              break;
            case FilterOperator.NOT:
              filterWhere = `${key} != :${key}`;
              filterParam = { [key]: value };
              break;
            case FilterOperator.IS_NULL:
              filterWhere = `${key} IS NULL`;
              break;
            case FilterOperator.IS_NOT_NULL:
              filterWhere = `${key} IS NOT NULL`;
              break;
            default:
              break;
          }
        }
        queryBuilder.andWhere(filterWhere, filterParam);
      });
    }
    // Apply sorting
    if (sortBy) {
      if (!sortableColumns.find((sort) => sort === sortBy)) {
        throw new BadRequestException(
          `sort by ${sortBy} not included in config`,
        );
      }
      queryBuilder.orderBy(`${entity}.${sortBy}`, sortDirection);
    } else {
      queryBuilder.orderBy(`${entity}.${defaultSortBy[0]}`, defaultSortBy[1]);
    }

    // Paginate
    const totalCount = await queryBuilder.getCount();
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const validPage = Math.min(Math.max(currentPage, 1), totalPages);

    queryBuilder.skip((currentPage - 1) * limit).take(limit);

    const items = await queryBuilder.getMany();
    return {
      items,
      totalCount,
      hasNextPage: validPage < totalPages,
      hasPreviousPage: validPage > 1,
      currentPage: validPage,
      totalPages,
    };
  }
}
