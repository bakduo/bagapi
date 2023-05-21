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

export interface CustomRequestPayload extends Request {
    payload?: unknown,
    count?: number
}
