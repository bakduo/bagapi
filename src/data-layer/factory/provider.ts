import { ItemFileMemory, ItemFileMongo } from "../dao";
import { MemoryDatastore } from "../data-store";

export class DaoFactory {
    
    public getDatabase(_typedb: string): ItemFileMemory | ItemFileMongo {
        
      switch (_typedb) {
        case 'memory':
          return new ItemFileMemory(new MemoryDatastore());
          break;
        case 'mongo':
          return new ItemFileMongo();
          break;
        default:
          throw new Error(`No service defined for APP`);
      }
    }
}