import { Connection } from 'mongoose';
import { IConfigApp } from '../../config/configure-app';
import { Memory } from '../memory/memory';
import { Mongo } from '../mongo/mongo';
import { Injectable } from '@nestjs/common';
import { IDBProvider } from '../database-provider.interface';

@Injectable()
export class ServiceDatabaseFactory {
  public getDatabase(
    _typedb: string,
    _optionsdb: IConfigApp,
  ): IDBProvider<Memory | Connection> {
    switch (_typedb) {
      case 'memory':
        const memory = new Memory();
        return memory;
        break;
      case 'mongo':
        const instanceMongo = Mongo.getInstance(
          _optionsdb.db.config.mongo.url,
          _optionsdb.db.config.mongo.user,
          _optionsdb.db.config.mongo.password,
          _optionsdb.db.config.mongo.dbname,
          _optionsdb.db.config.mongo.secure,
        );
        return instanceMongo;
        break;
      default:
        throw new Error(`No service defined for APP`);
    }
  }
}

// export const databaseProviders = [
//   {
//     provide: 'DATABASE_CONNECTION',
//     useFactory: (type: string, optionsdb: IConfigApp): Memory | Connection => {
//       switch (type) {
//         case 'mongo':
//           const connectionDB = Mongo.getInstance(
//             optionsdb.db.config.mongo.url,
//             optionsdb.db.config.mongo.user,
//             optionsdb.db.config.mongo.password,
//             optionsdb.db.config.mongo.dbname,
//             optionsdb.db.config.mongo.secure,
//           ).getConnection();
//           return connectionDB;
//           break;

//         case 'memory':
//           const memory = new Memory();
//           return memory;
//           break;
//       }
//     },
//     inject: [BService, CService],
//   },
// ];
