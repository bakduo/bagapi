import { IGenericDB, IsearchItem, ItemFile } from "./generic";
import { MemoryDatastore } from '../data-store/memory';

export class ItemFileMemory implements IGenericDB<ItemFile>{

    private memory: MemoryDatastore

    constructor(storage:MemoryDatastore){
        this.memory = storage;
    }

    async getAll(): Promise<ItemFile[]> {
        return Promise.resolve(this.memory.getStore())
    }

    async findOne(custom: IsearchItem): Promise<ItemFile> {
        //throw new Error("Method not implemented.");
        const {keycustom, valuecustom} = custom;
        
        if (keycustom!=='uuid'){
            throw new Error(`Find attribute didn't correct ${custom}`);
        }

        const items = this.memory.getStore();
        const OK = items.find((item)=>{
            return (item.uuid == valuecustom)
        })
        
        if (OK){
            return Promise.resolve(OK);
        }
        throw new Error(`Not found ${custom.valuecustom}`);
    }

    async deleteOne(custom: IsearchItem): Promise<boolean> {
        
        const ok = await this.findOne(custom);
        if (ok){
            const {valuecustom} = custom;
            let items = this.memory.getStore();
            items = items.filter((item)=>{
                return item.uuid !== valuecustom
            });
            this.memory.replace(items);
            return Promise.resolve(true);
        }
        throw new Error(`Not found ${custom.valuecustom}`);

    }
    
    async saveOne(item: ItemFile): Promise<ItemFile> {
        //throw new Error("Method not implemented.");
        this.memory.getStore().push(item);
        return Promise.resolve(item);
    }

    async updateOne(id: string, item: ItemFile): Promise<ItemFile> {
        const ok = await this.findOne({keycustom:'uuid',valuecustom:id});
        if (ok){

            const items = this.memory.getStore();
            const postIndex = items.findIndex((item)=>{
                return item.uuid==id
            })
            items[postIndex] = item;
            this.memory.replace(items);
            return Promise.resolve(item);
        }
        throw new Error(`Not found ${id}`);
    }

    deleteAll(): Promise<void> {
        return Promise.resolve(this.memory.replace([]));
    }
}