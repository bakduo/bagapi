import * as util from 'util';

import * as fs from 'fs';

import { Writable } from 'stream';

const writeFile = util.promisify(fs.writeFile);

type dataChunk = unknown | string | NodeJS.ArrayBufferView


export class WritableFileStream extends Writable {
    path: string;
    
    constructor(path: string) {
        super();
        this.path = path;
    }
    
    _write(chunk: unknown, encoding: string, next: (error?: Error) => void) {
        const data = (chunk as string | NodeJS.ArrayBufferView);
        writeFile(this.path, data)
        .then(() => next())
        .catch((error) => next(error));
    }
}