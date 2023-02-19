import * as chai from 'chai';

const expect = chai.expect;

import { faker } from '@faker-js/faker';
import { ItemFileMongo } from '../src/data-layer/dao/item-file.mongo';

const dao = new ItemFileMongo();

describe('Test DAO Mongo UNIT',async () => {


    let uuid1:string;
    let uuid2:string;
    let uuid3:string;

    before(async function(){
        console.log("###############BEFORE TEST DAO Mongo#################");
        uuid1 = faker.database.mongodbObjectId();
        uuid2 = faker.database.mongodbObjectId();
        uuid3 = faker.database.mongodbObjectId();
        
    });

    after(async function(){
        console.log("###############AFTER TEST DAO Mongo#################");
        await dao.deleteAll();
    });

    describe('Operations commons for DAO Mongo', () => {

        it('SAVE ITEM DAO', async () => {
            
            const item1 = {name:faker.hacker.adjective(),created:new Date(),path:faker.hacker.adjective(),modify:new Date(),deleted:false,owner:faker.internet.userName(),uuid:uuid1,timestamp:Math.floor(Date.now() / 1000)};
            
            const saved = await dao.saveOne(item1);

            expect(saved).to.be.a('object');
            expect(saved).to.include.keys('name','created','path','deleted','uuid');
            expect(saved.name).to.equal(item1.name);
            expect(saved.created.getTime()).to.equal(item1.created.getTime());
            expect(saved.path).to.equal(item1.path);
            expect(saved.modify.getTime()).to.equal(item1.modify.getTime());
            expect(saved.owner).to.equal(item1.owner);
            expect(saved.timestamp).to.equal(item1.timestamp);
            expect(saved.uuid).to.equal(item1.uuid);

        });

        it('SAVE ITEM 2 DAO', async () => {
            
            const item1 = {name:faker.hacker.adjective(),created:new Date(),path:faker.hacker.adjective(),modify:new Date(),deleted:false,owner:faker.internet.userName(),uuid:uuid2,timestamp:Math.floor(Date.now() / 1000)};
            
            const saved = await dao.saveOne(item1);

            expect(saved.name).to.equal(item1.name);
            expect(saved.created.getTime()).to.equal(item1.created.getTime());
            expect(saved.path).to.equal(item1.path);
            expect(saved.modify.getTime()).to.equal(item1.modify.getTime());
            expect(saved.owner).to.equal(item1.owner);
            expect(saved.timestamp).to.equal(item1.timestamp);
            expect(saved.uuid).to.equal(item1.uuid);

        });

        it('SAVE ITEM 3 DAO', async () => {
            
            const item1 = {name:faker.hacker.adjective(),created:new Date(),path:faker.hacker.adjective(),modify:new Date(),deleted:false,owner:faker.internet.userName(),uuid:uuid3,timestamp:Math.floor(Date.now() / 1000)};
            
            const saved = await dao.saveOne(item1);

            expect(saved).to.be.a('object');
            expect(saved).to.include.keys('name','created','path','deleted','uuid');
            expect(saved.name).to.equal(item1.name);
            expect(saved.created.getTime()).to.equal(item1.created.getTime());
            expect(saved.path).to.equal(item1.path);
            expect(saved.modify.getTime()).to.equal(item1.modify.getTime());
            expect(saved.owner).to.equal(item1.owner);
            expect(saved.timestamp).to.equal(item1.timestamp);
            expect(saved.uuid).to.equal(item1.uuid);
        });

        it('COUNT ITEM 3 DAO', async () => {
    
            const items = await dao.getAll();

            expect(items.length).to.equal(3);
        });


        it('FINDONE ITEM DAO', async () => {
            
            const FoundItem = await dao.findOne({keycustom:'uuid',valuecustom:uuid1});
            expect(FoundItem).to.be.a('object');
            expect(FoundItem).to.include.keys('name','created','path','deleted','uuid');
            expect(FoundItem.uuid).to.equal(uuid1);

        });

        it('DELETEONE ITEM DAO', async () => {
            
            const OK = await dao.deleteOne({keycustom:'uuid',valuecustom:uuid1});
            expect(OK).to.equal(true);

        });

        it('DELETEONE AGAIN DONT EXIST ITEM DAO', async () => {
            
            try {
                await dao.deleteOne({keycustom:'uuid',valuecustom:uuid1});
            } catch (error:any) {
                expect(error).to.be.an('Error');
                expect(error.message).to.be.contain('Not found');
            }
            
        });

        it('UPDATEONE ITEM DAO', async () => {

            const itemNew = {name:faker.hacker.adjective(),created:new Date(),path:faker.hacker.adjective(),modify:new Date(),deleted:false,owner:faker.internet.userName(),uuid:uuid2,timestamp:Math.floor(Date.now() / 1000)};
            
            const itemUpdated = await dao.updateOne(uuid2,itemNew);

            expect(itemUpdated).to.be.a('object');
            expect(itemUpdated).to.include.keys('name','created','path','deleted','uuid');
            //expect(itemUpdated).to.equal(itemNew);
            expect(itemUpdated.name).to.equal(itemNew.name);
            //https://stackoverflow.com/questions/4428327/checking-if-two-dates-have-the-same-date-info
            expect(itemUpdated.created.getTime()).to.equal(itemNew.created.getTime());
            expect(itemUpdated.path).to.equal(itemNew.path);
            expect(itemUpdated.modify.getTime()).to.equal(itemNew.modify.getTime());
            expect(itemUpdated.owner).to.equal(itemNew.owner);
            expect(itemUpdated.timestamp).to.equal(itemNew.timestamp);
            expect(itemUpdated.uuid).to.equal(itemNew.uuid);
            
        });

        it('UPDATEONE ITEM DAO DONT Exist', async () => {

            const itemNew = {name:faker.hacker.adjective(),created:new Date(),path:faker.hacker.adjective(),modify:new Date(),deleted:false,owner:faker.internet.userName(),uuid:'434343',timestamp:Math.floor(Date.now() / 1000)};
            
            try {
                await dao.updateOne('434343',itemNew);
            } catch (error:any) {
                expect(error).to.be.an('Error');
                expect(error.message).to.be.contain('Not found')
            }
            
        });

    });

});