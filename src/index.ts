import { Order } from './types/index';
import express, { Request, Response,NextFunction, response  } from 'express';
import bodyParser from 'body-parser'; 
import path from 'path';
import { ClientSecretCredential } from '@azure/identity'; 
import * as dotenv from 'dotenv';
import { Client } from '@microsoft/microsoft-graph-client';
import { OrderReceived } from './utils/mailer';
let jwt = require('jsonwebtoken')
dotenv.config();


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

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
app.get('/',async (req: Request, res: Response) => {
    try {
        const users = await getUsersData();
        res.json( users );
    } catch (error) {
        console.error('Error fetching data:', (error as Error).message); // Use (error as Error).message to access the message property
        res.status(500).send(__dirname );
    }
});  

app.post('/neworder',ensureToken, async (req: Request, res: Response) => {
    try {     
        console.log("services - api/neworder - Start")   

        const encryptedPayload = req.body; 
        console.log("🚀 ~ app.post ~ encryptedPayload:", encryptedPayload)
        let newOrder: Order = encryptedPayload;
        console.log("🚀 ~ app.post ~ newOrder:", newOrder);
        console.log("newOrder:", newOrder);
        OrderReceived(newOrder).then((response: boolean) => {
            console.log("response:", response); 
            if(response)
            res.sendStatus(200);   
        else    
            res.sendStatus(403).json({error: "Não foi possível enviar o email"} );      
        }).catch((error: any) => {
            console.error('Error processing order:', error);
            res.sendStatus(500);
        });
        console.log("services - api/neworder - End");

    } catch (error) {
        console.error('Error fetching data:', (error as Error).message); // Use (error as Error).message to access the message property
        res.status(500).send(__dirname );
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

async function getUsersData() {
    return [
        { name: 'User 1', email: 'user1@example.com' },
        { name: 'User 2', email: 'user2@example.com' },
    ];
} 

