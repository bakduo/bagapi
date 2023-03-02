import { NextFunction, Request, Response } from "express";

//https://github.com/ipenywis/clean-rest-apis/blob/main/src/apis/Cache.ts
export const setCache = function (req: Request, res: Response, next: NextFunction) {
    
    // Keep cahce for 2 minutes (in seconds)
    const period = 60 * 2;
  
    // you only want to cache for GET requests
    if (req.method == "GET") {
      res.set("Cache-control", `public, max-age=${period}`);
    } else {
      // for the other requests set strict no caching parameters
      res.set("Cache-control", `no-store`);
    }
  
    // remember to call next() to pass on the request
    next();
};