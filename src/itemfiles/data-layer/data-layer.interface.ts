export interface IsearchItem {
  [keycustom: string]: string | number;
  valuecustom: string | number;
}

export interface IItemFile {
  name: string;
  created: Date;
  path: string;
  modify: Date;
  deleted: boolean;
  owner: string;
  uuid?: string;
  _id?: string;
  timestamp: number;
}

export interface IDataLayer<T> {
  getAll(): Promise<T[]>;

  findOne(custom: IsearchItem): Promise<T>;

  deleteOne(custom: IsearchItem): Promise<boolean>;

  saveOne(item: T): Promise<T>;

  updateOne(id: string, item: T): Promise<T>;

  deleteAll(): Promise<void>;
}
