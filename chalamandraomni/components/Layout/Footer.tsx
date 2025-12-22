import React from 'react';
import { Hexagon, Activity, Sparkles } from 'lucide-react';
import { FractalOverlay } from './FractalOverlay';

export const Footer: React.FC = () => (
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
);
