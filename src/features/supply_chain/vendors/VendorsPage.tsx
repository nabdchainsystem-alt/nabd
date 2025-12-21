import React, { useState } from 'react';
import { BoardView } from '../../board/BoardView';
import { Board } from '../../../types';
import { VendorsDashboard } from './VendorsDashboard';
import vendorsMaster from './vendors_semantic_master.json';
const INITIAL_BOARD: Board = {
    id: 'vendors-main-v2',
    name: 'Vendors',
    description: 'Supplier relationship management',
    columns: [
        { id: 'vendor_id', title: 'Vendor ID', type: 'text' },
        { id: 'name', title: 'Vendor Name', type: 'text' },
        { id: 'type', title: 'Category', type: 'status' },
        { id: 'contact', title: 'Contact Person', type: 'person' },
        { id: 'status', title: 'Status', type: 'status' },
        { id: 'rating', title: 'Rating', type: 'number' }
    ],
    tasks: [],
    availableViews: ['overview', 'sc_vendors', 'table', 'kanban'],
    defaultView: 'overview'
};

export const VendorsPage: React.FC = () => {
    const [board, setBoard] = useState<Board>(() => {
        const saved = localStorage.getItem('vendors-board-data-v2');
        const initial = saved ? JSON.parse(saved) : INITIAL_BOARD;

        // Ensure overview is available and default
        if (!initial.availableViews?.includes('overview')) {
            initial.availableViews = ['overview', ...(initial.availableViews || [])];
        }
        initial.defaultView = 'overview';

        return initial;
    });

    const handleUpdateBoard = React.useCallback((boardId: string, updates: Partial<Board>) => {
        setBoard(prev => {
            const updated = { ...prev, ...updates };
            localStorage.setItem('vendors-board-data-v2', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const handleUpdateTasks = React.useCallback((tasks: any[]) => {
        setBoard(prev => {
            const updated = { ...prev, tasks };
            localStorage.setItem(`board-tasks-${prev.id}`, JSON.stringify(tasks));
            localStorage.setItem('vendors-board-data-v2', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const dashboardSections = [
        {
            title: 'Vendor Dashboards',
            options: vendorsMaster.dashboards.map(d => ({
                label: d.name_en,
                id: d.id,
                description: d.name_en
            }))
        }
    ];

    return (
        <BoardView
            board={board}
            onUpdateBoard={handleUpdateBoard}
            onUpdateTasks={handleUpdateTasks}
            renderCustomView={(viewId) => {
                if (viewId === 'sc_vendors' || viewId.startsWith('V')) {
                    const config = vendorsMaster.dashboards.find(d => d.id === viewId);
                    return <VendorsDashboard viewId={viewId} title={config?.name_en} />;
                }
                return null;
            }}
            dashboardSections={dashboardSections}
        />
    );
};

export default VendorsPage;
