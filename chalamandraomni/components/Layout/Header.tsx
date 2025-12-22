import React from 'react';
import { AppMode } from '../../types';
import { BrainCircuit, MessageSquare, PenTool, Key, Palette, Shield, Zap, Radio } from 'lucide-react';
import { FractalOverlay } from './FractalOverlay';
import { switchApiKey } from '../../services/utils';

interface HeaderProps {
    activeMode: AppMode;
    setActiveMode: (mode: AppMode) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeMode, setActiveMode }) => {

    const navItems = [
        { id: AppMode.DIALECTIC, icon: BrainCircuit, label: 'Dialectic', color: 'text-fuchsia-400', activeBg: 'bg-fuchsia-950/40 border-fuchsia-500/30' },
        { id: AppMode.SECURITY, icon: Shield, label: 'Security', color: 'text-green-400', activeBg: 'bg-green-950/40 border-green-500/30' },
        { id: AppMode.CHAT, icon: MessageSquare, label: 'Quantum', color: 'text-cyan-400', activeBg: 'bg-cyan-950/40 border-cyan-500/30' },
        { id: AppMode.LIVE, icon: Radio, label: 'Live', color: 'text-red-400', activeBg: 'bg-red-950/40 border-red-500/30' },
        { id: AppMode.STUDIO, icon: Palette, label: 'Studio', color: 'text-amber-400', activeBg: 'bg-amber-950/40 border-amber-500/30' },
        { id: AppMode.TOOLS, icon: PenTool, label: 'Tools', color: 'text-purple-400', activeBg: 'bg-purple-950/40 border-purple-500/30' },
    ];

    return (
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
                  CHALAMANDRA <span className="text-fuchsia-500 glitch" data-text="///">{'///'}</span>
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
              {navItems.map((item) => (
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
                 {navItems.slice(0, 3).map(item => (
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
    );
};
