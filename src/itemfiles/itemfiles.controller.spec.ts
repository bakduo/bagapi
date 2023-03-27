import { Test, TestingModule } from '@nestjs/testing';
import { ItemfilesController } from './itemfiles.controller';

describe('ItemfilesController', () => {
  let controller: ItemfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemfilesController],
    }).compile();

    controller = module.get<ItemfilesController>(ItemfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
