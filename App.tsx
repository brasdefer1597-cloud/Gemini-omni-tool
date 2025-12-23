
import React, { useState } from 'react';
import { DialecticMode } from './components/DialecticMode';
import { OmniChat } from './components/OmniChat';
import { ToolsPanel } from './components/ToolsPanel';
import { CreativeStudio } from './components/CreativeStudio';
import { CognitiveSecurity } from './components/CognitiveSecurity';
import { LiveMode } from './components/LiveMode';
import { AppMode } from './types';
import { switchApiKey } from './services/geminiService';
import { BrainCircuit, MessageSquare, PenTool, Key, Palette, Shield, Zap, Hexagon, Activity, Sparkles, Radio } from 'lucide-react';

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<AppMode>(AppMode.DIALECTIC);

  // ELEGANCE CHAOTIC: Dynamic Fractal Overlay
  const FractalOverlay = ({ type }: { type: 'header' | 'footer' }) => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {/* Digital Noise Grain */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
        </div>

        {/* Geometric Chaos Elements */}
        {type === 'header' ? (
            <>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-fuchsia-600/20 blur-[80px] rounded-full mix-blend-screen animate-pulse"></div>
                <div className="absolute -top-10 -left-10 w-48 h-48 bg-cyan-500/10 blur-[60px] rounded-full mix-blend-screen"></div>

                {/* Asymmetric Cyber Lines */}
                <div className="absolute top-0 left-[20%] w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent transform rotate-12"></div>
                <div className="absolute top-0 right-[15%] w-[1px] h-full bg-gradient-to-b from-transparent via-amber-500/20 to-transparent transform -rotate-12"></div>

                {/* SVG Geometry */}
                <svg className="absolute top-0 left-0 w-full h-full opacity-10" preserveAspectRatio="none">
                    <path d="M0,0 L100,0 L85,100 L0,100 Z" fill="url(#headerGrad)" />
                    <defs>
                        <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#020617" stopOpacity="0" />
                            <stop offset="50%" stopColor="#d946ef" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </>
        ) : (
            <>
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-600/10 blur-[100px] rounded-full mix-blend-screen"></div>
                <div className="absolute bottom-0 right-0 w-full h-full opacity-[0.03]"
                     style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}>
                </div>
                 <svg className="absolute bottom-0 right-0 w-1/2 h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 L100 0 L100 100 Z" fill="url(#footerGrad)" />
                    <defs>
                        <linearGradient id="footerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
                        </linearGradient>
                    </defs>
                </svg>
            </>
        )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col font-sans selection:bg-fuchsia-500/30 selection:text-fuchsia-100 overflow-x-hidden">

      {/* HEADER: Chaotic Elegance */}
      <header className="relative z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-2xl sticky top-0 transition-all duration-500">
        <FractalOverlay type="header" />

        {/* Bottom Cyber Line */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent shadow-[0_0_10px_rgba(217,70,239,0.3)]"></div>

        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between relative z-10">

          {/* Logo Identity */}
          <div className="flex items-center gap-4 group cursor-default select-none">
            <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-600 to-cyan-600 rounded-lg rotate-3 group-hover:rotate-12 transition-transform duration-500 opacity-80 blur-[4px]"></div>
                <div className="relative bg-[#020617] border border-white/10 rounded-lg w-full h-full flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-300 overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                   <Zap size={20} className="text-amber-400 fill-amber-400/20 relative z-10" />
                </div>
            </div>
            <div className="flex flex-col">
                <h1 className="text-xl font-bold font-mono tracking-tighter text-white leading-none group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
                  CHALAMANDRA <span className="text-fuchsia-500 glitch" data-text="///">///</span>
                </h1>
                <span className="text-[10px] font-mono tracking-[0.3em] text-cyan-500 uppercase font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">
                  MAGISTRAL QUANTUM
                </span>
            </div>
          </div>

          {/* Navigation - Glassmorphism & Geometry */}
          <div className="flex items-center gap-3">
            <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1.5 rounded-xl border border-white/5 backdrop-blur-md shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
              {[
                { id: AppMode.DIALECTIC, icon: BrainCircuit, label: 'Dialectic', color: 'text-fuchsia-400', activeBg: 'bg-fuchsia-950/40 border-fuchsia-500/30' },
                { id: AppMode.SECURITY, icon: Shield, label: 'Security', color: 'text-green-400', activeBg: 'bg-green-950/40 border-green-500/30' },
                { id: AppMode.CHAT, icon: MessageSquare, label: 'Quantum', color: 'text-cyan-400', activeBg: 'bg-cyan-950/40 border-cyan-500/30' },
                { id: AppMode.LIVE, icon: Radio, label: 'Live', color: 'text-red-400', activeBg: 'bg-red-950/40 border-red-500/30' },
                { id: AppMode.STUDIO, icon: Palette, label: 'Studio', color: 'text-amber-400', activeBg: 'bg-amber-950/40 border-amber-500/30' },
                { id: AppMode.TOOLS, icon: PenTool, label: 'Tools', color: 'text-purple-400', activeBg: 'bg-purple-950/40 border-purple-500/30' },
              ].map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActiveMode(item.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-all border flex items-center gap-2 relative z-10 ${
                    activeMode === item.id
                        ? `${item.activeBg} ${item.color} shadow-[0_0_15px_rgba(0,0,0,0.5)] border-t-white/10`
                        : 'border-transparent text-slate-500 hover:text-slate-200 hover:bg-white/5'
                    }`}
                >
                    <item.icon size={14} className={activeMode === item.id ? item.color : ''} />
                    {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile Nav Placeholder */}
             <div className="md:hidden flex gap-2">
                 {[
                   { id: AppMode.DIALECTIC, icon: BrainCircuit },
                   { id: AppMode.CHAT, icon: MessageSquare },
                   { id: AppMode.LIVE, icon: Radio },
                 ].map(item => (
                     <button
                        key={item.id}
                        onClick={() => setActiveMode(item.id)}
                        className={`p-2 rounded-lg border border-transparent ${activeMode === item.id ? 'bg-white/10 text-white border-white/10' : 'text-slate-500'}`}
                     >
                        <item.icon size={18} />
                     </button>
                 ))}
             </div>

            <div className="h-8 w-[1px] bg-white/10 mx-1 hidden md:block"></div>

            <button
              onClick={() => switchApiKey()}
              className="group relative p-2.5 rounded-lg border border-amber-500/30 bg-amber-950/10 hover:bg-amber-500/20 transition-all overflow-hidden hidden md:block"
              title="Manage API Key"
            >
              <div className="absolute inset-0 bg-amber-400/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <Key size={18} className="text-amber-400 relative z-10" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT: The Void */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 relative z-10">
        <div className="animate-fade-in-up">
            {activeMode === AppMode.DIALECTIC && <DialecticMode />}
            {activeMode === AppMode.SECURITY && <CognitiveSecurity />}
            {activeMode === AppMode.CHAT && <OmniChat />}
            {activeMode === AppMode.LIVE && <LiveMode />}
            {activeMode === AppMode.STUDIO && <CreativeStudio />}
            {activeMode === AppMode.TOOLS && <ToolsPanel />}
        </div>
      </main>

      {/* FOOTER: Fractal Finish */}
      <footer className="relative z-10 border-t border-white/5 bg-[#050505] pt-16 pb-8 overflow-hidden">
        <FractalOverlay type="footer" />

        {/* Glowing Top Border */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col items-start gap-3">
            <h3 className="text-lg font-bold font-mono text-white tracking-tighter flex items-center gap-2">
                <Hexagon size={16} className="text-cyan-500 fill-cyan-500/20" />
                CHALAMANDRA OS
            </h3>
            <p className="text-xs text-slate-500 font-mono max-w-md leading-relaxed">
                A sovereign interface fusing <span className="text-blue-400">DeepSeek</span> (External), <span className="text-indigo-400">Gemini Pro/Flash</span> (Cloud), and <span className="text-purple-400">Veo</span> (Video) for advanced dialectic synthesis and cognitive architecture.
            </p>
          </div>

          <div className="flex items-center gap-6">
             <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-bold mb-1">System Status</p>
                <div className="flex items-center justify-end gap-2 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
                    <Activity size={10} className="text-green-500" />
                    <span className="text-xs font-mono text-green-400">OPERATIONAL</span>
                </div>
             </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/5 text-center relative">
             <p className="text-[10px] text-slate-700 font-mono uppercase tracking-widest flex items-center justify-center gap-2">
                <Sparkles size={10} className="text-amber-500" /> Designed with <span className="text-fuchsia-500 font-bold">Chaotic Elegance</span>
             </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
