import { Module } from '@nestjs/common';
import { ServiceDatabaseFactory } from './factory/fproviders';

@Module({
  providers: [ServiceDatabaseFactory],
  exports: [ServiceDatabaseFactory],
})
export class DatabaseProviderModule {}
