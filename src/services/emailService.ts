
interface EmailAccount {
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

    getEmails: async (): Promise<MailItem[]> => {
        const res = await fetch(`${API_BASE}/email/list`);
        if (!res.ok) throw new Error('Failed to fetch emails');
        return res.json();
    },

    sendEmail: async (to: string, subject: string, body: string, provider: 'google' | 'outlook') => {
        const res = await fetch(`${API_BASE}/email/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to, subject, body, provider })
        });
        if (!res.ok) throw new Error('Failed to send email');
        return res.json();
    }
};
