import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, CalendarDays } from 'lucide-react';

interface DateCellProps {
  date: string | null;
  onChange: (date: string | null) => void;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const DateCell: React.FC<DateCellProps> = ({ date, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const cellRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  
  // Date picker state
  const today = new Date();
  const initialDate = date ? new Date(date) : today;
  const [viewDate, setViewDate] = useState(initialDate); // Controls the displayed month

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cellRef.current) {
      const rect = cellRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
      setIsOpen(true);
      setViewDate(date ? new Date(date) : new Date());
    }
  };

  const changeMonth = (delta: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setViewDate(newDate);
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    // Format YYYY-MM-DD
    const dateString = selectedDate.toISOString().split('T')[0];
    onChange(dateString);
    setIsOpen(false);
  };

  // Calendar generation logic
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const isToday = (day: number) => {
    return day === today.getDate() && 
           viewDate.getMonth() === today.getMonth() && 
           viewDate.getFullYear() === today.getFullYear();
  };

  const isSelected = (day: number) => {
    if (!date) return false;
    const d = new Date(date);
    return day === d.getDate() && 
           viewDate.getMonth() === d.getMonth() && 
           viewDate.getFullYear() === d.getFullYear();
  };

  useEffect(() => {
    const handleScroll = () => {
        if(isOpen) setIsOpen(false);
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [isOpen]);

  return (
    <>
      <div 
        ref={cellRef}
        onClick={handleOpen}
        className="w-full h-full flex items-center justify-center px-3 text-xs text-gray-500 hover:bg-gray-100 cursor-pointer group relative"
      >
        {date ? (
            <span className="flex items-center gap-2 justify-center w-full">
                <CalendarIcon className="w-3 h-3 text-gray-400" />
                {date}
            </span>
        ) : (
            <span className="text-gray-300 group-hover:text-gray-400 flex items-center gap-2 justify-center">
                <CalendarIcon className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                Set Date
            </span>
        )}
        
        {date && (
            <div 
                className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-full"
                onClick={(e) => {
                    e.stopPropagation();
                    onChange(null);
                }}
            >
                <X className="w-3 h-3 text-gray-500" />
            </div>
        )}
      </div>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-50" onClick={() => setIsOpen(false)}>
          <div 
            className="fixed z-50 bg-white shadow-2xl rounded-xl w-[320px] border border-gray-100 animate-in fade-in zoom-in-95 duration-100 font-sans overflow-hidden"
            style={{ 
                top: coords.top + 8, 
                left: Math.min(coords.left - 100, window.innerWidth - 340) 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Inputs */}
            <div className="flex bg-gray-50 border-b border-gray-200 p-2 gap-2">
                <div className="flex-1 bg-gray-100 rounded border border-transparent px-2 py-1.5 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Start date</span>
                </div>
                <div className="flex-1 bg-white rounded border border-blue-500 shadow-sm px-2 py-1.5 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-700">{date || 'Due date'}</span>
                    <span className="ml-auto w-0.5 h-4 bg-gray-800 animate-pulse"></span>
                </div>
            </div>

            <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-gray-800 text-base">
                        {MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
                    </span>
                    <div className="flex items-center gap-2">
                        <button className="text-sm text-gray-500 hover:bg-gray-100 px-2 py-1 rounded">Today</button>
                        <div className="flex gap-1">
                            <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded text-gray-500">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded text-gray-500">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Days Header */}
                <div className="grid grid-cols-7 mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                        <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, idx) => (
                        <div key={idx} className="aspect-square">
                            {day && (
                                <button
                                    onClick={() => handleDateSelect(day)}
                                    className={`w-full h-full rounded-full flex items-center justify-center text-sm transition-colors
                                        ${isSelected(day) ? 'bg-[#e2445c] text-white' : ''}
                                        ${!isSelected(day) && isToday(day) ? 'text-blue-600 font-bold' : ''}
                                        ${!isSelected(day) && !isToday(day) ? 'text-gray-700 hover:bg-gray-100' : ''}
                                    `}
                                >
                                    {day}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="px-4 pb-3 pt-0">
                <button className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded text-sm text-gray-600">
                    <span>Set Recurring</span>
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};