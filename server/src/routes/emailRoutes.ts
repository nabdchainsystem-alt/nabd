import express from 'express';
import { PrismaClient } from '@prisma/client';
import { decrypt, encrypt } from '../utils/encryption';
import { google } from 'googleapis';
import { googleOAuth2Client } from '../services/googleAuth';
import * as msal from '@azure/msal-node';
import 'isomorphic-fetch';
import { Client } from '@microsoft/microsoft-graph-client';

const router = express.Router();
const prisma = new PrismaClient();

// Helper to get Google Client
const getGoogleClient = (accessToken: string, refreshToken: string) => {
    const client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );
    client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken
    });
    return client;
};

// Helper to get Graph Client
const getGraphClient = (accessToken: string) => {
    return Client.init({
        authProvider: (done) => {
            done(null, accessToken);
        }
    });
};

router.get('/list', async (req, res) => {
    try {
        const accounts = await prisma.emailAccount.findMany();
        let allEmails: any[] = [];

        for (const account of accounts) {
            const accessToken = decrypt(account.accessToken);
            // TODO: check expiry and refresh if needed

            if (account.provider === 'google') {
                try {
                    const auth = getGoogleClient(accessToken, decrypt(account.refreshToken));

                    // Refresh if needed (simple check)
                    // googleapis handles refresh automatically if refresh_token is set? 
                    // Verify expiry? For now, let's assume valid or let it fail.

                    const gmail = google.gmail({ version: 'v1', auth });
                    const response = await gmail.users.messages.list({
                        userId: 'me',
                        maxResults: 10,
                    });

                    const messages = response.data.messages || [];

                    // Fetch details
                    const details = await Promise.all(messages.map(async (msg) => {
                        const content = await gmail.users.messages.get({
                            userId: 'me',
                            id: msg.id!
                        });
                        const headers = content.data.payload?.headers;
                        const subject = headers?.find(h => h.name === 'Subject')?.value || 'No Subject';
                        const from = headers?.find(h => h.name === 'From')?.value || 'Unknown';
                        const date = headers?.find(h => h.name === 'Date')?.value || '';
                        const snippet = content.data.snippet;

                        return {
                            id: msg.id,
                            provider: 'google',
                            accountEmail: account.email,
                            subject,
                            sender: from,
                            preview: snippet,
                            time: date,
                            initial: from.charAt(0).toUpperCase(),
                            color: 'bg-blue-500', // Mock color
                            isUnread: content.data.labelIds?.includes('UNREAD')
                        };
                    }));

                    allEmails = [...allEmails, ...details];
                } catch (e) {
                    console.error(`Error fetching google for ${account.email}`, e);
                }
            } else if (account.provider === 'outlook') {
                try {
                    const client = getGraphClient(accessToken);
                    const response = await client.api('/me/messages')
                        .top(10)
                        .select('id,subject,from,bodyPreview,receivedDateTime,isRead')
                        .get();

                    const msgs = response.value.map((msg: any) => ({
                        id: msg.id,
                        provider: 'outlook',
                        accountEmail: account.email,
                        subject: msg.subject,
                        sender: msg.from?.emailAddress?.name || msg.from?.emailAddress?.address,
                        preview: msg.bodyPreview,
                        time: msg.receivedDateTime,
                        initial: (msg.from?.emailAddress?.name || 'O').charAt(0),
                        color: 'bg-blue-600',
                        isUnread: !msg.isRead
                    }));

                    allEmails = [...allEmails, ...msgs];
                } catch (e) {
                    console.error(`Error fetching outlook for ${account.email}`, e);
                }
            }
        }


        // Sort by time
        allEmails.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

        res.json(allEmails);
    } catch (error) {
        console.error("List Error", error);
        res.status(500).json({ error: "Failed to fetch emails" });
    }
});

router.post('/send', async (req, res) => {
    const { to, subject, body, provider } = req.body;

    try {
        // Find the account for this provider
        // TODO: Handle multiple accounts better. For now take the first one of that provider.
        const account = await prisma.emailAccount.findFirst({
            where: { provider: provider || 'google' }
        });

        if (!account) return res.status(404).json({ error: "No connected account found" });

        const accessToken = decrypt(account.accessToken);

        if (account.provider === 'google') {
            const auth = getGoogleClient(accessToken, decrypt(account.refreshToken));
            const gmail = google.gmail({ version: 'v1', auth });

            // Create valid MIME message
            const str = [
                `To: ${to}`,
                `Subject: ${subject}`,
                `Content-Type: text/html; charset=utf-8`,
                ``,
                body
            ].join('\n');
            const encodedMessage = Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

            await gmail.users.messages.send({
                userId: 'me',
                requestBody: {
                    raw: encodedMessage
                }
            });
        } else if (account.provider === 'outlook') {
            const client = getGraphClient(accessToken);
            await client.api('/me/sendMail').post({
                message: {
                    subject: subject,
                    body: {
                        contentType: "HTML",
                        content: body
                    },
                    toRecipients: [
                        {
                            emailAddress: {
                                address: to
                            }
                        }
                    ]
                }
            });
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Send Error", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});

export default router;
