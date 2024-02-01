import express, { Request, Response,NextFunction, response  } from 'express';
import * as dotenv from 'dotenv';
const jwt = require('jsonwebtoken')
dotenv.config();
const app = express();


export const ensureToken = function(req: Request, res: Response, next: NextFunction) {
    const bearerHeader = req.headers["authorization"];
    console.log("bearerHeader:",bearerHeader);
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];

        jwt.verify(bearerToken, process.env.JWT_SECRETKEY, (err: any, result: any) => {
            if (err) {
                res.json(err);
            } else {
                next();
            }
        });
    } else {
        res.sendStatus(403);
    }
};