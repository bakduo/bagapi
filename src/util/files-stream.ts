import * as util from 'util';

import * as fs from 'fs';

import { Writable } from 'stream';

const writeFile = util.promisify(fs.writeFile);


export class WritableFileStream extends Writable {
    path: string;
    
    constructor(path: string) {
        super();
        this.path = path;
    }
    
    _write(chunk: any, encoding: string, next: (error?: Error) => void) {
        writeFile(this.path, chunk)
        .then(() => next())
        .catch((error) => next(error));
    }
}