import { app } from '../src/app';
import {appconfig, loadMessageBroker, loggerApp} from '../src/configure/configure-app';
import { MongoDatastore } from '../src/data-layer';

import { MQservice } from '../src/service-layer/messages';

const puerto = appconfig.port || 8082;

const server = app.listen(puerto, async () => {
    
    await loadMessageBroker();
    
    loggerApp.debug(`servidor escuchando en http://localhost:${puerto}`);
});

server.on('error', error => {
    
    loggerApp.debug(`Error server:${error.message}`);
});


process.on('SIGINT', function() {

    const connectionDB = MongoDatastore.getInstance(
        appconfig.db.config.mongo.url,
        appconfig.db.config.mongo.user,
        appconfig.db.config.mongo.password,
        appconfig.db.config.mongo.dbname,
        appconfig.db.config.mongo.secure).getConnection();

        connectionDB.close(true)
                .then(()=>{
                loggerApp.error("Close DB..");
                })
                .catch((error)=>{
                loggerApp.error(`Error mongo close DB..${error}`);
                });

        const mq = MQservice.getInstance(appconfig.message.queuename,appconfig.message.exchname,appconfig.message.routerkey);

        mq.closeChannel()
        .then(()=>{
            mq.closeConnection()
            .then(()=>{
                process.exit(0);
            })
            .catch((error)=>{
                loggerApp.error(`Error al cerrar conexión de mq..${error}`);
                process.exit(1);
            })
        })
        .catch((error)=>{
            loggerApp.error(`Error al cerrar canal de mq..${error}`);
            process.exit(1);
        });

});