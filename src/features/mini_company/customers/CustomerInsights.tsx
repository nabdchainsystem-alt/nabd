import React from 'react';
import { LazyDashboard } from '../components/LazyDashboard';

// Lazy load all dashboards - only loaded when visible in viewport
const CustomerOverviewDashboard = React.lazy(() => import('./CustomerOverviewDashboard').then(m => ({ default: m.CustomerOverviewDashboard })));
const SegmentationValueDashboard = React.lazy(() => import('./SegmentationValueDashboard').then(m => ({ default: m.SegmentationValueDashboard })));
const BehaviorPatternsDashboard = React.lazy(() => import('./BehaviorPatternsDashboard').then(m => ({ default: m.BehaviorPatternsDashboard })));
const RetentionChurnDashboard = React.lazy(() => import('./RetentionChurnDashboard').then(m => ({ default: m.RetentionChurnDashboard })));
const JourneyTouchpointsDashboard = React.lazy(() => import('./JourneyTouchpointsDashboard').then(m => ({ default: m.JourneyTouchpointsDashboard })));
const SatisfactionFeedbackDashboard = React.lazy(() => import('./SatisfactionFeedbackDashboard').then(m => ({ default: m.SatisfactionFeedbackDashboard })));
const ForecastLifetimeRiskDashboard = React.lazy(() => import('./ForecastLifetimeRiskDashboard').then(m => ({ default: m.ForecastLifetimeRiskDashboard })));

const CustomerInsights: React.FC = () => {
    return (
        <div className="flex-1 h-full overflow-y-auto bg-white dark:bg-monday-dark-surface">
            <LazyDashboard component={CustomerOverviewDashboard} />
            <LazyDashboard component={SegmentationValueDashboard} />
            <LazyDashboard component={BehaviorPatternsDashboard} />
            <LazyDashboard component={RetentionChurnDashboard} />
            <LazyDashboard component={JourneyTouchpointsDashboard} />
            <LazyDashboard component={SatisfactionFeedbackDashboard} />
            <LazyDashboard component={ForecastLifetimeRiskDashboard} />
        </div>
    );
};

export default CustomerInsights;
