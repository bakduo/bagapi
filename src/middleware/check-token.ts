import {Response, NextFunction} from 'express';
import { ERRORS_APP, appconfig, loggerApp, tokenResponse } from '../configure/configure-app';
import { ETokenInvalid, errorGenericType } from '../service-layer/util';
import { CustomRequestPayload } from './interfaces';
import { MQservice } from '../service-layer/messages';


export const checkToken = async (req:CustomRequestPayload, res:Response, next:NextFunction) => {
    req.payload = {
        file:{},
        profile: {}
    };
    if (appconfig.service.enable_service_token){
        try {

            if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    
                const token = req.headers.authorization.split(' ')[1];
    
                const response = await fetch(appconfig.service.auth.server, {
                    method: 'GET',
                    headers:  new Headers({
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    })
                });
    
                const userResponse = await response.json() as tokenResponse;
    
                if (userResponse.profile){
                    if (userResponse.profile.roles.includes('user')){
                        req.payload.profile = userResponse.profile;
                        return next();
                    }
                }
            }
            if (appconfig.message.enable){
                try {
                    const mqs = MQservice.getInstance(appconfig.message.queuename,appconfig.message.exchname,appconfig.message.routerkey);
                    const message = {
                        appname:'bagapi',
                        date:Date.now(),
                        type_event:'token-incorrecto-401'
                    }
                    mqs.sendMessage(message);
                } catch (error) {
                    const err = error as errorGenericType;
                    loggerApp.error(`Exception rabbitmq on delete logic file queue broker: ${err.message}`);
                }
            }
            return res.status(401).json({ message: 'Operation failed, required authorization' });
        } catch (error) {
            const err = error as errorGenericType;
            loggerApp.error(`Exception on checkToken into jwt.verify: ${err.message}`);
            return next(new ETokenInvalid(`Token Invalid user ${err.message}`,ERRORS_APP.ETokenInvalid.code,ERRORS_APP.ETokenInvalid.HttpStatusCode));
        }
    }else{
        req.payload.profile = {
            id:'fake',
            roles:[]
        }
        return next();
    }
}