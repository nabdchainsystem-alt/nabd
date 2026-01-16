import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, ShoppingCart, Percent } from 'lucide-react';

const KPICard = ({ title, value, change, isPositive, icon: Icon }: any) => (
    <div className="bg-white dark:bg-[#1f2937] p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex justify-between items-start mb-2">
            <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase">{title}</span>
            {Icon && <Icon size={16} className="text-gray-400" />}
        </div>
        <div className="flex items-end gap-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
            <span className={`text-xs font-medium flex items-center mb-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {change}
            </span>
        </div>
    </div>
);

// Helper to render chart
const ChartWidget = ({ option, height = '300px' }: { option: any; height?: string }) => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const chartInstance = echarts.init(chartRef.current);
        chartInstance.setOption(option);

        const resizeHandler = () => chartInstance.resize();
        window.addEventListener('resize', resizeHandler);

        return () => {
            window.removeEventListener('resize', resizeHandler);
            chartInstance.dispose();
        };
    }, [option]);

    return <div ref={chartRef} style={{ width: '100%', height }} />;
};

const SalesInsights: React.FC = () => {
    // --- Chart Options ---

    // Row B: Bar Charts
    const dailyRevenueOption = {
        title: { text: 'Daily Revenue (30 Days)', left: 'left', textStyle: { fontSize: 14 } },
        tooltip: { trigger: 'axis' },
        grid: { top: 40, bottom: 20, left: 40, right: 10 },
        xAxis: { type: 'category', data: ['1', '5', '10', '15', '20', '25', '30'], show: false },
        yAxis: { type: 'value', show: false },
        series: [{ type: 'bar', data: [820, 932, 901, 934, 1290, 1330, 1320, 1200, 1100, 1000, 1400, 1500], color: '#3b82f6', barWidth: '60%' }]
    };

    const salesByChannelOption = {
        title: { text: 'Sales by Channel', left: 'left', textStyle: { fontSize: 14 } },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { top: 40, bottom: 20, left: 10, right: 10, containLabel: true },
        xAxis: { type: 'category', data: ['Store', 'Web', 'Social'], axisTick: { alignWithLabel: true } },
        yAxis: { type: 'value', show: false },
        series: [{ type: 'bar', data: [400, 300, 200], color: '#8b5cf6', barWidth: '50%' }]
    };

    // Row C: Pie Charts
    const revenueByCategoryOption = {
        title: { text: 'Revenue by Category', left: 'center', textStyle: { fontSize: 14 } },
        tooltip: { trigger: 'item' },
        series: [{
            type: 'pie', radius: ['40%', '70%'],
            data: [
                { value: 1048, name: 'Electronics' },
                { value: 735, name: 'Fashion' },
                { value: 580, name: 'Home' },
                { value: 484, name: 'Beauty' }
            ],
            emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
        }]
    };

    const paymentMethodOption = {
        title: { text: 'Payment Method', left: 'center', textStyle: { fontSize: 14 } },
        tooltip: { trigger: 'item' },
        series: [{
            type: 'pie', radius: '70%',
            data: [
                { value: 40, name: 'Visa/Master' },
                { value: 30, name: 'Mada' },
                { value: 20, name: 'Cash' },
                { value: 10, name: 'Tabby' }
            ],
            color: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']
        }]
    };

    // Row D: Advanced ECharts
    const revenueTrendOption = {
        title: { text: 'Revenue Trend (Area)', left: 'left' },
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', boundaryGap: false, data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
        yAxis: { type: 'value' },
        series: [{
            name: 'Revenue', type: 'line', stack: 'Total', smooth: true,
            areaStyle: {
                color: {
                    type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [{ offset: 0, color: '#3b82f6' }, { offset: 1, color: 'rgba(59, 130, 246, 0)' }]
                }
            },
            data: [820, 932, 901, 934, 1290, 1330, 1320]
        }]
    };

    const targetGaugeOption = {
        title: { text: 'Monthly Target', left: 'center', top: 'bottom' },
        series: [{
            type: 'gauge',
            startAngle: 180, endAngle: 0,
            min: 0, max: 100,
            splitNumber: 5,
            itemStyle: { color: '#10b981' },
            progress: { show: true, width: 30 },
            pointer: { show: false },
            axisLine: { lineStyle: { width: 30 } },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            detail: { valueAnimation: true, offsetCenter: [0, '-20%'], fontSize: 30, formatter: '{value}%' },
            data: [{ value: 70 }]
        }]
    };

    const heatmapOption = {
        tooltip: { position: 'top' },
        grid: { height: '50%', top: '10%' },
        xAxis: { type: 'category', data: ['12a', '2a', '4a', '6a', '8a', '10a', '12p', '2p', '4p', '6p', '8p', '10p'], splitArea: { show: true } },
        yAxis: { type: 'category', data: ['Sat', 'Fri', 'Thu', 'Wed', 'Tue', 'Mon', 'Sun'], splitArea: { show: true } },
        visualMap: { min: 0, max: 10, calculable: true, orient: 'horizontal', left: 'center', bottom: '15%' },
        series: [{
            name: 'Sales Heatmap', type: 'heatmap',
            data: [[0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [0, 9, 0], [0, 10, 0], [0, 11, 2], [0, 12, 4], [0, 13, 1], [0, 14, 1], [0, 15, 3], [0, 16, 4], [0, 17, 6], [0, 18, 4], [0, 19, 4], [0, 20, 3], [0, 21, 3], [0, 22, 2], [0, 23, 5], [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0], [1, 6, 0], [1, 7, 0], [1, 8, 0], [1, 9, 0], [1, 10, 5], [1, 11, 2], [1, 12, 2], [1, 13, 6], [1, 14, 9], [1, 15, 11], [1, 16, 6], [1, 17, 7], [1, 18, 8], [1, 19, 12], [1, 20, 5], [1, 21, 5], [1, 22, 7], [1, 23, 2]],
            label: { show: true },
            emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
        }]
    };


    return (
        <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-[#1a1d24] p-6">
            <div className="max-w-[1600px] mx-auto space-y-6">

                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Executive Command</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Real-time performance metrics</p>
                    </div>
                </div>

                {/* Row A: 8 KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
                    <KPICard title="Revenue" value="SAR 42.5k" change="+12%" isPositive={true} icon={DollarSign} />
                    <KPICard title="Net Profit" value="SAR 15.2k" change="+8.5%" isPositive={true} icon={TrendingUp} />
                    <KPICard title="Orders" value="342" change="+24" isPositive={true} icon={ShoppingCart} />
                    <KPICard title="AOV" value="SAR 124" change="-2.1%" isPositive={false} />
                    <KPICard title="Gross Margin" value="38%" change="+1.2%" isPositive={true} icon={Percent} />
                    <KPICard title="Items Sold" value="1,842" change="+15%" isPositive={true} />
                    <KPICard title="Returns" value="SAR 420" change="-5%" isPositive={true} />
                    <KPICard title="Goal" value="85%" change="Target" isPositive={true} />
                </div>

                {/* Row B: 4 Bar Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-[#1f2937] p-4 rounded-xl border border-gray-100 dark:border-gray-700 h-[250px] flex items-center justify-center">
                        <ChartWidget option={dailyRevenueOption} height="100%" />
                    </div>
                    <div className="bg-white dark:bg-[#1f2937] p-4 rounded-xl border border-gray-100 dark:border-gray-700 h-[250px] flex items-center justify-center">
                        <ChartWidget option={salesByChannelOption} height="100%" />
                    </div>
                    <div className="bg-white dark:bg-[#1f2937] p-4 rounded-xl border border-gray-100 dark:border-gray-700 h-[250px] flex items-center justify-center">
                        <ChartWidget option={dailyRevenueOption} height="100%" />
                    </div>
                    <div className="bg-white dark:bg-[#1f2937] p-4 rounded-xl border border-gray-100 dark:border-gray-700 h-[250px] flex items-center justify-center">
                        <ChartWidget option={salesByChannelOption} height="100%" />
                    </div>
                </div>

                {/* Row C: 4 Pie Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-[#1f2937] p-4 rounded-xl border border-gray-100 dark:border-gray-700 h-[300px] flex items-center justify-center">
                        <ChartWidget option={revenueByCategoryOption} height="100%" />
                    </div>
                    <div className="bg-white dark:bg-[#1f2937] p-4 rounded-xl border border-gray-100 dark:border-gray-700 h-[300px] flex items-center justify-center">
                        <ChartWidget option={paymentMethodOption} height="100%" />
                    </div>
                    <div className="bg-white dark:bg-[#1f2937] p-4 rounded-xl border border-gray-100 dark:border-gray-700 h-[300px] flex items-center justify-center">
                        <ChartWidget option={revenueByCategoryOption} height="100%" />
                    </div>
                    <div className="bg-white dark:bg-[#1f2937] p-4 rounded-xl border border-gray-100 dark:border-gray-700 h-[300px] flex items-center justify-center">
                        <ChartWidget option={paymentMethodOption} height="100%" />
                    </div>
                </div>

                {/* Row D: 4 Advanced ECharts */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-[#1f2937] p-4 rounded-xl border border-gray-100 dark:border-gray-700 h-[350px] flex items-center justify-center">
                        <ChartWidget option={revenueTrendOption} height="100%" />
                    </div>
                    <div className="bg-white dark:bg-[#1f2937] p-4 rounded-xl border border-gray-100 dark:border-gray-700 h-[350px] flex items-center justify-center">
                        <ChartWidget option={targetGaugeOption} height="100%" />
                    </div>
                    <div className="bg-white dark:bg-[#1f2937] p-4 rounded-xl border border-gray-100 dark:border-gray-700 h-[350px] flex items-center justify-center">
                        <ChartWidget option={heatmapOption} height="100%" />
                    </div>
                    <div className="bg-white dark:bg-[#1f2937] p-4 rounded-xl border border-gray-100 dark:border-gray-700 h-[350px] flex items-center justify-center">
                        <ChartWidget option={revenueTrendOption} height="100%" />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SalesInsights;
