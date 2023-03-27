import { Connection, createConnection } from 'mongoose';
import { IDBProvider } from '../database-provider.interface';

export interface ConfigMongoDB {
  url: string;
  user: string;
  pass: string;
  dbname: string;
  _secure: boolean;
}

export class Mongo implements IDBProvider<Connection> {
  private url: string;

  private connection: Connection;

  private static instance: Mongo;

  private constructor(
    url: string,
    user: string,
    pass: string,
    dbname: string,
    secure: boolean,
  ) {
    this.url = url;

    if (!secure) {
      this.connection = createConnection(this.url, {
        dbName: dbname,
        user: user,
        pass: pass,
      });
    } else {
      this.connection = createConnection(this.url, {
        ssl: true,
        dbName: dbname,
        user: user,
        pass: pass,
      });
    }
  }

  getConnection(): Connection {
    return this.getConnectionMongo();
  }

  public static getInstance(
    url: string,
    user: string,
    pass: string,
    dbname: string,
    secure: boolean,
  ): Mongo {
    if (!Mongo.instance) {
      Mongo.instance = new Mongo(url, user, pass, dbname, secure);
    }

    return Mongo.instance;
  }

  getConnectionMongo(): Connection {
    return this.connection;
  }
}

// export const databaseProvidersMongo = [
//   {
//     provide: 'DATABASE_CONNECTION_MONGO',
//     useFactory: async (): Promise<Connection> => {
//       try {
//         const connectionDB = Mongo.getInstance(
//           appconfig.db.config.mongo.url,
//           appconfig.db.config.mongo.user,
//           appconfig.db.config.mongo.password,
//           appconfig.db.config.mongo.dbname,
//           appconfig.db.config.mongo.secure,
//         ).getConnection();

//         return connectionDB;
//       } catch (error) {
//         throw error;
//       }
//     },
//   },
// ];
