import config from 'config';

export interface IConfigDB {
    db:{
        type:string,
        config:{
            memory:boolean,
            sql:{
                config:{
                  mysql:{
                    username:string,
                    passwd:string,
                    port:number,
                    host:string,
                    database:string
                  },
                  postgres:{
                    username:string,
                    passwd:string,
                    port:number,
                    host:string,
                    database:string
                  },
                  sqlite:{
                    database:string,
                    path:string
                  }
                }
            },
            mongo:{
                urlreplica:string;
                url:string;
                dbname:string;
                host:string;
                user:string;
                password:string;
                secure:boolean;
                port:number;
            }
        }
    },
    service:{
        storage:{
            server:string,
        }
    },
    jwt:{
        secretRefresh:string;
        secret: string;
        session: boolean;
        timeToken:string;
    },
    port:number;
    hostname:string;
    secure:boolean;
    protocol:string;
    logpath:string;
    session:{
        type:string;
        secret:string,
        config:{
            mongo:{
                urlreplica:string;
                url:string;
                dbname:string;
                host:string;
                user:string;
                password:string;
                secure:boolean;
                port:number;
            }
        }
    }

}

export const appconfig:IConfigDB = config.get('app');
