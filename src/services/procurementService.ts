
const API_URL = 'http://localhost:3001';

export const procurementService = {
    async getAllRequests() {
        try {
            const response = await fetch(`${API_URL}/procurementRequests`);
            if (!response.ok) throw new Error('Failed to fetch requests');
            return await response.json();
        } catch (error) {
            console.error('Error fetching requests:', error);
            // Default to empty array if server is offline to prevent crash
            return [];
        }
    },

    async createRequest(request: any) {
        try {
            const response = await fetch(`${API_URL}/procurementRequests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });
            if (!response.ok) throw new Error('Failed to create request');
            return await response.json();
        } catch (error) {
            console.error('Error creating request:', error);
            throw error;
        }
    },

    async updateRequest(id: string, updates: any) {
        try {
            const response = await fetch(`${API_URL}/procurementRequests/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error('Failed to update request');
            return await response.json();
        } catch (error) {
            console.error('Error updating request:', error);
            throw error;
        }
    },

    async deleteRequest(id: string) {
        try {
            const response = await fetch(`${API_URL}/procurementRequests/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete request');
            return true;
        } catch (error) {
            console.error('Error deleting request:', error);
            throw error;
        }
    }
};
