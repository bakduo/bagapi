import { Test, TestingModule } from '@nestjs/testing';
import { SmongoService } from './smongo.service';
import { DatabaseProviderModule } from '../../../database-provider/database-provider.module';
import { faker } from '@faker-js/faker';

describe('SmongoService', () => {
  let service: SmongoService;
  let uuid1: string;
  let uuid2: string;
  let uuid3: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseProviderModule],
      providers: [SmongoService],
    }).compile();

    service = module.get<SmongoService>(SmongoService);
    console.log('###############BEFORE TEST DAO Mongo#################');
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

  describe('DAO Mongo', () => {
    it('SAVE ITEM DAO', async () => {
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

      expect(saved.name).toEqual(item1.name);
      expect(saved.created.getTime()).toEqual(item1.created.getTime());
      expect(saved.path).toEqual(item1.path);
      expect(saved.modify.getTime()).toEqual(item1.modify.getTime());
      expect(saved.owner).toEqual(item1.owner);
      expect(saved.timestamp).toEqual(item1.timestamp);
      expect(saved.uuid).toEqual(item1.uuid);
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

      expect(saved.name).toEqual(item1.name);
      expect(saved.created.getTime()).toEqual(item1.created.getTime());
      expect(saved.path).toEqual(item1.path);
      expect(saved.modify.getTime()).toEqual(item1.modify.getTime());
      expect(saved.owner).toEqual(item1.owner);
      expect(saved.timestamp).toEqual(item1.timestamp);
      expect(saved.uuid).toEqual(item1.uuid);
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

      expect(saved.name).toEqual(item1.name);
      expect(saved.created.getTime()).toEqual(item1.created.getTime());
      expect(saved.path).toEqual(item1.path);
      expect(saved.modify.getTime()).toEqual(item1.modify.getTime());
      expect(saved.owner).toEqual(item1.owner);
      expect(saved.timestamp).toEqual(item1.timestamp);
      expect(saved.uuid).toEqual(item1.uuid);
    });

    it('COUNT ITEM 3 DAO', async () => {
      const items = await service.getAll();
      expect(items.length).toEqual(3);
    });

    it('FINDONE ITEM DAO', async () => {
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
      //expect(itemUpdated).to.equal(itemNew);
      expect(itemUpdated.name).toEqual(itemNew.name);
      //https://stackoverflow.com/questions/4428327/checking-if-two-dates-have-the-same-date-info
      expect(itemUpdated.created.getTime()).toEqual(itemNew.created.getTime());
      expect(itemUpdated.path).toEqual(itemNew.path);
      expect(itemUpdated.modify.getTime()).toEqual(itemNew.modify.getTime());
      expect(itemUpdated.owner).toEqual(itemNew.owner);
      expect(itemUpdated.timestamp).toEqual(itemNew.timestamp);
      expect(itemUpdated.uuid).toEqual(itemNew.uuid);
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
