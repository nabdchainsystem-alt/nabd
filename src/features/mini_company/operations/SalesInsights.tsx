import React from 'react';
import { LazyDashboard } from '../components/LazyDashboard';

// Lazy load all dashboards - only loaded when visible in viewport
const SalesInsightsDashboard = React.lazy(() => import('./SalesInsightsDashboard').then(m => ({ default: m.SalesInsightsDashboard })));
const SalesPerformanceDashboard = React.lazy(() => import('./SalesPerformanceDashboard').then(m => ({ default: m.SalesPerformanceDashboard })));
const SalesAnalysisDashboard = React.lazy(() => import('./SalesAnalysisDashboard').then(m => ({ default: m.SalesAnalysisDashboard })));
const SalesForecastDashboard = React.lazy(() => import('./SalesForecastDashboard').then(m => ({ default: m.SalesForecastDashboard })));
const SalesFunnelDashboard = React.lazy(() => import('./SalesFunnelDashboard').then(m => ({ default: m.SalesFunnelDashboard })));
const SalesSegmentationDashboard = React.lazy(() => import('./SalesSegmentationDashboard').then(m => ({ default: m.SalesSegmentationDashboard })));
const SalesPromotionsDashboard = React.lazy(() => import('./SalesPromotionsDashboard').then(m => ({ default: m.SalesPromotionsDashboard })));

const SalesInsights: React.FC = () => {
    return (
        <div className="flex-1 h-full overflow-y-auto bg-white dark:bg-monday-dark-surface">
            <LazyDashboard component={SalesInsightsDashboard} />
            <LazyDashboard component={SalesPerformanceDashboard} props={{ hideFullscreen: true }} />
            <LazyDashboard component={SalesAnalysisDashboard} props={{ hideFullscreen: true }} />
            <LazyDashboard component={SalesForecastDashboard} props={{ hideFullscreen: true }} />
            <LazyDashboard component={SalesFunnelDashboard} props={{ hideFullscreen: true }} />
            <LazyDashboard component={SalesSegmentationDashboard} props={{ hideFullscreen: true }} />
            <LazyDashboard component={SalesPromotionsDashboard} props={{ hideFullscreen: true }} />
        </div>
    );
};

export default SalesInsights;
