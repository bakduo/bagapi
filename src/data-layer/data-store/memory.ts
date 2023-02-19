import { DatastoreCustom } from "./interfaces";
import { ItemFile } from '../dto/item-file.dto';

export class MemoryDatastore implements DatastoreCustom{

    private items:ItemFile[];

    constructor(){
        this.items = [];
    }

    create(): boolean {
        //throw new Error("Method not implemented.");
        return true;
    }

    getStore():ItemFile[]{
        return this.items;
    }

    replace(items:ItemFile[]){
        this.items = items;
    }
}