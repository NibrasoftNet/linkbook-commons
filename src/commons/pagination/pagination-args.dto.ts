import { DynamicFilter } from './filter.input';
import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderDirection } from './pagination.interface';

@InputType()
export class PaginationArgs {
  @Field(() => Int, { defaultValue: 1 })
  @IsOptional()
  page: number;

  @Field(() => Int, { defaultValue: 10 })
  @IsOptional()
  limit: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  sortBy?: string;

  @Field({ nullable: true })
  @ValidateIf((o) => o.sortBy)
  @IsEnum(OrderDirection)
  sortDirection?: OrderDirection;

  @Field(() => String, { nullable: true })
  @IsOptional()
  search?: string;

  @Field(() => [DynamicFilter], { nullable: true })
  @ValidateNested({ each: true })
  @Type(() => DynamicFilter)
  filters?: DynamicFilter[];
}
