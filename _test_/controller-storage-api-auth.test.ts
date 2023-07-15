import * as chai from 'chai';

import buffer from 'buffer';

import supertest from "supertest";

import { app } from '../src/app';

//import { faker } from '@faker-js/faker';

import * as fs from 'fs';

const cwd = process.cwd();

const filePath = cwd + '/_test_/asset';

const uploadPath = cwd + '/upload';

const requestTest = supertest(app);

const expect = chai.expect;

describe('Test controller UNIT with auth',async () => {

    interface tokenAuth {
        fail:boolean,
        refreshToken:string,
        token: string
    }

    const nameFile1 = 'sample.json';
    const nameFile2 = 'sample.png';
    const userResponse:tokenAuth = {
        fail: false,
        refreshToken: '',
        token: ''
    };

    before(async function(){

        console.log("###############BEGIN TEST Controller#################");

        const tmpJson = [
            {name:'name1',
            service:'service1',
            internal:'internal1'},
            {name:'name2',
            service:'service2',
            internal:'internal2'},
            {name:'name3',
            service:'service3',
            internal:'internal3'},
        ];

        console.log(`Buffer default max: ${buffer.constants.MAX_LENGTH}` )
        
        fs.writeFileSync(`${filePath}/${nameFile1}`,JSON.stringify(tmpJson),'utf8');

        const response = await fetch("http://localhost:8080/api/login", {
            method: 'POST',
            headers:  new Headers({
                "Content-Type": "application/json",
                "credentials": 'same-origin'
            }),
            body: JSON.stringify({
                email:"sample@sample.com",
                password:"sample"
            })
        });

        const valueJSON = await response.json() as tokenAuth;

        userResponse.token = valueJSON.token

        //streamFile1 = new Uint8Array(fs.readFileSync(`${filePath}/sample.json`));
    });

    after(async () => {
        console.log("###############AFTER TEST Controller#################");
        fs.unlinkSync(`${filePath}/${nameFile1}`);
        fs.unlinkSync(`${uploadPath}/${nameFile1}`);
        fs.unlinkSync(`${uploadPath}/${nameFile2}`);
        userResponse.fail = false;
        userResponse.refreshToken='';
        userResponse.token='';
    });



    describe('Operations commons for content user api with stream data text', () => {

        it('debería generar un file con los datos del user en formato stream data text', async () => {

            const tokenUser = userResponse.token;
    
            const readStream = fs.createReadStream(`${filePath}/${nameFile1}`);
    
            const sizeOFile  = fs.statSync(`${filePath}/${nameFile1}`).size;
    
            let chunks:Array<Buffer|string> = [];
    
            readStream.on('data', chunk => {
                chunks = chunks.concat(chunk);
                console.log(`Received ${chunk.length} bytes of data.`);
            });
    
            readStream.on('finish', () => {
                console.log('All the data is transmitted');
            });
    
            readStream.on('error', (error) => console.log(error.message));
    
            readStream.on('end', async () => {          
                console.log('### read stream end event  => DONE ###');    
            });
            
            for await (const chunk of readStream) {
                console.log(`>>> ${chunk.length}`);
            }
    
            const dataArray = chunks as Uint8Array[];
            const data = Buffer.concat(dataArray);
            const response = await requestTest.post('/api/save').send(data)
            //MIME RFC 2046
            .set('Content-Type','application/octet-stream')
            //https://jsonapi.org/
            .set('Accept','application/vnd.api+json',)
            //.set('Content-Length',`${sizeOFile}`)
            .set('Content-Disposition',`file; filename="${nameFile1}"`)
            .set('Authorization',`Bearer ${tokenUser}`)
            expect(response.status).to.eql(201);
            const responseUser = response.body;
            expect(responseUser).to.be.a('object');
            expect(responseUser).to.include.keys('message');
            expect(responseUser).to.include.keys('file');
            expect(responseUser.file).to.be.a('object');
            expect(responseUser.file).to.include.keys('name');
            expect(responseUser.file).to.include.keys('count');
            expect(responseUser.file.count).to.equal(sizeOFile);
            expect(responseUser.file.name).to.equal(nameFile1);
            expect(responseUser.file.owner).to.equal("sample@sample.com");
            console.log('### DONE ###');
        });
    });

    describe('Operations commons for content user api with stream data image', () => {
        
        it('debería generar un file con los datos del user en formato stream data image', async () => {

            const tokenUser = userResponse.token;
    
            const readStream = fs.createReadStream(`${filePath}/${nameFile2}`);
    
            const sizeOFile  = fs.statSync(`${filePath}/${nameFile2}`).size;
    
            let chunks:Array<Buffer|string> = [];
    
            readStream.on('data', chunk => {
                chunks = chunks.concat(chunk);
                console.log(`Received ${chunk.length} bytes of data.`);
            });
    
            readStream.on('finish', () => {
                console.log('All the data is transmitted');
            });
    
            readStream.on('error', (error) => console.log(error.message));
    
            readStream.on('end', async () => {          
                console.log('### read stream end event  => DONE ###');    
            });
            
            for await (const chunk of readStream) {
                console.log(`>>> ${chunk.length}`);
            }
    
            const dataArray = chunks as Uint8Array[];
            const data = Buffer.concat(dataArray);
            const response = await requestTest.post('/api/save').send(data)
            //MIME RFC 2046
            .set('Content-Type','application/octet-stream')
            //https://jsonapi.org/
            .set('Accept','application/vnd.api+json',)
            //.set('Content-Length',`${sizeOFile}`)
            .set('Content-Disposition',`file; filename="${nameFile2}"`)
            .set('Authorization',`Bearer ${tokenUser}`)
            expect(response.status).to.eql(201);
            const responseUser = response.body;
            console.log(responseUser.file);
            expect(responseUser).to.be.a('object');
            expect(responseUser).to.include.keys('message');
            expect(responseUser).to.include.keys('file');
            expect(responseUser.file).to.be.a('object');
            expect(responseUser.file).to.include.keys('name');
            expect(responseUser.file).to.include.keys('count');
            expect(responseUser.file.count).to.equal(sizeOFile);
            expect(responseUser.file.name).to.equal(nameFile2);
            expect(responseUser.file.owner).to.equal("sample@sample.com");
            console.log('### DONE ###');
    
        });
    });

})