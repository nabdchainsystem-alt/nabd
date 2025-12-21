import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock, Flag, PauseCircle, PlayCircle, Settings2 } from 'lucide-react';

interface AutomationRule {
    id: string;
    trigger: string;
    action: string;
    detail?: string;
    active: boolean;
    target?: string;
}

const TRIGGERS = [
    { id: 'status_change', label: 'When status changes' },
    { id: 'overdue', label: 'When item is overdue' },
    { id: 'created', label: 'When item is created' }
];

const ACTIONS = [
    { id: 'set_due', label: 'Set due date' },
    { id: 'flag', label: 'Flag the item' },
    { id: 'assign', label: 'Assign owner' },
    { id: 'notify', label: 'Send reminder' }
];

const AutomationRulesView: React.FC<{ boardId: string }> = ({ boardId }) => {
    const storageKey = `automation-rules-${boardId}`;
    const [rules, setRules] = useState<AutomationRule[]>(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) return JSON.parse(saved);
        } catch {
            // ignore
        }
        return [
            { id: 'rule-1', trigger: 'status_change', action: 'set_due', detail: '+2 days after set to In Progress', active: true },
            { id: 'rule-2', trigger: 'overdue', action: 'flag', detail: 'Add red flag and ping owner', active: true }
        ];
    });

    const [draft, setDraft] = useState<{ trigger: string; action: string; detail: string }>({
        trigger: 'status_change',
        action: 'set_due',
        detail: 'Auto action'
    });

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(rules));
    }, [rules, storageKey]);

    const addRule = () => {
        if (!draft.detail.trim()) return;
        const newRule: AutomationRule = {
            id: `rule-${Date.now()}`,
            trigger: draft.trigger,
            action: draft.action,
            detail: draft.detail,
            active: true
        };
        setRules((prev) => [newRule, ...prev]);
        setDraft({ trigger: 'status_change', action: 'set_due', detail: '' });
    };

    const activeCount = useMemo(() => rules.filter((r) => r.active).length, [rules]);

    return (
        <div className="h-full w-full flex flex-col gap-4 py-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800">
                        <Settings2 size={18} />
                    </div>
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-semibold">Automation rules</p>
                        <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">Simple trigger → action. No scripts. No chains.</p>
                    </div>
                </div>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-200 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 shadow-sm">
                    {activeCount} active / {rules.length} total
                </div>
            </div>

            {/* Builder */}
            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <div className="flex flex-col">
                        <label className="text-xs font-semibold text-slate-500 mb-1">Trigger</label>
                        <select
                            value={draft.trigger}
                            onChange={(e) => setDraft((d) => ({ ...d, trigger: e.target.value }))}
                            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] text-sm px-3 py-2 focus:outline-none"
                        >
                            {TRIGGERS.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs font-semibold text-slate-500 mb-1">Action</label>
                        <select
                            value={draft.action}
                            onChange={(e) => setDraft((d) => ({ ...d, action: e.target.value }))}
                            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] text-sm px-3 py-2 focus:outline-none"
                        >
                            {ACTIONS.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col md:col-span-2">
                        <label className="text-xs font-semibold text-slate-500 mb-1">Lightweight detail</label>
                        <input
                            value={draft.detail}
                            onChange={(e) => setDraft((d) => ({ ...d, detail: e.target.value }))}
                            placeholder="Example: set due date to today+2, flag high-risk, assign ops"
                            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] text-sm px-3 py-2 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between mt-3 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={14} className="text-amber-500" />
                        <span>Each rule is a single trigger and action. No nested conditions.</span>
                    </div>
                    <button
                        onClick={addRule}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold shadow-sm hover:bg-slate-800"
                    >
                        <PlayCircle size={16} /> Add rule
                    </button>
                </div>
            </div>

            {/* Rules list */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {rules.map((rule) => (
                    <div key={rule.id} className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${rule.active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                                <span className="text-xs uppercase tracking-[0.18em] text-slate-500 font-semibold">{rule.trigger}</span>
                            </div>
                            <button
                                onClick={() => setRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, active: !r.active } : r)))}
                                className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1"
                            >
                                {rule.active ? <PauseCircle size={14} /> : <PlayCircle size={14} />}
                                {rule.active ? 'Pause' : 'Resume'}
                            </button>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-100">
                            <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">{rule.action}</span>
                            <span className="text-slate-400">→</span>
                            <span className="font-medium">{rule.detail}</span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-1">
                                <Clock size={12} /> Always on
                            </div>
                            {rule.action === 'flag' && (
                                <div className="flex items-center gap-1">
                                    <Flag size={12} /> Flag overdue items
                                </div>
                            )}
                            {rule.action === 'set_due' && (
                                <div className="flex items-center gap-1">
                                    <CheckCircle2 size={12} /> Auto due dates
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {rules.length === 0 && <div className="text-sm text-gray-500">No rules yet. Add a single trigger and action to get started.</div>}
        </div>
    );
};

export default AutomationRulesView;
