import React from 'react';
import { Calendar, Target, TrendingUp, AlertCircle } from 'lucide-react';
import { StatCard } from '../../board/components/dashboard/StatCard';
import { DashboardChart } from '../../board/components/dashboard/DashboardChart';

interface PlanningDashboardProps {
    viewId?: string;
    title?: string;
}

export const PlanningDashboard: React.FC<PlanningDashboardProps> = ({ viewId, title }) => {
    const kpis = [
        { title: 'Forecast Accuracy', value: '89%', trend: '+2%', trendDirection: 'up' as const, icon: <Target size={20} />, color: 'blue' },
        { title: 'Demand Growth', value: '+12%', trend: 'YoY', trendDirection: 'up' as const, icon: <TrendingUp size={20} />, color: 'green' },
        { title: 'Planning Cycle', value: 'Weekly', trend: 'Active', trendDirection: 'neutral' as const, icon: <Calendar size={20} />, color: 'indigo' },
        { title: 'Stockout Risks', value: '4', trend: 'Attention', trendDirection: 'down' as const, icon: <AlertCircle size={20} />, color: 'red' },
    ];

    const chartOptions = {
        title: { text: '' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['Q1', 'Q2', 'Q3', 'Q4'] },
        yAxis: { type: 'value' },
        series: [
            { name: 'Forecast', data: [800, 950, 1100, 1400], type: 'line', smooth: true, itemStyle: { color: '#3b82f6' } },
            { name: 'Actual', data: [810, 940, 1050, null], type: 'line', smooth: true, itemStyle: { color: '#10b981' } }
        ]
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-[#09090b] p-6 overflow-y-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Demand Planning</h1>
            <p className="text-gray-500 text-sm mb-6">Forecasting, demand sensing, and supply alignment.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {kpis.map((kpi, idx) => <StatCard key={idx} {...kpi} />)}
            </div>

            <div className="h-96 bg-white dark:bg-[#1a1d24] p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                <DashboardChart title="Forecast vs Actual" options={chartOptions} height="100%" />
            </div>
        </div>
    );
};
