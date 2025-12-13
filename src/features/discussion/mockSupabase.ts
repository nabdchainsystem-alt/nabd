
// Helper to create a "Thenable" object that also has query builder methods
const createBuilder = (mockData: any = {}) => {
    // The promise that resolves to the data
    const promise = Promise.resolve({ data: mockData, error: null });

    // The builder interface
    const builder: any = {
        then: promise.then.bind(promise),
        catch: promise.catch.bind(promise),
        finally: promise.finally.bind(promise),

        // Query methods return a new builder (or same)
        select: (cols: string) => createBuilder(mockData),
        eq: (col: string, val: any) => createBuilder(mockData),
        order: (col: string, opts?: any) => createBuilder(Array.isArray(mockData) ? mockData : []),
        single: () => createBuilder({
            // Mock single response based on typical fields expected
            id: 'mock-id',
            name: 'Mock Name',
            content: 'Mock Content',
            timestamp: new Date().toISOString(),
            type: 'public',
            channel_id: 'mock-channel-id',
            sender_id: 'mock-sender-id',
            sender_name: 'Mock Sender',
            avatar_url: '',
            ...mockData
        }),
        insert: (data: any) => createBuilder(data),
        update: (data: any) => createBuilder(data),
        delete: () => createBuilder({}),
        // Subscription methods
        on: (event: string, fn: Function) => ({ subscribe: () => { } }),
        subscribe: (fn: Function) => ({ unsubscribe: () => { } })
    };

    return builder;
};

export const supabase = {
    from: (table: string) => createBuilder([]), // Default to array for 'from'
    channel: (name: string) => ({
        on: (event: string, config: any, callback: any) => ({
            subscribe: () => { }
        }),
        subscribe: (callback: any) => { },
        unsubscribe: () => { }
    }),
    removeChannel: (channel: any) => { },
    auth: {
        getUser: () => Promise.resolve({ data: { user: { id: 'mock-user-id', email: 'mock@example.com' } }, error: null })
    }
};

export const getCompanyId = () => 'default-company-id';
