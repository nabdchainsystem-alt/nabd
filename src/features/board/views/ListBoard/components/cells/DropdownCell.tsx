import React from 'react';
export const DropdownCell: React.FC<any> = ({ value, onChange, options }) => (
    <select value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent p-1">
        <option value="">-</option>
        {options?.map((o: any) => <option key={o.id} value={o.id}>{o.label}</option>)}
    </select>
);
