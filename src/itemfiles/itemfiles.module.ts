import { Module } from '@nestjs/common';
import { SmongoService } from './data-layer/smongo/smongo.service';
import { SmemoryService } from './data-layer/smemory/smemory.service';
import { DatabaseProviderModule } from '../database-provider/database-provider.module';
import { ItemFilesController } from './controller/itemfiles.controller';

@Module({
  imports: [DatabaseProviderModule],
  providers: [SmongoService, SmemoryService],
  controllers: [ItemFilesController],
})
export class ItemfilesModule {}
