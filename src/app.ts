import express, { NextFunction } from 'express';

import {Request, Response} from 'express';
import { routerStorageApi } from './routes';
import { errorTypeMiddleware, setCache } from './middleware';
import { errorGenericType } from './service-layer/util/error';

export const app = express();

app.disable('x-powered-by');

app.use(express.json({limit: '10MB'}));

app.use(express.urlencoded({ limit: '10MB',extended: true }));

app.use(setCache);

app.use('/api',routerStorageApi);

//Handler GET 404 for not found
app.use((req:Request, res:Response)=> {
    return res.status(404).json({message:'Request not found'});
});
  
//Error Handler
app.use((err:errorTypeMiddleware, req:Request, res:Response, next:NextFunction)=> {
    try {
        if (err.getHttpCode()){
            return res.status(err.getHttpCode()).json({message:`${err.message} ${err.getDetail()}`});
        } 
        return res.status(500).json({message:`${err.message}`});
    } catch (error:unknown) {
        const err = error as errorGenericType;
        return res.status(500).json({message:`${err.message}`});
    }
});