import React, { useState } from 'react';
import { Synapse } from '../services/synapse';
import { switchApiKey } from '../services/utils';
import { Shield, Lock, AlertTriangle, Terminal, CheckCircle, ChevronRight, Server, Activity, Bug, Cpu, LockKeyhole, Aperture, Hexagon, Circle, Zap, Eye, Code, Layers } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const CognitiveSecurity: React.FC = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Data Storage
    const [firewallTest, setFirewallTest] = useState('');
    const [apiMap, setApiMap] = useState({ trigger: '', emotion: '', output: '' });
    const [report, setReport] = useState<any>(null);

    const handleGenerateReport = async () => {
        setLoading(true);
        try {
            const context = {
                firewallTest,
                apiMap
            };
            const result = await Synapse.scanCognitiveSecurity(firewallTest, context);
            setReport(result);
            setStep(4);
        } catch (e) {
            console.error(e);
            alert("Security Scan Failed. Please check API Key.");
        } finally {
            setLoading(false);
        }
    };

    // VISUAL: The Neon Mandala (Salamandra)
    const Mandala = ({ state }: { state: 'chaos' | 'order' | 'loading' }) => {
        const color = state === 'chaos' ? 'text-red-500' : state === 'order' ? 'text-cyan-400' : 'text-amber-500';
        const glow = state === 'chaos' ? 'shadow-[0_0_30px_rgba(239,68,68,0.4)]' : 'shadow-[0_0_30px_rgba(34,211,238,0.4)]';

        return (
            <div className={`relative w-64 h-64 flex items-center justify-center transition-all duration-1000 ${state === 'chaos' ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
                {/* Core */}
                <div className={`absolute z-10 p-4 bg-slate-950 rounded-full border-2 ${state === 'chaos' ? 'border-red-500/50' : 'border-cyan-500/50'} ${glow}`}>
                   {state === 'chaos' ? <Bug className="w-8 h-8 text-red-500 animate-pulse" /> : <Shield className="w-8 h-8 text-cyan-400" />}
                </div>

                {/* Ring 1 - Fast Spin */}
                <div className={`absolute w-32 h-32 border border-dashed rounded-full ${color} opacity-30 ${state === 'loading' ? 'animate-spin' : 'animate-[spin_10s_linear_infinite]'}`}></div>

                {/* Ring 2 - Geometric (The Mandala) */}
                <div className={`absolute w-48 h-48 opacity-40 ${color} animate-spin-slow`}>
                    <Hexagon className="w-full h-full" strokeWidth={0.5} />
                </div>

                {/* Ring 3 - Counter Spin */}
                <div className={`absolute w-64 h-64 opacity-20 ${color} animate-spin-reverse-slow`}>
                     <Aperture className="w-full h-full" strokeWidth={0.5} />
                </div>

                {/* Glitch Overlay for Chaos */}
                {state === 'chaos' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-full h-2 bg-red-500/50 absolute top-1/3 animate-pulse"></div>
                        <div className="w-full h-1 bg-white/50 absolute bottom-1/3 animate-pulse delay-75"></div>
                    </div>
                )}
            </div>
        );
    };

    const ProgressBar = () => (
        <div className="flex justify-between mb-8 relative z-20">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-800 -z-10"></div>
            {[1, 2, 3, 4, 5].map(s => (
                <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs border transition-all duration-500 relative
                    ${s === step ? 'bg-cyan-900 border-cyan-500 text-cyan-400 scale-110 shadow-[0_0_15px_rgba(6,182,212,0.4)]' :
                      s < step ? 'bg-green-900/50 border-green-500/50 text-green-500' : 'bg-slate-900 border-slate-700 text-slate-500'}`}
                >
                    {s < step ? <CheckCircle size={14} /> : s}
                    {s === step && <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-cyan-500 uppercase tracking-widest whitespace-nowrap">Phase {s}</span>}
                </div>
            ))}
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto min-h-[700px] flex flex-col font-sans relative overflow-hidden bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl">

            {/* ATMOSPHERE: The Void & Noise */}
            <div className="absolute inset-0 pointer-events-none z-0">
                 <div className="absolute inset-0 bg-[#020617]"></div>
                 <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] bg-gradient-to-br from-purple-900/10 to-transparent rounded-full blur-[100px]" />
                 <div className="absolute bottom-[-50%] right-[-20%] w-[800px] h-[800px] bg-gradient-to-tl from-cyan-900/10 to-transparent rounded-full blur-[100px]" />
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]"></div>
            </div>

            <div className="relative z-10 p-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-4 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-900 rounded-lg border border-slate-700 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Shield className="w-8 h-8 text-slate-200 group-hover:text-cyan-400 transition-colors" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold font-mono tracking-tighter text-white">
                                COGNITIVE <span className="text-cyan-500">SECURITY</span>
                            </h2>
                            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.4em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> System Active
                            </p>
                        </div>
                    </div>
                </div>

                <ProgressBar />

                <div className="flex-1 flex flex-col items-center justify-center relative">

                    {/* STEP 1: THREAT INTEL (CHAOS / MALANDRA VISUALS) */}
                    {step === 1 && (
                        <div className="w-full max-w-3xl animate-fade-in-up text-center">
                            <div className="mb-8 relative inline-block">
                                <h3 className="text-6xl md:text-8xl font-['Rubik_Glitch'] text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-fuchsia-500 to-red-500 glitch" data-text="MENTAL MALWARE">
                                    MENTAL MALWARE
                                </h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 items-center text-left bg-slate-900/40 p-8 rounded-2xl border border-red-500/10 backdrop-blur-md relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Bug className="w-32 h-32 text-red-500" />
                                </div>

                                <div className="space-y-4 relative z-10">
                                    <h4 className="text-red-400 font-mono text-sm uppercase tracking-widest border-l-2 border-red-500 pl-3">Threat Detected</h4>
                                    <p className="text-slate-300 leading-relaxed font-light text-lg">
                                        Your mind is under a constant <strong>DDoS attack</strong> of noise, artificial urgency, and social engineering.
                                    </p>
                                    <p className="text-slate-400 font-mono text-xs">
                                        &gt; DETECTING BIAS INJECTION...<br/>
                                        &gt; ANALYZING SOCIAL VECTORS...
                                    </p>
                                </div>

                                <div className="flex flex-col gap-4 border-l border-white/5 pl-8">
                                    <p className="text-sm text-slate-400 italic">"The first step to sovereignty is admitting the breach."</p>
                                    <button
                                        onClick={() => setStep(2)}
                                        className="group w-full py-4 bg-red-950/30 border border-red-500/30 hover:bg-red-900/50 hover:border-red-400 text-red-200 font-mono text-sm uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2"
                                    >
                                        Initiate Firewall <ChevronRight className="group-hover:translate-x-1 transition-transform"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: FIREWALL TEST (INTERACTIVE MANDALA) */}
                    {step === 2 && (
                        <div className="w-full max-w-3xl animate-fade-in-up flex flex-col items-center">
                            {/* The Visual Metaphor */}
                            <div className="mb-12 relative">
                                <Mandala state={firewallTest ? 'order' : 'chaos'} />
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                                    <span className={`text-[10px] font-mono uppercase tracking-[0.3em] ${firewallTest ? 'text-cyan-500' : 'text-red-500 animate-pulse'}`}>
                                        {firewallTest ? 'REACTION LOGGED' : 'FIREWALL UNDER STRESS'}
                                    </span>
                                </div>
                            </div>

                            <div className="w-full bg-slate-900/80 border border-slate-700 p-8 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                                <div className="flex items-center gap-3 text-amber-500 mb-6">
                                    <AlertTriangle size={18} />
                                    <span className="font-mono text-xs font-bold uppercase tracking-widest">Incoming Social Engineering Packet</span>
                                </div>

                                <p className="text-xl text-white font-light mb-8 italic text-center">
                                    "Spots in the Alpha Circle are vanishing. If you don't commit in the next 58 minutes, are you even serious about your future?"
                                </p>

                                <div className="relative group">
                                    <label className="text-[10px] font-mono text-slate-500 uppercase mb-2 block">Your Visceral Response (Input Stream)</label>
                                    <input
                                        value={firewallTest}
                                        onChange={(e) => setFirewallTest(e.target.value)}
                                        className="w-full bg-slate-950 border-b-2 border-slate-700 focus:border-cyan-500 p-4 text-cyan-100 focus:outline-none transition-colors font-mono"
                                        placeholder="Type your immediate emotional reaction..."
                                        autoFocus
                                    />
                                    <div className="absolute right-4 top-1/2 translate-y-2 opacity-0 group-focus-within:opacity-100 transition-opacity">
                                        <Activity size={16} className="text-cyan-500 animate-pulse"/>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end">
                                     <button
                                        onClick={() => setStep(3)}
                                        disabled={!firewallTest}
                                        className="px-8 py-3 bg-white text-black font-bold font-mono text-xs uppercase tracking-widest rounded hover:bg-cyan-50 transition-colors disabled:opacity-50"
                                    >
                                        Process Data &gt;
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: API MAPPING (DARK IDE AESTHETIC) */}
                    {step === 3 && (
                        <div className="w-full max-w-4xl animate-fade-in-up">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-950/50 rounded border border-indigo-500/30">
                                        <Code size={18} className="text-indigo-400" />
                                    </div>
                                    <h3 className="font-mono text-lg text-indigo-200">emotions_api.config</h3>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                                </div>
                            </div>

                            <div className="bg-[#0e1117] rounded-xl border border-slate-800 shadow-2xl overflow-hidden font-mono text-sm relative">
                                {/* Line Numbers */}
                                <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-6 text-slate-600 select-none">
                                    <span>01</span><span>02</span><span>03</span><span>04</span><span>05</span><span>06</span><span>07</span><span>08</span>
                                </div>

                                <div className="pl-16 pr-6 py-6 space-y-6">
                                    <div className="text-slate-500">// Mapping the vulnerability exploit chain</div>

                                    <div className="group">
                                        <span className="text-purple-400">const</span> <span className="text-yellow-200">trigger</span> <span className="text-slate-400">=</span> <span className="text-green-400">"</span>
                                        <input
                                            value={apiMap.trigger}
                                            onChange={(e) => setApiMap({...apiMap, trigger: e.target.value})}
                                            className="bg-transparent border-b border-slate-700 focus:border-yellow-500 text-yellow-100 outline-none min-w-[200px] px-1"
                                            placeholder="Criticism from boss..."
                                        />
                                        <span className="text-green-400">";</span>
                                    </div>

                                    <div className="group">
                                        <span className="text-purple-400">let</span> <span className="text-cyan-300">internal_state</span> <span className="text-slate-400">=</span> <span className="text-green-400">"</span>
                                        <input
                                            value={apiMap.emotion}
                                            onChange={(e) => setApiMap({...apiMap, emotion: e.target.value})}
                                            className="bg-transparent border-b border-slate-700 focus:border-cyan-500 text-cyan-100 outline-none min-w-[200px] px-1"
                                            placeholder="Defensive rage..."
                                        />
                                        <span className="text-green-400">";</span>
                                    </div>

                                    <div className="group">
                                        <span className="text-red-400">return</span> <span className="text-blue-300">execute_action</span>(<span className="text-green-400">"</span>
                                        <input
                                            value={apiMap.output}
                                            onChange={(e) => setApiMap({...apiMap, output: e.target.value})}
                                            className="bg-transparent border-b border-slate-700 focus:border-red-500 text-red-100 outline-none min-w-[200px] px-1"
                                            placeholder="Sent angry email..."
                                        />
                                        <span className="text-green-400">"</span>);
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-center">
                                 <button
                                    onClick={handleGenerateReport}
                                    disabled={!apiMap.trigger || !apiMap.emotion || loading}
                                    className="px-12 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold tracking-widest rounded shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all flex items-center gap-3"
                                >
                                    {loading ? <Activity className="animate-spin" /> : <Terminal size={18} />}
                                    {loading ? 'COMPILING DIAGNOSTIC...' : 'RUN VULNERABILITY SCAN'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: VULNERABILITY REPORT (CHAOS VS ORDER) */}
                    {step === 4 && report && (
                        <div className="w-full max-w-5xl animate-fade-in-up grid md:grid-cols-2 gap-0 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">

                            {/* Left: The Chaos (Problem) */}
                            <div className="bg-[#0a0a0a] p-10 border-r border-slate-800 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-transparent"></div>
                                <div className="absolute -right-12 -bottom-12 opacity-10 rotate-12 transition-transform group-hover:scale-110 duration-700">
                                    <Bug className="w-64 h-64 text-red-600" />
                                </div>

                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/30 border border-red-500/30 rounded-full text-red-400 text-[10px] font-mono uppercase tracking-widest mb-6">
                                        <AlertTriangle size={12} /> {report.vulnerabilityLevel} Vulnerability Detected
                                    </div>

                                    <h3 className="text-4xl font-['Rubik_Glitch'] text-white mb-6 leading-tight">
                                        {report.detectedBias}
                                    </h3>

                                    <div className="prose prose-invert prose-sm font-light text-slate-400 leading-relaxed border-l border-slate-800 pl-4">
                                        <ReactMarkdown>{report.diagnosis}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>

                            {/* Right: The Order (Solution) */}
                            <div className="bg-slate-900/50 p-10 relative overflow-hidden group backdrop-blur-sm">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent to-cyan-500"></div>
                                <div className="absolute -left-12 -top-12 opacity-10 rotate-[-12deg] transition-transform group-hover:scale-110 duration-700">
                                    <Aperture className="w-64 h-64 text-cyan-500" />
                                </div>

                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/30 border border-cyan-500/30 rounded-full text-cyan-400 text-[10px] font-mono uppercase tracking-widest mb-6">
                                            <Layers size={12} /> System Patch Available
                                        </div>

                                        <h3 className="text-2xl font-mono font-bold text-white mb-6 flex items-center gap-3">
                                            <span className="text-cyan-500">///</span> SALAMANDRA PROTOCOL
                                        </h3>

                                        <div className="bg-cyan-950/20 border border-cyan-500/20 p-6 rounded-xl">
                                            <p className="text-cyan-100 font-mono text-sm leading-relaxed">
                                                {report.patch}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex justify-end">
                                        <button
                                            onClick={() => setStep(5)}
                                            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-lg transition-all flex items-center gap-2 text-xs uppercase tracking-widest"
                                        >
                                            Install Security Update <LockKeyhole size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 5: SOVEREIGNTY (FRESA AESTHETIC) */}
                    {step === 5 && (
                        <div className="w-full max-w-3xl animate-fade-in-up relative">
                             {/* Mandala Background */}
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
                                <Mandala state="loading" />
                             </div>

                            <div className="bg-gradient-to-b from-amber-950/40 to-slate-950 border border-amber-500/30 p-12 rounded-3xl backdrop-blur-xl text-center relative overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.1)]">

                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>

                                <div className="mb-8 inline-flex p-5 bg-amber-950/30 rounded-full border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.2)] animate-pulse">
                                    <Cpu className="w-16 h-16 text-amber-500" strokeWidth={1} />
                                </div>

                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight font-mono">
                                    COGNITIVE SOVEREIGNTY
                                </h2>

                                <p className="text-slate-300 max-w-lg mx-auto mb-10 leading-relaxed font-light text-lg">
                                    The patch is temporary. The architecture must be permanent.
                                    <br/>
                                    <span className="text-amber-400 font-bold">The Mastermind Protocol</span> is the operating system for those who cannot afford the luxury of error.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                    <button className="px-10 py-5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm tracking-widest uppercase rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                                        <Lock size={16} /> Unlock Protocol
                                    </button>
                                    <button className="px-10 py-5 bg-transparent border border-slate-600 hover:border-amber-200 text-slate-300 hover:text-white font-bold text-sm tracking-widest uppercase rounded-xl transition-all">
                                        View Case Studies
                                    </button>
                                </div>

                                <div className="mt-12 flex items-center justify-center gap-2 opacity-50">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.3em]">Ethical Scarcity: 3 Seats Remaining</p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
