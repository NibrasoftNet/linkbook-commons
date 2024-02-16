import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { HttpResponseException } from '../exceptions';

@ValidatorConstraint({ name: 'IsExist', async: true })
export class IsExist implements ValidatorConstraintInterface {
  async validate(value: any, validationArguments: ValidationArguments) {
    try {
      const entity = validationArguments.constraints[0];
      const entityKey = validationArguments.constraints[1];
      console.log('resty', entity);
      const entityInstance = await entity.dataSource
        .getRepository(entity.target)
        .findOne({
          where: {
            [entityKey]: value,
          },
        });
      if (!entityInstance) {
        return false;
      }
      return !!entityInstance;
    } catch (error) {
      error.status = 422;
      throw new HttpResponseException(error);
    }
  }
}
