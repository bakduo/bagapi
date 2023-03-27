export interface IDBProvider<T> {
  getConnection(): T;
}
