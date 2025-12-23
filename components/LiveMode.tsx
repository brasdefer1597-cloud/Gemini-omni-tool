
import React from 'react';
import { LiveAudio } from './LiveAudio';

export const LiveMode: React.FC = () => {
    return (
        <div className="h-full w-full flex items-center justify-center p-8 bg-slate-900/50 rounded-xl border border-slate-800">
             <div className="text-center">
                <h3 className="text-xl font-mono text-red-500 mb-4">Live Audio Interface</h3>
                <LiveAudio />
             </div>
        </div>
    );
};
