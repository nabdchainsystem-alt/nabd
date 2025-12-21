import React, { useState } from 'react';
import { BoardView } from '../../board/BoardView';
import { Board } from '../../../types';
import { PlanningDashboard } from './PlanningDashboard';
import planningMaster from './planning_semantic_master.json';
const INITIAL_BOARD: Board = {
    id: 'planning-main-v2',
    name: 'Planning',
    description: 'Demand and supply planning',
    columns: [
        { id: 'sku', title: 'SKU', type: 'text' },
        { id: 'description', title: 'Description', type: 'text' },
        { id: 'forecast', title: 'Forecast', type: 'number' },
        { id: 'actual', title: 'Actual', type: 'number' },
        { id: 'variance', title: 'Variance', type: 'number' }
    ],
    tasks: [],
    availableViews: ['overview', 'sc_planning', 'table', 'kanban'],
    defaultView: 'overview'
};

export const PlanningPage: React.FC = () => {
    const [board, setBoard] = useState<Board>(() => {
        const saved = localStorage.getItem('planning-board-data-v2');
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
            localStorage.setItem('planning-board-data-v2', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const handleUpdateTasks = React.useCallback((tasks: any[]) => {
        setBoard(prev => {
            const updated = { ...prev, tasks };
            localStorage.setItem(`board-tasks-${prev.id}`, JSON.stringify(tasks));
            localStorage.setItem('planning-board-data-v2', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const dashboardSections = [
        {
            title: 'Planning Dashboards',
            options: planningMaster.dashboards.map(d => ({
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
                if (viewId === 'sc_planning' || viewId.startsWith('P')) {
                    const config = planningMaster.dashboards.find(d => d.id === viewId);
                    return <PlanningDashboard viewId={viewId} title={config?.name_en} />;
                }
                return null;
            }}
            dashboardSections={dashboardSections}
        />
    );
};

export default PlanningPage;
