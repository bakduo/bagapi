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

routerStorageApi.delete('/deletelogic',checkToken,controller.deletelogic);

//routerStorageApi.get('/findByName/:name',checkToken,controller.find);

routerStorageApi.get('/findById/:uuid',checkToken,controller.find);

routerStorageApi.get('/list',checkToken,controller.getAll);

routerStorageApi.get('/file/:uuid',checkToken,controller.getFile);

routerStorageApi.put('/update/:uuid',[checkToken,checkUpload],controller.update);