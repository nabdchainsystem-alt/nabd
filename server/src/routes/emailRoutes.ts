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

// --- Folder Routes ---
router.get('/folders', async (req, res) => {
    try {
        const accounts = await prisma.emailAccount.findMany();
        let allFolders: any[] = [];

        for (const account of accounts) {
            const accessToken = decrypt(account.accessToken);
            if (account.provider === 'google') {
                try {
                    const auth = getGoogleClient(accessToken, decrypt(account.refreshToken));
                    const gmail = google.gmail({ version: 'v1', auth });
                    const response = await gmail.users.labels.list({ userId: 'me' });
                    const labels = response.data.labels || [];

                    // Filter system labels we care about + user labels
                    const relevantLabels = labels.filter(l =>
                        l.type === 'user' ||
                        ['INBOX', 'SENT', 'TRASH', 'DRAFT', 'IMPORTANT', 'STARRED'].includes(l.id || '')
                    ).map(l => ({
                        id: l.id,
                        name: l.name,
                        type: l.type,
                        provider: 'google',
                        accountEmail: account.email
                    }));
                    allFolders = [...allFolders, ...relevantLabels];

                } catch (e) {
                    console.error(`Error fetching google folders for ${account.email}`, e);
                }
            } else if (account.provider === 'outlook') {
                try {
                    const client = getGraphClient(accessToken);
                    const response = await client.api('/me/mailFolders').top(50).get(); // fetch top 50 folders
                    const folders = response.value.map((f: any) => ({
                        id: f.id,
                        name: f.displayName,
                        type: 'system', // Outlook doesn't distinguish nicely in top level list easily, but all are folders
                        provider: 'outlook',
                        accountEmail: account.email
                    }));
                    allFolders = [...allFolders, ...folders];
                } catch (e) {
                    console.error(`Error fetching outlook folders for ${account.email}`, e);
                }
            }
        }
        res.json(allFolders);
    } catch (e) {
        console.error("Folder List Error", e);
        res.status(500).json({ error: "Failed to fetch folders" });
    }
});

router.get('/list', async (req, res) => {
    const { folderId, provider } = req.query;

    try {
        const accounts = await prisma.emailAccount.findMany();
        let allEmails: any[] = [];

        for (const account of accounts) {
            // Filter by provider if specified (optimization)
            if (provider && account.provider !== provider) continue;

            const accessToken = decrypt(account.accessToken);
            // TODO: check expiry and refresh if needed

            if (account.provider === 'google') {
                try {
                    const auth = getGoogleClient(accessToken, decrypt(account.refreshToken));

                    // Refresh if needed (simple check)
                    // googleapis handles refresh automatically if refresh_token is set? 
                    // Verify expiry? For now, let's assume valid or let it fail.

                    const gmail = google.gmail({ version: 'v1', auth });

                    // Default to INBOX if no folder specified, or use the labelId

                    const response = await gmail.users.messages.list({
                        userId: 'me',
                        maxResults: 10,
                        labelIds: folderId ? [folderId as string] : ['INBOX']
                    });

                    const messages = response.data.messages || [];

                    // Fetch details
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

                        // Helper to recursively find HTML body
                        const findHtmlBody = (payload: any): string | null => {
                            if (!payload) return null;
                            if (payload.mimeType === 'text/html' && payload.body?.data) {
                                return Buffer.from(payload.body.data, 'base64').toString('utf-8');
                            }
                            if (payload.parts) {
                                for (const part of payload.parts) {
                                    const body = findHtmlBody(part);
                                    if (body) return body;
                                }
                            }
                            return null;
                        };

                        // Helper to find Plain Text if HTML fails
                        const findTextBody = (payload: any): string | null => {
                            if (!payload) return null;
                            if (payload.mimeType === 'text/plain' && payload.body?.data) {
                                return Buffer.from(payload.body.data, 'base64').toString('utf-8');
                            }
                            if (payload.parts) {
                                for (const part of payload.parts) {
                                    const body = findTextBody(part);
                                    if (body) return body;
                                }
                            }
                            return null;
                        };

                        // Extract Body
                        let body = findHtmlBody(content.data.payload) || findTextBody(content.data.payload) || '';
                        // Simple fallback if body is empty but snippet exists, maybe wrap snippet in p tags
                        if (!body && content.data.snippet) {
                            body = `<p>${content.data.snippet}</p>`;
                        }

                        return {
                            id: msg.id,
                            provider: 'google',
                            accountEmail: account.email,
                            subject,
                            sender: from,
                            preview: content.data.snippet, // Keep preview for list view
                            body, // Full body for reading pane
                            time: date,
                            initial: from.charAt(0).toUpperCase(),
                            color: 'bg-blue-500',
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
                    // If folderId is provided, use it. Otherwise default to 'inbox' (well-known name)
                    // Outlook graph api: /me/mailFolders/{id}/messages
                    const endpoint = folderId ? `/me/mailFolders/${folderId}/messages` : '/me/mailFolders/inbox/messages';

                    const response = await client.api(endpoint)
                        .top(10)
                        .select('id,subject,from,bodyPreview,body,receivedDateTime,isRead')
                        .get();

                    const msgs = response.value.map((msg: any) => ({
                        id: msg.id,
                        provider: 'outlook',
                        accountEmail: account.email,
                        subject: msg.subject,
                        sender: msg.from?.emailAddress?.name || msg.from?.emailAddress?.address,
                        preview: msg.bodyPreview,
                        body: msg.body?.content, // Outlook gives HTML directly
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
        const account = await prisma.emailAccount.findFirst({
            where: { provider: provider }
        });

        if (!account) return res.status(404).json({ error: "No connected account found" });

        const accessToken = decrypt(account.accessToken);

        if (account.provider === 'google') {
            const auth = getGoogleClient(accessToken, decrypt(account.refreshToken));
            const gmail = google.gmail({ version: 'v1', auth });

            // Construct MIME message with support for UTF-8
            const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;

            let messageParts = [
                `To: ${to}`,
                `Subject: ${utf8Subject}`,
                `Content-Type: text/html; charset=utf-8`,
                `MIME-Version: 1.0`
            ];

            const { cc, bcc } = req.body;
            if (cc) messageParts.push(`Cc: ${cc}`);
            if (bcc) messageParts.push(`Bcc: ${bcc}`);

            const message = [
                ...messageParts,
                ``,
                body
            ].join('\n');

            const encodedMessage = Buffer.from(message)
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');

            await gmail.users.messages.send({
                userId: 'me',
                requestBody: { raw: encodedMessage }
            });
        } else if (account.provider === 'outlook') {
            const client = getGraphClient(accessToken);
            const { cc, bcc } = req.body;

            const sendPayload: any = {
                message: {
                    subject: subject,
                    body: {
                        contentType: "HTML",
                        content: body
                    },
                    toRecipients: to.split(',').map(email => ({ emailAddress: { address: email.trim() } }))
                }
            };

            if (cc) {
                sendPayload.message.ccRecipients = cc.split(',').map((email: string) => ({ emailAddress: { address: email.trim() } }));
            }
            if (bcc) {
                sendPayload.message.bccRecipients = bcc.split(',').map((email: string) => ({ emailAddress: { address: email.trim() } }));
            }

            await client.api('/me/sendMail').post(sendPayload);
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Send Error", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});

// --- Action Routes ---

router.post('/trash', async (req, res) => {
    const { id, provider } = req.body;
    // Implementation placeholder: requires precise account matching logic
    // For MVP, we'll try to find the account that owns this message ID or just default to the first one of that provider type (Not ideal but fits current pattern)
    try {
        const account = await prisma.emailAccount.findFirst({ where: { provider } });
        if (!account) return res.status(404).json({ error: 'Account not found' });
        const accessToken = decrypt(account.accessToken);

        if (provider === 'google') {
            const auth = getGoogleClient(accessToken, decrypt(account.refreshToken));
            const gmail = google.gmail({ version: 'v1', auth });
            await gmail.users.messages.trash({ userId: 'me', id });
        } else {
            const client = getGraphClient(accessToken);
            await client.api(`/me/messages/${id}/move`).post({ destinationId: 'deleteditems' });
        }
        res.json({ success: true });
    } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to trash' }); }
});

router.post('/archive', async (req, res) => {
    const { id, provider } = req.body;
    try {
        const account = await prisma.emailAccount.findFirst({ where: { provider } });
        if (!account) return res.status(404).json({ error: 'Account not found' });
        const accessToken = decrypt(account.accessToken);

        if (provider === 'google') {
            const auth = getGoogleClient(accessToken, decrypt(account.refreshToken));
            const gmail = google.gmail({ version: 'v1', auth });
            // Remove INBOX label
            await gmail.users.messages.modify({ userId: 'me', id, requestBody: { removeLabelIds: ['INBOX'] } });
        } else {
            const client = getGraphClient(accessToken);
            await client.api(`/me/messages/${id}/move`).post({ destinationId: 'archive' });
        }
        res.json({ success: true });
    } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to archive' }); }
});

router.post('/read', async (req, res) => {
    // Only handling "mark as read" for now
    const { id, provider } = req.body;
    try {
        const account = await prisma.emailAccount.findFirst({ where: { provider } });
        if (!account) return res.status(404).json({ error: 'Account not found' });
        const accessToken = decrypt(account.accessToken);

        if (provider === 'google') {
            const auth = getGoogleClient(accessToken, decrypt(account.refreshToken));
            const gmail = google.gmail({ version: 'v1', auth });
            await gmail.users.messages.modify({ userId: 'me', id, requestBody: { removeLabelIds: ['UNREAD'] } });
        } else {
            const client = getGraphClient(accessToken);
            await client.api(`/me/messages/${id}`).patch({ isRead: true });
        }
        res.json({ success: true });
    } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to mark read' }); }
});

export default router;
