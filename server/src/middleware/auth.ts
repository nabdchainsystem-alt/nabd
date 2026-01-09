import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

export const requireAuth = ClerkExpressRequireAuth({
    // Add any specific options if needed, but usually defaults work with env vars
});
