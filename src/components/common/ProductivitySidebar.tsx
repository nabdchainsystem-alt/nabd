import React from 'react';

const ProductivitySidebar: React.FC = () => {
    return (
        <>
            <aside className="w-80 bg-surface-light dark:bg-surface-dark border-l border-border-light dark:border-border-dark flex flex-col shrink-0 transition-colors">
                {/* Tasks Section */}
                <div className="flex-1 flex flex-col min-h-0 border-b border-border-light dark:border-border-dark">
                    <div className="p-4 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30">
                        <h3 className="font-semibold text-sm uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark flex items-center">
                            <span className="material-icons text-base mr-2">check_circle_outline</span>
                            Tasks
                        </h3>
                        <button className="text-primary hover:text-primary-dark">
                            <span className="material-icons text-lg">add</span>
                        </button>
                    </div>
                    <div className="overflow-y-auto p-4 space-y-3 productivity-sidebar-scrollbar">
                        <div className="flex items-start group">
                            <input className="mt-1 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700" type="checkbox" />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark group-hover:text-primary transition-colors cursor-pointer">Update API Docs</p>
                                <div className="flex items-center mt-1 space-x-2">
                                    <span className="text-xs text-red-500 font-medium">High Priority</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Due Today</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start group">
                            <input className="mt-1 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700" type="checkbox" />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark group-hover:text-primary transition-colors cursor-pointer">Review Wireframes</p>
                                <div className="flex items-center mt-1 space-x-2">
                                    <span className="text-xs text-yellow-600 dark:text-yellow-500 font-medium">Medium</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <img alt="Assignee" className="w-4 h-4 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqF-PBAU-1UHbJZCdSLtmk7IeKH8TrQyTECaGtbiEdb4EPVrk21-3oABSnd_uVK61jt7Vqvv0wW5wmpmKUIudT57tE1XKwZtXjFAsiG2rd3SsucJICKCIkTPBrGj6aEFS7RJbigzaze1kq_u1lgLusp0mouHvkQZV02aLnvouRLaklvJSYrlNkW-FLn7SsaRsncLfgv9eIlfaLMAzqW0FoBsaJ3ElufMcuN8Fjm6e_yyXuIhl3C2AsP7a5S6e0xo0-ZwG2CyXzC7w" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reminders Section */}
                <div className="flex-1 flex flex-col min-h-0 border-b border-border-light dark:border-border-dark">
                    <div className="p-4 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30">
                        <h3 className="font-semibold text-sm uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark flex items-center">
                            <span className="material-icons text-base mr-2">alarm</span>
                            Reminders
                        </h3>
                        <button className="text-primary hover:text-primary-dark">
                            <span className="material-icons text-lg">add</span>
                        </button>
                    </div>
                    <div className="overflow-y-auto p-4 space-y-4 productivity-sidebar-scrollbar">
                        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold text-yellow-700 dark:text-yellow-500 uppercase">15 Mins</span>
                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                    <span className="material-icons text-sm">close</span>
                                </button>
                            </div>
                            <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">Weekly Sync Meeting</p>
                            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Zoom Link in Calendar</p>
                        </div>
                        <div className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 rounded -mx-2 transition-colors">
                            <div>
                                <p className="text-sm text-text-primary-light dark:text-text-primary-dark">Follow up with QA</p>
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Tomorrow, 10:00 AM</p>
                            </div>
                            <span className="material-icons text-gray-400 group-hover:text-primary text-lg">chevron_right</span>
                        </div>
                    </div>
                </div>

                {/* Mentions & Files Section */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="p-4 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30">
                        <h3 className="font-semibold text-sm uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark flex items-center">
                            <span className="material-icons text-base mr-2">folder_open</span>
                            Mentions &amp; Files
                        </h3>
                        <button className="text-primary hover:text-primary-dark text-xs font-medium">View All</button>
                    </div>
                    <div className="overflow-y-auto p-4 space-y-3 productivity-sidebar-scrollbar">
                        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
                            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded flex items-center justify-center h-10 w-10">
                                <span className="material-icons text-primary text-lg">description</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark truncate">Q4_Roadmap_Final.docx</p>
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Shared by Alice • 2h ago</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
                            <div className="flex-shrink-0 mt-0.5">
                                <div className="bg-primary/10 rounded-full p-1">
                                    <span className="material-icons text-primary text-sm">alternate_email</span>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-text-primary-light dark:text-text-primary-dark leading-snug">
                                    <span className="font-medium">Mike:</span> "@David can we deploy this?"
                                </p>
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">in #dev-ops • 4h ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
            <style>{`
                .productivity-sidebar-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .productivity-sidebar-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .productivity-sidebar-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #D1D5DB;
                    border-radius: 20px;
                }
                .dark .productivity-sidebar-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #4B5563;
                }
            `}</style>
        </>
    );
};

export default ProductivitySidebar;
