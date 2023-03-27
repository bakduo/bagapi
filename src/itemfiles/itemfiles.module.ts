import { Module } from '@nestjs/common';
import { SmongoService } from './data-layer/smongo/smongo.service';
import { ItemfilesController } from './itemfiles.controller';
import { SmemoryService } from './data-layer/smemory/smemory.service';
import { DatabaseProviderModule } from '../database-provider/database-provider.module';

@Module({
  imports: [DatabaseProviderModule],
  providers: [SmongoService, SmemoryService],
  controllers: [ItemfilesController],
})
export class ItemfilesModule {}
