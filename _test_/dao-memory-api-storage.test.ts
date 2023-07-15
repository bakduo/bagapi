import * as chai from 'chai';

const expect = chai.expect;

import { faker } from '@faker-js/faker';
import { ItemFileMemory } from '../src/data-layer/dao/item-file.memory';
import { MemoryDatastore } from '../src/data-layer/data-store/memory';

const memory = new MemoryDatastore();

const dao = new ItemFileMemory(memory);

describe('Test DAO Memory UNIT',async () => {


    let uuid1:string;
    let uuid2:string;
    let uuid3:string;

    before(async function(){
        console.log("###############BEFORE TEST DAO Memory#################");
        uuid1 = faker.database.mongodbObjectId();
        uuid2 = faker.database.mongodbObjectId();
        uuid3 = faker.database.mongodbObjectId();
        
    });

    after(async function(){
        console.log("###############AFTER TEST DAO Memory#################");
        dao.deleteAll();
    });

    describe('Operations commons for DAO Memory', () => {

        it('SAVE ITEM DAO', async () => {
            
            const item1 = {name:faker.hacker.adjective(),created:new Date(),path:faker.hacker.adjective(),modify:new Date(),deleted:false,owner:faker.internet.userName(),uuid:uuid1,timestamp:Math.floor(Date.now() / 1000),sizeof:0};
            
            const saved = await dao.saveOne(item1);

            expect(saved).to.be.a('object');
            expect(saved).to.include.keys('name','created','path','deleted','uuid');
            expect(saved).to.equal(item1);

        });

        it('SAVE ITEM 2 DAO', async () => {
            
            const item1 = {name:faker.hacker.adjective(),created:new Date(),path:faker.hacker.adjective(),modify:new Date(),deleted:false,owner:faker.internet.userName(),uuid:uuid2,timestamp:Math.floor(Date.now() / 1000),sizeof:0};
            
            const saved = await dao.saveOne(item1);

            expect(saved).to.be.a('object');
            expect(saved).to.include.keys('name','created','path','deleted','uuid');
            expect(saved).to.equal(item1);

        });

        it('SAVE ITEM 3 DAO', async () => {
            
            const item1 = {name:faker.hacker.adjective(),created:new Date(),path:faker.hacker.adjective(),modify:new Date(),deleted:false,owner:faker.internet.userName(),uuid:uuid3,timestamp:Math.floor(Date.now() / 1000),sizeof:0};
            
            const saved = await dao.saveOne(item1);

            expect(saved).to.be.a('object');
            expect(saved).to.include.keys('name','created','path','deleted','uuid');
            expect(saved).to.equal(item1);
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

            const itemNew = {name:faker.hacker.adjective(),created:new Date(),path:faker.hacker.adjective(),modify:new Date(),deleted:false,owner:faker.internet.userName(),uuid:uuid2,timestamp:Math.floor(Date.now() / 1000),sizeof:0};
            
            const itemUpdated = await dao.updateOne(uuid2,itemNew);

            expect(itemUpdated).to.be.a('object');
            expect(itemUpdated).to.include.keys('name','created','path','deleted','uuid');
            expect(itemUpdated).to.equal(itemNew);
            
        });

        it('UPDATEONE ITEM DAO DONT Exist', async () => {

            const itemNew = {name:faker.hacker.adjective(),created:new Date(),path:faker.hacker.adjective(),modify:new Date(),deleted:false,owner:faker.internet.userName(),uuid:'434343',timestamp:Math.floor(Date.now() / 1000),sizeof:0};
            
            try {
                await dao.updateOne('434343',itemNew);
            } catch (error:any) {
                expect(error).to.be.an('Error');
                expect(error.message).to.be.contain('Not found')
            }
            
        });

    });

});