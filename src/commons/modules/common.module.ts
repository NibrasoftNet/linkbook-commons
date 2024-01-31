import { Module } from '@nestjs/common';
import { IsExist } from '../general';

@Module({
  providers: [IsExist],
})
export class CommonModule {}
