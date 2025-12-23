
import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import {
    Files,
    Inbox,
    CalendarClock,
    Zap,
    Check,
    X,
    PauseCircle,
    Send,
    Trash2,
    Calendar,
    Building2,
    MoreHorizontal,
    ArrowUpRight,
    ArrowDownRight,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
    Upload,
    Plus,
    Filter,
    ArrowUpDown,
    FileText,
    CheckCircle
} from 'lucide-react';
import { NewRequestModal } from './NewRequestModal';
import { procurementService } from '../../../../services/procurementService';
import { ConfirmDialog } from '../../../../components/ui/ConfirmDialog';
import { RFQSection } from './RFQSection';
import { NewRFQModal } from './NewRFQModal';

// --- Empty / Initial State Data ---

const APPROVAL_THEMES: Record<string, { badge: string; border: string; rowBg: string }> = {
    Approved: {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-900/40',
        border: 'border-emerald-500',
        rowBg: 'hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5'
    },
    'On Hold': {
        badge: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-900/40',
        border: 'border-amber-400',
        rowBg: 'hover:bg-amber-50/40 dark:hover:bg-amber-500/5'
    },
    Rejected: {
        badge: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-900/40',
        border: 'border-rose-500',
        rowBg: 'hover:bg-rose-50/40 dark:hover:bg-rose-500/5'
    },
    Pending: {
        badge: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/40 dark:text-gray-300 dark:border-gray-700',
        border: 'border-gray-200 dark:border-gray-700',
        rowBg: 'hover:bg-gray-50 dark:hover:bg-gray-800/40'
    }
};
const ORDER_APPROVAL_THEMES = APPROVAL_THEMES;

const getScratchStyle = (isDeleted?: boolean): React.CSSProperties | undefined =>
    isDeleted ? {
        textDecoration: 'line-through',
        textDecorationThickness: '4px',
        textDecorationColor: '#e11d48'
    } : undefined;

const withRequestDefaults = (request: any) => ({
    ...request,
    approvalStatus: request.approvalStatus || 'Pending',
    rfqSent: !!request.rfqSent
});

const KPI_DATA = [
    {
        title: "Total Requests",
        value: "0",
        trend: "0%",
        trendUp: true,
        icon: Files,
        description: "Year to Date"
    },
    {
        title: "Open Requests",
        value: "0",
        trend: "0%",
        trendUp: true,
        icon: Inbox,
        description: "Pending Action"
    },
    {
        title: "Today's Requests",
        value: "0",
        trend: "0%",
        trendUp: true,
        icon: CalendarClock,
        description: "New Incoming"
    },
    {
        title: "Urgent Requests",
        value: "0",
        trend: "0%",
        trendUp: true,
        icon: Zap,
        isUrgent: true,
        description: "Needs Attention"
    }
];

const CHART_OPTION = {
    tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: { color: '#111827', fontSize: 12 },
        padding: [8, 12],
        extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);'
    },
    grid: {
        left: '1%',
        right: '1%',
        bottom: '3%',
        top: '12%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            data: [],
            axisTick: { show: false },
            axisLine: { lineStyle: { color: '#e5e7eb' } },
            axisLabel: { color: '#6b7280', fontSize: 11, margin: 12 }
        }
    ],
    yAxis: [
        {
            type: 'value',
            splitLine: { lineStyle: { type: 'dashed', color: '#f3f4f6' } },
            axisLabel: { color: '#6b7280', fontSize: 11 }
        }
    ],
    series: [
        {
            name: 'Requests',
            type: 'bar',
            barWidth: '24px',
            data: [],
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: '#3b82f6' },
                        { offset: 1, color: '#2563eb' }
                    ]
                },
                borderRadius: [4, 4, 0, 0]
            },
            emphasis: {
                itemStyle: { color: '#1d4ed8' }
            }
        }
    ]
};

// Empty table data as requested
// ... (We will keep imports, but replace the component logic)

export const ProcurementOverview: React.FC = () => {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [isRFQModalOpen, setIsRFQModalOpen] = useState(false);
    const [selectedRequestForRFQ, setSelectedRequestForRFQ] = useState<any>(null);
    const [rfqs, setRfqs] = useState<any[]>([]);
    const [loadingRfqs, setLoadingRfqs] = useState(false);
    const [orders, setOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [ordersRowsPerPage, setOrdersRowsPerPage] = useState(10);
    const [ordersPage, setOrdersPage] = useState(1);
    const [ordersSearch, setOrdersSearch] = useState('');
    const [ordersStatusFilter, setOrdersStatusFilter] = useState('All');
    const [ordersPriorityFilter, setOrdersPriorityFilter] = useState('All');
    const [ordersFilterOpen, setOrdersFilterOpen] = useState(false);

    const [requestSearch, setRequestSearch] = useState('');
    const [requestStatusFilter, setRequestStatusFilter] = useState('All');
    const [requestPriorityFilter, setRequestPriorityFilter] = useState('All');
    const [requestDeptFilter, setRequestDeptFilter] = useState('All');
    const [requestFilterOpen, setRequestFilterOpen] = useState(false);

    // State for Table Data
    const [tableData, setTableData] = useState<any[]>([]);

    useEffect(() => {
        setCurrentPage(1);
    }, [rowsPerPage, tableData.length, requestStatusFilter, requestPriorityFilter, requestDeptFilter, requestSearch]);

    useEffect(() => {
        setOrdersPage(1);
    }, [ordersRowsPerPage, ordersSearch, ordersStatusFilter, ordersPriorityFilter, orders.length]);

    useEffect(() => {
        if (!orders.length || !rfqs.length) return;
        const orderMap = new Map(orders.map(o => [o.rfqId, o.id]));
        setRfqs(prev => {
            let changed = false;
            const next = prev.map(r => {
                if (!orderMap.has(r.id)) return r;
                const orderId = orderMap.get(r.id);
                const alreadyAligned = r.sentToOrder && r.orderId === orderId && r.status === 'Sent to PO';
                if (alreadyAligned) return r;
                changed = true;
                return { ...r, sentToOrder: true, orderId, status: r.status === 'Sent to PO' ? r.status : 'Sent to PO' };
            });
            return changed ? next : prev;
        });
    }, [orders, rfqs.length]);

    // Load data from the procurement service (decoupled from Board/Table)
    useEffect(() => {
        loadData();
        loadRfqs();
        loadOrders();
    }, []);

    const loadRfqs = async () => {
        setLoadingRfqs(true);
        try {
            const data = await procurementService.getAllRfqs();
            setRfqs(data.reverse()); // Show most recent first
        } catch (error) {
            console.error("Failed to load RFQs", error);
        } finally {
            setLoadingRfqs(false);
        }
    };

    const loadOrders = async () => {
        setLoadingOrders(true);
        try {
            const data = await procurementService.getAllOrders();
            setOrders(data.reverse());
        } catch (error) {
            console.error("Failed to load orders", error);
        } finally {
            setLoadingOrders(false);
        }
    };

    const loadData = async () => {
        try {
            const data = await procurementService.getAllRequests();
            setTableData(data.reverse().map(withRequestDefaults)); // Most recent first
        } catch (error) {
            console.error("Failed to load requests", error);
        }
    };

    const handleCreateRequest = async (data: any) => {
        // Map modal data to board task structure
        const newTask = {
            id: data.id || Date.now().toString(),
            name: data.id, // Using ID as name if name is missing, or just name
            date: data.date,
            department: data.department,
            warehouse: data.warehouse,
            relatedTo: data.relatedTo,
            status: "Pending",
            priority: data.status,
            isUrgent: data.status === 'Urgent',
            items: data.items,
            approvalStatus: 'Pending',
            rfqSent: false
        };

        const updatedRows = [newTask, ...tableData];
        // Note: tableData is reversed tasks, so [newTask, ...tableData] adds to the top of the UI list

        setTableData(updatedRows);
        try {
            await procurementService.createRequest(newTask);
        } catch (error) {
            console.error("Local save failed", error);
        }
        setIsNewRequestOpen(false);
    };

    const handleApprovalChange = async (id: string, approvalStatus: 'Approved' | 'On Hold' | 'Rejected' | 'Pending') => {
        const updateList = (list: any[]) => list.map(item => item.id === id ? { ...item, approvalStatus } : item);

        setTableData(prev => updateList(prev));

        try {
            await procurementService.updateRequest(id, { approvalStatus });
        } catch (error) {
            console.error("Failed to update approval status", error);
        }
    };

    const handleDeleteRequest = async (id: string) => {
        setDeleteConfirmId(id);
    };

    const executeDelete = async () => {
        if (!deleteConfirmId) return;
        const id = deleteConfirmId;

        setTableData(prev => prev.map(r => r.id === id ? { ...r, isDeleted: true } : r));
        try {
            await procurementService.updateRequest(id, { isDeleted: true });
        } catch (error) {
            console.error("Failed to mark request deleted", error);
        }
        setDeleteConfirmId(null);
    };

    const handleOpenRFQModal = (request: any) => {
        setSelectedRequestForRFQ(request);
        setIsRFQModalOpen(true);
    };

    const handleCreateRFQ = async (rfq: any) => {
        setIsRFQModalOpen(false); // Close immediately for reactivity

        // Optimistic update
        const optimisticId = `RFQ-OPT-${Date.now()}`;
        const optimisticRfq = { ...rfq, id: optimisticId, isOptimistic: true };
        setRfqs(prev => [optimisticRfq, ...prev]);

        try {
            const created = await procurementService.createRfq(rfq);
            // Replace optimistic with real data
            setRfqs(prev => prev.map(r => r.id === optimisticId ? created : r));
            setTableData(prev => prev.map(req => req.id === rfq.requestId ? { ...req, rfqSent: true } : req));
            try {
                await procurementService.updateRequest(rfq.requestId, { rfqSent: true });
            } catch (error) {
                console.error("Failed to mark request as sent to RFQ", error);
            }
        } catch (error) {
            console.error("Failed to create RFQ on server", error);
            // Fallback: keep optimistic but mark as errored if we had that state, 
            // for now just keep it so the user sees something happened.
        }
    };

    const handleSendRfqToOrder = async (rfq: any) => {
        if (!rfq) return;
        if (rfq.isDeleted) return;
        const alreadySent = rfq.sentToOrder || rfq.orderId || orders.some(o => o.rfqId === rfq.id);
        if (alreadySent) return;

        const orderTotal = Number(rfq.value ?? rfq.totalExVat ?? 0);

        const orderPayload = {
            id: rfq.orderId || `ORD-${Date.now().toString().slice(-6)}`,
            rfqId: rfq.id,
            requestId: rfq.requestId,
            supplier: rfq.supplier,
            department: rfq.department,
            warehouse: rfq.warehouse,
            date: new Date().toISOString().split('T')[0],
            dueDate: rfq.dueDate,
            totalValue: orderTotal,
            priority: rfq.priority || (rfq.isUrgent ? 'Urgent' : 'Normal'),
            status: 'Open',
            approvals: 'Pending',
            relatedTo: rfq.relatedTo,
            items: rfq.items || []
        };

        try {
            const createdOrder = await procurementService.createOrder(orderPayload);
            setOrders(prev => [createdOrder, ...prev.filter(o => o.id !== createdOrder.id)]);
            setRfqs(prev => prev.map(r => r.id === rfq.id ? { ...r, status: 'Sent to PO', sentToOrder: true, orderId: createdOrder.id } : r));
            await procurementService.updateRfq(rfq.id, { status: 'Sent to PO', sentToOrder: true, orderId: createdOrder.id });
        } catch (error) {
            console.error("Failed to send RFQ to order", error);
        }
    };

    const handleDeleteRfq = async (id: string) => {
        setRfqs(prev => prev.map(r => r.id === id ? { ...r, isDeleted: true } : r));
        try {
            await procurementService.updateRfq(id, { isDeleted: true });
        } catch (error) {
            console.error("Failed to mark RFQ deleted", error);
        }
    };

    const handleDeleteOrder = async (id: string) => {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, isDeleted: true } : o));
        try {
            await procurementService.updateOrder(id, { isDeleted: true });
        } catch (error) {
            console.error("Failed to mark order deleted", error);
        }
    };

    const handleMarkGR = async (id: string) => {
        const target = orders.find(o => o.id === id);
        if (target?.isDeleted) return;
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Received' } : o));
        try {
            await procurementService.updateOrder(id, { status: 'Received' });
        } catch (error) {
            console.error("Failed to mark goods receipt", error);
        }
    };

    const handleOrderApprovalChange = async (id: string, approvals: 'Approved' | 'On Hold' | 'Rejected' | 'Pending') => {
        const target = orders.find(o => o.id === id);
        if (target?.isDeleted) return;
        setOrders(prev => prev.map(o => o.id === id ? { ...o, approvals } : o));
        try {
            await procurementService.updateOrder(id, { approvals });
        } catch (error) {
            console.error("Failed to update order approval", error);
        }
    };

    // Calculate Dynamic KPIs
    const kpis = React.useMemo(() => {
        const total = tableData.length;
        const open = tableData.filter(r => r.status && !['Done', 'Closed', 'Approved'].includes(r.status)).length;

        const todayStr = new Date().toISOString().split('T')[0];
        const today = tableData.filter(r => r.date === todayStr || (r.createdAt && r.createdAt.startsWith(todayStr))).length;

        const urgent = tableData.filter(r => r.priority === 'Urgent' || r.isUrgent).length;

        return [
            {
                title: "Total Requests",
                value: total.toString(),
                trend: "+12%", // Mock trend for now
                trendUp: true,
                icon: Files,
                description: "Year to Date"
            },
            {
                title: "Open Requests",
                value: open.toString(),
                trend: "-5%",
                trendUp: false,
                icon: Inbox,
                description: "Pending Action"
            },
            {
                title: "Today's Requests",
                value: today.toString(),
                trend: "+8%",
                trendUp: true,
                icon: CalendarClock,
                description: "New Incoming"
            },
            {
                title: "Urgent Requests",
                value: urgent.toString(),
                trend: "+2%",
                trendUp: true,
                icon: Zap,
                isUrgent: true,
                description: "Needs Attention"
            }
        ];
    }, [tableData]);

    // Calculate Dynamic Chart Options
    const chartOption = React.useMemo(() => {
        const deptCounts: Record<string, number> = {};
        tableData.forEach(r => {
            const dept = r.department || 'Unassigned';
            deptCounts[dept] = (deptCounts[dept] || 0) + 1;
        });

        const depts = Object.keys(deptCounts);
        const counts = Object.values(deptCounts);

        return {
            ...CHART_OPTION,
            xAxis: [
                {
                    ...CHART_OPTION.xAxis[0],
                    data: depts.length > 0 ? depts : ['No Data']
                }
            ],
            series: [
                {
                    ...CHART_OPTION.series[0],
                    data: counts.length > 0 ? counts : [0]
                }
            ]
        };
    }, [tableData]);

    const rfqRequestIds = React.useMemo(() => new Set(rfqs.map(r => r.requestId)), [rfqs]);

    const requestFilterOptions = React.useMemo(() => {
        const departments = Array.from(new Set(tableData.map(r => r.department || 'Unassigned')));
        const priorities = Array.from(new Set(tableData.map(r => r.priority || ''))).filter(Boolean);
        const statuses = Array.from(new Set(tableData.map(r => r.status || ''))).filter(Boolean);
        return { departments, priorities, statuses };
    }, [tableData]);

    const filteredRequests = React.useMemo(() => {
        return tableData.filter(r => {
            const matchesSearch = requestSearch.trim().length === 0 ||
                r.id?.toLowerCase().includes(requestSearch.toLowerCase()) ||
                r.department?.toLowerCase().includes(requestSearch.toLowerCase()) ||
                r.warehouse?.toLowerCase().includes(requestSearch.toLowerCase()) ||
                r.relatedTo?.toLowerCase().includes(requestSearch.toLowerCase());

            const matchesStatus = requestStatusFilter === 'All' || r.status === requestStatusFilter;
            const matchesPriority = requestPriorityFilter === 'All' || r.priority === requestPriorityFilter;
            const matchesDept = requestDeptFilter === 'All' || r.department === requestDeptFilter;

            return matchesSearch && matchesStatus && matchesPriority && matchesDept;
        });
    }, [tableData, requestSearch, requestStatusFilter, requestPriorityFilter, requestDeptFilter]);

    const totalPages = Math.max(1, Math.ceil((filteredRequests.length || 1) / rowsPerPage));
    const currentPageSafe = Math.min(currentPage, totalPages);
    const startIdx = (currentPageSafe - 1) * rowsPerPage;
    const endIdx = Math.min(startIdx + rowsPerPage, filteredRequests.length);
    const paginatedTable = filteredRequests.slice(startIdx, endIdx);

    const filteredOrders = React.useMemo(() => {
        return orders.filter(order => {
            const matchesSearch = ordersSearch.trim().length === 0 ||
                order.id?.toLowerCase().includes(ordersSearch.toLowerCase()) ||
                order.supplier?.toLowerCase().includes(ordersSearch.toLowerCase());

            const matchesStatus = ordersStatusFilter === 'All' || order.status === ordersStatusFilter;
            const matchesPriority = ordersPriorityFilter === 'All' || order.priority === ordersPriorityFilter;
            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [orders, ordersSearch, ordersStatusFilter, ordersPriorityFilter]);

    const ordersTotalPages = Math.max(1, Math.ceil((filteredOrders.length || 1) / ordersRowsPerPage));
    const ordersPageSafe = Math.min(ordersPage, ordersTotalPages);
    const ordersStart = (ordersPageSafe - 1) * ordersRowsPerPage;
    const ordersEnd = Math.min(ordersStart + ordersRowsPerPage, filteredOrders.length);
    const paginatedOrders = filteredOrders.slice(ordersStart, ordersEnd);

    const ordersKpis = React.useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const total = orders.length;
        const open = orders.filter(o => !['Closed', 'Canceled', 'Cancelled', 'Done'].includes(o.status || '')).length;
        const todays = orders.filter(o => o.date === today).length;
        const urgent = orders.filter(o => ['High', 'Urgent', 'Critical'].includes((o.priority || '').toString())).length;

        return [
            { title: 'Total Orders', value: total, icon: Files, color: 'blue' },
            { title: 'Open Orders', value: open, icon: Inbox, color: 'green' },
            { title: "Today's Orders", value: todays, icon: CalendarClock, color: 'purple' },
            { title: 'Urgent Orders', value: urgent, icon: Zap, color: 'red' }
        ];
    }, [orders]);

    const ordersFilterOptions = React.useMemo(() => {
        const statuses = Array.from(new Set(orders.map(o => o.status || ''))).filter(Boolean);
        const priorities = Array.from(new Set(orders.map(o => o.priority || ''))).filter(Boolean);
        return { statuses, priorities };
    }, [orders]);

    const ordersByDepartmentChart = React.useMemo(() => {
        const counts: Record<string, number> = {};
        orders.forEach(o => {
            const dept = o.department || 'Unassigned';
            counts[dept] = (counts[dept] || 0) + 1;
        });
        const categories = Object.keys(counts);
        const values = Object.values(counts);

        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
            xAxis: {
                type: 'category',
                data: categories.length ? categories : ['No Data'],
                axisTick: { show: false },
                axisLabel: { rotate: 15 }
            },
            yAxis: {
                type: 'value',
                splitLine: { lineStyle: { type: 'dashed', color: '#f3f4f6' } }
            },
            series: [{
                type: 'bar',
                data: values.length ? values : [0],
                barWidth: '35%',
                itemStyle: {
                    borderRadius: [4, 4, 0, 0],
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: '#3b82f6' },
                            { offset: 1, color: '#1d4ed8' }
                        ]
                    }
                }
            }]
        };
    }, [orders]);

    return (
        <div className="w-full h-full p-5 pb-20 overflow-y-auto bg-[#f8f9fa] dark:bg-[#0f1115] space-y-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

            <NewRequestModal
                isOpen={isNewRequestOpen}
                onClose={() => setIsNewRequestOpen(false)}
                onSubmit={handleCreateRequest}
                existingTasks={tableData}
            />

            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Procurement Requests</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage and track your procurement requisitions</p>
            </div>

            {/* 1. KPIs Section */}
            <div className="grid grid-cols-4 gap-4">
                {kpis.map((kpi, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700/50">
                                <kpi.icon className="text-gray-500 dark:text-gray-400" size={18} />
                            </div>
                            <div className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full ${kpi.trendUp
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                                }`}>
                                {kpi.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {kpi.trend}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-1">{kpi.value}</h3>
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{kpi.title}</p>
                                <span className="text-[10px] text-gray-400 dark:text-gray-500">{kpi.description}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 2. Chart Section */}
            <div className="bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Department Request Volume</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Breakdown of procurement requests across departments</p>
                    </div>
                    <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 transition-colors">
                        <MoreHorizontal size={16} />
                    </button>
                </div>

                <div className="w-full -ml-2">
                    <ReactECharts
                        option={chartOption}
                        style={{ height: '300px', width: '100%' }}
                        theme={null}
                    />
                </div>
            </div>

            {/* 3. Requests Table */}
            <div className="bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm flex-1 flex flex-col">
                <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-[#1a1d24] rounded-t-lg">
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Requests Table</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Manage and process incoming requisitions</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search & Filter */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                <Search size={14} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={requestSearch}
                                onChange={(e) => setRequestSearch(e.target.value)}
                                placeholder="Search requests..."
                                className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-[#15171b] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none w-48"
                            />
                        </div>

                        <div className="relative">
                            <button
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                onClick={() => setRequestFilterOpen(prev => !prev)}
                            >
                                <Filter size={14} />
                                Filter
                            </button>
                            {requestFilterOpen && (
                                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 space-y-3 z-20">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</label>
                                        <select
                                            value={requestStatusFilter}
                                            onChange={(e) => setRequestStatusFilter(e.target.value)}
                                            className="w-full text-xs px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                        >
                                            <option value="All">All</option>
                                            {requestFilterOptions.statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Priority</label>
                                        <select
                                            value={requestPriorityFilter}
                                            onChange={(e) => setRequestPriorityFilter(e.target.value)}
                                            className="w-full text-xs px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                        >
                                            <option value="All">All</option>
                                            {requestFilterOptions.priorities.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Department</label>
                                        <select
                                            value={requestDeptFilter}
                                            onChange={(e) => setRequestDeptFilter(e.target.value)}
                                            className="w-full text-xs px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                        >
                                            <option value="All">All</option>
                                            {requestFilterOptions.departments.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <button
                                        className="w-full text-xs font-semibold text-blue-600 dark:text-blue-400"
                                        onClick={() => {
                                            setRequestStatusFilter('All');
                                            setRequestPriorityFilter('All');
                                            setRequestDeptFilter('All');
                                            setRequestSearch('');
                                        }}
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

                        {/* Actions */}
                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <Upload size={14} />
                            Import
                        </button>

                        <button
                            onClick={() => setIsNewRequestOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 border border-transparent rounded-lg shadow-sm hover:shadow transition-all active:scale-95"
                        >
                            <Plus size={14} />
                            New Request
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[300px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/40 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 whitespace-nowrap">
                                <th className="px-4 py-3 w-10 text-center">
                                    <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5" />
                                </th>
                                <th className="px-4 py-3 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 group select-none">
                                    <div className="flex items-center gap-1">Request ID <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                                </th>
                                <th className="px-4 py-3 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 group select-none">
                                    <div className="flex items-center gap-1">Date <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                                </th>
                                <th className="px-4 py-3 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 group select-none">
                                    <div className="flex items-center gap-1">Department <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                                </th>
                                <th className="px-4 py-3 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 group select-none">
                                    <div className="flex items-center gap-1">Warehouse <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                                </th>
                                <th className="px-4 py-3">Related to</th>
                                <th className="px-4 py-3 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 group select-none">
                                    <div className="flex items-center gap-1">Status <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                                </th>
                                <th className="px-4 py-3 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 group select-none">
                                    <div className="flex items-center gap-1">Priority <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                                </th>
                                <th className="px-4 py-3 text-center">Approval</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {tableData.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="px-4 py-12 text-center text-gray-400 text-xs text-center border-none">
                                        <div className="flex flex-col items-center gap-2">
                                            <Inbox size={24} className="opacity-20" />
                                            <span>No requests found</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedTable.map((row, idx) => {
                                    const approvalStatus = row.approvalStatus || 'Pending';
                                    const hasExistingRfq = row.rfqSent || rfqRequestIds.has(row.id);
                                    const isDeleted = !!row.isDeleted;
                                    const canSendToRFQ = !isDeleted && approvalStatus === 'Approved' && !hasExistingRfq;
                                    const theme = APPROVAL_THEMES[approvalStatus] || APPROVAL_THEMES.Pending;

                                    const rfqTitle = isDeleted
                                        ? 'Request marked as deleted'
                                        : hasExistingRfq
                                            ? 'RFQ already created'
                                            : approvalStatus !== 'Approved'
                                                ? 'Approve request before creating RFQ'
                                                : 'Create RFQ';

                                    return (
                                        <tr
                                            key={idx}
                                            style={getScratchStyle(isDeleted)}
                                            className={`transition-colors group text-xs text-gray-700 dark:text-gray-300 ${theme.rowBg} ${isDeleted ? 'opacity-60' : ''}`}
                                        >
                                            <td className="px-4 py-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    disabled={isDeleted}
                                                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 disabled:opacity-40"
                                                />
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{row.id}</td>
                                            <td className="px-4 py-3 text-gray-500">{row.date}</td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                                                    <Building2 size={10} />
                                                    {row.department}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">{row.warehouse}</td>
                                            <td className="px-4 py-3 text-gray-500">{row.relatedTo}</td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 text-[10px] font-medium uppercase tracking-wide">
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide border ${row.priority === 'Urgent' ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30' :
                                                    row.priority === 'High' ? 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/30' :
                                                        row.priority === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30' :
                                                            'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30'
                                                    }`}>
                                                    {row.priority}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border ${theme.badge}`}>
                                                        {approvalStatus}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => handleApprovalChange(row.id, 'Approved')}
                                                            disabled={isDeleted}
                                                            className="p-1.5 hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                            title="Approve"
                                                        >
                                                            <Check size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleApprovalChange(row.id, 'On Hold')}
                                                            disabled={isDeleted}
                                                            className="p-1.5 hover:bg-amber-50 text-gray-400 hover:text-amber-600 dark:hover:bg-amber-900/20 dark:hover:text-amber-400 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                            title="Hold"
                                                        >
                                                            <PauseCircle size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleApprovalChange(row.id, 'Rejected')}
                                                            disabled={isDeleted}
                                                            className="p-1.5 hover:bg-rose-50 text-gray-400 hover:text-rose-600 dark:hover:bg-rose-900/20 dark:hover:text-rose-400 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                            title="Reject"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={() => canSendToRFQ && handleOpenRFQModal(row)}
                                                        disabled={!canSendToRFQ}
                                                        className={`p-1.5 rounded transition-colors ${canSendToRFQ
                                                            ? 'hover:bg-blue-50 text-gray-400 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400'
                                                            : 'text-gray-300 cursor-not-allowed opacity-60'
                                                            }`}
                                                        title={rfqTitle}
                                                    >
                                                        <FileText size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteRequest(row.id)}
                                                        disabled={isDeleted}
                                                        className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>

                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/20 rounded-b-lg">
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span>Rows per page:</span>
                        <select
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={50}>50</option>
                        </select>
                        <span className="ml-2">{tableData.length === 0 ? '0-0 of 0' : `${startIdx + 1}-${endIdx} of ${tableData.length}`}</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 disabled:opacity-50"
                            disabled={currentPageSafe === 1}
                            onClick={() => setCurrentPage(1)}
                        >
                            <ChevronsLeft size={16} />
                        </button>
                        <button
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 disabled:opacity-50"
                            disabled={currentPageSafe === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 disabled:opacity-50"
                            disabled={currentPageSafe >= totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        >
                            <ChevronRight size={16} />
                        </button>
                        <button
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 disabled:opacity-50"
                            disabled={currentPageSafe >= totalPages}
                            onClick={() => setCurrentPage(totalPages)}
                        >
                            <ChevronsRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation Dialog */}
            <ConfirmDialog
                isOpen={!!deleteConfirmId}
                onClose={() => setDeleteConfirmId(null)}
                onConfirm={executeDelete}
                title="Mark Request as Deleted"
                message="This will keep the request visible but scratched out for record-keeping. Proceed?"
                confirmLabel="Mark Deleted"
                variant="warning"
            />

            <NewRFQModal
                isOpen={isRFQModalOpen}
                onClose={() => setIsRFQModalOpen(false)}
                onSubmit={handleCreateRFQ}
                requestData={selectedRequestForRFQ}
            />

            <RFQSection
                rfqs={rfqs}
                onDeleteRfq={handleDeleteRfq}
                onSendToOrder={handleSendRfqToOrder}
            />

            {/* Orders Section */}
            <div className="space-y-5">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Orders</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Monitor internal orders after RFQs are processed</p>
                </div>

                {/* Orders KPIs */}
                <div className="grid grid-cols-4 gap-4">
                    {ordersKpis.map((kpi, idx) => (
                        <div
                            key={idx}
                            className="bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700/50">
                                    <kpi.icon className="text-gray-500 dark:text-gray-400" size={18} />
                                </div>
                                <div className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                    <ArrowUpRight size={12} />
                                    Stable
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-1">{kpi.value}</h3>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{kpi.title}</p>
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 capitalize">{kpi.color}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Orders Chart */}
                <div className="bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Orders by Department</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Distribution of orders across departments</p>
                        </div>
                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 transition-colors">
                            <MoreHorizontal size={16} />
                        </button>
                    </div>

                    <div className="w-full -ml-2">
                        <ReactECharts
                            option={ordersByDepartmentChart}
                            style={{ height: '280px', width: '100%' }}
                            theme={null}
                        />
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm flex-1 flex flex-col">
                    <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-[#1a1d24] rounded-t-lg sticky top-0 z-10">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Orders Table</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Track internal orders lifecycle</p>
                        </div>

                        <div className="flex items-center gap-3 relative">
                            {/* Search & Filter */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                    <Search size={14} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={ordersSearch}
                                    onChange={(e) => setOrdersSearch(e.target.value)}
                                    placeholder="Search orders..."
                                    className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-[#15171b] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none w-48"
                                />
                            </div>

                            <div className="relative">
                                <button
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    onClick={() => setOrdersFilterOpen(prev => !prev)}
                                >
                                    <Filter size={14} />
                                    Filter
                                </button>
                                {ordersFilterOpen && (
                                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 space-y-3 z-20">
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</label>
                                            <select
                                                value={ordersStatusFilter}
                                                onChange={(e) => setOrdersStatusFilter(e.target.value)}
                                                className="w-full text-xs px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                            >
                                                <option value="All">All</option>
                                                {ordersFilterOptions.statuses.map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Priority</label>
                                            <select
                                                value={ordersPriorityFilter}
                                                onChange={(e) => setOrdersPriorityFilter(e.target.value)}
                                                className="w-full text-xs px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                            >
                                                <option value="All">All</option>
                                                {ordersFilterOptions.priorities.map(priority => (
                                                    <option key={priority} value={priority}>{priority}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button
                                            className="w-full text-xs font-semibold text-blue-600 dark:text-blue-400"
                                            onClick={() => {
                                                setOrdersStatusFilter('All');
                                                setOrdersPriorityFilter('All');
                                                setOrdersSearch('');
                                            }}
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto min-h-[240px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800/40 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 whitespace-nowrap">
                                    <th className="px-4 py-3">Order ID</th>
                                    <th className="px-4 py-3">Supplier</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Total Value</th>
                                    <th className="px-4 py-3">Priority</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-center">Approvals</th>
                                    <th className="px-4 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {paginatedOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-10 text-center text-gray-400 text-xs border-none">
                                            No orders found
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedOrders.map((order, idx) => {
                                        const approvalTheme = ORDER_APPROVAL_THEMES[order.approvals || 'Pending'] || ORDER_APPROVAL_THEMES.Pending;
                                        const isDeleted = !!order.isDeleted;
                                        return (
                                            <tr
                                                key={idx}
                                                style={getScratchStyle(isDeleted)}
                                                className={`transition-colors group text-xs text-gray-700 dark:text-gray-300 ${approvalTheme.rowBg} ${isDeleted ? 'opacity-60' : ''}`}
                                            >
                                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{order.id}</td>
                                                <td className="px-4 py-3 text-gray-500">{order.supplier}</td>
                                                <td className="px-4 py-3 text-gray-500">{order.date || '-'}</td>
                                                <td className="px-4 py-3 text-gray-900 dark:text-gray-100 font-semibold">
                                                    {order.totalValue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide border ${
                                                            order.priority === 'Urgent'
                                                                ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30'
                                                                : order.priority === 'High'
                                                                    ? 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/30'
                                                                    : order.priority === 'Medium'
                                                                        ? 'bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30'
                                                                        : 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30'
                                                        }`}
                                                    >
                                                        {order.priority || 'Normal'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 text-[10px] font-medium uppercase tracking-wide">
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                        <div className="flex items-center justify-center gap-2 w-full">
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border ${approvalTheme.badge}`}>
                                                                {order.approvals || 'Pending'}
                                                            </span>
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    onClick={() => handleOrderApprovalChange(order.id, 'Approved')}
                                                                    disabled={isDeleted}
                                                                    className="p-1.5 hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                                    title="Approve"
                                                                >
                                                                    <Check size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleOrderApprovalChange(order.id, 'On Hold')}
                                                                    disabled={isDeleted}
                                                                    className="p-1.5 hover:bg-amber-50 text-gray-400 hover:text-amber-600 dark:hover:bg-amber-900/20 dark:hover:text-amber-400 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                                    title="Hold"
                                                                >
                                                                    <PauseCircle size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleOrderApprovalChange(order.id, 'Rejected')}
                                                                    disabled={isDeleted}
                                                                    className="p-1.5 hover:bg-rose-50 text-gray-400 hover:text-rose-600 dark:hover:bg-rose-900/20 dark:hover:text-rose-400 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                                    title="Reject"
                                                                >
                                                                    <X size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                                <button
                                                                    onClick={() => handleMarkGR(order.id)}
                                                                    disabled={isDeleted}
                                                                    className="p-1.5 hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                                    title="Goods Receipt"
                                                                >
                                                                    <CheckCircle size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteOrder(order.id)}
                                                                    disabled={isDeleted}
                                                                    className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/20 rounded-b-lg">
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span>Rows per page:</span>
                            <select
                                value={ordersRowsPerPage}
                                onChange={(e) => setOrdersRowsPerPage(Number(e.target.value))}
                                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={50}>50</option>
                            </select>
                            <span className="ml-2">{filteredOrders.length === 0 ? '0-0 of 0' : `${ordersStart + 1}-${ordersEnd} of ${filteredOrders.length}`}</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 disabled:opacity-50"
                                disabled={ordersPageSafe === 1}
                                onClick={() => setOrdersPage(1)}
                            >
                                <ChevronsLeft size={16} />
                            </button>
                            <button
                                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 disabled:opacity-50"
                                disabled={ordersPageSafe === 1}
                                onClick={() => setOrdersPage(prev => Math.max(1, prev - 1))}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 disabled:opacity-50"
                                disabled={ordersPageSafe >= ordersTotalPages}
                                onClick={() => setOrdersPage(prev => Math.min(ordersTotalPages, prev + 1))}
                            >
                                <ChevronRight size={16} />
                            </button>
                            <button
                                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 disabled:opacity-50"
                                disabled={ordersPageSafe >= ordersTotalPages}
                                onClick={() => setOrdersPage(ordersTotalPages)}
                            >
                                <ChevronsRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
