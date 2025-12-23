
import React from 'react';
import { PenTool } from 'lucide-react';

export const ToolsPanel: React.FC = () => {
    return (
        <div className="h-[600px] w-full flex flex-col items-center justify-center p-8 bg-slate-900/50 rounded-xl border border-slate-800 text-slate-400">
            <PenTool size={48} className="mb-4 text-purple-500" />
            <h2 className="text-2xl font-mono mb-2">Tools Panel</h2>
            <p className="font-mono text-sm">Advanced configuration and utilities are under construction.</p>
        </div>
    );
};
