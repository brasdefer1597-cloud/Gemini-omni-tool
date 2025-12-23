
import React, { useState, useRef, useEffect } from 'react';
import { geminiService, OrchestratorResponse, ServiceMode } from '../services/geminiService';
import { Send, Cpu, Zap, Brain, Sparkles, Clock } from 'lucide-react';

// Reusing basic styles from global CSS (assumed) or inline for specific "Dialectic" flair

interface LogEntry {
    id: string;
    prompt: string;
    response: OrchestratorResponse;
    timestamp: Date;
}

export const DialecticMode: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [mode, setMode] = useState<ServiceMode>('auto');
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

    useEffect(() => {
        scrollToBottom();
    }, [logs, isProcessing]);

    const handleSend = async () => {
        if (!prompt.trim() || isProcessing) return;

        const currentPrompt = prompt;
        setPrompt('');
        setIsProcessing(true);

        try {
            const result = await geminiService.routeRequest({
                prompt: currentPrompt,
                mode: mode,
            });

            const newEntry: LogEntry = {
                id: Date.now().toString(),
                prompt: currentPrompt,
                response: result,
                timestamp: new Date(),
            };

            setLogs(prev => [...prev, newEntry]);
        } catch (e) {
            console.error("Dialectic Mode Error:", e);
            // Handle error visually if needed
        } finally {
            setIsProcessing(false);
        }
    };

    const ModeSelector = () => (
        <div className="flex space-x-2 mb-4 p-2 bg-gray-900 rounded-lg border border-gray-700">
            {(['auto', 'fast', 'elite', 'nano'] as ServiceMode[]).map(m => (
                <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
                        mode === m
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                >
                    {m === 'auto' && <Sparkles size={14} />}
                    {m === 'fast' && <Zap size={14} />}
                    {m === 'elite' && <Brain size={14} />}
                    {m === 'nano' && <Cpu size={14} />}
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
            ))}
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-black text-gray-100 p-4 font-mono">
            <header className="mb-4 border-b border-gray-800 pb-2">
                <h2 className="text-xl font-bold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    <Brain className="text-blue-400" />
                    Chalamandra Dialectic Studio
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                    Orchestrator Status: <span className="text-green-500">ONLINE</span> | Mode: <span className="uppercase text-blue-400">{mode}</span>
                </p>
            </header>

            <div className="flex-1 overflow-y-auto space-y-6 mb-4 pr-2 custom-scrollbar">
                {logs.length === 0 && (
                    <div className="text-center text-gray-600 mt-20 italic">
                        "The synthesis awaits the antithesis."<br/>
                        Select a mode and initiate the dialectic flow.
                    </div>
                )}

                {logs.map(log => (
                    <div key={log.id} className="border border-gray-800 rounded-lg p-4 bg-gray-900/50">
                        {/* User Input */}
                        <div className="mb-3 text-gray-300 border-l-2 border-blue-500 pl-3">
                            <span className="text-xs uppercase text-blue-500 font-bold tracking-wider block mb-1">Input Sequence</span>
                            {log.prompt}
                        </div>

                        {/* AI Output */}
                        <div className="text-white">
                             <span className="text-xs uppercase text-purple-500 font-bold tracking-wider block mb-1">
                                 Synthesis <span className="text-gray-600">via {log.response.usedEngine}</span>
                             </span>
                             <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                                 {log.response.content}
                             </div>
                        </div>

                        {/* Telemetry Footer */}
                        <div className="mt-3 pt-2 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1"><Clock size={12}/> {log.response.latency.toFixed(2)}ms</span>
                                <span className="flex items-center gap-1"><Cpu size={12}/> {log.response.usedEngine}</span>
                            </div>
                            <div className="flex items-center gap-1 text-green-600">
                                <Sparkles size={12} /> Cycle Complete
                            </div>
                        </div>
                    </div>
                ))}

                {isProcessing && (
                     <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/50 animate-pulse">
                        <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                        <div className="mt-2 text-xs text-blue-400 flex items-center gap-2">
                            <Cpu size={12} className="animate-spin"/> Processing through Core Orchestrator...
                        </div>
                     </div>
                )}
                <div ref={bottomRef} />
            </div>

            <div className="mt-auto">
                <ModeSelector />
                <div className="relative">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Enter your query for the Orchestrator..."
                        className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg p-3 pr-12 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none h-24"
                        disabled={isProcessing}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isProcessing || !prompt.trim()}
                        className="absolute right-3 bottom-3 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 rounded-full text-white transition-colors"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};
