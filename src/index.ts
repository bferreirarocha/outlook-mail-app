import express, { Request, Response } from 'express';
import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import bodyParser from 'body-parser';
import fs from 'fs'; // Import the 'fs' module for file operations

const app = express();
const port = 3000;
app.use(bodyParser.json());

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

app.post('/neworder', async (req: Request, res: Response) => {
    try {
        // Read the HTML template from a local file
        const htmlTemplatePath = './template.html';
        const htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf-8');

        // Include the HTML template in the email options
        const emailOptions = {
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

        // Send the email
        await graphClient.api('/users/info@smartshopperpay.com/sendMail').post(emailOptions);
        res.status(200).send('Email sent successfully.');
    } catch (error: any) {
        console.error('Error sending email:', (error as Error).message);
        if (error.innerError) {
            console.error('Inner Error:', error.innerError);
        }
        res.status(500).send('Error sending email.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
