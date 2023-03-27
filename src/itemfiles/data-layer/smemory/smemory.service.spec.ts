import { Test, TestingModule } from '@nestjs/testing';
import { SmemoryService } from './smemory.service';
import { faker } from '@faker-js/faker';
import { DatabaseProviderModule } from '../../../database-provider/database-provider.module';

describe('SmemoryService', () => {
  let service: SmemoryService;
  let uuid1: string;
  let uuid2: string;
  let uuid3: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseProviderModule],
      providers: [SmemoryService],
    }).compile();

    service = module.get<SmemoryService>(SmemoryService);
    uuid1 = faker.database.mongodbObjectId();
    uuid2 = faker.database.mongodbObjectId();
    uuid3 = faker.database.mongodbObjectId();
  });

  afterAll(async () => {
    console.log('###############AFTER TEST DAO Memory#################');
    service.deleteAll();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('DAO Memory', () => {
    it('SAVE ITEM DAO MEMORY', async () => {
      const item1 = {
        name: faker.hacker.adjective(),
        created: new Date(),
        path: faker.hacker.adjective(),
        modify: new Date(),
        deleted: false,
        owner: faker.internet.userName(),
        uuid: uuid1,
        timestamp: Math.floor(Date.now() / 1000),
      };

      const saved = await service.saveOne(item1);

      expect(saved).toMatchObject(item1);
      expect(saved.name).toEqual(item1.name);
      expect(saved.uuid).toEqual(item1.uuid);
      expect(saved.timestamp).toEqual(item1.timestamp);
    });

    it('SAVE ITEM 2 DAO', async () => {
      const item1 = {
        name: faker.hacker.adjective(),
        created: new Date(),
        path: faker.hacker.adjective(),
        modify: new Date(),
        deleted: false,
        owner: faker.internet.userName(),
        uuid: uuid2,
        timestamp: Math.floor(Date.now() / 1000),
      };

      const saved = await service.saveOne(item1);

      expect(saved).toMatchObject(item1);
      expect(saved.name).toEqual(item1.name);
      expect(saved.uuid).toEqual(item1.uuid);
      expect(saved.timestamp).toEqual(item1.timestamp);
    });

    it('SAVE ITEM 3 DAO', async () => {
      const item1 = {
        name: faker.hacker.adjective(),
        created: new Date(),
        path: faker.hacker.adjective(),
        modify: new Date(),
        deleted: false,
        owner: faker.internet.userName(),
        uuid: uuid3,
        timestamp: Math.floor(Date.now() / 1000),
      };

      const saved = await service.saveOne(item1);

      expect(saved).toMatchObject(item1);
      expect(saved.name).toEqual(item1.name);
      expect(saved.uuid).toEqual(item1.uuid);
      expect(saved.timestamp).toEqual(item1.timestamp);
    });

    it('COUNT ITEM 3 DAO', async () => {
      const items = await service.getAll();
      expect(items.length).toStrictEqual(3);
    });

    it('FIND ONE ITEM DAO', async () => {
      const FoundItem = await service.findOne({
        keycustom: 'uuid',
        valuecustom: uuid1,
      });

      expect(FoundItem.uuid).toEqual(uuid1);
    });

    it('DELETEONE ITEM DAO', async () => {
      const OK = await service.deleteOne({
        keycustom: 'uuid',
        valuecustom: uuid1,
      });
      expect(OK).toEqual(true);
    });

    it('DELETEONE AGAIN DONT EXIST ITEM DAO', async () => {
      try {
        await service.deleteOne({ keycustom: 'uuid', valuecustom: uuid1 });
      } catch (error: any) {
        expect(error.message).toContain('Not found');
      }
    });

    it('UPDATEONE ITEM DAO', async () => {
      const itemNew = {
        name: faker.hacker.adjective(),
        created: new Date(),
        path: faker.hacker.adjective(),
        modify: new Date(),
        deleted: false,
        owner: faker.internet.userName(),
        uuid: uuid2,
        timestamp: Math.floor(Date.now() / 1000),
      };

      const itemUpdated = await service.updateOne(uuid2, itemNew);
      expect(itemUpdated.name).toEqual(itemUpdated.name);
      expect(itemUpdated.modify).toEqual(itemUpdated.modify);
      expect(itemUpdated.uuid).toEqual(uuid2);
      expect(itemUpdated.path).toEqual(itemUpdated.path);
    });

    it('UPDATEONE ITEM DAO DONT Exist', async () => {
      const itemNew = {
        name: faker.hacker.adjective(),
        created: new Date(),
        path: faker.hacker.adjective(),
        modify: new Date(),
        deleted: false,
        owner: faker.internet.userName(),
        uuid: '434343',
        timestamp: Math.floor(Date.now() / 1000),
      };

      try {
        await service.updateOne('434343', itemNew);
      } catch (error: any) {
        expect(error.message).toContain('Not found');
      }
    });
  });
});
