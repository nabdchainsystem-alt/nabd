import express, { Response, NextFunction } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { prisma } from '../lib/prisma';

const router = express.Router();

// Default feature flags - all pages that can be toggled
const DEFAULT_FEATURE_FLAGS = [
    // Core
    { key: 'page_dashboard', enabled: true },
    { key: 'page_my_work', enabled: true },
    { key: 'page_inbox', enabled: true },
    { key: 'page_teams', enabled: true },
    { key: 'page_vault', enabled: true },
    { key: 'page_talk', enabled: true },
    // Tools
    { key: 'page_flow_hub', enabled: true },
    { key: 'page_process_map', enabled: true },
    { key: 'page_dashboards', enabled: true },
    { key: 'page_reports', enabled: true },
    // Mini Company
    { key: 'page_mini_company', enabled: true },
    { key: 'page_sales', enabled: true },
    { key: 'page_purchases', enabled: true },
    { key: 'page_inventory', enabled: true },
    { key: 'page_expenses', enabled: true },
    { key: 'page_customers', enabled: true },
    { key: 'page_suppliers', enabled: true },
    // Supply Chain
    { key: 'page_supply_chain', enabled: true },
    { key: 'page_procurement', enabled: true },
    { key: 'page_warehouse', enabled: true },
    { key: 'page_fleet', enabled: true },
    { key: 'page_vendors', enabled: true },
    { key: 'page_planning', enabled: true },
    // Manufacturing
    { key: 'page_manufacturing', enabled: true },
    { key: 'page_maintenance', enabled: true },
    { key: 'page_production', enabled: true },
    { key: 'page_quality', enabled: true },
    // Business
    { key: 'page_business', enabled: true },
    { key: 'page_sales_listing', enabled: true },
    { key: 'page_sales_factory', enabled: true },
    // Business Support
    { key: 'page_business_support', enabled: true },
    { key: 'page_it_support', enabled: true },
    { key: 'page_hr', enabled: true },
    { key: 'page_marketing', enabled: true },
    // Marketplace
    { key: 'page_marketplace', enabled: true },
    { key: 'page_local_marketplace', enabled: true },
    { key: 'page_foreign_marketplace', enabled: true },
];

// Middleware to check if user is admin
const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.auth.userId;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        if (user?.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        next();
    } catch (error) {
        console.error('Admin check error:', error);
        res.status(500).json({ error: 'Failed to verify admin status' });
    }
};

// GET /features: Get all feature flags (public - all authenticated users)
router.get('/features', requireAuth, async (req, res: Response) => {
    try {
        // Get all existing flags from database
        const existingFlags = await prisma.featureFlag.findMany();
        const existingKeys = new Set(existingFlags.map(f => f.key));

        // Merge with defaults (for any missing flags)
        const allFlags = DEFAULT_FEATURE_FLAGS.map(defaultFlag => {
            const existing = existingFlags.find(f => f.key === defaultFlag.key);
            return existing || { ...defaultFlag, id: null, updatedAt: null, updatedBy: null };
        });

        res.json(allFlags);
    } catch (error) {
        console.error('Get Features Error:', error);
        res.status(500).json({ error: 'Failed to fetch features' });
    }
});

// PUT /features/:key: Toggle a feature flag (admin only)
router.put('/features/:key', requireAuth, requireAdmin, async (req, res: Response) => {
    try {
        const userId = (req as AuthRequest).auth.userId;
        const key = req.params.key as string;
        const { enabled } = req.body;

        if (typeof enabled !== 'boolean') {
            return res.status(400).json({ error: 'enabled must be a boolean' });
        }

        // Upsert the feature flag
        const flag = await prisma.featureFlag.upsert({
            where: { key },
            update: {
                enabled,
                updatedBy: userId
            },
            create: {
                key,
                enabled,
                updatedBy: userId
            }
        });

        console.log(`[Admin] Feature "${key}" set to ${enabled} by user ${userId}`);

        res.json(flag);
    } catch (error) {
        console.error('Toggle Feature Error:', error);
        res.status(500).json({ error: 'Failed to toggle feature' });
    }
});

// GET /users: List all users with roles (admin only)
router.get('/users', requireAuth, requireAdmin, async (req, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                avatarUrl: true,
                role: true,
                createdAt: true,
                lastActiveAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(users);
    } catch (error) {
        console.error('Get Users Error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// PUT /users/:id/role: Change user role (admin only)
router.put('/users/:id/role', requireAuth, requireAdmin, async (req, res: Response) => {
    try {
        const adminUserId = (req as AuthRequest).auth.userId;
        const id = req.params.id as string;
        const { role } = req.body;

        if (!['admin', 'member'].includes(role)) {
            return res.status(400).json({ error: 'role must be "admin" or "member"' });
        }

        // Prevent admin from removing their own admin role
        if (id === adminUserId && role !== 'admin') {
            return res.status(400).json({ error: 'Cannot remove your own admin role' });
        }

        const user = await prisma.user.update({
            where: { id },
            data: { role },
            select: {
                id: true,
                email: true,
                name: true,
                avatarUrl: true,
                role: true
            }
        });

        console.log(`[Admin] User ${id} role changed to "${role}" by admin ${adminUserId}`);

        res.json(user);
    } catch (error) {
        console.error('Update User Role Error:', error);
        res.status(500).json({ error: 'Failed to update user role' });
    }
});

// GET /me: Get current user's admin status
router.get('/me', requireAuth, async (req, res: Response) => {
    try {
        const userId = (req as AuthRequest).auth.userId;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, role: true }
        });

        res.json({
            isAdmin: user?.role === 'admin',
            user
        });
    } catch (error) {
        console.error('Get Admin Status Error:', error);
        res.status(500).json({ error: 'Failed to get admin status' });
    }
});

export default router;
