import * as fs from 'fs';

import {Response, NextFunction} from 'express';
import { extractNameFileFromHeader } from '../util/regex';
import { CustomRequestPayload } from './interfaces';
import { DaoFactory } from '../data-layer/factory/provider';
import { ERRORS_APP, appconfig, loggerApp } from '../configure';
import { EMiddleware, errorGenericType } from '../service-layer/util';

const cwd = process.cwd();

const pathUpload = cwd + '/upload';

const uploadFile = (req:CustomRequestPayload, filePath:string) => {
    
    const nameFile = extractNameFileFromHeader(req.headers['content-disposition']||'');
    return new Promise((resolve, reject) => {

    //https://dev.to/tqbit/how-to-use-node-js-streams-for-fileupload-4m1n
     const stream = fs.createWriteStream(`${filePath}/${nameFile}`);
    
     stream.on('open', () => {
      req.pipe(stream);
     });

    //  stream.on('drain', () => {
    //   const written = Number(stream.bytesWritten);
    //   const total = Number(req.headers['content-length']);
    //   const pWritten = ((written / total) * 100).toFixed(2);
    //  });
   
     stream.on('close', () => {
      const cantBytes = Number(req.headers['content-length']);
      resolve({name:nameFile,type:'stream',count:cantBytes,path:pathUpload});
     });
     
     stream.on('error', err => {
      console.error(err);
      reject(err);
     });
    });

   };


export const checkUpload = async(req:CustomRequestPayload, res:Response, next:NextFunction) => {
 
    if (req.body){
        if (req.params.uuid){
            try{
                const dao = new DaoFactory().getDatabase(appconfig.db.type);
                const item = await dao.findOne({keycustom:'uuid',valuecustom:req.params.uuid});
                if (item){
                    uploadFile(req,pathUpload)
                    .then((data)=>{
                        if (req.payload){
                         req.payload.file=data
                        }
                        return next()
                    })
                    .catch((err)=>{return res.status(400).json({message:`Fail to upload streams for user ${err}`})});
                }else{
                    return res.status(400).json({message:`Fail to upload streams for user ${req.params.uuid}`})
                }
            }catch (error) {
                const err = error as errorGenericType;        
                loggerApp.error(`Exception update item to db: ${err.message}`);
                return next(new EMiddleware(`Message: ${err.message}`,ERRORS_APP.EMiddlewareCheckFileItem.code,ERRORS_APP.EMiddlewareCheckFileItem.HttpStatusCode)); 
            }
        }else{
            //Caso base
            uploadFile(req,pathUpload)
                    .then((data)=>{
                        if (req.payload){
                            req.payload.file=data
                        }
                        return next()
            })
            .catch((err)=>{return res.status(400).json({message:`Fail to upload streams for user ${err}`})});
        }   
    }
}