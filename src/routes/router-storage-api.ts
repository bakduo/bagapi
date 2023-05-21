import express from 'express';
import { checkToken, checkUpload } from '../middleware';
import { ControllerStorageApi } from '../service-layer/controller';
import { DaoFactory } from '../data-layer/factory/provider';
import { appconfig } from '../configure';

const dao = new DaoFactory().getDatabase(appconfig.db.type);

const controller = new ControllerStorageApi(dao);

export const routerStorageApi = express.Router();

routerStorageApi.post('/save',[checkToken,checkUpload],controller.save);

routerStorageApi.delete('/delete',checkToken,controller.delete);

routerStorageApi.get('/find',checkToken,controller.find);

routerStorageApi.put('/update',checkToken,controller.update);