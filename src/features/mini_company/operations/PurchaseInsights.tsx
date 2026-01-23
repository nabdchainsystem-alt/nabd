import React from 'react';
import { LazyDashboard } from '../components/LazyDashboard';

// Lazy load all dashboards - only loaded when visible in viewport
const PurchaseOverviewDashboard = React.lazy(() => import('./PurchaseOverviewDashboard').then(m => ({ default: m.PurchaseOverviewDashboard })));
const SupplierPerformanceDashboard = React.lazy(() => import('./SupplierPerformanceDashboard').then(m => ({ default: m.SupplierPerformanceDashboard })));
const PurchaseBehaviorDashboard = React.lazy(() => import('./PurchaseBehaviorDashboard').then(m => ({ default: m.PurchaseBehaviorDashboard })));
const CostControlDashboard = React.lazy(() => import('./CostControlDashboard').then(m => ({ default: m.CostControlDashboard })));
const PurchaseFunnelDashboard = React.lazy(() => import('./PurchaseFunnelDashboard').then(m => ({ default: m.PurchaseFunnelDashboard })));
const DependencyRiskDashboard = React.lazy(() => import('./DependencyRiskDashboard').then(m => ({ default: m.DependencyRiskDashboard })));
const ForecastPlanningDashboard = React.lazy(() => import('./ForecastPlanningDashboard').then(m => ({ default: m.ForecastPlanningDashboard })));

const PurchaseInsights: React.FC = () => {
    return (
        <div className="flex-1 h-full overflow-y-auto bg-white dark:bg-monday-dark-surface">
            <LazyDashboard component={PurchaseOverviewDashboard} />
            <LazyDashboard component={SupplierPerformanceDashboard} />
            <LazyDashboard component={PurchaseBehaviorDashboard} />
            <LazyDashboard component={CostControlDashboard} />
            <LazyDashboard component={PurchaseFunnelDashboard} />
            <LazyDashboard component={DependencyRiskDashboard} />
            <LazyDashboard component={ForecastPlanningDashboard} />
        </div>
    );
};

export default PurchaseInsights;
