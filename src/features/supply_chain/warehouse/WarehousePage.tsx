import React, { useState } from 'react';
import { BoardView } from '../../board/BoardView';
import { Board } from '../../../types';
import { WarehouseDashboard } from './WarehouseDashboard';
import { WarehouseCapacityMap } from './WarehouseCapacityMap';
import warehouseMaster from './warehouse_semantic_master.json';
const INITIAL_BOARD: Board = {
    id: 'warehouse-main-v2',
    name: 'Warehouse',
    description: 'Inventory control and stock management',
    columns: [
        { id: 'sku', title: 'SKU', type: 'text' },
        { id: 'item', title: 'Item Name', type: 'text' },
        { id: 'status', title: 'Stock Status', type: 'status' },
        { id: 'qty', title: 'Quantity', type: 'number' },
        { id: 'location', title: 'Location', type: 'text' }
    ],
    tasks: [],
    availableViews: ['overview', 'sc_warehouse', 'warehouse_capacity_map', 'table', 'kanban'],
    defaultView: 'overview'
};

export const WarehousePage: React.FC = () => {

    // ... (existing state)
    const [board, setBoard] = useState<Board>(() => {
        const saved = localStorage.getItem('warehouse-board-data-v2');
        const initial = saved ? JSON.parse(saved) : INITIAL_BOARD;

        // Ensure overview is available and default
        if (!initial.availableViews?.includes('overview')) {
            initial.availableViews = ['overview', ...(initial.availableViews || [])];
        }
        if (!initial.availableViews?.includes('warehouse_capacity_map')) {
            initial.availableViews = [...(initial.availableViews || []), 'warehouse_capacity_map'];
        }
        initial.defaultView = 'overview';

        return initial;
    });

    const handleUpdateBoard = React.useCallback((boardId: string, updates: Partial<Board>) => {
        setBoard(prev => {
            const updated = { ...prev, ...updates };
            localStorage.setItem('warehouse-board-data-v2', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const handleUpdateTasks = React.useCallback((tasks: any[]) => {
        setBoard(prev => {
            const updated = { ...prev, tasks };
            localStorage.setItem(`board-tasks-${prev.id}`, JSON.stringify(tasks));
            localStorage.setItem('warehouse-board-data-v2', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const dashboardSections = [
        {
            title: 'Warehouse Dashboards',
            options: warehouseMaster.dashboards.map(d => ({
                label: d.name_en,
                id: d.id,
                description: d.name_en
            }))
        },
        {
            title: 'Advanced Tools',
            options: [
                {
                    label: 'Capacity Map',
                    id: 'warehouse_capacity_map',
                    description: 'Visual warehouse space map'
                }
            ]
        }
    ];

    return (
        <BoardView
            board={board}
            onUpdateBoard={handleUpdateBoard}
            onUpdateTasks={handleUpdateTasks}
            renderCustomView={(viewId) => {
                if (viewId === 'sc_warehouse' || viewId.startsWith('W')) {
                    const config = warehouseMaster.dashboards.find(d => d.id === viewId);
                    return <WarehouseDashboard viewId={viewId} title={config?.name_en} />;
                }
                if (viewId === 'warehouse_capacity_map') {
                    return <WarehouseCapacityMap boardName={board.name} />;
                }
                return null;
            }}
            dashboardSections={dashboardSections}
        />
    );
};

export default WarehousePage;
