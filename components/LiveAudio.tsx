
// components/LiveAudio.tsx
import React, { useEffect, useState, useRef } from 'react';
import { telemetryClient } from '../services/telemetry/TelemetryClient';
import { Mic, MicOff, AlertCircle, Activity } from 'lucide-react';

interface LiveAudioProps {
    isActive: boolean;
    onDeactivate?: () => void;
}

/**
 * Componente de captura de audio resiliente.
 * Gestiona el ciclo de vida del AudioContext y MediaStream de forma segura.
 */
export const LiveAudio: React.FC<LiveAudioProps> = ({ isActive, onDeactivate }) => {
    const [audioError, setAudioError] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    
    const streamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const cleanupRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        if (!isActive) {
            cleanup();
            setIsInitialized(false);
            return;
        }

        const initializeAudio = async () => {
            telemetryClient.trackEvent({ eventName: 'LiveAudio.Init.Start' });
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                streamRef.current = stream;

                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                const audioContext = new AudioContextClass();
                audioContextRef.current = audioContext;

                // Visualizer placeholder or Worklet connection goes here
                // const source = audioContext.createMediaStreamSource(stream);
                
                setAudioError(null);
                setIsInitialized(true);
                telemetryClient.trackEvent({ eventName: 'LiveAudio.Init.Success' });

            } catch (error) {
                const err = error instanceof Error ? error : new Error('Unknown audio error');
                const errorMessage = err.name === 'NotAllowedError' 
                    ? 'Microphone access denied.'
                    : 'Audio hardware error.';
                
                console.error("[LiveAudio]", err);
                setAudioError(errorMessage);
                telemetryClient.trackError(err, { eventName: 'LiveAudio.Init.Failure', context: errorMessage });
                
                if (onDeactivate) onDeactivate();
            }
        };

        initializeAudio();

        return cleanup;
    }, [isActive, onDeactivate]);

    const cleanup = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close().catch(e => console.warn("AudioContext close error", e));
            audioContextRef.current = null;
        }
        if (cleanupRef.current) {
            cleanupRef.current();
            cleanupRef.current = null;
        }
    };

    if (audioError) {
        return (
            <div className="flex flex-col items-center gap-2 p-4 border border-red-500/30 bg-red-950/20 rounded-lg text-red-400">
                <AlertCircle size={24} />
                <span className="font-mono text-sm">{audioError}</span>
            </div>
        );
    }
    
    if (!isActive) return null;

    return (
        <div className="flex flex-col items-center gap-4 animate-fade-in">
            <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
                <div className="relative p-4 bg-red-500/10 border border-red-500/50 rounded-full text-red-500">
                    <Mic size={32} />
                </div>
            </div>
            <div className="flex items-center gap-2 text-red-400 font-mono text-xs uppercase tracking-widest">
                <Activity size={14} className="animate-pulse" />
                Live Audio Stream Active
            </div>
            <p className="text-slate-500 text-xs max-w-xs text-center">
                Audio is being processed locally. (Visualizer Module Pending)
            </p>
        </div>
    );
};
