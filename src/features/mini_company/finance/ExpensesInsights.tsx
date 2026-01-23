import React from 'react';
import { LazyDashboard } from '../components/LazyDashboard';

// Lazy load all dashboards - only loaded when visible in viewport
const ExpensesOverviewDashboard = React.lazy(() => import('./ExpensesOverviewDashboard').then(m => ({ default: m.ExpensesOverviewDashboard })));
const CategoryAnalysisDashboard = React.lazy(() => import('./CategoryAnalysisDashboard').then(m => ({ default: m.CategoryAnalysisDashboard })));
const FixedVariableDashboard = React.lazy(() => import('./FixedVariableDashboard').then(m => ({ default: m.FixedVariableDashboard })));
const TrendsAnomaliesDashboard = React.lazy(() => import('./TrendsAnomaliesDashboard').then(m => ({ default: m.TrendsAnomaliesDashboard })));
const ApprovalFlowDashboard = React.lazy(() => import('./ApprovalFlowDashboard').then(m => ({ default: m.ApprovalFlowDashboard })));
const DeptAccountabilityDashboard = React.lazy(() => import('./DeptAccountabilityDashboard').then(m => ({ default: m.DeptAccountabilityDashboard })));
const ForecastOptimizationDashboard = React.lazy(() => import('./ForecastOptimizationDashboard').then(m => ({ default: m.ForecastOptimizationDashboard })));

const ExpensesInsights: React.FC = () => {
    return (
        <div className="flex-1 h-full overflow-y-auto bg-white dark:bg-monday-dark-surface">
            <LazyDashboard component={ExpensesOverviewDashboard} />
            <LazyDashboard component={CategoryAnalysisDashboard} />
            <LazyDashboard component={FixedVariableDashboard} />
            <LazyDashboard component={TrendsAnomaliesDashboard} />
            <LazyDashboard component={ApprovalFlowDashboard} />
            <LazyDashboard component={DeptAccountabilityDashboard} />
            <LazyDashboard component={ForecastOptimizationDashboard} />
        </div>
    );
};

export default ExpensesInsights;
