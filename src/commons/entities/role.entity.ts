import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsNumber } from 'class-validator';
import { EntityHelper } from './entity-helper';


@ObjectType()
@Entity()
export class Role extends EntityHelper {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Field(() => String)
  @Column()
  name?: string;
}

