import { Test, TestingModule } from '@nestjs/testing';
import { ItemFilesController } from './itemfiles.controller';

describe('ItemFilesController', () => {
  let controller: ItemFilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemFilesController],
    }).compile();

    controller = module.get<ItemFilesController>(ItemFilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
