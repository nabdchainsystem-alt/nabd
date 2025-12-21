import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, StickyNote, Shapes, Type, Link2, RotateCcw } from 'lucide-react';

type WhiteboardItemType = 'sticky' | 'shape' | 'text';
type ShapeVariant = 'rectangle' | 'circle' | 'diamond';

interface WhiteboardItem {
    id: string;
    type: WhiteboardItemType;
    variant?: ShapeVariant;
    text: string;
    color: string;
    x: number; // 0..1 relative position
    y: number;
}

interface Connection {
    id: string;
    from: string;
    to: string;
}

const COLOR_PALETTE = ['#fef3c7', '#dbeafe', '#dcfce7', '#f3e8ff', '#fee2e2', '#e0f2fe', '#f1f5f9'];

const defaultItems: WhiteboardItem[] = [
    { id: 'note-1', type: 'sticky', text: 'Brainstorm here', color: '#fef3c7', x: 0.18, y: 0.16 },
    { id: 'shape-1', type: 'shape', variant: 'rectangle', text: 'Idea', color: '#dbeafe', x: 0.45, y: 0.32 },
    { id: 'text-1', type: 'text', text: 'Next step?', color: '#f1f5f9', x: 0.26, y: 0.52 },
];

const getItemSize = (item: WhiteboardItem) => {
    if (item.type === 'shape') return { width: 140, height: 90 };
    if (item.type === 'text') return { width: 240, height: 110 };
    return { width: 180, height: 130 };
};

const WhiteboardView: React.FC<{ boardId: string }> = ({ boardId }) => {
    const canvasKey = `whiteboard-${boardId}`;
    const [items, setItems] = useState<WhiteboardItem[]>(() => {
        try {
            const saved = localStorage.getItem(canvasKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed.items || defaultItems;
            }
        } catch {
            // ignore
        }
        return defaultItems;
    });
    const [connections, setConnections] = useState<Connection[]>(() => {
        try {
            const saved = localStorage.getItem(canvasKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed.connections || [];
            }
        } catch {
            // ignore
        }
        return items.length > 1 ? [{ id: 'conn-1', from: items[0].id, to: items[1].id }] : [];
    });
    const [selectedColor, setSelectedColor] = useState<string>(COLOR_PALETTE[0]);
    const [anchorId, setAnchorId] = useState<string | null>(items[items.length - 1]?.id || null);
    const [dragging, setDragging] = useState<{ id: string | null; offsetX: number; offsetY: number }>({ id: null, offsetX: 0, offsetY: 0 });
    const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({ width: 900, height: 620 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Persist board state
    useEffect(() => {
        localStorage.setItem(canvasKey, JSON.stringify({ items, connections }));
    }, [items, connections, canvasKey]);

    // Track container size for relative positioning
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            const rect = entries[0].contentRect;
            setCanvasSize({ width: rect.width, height: rect.height });
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // Handle dragging
    useEffect(() => {
        if (!dragging.id) return;

        const handleMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = Math.min(Math.max(e.clientX - rect.left - dragging.offsetX, 0), rect.width);
            const y = Math.min(Math.max(e.clientY - rect.top - dragging.offsetY, 0), rect.height);

            setItems((prev) =>
                prev.map((item) =>
                    item.id === dragging.id
                        ? { ...item, x: rect.width ? x / rect.width : item.x, y: rect.height ? y / rect.height : item.y }
                        : item
                )
            );
        };

        const handleUp = () => setDragging({ id: null, offsetX: 0, offsetY: 0 });

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
        };
    }, [dragging]);

    const addItem = (type: WhiteboardItemType, variant?: ShapeVariant) => {
        const newItem: WhiteboardItem = {
            id: `wb-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            type,
            variant,
            text: type === 'sticky' ? 'New note' : type === 'shape' ? 'Step' : 'Text block',
            color: selectedColor,
            x: Math.min(0.78, 0.18 + Math.random() * 0.6),
            y: Math.min(0.78, 0.12 + Math.random() * 0.6)
        };

        setItems((prev) => {
            const next = [...prev, newItem];
            const linkFrom = anchorId || prev[prev.length - 1]?.id;
            if (linkFrom) {
                setConnections((c) => [...c, { id: `conn-${Date.now()}`, from: linkFrom, to: newItem.id }]);
            }
            setAnchorId(newItem.id);
            return next;
        });
    };

    const resetCanvas = () => {
        setItems(defaultItems);
        setConnections(defaultItems.length > 1 ? [{ id: 'conn-reset', from: defaultItems[0].id, to: defaultItems[1].id }] : []);
        setAnchorId(defaultItems[defaultItems.length - 1]?.id || null);
    };

    const itemCenters = useMemo(() => {
        return items.reduce<Record<string, { x: number; y: number }>>((acc, item) => {
            const size = getItemSize(item);
            acc[item.id] = {
                x: item.x * canvasSize.width + size.width / 2,
                y: item.y * canvasSize.height + size.height / 2
            };
            return acc;
        }, {});
    }, [items, canvasSize]);

    const renderItemShape = (item: WhiteboardItem) => {
        if (item.type !== 'shape') return null;
        if (item.variant === 'circle') {
            return <div className="w-full h-full rounded-full border-2 border-blue-200 bg-white/70" />;
        }
        if (item.variant === 'diamond') {
            return <div className="w-full h-full rotate-45 border-2 border-blue-200 bg-white/70" />;
        }
        return <div className="w-full h-full rounded-lg border-2 border-blue-200 bg-white/70" />;
    };

    const renderItem = (item: WhiteboardItem) => {
        const size = getItemSize(item);
        const left = item.x * canvasSize.width;
        const top = item.y * canvasSize.height;

        const handleMouseDown = (e: React.MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('textarea')) return;
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            setDragging({
                id: item.id,
                offsetX: e.clientX - rect.left,
                offsetY: e.clientY - rect.top
            });
        };

        return (
            <div
                key={item.id}
                onMouseDown={handleMouseDown}
                onClick={() => setAnchorId(item.id)}
                className={`absolute rounded-xl shadow-sm transition-all hover:shadow-md border border-black/5 ${
                    anchorId === item.id ? 'ring-2 ring-blue-400/60' : ''
                }`}
                style={{
                    left,
                    top,
                    width: size.width,
                    height: size.height,
                    background: item.type === 'shape' ? 'white' : item.color,
                    padding: item.type === 'shape' ? '10px' : '12px'
                }}
            >
                {item.type === 'shape' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        {renderItemShape(item)}
                        <textarea
                            className="w-full text-center text-sm font-semibold text-gray-700 bg-white/0 focus:outline-none resize-none"
                            value={item.text}
                            onChange={(e) =>
                                setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, text: e.target.value } : it)))
                            }
                            rows={1}
                        />
                    </div>
                ) : (
                    <textarea
                        className="w-full h-full bg-transparent resize-none text-sm font-medium text-gray-800 focus:outline-none"
                        value={item.text}
                        onChange={(e) =>
                            setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, text: e.target.value } : it)))
                        }
                    />
                )}
            </div>
        );
    };

    return (
        <div className="h-full w-full flex flex-col gap-3 py-4">
            {/* Toolbar */}
            <div className="flex items-center gap-3 px-2 sm:px-0">
                <div className="flex items-center gap-2 bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 shadow-sm">
                    <button
                        onClick={() => addItem('sticky')}
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600"
                    >
                        <StickyNote size={16} /> Sticky
                    </button>
                    <span className="text-gray-200 dark:text-gray-700">|</span>
                    <button
                        onClick={() => addItem('shape', 'rectangle')}
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600"
                    >
                        <Shapes size={16} /> Shape
                    </button>
                    <span className="text-gray-200 dark:text-gray-700">|</span>
                    <button
                        onClick={() => addItem('text')}
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600"
                    >
                        <Type size={16} /> Text
                    </button>
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 shadow-sm">
                    {COLOR_PALETTE.map((color) => (
                        <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`w-6 h-6 rounded-lg border ${selectedColor === color ? 'ring-2 ring-blue-400' : 'border-gray-200'}`}
                            style={{ background: color }}
                            title="Note color"
                        />
                    ))}
                </div>

                <button
                    onClick={() => setConnections((prev) => (prev.length && anchorId ? [...prev, { id: `conn-${Date.now()}`, from: prev[prev.length - 1].to, to: anchorId }] : prev))}
                    className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm hover:text-blue-600"
                >
                    <Link2 size={16} /> Auto-connect
                </button>

                <button
                    onClick={resetCanvas}
                    className="ml-auto inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm hover:text-blue-600"
                >
                    <RotateCcw size={16} /> Reset canvas
                </button>
            </div>

            {/* Canvas */}
            <div
                ref={containerRef}
                className="relative flex-1 rounded-2xl bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#0f1625] dark:via-[#0f172a] dark:to-[#111827] border border-gray-200 dark:border-gray-800 overflow-hidden shadow-inner"
            >
                {/* Light grid */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#e5e7eb_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,#1f2937_1px,transparent_0)] [background-size:32px_32px]" />

                <svg className="absolute inset-0 pointer-events-none" width={canvasSize.width} height={canvasSize.height}>
                    {connections.map((conn) => {
                        const from = itemCenters[conn.from];
                        const to = itemCenters[conn.to];
                        if (!from || !to) return null;
                        return (
                            <line
                                key={conn.id}
                                x1={from.x}
                                y1={from.y}
                                x2={to.x}
                                y2={to.y}
                                stroke="#60a5fa"
                                strokeWidth={2}
                                strokeLinecap="round"
                                opacity={0.8}
                            />
                        );
                    })}
                </svg>

                <div className="absolute inset-0">
                    {items.map((item) => renderItem(item))}
                </div>

                <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-black/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-500 dark:text-gray-400 shadow-sm flex items-center gap-2">
                    <Plus size={14} /> Add shapes, notes, or text. Drag to move, click to set a connector anchor.
                </div>
            </div>
        </div>
    );
};

export default WhiteboardView;
