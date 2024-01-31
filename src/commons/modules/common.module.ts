import { Module } from '@nestjs/common';
import { IsExist } from '../general';

@Module({
  imports: [],
  providers: [IsExist],
})
export class CommonModule {}
