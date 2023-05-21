import {Request, Response, NextFunction} from 'express';
import { CustomRequestPayload, IFileUpload } from '../../middleware/interfaces';
import { IGenericDB, ItemFile } from '../../data-layer';
import { ERRORS_APP, loggerApp } from '../../configure';
import { EController, errorGenericType } from '../util/error';
import { v4 as uuidv4 } from 'uuid';

export class ControllerStorageApi {

    private dao:IGenericDB<ItemFile>

    constructor(_dao:IGenericDB<ItemFile>){
        this.dao = _dao;
        console.log(this.dao);
    }

    save = async (req:CustomRequestPayload, res:Response, next:NextFunction)=>{

        const {name,path} = req.payload as IFileUpload;

        const item = {
                name:name,
                created:new Date(),
                path:path,
                modify:new Date(),
                deleted:false,
                owner:'',
                uuid:uuidv4(),
                timestamp:Math.floor(Date.now() / 1000)
            };

        try {
            await this.dao.saveOne(item);
        } catch (error) {
            const err = error as errorGenericType;
                    
            loggerApp.error(`Exception save item to db: ${err.message}`);
                    
            return next(new EController(`Message: ${err.message}`,ERRORS_APP.ESaveFileDB.code,ERRORS_APP.ESaveFileDB.HttpStatusCode)); 
        }

        return res.status(201).json({message:'Save data OK',status:true,file:req.payload});
    }

    update = async (req:Request, res:Response, next:NextFunction)=>{
        return res.status(201).json({message:'Upadate content OK',status:true});
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

    delete = async (req:Request, res:Response, next:NextFunction)=>{
        const { uuid } = req.body;
        if (uuid){
            try{
                const deleted = await this.dao.deleteOne({keycustom:'uuid',valuecustom:uuid});
                if (deleted){
                    const data = {
                        deleted: uuid
                    }
                    return res.status(200).json({message:'Content deleted',status:true,file:data});
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