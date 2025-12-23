
const API_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:3001';

type CollectionKey = 'procurementRequests' | 'rfqs' | 'orders';

const LOCAL_KEYS: Record<CollectionKey, CollectionKey> = {
    procurementRequests: 'procurementRequests',
    rfqs: 'rfqs',
    orders: 'orders'
};

const readLocal = (key: CollectionKey) => {
    if (typeof localStorage === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem(key) || '[]') || [];
    } catch {
        return [];
    }
};

const writeLocal = (key: CollectionKey, data: any[]) => {
    if (typeof localStorage === 'undefined') return;
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch {
        // ignore write failures
    }
};

const upsertLocal = (key: CollectionKey, item: any) => {
    const next = [item, ...readLocal(key).filter((entry: any) => entry.id !== item.id)];
    writeLocal(key, next);
    return item;
};

const removeLocal = (key: CollectionKey, id: string) => {
    writeLocal(key, readLocal(key).filter((entry: any) => entry.id !== id));
};

export const procurementService = {
    async getAllRequests() {
        try {
            const response = await fetch(`${API_URL}/procurementRequests`);
            if (!response.ok) throw new Error('Failed to fetch requests');
            const data = await response.json();
            writeLocal(LOCAL_KEYS.procurementRequests, data);
            return data;
        } catch (error) {
            console.error('Error fetching requests:', error);
            return readLocal(LOCAL_KEYS.procurementRequests);
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
            const created = await response.json();
            upsertLocal(LOCAL_KEYS.procurementRequests, created);
            return created;
        } catch (error) {
            console.error('Error creating request:', error);
            return upsertLocal(LOCAL_KEYS.procurementRequests, request);
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
            const updated = await response.json();
            upsertLocal(LOCAL_KEYS.procurementRequests, updated);
            return updated;
        } catch (error) {
            console.error('Error updating request:', error);
            const merged = { ...(readLocal(LOCAL_KEYS.procurementRequests).find((r: any) => r.id === id) || {}), ...updates, id };
            return upsertLocal(LOCAL_KEYS.procurementRequests, merged);
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
            removeLocal(LOCAL_KEYS.procurementRequests, id);
            return true;
        }
    },

    async getAllRfqs() {
        try {
            const response = await fetch(`${API_URL}/rfqs`);
            if (!response.ok) throw new Error('Failed to fetch RFQs');
            const data = await response.json();
            writeLocal(LOCAL_KEYS.rfqs, data);
            return data;
        } catch (error) {
            console.error('Error fetching RFQs:', error);
            return readLocal(LOCAL_KEYS.rfqs);
        }
    },

    async createRfq(rfq: any) {
        try {
            const response = await fetch(`${API_URL}/rfqs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rfq),
            });
            if (!response.ok) throw new Error('Failed to create RFQ');
            const created = await response.json();
            upsertLocal(LOCAL_KEYS.rfqs, created);
            return created;
        } catch (error) {
            console.error('Error creating RFQ:', error);
            return upsertLocal(LOCAL_KEYS.rfqs, rfq);
        }
    },

    async updateRfq(id: string, updates: any) {
        try {
            const response = await fetch(`${API_URL}/rfqs/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error('Failed to update RFQ');
            const updated = await response.json();
            upsertLocal(LOCAL_KEYS.rfqs, updated);
            return updated;
        } catch (error) {
            console.error('Error updating RFQ:', error);
            const merged = { ...(readLocal(LOCAL_KEYS.rfqs).find((r: any) => r.id === id) || {}), ...updates, id };
            return upsertLocal(LOCAL_KEYS.rfqs, merged);
        }
    },

    async deleteRfq(id: string) {
        try {
            const response = await fetch(`${API_URL}/rfqs/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete RFQ');
            return true;
        } catch (error) {
            console.error('Error deleting RFQ:', error);
            removeLocal(LOCAL_KEYS.rfqs, id);
            return true;
        }
    },

    async getAllOrders() {
        try {
            const response = await fetch(`${API_URL}/orders`);
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            writeLocal(LOCAL_KEYS.orders, data);
            return data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            return readLocal(LOCAL_KEYS.orders);
        }
    },

    async createOrder(order: any) {
        try {
            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order),
            });
            if (!response.ok) throw new Error('Failed to create order');
            const created = await response.json();
            upsertLocal(LOCAL_KEYS.orders, created);
            return created;
        } catch (error) {
            console.error('Error creating order:', error);
            return upsertLocal(LOCAL_KEYS.orders, order);
        }
    },

    async updateOrder(id: string, updates: any) {
        try {
            const response = await fetch(`${API_URL}/orders/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error('Failed to update order');
            const updated = await response.json();
            upsertLocal(LOCAL_KEYS.orders, updated);
            return updated;
        } catch (error) {
            console.error('Error updating order:', error);
            const merged = { ...(readLocal(LOCAL_KEYS.orders).find((o: any) => o.id === id) || {}), ...updates, id };
            return upsertLocal(LOCAL_KEYS.orders, merged);
        }
    },

    async deleteOrder(id: string) {
        try {
            const response = await fetch(`${API_URL}/orders/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete order');
            return true;
        } catch (error) {
            console.error('Error deleting order:', error);
            removeLocal(LOCAL_KEYS.orders, id);
            return true;
        }
    }
};
