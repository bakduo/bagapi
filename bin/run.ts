import { app } from '../src/app';
import {appconfig} from '../src/configure/configure-app';

const puerto = appconfig.port;

const server = app.listen(puerto, async () => {
    console.log(`servidor escuchando en http://localhost:${puerto}`);
});

server.on('error', error => {
    console.log('error en el servidor:', error);
});

process.on('SIGINT', function() {

    console.log(`Exit process.`);
    process.exit(0);

});