import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { FilterOperator } from './paginate-config.interface';
import { IsDefined, IsEnum, IsNotEmpty } from 'class-validator';

registerEnumType(FilterOperator, { name: 'FilterOperator' });

@InputType()
export class DynamicFilter {
  @Field(() => String)
  @IsNotEmpty()
  key: string;

  @Field(() => FilterOperator, { nullable: true })
  @IsEnum(FilterOperator)
  operator?: FilterOperator;

  @Field(() => String)
  @IsDefined()
  value: string;
}
