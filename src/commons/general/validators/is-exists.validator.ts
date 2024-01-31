import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { Injectable } from '@nestjs/common';
import { HttpResponseException } from '../exceptions';


class ValidationEntity {
}

@Injectable()
@ValidatorConstraint({ name: 'IsExist', async: true })
export class IsExist implements ValidatorConstraintInterface {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async validate(value: string, validationArguments: ValidationArguments) {
    try {
      const repository = validationArguments.constraints[0];
      const pathToProperty = validationArguments.constraints[1];
      const entity = (await this.dataSource.getRepository(repository).findOne({
        where: {
          [pathToProperty]: value,
        },
      })) as ValidationEntity;
      if (!entity) {
        return false;
      }
      return !!entity;
    } catch (error) {
      error.status = 422;
      throw new HttpResponseException(error);
    }
  }
}