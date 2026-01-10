import React from 'react';
import ProductivitySidebar from '../../components/common/ProductivitySidebar';

const TalkPage: React.FC = () => {
    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark font-sans overflow-hidden">
            {/* Page Header */}
            {/* ... (keep header) ... */}
            <header className="h-16 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex items-center justify-between px-6 shrink-0 z-10 transition-colors">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold flex items-center">
                        <span className="text-text-secondary-light dark:text-text-secondary-dark mr-2">#</span>
                        project-phoenix-launch
                    </h1>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Active Sprint</span>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex -space-x-2 overflow-hidden">
                        <img alt="User Avatar 1" className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDu5VcNDcvkzIuG6142kSNeGjA_jGkf9TtIxF52Zu-47EHGGurpOwMGbwWrtvsGv-iLrs_sv8eShiXOvU3aA1NC5GEk6YsweE80Gg-TXNNB280Zu3Oezw-Oxhg_Ikl_icuLyPpIJmcVPTy4It6hDzCRYAbmMzSJwrTW0sT3n0M0SQ2OG2VLMjeyWMSoM985_gNUHYQNaTRngcbHtuHyFseIhXICWZJTkaQ5x2zNw3cw-8serHHSzGXHN078doA5_6ajLiC1C8vHmxA" />
                        <img alt="User Avatar 2" className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlitVHp3TySxrCbV2a8_OeiiyMGJw3M1Hj03ZENcMFrlFBP80jArbNUvEDwMlHEQq3P15A6E35FF-rsgYuDUeNbCzZZVx1GJBQkqlwR3vBo_SHJcHiayqhY_Om7UpKg6NSiQGWAKN__BuFV8CuZKksgTc8tcSg8YppN-vNnS5JLQQLO0xwmD3QM9QTXkaKlaIaVQYWc5iqq7oXBTctAjpnF-YlS3ZKbLHYVLpOAL03Zs6JwstoEU7fGYfCqlCwMGFsMKgXVzE4qQs" />
                        <img alt="User Avatar 3" className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdD6dyyVCfhJ1R_9Abp3zhS4FGlQGpQR6DgkM4cPs4reugaT5PV9dL1U7Ha7m7P2wjh6A6GCV_gozFXAAzv5tIUqOFaurDQOKlbMwviEkBFP3ybdvPoDNMIMrwFiM8VO11SAyOEm7G_TWYe-phwYfbhUKlb1jRaZ9_sWjPguDWVnabi3Q4TPmNNEP_mPIji336NA63xxq-zI8ROmStaOHGJVVlRsNAuKrBONrUbcbTgofomGHJbadAS_TCiX6y75KITHZDn4p541Q" />
                        <div className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-300">+5</div>
                    </div>
                    <button className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors">
                        <span className="material-icons">info_outline</span>
                    </button>
                    <button className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors">
                        <span className="material-icons">settings</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* Messages Area */}
                {/* ... (keep messages area) ... */}
                <div className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark relative">
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 talk-custom-scrollbar">
                        <div className="flex items-center justify-center">
                            <div className="bg-gray-200 dark:bg-gray-800 px-4 py-1 rounded-full text-xs text-text-secondary-light dark:text-text-secondary-dark font-medium">
                                Today, October 24th
                            </div>
                        </div>

                        {/* Message 1 */}
                        <div className="flex group">
                            <div className="flex-shrink-0 mr-4">
                                <img alt="Sarah Chen" className="h-10 w-10 rounded-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsElDcpXf_ntYbIIdumOzXPPLUM1WBRPi86gir20F6fSLujqrLHLMj7eS3IWnB1BQeXt36IV1lEdKeB1KKQJ15hsxissruEuR5Pxoxhwbibkj-owwy9OHk8-lwhX9oDNDRkyXO_uenLUPVGEWSYCEY4upUSArJv889n16BPARWxxvGvSGkjsKb6G9cFvpWBDTMJF-zq1nUe2zD80vhr_55RXuBSGwpuy9m-7lHdGikVaHHHrrRx6zSJDoqltaFDgOxKEDgpyS1Z8" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline mb-1">
                                    <span className="font-bold text-sm mr-2 text-text-primary-light dark:text-text-primary-dark">Sarah Chen</span>
                                    <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">09:42 AM</span>
                                </div>
                                <div className="text-text-primary-light dark:text-text-primary-dark text-sm leading-relaxed">
                                    <p>Good morning team! ☀️ I've just updated the wireframes for the new dashboard component. The main focus was simplifying the navigation structure based on the feedback from yesterday's user testing session.</p>
                                    <div className="mt-3 flex items-center p-3 border border-border-light dark:border-border-dark rounded-lg bg-surface-light dark:bg-surface-dark max-w-md hover:border-primary transition-colors cursor-pointer group/file">
                                        <div className="bg-red-100 dark:bg-red-900 p-2 rounded mr-3">
                                            <span className="material-icons text-red-600 dark:text-red-400 text-xl">picture_as_pdf</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">Dashboard_Wireframes_v2.pdf</p>
                                            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">2.4 MB</p>
                                        </div>
                                        <span className="material-icons text-gray-400 group-hover/file:text-primary">download</span>
                                    </div>
                                </div>
                                <div className="mt-2 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-text-secondary-light dark:text-text-secondary-dark transition-colors" title="Add reaction">
                                        <span className="material-icons text-lg">add_reaction</span>
                                    </button>
                                    <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-text-secondary-light dark:text-text-secondary-dark transition-colors" title="Reply in thread">
                                        <span className="material-icons text-lg">chat_bubble_outline</span>
                                    </button>
                                    <button className="text-primary text-xs font-semibold px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                                        Reply
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Message 2 */}
                        <div className="flex group">
                            <div className="flex-shrink-0 mr-4">
                                <img alt="Marcus Rodriguez" className="h-10 w-10 rounded-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCD51pVuSNZX5sNNqYD6N3y5WE7uu1eI-KPArCWQ2OQmfrbX5Sge6sqGg9UIkg8hxU2EhOtQn35fhokXlZqafTYugmCdcwP_Ko8PF_azdqggVfKvp5EvesnBTMk0aLFw0uJx1lFW7Yx_EaIDvIW2poNUxpTdsYfppfNxIkAC50y0Iyd3KG1SB1rYyKzuiVBMhfMcAFzyuEQGkJMeSxX8635ABWXRPz22KR6y5P7j_yLc1sqNzAwK0f6BkWdloveLcSf6WdQEcK9a7Q" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline mb-1">
                                    <span className="font-bold text-sm mr-2 text-text-primary-light dark:text-text-primary-dark">Marcus Rodriguez</span>
                                    <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">09:45 AM</span>
                                </div>
                                <div className="text-text-primary-light dark:text-text-primary-dark text-sm leading-relaxed">
                                    <p>Thanks Sarah! I'm reviewing them now. <span className="text-primary cursor-pointer hover:underline">@David</span> could you double check if the new layout affects the existing API endpoints for the user profile widget?</p>
                                </div>
                                <div className="mt-2 flex space-x-2">
                                    <button className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-xs font-medium text-primary hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                                        👍 2
                                    </button>
                                </div>
                                <div className="mt-2 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-text-secondary-light dark:text-text-secondary-dark transition-colors" title="Add reaction">
                                        <span className="material-icons text-lg">add_reaction</span>
                                    </button>
                                    <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-text-secondary-light dark:text-text-secondary-dark transition-colors" title="Reply in thread">
                                        <span className="material-icons text-lg">chat_bubble_outline</span>
                                    </button>
                                    <button className="text-primary text-xs font-semibold px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                                        Reply
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Message 3 */}
                        <div className="flex group">
                            <div className="flex-shrink-0 mr-4">
                                <img alt="David Kim" className="h-10 w-10 rounded-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7YAtbttcBCtIcyruc5v7nrHw-UxoMjzo5HcdwqUr5QI-KoDYKIrHjlT6Ykdff9oTQ09U0PDVsV3ngINmng58NnMFQepT2XFnzYEo_tnw_J-pkCvVnJpYHrx_674y31Acx9JUYBeqH-hMEbJoyVKc7242BHAc1byXm062S9aCQp2z125pRXH9p5L9SinzAe_0wNAbKzkgIcH7icFzoHQnBxa5dOuDCwvoMECv4qpkhUX84PY0s74B2Cye7wZ6BwSGobuD6mSA6q1I" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline mb-1">
                                    <span className="font-bold text-sm mr-2 text-text-primary-light dark:text-text-primary-dark">David Kim</span>
                                    <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">09:58 AM</span>
                                </div>
                                <div className="text-text-primary-light dark:text-text-primary-dark text-sm leading-relaxed">
                                    <p>On it. Taking a quick look at the docs.</p>
                                    <p className="mt-2">It looks like we might need to add a `preferences` object to the `/user/me` endpoint response to support the customizable widgets shown on page 3. I'll add a ticket for the backend team.</p>
                                </div>
                                <div className="mt-2 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-text-secondary-light dark:text-text-secondary-dark transition-colors" title="Add reaction">
                                        <span className="material-icons text-lg">add_reaction</span>
                                    </button>
                                    <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-text-secondary-light dark:text-text-secondary-dark transition-colors" title="Reply in thread">
                                        <span className="material-icons text-lg">chat_bubble_outline</span>
                                    </button>
                                    <button className="text-primary text-xs font-semibold px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                                        Reply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-6 pt-2 bg-background-light dark:bg-background-dark">
                        <div className="border border-border-light dark:border-border-dark rounded-xl bg-surface-light dark:bg-surface-dark shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
                            <div className="flex items-center px-2 py-1.5 border-b border-border-light dark:border-border-dark space-x-1">
                                <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-text-secondary-light dark:text-text-secondary-dark">
                                    <span className="material-icons text-lg">format_bold</span>
                                </button>
                                <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-text-secondary-light dark:text-text-secondary-dark">
                                    <span className="material-icons text-lg">format_italic</span>
                                </button>
                                <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-text-secondary-light dark:text-text-secondary-dark">
                                    <span className="material-icons text-lg">strikethrough_s</span>
                                </button>
                                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                                <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-text-secondary-light dark:text-text-secondary-dark">
                                    <span className="material-icons text-lg">link</span>
                                </button>
                                <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-text-secondary-light dark:text-text-secondary-dark">
                                    <span className="material-icons text-lg">list</span>
                                </button>
                            </div>
                            <textarea
                                className="w-full bg-transparent p-3 text-sm max-h-48 focus:ring-0 border-0 resize-none text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light dark:placeholder-text-secondary-dark"
                                placeholder="Message #project-phoenix-launch"
                                rows={3}
                            ></textarea>
                            <div className="flex items-center justify-between px-3 py-2">
                                <div className="flex items-center space-x-2">
                                    <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-text-secondary-light dark:text-text-secondary-dark">
                                        <span className="material-icons text-xl">add_circle_outline</span>
                                    </button>
                                    <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-text-secondary-light dark:text-text-secondary-dark">
                                        <span className="material-icons text-xl">emoji_emotions</span>
                                    </button>
                                    <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-text-secondary-light dark:text-text-secondary-dark">
                                        <span className="material-icons text-xl">alternate_email</span>
                                    </button>
                                </div>
                                <button className="bg-primary hover:bg-primary-dark text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center">
                                    Send
                                    <span className="material-icons text-sm ml-1">send</span>
                                </button>
                            </div>
                        </div>
                        <div className="text-center mt-2">
                            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                <span className="font-bold">Pro Tip:</span> Type <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-xs font-mono">/task</code> to create a new task directly from chat.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar (Productivity) */}
                <ProductivitySidebar />
            </main>

            <style>{`
                .talk-custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .talk-custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .talk-custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #D1D5DB;
                    border-radius: 20px;
                }
                .dark .talk-custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #4B5563;
                }
            `}</style>
        </div>
    );
};

export default TalkPage;
