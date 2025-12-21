import React, { useState } from 'react';
import { BoardView } from '../../board/BoardView';
import { Board } from '../../../types';
import { FleetDashboard } from './FleetDashboard';
import fleetMaster from './fleet_semantic_master.json';
const INITIAL_BOARD: Board = {
    id: 'fleet-main-v2',
    name: 'Fleet',
    description: 'Vehicle fleet management',
    columns: [
        { id: 'vehicle_id', title: 'Vehicle ID', type: 'text' },
        { id: 'type', title: 'Type', type: 'status' },
        { id: 'driver', title: 'Driver', type: 'person' },
        { id: 'status', title: 'Status', type: 'status' },
        { id: 'maintenance', title: 'Last Service', type: 'date' }
    ],
    tasks: [],
    availableViews: ['overview', 'sc_fleet', 'table', 'kanban'],
    defaultView: 'overview'
};

export const FleetPage: React.FC = () => {
    const [board, setBoard] = useState<Board>(() => {
        const saved = localStorage.getItem('fleet-board-data-v2');
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
            localStorage.setItem('fleet-board-data-v2', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const handleUpdateTasks = React.useCallback((tasks: any[]) => {
        setBoard(prev => {
            const updated = { ...prev, tasks };
            localStorage.setItem(`board-tasks-${prev.id}`, JSON.stringify(tasks));
            localStorage.setItem('fleet-board-data-v2', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const dashboardSections = [
        {
            title: 'Fleet Dashboards',
            options: fleetMaster.dashboards.map(d => ({
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
                if (viewId === 'sc_fleet' || viewId.startsWith('F')) {
                    const config = fleetMaster.dashboards.find(d => d.id === viewId);
                    return <FleetDashboard viewId={viewId} title={config?.name.en} />;
                }
                return null;
            }}
            dashboardSections={dashboardSections}
        />
    );
};

export default FleetPage;
