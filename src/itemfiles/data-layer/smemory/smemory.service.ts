import { Injectable } from '@nestjs/common';
import { IDataLayer, IItemFile, IsearchItem } from '../data-layer.interface';
import { ServiceDatabaseFactory } from '../../../database-provider/factory/fproviders';

import { appconfig } from '../../../config/configure-app';
import { Memory } from '../../../database-provider/memory/memory';

@Injectable()
export class SmemoryService implements IDataLayer<IItemFile> {
  private memory: Memory;

  constructor(private _service: ServiceDatabaseFactory) {
    const instanceProvider = this._service.getDatabase('memory', appconfig);
    this.memory = <Memory>instanceProvider.getConnection();
  }

  async getAll(): Promise<IItemFile[]> {
    return Promise.resolve(this.memory.getStore());
  }

  async findOne(custom: IsearchItem): Promise<IItemFile> {
    //throw new Error("Method not implemented.");
    const { keycustom, valuecustom } = custom;

    if (keycustom !== 'uuid') {
      throw new Error(`Find attribute didn't correct ${custom}`);
    }

    const items = this.memory.getStore();
    const OK = items.find((item) => {
      return item.uuid == valuecustom;
    });
    if (OK) {
      return Promise.resolve(OK);
    }
    throw new Error(`Not found ${custom.valuecustom}`);
  }

  async deleteOne(custom: IsearchItem): Promise<boolean> {
    const ok = await this.findOne(custom);
    if (ok) {
      const { valuecustom } = custom;
      let items = this.memory.getStore();
      items = items.filter((item) => {
        return item.uuid !== valuecustom;
      });
      this.memory.replace(items);
      return Promise.resolve(true);
    }
    throw new Error(`Not found ${custom.valuecustom}`);
  }

  async saveOne(item: IItemFile): Promise<IItemFile> {
    //throw new Error("Method not implemented.");
    this.memory.getStore().push(item);
    return Promise.resolve(item);
  }

  async updateOne(id: string, item: IItemFile): Promise<IItemFile> {
    const ok = await this.findOne({ keycustom: 'uuid', valuecustom: id });
    if (ok) {
      const items = this.memory.getStore();
      const postIndex = items.findIndex((item) => {
        return item.uuid == id;
      });
      items[postIndex] = item;
      this.memory.replace(items);
      return Promise.resolve(item);
    }
    throw new Error(`Not found ${id}`);
  }

  deleteAll(): Promise<void> {
    return Promise.resolve(this.memory.replace([]));
  }
}
