import { API_URL } from '../config/api';

export interface UserProfile {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
    createdAt?: string;
}

export interface UpdateUserData {
    name?: string;
    avatarUrl?: string;
}

export const userService = {
    // Get current user profile
    async getProfile(token: string): Promise<UserProfile> {
        const response = await fetch(`${API_URL}/user/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch user profile');
        }

        return response.json();
    },

    // Update user profile (name, avatar, etc.)
    async updateProfile(token: string, data: UpdateUserData): Promise<UserProfile> {
        const response = await fetch(`${API_URL}/user/me`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update user profile');
        }

        return response.json();
    }
};
