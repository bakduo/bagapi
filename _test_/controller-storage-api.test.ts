import * as chai from 'chai';

import buffer from 'buffer';

import supertest from "supertest";

import { app } from '../src/app';

import { faker } from '@faker-js/faker';

import * as fs from 'fs';

const cwd = process.cwd();

const filePath = cwd + '/_test_/asset';

const uploadPath = cwd + '/upload';

const requestTest = supertest(app);

const expect = chai.expect;

describe('Test controller UNIT',async () => {


    //let streamFile1:Uint8Array;

    const nameFile1 = 'sample.json';
    const nameFile2 = 'sample.png';
    const nameFile3 = 'bolo.raw';


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

        //streamFile1 = new Uint8Array(fs.readFileSync(`${filePath}/sample.json`));
    });

    after(async () => {
        console.log("###############AFTER TEST Controller#################");
        fs.unlinkSync(`${filePath}/${nameFile1}`);
        fs.unlinkSync(`${uploadPath}/${nameFile1}`);
        fs.unlinkSync(`${uploadPath}/${nameFile3}`);
        fs.unlinkSync(`${uploadPath}/${nameFile2}`);
    });

    describe('Operations commons for content user api with stream data text', () => {

        it('debería generar un file con los datos del user en formato stream data text', async () => {

            const tokenUser = faker.random.alphaNumeric(100);
    
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
            expect(responseUser.file).to.include.keys('save');
            expect(responseUser.file).to.include.keys('count');
            expect(responseUser.file.count).to.equal(sizeOFile);
            expect(responseUser.file.save).to.equal(nameFile1);
            console.log('### DONE ###');
        });
    });

    describe('Operations commons for content user api with stream data image', () => {
        
        it('debería generar un file con los datos del user en formato stream data image', async () => {

            const tokenUser = faker.random.alphaNumeric(100);
    
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
            expect(responseUser).to.be.a('object');
            expect(responseUser).to.include.keys('message');
            expect(responseUser).to.include.keys('file');
            expect(responseUser.file).to.be.a('object');
            expect(responseUser.file).to.include.keys('save');
            expect(responseUser.file).to.include.keys('count');
            expect(responseUser.file.count).to.equal(sizeOFile);
            expect(responseUser.file.save).to.equal(nameFile2);
            console.log('### DONE ###');
    
        });
    });

    describe('Operations commons for content user api with stream data', () => {

        it('debería generar un file con los datos del user en formato stream data', async () => {

            const tokenUser = faker.random.alphaNumeric(100);

            const readStream = fs.createReadStream(`${filePath}/${nameFile3}`);

            const sizeOFile  = fs.statSync(`${filePath}/${nameFile3}`).size;

            // const httpRequestOptions = {
            //     hostname: "localhost",
            //     port: 8081,
            //     path: '/api/save',
            //     method: 'POST',
            //     headers: {
            //       'Content-Type': 'application/octet-stream',
            //       'Content-Disposition':`file; filename="${nameFile3}"`,
            //       'Content-Length': Number(sizeOFile),
            //       'Accept':'application/vnd.api+json',
            //       'Authorization':`Bearer ${tokenUser}`
            //     }
            // }

            // const req = request(httpRequestOptions, (res) => {
            //     console.log(`Server response: ${res.statusCode}`)
            //     // console.log(`STATUS: ${res.statusCode}`);
            //     // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            //     // //res.setEncoding('utf8');
            //     // res.on('data', (chunk) => {
            //     //     console.log(`BODY: ${chunk}`);
            //     // });
            //     // res.on('end', () => {
            //     //     console.log('No more data in response.');
            //     // });
            // });

            // const readStream = fs.createReadStream(`${filePath}/${nameFile3}`);
            // readStream
            // .pipe(req)
            // .on("error", (err)=>{
            //     console.log(`Error send data ${err}`);
            // })
            // .on("end",() => {
            //     console.log(`Send complete terminado`);
            // });

            // for await (const chunk of readStream) {
            //     console.log(`>>> ${chunk.length}`);
            // }

            // console.log('### DONE ###');
            
            // const readStream = new Uint8Array(fs.readFileSync(`${filePath}/${nameFile3}`));

            // const formData = {
            //     filename: {
            //         value:  readStream,
            //         options: {
            //             name: nameFile3,
            //             contentType: 'application/octet-stream'
            //         }
            //     }
            // };

            // const response = await requestTest.post('/api/save').send(formData)
            // // .set('Content-Type','application/octet-stream')
            // // .set('Content-Disposition',`file; filename="${nameFile3}"`)
            // // .set('Accept','application/vnd.api+json')
            // .set('Authorization',`Bearer ${tokenUser}`);
            // expect(response.status).to.eql(201);
            // const responseUser = response.body;
            // expect(responseUser).to.be.a('object');
            // expect(responseUser).to.include.keys('message');
            // expect(responseUser).to.include.keys('file');
            // expect(responseUser.file).to.be.a('object');
            // expect(responseUser.file).to.include.keys('save');
            // expect(responseUser.file.save).to.equal(nameFile3);

            let chunks:Array<Buffer|string> = [];
            
            // readStream.on('open', ()=> console.log(`Openfile ${nameFile3}`));

            readStream.on('data', chunk => {
                //chunks+=chunk;
                //chunks.push(chunk);
                chunks = chunks.concat(chunk);
                console.log(`Received ${chunk.length} bytes of data.`);
            });

            readStream.on('finish', () => {
                console.log('All the data is transmitted');
            });

            readStream.on('error', (error) => console.log(error.message));

            readStream.on('end', async () => {
                //const dataArray = chunks as Uint8Array[];
                //const data = Buffer.concat(dataArray);
                //Buffer.from(chunks[0]).toString('base64')          
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
            .set('Content-Disposition',`file; filename="${nameFile3}"`)
            .set('Authorization',`Bearer ${tokenUser}`)
            expect(response.status).to.eql(201);
            const responseUser = response.body;
            expect(responseUser).to.be.a('object');
            expect(responseUser).to.include.keys('message');
            expect(responseUser).to.include.keys('file');
            expect(responseUser.file).to.be.a('object');
            expect(responseUser.file).to.include.keys('save');
            expect(responseUser.file).to.include.keys('count');
            expect(responseUser.file.count).to.equal(sizeOFile);
            expect(responseUser.file.save).to.equal(nameFile3);
            console.log('### DONE ###');
        });

    });

    //     it('debería generar un file con los datos del user en formato binary raw', async () => {

    //         const tokenUser = faker.random.alphaNumeric(100);

    //         const readStream = fs.createReadStream(`${filePath}/${nameFile3}`);

    //         const chunks:Array<Buffer|string> = [];
            
    //         readStream.on('data', chunk => chunks.push(chunk));

    //         readStream.on('finish', () => {
    //             console.log('All the data is transmitted');
    //         });

    //         readStream.on('end', async () => {
    //             const dataArray = chunks as Uint8Array[];
    //             const data = Buffer.concat(dataArray);
    //             const response = await request.post('/api/save').send(data)
    //             //MIME RFC 2046
    //             .set('Content-Type','application/octet-stream')
    //             //https://jsonapi.org/
    //             .set('Accept','application/vnd.api+json',)
    //             .set('Content-Disposition',`file; filename="${nameFile3}"`)
    //             .set('Authorization',`Bearer ${tokenUser}`)

    //             expect(response.status).to.eql(201);

    //             const responseUser = response.body;

    //             expect(responseUser).to.be.a('object');
    //             expect(responseUser).to.include.keys('message');
    //             expect(responseUser).to.include.keys('file');
    //             expect(responseUser.file).to.be.a('object');
    //             expect(responseUser.file).to.include.keys('save');
    //             expect(responseUser.file.save).to.equal("noexiste");
                
    //         }); 

    //     });
    // })
})


