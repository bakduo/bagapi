import config from 'config';

import stream from 'stream';

import childProcess from 'child_process';

import pino from "pino";
import { MQservice } from '../service-layer/messages';

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
    upload:{
        enable:boolean,
        path:string,
    },
    service:{
        storage:{
            server:string,
        },
        auth:{
            server:string,
        },
        enable_service_token:boolean
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
    },
    message:{
        enable:boolean,
        rabbitmq:boolean,
        server:string,
        port:number,
        vhost:string,
        username:string,
        password:string,
        exchname:string,
        queuename:string,
        routerkey:string,
    }

}

export interface tokenResponse {
    profile:{
        id: string,
        roles: Array<string>,
    }
}

const logThrough = new stream.PassThrough();

// Environment variables
const cwd = process.cwd();
const { env } = process;
const logPath = cwd + '/log';

const child = childProcess.spawn(
    process.execPath,
    [
      require.resolve('pino-tee'),
      'warn',
      `${logPath}/log.warn.log`,
      'error',
      `${logPath}/log.error.log`,
      'info',
      `${logPath}/log.info.log`,
      'debug',
      `${logPath}/log.debug.log`,
    ],
    { cwd, env }
  );
  
logThrough.pipe(child.stdin);

export const loggerApp = pino(
{
    name: 'bagapi',
    level: 'debug'
},
logThrough
);


export const ERRORS_APP = {
    'ETokenInvalid':{
        detail:'Token invalid',
        code:1001,
        HttpStatusCode: 403
    },
    'ERequestInvalid':{
        detail:'Request invalid',
        code: 1002,
        HttpStatusCode: 400
    },
    'ESaveFile':{
        detail:'Exception on save file to store DB',
        code: 1003,
        HttpStatusCode: 500
    },
    'ESaveFileDB':{
        detail:'Exception on save item to store DB',
        code: 1004,
        HttpStatusCode: 500
    },
    'ENotFoundItem':{
        detail:'Exception on find item to store DB',
        code: 1005,
        HttpStatusCode: 404
    },
    'EMiddlewareCheckFileItem':{
        detail:'Exception on find file user',
        code: 1006,
        HttpStatusCode: 404
    },
    'EControllerFailTransfer':{
        detail:'Exception on transfer file user',
        code: 1007,
        HttpStatusCode: 500
    },
    'EBase':{
        detail:'Exception generic',
        code: 1000,
        HttpStatusCode: 500
    },
}

export const appconfig:IConfigDB = config.get('app');


export const loadMessageBroker = async () =>{
    const mqs = MQservice.getInstance(appconfig.message.queuename,appconfig.message.exchname,appconfig.message.routerkey);
    await mqs.connect(appconfig.message.server,appconfig.message.port,appconfig.message.vhost,appconfig.message.username,appconfig.message.password);
    await mqs.getChannel();
    await mqs.configureChannel();
}