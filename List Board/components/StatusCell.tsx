import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Status } from '../types';

interface StatusCellProps {
  status: Status;
  onClick: (newStatus: Status) => void;
}

const STATUS_OPTIONS = [
  { label: Status.WORKING_ON_IT, color: 'bg-[#fdab3d]', hover: 'hover:bg-[#e89c36]' },
  { label: Status.STUCK, color: 'bg-[#e2445c]', hover: 'hover:bg-[#cf3d53]' },
  { label: Status.DONE, color: 'bg-[#00c875]', hover: 'hover:bg-[#00b268]' },
  { label: 'Empty', value: Status.EMPTY, color: 'bg-[#c4c4c4]', hover: 'hover:bg-[#b0b0b0]' },
];

const getStatusColor = (status: Status) => {
  const option = STATUS_OPTIONS.find(o => (o.value || o.label) === status);
  return option ? option.color : 'bg-[#c4c4c4]';
};

export const StatusCell: React.FC<StatusCellProps> = ({ status, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const cellRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const isSet = status !== Status.EMPTY;

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag start if any
    if (cellRef.current) {
      const rect = cellRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
      setIsOpen(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
        if(isOpen) setIsOpen(false); // Close on scroll to avoid misalignment
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [isOpen]);

  return (
    <>
      <div 
        ref={cellRef}
        onClick={handleOpen}
        className={`w-full h-full flex items-center justify-center px-4 text-white text-sm font-medium cursor-pointer transition-colors relative group ${isSet ? getStatusColor(status) : 'bg-[#c4c4c4]'}`}
      >
        {isSet ? status : <span className="opacity-0 group-hover:opacity-100">+</span>}
        
        {/* Fold effect */}
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[8px] border-r-[8px] border-t-white/20 border-r-transparent"></div>
      </div>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-start justify-start" onClick={() => setIsOpen(false)}>
          <div 
            className="fixed z-50 bg-white shadow-xl rounded-lg p-2 flex flex-col gap-2 w-48 border border-gray-200 animate-in fade-in zoom-in-95 duration-100"
            style={{ 
                top: coords.top + 4, 
                left: coords.left + (coords.width / 2) - 96 // Center align
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.label}
                onClick={() => {
                  onClick((option.value !== undefined ? option.value : option.label) as Status);
                  setIsOpen(false);
                }}
                className={`w-full py-2 px-4 text-white font-medium rounded ${option.color} ${option.hover} transition-colors text-center shadow-sm`}
              >
                {option.label === 'Empty' ? 'Clear Status' : option.label}
              </button>
            ))}
            <div className="h-px bg-gray-200 my-1"></div>
            <button className="flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 py-2 rounded text-sm">
                <span>Edit Labels</span>
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};