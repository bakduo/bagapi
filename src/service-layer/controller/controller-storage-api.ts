import {Request, Response, NextFunction} from 'express';
import { CustomRequestPayload, IFileUpload } from '../../middleware/interfaces';
import { IGenericDB, ItemFile } from '../../data-layer';
import { ERRORS_APP, loggerApp } from '../../configure';
import { EController, errorGenericType } from '../util/error';

export class ControllerStorageApi {

    private dao:IGenericDB<ItemFile>

    constructor(_dao:IGenericDB<ItemFile>){
        this.dao = _dao;
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
                uuid:'',
                timestamp:Math.floor(Date.now() / 1000)
            };

        try {
            this.dao.saveOne(item);
        } catch (error) {
            const err = error as errorGenericType;
                    
            loggerApp.error(`Exception save item to db: ${err.message}`);
                    
            return next(new EController(`Fail to ${err.message}`,ERRORS_APP.ESaveFileDB.code,ERRORS_APP.ESaveFileDB.HttpStatusCode)); 
        }

        return res.status(201).json({message:'Save data OK',status:true,file:req.payload});
    }

    update = async (req:Request, res:Response, next:NextFunction)=>{
        return res.status(201).json({message:'Upadate content OK',status:true});
    }

    find = async (req:Request, res:Response, next:NextFunction)=>{
       return res.status(200).json({message:'Conent Find it',status:true});
    }

    delete = async (req:Request, res:Response, next:NextFunction)=>{
        const { name } = req.body;
        if (name){
            const item = await this.dao.findOne({keycustom:'name',valuecustom:name});
            if (item){
                const data = {
                    deleted: name
                }
                return res.status(200).json({message:'Content deleted',status:true,file:data});
            }
        }
        return res.status(404).json({message:'Not Found',status:false,file:{}});
    }
}