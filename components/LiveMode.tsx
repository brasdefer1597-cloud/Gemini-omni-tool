
import React, { useState } from 'react';
import { LiveAudio } from './LiveAudio';
import { Power, Radio } from 'lucide-react';

export const LiveMode: React.FC = () => {
    const [isAudioActive, setIsAudioActive] = useState(false);

    return (
        <div className="h-full w-full flex items-center justify-center p-8">
             <div className="bg-slate-900/50 p-12 rounded-2xl border border-slate-800 shadow-2xl flex flex-col items-center gap-8 max-w-md w-full">
                <div className="text-center">
                    <h3 className="text-2xl font-mono text-white mb-2 flex items-center justify-center gap-2">
                        <Radio className={isAudioActive ? "text-red-500 animate-pulse" : "text-slate-600"} />
                        QUANTUM LINK
                    </h3>
                    <p className="text-slate-500 text-sm">Direct neural-audio interface.</p>
                </div>

                <div className="min-h-[150px] flex items-center justify-center">
                    <LiveAudio isActive={isAudioActive} onDeactivate={() => setIsAudioActive(false)} />
                </div>

                <button
                    onClick={() => setIsAudioActive(!isAudioActive)}
                    className={`px-8 py-4 rounded-xl font-mono text-sm uppercase tracking-widest font-bold transition-all flex items-center gap-3 ${
                        isAudioActive
                        ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20'
                        : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white'
                    }`}
                >
                    <Power size={18} />
                    {isAudioActive ? 'Terminate Uplink' : 'Initialize Uplink'}
                </button>
             </div>
        </div>
    );
};
