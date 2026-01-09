
export interface EmailAccount {
    id: string;
    provider: string;
    email: string;
}

interface MailItem {
    id: string;
    sender: string;
    subject: string;
    preview: string;
    time: string;
    initial: string;
    color: string;
    isUnread?: boolean;
    hasAttachment?: boolean;
    provider: 'google' | 'outlook';
}

const API_BASE = 'http://localhost:3001/api';

export const emailService = {
    getAccounts: async (): Promise<EmailAccount[]> => {
        const res = await fetch(`${API_BASE}/auth/accounts`);
        if (!res.ok) throw new Error('Failed to fetch accounts');
        return res.json();
    },

    disconnectAccount: async (id: string) => {
        const res = await fetch(`${API_BASE}/auth/accounts/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to disconnect');
        return res.json();
    },

    getFolders: async (): Promise<any[]> => {
        const res = await fetch(`${API_BASE}/email/folders`);
        if (!res.ok) throw new Error('Failed to fetch folders');
        return res.json();
    },

    getEmails: async (folderId?: string) => {
        const url = folderId
            ? `${API_BASE}/email/list?folderId=${encodeURIComponent(folderId)}`
            : `${API_BASE}/email/list`;

        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch emails');
        return res.json();
    },

    sendEmail: async (to: string, subject: string, body: string, provider: 'google' | 'outlook', cc?: string, bcc?: string) => {
        const res = await fetch(`${API_BASE}/email/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to, subject, body, provider, cc, bcc })
        });
        if (!res.ok) throw new Error('Failed to send email');
        return res.json();
    },

    trash: async (id: string, provider: string) => {
        await fetch(`${API_BASE}/email/trash`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, provider })
        });
    },

    archive: async (id: string, provider: string) => {
        await fetch(`${API_BASE}/email/archive`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, provider })
        });
    },

    markRead: async (id: string, provider: string) => {
        await fetch(`${API_BASE}/email/read`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, provider })
        });
    }
};
