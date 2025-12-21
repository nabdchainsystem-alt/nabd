import React from 'react';
import { Truck, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
import { StatCard } from '../../board/components/dashboard/StatCard';
import { DashboardChart } from '../../board/components/dashboard/DashboardChart';

interface ShippingDashboardProps {
    viewId?: string;
    title?: string;
}

export const ShippingDashboard: React.FC<ShippingDashboardProps> = ({ viewId, title }) => {
    const kpis = [
        { title: 'Active Shipments', value: '45', trend: 'On Track', trendDirection: 'neutral' as const, icon: <Truck size={20} />, color: 'blue' },
        { title: 'Delayed', value: '3', trend: '+1 Today', trendDirection: 'down' as const, icon: <AlertTriangle size={20} />, color: 'red' },
        { title: 'Delivered Today', value: '18', trend: 'Target Met', trendDirection: 'up' as const, icon: <CheckCircle size={20} />, color: 'green' },
        { title: 'In Transit', value: '24', trend: 'Normal', trendDirection: 'neutral' as const, icon: <MapPin size={20} />, color: 'purple' },
    ];

    const chartOptions = {
        title: { text: '' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['Zone A', 'Zone B', 'Zone C', 'Intl'] },
        yAxis: { type: 'value' },
        series: [{ data: [30, 45, 20, 15], type: 'pie', radius: '60%' }]
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-[#09090b] p-6 overflow-y-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{title || 'Shipping Dashboard'}</h1>
            <p className="text-gray-500 text-sm mb-6">Logistics tracking, delivery performance, and route optimization.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {kpis.map((kpi, idx) => <StatCard key={idx} {...kpi} />)}
            </div>

            <div className="h-96 bg-white dark:bg-[#1a1d24] p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                <DashboardChart title="Shipments by Zone" options={chartOptions} height="100%" />
            </div>
        </div>
    );
};
