import { DocPage } from '../features/board/views/Doc/types';
import { API_URL as API_BASE } from '../config/api';

const API_URL = `${API_BASE}/docs`;

export const docService = {
    getAll: async (containerId: string, token: string): Promise<DocPage[]> => {
        const response = await fetch(`${API_URL}/${containerId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch docs');
        return response.json();
    },

    getById: async (id: string, token: string): Promise<DocPage> => {
        const response = await fetch(`${API_URL}/page/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch doc');
        return response.json();
    },

    create: async (containerId: string, data: Partial<DocPage>, token: string, type: 'room' | 'board' = 'room'): Promise<DocPage> => {
        const payload = {
            ...data,
            roomId: type === 'room' ? containerId : undefined,
            boardId: type === 'board' ? containerId : undefined
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Failed to create doc');
        return response.json();
    },

    update: async (id: string, data: Partial<DocPage>, token: string): Promise<DocPage> => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update doc');
        return response.json();
    },

    delete: async (id: string, token: string): Promise<void> => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to delete doc');
    }
};
