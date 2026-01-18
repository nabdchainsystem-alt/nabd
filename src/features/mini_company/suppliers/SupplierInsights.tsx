import React from 'react';

// Import all dashboards
import { SupplierOverviewDashboard } from './SupplierOverviewDashboard';
import { SupplierDeliveryDashboard } from './SupplierDeliveryDashboard';
import { SupplierCostDashboard } from './SupplierCostDashboard';

const SupplierInsights: React.FC = () => {
    return (
        <div className="flex-1 h-full overflow-y-auto bg-white dark:bg-monday-dark-surface">
            <SupplierOverviewDashboard />
            <SupplierDeliveryDashboard />
            <SupplierCostDashboard />
        </div>
    );
};

export default SupplierInsights;
