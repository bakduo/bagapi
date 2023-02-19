import {Request, Response, NextFunction} from 'express';
import { CustomRequestPayload } from '../../middleware/interfaces';

export class ControllerStorageApi {

    save = async (req:CustomRequestPayload, res:Response, next:NextFunction)=>{

        return res.status(201).json({message:'Save data OK',status:true,file:req.payload});
    }

    update = async (req:Request, res:Response, next:NextFunction)=>{
        return res.status(201).json({message:'Upadate content OK',status:true});
    }

    find = async (req:Request, res:Response, next:NextFunction)=>{
       return res.status(200).json({message:'Conent Find it',status:true});
    }

    delete = async (req:Request, res:Response, next:NextFunction)=>{
        return res.status(200).json({message:'Content deleted',status:true});
    }
}