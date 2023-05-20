export interface ItemFile {
    name:string;
    created:Date;
    path:string;
    modify:Date;
    deleted:boolean;
    owner: string;
    uuid?:string;
    _id?:string;
    timestamp:number;
}