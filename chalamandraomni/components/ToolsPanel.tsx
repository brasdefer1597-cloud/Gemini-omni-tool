import React, { useState, useEffect } from 'react';
import { summarizeContent, rewriteContent, proofreadContent, checkNanoAvailability } from '../services/toolsService';
import { ExternalProvider } from '../types';
import { FileText, Edit3, CheckCircle, Settings, Key, Zap, Copy, Sparkles, RefreshCw, Cpu, BookCheck } from 'lucide-react';

export const ToolsPanel: React.FC = () => {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'summarize' | 'rewrite' | 'proofread'>('summarize');
  const [rewriteTone, setRewriteTone] = useState<'formal' | 'casual' | 'fluent'>('formal');
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  // External Config & Persistence
  const [provider, setProvider] = useState<ExternalProvider>('nano');
  const [showConfig, setShowConfig] = useState(false);
  const [nanoAvailable, setNanoAvailable] = useState(false);

  // Initialize keys from LocalStorage
  const [keys, setKeys] = useState<{ [key: string]: string }>(() => ({
      deepseek: localStorage.getItem('CHALA_DEEPSEEK_KEY') || '',
      openai: localStorage.getItem('CHALA_OPENAI_KEY') || ''
  }));

  useEffect(() => {
    checkNanoAvailability().then(setNanoAvailable);
  }, []);

  const updateKey = (p: string, k: string) => {
      setKeys(prev => ({ ...prev, [p]: k }));
      localStorage.setItem(`CHALA_${p.toUpperCase()}_KEY`, k);
  };

  const handleExecute = async () => {
    if (!text.trim()) return;

    // Check Key only if not Nano
    let currentKey = '';
    if (provider !== 'nano') {
        currentKey = keys[provider as string];
        // Note: Gemini handled by central config, but we can check if needed
    } else if (!nanoAvailable) {
        setOutput("Error: Gemini Nano is not available in this browser. Please use Chrome Canary or enable flags.");
        return;
    }

    setProcessing(true);
    setCopied(false);
    setOutput('');

    try {
      let result = '';
      if (mode === 'summarize') {
        result = await summarizeContent(text, provider, currentKey);
      } else if (mode === 'rewrite') {
        result = await rewriteContent(text, rewriteTone, provider, currentKey);
      } else if (mode === 'proofread') {
        result = await proofreadContent(text, provider, currentKey);
      }
      setOutput(result);
    } catch (e: any) {
      setOutput(`Error: ${e.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleCopy = () => {
      if (!output) return;
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">

      {/* Configuration Header */}
      <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800 flex flex-col gap-4 shadow-lg">
          <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-200 font-mono font-bold tracking-wider">
                  <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                      <Zap size={18} className="text-amber-500" />
                  </div>
                  <span>INTELLIGENCE ENGINE</span>
              </div>
              <button
                onClick={() => setShowConfig(!showConfig)}
                className={`text-xs px-4 py-2 rounded-lg border flex items-center gap-2 transition-all duration-300 font-mono tracking-wide ${showConfig ? 'bg-slate-800 border-slate-600 text-white shadow-inner' : 'border-transparent text-slate-500 hover:text-white hover:bg-slate-800/50'}`}
              >
                  <Settings size={14} /> {showConfig ? 'CLOSE CONFIG' : 'CONFIGURE'}
              </button>
          </div>

          {showConfig && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/50 animate-fade-in-up">
                   <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setProvider('nano')}
                            className={`flex-1 min-w-[100px] py-3 text-xs font-mono font-bold border rounded-lg transition-all flex flex-col items-center gap-1 ${provider === 'nano' ? 'bg-cyan-900/20 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                        >
                            <span className="flex items-center gap-1"><Cpu size={12}/> GEMINI NANO</span>
                            {nanoAvailable ? <span className="text-[8px] text-green-500">READY</span> : <span className="text-[8px] text-red-500">UNAVAILABLE</span>}
                        </button>
                        <button
                            onClick={() => setProvider('deepseek')}
                            className={`flex-1 min-w-[100px] py-3 text-xs font-mono font-bold border rounded-lg transition-all ${provider === 'deepseek' ? 'bg-blue-900/20 border-blue-500 text-blue-300' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                        >
                            DEEPSEEK
                        </button>
                        <button
                            onClick={() => setProvider('openai')}
                            className={`flex-1 min-w-[100px] py-3 text-xs font-mono font-bold border rounded-lg transition-all ${provider === 'openai' ? 'bg-green-900/20 border-green-500 text-green-300' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                        >
                            OPENAI
                        </button>
                   </div>

                   {provider !== 'nano' && (
                       <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-lg px-4 focus-within:border-amber-500/50 transition-colors">
                            <Key size={16} className="text-slate-500" />
                            <input
                                type="password"
                                value={keys[provider]}
                                onChange={(e) => updateKey(provider, e.target.value)}
                                placeholder={`Enter ${provider.toUpperCase()} Key...`}
                                className="bg-transparent border-none text-xs text-white focus:outline-none w-full font-mono py-3 placeholder:text-slate-700"
                            />
                       </div>
                   )}
              </div>
          )}
      </div>

      {/* Mode Selection */}
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => setMode('summarize')}
          className={`group p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-300 relative overflow-hidden ${
            mode === 'summarize' ? 'bg-cyan-900/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'bg-slate-900/30 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 transition-opacity ${mode === 'summarize' ? 'opacity-100' : 'group-hover:opacity-50'}`}></div>
          <FileText className={`w-6 h-6 ${mode === 'summarize' ? 'text-cyan-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
          <span className="font-mono font-bold tracking-widest text-[10px] sm:text-xs relative z-10">SUMMARIZE</span>
        </button>
        <button
          onClick={() => setMode('rewrite')}
          className={`group p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-300 relative overflow-hidden ${
            mode === 'rewrite' ? 'bg-purple-900/20 border-purple-500/50 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.1)]' : 'bg-slate-900/30 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 transition-opacity ${mode === 'rewrite' ? 'opacity-100' : 'group-hover:opacity-50'}`}></div>
          <Edit3 className={`w-6 h-6 ${mode === 'rewrite' ? 'text-purple-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
          <span className="font-mono font-bold tracking-widest text-[10px] sm:text-xs relative z-10">REWRITE</span>
        </button>
        <button
          onClick={() => setMode('proofread')}
          className={`group p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-300 relative overflow-hidden ${
            mode === 'proofread' ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-slate-900/30 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 transition-opacity ${mode === 'proofread' ? 'opacity-100' : 'group-hover:opacity-50'}`}></div>
          <BookCheck className={`w-6 h-6 ${mode === 'proofread' ? 'text-emerald-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
          <span className="font-mono font-bold tracking-widest text-[10px] sm:text-xs relative z-10">PROOFREAD</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Column */}
        <div className="space-y-3 flex flex-col">
            <div className="flex justify-between items-center">
                <label className="text-xs font-mono font-bold text-slate-500 tracking-wider">INPUT SOURCE</label>
                {mode === 'rewrite' && (
                    <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
                        {(['formal', 'casual', 'fluent'] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setRewriteTone(t)}
                                className={`px-2 py-1 text-[10px] font-mono uppercase rounded transition-colors ${rewriteTone === t ? 'bg-purple-900/50 text-purple-300' : 'text-slate-600 hover:text-slate-400'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full flex-1 min-h-[300px] bg-slate-950/80 border border-slate-800 rounded-xl p-5 text-slate-200 resize-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 outline-none transition-all placeholder:text-slate-700 font-light leading-relaxed"
                placeholder="Paste the text you want to process here..."
            />
            <button
                onClick={handleExecute}
                disabled={processing || !text}
                className={`w-full py-4 rounded-xl font-bold font-mono tracking-widest text-sm uppercase transition-all shadow-lg flex items-center justify-center gap-3
                    ${processing || !text
                        ? 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                        : 'bg-gradient-to-r from-slate-100 to-slate-300 text-slate-900 hover:from-white hover:to-slate-200 border border-transparent'
                    }`}
            >
                {processing ? <RefreshCw className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4 text-amber-500" />}
                {processing ? 'PROCESSING...' : `EXECUTE ${mode.toUpperCase()}`}
            </button>
        </div>

        {/* Output Column */}
        <div className="space-y-3 flex flex-col">
            <div className="flex justify-between items-center">
                <label className="text-xs font-mono font-bold text-slate-500 tracking-wider flex items-center gap-2">
                    OUTPUT ({provider.toUpperCase()})
                </label>
                {output && !output.startsWith('Error') && (
                    <button
                        onClick={handleCopy}
                        className={`text-[10px] font-mono flex items-center gap-1.5 px-2 py-1 rounded border transition-all ${copied ? 'border-green-500/50 text-green-400 bg-green-900/20' : 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'}`}
                    >
                        {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
                        {copied ? 'COPIED' : 'COPY'}
                    </button>
                )}
            </div>
            <div className={`w-full flex-1 min-h-[300px] bg-slate-900/30 border rounded-xl p-5 overflow-y-auto relative transition-colors ${output.startsWith('Error') ? 'border-red-900/50 bg-red-950/10' : 'border-slate-800'}`}>
                {output ? (
                    <div className={`prose prose-invert prose-sm max-w-none font-light leading-relaxed ${output.startsWith('Error') ? 'text-red-300' : 'text-slate-300'}`}>
                        {output}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-700 gap-3 opacity-50">
                        <div className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center">
                            <Sparkles size={20} />
                        </div>
                        <span className="text-xs font-mono">WAITING FOR INPUT...</span>
                    </div>
                )}
            </div>
             {/* Spacer to match button height */}
             <div className="h-[54px]"></div>
        </div>
      </div>
    </div>
  );
};
