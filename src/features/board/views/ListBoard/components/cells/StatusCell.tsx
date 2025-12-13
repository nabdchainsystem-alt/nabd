import React from 'react';
export const StatusCell: React.FC<any> = ({ status, onChange }) => (
    <div onClick={() => onChange('Done')} className="bg-green-400 p-1 text-xs text-center cursor-pointer">{status || 'New'}</div>
);
