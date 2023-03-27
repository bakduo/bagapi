import { IItemFile } from '../../itemfiles/data-layer/data-layer.interface';
import { IDBProvider } from '../database-provider.interface';

export class Memory implements IDBProvider<Memory> {
  private items: IItemFile[];

  constructor() {
    this.items = [];
  }

  getConnection(): Memory {
    return this;
  }

  getStore(): IItemFile[] {
    return this.items;
  }

  replace(items: IItemFile[]) {
    this.items = items;
  }
}

// export const databaseProvidersMemory = [
//   {
//     provide: 'DATABASE_CONNECTION_MEMORY',
//     useFactory: async (): Promise<Memory> => {
//       try {
//         const memory = new Memory();
//         return memory;
//       } catch (error) {
//         throw error;
//       }
//     },
//   },
// ];
