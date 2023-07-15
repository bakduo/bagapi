import {Request, Response, NextFunction} from 'express';
import { CustomRequestPayload, IFileUpload, IPayload, IProfileUser } from '../../middleware/interfaces';
import { IGenericDB, ItemFile } from '../../data-layer';
import { ERRORS_APP, appconfig, loggerApp } from '../../configure';
import { EController, errorGenericType } from '../util/error';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { MQservice } from '../messages';

export class ControllerStorageApi {

    private dao:IGenericDB<ItemFile>

    constructor(_dao:IGenericDB<ItemFile>){
        this.dao = _dao;
    }

    save = async (req:CustomRequestPayload, res:Response, next:NextFunction)=>{

        const {file,profile} = req.payload as IPayload;

        const {name,count,path} = file as IFileUpload;

        const {id} = profile as IProfileUser;

        const item = {
                name:name,
                created:new Date(),
                path:path,
                modify:new Date(),
                deleted:false,
                owner:id,
                uuid:uuidv4(),
                timestamp:Math.floor(Date.now() / 1000),
                sizeof: count
            };

        try {
            const itemSave:ItemFile = await this.dao.saveOne(item);

            const remoteValue = {
                uuid: itemSave.uuid,
                name: itemSave.name,
                count,
                owner: id,
            };

            if (appconfig.message.enable){
                try {
                    const mqs = MQservice.getInstance(appconfig.message.queuename,appconfig.message.exchname,appconfig.message.routerkey);
                    const message = {
                        appname:'bagapi',
                        date:Date.now(),
                        type_event:'save-file'
                    }
                    mqs.sendMessage(message);
                } catch (error) {
                    const err = error as errorGenericType;
                    loggerApp.error(`Exception rabbitmq on save file queue broker: ${err.message}`);
                }
            }

            return res.status(201).json({message:'Save data OK',status:true,file:remoteValue});

        } catch (error) {
            const err = error as errorGenericType;
            loggerApp.error(`Exception save item to db: ${err.message}`);         
            return next(new EController(`Message: ${err.message}`,ERRORS_APP.ESaveFileDB.code,ERRORS_APP.ESaveFileDB.HttpStatusCode)); 
        }
    }

    update = async (req:CustomRequestPayload, res:Response, next:NextFunction)=>{
        if (req.params.uuid){
            try{

                const {file,profile} = req.payload as IPayload;

                const {name,count} = file as IFileUpload;

                const {id} = profile as IProfileUser;

                const item = {
                    name:name,
                    created:new Date(),
                    path:`${appconfig.upload.path}/${name}`,
                    modify:new Date(),
                    deleted:false,
                    owner:id,
                    uuid:req.params.uuid,
                    timestamp:Math.floor(Date.now() / 1000),
                    sizeof: count
                };
                
                await this.dao.updateOne(req.params.uuid,item);

                const data = {
                    name,
                    count,
                    owner: id
                }

                return res.status(201).json({message:'Content updated',status:true,file:data});
            }catch (error) {
                const err = error as errorGenericType;    
                loggerApp.error(`Exception update item to db: ${err.message}`);
                return next(new EController(`Message: ${err.message}`,ERRORS_APP.ENotFoundItem.code,ERRORS_APP.ENotFoundItem.HttpStatusCode));
            }
        }
        return res.status(404).json({message:'Not Found',status:false,file:{}});
    }


    getAll = async (req:Request, res:Response, next:NextFunction)=>{
            const items =await this.dao.getAll();
            return res.status(200).json({message:'List items',status:true,files:items});
    }

    find = async (req:Request, res:Response, next:NextFunction)=>{

        try{
            let item;
            if (req.params.name){
                item = await this.dao.findOne({keycustom:'name',valuecustom:req.params.name});
            }else{
                if (req.params.uuid){
                    item = await this.dao.findOne({keycustom:'uuid',valuecustom:req.params.uuid});
                }
            }
            if (item){
                const data = {
                    name: item.name
                }
                return res.status(200).json({message:'Content found',status:true,file:data});
            }
        }catch (error) {
            const err = error as errorGenericType;
                    
            loggerApp.error(`Exception find item to db: ${err.message}`);
                    
            return next(new EController(`Message: ${err.message}`,ERRORS_APP.ENotFoundItem.code,ERRORS_APP.ENotFoundItem.HttpStatusCode)); 
        }

        return res.status(404).json({message:'Not Found',status:false,file:{}});
    }

    getFile = async (req:Request, res:Response, next:NextFunction)=>{
        try{
            if (req.params.uuid){
                const item = await this.dao.findOne({keycustom:'uuid',valuecustom:req.params.uuid});
                if (item){
                    
                    await fs.promises.access(`${appconfig.upload.path}/${item.name}`);

                    const readStream = fs.createReadStream(`${appconfig.upload.path}/${item.name}`);
                             
                    await new Promise((resolve, reject) => {
                        readStream.on('open', () => {
                            readStream.pipe(res);
                        })

                        readStream.on('close', () => {
                            resolve(item);
                        })

                        readStream.on('error', err => {
                            reject(new EController(`Message: ${err.message}`,ERRORS_APP.EControllerFailTransfer.code,ERRORS_APP.EControllerFailTransfer.HttpStatusCode));
                        });
                    });

                    //return readStream.pipe(res);
                }
            }
        }catch (error) {
            const err = error as errorGenericType;    
            loggerApp.error(`Exception find item to db: ${err.message}`);
            return next(new EController(`Message: ${err.message}`,ERRORS_APP.ENotFoundItem.code,ERRORS_APP.ENotFoundItem.HttpStatusCode)); 
        }
        return res.status(404).json({message:'Not Found',status:false,file:{}});
    }

    delete = async (req:Request, res:Response, next:NextFunction)=>{
        const { uuid } = req.body;
        if (uuid){
            try{
                const item = await this.dao.findOne({keycustom:'uuid',valuecustom:uuid});
                if (item){
                    if (item.deleted){

                        fs.unlinkSync(`${appconfig.upload.path}/${item.name}`);

                        const data = {
                            deleted: item.uuid
                        }

                        if (appconfig.message.enable){
                            try {
                                const mqs = MQservice.getInstance(appconfig.message.queuename,appconfig.message.exchname,appconfig.message.routerkey);
                                const message = {
                                    appname:'bagapi',
                                    date:Date.now(),
                                    type_event:'delete-file'
                                }
                                mqs.sendMessage(message);
                            } catch (error) {
                                const err = error as errorGenericType;
                                loggerApp.error(`Exception rabbitmq on delete file queue broker: ${err.message}`);
                            }
                        }

                        return res.status(200).json({message:'Content deleted',status:true,file:data});
                    }
                }
            }catch (error) {
                const err = error as errorGenericType;
                        
                loggerApp.error(`Exception delete item to db: ${err.message}`);
                        
                return next(new EController(`Message: ${err.message}`,ERRORS_APP.ENotFoundItem.code,ERRORS_APP.ENotFoundItem.HttpStatusCode)); 
            }
        }
        return res.status(404).json({message:'Not Found',status:false,file:{}});
    }

    deletelogic = async (req:Request, res:Response, next:NextFunction)=>{
        const { uuid } = req.body;
        if (uuid){
            try{
                const item = await this.dao.findOne({keycustom:'uuid',valuecustom:uuid});
                if (item){
                    item.deleted = true;
                    await this.dao.updateOne(uuid,item);
                    const data = {
                        deleted:uuid
                    }
                    if (appconfig.message.enable){
                        try {
                            const mqs = MQservice.getInstance(appconfig.message.queuename,appconfig.message.exchname,appconfig.message.routerkey);
                            const message = {
                                appname:'bagapi',
                                date:Date.now(),
                                type_event:'delete-logic-file'
                            }
                            mqs.sendMessage(message);
                        } catch (error) {
                            const err = error as errorGenericType;
                            loggerApp.error(`Exception rabbitmq on delete logic file queue broker: ${err.message}`);
                        }
                    }
                    return res.status(201).json({message:'Delete logic OK',status:true,file:data});
                }
            }catch (error) {
                const err = error as errorGenericType;
                        
                loggerApp.error(`Exception delete item to db: ${err.message}`);
                        
                return next(new EController(`Message: ${err.message}`,ERRORS_APP.ENotFoundItem.code,ERRORS_APP.ENotFoundItem.HttpStatusCode)); 
            }
        }
        return res.status(404).json({message:'Not Found',status:false,file:{}});
    }
}