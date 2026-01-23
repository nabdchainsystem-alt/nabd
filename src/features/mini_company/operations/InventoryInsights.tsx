import React from 'react';
import { LazyDashboard } from '../components/LazyDashboard';

// Lazy load all dashboards - only loaded when visible in viewport
const InventoryOverviewDashboard = React.lazy(() => import('./InventoryOverviewDashboard').then(m => ({ default: m.InventoryOverviewDashboard })));
const StockMovementDashboard = React.lazy(() => import('./StockMovementDashboard').then(m => ({ default: m.StockMovementDashboard })));
const InventoryAgingDashboard = React.lazy(() => import('./InventoryAgingDashboard').then(m => ({ default: m.InventoryAgingDashboard })));
const StockAccuracyDashboard = React.lazy(() => import('./StockAccuracyDashboard').then(m => ({ default: m.StockAccuracyDashboard })));
const ReorderPlanningDashboard = React.lazy(() => import('./ReorderPlanningDashboard').then(m => ({ default: m.ReorderPlanningDashboard })));
const WarehousePerformanceDashboard = React.lazy(() => import('./WarehousePerformanceDashboard').then(m => ({ default: m.WarehousePerformanceDashboard })));
const InventoryForecastDashboard = React.lazy(() => import('./InventoryForecastDashboard').then(m => ({ default: m.InventoryForecastDashboard })));

const InventoryInsights: React.FC = () => {
    return (
        <div className="flex-1 h-full overflow-y-auto bg-white dark:bg-monday-dark-surface">
            <LazyDashboard component={InventoryOverviewDashboard} />
            <LazyDashboard component={StockMovementDashboard} />
            <LazyDashboard component={InventoryAgingDashboard} />
            <LazyDashboard component={StockAccuracyDashboard} />
            <LazyDashboard component={ReorderPlanningDashboard} />
            <LazyDashboard component={WarehousePerformanceDashboard} />
            <LazyDashboard component={InventoryForecastDashboard} />
        </div>
    );
};

export default InventoryInsights;
