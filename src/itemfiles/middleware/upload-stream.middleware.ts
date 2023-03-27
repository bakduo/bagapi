import * as fs from 'fs';

import { Request, Response, NextFunction } from 'express';

export const extractNameFileFromHeader = (payload: string) => {
  if (payload.split(';').length == 2) {
    if (payload.split(';')[1].split('=').length == 2) {
      return payload.split(';')[1].split('=')[1].replace(/"/g, '');
    }
  }
  throw Error('Header filename incompatible');
};

export interface CPayloadFile {
  filename: {
    options: {
      name: string;
      contentType: string;
    };
  };
}

export interface CustomRequestPayload extends Request {
  payload?: unknown;
  count?: number;
}

const cwd = process.cwd();

const pathUpload = cwd + '/upload';

const uploadFile = (req: CustomRequestPayload, filePath: string) => {
  console.log(req.headers);
  const nameFile = extractNameFileFromHeader(
    req.headers['content-disposition'] || '',
  );
  //const nameFile = form.filename.options.name;
  //let bytes = 0;
  req.count = 0;
  //console.log(nameFile);
  return new Promise((resolve, reject) => {
    //https://dev.to/tqbit/how-to-use-node-js-streams-for-fileupload-4m1n
    const stream = fs.createWriteStream(`${filePath}/${nameFile}`);
    // With the open - event, data will start being written
    // from the request to the stream's destination path
    stream.on('open', () => {
      console.log('Stream open ...  0.00%');
      req.pipe(stream);
    });

    // Drain is fired whenever a data chunk is written.
    // When that happens, print how much data has been written yet.
    stream.on('drain', () => {
      const written = Number(stream.bytesWritten);
      const total = Number(req.headers['content-length']);
      const pWritten = ((written / total) * 100).toFixed(2);
      //req.count = total;
      console.log(`Processing  ...  ${pWritten}% done ${nameFile}`);
    });

    // When the stream is finished, print a final message
    // Also, resolve the location of the file to calling function
    stream.on('close', () => {
      console.log(`Processing  ...  100% ${nameFile}`);
      req.count = Number(req.headers['content-length']);
      resolve({ save: nameFile, count: req.count });
    });
    // If something goes wrong, reject the primise
    stream.on('error', (err) => {
      console.error(err);
      reject(err);
    });
  });
};

export const checkUpload = async (
  req: CustomRequestPayload,
  res: Response,
  next: NextFunction,
) => {
  if (req.body) {
    //const {filename} = req.body;
    console.log(req.body);
    uploadFile(req, pathUpload)
      .then((data) => {
        req.payload = data;
        return next();
      })
      .catch((err) => {
        return res
          .status(400)
          .json({ message: `Fail to upload streams for user ${err}` });
      });
  }
};
