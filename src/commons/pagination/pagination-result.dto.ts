import { Field, Int, ObjectType } from '@nestjs/graphql';

// eslint-disable-next-line @typescript-eslint/naming-convention
export function CreatePaginationResultDto<T>(ItemType: new () => T) {
  @ObjectType({ isAbstract: true })
  abstract class PaginationResultDtoClass {
    @Field(() => [ItemType])
    readonly items: T[];

    @Field(() => Int)
    readonly totalCount: number;

    @Field(() => Boolean)
    readonly hasNextPage: boolean;

    @Field(() => Boolean)
    readonly hasPreviousPage: boolean;

    @Field(() => Int)
    readonly currentPage: number;

    @Field(() => Int)
    readonly totalPages: number;

    constructor(
      items: T[],
      totalCount: number,
      hasNextPage: boolean,
      hasPreviousPage: boolean,
      currentPage: number,
      totalPages: number,
    ) {
      this.items = items;
      this.totalCount = totalCount;
      this.hasNextPage = hasNextPage;
      this.hasPreviousPage = hasPreviousPage;
      this.currentPage = currentPage;
      this.totalPages = totalPages;
    }
  }

  return PaginationResultDtoClass;
}
