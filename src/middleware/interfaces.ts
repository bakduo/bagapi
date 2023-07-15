import {Request, Response, NextFunction} from 'express';

// export interface CPayloadFile {
//     filename:{
//         options:{
//             name:string,
//             contentType:string,
//         }
//     }
// }

export interface IErrorMiddleware extends TypeError {
    getHttpCode():number;
    getCode():number;
    getDetail():number;
}

export type errorTypeMiddleware = IErrorMiddleware;

export interface IFileUpload {
    name:string,
    count:number,
    path: string,
}

export interface IPayload {
    file:unknown,
    profile?:unknown
}
export interface IProfileUser {
    id:string,
    roles:string[],
}

export interface CustomRequestPayload extends Request {
    payload?: IPayload,
    //count?: number
}