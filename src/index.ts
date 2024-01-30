import { Order } from './types/index';
import express, { Request, Response,NextFunction  } from 'express';
import bodyParser from 'body-parser'; 
import path from 'path';
import { ClientSecretCredential } from '@azure/identity'; 
import * as dotenv from 'dotenv';
import { Client } from '@microsoft/microsoft-graph-client';
import { OrderReceived } from './services/mailer';
let jwt = require('jsonwebtoken')
dotenv.config();


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const viewsPath = path.join('./src', 'views'); 
app.set('views', viewsPath);
app.set('view engine', 'ejs');


console.log("JWT_SECRETKEY:","SmartShopperLedokol2023"); 
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


const tenantId = 'fd1f35a4-a17d-4d25-9135-a8c37d70fba6';
const clientId = 'dbe13f8d-0c8e-4a93-a4ea-222bb5bfafe9';
const clientSecret = 'ezf8Q~eluP.3Wx~bMOXBa0M_pSeyM59583vbBdb~';
const scopes = ['https://graph.microsoft.com/.default'];



const clientSecretCredential = new ClientSecretCredential(
    tenantId,
    clientId,
    clientSecret
);

const graphClient = Client.initWithMiddleware({
    authProvider: {
        getAccessToken: async () => {
            const tokenResponse = await clientSecretCredential.getToken(scopes);
            return tokenResponse.token;
        },
    },
});

app.get('/', async (req: Request, res: Response) => {
    try {
        const users = await getUsersData();
        res.render('index', { users });
    } catch (error) {
        console.error('Error fetching data:', (error as Error).message); // Use (error as Error).message to access the message property
        res.status(500).send(__dirname );
    }
});  

app.post('/neworder',ensureToken, async (req: Request, res: Response) => {
    try {     
        console.log("services - api/neworder - Start")   

        const   encryptedPayload = req.body; 
        console.log("🚀 ~ app.post ~ encryptedPayload:", encryptedPayload)

        let newOrder: Order = encryptedPayload;
        console.log("🚀 ~ app.post ~ newOrder:", newOrder)
        console.log("newOrder:",newOrder); 
        OrderReceived(newOrder); 

      //  res.render('index', {users: encryptedPayload });  
        console.log("services - api/neworder - End")   

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


async function SendMail() {
    
}

