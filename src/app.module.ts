import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ItemfilesModule } from './itemfiles/itemfiles.module';
import { DatabaseProviderModule } from './database-provider/database-provider.module';
import { checkUpload } from './itemfiles/middleware/upload-stream.middleware';
import { setCache } from './itemfiles/middleware/cache.middleware';
import { ItemFilesController } from './itemfiles/controller/itemfiles.controller';

@Module({
  imports: [DatabaseProviderModule, ItemfilesModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(setCache, checkUpload).forRoutes(ItemFilesController);
  }
}
