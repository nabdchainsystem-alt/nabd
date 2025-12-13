import React from 'react';

export const ConfirmModal: React.FC<any> = ({ isOpen, onClose, onConfirm, onCancel, title, message }) => {
    if (!isOpen) return null;

    const handleCancel = onClose || onCancel;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleCancel}>
            <div className="bg-white p-6 rounded-lg shadow-xl w-96" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold mb-4">{title || 'Confirm Action'}</h3>
                <p className="mb-6">{message || 'Are you sure?'}</p>
                <div className="flex justify-end gap-3">
                    <button onClick={handleCancel} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Confirm</button>
                </div>
            </div>
        </div>
    );
};
