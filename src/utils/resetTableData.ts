/**
 * EMERGENCY RESET UTILITY
 * Run this in browser console to clear all corrupted table data:
 * 
 * ```
 * import('/utils/resetTableData').then(m => m.resetAllTableData())
 * ```
 * 
 * Or add a button in the UI that calls this function.
 */

export function resetAllTableData(roomId?: string) {
    const keys = Object.keys(localStorage);
    const tableKeys = keys.filter(k =>
        k.includes('room-table') ||
        k.includes('board-tasks') ||
        k.includes('board-statuses') ||
        k.includes('datatable-rows')
    );

    console.log('[RESET] Found table keys:', tableKeys);

    tableKeys.forEach(key => {
        if (roomId && !key.includes(roomId)) {
            console.log('[RESET] Skipping (different room):', key);
            return;
        }
        console.log('[RESET] Clearing:', key);
        localStorage.removeItem(key);
    });

    console.log('[RESET] Reset complete. Reload the page.');
    return tableKeys;
}

// Also expose globally for easy console access
if (typeof window !== 'undefined') {
    (window as any).resetAllTableData = resetAllTableData;
}
