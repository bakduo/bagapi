import {Request, Response, NextFunction} from 'express';

export interface CPayloadFile {
    filename:{
        options:{
            name:string,
            contentType:string,
        }
    }
}
export interface CustomRequestPayload extends Request {
    payload?: any,
    count?: number
}
