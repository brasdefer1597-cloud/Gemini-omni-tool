import React, { useEffect, useRef, useState } from 'react';
import { createLiveSession } from '../services/liveService';
import { switchApiKey } from '../services/utils';
import { Mic, Video, MicOff, VideoOff, PhoneOff, Activity, Waves, Volume2, Key } from 'lucide-react';
import { LiveServerMessage } from '@google/genai';

export const LiveMode: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(false);
    const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
    const [volume, setVolume] = useState(0);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const sessionRef = useRef<any>(null);

    // Audio Output
    const nextStartTimeRef = useRef<number>(0);
    const outputContextRef = useRef<AudioContext | null>(null);

    const startSession = async () => {
        try {
            setStatus('connecting');

            // 1. Setup Audio Inputs
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 16000,
                    channelCount: 1,
                    echoCancellation: true,
                    autoGainControl: true,
                    noiseSuppression: true
                },
                video: cameraOn
            });

            mediaStreamRef.current = stream;

            // Video Preview
            if (videoRef.current && cameraOn) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }

            // 2. Connect to Live API
            const sessionPromise = createLiveSession({
                onOpen: () => {
                    console.log("Live Session Open");
                    setStatus('connected');
                    setIsActive(true);

                    // Start Audio Streaming
                    const ctx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
                    audioContextRef.current = ctx;

                    const source = ctx.createMediaStreamSource(stream);
                    sourceRef.current = source;

                    const processor = ctx.createScriptProcessor(4096, 1, 1);
                    processorRef.current = processor;

                    processor.onaudioprocess = (e) => {
                        if (!micOn) return;

                        const inputData = e.inputBuffer.getChannelData(0);

                        // Volume Visualizer
                        let sum = 0;
                        for(let i=0; i<inputData.length; i++) sum += inputData[i]*inputData[i];
                        setVolume(Math.sqrt(sum/inputData.length) * 5);

                        // PCM Conversion
                        const l = inputData.length;
                        const int16 = new Int16Array(l);
                        for (let i = 0; i < l; i++) {
                            int16[i] = inputData[i] * 32768;
                        }

                        // Convert to Base64
                        let binary = '';
                        const bytes = new Uint8Array(int16.buffer);
                        const len = bytes.byteLength;
                        for (let i = 0; i < len; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        const b64 = btoa(binary);

                        sessionPromise.then(session => {
                            session.sendRealtimeInput({
                                media: {
                                    mimeType: 'audio/pcm;rate=16000',
                                    data: b64
                                }
                            });
                        });
                    };

                    source.connect(processor);
                    processor.connect(ctx.destination);
                },
                onMessage: async (msg: LiveServerMessage) => {
                    // Handle Audio Output
                    const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    if (audioData) {
                        if (!outputContextRef.current) {
                            outputContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
                        }
                        const ctx = outputContextRef.current;

                        // Decode
                        const binaryString = atob(audioData);
                        const len = binaryString.length;
                        const bytes = new Uint8Array(len);
                        for (let i = 0; i < len; i++) {
                            bytes[i] = binaryString.charCodeAt(i);
                        }

                        // PCM Decoding Logic specific to 24k raw PCM
                        const dataInt16 = new Int16Array(bytes.buffer);
                        const float32 = new Float32Array(dataInt16.length);
                        for(let i=0; i<dataInt16.length; i++) {
                            float32[i] = dataInt16[i] / 32768.0;
                        }

                        const buffer = ctx.createBuffer(1, float32.length, 24000);
                        buffer.getChannelData(0).set(float32);

                        // Play
                        const source = ctx.createBufferSource();
                        source.buffer = buffer;
                        source.connect(ctx.destination);

                        const now = ctx.currentTime;
                        const start = Math.max(nextStartTimeRef.current, now);
                        source.start(start);
                        nextStartTimeRef.current = start + buffer.duration;
                    }
                },
                onError: (err) => {
                    console.error("Live Error", err);
                    setStatus('error');
                    stopSession();
                },
                onClose: () => {
                    console.log("Live Closed");
                    stopSession();
                }
            });

            sessionRef.current = sessionPromise;

        } catch (e) {
            console.error(e);
            setStatus('error');
        }
    };

    const stopSession = () => {
        setIsActive(false);
        setStatus('idle');

        // Stop Tracks
        mediaStreamRef.current?.getTracks().forEach(t => t.stop());

        // Disconnect Audio
        sourceRef.current?.disconnect();
        processorRef.current?.disconnect();
        audioContextRef.current?.close();

        // Reset Refs
        sessionRef.current = null;
        mediaStreamRef.current = null;
        nextStartTimeRef.current = 0;
    };

    // Toggle Camera mid-stream (Simplified: requires restart in this basic impl,
    // real impl would add/remove track or send frames via canvas)
    useEffect(() => {
        if (!isActive) return;
        // Ideally we would send video frames here via session.sendRealtimeInput
    }, [cameraOn]);

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4 animate-fade-in-up relative">

            {/* Main Visualizer / Video Area */}
            <div className="relative w-full max-w-2xl aspect-video bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col items-center justify-center group">
                {/* Background Noise */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

                {cameraOn && (
                    <video
                        ref={videoRef}
                        muted
                        className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-screen"
                    />
                )}

                {/* Status Indicator */}
                <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest border flex items-center gap-2 backdrop-blur-md z-10 transition-all ${
                    status === 'connected' ? 'bg-green-900/30 border-green-500/50 text-green-400' :
                    status === 'connecting' ? 'bg-amber-900/30 border-amber-500/50 text-amber-400' :
                    status === 'error' ? 'bg-red-900/30 border-red-500/50 text-red-400' :
                    'bg-slate-800/50 border-slate-600 text-slate-400'
                }`}>
                    <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500 animate-pulse' : status === 'connecting' ? 'bg-amber-500' : 'bg-slate-500'}`}></div>
                    {status}
                </div>

                {/* Central Entity */}
                <div className={`relative transition-all duration-500 ${isActive ? 'scale-100' : 'scale-90 opacity-50'}`}>
                    <div className={`w-48 h-48 rounded-full flex items-center justify-center relative transition-all duration-300 ${status === 'connected' ? 'bg-cyan-900/20' : 'bg-slate-800/50'}`}>
                        {/* Audio Reactive Rings */}
                        {isActive && (
                            <>
                                <div className="absolute inset-0 border border-cyan-500/30 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
                                <div className="absolute inset-0 border border-cyan-500/20 rounded-full" style={{ transform: `scale(${1 + volume})`, transition: 'transform 0.1s' }}></div>
                            </>
                        )}

                        <div className="relative z-10 text-white">
                            {isActive ? <Waves size={64} className="text-cyan-400" /> : <Volume2 size={64} className="text-slate-600" />}
                        </div>
                    </div>
                </div>

                {status === 'error' && (
                    <div className="absolute bottom-20 text-red-400 text-sm font-mono flex items-center gap-2 bg-red-950/80 px-4 py-2 rounded-lg border border-red-500/30">
                        <Activity size={16} /> Connection Failed. Check API Key.
                        <button onClick={() => switchApiKey()} className="text-white underline hover:text-red-200">Switch Key</button>
                    </div>
                )}
            </div>

            {/* Controls Bar */}
            <div className="mt-8 flex items-center gap-6">
                 <button
                    onClick={() => setMicOn(!micOn)}
                    className={`p-4 rounded-full border transition-all ${micOn ? 'bg-slate-800 border-slate-600 text-white' : 'bg-red-900/20 border-red-500/50 text-red-400'}`}
                 >
                     {micOn ? <Mic size={24} /> : <MicOff size={24} />}
                 </button>

                 {!isActive ? (
                     <button
                        onClick={startSession}
                        className="px-12 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold font-mono tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all transform hover:scale-105"
                     >
                         CONNECT LIVE
                     </button>
                 ) : (
                     <button
                        onClick={() => { stopSession(); sessionRef.current = null; }}
                        className="px-12 py-4 bg-red-600 hover:bg-red-500 text-white rounded-full font-bold font-mono tracking-widest shadow-lg transition-all transform hover:scale-105"
                     >
                         <PhoneOff size={24} />
                     </button>
                 )}

                 <button
                    onClick={() => setCameraOn(!cameraOn)}
                    className={`p-4 rounded-full border transition-all ${cameraOn ? 'bg-slate-800 border-slate-600 text-white' : 'bg-slate-900/50 border-slate-700 text-slate-500'}`}
                 >
                     {cameraOn ? <Video size={24} /> : <VideoOff size={24} />}
                 </button>
            </div>

            <p className="mt-6 text-slate-500 text-xs font-mono">
                Gemini 2.5 Flash Native Audio Preview • Low Latency Voice Mode
            </p>
        </div>
    );
};
