import React, { useState, useRef, useEffect } from 'react';
import { generateImage, generateVeoVideo } from '../services/mediaService';
import { switchApiKey, hasSelectedKey } from '../services/utils';
import { Attachment } from '../types';
import { Image as ImageIcon, Video, Upload, Sparkles, AlertTriangle, Key, Maximize } from 'lucide-react';

type StudioMode = 'IMAGE' | 'VIDEO';

export const CreativeStudio: React.FC = () => {
    const [mode, setMode] = useState<StudioMode>('IMAGE');
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [hasKey, setHasKey] = useState(true);

    // Image Config
    const [aspectRatio, setAspectRatio] = useState('1:1');

    // Video Config
    const [videoAspect, setVideoAspect] = useState<'16:9' | '9:16'>('16:9');
    const [uploadedImage, setUploadedImage] = useState<Attachment | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Check key when entering Video mode
    useEffect(() => {
        if (mode === 'VIDEO') {
            hasSelectedKey().then(setHasKey);
        } else {
            setHasKey(true); // Image gen doesn't strictly force the selector check in the same way for Flash, but does for Pro (Preview). Assuming Pro.
        }
    }, [mode]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                setUploadedImage({
                    mimeType: file.type,
                    data: base64String,
                    name: file.name
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        if (!prompt && !uploadedImage && mode === 'VIDEO') return; // Video needs prompt OR image
        if (!prompt && mode === 'IMAGE') return;

        setLoading(true);
        setError(null);
        setResultUrl(null);

        try {
            if (mode === 'IMAGE') {
                const url = await generateImage(prompt, aspectRatio);
                setResultUrl(url);
            } else {
                const url = await generateVeoVideo(prompt, videoAspect, uploadedImage || undefined);
                setResultUrl(url);
            }
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Generation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-full flex flex-col gap-6 animate-fade-in-up">
            {/* Mode Switcher */}
            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800 self-center shadow-lg">
                <button
                    onClick={() => setMode('IMAGE')}
                    className={`px-6 py-2 rounded-lg font-mono text-sm font-bold flex items-center gap-2 transition-all ${
                        mode === 'IMAGE' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                    }`}
                >
                    <ImageIcon size={16} /> GEMINI PRO IMAGE
                </button>
                <button
                    onClick={() => setMode('VIDEO')}
                    className={`px-6 py-2 rounded-lg font-mono text-sm font-bold flex items-center gap-2 transition-all ${
                        mode === 'VIDEO' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                    }`}
                >
                    <Video size={16} /> VEO 3 VIDEO
                </button>
            </div>

            {/* Input Panel */}
            <div className="bg-slate-900/50 border border-slate-700 p-6 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    {mode === 'IMAGE' ? <ImageIcon className="w-64 h-64" /> : <Video className="w-64 h-64" />}
                </div>

                <div className="space-y-6 relative z-10">
                    {/* Common Prompt */}
                    <div>
                        <label className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 mb-2 uppercase tracking-widest">
                            <Sparkles size={12} className="text-amber-500" /> Prompt Description
                        </label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-white focus:border-cyan-500 outline-none resize-none h-32 font-light leading-relaxed"
                            placeholder={mode === 'IMAGE' ? "A detailed cinematic render of a cyberpunk llama eating neon tacos..." : "A neon hologram of a cat driving at top speed..."}
                        />
                    </div>

                    {/* Specific Controls */}
                    {mode === 'IMAGE' ? (
                        <div className="flex gap-6">
                            <div className="flex-1">
                                <label className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 mb-2 uppercase tracking-widest">
                                    <Maximize size={12} /> Aspect Ratio
                                </label>
                                <select
                                    value={aspectRatio}
                                    onChange={(e) => setAspectRatio(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none appearance-none"
                                >
                                    <option value="1:1">1:1 (Square)</option>
                                    <option value="4:3">4:3 (Standard)</option>
                                    <option value="3:4">3:4 (Portrait)</option>
                                    <option value="16:9">16:9 (Widescreen)</option>
                                    <option value="9:16">9:16 (Vertical)</option>
                                    <option value="2:3">2:3 (Classic)</option>
                                    <option value="3:2">3:2 (Landscape)</option>
                                    <option value="21:9">21:9 (Cinematic)</option>
                                </select>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-6 flex-wrap">
                            <div className="flex-1 min-w-[200px]">
                                <label className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 mb-2 uppercase tracking-widest">
                                    <Maximize size={12} /> Video Ratio
                                </label>
                                <select
                                    value={videoAspect}
                                    onChange={(e) => setVideoAspect(e.target.value as any)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded px-4 py-3 text-sm text-white focus:border-purple-500 outline-none appearance-none"
                                >
                                    <option value="16:9">16:9 (Landscape)</option>
                                    <option value="9:16">9:16 (Portrait)</option>
                                </select>
                            </div>

                            <div className="flex-1 min-w-[200px]">
                                <label className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 mb-2 uppercase tracking-widest">
                                    <Upload size={12} /> Reference Image (Optional)
                                </label>
                                <div className="flex gap-2 items-center">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-sm hover:bg-slate-700 flex items-center justify-center gap-2 transition-colors text-slate-300 hover:text-white"
                                    >
                                        <Upload size={16} />
                                        {uploadedImage ? "Change Image" : "Upload Source"}
                                    </button>
                                </div>
                                {uploadedImage && (
                                    <div className="mt-2 text-[10px] text-green-400 font-mono truncate">{uploadedImage.name}</div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                />
                            </div>
                        </div>
                    )}

                    {!hasKey && mode === 'VIDEO' ? (
                        <button
                            onClick={() => switchApiKey().then(() => setHasKey(true))}
                            className="w-full py-4 rounded-lg font-bold font-mono flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-black shadow-lg transition-transform hover:scale-[1.01]"
                        >
                            <Key size={18} /> ENABLE PAID API KEY FOR VEO
                        </button>
                    ) : (
                        <button
                            onClick={handleGenerate}
                            disabled={loading || (!prompt && !uploadedImage && mode === 'VIDEO') || (!prompt && mode === 'IMAGE')}
                            className={`w-full py-4 rounded-lg font-bold font-mono flex items-center justify-center gap-3 transition-all ${
                                loading
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-lg hover:shadow-cyan-500/20'
                            }`}
                        >
                            {loading ? <Sparkles className="animate-spin" /> : <Sparkles />}
                            {loading ? 'GENERATING ASSETS...' : 'GENERATE'}
                        </button>
                    )}
                </div>
            </div>

            {/* Output Area */}
            {error && (
                <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-lg flex justify-between items-center text-red-200">
                    <span className="flex items-center gap-2 font-mono text-sm"><AlertTriangle size={16} /> {error}</span>
                    <button onClick={() => switchApiKey()} className="text-xs bg-red-800 hover:bg-red-700 px-3 py-1 rounded flex items-center gap-1">
                        <Key size={12} /> Check Key
                    </button>
                </div>
            )}

            {resultUrl && (
                <div className="flex-1 bg-black rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden relative min-h-[400px] animate-fade-in-up">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
                    {mode === 'IMAGE' ? (
                        <img src={resultUrl} alt="Generated" className="max-w-full max-h-[600px] object-contain shadow-2xl" />
                    ) : (
                        <video src={resultUrl} controls autoPlay loop className="max-w-full max-h-[600px] shadow-2xl" />
                    )}
                    <a
                        href={resultUrl}
                        download={`generated-${mode.toLowerCase()}-${Date.now()}`}
                        className="absolute bottom-6 right-6 bg-slate-900/90 hover:bg-black text-white px-6 py-3 rounded-lg text-xs font-bold font-mono border border-slate-700 tracking-widest hover:border-white transition-all"
                    >
                        DOWNLOAD ASSET
                    </a>
                </div>
            )}
        </div>
    );
};
