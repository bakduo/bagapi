import { IGenericDB, IsearchItem, ItemFile } from "./generic";
import { MongoDatastore } from '../data-store/mongo';
import { Model } from "mongoose";
import { appconfig } from "../../configure";
import { ItemFileSchema } from '../schemas/item-file';

//Valid for patch object:any = {}
interface IKeyValue {
    [key:string]:string | number;
}

export class ItemFileMongo implements IGenericDB<ItemFile>{
    

    private model: Model<ItemFile>;

    constructor(){

        try {

            const connectionDB = MongoDatastore.getInstance(
                appconfig.db.config.mongo.url,
                appconfig.db.config.mongo.user,
                appconfig.db.config.mongo.password,
                appconfig.db.config.mongo.dbname,
                appconfig.db.config.mongo.secure).getConnection();
            
            this.model = connectionDB.model<ItemFile>('ItemFile',ItemFileSchema);

        } catch (error:unknown) {
            //loggerApp.error(`Exception on constructor into MongoDB: ${err.message}`);
            throw new Error(`Error to Generated ItemFileMongo ${error}`);
        }

    }

    async getAll(): Promise<ItemFile[]> {
        const allItems = await this.model.find();
        if (allItems){
            return allItems.map((item)=> {
                const {uuid,name,created,path,modify,deleted,owner,timestamp} = item;
                return {uuid,name,created,path,modify,deleted,owner,timestamp};
            });
        }

        throw new Error(`Exception on getAll into MongoDB`);
    }

    async findOne(custom: IsearchItem): Promise<ItemFile> {

        const {keycustom, valuecustom} = custom;

        // if (keycustom!=='uuid'){
        //     throw new Error(`Find attribute didn't correct ${custom}`);
        // }

        const queryObj:IKeyValue = {};

        queryObj[keycustom] = valuecustom;

        const item = await this.model.findOne(queryObj);
        if (item){
            const {uuid,name,created,path,modify,deleted,owner,timestamp} = item;

            return {uuid,name,created,path,modify,deleted,owner,timestamp};
        }

        throw new Error(`Not found into MongoDB`);
    }

    async deleteOne(custom: IsearchItem): Promise<boolean> {
        const {keycustom, valuecustom} = custom;

        const queryObj:IKeyValue = {};

        queryObj[keycustom] = valuecustom;
      
        const item = await this.model.deleteOne(queryObj);

        if (item){

            if (item.deletedCount>0){
                return true
            }
        }

        throw new Error(`Not found into MongoDB`);
    }

    async saveOne(item: ItemFile): Promise<ItemFile> {
        
        try {

            //FIXIT post future modif
            // const mItem = {
            //     ...item
            // }

            const newItem:ItemFile = await this.model.create(item);
            if (newItem){
               
               const {uuid,name,created,path,modify,deleted,owner,timestamp} = newItem;

               return {uuid,name,created,path,modify,deleted,owner,timestamp};

            }    
            
            throw new Error(`Exception on create into MongoDB`);

        } catch (error:unknown) {
            //loggerApp.error(`Exception on saveOne into MongoDB: ${err.message}`);
            throw new Error(`Exception on saveOne into MongoDB ${error}`);
        }
    }

    async updateOne(id: string, item: ItemFile): Promise<ItemFile> {

        //https://stackoverflow.com/questions/32811510/mongoose-findoneandupdate-doesnt-return-updated-document
        
        item.modify = new Date();

        const updateItem = await this.model.findOneAndUpdate({uuid:id},item,{ returnOriginal: false });
            
        if (updateItem){
            const {uuid,name,created,path,modify,deleted,owner,timestamp} = updateItem;

            return {uuid,name,created,path,modify,deleted,owner,timestamp};
        }

        throw new Error(`Not found into MongoDB`);
    }

    async deleteAll(): Promise<void> {
        await this.model.deleteMany();
    }

}