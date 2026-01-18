import React from 'react';

// Import all dashboards
import { CustomerOverviewDashboard } from './CustomerOverviewDashboard';
import { SegmentationValueDashboard } from './SegmentationValueDashboard';
import { BehaviorPatternsDashboard } from './BehaviorPatternsDashboard';
import { RetentionChurnDashboard } from './RetentionChurnDashboard';
import { JourneyTouchpointsDashboard } from './JourneyTouchpointsDashboard';
import { SatisfactionFeedbackDashboard } from './SatisfactionFeedbackDashboard';
import { ForecastLifetimeRiskDashboard } from './ForecastLifetimeRiskDashboard';

const CustomerInsights: React.FC = () => {
    return (
        <div className="flex-1 h-full overflow-y-auto bg-white dark:bg-monday-dark-surface">
            <CustomerOverviewDashboard />
            <SegmentationValueDashboard />
            <BehaviorPatternsDashboard />
            <RetentionChurnDashboard />
            <JourneyTouchpointsDashboard />
            <SatisfactionFeedbackDashboard />
            <ForecastLifetimeRiskDashboard />
        </div>
    );
};

export default CustomerInsights;
