import React from 'react';
import { LazyDashboard } from '../components/LazyDashboard';

// Lazy load all dashboards - only loaded when visible in viewport
const SupplierOverviewDashboard = React.lazy(() => import('./SupplierOverviewDashboard').then(m => ({ default: m.SupplierOverviewDashboard })));
const SupplierDeliveryDashboard = React.lazy(() => import('./SupplierDeliveryDashboard').then(m => ({ default: m.SupplierDeliveryDashboard })));
const SupplierCostDashboard = React.lazy(() => import('./SupplierCostDashboard').then(m => ({ default: m.SupplierCostDashboard })));
const SupplierQualityComplianceDashboard = React.lazy(() => import('./SupplierQualityComplianceDashboard').then(m => ({ default: m.SupplierQualityComplianceDashboard })));
const SupplierLeadTimeResponsivenessDashboard = React.lazy(() => import('./SupplierLeadTimeResponsivenessDashboard').then(m => ({ default: m.SupplierLeadTimeResponsivenessDashboard })));
const SupplierRiskDependencyDashboard = React.lazy(() => import('./SupplierRiskDependencyDashboard').then(m => ({ default: m.SupplierRiskDependencyDashboard })));
const SupplierStrategicValueGrowthDashboard = React.lazy(() => import('./SupplierStrategicValueGrowthDashboard').then(m => ({ default: m.SupplierStrategicValueGrowthDashboard })));

const SupplierInsights: React.FC = () => {
    return (
        <div className="flex-1 h-full overflow-y-auto bg-white dark:bg-monday-dark-surface">
            <LazyDashboard component={SupplierOverviewDashboard} />
            <LazyDashboard component={SupplierDeliveryDashboard} />
            <LazyDashboard component={SupplierCostDashboard} />
            <LazyDashboard component={SupplierQualityComplianceDashboard} />
            <LazyDashboard component={SupplierLeadTimeResponsivenessDashboard} />
            <LazyDashboard component={SupplierRiskDependencyDashboard} />
            <LazyDashboard component={SupplierStrategicValueGrowthDashboard} />
        </div>
    );
};

export default SupplierInsights;
