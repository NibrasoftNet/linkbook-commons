import { Global, Module } from '@nestjs/common';
import { IsExist } from './is-exists.validator';
import { IsNotExist } from './is-not-exists.validator';

@Global()
@Module({
	providers: [
		IsExist,
		IsNotExist
	],
	exports: [
		IsExist,
		IsNotExist
	],
	controllers: [],
	imports: [],
})
export class ValidatorModule {}