/**
 * RUN THIS IN BROWSER CONSOLE TO RESET PROCUREMENT TABLE
 * 
 * Copy and paste this into your browser's developer console (F12 → Console tab):
 */

// Clear corrupted Procurement table data
localStorage.removeItem('room-table-columns-v4-procurement-main-table');
localStorage.removeItem('board-tasks-procurement-main');
localStorage.removeItem('procurement-board-data');

// Reload the page
console.log('✅ Procurement table reset complete. Reloading page...');
setTimeout(() => window.location.reload(), 500);
