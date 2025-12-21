import React, { useState } from 'react';
import { BoardView } from '../../board/BoardView';
import { Board } from '../../../types';
import { ShippingDashboard } from './ShippingDashboard';
import shippingMaster from './shipping_semantic_master.json';
const INITIAL_BOARD: Board = {
    id: 'shipping-main-v2',
    name: 'Shipping',
    description: 'Logistics and delivery tracking',
    columns: [
        { id: 'shipment_id', title: 'Shipment ID', type: 'text' },
        { id: 'status', title: 'Status', type: 'status' },
        { id: 'destination', title: 'Destination', type: 'text' },
        { id: 'carrier', title: 'Carrier', type: 'text' },
        { id: 'eta', title: 'ETA', type: 'date' }
    ],
    tasks: [],
    availableViews: ['overview', 'sc_shipping', 'table', 'kanban'],
    defaultView: 'overview'
};

export const ShippingPage: React.FC = () => {
    // ... (existing state)
    const [board, setBoard] = useState<Board>(() => {
        const saved = localStorage.getItem('shipping-board-data-v2');
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
            localStorage.setItem('shipping-board-data-v2', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const handleUpdateTasks = React.useCallback((tasks: any[]) => {
        setBoard(prev => {
            const updated = { ...prev, tasks };
            localStorage.setItem(`board-tasks-${prev.id}`, JSON.stringify(tasks));
            localStorage.setItem('shipping-board-data-v2', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const dashboardSections = [
        {
            title: 'Shipping Dashboards',
            options: shippingMaster.dashboards.map(d => ({
                label: d.name.en,
                id: d.id,
                description: d.name.en
            }))
        }
    ];

    return (
        <BoardView
            board={board}
            onUpdateBoard={handleUpdateBoard}
            onUpdateTasks={handleUpdateTasks}
            renderCustomView={(viewId) => {
                if (viewId === 'sc_shipping' || viewId.startsWith('S')) {
                    const config = shippingMaster.dashboards.find(d => d.id === viewId);
                    return <ShippingDashboard viewId={viewId} title={config?.name.en} />;
                }
                return null;
            }}
            dashboardSections={dashboardSections}
        />
    );
};

export default ShippingPage;
