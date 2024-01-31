import { Module } from '@nestjs/common';
import { IsExist } from '../general';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
  ],
  providers: [IsExist],
})
export class CommonModule {}
