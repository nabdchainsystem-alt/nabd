import { API_URL } from '../config/api';

export interface TeamMember {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
    lastActiveAt?: string | null;
    connectionId?: string;
    connectedAt?: string;
}

export interface ConnectionRequest {
    id: string;
    senderId: string;
    receiverId: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    createdAt: string;
    sender?: {
        id: string;
        email: string;
        name: string | null;
        avatarUrl: string | null;
    };
    receiver?: {
        id: string;
        email: string;
        name: string | null;
        avatarUrl: string | null;
    };
}

export interface SearchUserResult {
    user: {
        id: string;
        email: string;
        name: string | null;
        avatarUrl: string | null;
    };
    connectionStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED' | null;
    connectionId: string | null;
}

export const teamService = {
    // Search for a user by email
    async searchUser(token: string, email: string): Promise<SearchUserResult> {
        const response = await fetch(`${API_URL}/team/search?email=${encodeURIComponent(email)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to search user');
        }

        return response.json();
    },

    // Send a connection request
    async sendConnectionRequest(token: string, email: string): Promise<{ success: boolean; connection: ConnectionRequest }> {
        const response = await fetch(`${API_URL}/team/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to send request');
        }

        return response.json();
    },

    // Get pending requests received
    async getPendingRequests(token: string): Promise<ConnectionRequest[]> {
        const response = await fetch(`${API_URL}/team/requests/pending`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Failed to get pending requests');
        }

        return response.json();
    },

    // Get sent requests
    async getSentRequests(token: string): Promise<ConnectionRequest[]> {
        const response = await fetch(`${API_URL}/team/requests/sent`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Failed to get sent requests');
        }

        return response.json();
    },

    // Respond to a request (accept/reject)
    async respondToRequest(token: string, connectionId: string, action: 'accept' | 'reject'): Promise<{ success: boolean }> {
        const response = await fetch(`${API_URL}/team/request/respond`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ connectionId, action })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to respond to request');
        }

        return response.json();
    },

    // Get all connected team members
    async getTeamMembers(token: string): Promise<TeamMember[]> {
        const response = await fetch(`${API_URL}/team/members`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Failed to get team members');
        }

        return response.json();
    },

    // Remove a connection
    async removeConnection(token: string, connectionId: string): Promise<{ success: boolean }> {
        const response = await fetch(`${API_URL}/team/connection/${connectionId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Failed to remove connection');
        }

        return response.json();
    }
};
