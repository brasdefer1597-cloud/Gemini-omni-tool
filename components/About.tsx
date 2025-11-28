import React from 'react';
import { Shield, Zap, Cpu, Activity, Layers, Code, GitBranch, Box } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="h-full bg-slate-950 text-slate-200 p-8 overflow-y-auto animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-6 py-8">
          <h1 className="text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
            Gemini Omni-Tool
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A production-grade reference architecture demonstrating the full capabilities of the <span className="text-white font-semibold">Gemini 2.5 & 3.0 Ecosystem</span>.
            Engineered for high resilience, low latency (SRAP), and seamless multimodal integration.
          </p>
        </div>

        {/* Core Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <FeatureCard
              icon={Zap}
              title="Flash & Flash-Lite"
              desc="Ultra low-latency text processing and multimodal analysis optimized for speed and efficiency."
              color="text-yellow-400"
              borderColor="border-yellow-500/20"
           />
           <FeatureCard
              icon={Cpu}
              title="Gemini 3 Pro"
              desc="Advanced reasoning capabilities featuring 'Thinking' mode with a massive 32k token budget for complex tasks."
              color="text-purple-400"
              borderColor="border-purple-500/20"
           />
           <FeatureCard
              icon={Activity}
              title="Gemini Live"
              desc="Real-time, bidirectional audio streaming via WebSockets with sub-second latency."
              color="text-blue-400"
              borderColor="border-blue-500/20"
           />
           <FeatureCard
              icon={Box}
              title="Veo Video"
              desc="High-fidelity generative video creation from text or image prompts using the Veo 3.1 model."
              color="text-pink-400"
              borderColor="border-pink-500/20"
           />
           <FeatureCard
              icon={Layers}
              title="Grounding"
              desc="Integrated real-time information retrieval via Google Search and Google Maps tools."
              color="text-green-400"
              borderColor="border-green-500/20"
           />
            <FeatureCard
              icon={Code}
              title="Clean Architecture"
              desc="Strict separation of concerns using Domain Contracts, Infrastructure Adapters, and Presentation Logic."
              color="text-cyan-400"
              borderColor="border-cyan-500/20"
           />
        </div>

        {/* Engineering Highlights */}
        <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <Shield className="text-green-400" />
                Engineering Excellence (SRAP Architecture)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                     <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Resilience & Stability</h3>
                     <TechItem 
                        icon={GitBranch}
                        label="Circuit Breaker Pattern" 
                        value="Protects the system from cascading failures by monitoring API error rates and managing 'Open/Closed' states." 
                     />
                     <TechItem 
                        icon={Activity}
                        label="Jittered Backoff" 
                        value="Implements smart retry logic with exponential delays and randomization to prevent 'thundering herd' issues." 
                     />
                </div>
                <div className="space-y-6">
                     <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Observability & Performance</h3>
                     <TechItem 
                        icon={Activity}
                        label="Structured Telemetry" 
                        value="Real-time tracking of P95 Latency and Error Rates with visual feedback in the developer console." 
                     />
                     <TechItem 
                        icon={Zap}
                        label="Resource Safety" 
                        value="Deterministic cleanup lifecycles for hardware resources (Microphone/Camera) to prevent memory leaks." 
                     />
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-12 pb-4 border-t border-slate-800/50 text-slate-600">
            <p className="flex items-center justify-center gap-2 mb-2 font-mono text-sm">
                <span>v2.1.0-RC1 (Stable)</span>
                <span>•</span>
                <span>Build: {new Date().toLocaleDateString()}</span>
            </p>
            <p className="text-xs">Powered by Google Gen AI SDK v1.30.0 • React 19 • Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, color, borderColor }: any) => (
    <div className={`bg-slate-900/40 border ${borderColor || 'border-slate-700'} p-6 rounded-2xl hover:bg-slate-800/60 transition-all group hover:-translate-y-1 hover:shadow-xl`}>
        <div className={`w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
             <Icon className={`${color}`} size={24} />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
);

const TechItem = ({ label, value, icon: Icon }: any) => (
    <div className="flex gap-4">
        <div className="mt-1">
            <Icon size={18} className="text-slate-500" />
        </div>
        <div>
            <h4 className="font-semibold text-slate-200 text-sm mb-1">{label}</h4>
            <p className="text-slate-400 text-sm leading-relaxed">{value}</p>
        </div>
    </div>
);
