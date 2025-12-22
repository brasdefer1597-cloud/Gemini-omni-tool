/**
 * KEY MANAGEMENT & UTILS
 * Handles the interaction with AI Studio Extension if available, or falls back to local storage.
 */

import { setApiKey } from "./config";

export const switchApiKey = async () => {
    // Check for global aistudio presence dynamically to avoid TS errors
    const aiStudio = (window as any).aistudio;
    if (aiStudio) {
        try {
            await aiStudio.openSelectKey();
        } catch (e) {
            console.warn("AI Studio Extension not responding, falling back to manual input.");
            manualKeyInput();
        }
    } else {
        manualKeyInput();
    }
};

const manualKeyInput = () => {
    const key = prompt("Enter your Gemini API Key:");
    if (key) {
        setApiKey(key);
        window.location.reload(); // Simple reload to refresh clients
    }
};

export const hasSelectedKey = async () => {
    const aiStudio = (window as any).aistudio;
    if (aiStudio) return await aiStudio.hasSelectedApiKey();
    return !!localStorage.getItem('CHALAMANDRA_API_KEY');
};

/**
 * AUDIO UTILS
 */
export const playAudio = async (b64: string) => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
        const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
        const data = new Int16Array(bytes.buffer);
        const float32 = new Float32Array(data.length);
        for (let i = 0; i < data.length; i++) float32[i] = data[i] / 32768.0;

        const buffer = ctx.createBuffer(1, float32.length, 24000);
        buffer.getChannelData(0).set(float32);

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);
    } catch (e) {
        console.error("Audio Playback Error", e);
    }
};
