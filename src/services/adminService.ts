import { API_URL } from '../config/api';

export interface FeatureFlag {
    id: string | null;
    key: string;
    enabled: boolean;
    updatedAt: string | null;
    updatedBy: string | null;
}

export interface AdminUser {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
    role: string;
    createdAt: string;
    lastActiveAt: string | null;
}

export interface AdminStatus {
    isAdmin: boolean;
    user: {
        id: string;
        email: string;
        name: string | null;
        role: string;
    } | null;
}

export const adminService = {
    // Get current user's admin status
    async getAdminStatus(token: string): Promise<AdminStatus> {
        const response = await fetch(`${API_URL}/admin/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Failed to get admin status');
        }

        return response.json();
    },

    // Get all feature flags
    async getFeatureFlags(token: string): Promise<FeatureFlag[]> {
        const response = await fetch(`${API_URL}/admin/features`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch feature flags');
        }

        return response.json();
    },

    // Toggle a feature flag (admin only)
    async toggleFeature(token: string, key: string, enabled: boolean): Promise<FeatureFlag> {
        const response = await fetch(`${API_URL}/admin/features/${key}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ enabled })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to toggle feature');
        }

        return response.json();
    },

    // Get all users (admin only)
    async getUsers(token: string): Promise<AdminUser[]> {
        const response = await fetch(`${API_URL}/admin/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        return response.json();
    },

    // Change user role (admin only)
    async setUserRole(token: string, userId: string, role: 'admin' | 'member'): Promise<AdminUser> {
        const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ role })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update user role');
        }

        return response.json();
    }
};

// Helper to convert feature flags to page visibility object
export function featureFlagsToPageVisibility(flags: FeatureFlag[]): Record<string, boolean> {
    const visibility: Record<string, boolean> = {};

    for (const flag of flags) {
        // Remove "page_" prefix to match existing pageVisibility keys
        const key = flag.key.replace('page_', '');
        visibility[key] = flag.enabled;
    }

    return visibility;
}
