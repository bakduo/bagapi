import { Injectable } from '@nestjs/common';
import { Model, Connection } from 'mongoose';
import { IDataLayer, IItemFile, IsearchItem } from '../data-layer.interface';
import { ItemFileSchema } from '../../schemas/itemfiles.schema';
import { appconfig } from '../../../config/configure-app';
import { ServiceDatabaseFactory } from '../../../database-provider/factory/fproviders';

interface IKeyValue {
  [key: string]: string | number;
}

@Injectable()
export class SmongoService implements IDataLayer<IItemFile> {
  private model: Model<IItemFile>;

  constructor(private _service: ServiceDatabaseFactory) {
    const instanceProvider = this._service.getDatabase('mongo', appconfig);
    const connection = <Connection>instanceProvider.getConnection();
    this.model = connection.model<IItemFile>('ItemFiles', ItemFileSchema);
  }

  async getAll(): Promise<IItemFile[]> {
    const allItems = await this.model.find();
    if (allItems) {
      return allItems.map((item) => {
        const { uuid, name, created, path, modify, deleted, owner, timestamp } =
          item;
        return { uuid, name, created, path, modify, deleted, owner, timestamp };
      });
    }

    throw new Error(`Exception on getAll into MongoDB`);
  }

  async findOne(custom: IsearchItem): Promise<IItemFile> {
    const { keycustom, valuecustom } = custom;

    if (keycustom !== 'uuid') {
      throw new Error(`Find attribute didn't correct ${custom}`);
    }

    const queryObj: IKeyValue = {};

    queryObj[keycustom] = valuecustom;

    const item = await this.model.findOne(queryObj);
    if (item) {
      const { uuid, name, created, path, modify, deleted, owner, timestamp } =
        item;

      return { uuid, name, created, path, modify, deleted, owner, timestamp };
    }

    throw new Error(`Not found into MongoDB`);
  }

  async deleteOne(custom: IsearchItem): Promise<boolean> {
    const { keycustom, valuecustom } = custom;

    const queryObj: IKeyValue = {};

    queryObj[keycustom] = valuecustom;

    const item = await this.model.deleteOne(queryObj);

    if (item) {
      if (item.deletedCount > 0) {
        return true;
      }
    }

    throw new Error(`Not found into MongoDB`);
  }

  async saveOne(item: IItemFile): Promise<IItemFile> {
    try {
      //FIXIT post future modif
      const mItem = {
        ...item,
      };

      const newItem: IItemFile = await this.model.create(mItem);

      if (newItem) {
        const { uuid, name, created, path, modify, deleted, owner, timestamp } =
          newItem;

        return { uuid, name, created, path, modify, deleted, owner, timestamp };
      }

      throw new Error(`Exception on create into MongoDB`);
    } catch (error: unknown) {
      //loggerApp.error(`Exception on saveOne into MongoDB: ${err.message}`);
      throw new Error(`Exception on saveOne into MongoDB ${error}`);
    }
  }

  async updateOne(id: string, item: IItemFile): Promise<IItemFile> {
    //https://stackoverflow.com/questions/32811510/mongoose-findoneandupdate-doesnt-return-updated-document

    const updateItem = await this.model.findOneAndUpdate({ uuid: id }, item, {
      returnOriginal: false,
    });

    if (updateItem) {
      const { uuid, name, created, path, modify, deleted, owner, timestamp } =
        updateItem;

      return { uuid, name, created, path, modify, deleted, owner, timestamp };
    }

    throw new Error(`Not found into MongoDB`);
  }

  async deleteAll(): Promise<void> {
    await this.model.deleteMany();
  }
}
