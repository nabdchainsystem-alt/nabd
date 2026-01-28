import React, { memo, useMemo } from 'react';
import { Plus, X, Flask, CurrencyDollar, Users, ShoppingCart, TrendUp, ChartLine, Package, Target, Percent, Activity, Wallet, CreditCard, Lightning, ChartBar, ArrowUp, ArrowDown, Minus } from 'phosphor-react';
import { MemoizedChart as ReactECharts } from '../../components/common/MemoizedChart';
import type { EChartsOption } from 'echarts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAppContext } from '../../contexts/AppContext';

// ============================================
// ECharts Sparkline KPI Card (Example/Test)
// ============================================
interface EChartsKPICardProps {
    id: string;
    label: string;
    subtitle?: string;
    value: string;
    change: string;
    trend: 'up' | 'down' | 'neutral';
    icon?: React.ReactNode;
    color?: string;
    sparklineData?: number[];
    loading?: boolean;
}

const EChartsSparkline: React.FC<{ data: number[] }> = memo(({ data }) => {
    const chartOption: EChartsOption = useMemo(() => ({
        grid: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        },
        xAxis: {
            type: 'category',
            show: false,
            data: data.map((_, i) => i),
        },
        yAxis: {
            type: 'value',
            show: false,
            min: Math.min(...data) * 0.9,
            max: Math.max(...data) * 1.1,
        },
        series: [{
            type: 'line',
            data: data,
            smooth: true,
            symbol: 'none',
            lineStyle: {
                color: '#94a3b8',
                width: 2,
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        { offset: 0, color: 'rgba(226, 232, 240, 0.8)' },
                        { offset: 1, color: 'rgba(226, 232, 240, 0.1)' },
                    ],
                },
            },
        }],
        animation: false,
    }), [data]);

    return (
        <div className="h-10 w-20 opacity-50 mb-1">
            <ReactECharts
                option={chartOption}
                style={{ height: '100%', width: '100%' }}
            />
        </div>
    );
});

EChartsSparkline.displayName = 'EChartsSparkline';

const EChartsKPICardSkeleton: React.FC = () => (
    <div className="flex flex-col p-4 bg-white dark:bg-monday-dark-surface border border-zinc-200 dark:border-monday-dark-border rounded-xl shadow-sm h-full justify-between">
        <div className="flex justify-between items-start mb-1">
            <div className="flex flex-col gap-1">
                <div className="h-3 w-20 rounded shimmer bg-zinc-200 dark:bg-monday-dark-hover" />
                <div className="h-2 w-14 rounded shimmer bg-zinc-100 dark:bg-monday-dark-elevated" />
            </div>
            <div className="w-8 h-8 rounded-lg shimmer bg-zinc-100 dark:bg-monday-dark-elevated" />
        </div>
        <div className="flex justify-between items-end mt-3">
            <div className="flex flex-col gap-2">
                <div className="h-7 w-24 rounded shimmer bg-zinc-200 dark:bg-monday-dark-hover" />
                <div className="h-5 w-32 rounded-full shimmer bg-zinc-100 dark:bg-monday-dark-elevated" />
            </div>
            <div className="h-10 w-20 rounded shimmer bg-zinc-100 dark:bg-monday-dark-elevated" />
        </div>
    </div>
);

export const EChartsKPICard: React.FC<EChartsKPICardProps> = memo(({
    label, subtitle, value, change, trend, icon, color = 'indigo', sparklineData, loading
}) => {
    if (loading) {
        return <EChartsKPICardSkeleton />;
    }

    const isPositive = trend === 'up';
    const isNeutral = trend === 'neutral';

    const getTrendColor = () => {
        if (isNeutral) return 'text-zinc-500 dark:text-monday-dark-text-secondary bg-zinc-100 dark:bg-monday-dark-hover';
        if (isPositive) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20';
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
    };

    const TrendIcon = isNeutral ? Minus : (isPositive ? ArrowUp : ArrowDown);

    return (
        <div className="flex flex-col p-4 bg-white dark:bg-monday-dark-surface border border-zinc-200 dark:border-monday-dark-border rounded-xl shadow-sm hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/20 transition-shadow h-full justify-between">
            <div className="flex justify-between items-start mb-1">
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-zinc-500 dark:text-monday-dark-text-secondary uppercase tracking-wider">{label}</span>
                    {subtitle && <span className="text-[10px] text-zinc-400 dark:text-monday-dark-text-muted font-medium">{subtitle}</span>}
                </div>
                {icon && <div className={`p-1.5 rounded-lg bg-${color}-50 text-${color}-600 dark:bg-${color}-900/20`}>{icon}</div>}
            </div>

            <div className="flex justify-between items-end mt-1">
                <div className="flex flex-col">
                    <h3 className="text-2xl font-bold text-zinc-800 dark:text-monday-dark-text leading-tight">{value}</h3>
                    <div className={`flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[10px] font-medium w-fit ${getTrendColor()}`}>
                        <TrendIcon size={12} />
                        <span>{change}</span>
                        <span className="opacity-60 font-normal ml-0.5">vs last month</span>
                    </div>
                </div>

                {sparklineData && <EChartsSparkline data={sparklineData} />}
            </div>
        </div>
    );
});

EChartsKPICard.displayName = 'EChartsKPICard';

// KPI Card imports
import { KPICard, KPICardLoading } from '../board/components/dashboard/KPICard';
import { StatCard } from '../board/components/dashboard/StatCard';
import {
    SparklineKPICard,
    ProgressKPICard,
    ComparisonKPICard,
    GradientKPICard,
    CompactKPICard,
    RadialKPICard,
    MiniBarKPICard,
    MiniAreaKPICard,
    MultiMetricKPICard,
    FullChartKPICard,
    ChartSkeleton,
    TableSkeleton,
    PieChartSkeleton,
    LineChartSkeleton,
    DashboardSectionSkeleton
} from '../board/components/dashboard/KPICardVariants';

const SAMPLE_DATA = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
];

const PIE_DATA = [
    { name: 'Online', value: 65 },
    { name: 'Store', value: 15 },
    { name: 'Marketplace', value: 12 },
    { name: 'WhatsApp', value: 8 },
];

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e'];

interface Tab {
    id: string;
    title: string;
    content: React.ReactNode;
}

const Test1Content: React.FC = () => {
    const { dir } = useAppContext();
    const isRTL = dir === 'rtl';

    const echartsBarOption: EChartsOption = {
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'category',
            data: SAMPLE_DATA.map(d => d.name),
            axisLine: { show: false },
            axisTick: { show: false },
            inverse: isRTL,
        },
        yAxis: {
            type: 'value',
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { lineStyle: { type: 'dashed', color: '#e5e7eb' } },
            position: isRTL ? 'right' : 'left',
        },
        grid: { left: isRTL ? 20 : 50, right: isRTL ? 50 : 20, top: 20, bottom: 30 },
        series: [{
            type: 'bar',
            data: SAMPLE_DATA.map(d => d.sales),
            itemStyle: { color: '#6366f1', borderRadius: [4, 4, 0, 0] },
            barWidth: '60%',
        }],
    };

    const echartsPieOption: EChartsOption = {
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', right: isRTL ? 'auto' : 10, left: isRTL ? 10 : 'auto', top: 'center' },
        series: [{
            type: 'pie',
            selectedMode: 'multiple',
            radius: '70%',
            center: [isRTL ? '60%' : '40%', '50%'],
            data: PIE_DATA.map((d, i) => ({ ...d, itemStyle: { color: PIE_COLORS[i] } })),
            label: { show: false },
            emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
        }],
    };

    return (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ECharts Bar Chart */}
            <div className="bg-white dark:bg-monday-dark-elevated p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">ECharts Bar Chart</h3>
                <p className="text-xs text-gray-400 mb-4">Sales data visualization</p>
                <div className="h-[300px]">
                    <ReactECharts option={echartsBarOption} style={{ height: '100%', width: '100%' }} />
                </div>
            </div>

            {/* Recharts Bar Chart */}
            <div className="bg-white dark:bg-monday-dark-elevated p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Recharts Bar Chart</h3>
                <p className="text-xs text-gray-400 mb-4">Sales data visualization</p>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={SAMPLE_DATA}
                            margin={{ top: 10, right: isRTL ? 0 : 20, left: isRTL ? 20 : 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                reversed={isRTL}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                width={45}
                                orientation={isRTL ? 'right' : 'left'}
                            />
                            <Tooltip />
                            <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ECharts Pie Chart */}
            <div className="bg-white dark:bg-monday-dark-elevated p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">ECharts Pie Chart</h3>
                <p className="text-xs text-gray-400 mb-4">Sales by channel</p>
                <div className="h-[300px]">
                    <ReactECharts option={echartsPieOption} style={{ height: '100%', width: '100%' }} />
                </div>
            </div>

            {/* Recharts Pie Chart */}
            <div className="bg-white dark:bg-monday-dark-elevated p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Recharts Pie Chart</h3>
                <p className="text-xs text-gray-400 mb-4">Sales by channel</p>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={PIE_DATA}
                                cx={isRTL ? '60%' : '40%'}
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                dataKey="value"
                                paddingAngle={2}
                            >
                                {PIE_DATA.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend
                                layout="vertical"
                                align={isRTL ? 'left' : 'right'}
                                verticalAlign="middle"
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

// Sample data for KPI cards
const SPARKLINE_DATA = [30, 40, 35, 50, 49, 60, 70, 91, 85, 95, 100, 110];
const BAR_CHART_DATA = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 5500 },
];
const AREA_CHART_DATA = [
    { name: 'Mon', value: 2400 },
    { name: 'Tue', value: 1398 },
    { name: 'Wed', value: 9800 },
    { name: 'Thu', value: 3908 },
    { name: 'Fri', value: 4800 },
    { name: 'Sat', value: 3800 },
    { name: 'Sun', value: 4300 },
];
const FULL_CHART_DATA = [
    { name: 'Jan', current: 4000, previous: 3500 },
    { name: 'Feb', current: 3000, previous: 2800 },
    { name: 'Mar', current: 5000, previous: 4200 },
    { name: 'Apr', current: 4500, previous: 4000 },
    { name: 'May', current: 6000, previous: 5200 },
    { name: 'Jun', current: 5500, previous: 4800 },
];

const KPICardsContent: React.FC = () => {
    const [showLoading, setShowLoading] = React.useState(false);

    return (
        <div className="p-6 space-y-8 overflow-y-auto">
            {/* Toggle for loading states */}
            <div className="flex items-center gap-4 mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showLoading}
                        onChange={(e) => setShowLoading(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Show Loading States</span>
                </label>
            </div>

            {/* Section 0: ECharts vs Recharts Sparkline Comparison */}
            <section className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 -mx-6 px-6 py-6 rounded-none border-y border-indigo-100 dark:border-indigo-800">
                <h2 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200 mb-2">🔬 ECharts vs Recharts Sparkline Comparison</h2>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-4">Testing ECharts sparkline as a replacement for Recharts. Compare visuals and performance.</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recharts Version */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-xs">Recharts</span>
                            Current Implementation
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <KPICard
                                id="recharts-1"
                                label="Revenue (Recharts)"
                                subtitle="This month"
                                value="$48,250"
                                change="+12.5%"
                                trend="up"
                                icon={<CurrencyDollar size={18} />}
                                color="indigo"
                                sparklineData={SPARKLINE_DATA}
                                loading={showLoading}
                            />
                            <KPICard
                                id="recharts-2"
                                label="Users (Recharts)"
                                subtitle="Last 30 days"
                                value="2,847"
                                change="-3.1%"
                                trend="down"
                                icon={<Users size={18} />}
                                color="emerald"
                                sparklineData={[50, 45, 48, 42, 40, 38, 35, 32, 30, 28, 25, 22]}
                                loading={showLoading}
                            />
                        </div>
                    </div>

                    {/* ECharts Version */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded text-xs">ECharts</span>
                            New Implementation
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <EChartsKPICard
                                id="echarts-1"
                                label="Revenue (ECharts)"
                                subtitle="This month"
                                value="$48,250"
                                change="+12.5%"
                                trend="up"
                                icon={<CurrencyDollar size={18} />}
                                color="indigo"
                                sparklineData={SPARKLINE_DATA}
                                loading={showLoading}
                            />
                            <EChartsKPICard
                                id="echarts-2"
                                label="Users (ECharts)"
                                subtitle="Last 30 days"
                                value="2,847"
                                change="-3.1%"
                                trend="down"
                                icon={<Users size={18} />}
                                color="emerald"
                                sparklineData={[50, 45, 48, 42, 40, 38, 35, 32, 30, 28, 25, 22]}
                                loading={showLoading}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 1: Basic KPI Card (from KPICard.tsx) */}
            <section>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">1. Basic KPI Card (with Sparkline)</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">From: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">KPICard.tsx</code></p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard
                        id="revenue"
                        label="Total Revenue"
                        subtitle="This month"
                        value="$48,250"
                        change="+12.5%"
                        trend="up"
                        icon={<CurrencyDollar size={18} />}
                        color="indigo"
                        sparklineData={SPARKLINE_DATA}
                        loading={showLoading}
                    />
                    <KPICard
                        id="customers"
                        label="Active Customers"
                        subtitle="Last 30 days"
                        value="2,847"
                        change="+8.2%"
                        trend="up"
                        icon={<Users size={18} />}
                        color="emerald"
                        sparklineData={[20, 25, 30, 28, 35, 40, 38, 45, 50, 48, 55, 60]}
                        loading={showLoading}
                    />
                    <KPICard
                        id="orders"
                        label="Total Orders"
                        value="1,234"
                        change="-3.1%"
                        trend="down"
                        icon={<ShoppingCart size={18} />}
                        color="amber"
                        sparklineData={[50, 45, 48, 42, 40, 38, 35, 32, 30, 28, 25, 22]}
                        loading={showLoading}
                    />
                    <KPICard
                        id="growth"
                        label="Growth Rate"
                        value="15.2%"
                        change="0%"
                        trend="neutral"
                        icon={<TrendUp size={18} />}
                        color="violet"
                        sparklineData={[40, 42, 41, 43, 42, 44, 43, 45, 44, 43, 44, 45]}
                        loading={showLoading}
                    />
                </div>
            </section>

            {/* Section 2: Stat Card (Simple) */}
            <section>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">2. Stat Card (Simple)</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">From: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">StatCard.tsx</code></p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Sales"
                        value="$125,430"
                        trend="+15.3% from last month"
                        trendDirection="up"
                        icon={<CurrencyDollar size={20} />}
                        color="blue"
                    />
                    <StatCard
                        title="New Users"
                        value="1,234"
                        trend="+8.2% from last week"
                        trendDirection="up"
                        icon={<Users size={20} />}
                        color="green"
                    />
                    <StatCard
                        title="Bounce Rate"
                        value="42.5%"
                        trend="-2.1% from yesterday"
                        trendDirection="down"
                        icon={<Activity size={20} />}
                        color="red"
                    />
                    <StatCard
                        title="Session Duration"
                        value="4m 32s"
                        trend="No change"
                        trendDirection="neutral"
                        icon={<ChartLine size={20} />}
                        color="purple"
                    />
                </div>
            </section>

            {/* Section 3: Sparkline KPI Card */}
            <section>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">3. Sparkline KPI Card</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">From: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">KPICardVariants.tsx</code> - Line chart sparkline</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SparklineKPICard
                        id="sparkline-1"
                        label="Revenue"
                        value="$42,500"
                        change="+18.2%"
                        trend="up"
                        sparklineData={SPARKLINE_DATA}
                        icon={<Wallet size={18} />}
                        color="indigo"
                        loading={showLoading}
                    />
                    <SparklineKPICard
                        id="sparkline-2"
                        label="Transactions"
                        value="8,432"
                        change="+5.7%"
                        trend="up"
                        sparklineData={[10, 15, 12, 20, 18, 25, 22, 30, 28, 35, 32, 40]}
                        icon={<CreditCard size={18} />}
                        color="emerald"
                        loading={showLoading}
                    />
                    <SparklineKPICard
                        id="sparkline-3"
                        label="Refunds"
                        value="$1,234"
                        change="-12.3%"
                        trend="down"
                        sparklineData={[50, 48, 45, 42, 40, 38, 35, 32, 30, 28, 25, 22]}
                        icon={<CurrencyDollar size={18} />}
                        color="rose"
                        loading={showLoading}
                    />
                    <SparklineKPICard
                        id="sparkline-4"
                        label="Active Users"
                        value="12.5K"
                        change="0%"
                        trend="neutral"
                        sparklineData={[40, 42, 41, 40, 42, 41, 40, 42, 41, 40, 42, 41]}
                        icon={<Users size={18} />}
                        color="blue"
                        loading={showLoading}
                    />
                </div>
            </section>

            {/* Section 4: Progress/Target KPI Card */}
            <section>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">4. Progress/Target KPI Card</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Shows progress towards a target with progress bar</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <ProgressKPICard
                        id="progress-1"
                        label="Monthly Sales Target"
                        currentValue={85000}
                        targetValue={100000}
                        prefix="$"
                        change="+12.5%"
                        trend="up"
                        color="indigo"
                        loading={showLoading}
                    />
                    <ProgressKPICard
                        id="progress-2"
                        label="New Signups"
                        currentValue={432}
                        targetValue={500}
                        change="+25.0%"
                        trend="up"
                        color="emerald"
                        loading={showLoading}
                    />
                    <ProgressKPICard
                        id="progress-3"
                        label="Support Tickets"
                        currentValue={45}
                        targetValue={100}
                        change="-8.2%"
                        trend="down"
                        color="amber"
                        loading={showLoading}
                    />
                    <ProgressKPICard
                        id="progress-4"
                        label="Storage Used"
                        currentValue={25}
                        targetValue={100}
                        unit="GB"
                        color="rose"
                        loading={showLoading}
                    />
                </div>
            </section>

            {/* Section 5: Comparison KPI Card */}
            <section>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">5. Comparison KPI Card</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Side-by-side comparison of current vs previous period</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <ComparisonKPICard
                        id="compare-1"
                        label="Revenue"
                        currentValue="$48,250"
                        currentLabel="This Month"
                        previousValue="$42,100"
                        previousLabel="Last Month"
                        change="+14.6%"
                        trend="up"
                        icon={<CurrencyDollar size={18} />}
                        color="indigo"
                        loading={showLoading}
                    />
                    <ComparisonKPICard
                        id="compare-2"
                        label="Orders"
                        currentValue="1,234"
                        currentLabel="This Week"
                        previousValue="1,456"
                        previousLabel="Last Week"
                        change="-15.2%"
                        trend="down"
                        icon={<ShoppingCart size={18} />}
                        color="rose"
                        loading={showLoading}
                    />
                    <ComparisonKPICard
                        id="compare-3"
                        label="Customers"
                        currentValue="892"
                        currentLabel="Active"
                        previousValue="845"
                        previousLabel="Previous"
                        change="+5.6%"
                        trend="up"
                        icon={<Users size={18} />}
                        color="emerald"
                        loading={showLoading}
                    />
                    <ComparisonKPICard
                        id="compare-4"
                        label="Avg Order"
                        currentValue="$85.50"
                        currentLabel="Current"
                        previousValue="$85.20"
                        previousLabel="Previous"
                        change="+0.4%"
                        trend="neutral"
                        icon={<Package size={18} />}
                        color="amber"
                        loading={showLoading}
                    />
                </div>
            </section>

            {/* Section 6: Gradient/Glass KPI Card */}
            <section>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">6. Gradient/Glass KPI Card</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Glassmorphism style with gradient backgrounds</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <GradientKPICard
                        id="gradient-1"
                        label="Total Revenue"
                        value="$125,430"
                        change="+18.2%"
                        trend="up"
                        icon={<CurrencyDollar size={18} />}
                        gradient="indigo"
                        loading={showLoading}
                    />
                    <GradientKPICard
                        id="gradient-2"
                        label="Active Users"
                        value="24,892"
                        change="+12.5%"
                        trend="up"
                        icon={<Users size={18} />}
                        gradient="emerald"
                        loading={showLoading}
                    />
                    <GradientKPICard
                        id="gradient-3"
                        label="Conversion Rate"
                        value="4.2%"
                        change="-0.8%"
                        trend="down"
                        icon={<Percent size={18} />}
                        gradient="sunset"
                        loading={showLoading}
                    />
                    <GradientKPICard
                        id="gradient-4"
                        label="Server Uptime"
                        value="99.99%"
                        change="0%"
                        trend="neutral"
                        icon={<Lightning size={18} />}
                        gradient="ocean"
                        loading={showLoading}
                    />
                </div>
            </section>

            {/* Section 7: Compact KPI Card */}
            <section>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">7. Compact KPI Card</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Minimal horizontal layout with colored left border</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <CompactKPICard
                        id="compact-1"
                        label="Revenue"
                        value="$48.2K"
                        change="+12.5%"
                        trend="up"
                        color="indigo"
                        loading={showLoading}
                    />
                    <CompactKPICard
                        id="compact-2"
                        label="Users"
                        value="2,847"
                        change="+8.2%"
                        trend="up"
                        color="emerald"
                        loading={showLoading}
                    />
                    <CompactKPICard
                        id="compact-3"
                        label="Orders"
                        value="1,234"
                        change="-3.1%"
                        trend="down"
                        color="rose"
                        loading={showLoading}
                    />
                    <CompactKPICard
                        id="compact-4"
                        label="Avg Time"
                        value="4m 32s"
                        change="0%"
                        trend="neutral"
                        color="amber"
                        loading={showLoading}
                    />
                </div>
            </section>

            {/* Section 8: Radial/Ring KPI Card */}
            <section>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">8. Radial/Ring KPI Card</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Circular progress indicator</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <RadialKPICard
                        id="radial-1"
                        label="Goal Progress"
                        value="$85,000"
                        percentage={85}
                        subtitle="of $100,000"
                        color="indigo"
                        loading={showLoading}
                    />
                    <RadialKPICard
                        id="radial-2"
                        label="Tasks Done"
                        value="42 / 50"
                        percentage={84}
                        subtitle="tasks completed"
                        color="emerald"
                        loading={showLoading}
                    />
                    <RadialKPICard
                        id="radial-3"
                        label="Storage"
                        value="7.5 GB"
                        percentage={75}
                        subtitle="of 10 GB used"
                        color="amber"
                        loading={showLoading}
                    />
                    <RadialKPICard
                        id="radial-4"
                        label="CPU Usage"
                        value="32%"
                        percentage={32}
                        subtitle="current load"
                        color="rose"
                        loading={showLoading}
                    />
                </div>
            </section>

            {/* Section 9: Mini Bar KPI Card */}
            <section>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">9. Mini Bar KPI Card</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Small bar chart within the card</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MiniBarKPICard
                        id="minibar-1"
                        label="Monthly Sales"
                        value="$48.2K"
                        change="+12.5%"
                        trend="up"
                        chartData={BAR_CHART_DATA}
                        icon={<ChartBar size={18} />}
                        color="indigo"
                        loading={showLoading}
                    />
                    <MiniBarKPICard
                        id="minibar-2"
                        label="Weekly Signups"
                        value="1,234"
                        change="+8.2%"
                        trend="up"
                        chartData={[
                            { name: 'Mon', value: 150 },
                            { name: 'Tue', value: 200 },
                            { name: 'Wed', value: 180 },
                            { name: 'Thu', value: 250 },
                            { name: 'Fri', value: 220 },
                            { name: 'Sat', value: 140 },
                        ]}
                        icon={<Users size={18} />}
                        color="emerald"
                        loading={showLoading}
                    />
                    <MiniBarKPICard
                        id="minibar-3"
                        label="Daily Orders"
                        value="892"
                        change="-3.1%"
                        trend="down"
                        chartData={[
                            { name: 'Mon', value: 180 },
                            { name: 'Tue', value: 160 },
                            { name: 'Wed', value: 140 },
                            { name: 'Thu', value: 130 },
                            { name: 'Fri', value: 120 },
                            { name: 'Sat', value: 100 },
                        ]}
                        icon={<ShoppingCart size={18} />}
                        color="rose"
                        loading={showLoading}
                    />
                    <MiniBarKPICard
                        id="minibar-4"
                        label="API Calls"
                        value="1.2M"
                        change="0%"
                        trend="neutral"
                        chartData={[
                            { name: '1', value: 200 },
                            { name: '2', value: 198 },
                            { name: '3', value: 202 },
                            { name: '4', value: 200 },
                            { name: '5', value: 201 },
                            { name: '6', value: 199 },
                        ]}
                        icon={<Lightning size={18} />}
                        color="violet"
                        loading={showLoading}
                    />
                </div>
            </section>

            {/* Section 10: Mini Area KPI Card */}
            <section>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">10. Mini Area KPI Card</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Small area chart within the card</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MiniAreaKPICard
                        id="miniarea-1"
                        label="Traffic"
                        value="24.5K"
                        change="+15.2%"
                        trend="up"
                        chartData={AREA_CHART_DATA}
                        icon={<Activity size={18} />}
                        color="indigo"
                        loading={showLoading}
                    />
                    <MiniAreaKPICard
                        id="miniarea-2"
                        label="Page Views"
                        value="128K"
                        change="+22.3%"
                        trend="up"
                        chartData={[
                            { name: '1', value: 1000 },
                            { name: '2', value: 1200 },
                            { name: '3', value: 1100 },
                            { name: '4', value: 1400 },
                            { name: '5', value: 1300 },
                            { name: '6', value: 1600 },
                            { name: '7', value: 1800 },
                        ]}
                        icon={<ChartLine size={18} />}
                        color="emerald"
                        loading={showLoading}
                    />
                    <MiniAreaKPICard
                        id="miniarea-3"
                        label="Bounce Rate"
                        value="42.5%"
                        change="-5.1%"
                        trend="down"
                        chartData={[
                            { name: '1', value: 50 },
                            { name: '2', value: 48 },
                            { name: '3', value: 46 },
                            { name: '4', value: 45 },
                            { name: '5', value: 44 },
                            { name: '6', value: 43 },
                            { name: '7', value: 42 },
                        ]}
                        icon={<TrendUp size={18} />}
                        color="teal"
                        loading={showLoading}
                    />
                    <MiniAreaKPICard
                        id="miniarea-4"
                        label="Session"
                        value="4m 32s"
                        change="0%"
                        trend="neutral"
                        chartData={[
                            { name: '1', value: 270 },
                            { name: '2', value: 272 },
                            { name: '3', value: 268 },
                            { name: '4', value: 275 },
                            { name: '5', value: 270 },
                            { name: '6', value: 273 },
                            { name: '7', value: 272 },
                        ]}
                        icon={<Target size={18} />}
                        color="blue"
                        loading={showLoading}
                    />
                </div>
            </section>

            {/* Section 11: Multi-Metric KPI Card */}
            <section>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">11. Multi-Metric KPI Card</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Multiple stacked progress bars for different metrics</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <MultiMetricKPICard
                        id="multi-1"
                        label="Sales by Channel"
                        icon={<ShoppingCart size={18} />}
                        metrics={[
                            { name: 'Online Store', value: 45000, maxValue: 50000, color: 'indigo' },
                            { name: 'Marketplace', value: 28000, maxValue: 50000, color: 'emerald' },
                            { name: 'Retail', value: 15000, maxValue: 50000, color: 'amber' },
                        ]}
                        loading={showLoading}
                    />
                    <MultiMetricKPICard
                        id="multi-2"
                        label="Team Performance"
                        icon={<Users size={18} />}
                        metrics={[
                            { name: 'Development', value: 85, maxValue: 100, color: 'blue' },
                            { name: 'Design', value: 72, maxValue: 100, color: 'violet' },
                            { name: 'Marketing', value: 91, maxValue: 100, color: 'rose' },
                        ]}
                        loading={showLoading}
                    />
                    <MultiMetricKPICard
                        id="multi-3"
                        label="Resource Usage"
                        icon={<Activity size={18} />}
                        metrics={[
                            { name: 'CPU', value: 45, maxValue: 100, color: 'emerald' },
                            { name: 'Memory', value: 68, maxValue: 100, color: 'amber' },
                            { name: 'Storage', value: 82, maxValue: 100, color: 'rose' },
                        ]}
                        loading={showLoading}
                    />
                </div>
            </section>

            {/* Section 12: Full Chart KPI Card */}
            <section>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">12. Full Chart KPI Card (Large)</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Large bar chart with current vs previous comparison</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FullChartKPICard
                        id="fullchart-1"
                        label="Monthly Revenue"
                        value="$285,000"
                        change="+18.5%"
                        trend="up"
                        chartData={FULL_CHART_DATA}
                        icon={<CurrencyDollar size={20} />}
                        color="indigo"
                        loading={showLoading}
                    />
                    <FullChartKPICard
                        id="fullchart-2"
                        label="User Signups"
                        value="8,432"
                        change="+12.3%"
                        trend="up"
                        chartData={[
                            { name: 'Jan', current: 800, previous: 700 },
                            { name: 'Feb', current: 950, previous: 850 },
                            { name: 'Mar', current: 1100, previous: 900 },
                            { name: 'Apr', current: 1300, previous: 1100 },
                            { name: 'May', current: 1500, previous: 1250 },
                            { name: 'Jun', current: 1782, previous: 1400 },
                        ]}
                        icon={<Users size={20} />}
                        color="emerald"
                        loading={showLoading}
                    />
                </div>
            </section>

            {/* Section 13: Loading Skeletons */}
            <section>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">13. Loading Skeletons</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Skeleton components for loading states</p>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">KPI Card Loading</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <KPICardLoading />
                            <KPICardLoading />
                            <KPICardLoading />
                            <KPICardLoading />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Chart Skeleton</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ChartSkeleton title="Sales Chart" height="h-64" />
                            <LineChartSkeleton title="Trends" height="h-64" />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Pie Chart & Table Skeletons</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <PieChartSkeleton title="Distribution" size={180} />
                            <TableSkeleton rows={5} columns={4} />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Dashboard Section Skeleton</h3>
                        <DashboardSectionSkeleton title={true} />
                    </div>
                </div>
            </section>
        </div>
    );
};

export const TestPage: React.FC = () => {
    // Clear localStorage on first load to start fresh
    React.useEffect(() => {
        localStorage.removeItem('test-page-tabs');
        localStorage.removeItem('test-page-active-tab');
    }, []);

    const createBlankTab = (id: string, title: string): Tab => ({
        id,
        title,
        content: (
            <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                    <Flask size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Blank Test Canvas</p>
                </div>
            </div>
        )
    });

    const [tabs, setTabs] = React.useState<Tab[]>([
        { id: 'tab-1', title: 'Charts', content: <Test1Content /> },
        { id: 'tab-2', title: 'KPI Cards', content: <KPICardsContent /> }
    ]);

    const [activeTabId, setActiveTabId] = React.useState<string>('tab-2');

    const handleAddTab = () => {
        const newId = `tab-${Date.now()}`;
        const newTab = createBlankTab(newId, `Test ${tabs.length + 1}`);
        setTabs([...tabs, newTab]);
        setActiveTabId(newId);
    };

    const handleCloseTab = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newTabs = tabs.filter(t => t.id !== id);
        if (newTabs.length === 0) return; // Don't close last tab
        setTabs(newTabs);
        if (activeTabId === id) {
            setActiveTabId(newTabs[newTabs.length - 1].id);
        }
    };

    const activeTab = tabs.find(t => t.id === activeTabId);

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent">
            {/* Header Section */}
            <div className="flex-shrink-0 bg-white dark:bg-monday-dark-surface grid grid-rows-[1fr]">
                <div className="overflow-hidden">
                    <div className="pl-[24px] pr-[20px] pt-4 pb-0">
                        {/* Title Row */}
                        <div className="flex items-center justify-between mb-1 gap-4">
                            <div className="relative">
                                <h1 className="text-[32px] font-bold text-[#323338] dark:text-[#d0d1d6] leading-tight tracking-tight outline-none border border-transparent -ml-1.5 px-1.5 rounded-[4px]">
                                    Test Tools
                                </h1>
                            </div>
                        </div>
                        {/* Description Row */}
                        <div className="mb-4 text-[#676879] dark:text-[#9597a1] text-[14px] min-h-[20px]">
                            Testing playground for new tools and components
                        </div>

                        {/* Tabs Row */}
                        <div className="flex items-center gap-0 w-full border-b border-gray-200 dark:border-gray-800">
                            <div className="flex-1 flex items-center overflow-x-auto scrollbar-hide no-scrollbar" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                                {tabs.map(tab => (
                                    <div
                                        key={tab.id}
                                        onClick={() => setActiveTabId(tab.id)}
                                        className={`
                                            group flex items-center justify-start text-left gap-2 py-1.5 border-b-2 text-[13.6px] font-medium transition-colors whitespace-nowrap select-none px-3 cursor-pointer
                                            ${activeTabId === tab.id
                                                ? 'border-indigo-500 text-[#323338] dark:text-gray-100'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                            }
                                        `}
                                    >
                                        <span>{tab.title}</span>
                                        {tabs.length > 1 && (
                                            <button
                                                onClick={(e) => handleCloseTab(tab.id, e)}
                                                className="opacity-0 group-hover:opacity-100 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-gray-400"
                                            >
                                                <X size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleAddTab}
                                className="flex-shrink-0 ml-2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
                                title="Add Tab"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-white dark:bg-monday-dark-surface p-0">
                {activeTab?.content}
            </div>
        </div>
    );
};
