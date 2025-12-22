import React, { useState } from 'react';
import { DialecticResult } from '../types';
import { Synapse } from '../services/synapse';
import { Sparkles, Crown, Target, Activity, Binary, Layers, Check, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const DialecticMode: React.FC = () => {
  const [coreIdea, setCoreIdea] = useState('');
  const [level, setLevel] = useState(5);
  const [result, setResult] = useState<DialecticResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [useCloud, setUseCloud] = useState(true); // Now maps to Cloud vs Local (Nano)
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);
  const [feedbackModifier, setFeedbackModifier] = useState("");

  const handleAnalyze = async (modifier = "") => {
    if (!coreIdea.trim()) return;
    setLoading(true);
    setFeedback(null); // Reset feedback
    try {
      // Guru Mode: Use Synapse
      const data = await Synapse.performDialectic(
          coreIdea,
          level,
          useCloud ? 'gemini' : 'nano',
          modifier
      );
      setResult(data);
    } catch (err) {
      console.error("Dialectic Fail", err);
      // Could add toast error here
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Inverse Flux: Feedback Loop
  const handleFeedback = (type: 'positive' | 'negative') => {
      setFeedback(type);
      if (type === 'negative') {
          // If negative, we refine the next prompt
          setFeedbackModifier("User found previous synthesis too abstract. Be more concrete and actionable.");
      } else {
          setFeedbackModifier("User approved previous style. Maintain high entropy and strategic depth.");
      }
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto space-y-12 animate-fade-in-up">
      <div className="bg-slate-950 border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-md">

        {/* Header Control */}
        <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <Crown className="w-8 h-8 text-amber-500" />
            <h2 className="text-2xl font-bold font-mono text-white tracking-tighter">DECOX CONSOLE</h2>
          </div>
          <button
            onClick={() => setUseCloud(!useCloud)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-lg border border-slate-700 text-[10px] font-mono uppercase text-slate-400 hover:text-white transition-all"
            title={useCloud ? "Using Cloud Intelligence (Gemini Pro)" : "Using Local Intelligence (Nano)"}
          >
            Engine: <span className={useCloud ? 'text-indigo-400' : 'text-cyan-400'}>{useCloud ? 'GEMINI CLOUD' : 'NANO LOCAL'}</span>
          </button>
        </div>

        {/* Input & Controls */}
        <div className="space-y-8">
          <textarea
            className="w-full bg-black/50 border border-slate-800 rounded-2xl p-6 text-slate-200 focus:border-amber-500/50 outline-none transition-all resize-none h-40 font-light"
            placeholder="Introduce la semilla de tu idea o conflicto..."
            value={coreIdea}
            onChange={(e) => setCoreIdea(e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase">
                <span>Profundidad de Análisis</span>
                <span>Nivel {level}</span>
              </div>
              <input
                 type="range" min="1" max="9" value={level}
                 onChange={(e) => setLevel(parseInt(e.target.value))}
                 className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <button
                onClick={() => handleAnalyze(feedbackModifier)}
                disabled={loading || !coreIdea}
                className="w-full py-4 bg-white text-black font-bold font-mono rounded-xl hover:bg-amber-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Sparkles className="animate-spin" /> : <Target size={18} />}
              {loading ? 'PROCESANDO...' : 'EJECUTAR DIALÉCTICA'}
            </button>
          </div>
        </div>
      </div>

      {/* Results Display */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
          <Card title="THESIS (CHOLA)" text={result.chola} color="border-cyan-500" icon={<Binary size={20}/>} />
          <Card title="ANTITHESIS (MALANDRA)" text={result.malandra} color="border-fuchsia-500" icon={<Activity size={20}/>} />

          <div className="md:col-span-2">
            <div className="bg-[#050505] border border-amber-500/30 rounded-3xl p-10 relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity"><Layers size={100} /></div>

              <h3 className="text-3xl font-bold font-mono text-amber-500 mb-6 flex items-center gap-4"><Crown /> SYNTHESIS (FRESA)</h3>

              <div className="prose prose-invert prose-lg max-w-none font-light leading-relaxed">
                  <ReactMarkdown>{result.fresa.synthesis}</ReactMarkdown>
              </div>

              <div className="mt-10 pt-6 border-t border-white/5 flex flex-wrap justify-between items-center gap-4">
                <span className="text-[10px] font-mono text-slate-600 uppercase">Confianza: {result.fresa.confidence}%</span>

                <div className="flex items-center gap-3">
                     {/* Feedback Loop Controls */}
                    <div className="flex gap-2 mr-4 border-r border-white/10 pr-4">
                        <button
                            onClick={() => handleFeedback('positive')}
                            className={`p-2 rounded-full hover:bg-green-900/20 transition-colors ${feedback === 'positive' ? 'text-green-500' : 'text-slate-600'}`}
                            title="Valid Strategy"
                        >
                            <ThumbsUp size={16} />
                        </button>
                         <button
                            onClick={() => handleFeedback('negative')}
                            className={`p-2 rounded-full hover:bg-red-900/20 transition-colors ${feedback === 'negative' ? 'text-red-500' : 'text-slate-600'}`}
                            title="Too Abstract / Refine"
                        >
                            <ThumbsDown size={16} />
                        </button>
                    </div>

                    <button
                        onClick={() => handleCopy(result.fresa.synthesis)}
                        className="px-6 py-2 bg-slate-900 border border-slate-800 rounded-full text-xs font-mono text-slate-400 hover:text-white flex items-center gap-2 transition-all"
                    >
                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />} {copied ? 'COPIADO' : 'COPIAR ESTRATEGIA'}
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Card = ({ title, text, color, icon }: any) => (
  <div className={`bg-slate-900/50 border-t-4 ${color} rounded-2xl p-8 shadow-xl backdrop-blur-sm`}>
    <div className="flex items-center gap-3 mb-6 text-slate-400">{icon} <h3 className="text-xs font-mono font-bold uppercase tracking-widest">{title}</h3></div>
    <div className="text-slate-300 font-light leading-relaxed prose prose-invert prose-sm"><ReactMarkdown>{text}</ReactMarkdown></div>
  </div>
);
