import { Subscription } from '../types';
import { Order } from "../types"  
import { ClientSecretCredential } from '@azure/identity'; 
import * as dotenv from 'dotenv';
import { Client } from '@microsoft/microsoft-graph-client';
import path from 'path';
import ejs from 'ejs';
const fs = require('fs'); 


export const OrderReceived =  async(order: Order): Promise<boolean> => {
    console.log("services - Mailer/OrderReceived - Start");  
    const res  =   await SendMailOrder(order);   
    console.log(`Email sent to order ${order.order_id}`);  
    console.log("services - Mailer/OrderReceived - End");    
    return res; 

}

export const PaymentReceived = (order: Order): void => {
    console.log("services - Mailer/OrderReceived - Start");
    console.log(`Email sent to order ${order.order_id}`);
    console.log("services - Mailer/OrderReceived - End");
}

export const OrderShipped = (order: Order): void => {
    console.log("services - Mailer/OrderReceived - Start");
    console.log(`Email sent to order ${order.order_id}`);
    console.log("services - Mailer/OrderReceived - End");
}

export const SubscriptionCreated = (subs: Subscription): void => {
    console.log("services - Mailer/SubscriptionCreated - Start");
    //console.log(`Email sent to order  ${order.order_id}`);
    console.log("services - Mailer/OrderReceived - End");
}

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

const SendMailOrder = async (order:Order) : Promise<boolean> => {
    
let emailOptions
 try {
    const ejsTemplatePath = path.join('./src/utils/templates', 'Received.ejs'); 
    const ejsTemplate = fs.readFileSync(ejsTemplatePath, 'utf-8'); 
     
    const htmlTemplate = ejs.render(ejsTemplate, { order });  
     emailOptions = {
        message: {
            subject: 'Subject of your email',
            body: {
                contentType: 'HTML',
                content: htmlTemplate,
            },
            toRecipients: [
                {
                    emailAddress: {
                        address: 'bruno.ferreira.rocha@gmail.com',
                    },
                },
            ],
        },
        saveToSentItems: false,
    };  
    await graphClient.api('/users/info@smartshopperpay.com/sendMail').post(emailOptions);
    return true;
 } catch (error) {  
    console.log("🚀 ~ SendMailOrder ~ error:", error)  
    return false;       
    
 }
    return false;       
}