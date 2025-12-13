import React from 'react';
export const PriorityCell: React.FC<any> = ({ priority, onChange }) => (
    <div onClick={() => onChange('High')} className="bg-red-400 p-1 text-xs text-center cursor-pointer">{priority || 'Normal'}</div>
);
