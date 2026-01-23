import { API_URL } from '../config/api';

export interface TalkUser {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
    lastActiveAt?: string | null;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    createdAt: string;
    sender: TalkUser;
}

export interface Conversation {
    id: string;
    type: 'dm' | 'channel';
    name: string | null;
    participants: TalkUser[];
    lastMessage: Message | null;
    unreadCount: number;
    updatedAt: string;
}

export const talkService = {
    // Get all conversations for current user
    async getConversations(token: string): Promise<Conversation[]> {
        const response = await fetch(`${API_URL}/talk/conversations`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Failed to get conversations');
        }

        return response.json();
    },

    // Get or create a DM conversation with a user
    async getOrCreateDM(token: string, participantId: string): Promise<Conversation & { isNew: boolean }> {
        const response = await fetch(`${API_URL}/talk/conversations/dm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ participantId })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create conversation');
        }

        return response.json();
    },

    // Get messages for a conversation (paginated)
    async getMessages(token: string, conversationId: string, limit?: number, before?: string): Promise<Message[]> {
        const params = new URLSearchParams();
        if (limit) params.append('limit', limit.toString());
        if (before) params.append('before', before);

        const response = await fetch(`${API_URL}/talk/conversations/${conversationId}/messages?${params}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Failed to get messages');
        }

        return response.json();
    },

    // Send a message
    async sendMessage(token: string, conversationId: string, content: string): Promise<Message> {
        const response = await fetch(`${API_URL}/talk/conversations/${conversationId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to send message');
        }

        return response.json();
    },

    // Mark conversation as read
    async markAsRead(token: string, conversationId: string): Promise<void> {
        const response = await fetch(`${API_URL}/talk/conversations/${conversationId}/read`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Failed to mark as read');
        }
    },

    // Delete a message
    async deleteMessage(token: string, messageId: string): Promise<void> {
        const response = await fetch(`${API_URL}/talk/messages/${messageId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Failed to delete message');
        }
    },

    // --- Sidebar Data ---
    async getConversationData(token: string, conversationId: string): Promise<any> {
        const response = await fetch(`${API_URL}/talk/conversations/${conversationId}/data`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to get conversation data');
        return response.json();
    },

    async createTask(token: string, conversationId: string, name: string): Promise<any> {
        const response = await fetch(`${API_URL}/talk/conversations/${conversationId}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ name })
        });
        if (!response.ok) throw new Error('Failed to create task');
        return response.json();
    },

    async updateTask(token: string, taskId: string, data: any): Promise<any> {
        const response = await fetch(`${API_URL}/talk/tasks/${taskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update task');
        return response.json();
    },

    async deleteTask(token: string, taskId: string): Promise<void> {
        const response = await fetch(`${API_URL}/talk/tasks/${taskId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to delete task');
    },

    async createReminder(token: string, conversationId: string, text: string, dueDate: string): Promise<any> {
        const response = await fetch(`${API_URL}/talk/conversations/${conversationId}/reminders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ text, dueDate })
        });
        if (!response.ok) throw new Error('Failed to create reminder');
        return response.json();
    },

    async updateReminder(token: string, reminderId: string, data: any): Promise<any> {
        const response = await fetch(`${API_URL}/talk/reminders/${reminderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update reminder');
        return response.json();
    },

    async deleteReminder(token: string, reminderId: string): Promise<void> {
        const response = await fetch(`${API_URL}/talk/reminders/${reminderId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to delete reminder');
    },

    async createFile(token: string, conversationId: string, fileData: any): Promise<any> {
        const response = await fetch(`${API_URL}/talk/conversations/${conversationId}/files`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(fileData)
        });
        if (!response.ok) throw new Error('Failed to create file');
        return response.json();
    }
};
