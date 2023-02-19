import { DatastoreCustom } from "./interfaces";

import { Connection, createConnection } from 'mongoose';

export interface ConfigMongoDB {
    url:string,
    user:string,
    pass:string,
    dbname:string,
    _secure:boolean
}

export class MongoDatastore implements DatastoreCustom{

    create(): boolean {
        
       return true;
    }

    private url:string;

    private connection: Connection;

    private static instance: MongoDatastore;

    private constructor(url:string,user:string,pass:string,dbname:string,secure:boolean){
        this.url = url;

        if (!secure){
            this.connection = createConnection(this.url, {
                dbName:dbname,
                user:user,
                pass:pass
              });    
        }else{
            this.connection = createConnection(this.url, {
                ssl: true,
                dbName:dbname,
                user:user,
                pass:pass
              });
        }
    }

    public static getInstance(url:string,user:string,pass:string,dbname:string,secure:boolean): MongoDatastore {
        if (!MongoDatastore.instance) {
            MongoDatastore.instance = new MongoDatastore(url,user,pass,dbname,secure);
        }

        return MongoDatastore.instance;
    }

    getConnection():Connection{
        return this.connection;
    }

}