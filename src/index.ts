import { Order } from './types/index';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser'; 
import * as dotenv from 'dotenv';
import { OrderReceived } from './utils/mailer';  
import { ensureToken } from './middleware/token';   
dotenv.config();


const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');


app.get('/',async (req: Request, res: Response) => {
    try {
        const users = await getUsersData();
        res.json( users );
    } catch (error) {
        console.error('Error fetching data:', (error as Error).message); // Use (error as Error).message to access the message property
        res.status(500).send(__dirname );
    }
});  
app.post('/neworder', ensureToken, async (req: Request, res: Response) => {
    try {     
        console.log("services - api/neworder - Start")   

        const encryptedPayload = req.body; 
        console.log("🚀 ~ app.post ~ encryptedPayload:", encryptedPayload)
        let newOrder: Order = encryptedPayload;
        console.log("🚀 ~ app.post ~ newOrder:", newOrder);
        
        const response = await OrderReceived(newOrder);

        console.log("response:", response); 

        if (response) {
            res.sendStatus(200);   
        } else {
            res.status(403).json({ error: "Não foi possível enviar o email" });
        }

        console.log("services - api/neworder - End");

    } catch (error) {
        console.error('Error processing order:', error);
        res.status(500).send(__dirname);
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

