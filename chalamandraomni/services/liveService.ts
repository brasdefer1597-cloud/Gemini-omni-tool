
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { getApiKey, AI_CONFIG } from "./config";

/**
 * LIVE SESSION ORCHESTRATOR
 */
export const createLiveSession = async (params: {
  onOpen: () => void,
  onMessage: (msg: LiveServerMessage) => void,
  onError: (err: any) => void,
  onClose: () => void
}) => {
  const key = getApiKey();
  if (!key) throw new Error("API Key Missing");
  const ai = new GoogleGenAI({ apiKey: key });

  return ai.live.connect({
    model: AI_CONFIG.gemini.flashLite, // Use specific low latency model or config default
    callbacks: {
      onopen: params.onOpen,
      onmessage: params.onMessage,
      onerror: params.onError,
      onclose: params.onClose,
    },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
      },
      systemInstruction: "Identidad: Chalamandra OS. Eres un asistente vocal en tiempo real de baja latencia. Tu tono es directo, audaz y estratégico (CMF Style).",
    }
  });
};
