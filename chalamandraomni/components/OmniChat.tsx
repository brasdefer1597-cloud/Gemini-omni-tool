
import React, { useState, useRef, useEffect } from 'react';
import { sendAdvancedChat } from '../services/chatService';
import { switchApiKey, playAudio } from '../services/utils';
import { ChatMessage, Attachment } from '../types';
import { Send, User, Bot, Loader2, Key, Paperclip, Mic, Globe, Brain, Volume2, Bolt } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const OmniChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'model', text: 'Chalamandra Quantum Connected. I can analyze images, search the web (Flash), respond instantly (Lite), or think deeply about complex problems (Pro).' }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Feature Toggles
  const [useThinking, setUseThinking] = useState(false);
  const [useSearch, setUseSearch] = useState(false);
  const [useTTS, setUseTTS] = useState(false);
  const [useFast, setUseFast] = useState(false);

  // Attachments
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            setAttachments([...attachments, {
                mimeType: file.type,
                data: base64String,
                name: file.name
            }]);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && attachments.length === 0) || isProcessing) return;

    setHasError(false);
    const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        text: input,
        attachments: [...attachments] // copy
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachments([]);
    setIsProcessing(true);

    try {
      // Prepare history for API
      const history = messages.map(m => {
         const parts: any[] = [{ text: m.text }];
         if(m.attachments) {
             m.attachments.forEach(att => parts.unshift({ inlineData: { mimeType: att.mimeType, data: att.data }}));
         }
         return { role: m.role, parts };
      });

      const response = await sendAdvancedChat(history, userMsg.text, userMsg.attachments || [], {
          useThinking,
          useSearch,
          useTTS,
          useFast
      });

      const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: response.text,
          audioData: response.audioData,
          isThinking: useThinking
      };

      setMessages(prev => [...prev, botMsg]);

      // Auto play audio if TTS was on
      if (response.audioData) {
          playAudio(response.audioData);
      }

    } catch (e: any) {
      console.error("OmniChat API Error:", e);
      setHasError(true);

      let errorDetail = 'Connection interrupted or unknown error.';
      const errorMessage = e.message?.toLowerCase() || '';

      if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('exhausted')) {
        errorDetail = 'API Quota exceeded. Please try again later or switch to a different project/key.';
      } else if (errorMessage.includes('401') || errorMessage.includes('api_key_invalid') || errorMessage.includes('key not found')) {
        errorDetail = 'Invalid API Key. Please verify your credentials in the Key Manager.';
      } else if (errorMessage.includes('503') || errorMessage.includes('overloaded') || errorMessage.includes('deadline exceeded')) {
        errorDetail = 'Gemini servers are currently overloaded or the request timed out. Please try again in a moment.';
      } else if (errorMessage.includes('requested entity was not found')) {
        errorDetail = 'The requested resource was not found. Resetting key selection...';
        switchApiKey();
      } else if (errorMessage.includes('safety')) {
        errorDetail = 'The response was blocked due to safety filter triggers.';
      } else if (e.message) {
        errorDetail = e.message;
      }

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: `[System Error: ${errorDetail}]`
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto border border-slate-800 rounded-xl overflow-hidden bg-slate-900/30 backdrop-blur-md animate-fade-in-up">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-cyan-600' : 'bg-indigo-600'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>

            <div className={`max-w-[85%] flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {/* Attachments Bubble */}
                {msg.attachments && msg.attachments.length > 0 && (
                    <div className="flex gap-2 flex-wrap justify-end">
                        {msg.attachments.map((att, idx) => (
                            <div key={idx} className="bg-slate-800 p-2 rounded-lg border border-slate-700 max-w-[200px]">
                                {att.mimeType.startsWith('image/') ? (
                                    <img src={`data:${att.mimeType};base64,${att.data}`} className="rounded max-h-32 object-cover" />
                                ) : (
                                    <div className="flex items-center gap-2 text-xs text-slate-300">
                                        <Paperclip size={12} /> {att.name || 'File'}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Text Bubble */}
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                    ? 'bg-cyan-900/20 border border-cyan-500/30 text-cyan-50 rounded-tr-none'
                    : 'bg-slate-800/50 border border-slate-700 text-slate-200 rounded-tl-none'
                }`}>
                    {msg.isThinking && <div className="text-xs text-indigo-400 font-mono mb-2 flex items-center gap-1"><Brain size={10}/> Deep Reasoning (32k Budget)</div>}
                    {!msg.isThinking && msg.role === 'model' && msg.id !== '0' && !useSearch && useFast && <div className="text-[10px] text-emerald-400 font-mono mb-1 flex items-center gap-1"><Bolt size={10}/> Fast Lite Engine</div>}
                    <ReactMarkdown>{msg.text}</ReactMarkdown>

                    {/* Audio Player Button */}
                    {msg.audioData && (
                        <button
                            onClick={() => playAudio(msg.audioData!)}
                            className="mt-3 flex items-center gap-2 text-xs bg-indigo-900/50 hover:bg-indigo-800/50 px-3 py-1.5 rounded-full border border-indigo-500/30 transition-colors"
                        >
                            <Volume2 size={12} /> Play Audio Response
                        </button>
                    )}
                </div>
            </div>
          </div>
        ))}

        {isProcessing && (
             <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Loader2 size={16} className="animate-spin" />
                </div>
                 <div className="bg-slate-800/50 border border-slate-700 text-slate-400 rounded-2xl px-4 py-3 text-sm rounded-tl-none italic flex items-center gap-2">
                    {useThinking ? <Brain size={14} className="animate-pulse text-indigo-400"/> : useFast ? <Bolt size={14} className="animate-bounce text-emerald-400"/> : <Loader2 size={14} className="animate-spin"/>}
                    {useThinking ? 'Gemini 3 Pro Deep Thinking...' : useFast ? 'Streaming Lite Response...' : 'Processing...'}
                </div>
            </div>
        )}

        {hasError && (
            <div className="flex justify-center my-2">
                <button
                  onClick={() => switchApiKey()}
                  className="px-4 py-2 bg-red-900/20 hover:bg-red-900/40 border border-red-500/50 rounded-full text-xs font-bold text-red-200 flex items-center gap-2 transition-colors shadow-lg"
                >
                  <Key size={14} />
                  API ERROR - MANAGE KEY
                </button>
            </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
                {attachments.map((att, i) => (
                    <div key={i} className="relative group shrink-0">
                         <div className="w-16 h-16 bg-slate-800 rounded border border-slate-700 flex items-center justify-center overflow-hidden">
                             {att.mimeType.startsWith('image/') ? (
                                 <img src={`data:${att.mimeType};base64,${att.data}`} className="w-full h-full object-cover"/>
                             ) : <Paperclip className="text-slate-500"/>}
                         </div>
                         <button
                            onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                            className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                         >
                             <div className="w-3 h-3 flex items-center justify-center font-bold leading-none">×</div>
                         </button>
                    </div>
                ))}
            </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-3">
             <button
                onClick={() => {
                    setUseFast(false);
                    setUseSearch(false);
                    setUseThinking(!useThinking);
                }}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono transition-colors ${useThinking ? 'bg-indigo-900 text-indigo-300 border border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
                title="Gemini 3 Pro Deep Thinking (32k Budget)"
             >
                 <Brain size={14} /> Think (Pro)
             </button>
             <button
                onClick={() => {
                     setUseThinking(false);
                     setUseSearch(false);
                     setUseFast(!useFast);
                }}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono transition-colors ${useFast ? 'bg-emerald-900 text-emerald-300 border border-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}
                title="Gemini 2.5 Flash Lite (Low Latency)"
             >
                 <Bolt size={14} /> Fast (Lite)
             </button>
             <button
                onClick={() => {
                     setUseThinking(false);
                     setUseFast(false);
                     setUseSearch(!useSearch);
                }}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono transition-colors ${useSearch ? 'bg-blue-900 text-blue-300 border border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
                title="Google Search Grounding (Flash)"
             >
                 <Globe size={14} /> Search
             </button>
             <button
                onClick={() => setUseTTS(!useTTS)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono transition-colors ${useTTS ? 'bg-green-900 text-green-300 border border-green-500' : 'text-slate-500 hover:text-slate-300'}`}
                title="Text-to-Speech Output (Kore)"
             >
                 <Volume2 size={14} /> Speak
             </button>
        </div>

        {/* Input Bar */}
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-400 hover:text-cyan-400 hover:bg-slate-900 rounded-lg transition-colors"
            title="Upload Image/Video for Analysis"
          >
            <Paperclip size={20} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*,video/*"
          />

          <input
            type="text"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            placeholder={useThinking ? "Enter complex prompt for reasoning..." : useFast ? "Ask something for a quick reply..." : "Message Chalamandra..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isProcessing}
          />
          <button
            onClick={handleSend}
            disabled={(!input.trim() && attachments.length === 0) || isProcessing}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white p-3 rounded-lg transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
