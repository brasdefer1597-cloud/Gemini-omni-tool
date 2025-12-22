
import { Attachment, ExternalProvider } from "../types";
import { getProvider } from "./aiRegistry";
import { AI_CONFIG } from "./config";
import { playAudio } from "./utils"; // Re-exporting if needed or direct usage

/**
 * OMNI-CHAT ORCHESTRATOR
 * Maneja dinámicamente el ruteo de modelos según la necesidad de latencia o profundidad.
 */
export const sendAdvancedChat = async (
  history: { role: string; parts: any[] }[],
  newMessage: string,
  attachments: Attachment[],
  options: { useThinking: boolean; useSearch: boolean; useTTS: boolean; useFast: boolean; }
) => {
  const provider = getProvider('gemini'); // Using the strong abstraction

  // Selección de Modelo Quirúrgica
  const model = options.useFast ? AI_CONFIG.gemini.flashLite :
                options.useSearch ? AI_CONFIG.gemini.flash : AI_CONFIG.gemini.pro;

  // Tools configuration
  const tools: any[] = [];
  if (options.useSearch) {
      tools.push({ googleSearch: {} });
  }

  // Build the unified Request object
  const messages = history.map(h => ({
      role: h.role,
      content: h.parts // Pass parts directly, logic inside Provider will handle it
  }));

  // Attachments are already part of the message structure in the UI,
  // but if new attachments are passed separately, we should add them to the last message or create a new one.
  // The UI sends them in the `userMsg` which is appended to `history` by the UI component?
  // Checking `OmniChat.tsx`: it updates `messages` state locally, then constructs `history` from it.
  // `userMsg.text` and `userMsg.attachments` are passed.

  // Wait, `OmniChat` constructs `history` but also passes `newMessage`.
  // If `history` includes the new message, we shouldn't duplicate.
  // Let's look at `OmniChat` again.
  // It appends `userMsg` to `messages` state.
  // Then `history` is mapped from `messages`.
  // SO `history` ALREADY CONTAINS the new message.

  // The `sendAdvancedChat` signature has `newMessage` and `attachments` separately,
  // likely redundant if `history` is full.
  // But let's respect the signature.

  // In `OmniChat.tsx`:
  // const userMsg = { ... }; setMessages(...userMsg);
  // const history = messages.map(...) <-- This includes userMsg
  // sendAdvancedChat(history, userMsg.text, ...)

  // So `history` has everything. We can ignore `newMessage` unless we want to rebuild it.
  // BUT the Provider expects `messages`.

  const response = await provider.generate({
      model,
      messages: messages, // History includes the latest message
      thinkingBudget: options.useThinking ? AI_CONFIG.defaultThinkingBudget : undefined,
      tools: tools.length > 0 ? tools : undefined
  });

  // TTS Integration (Kore Voice)
  // Since we already have the text, we can request TTS separately or via the same provider if supported.
  // For now, we do a separate call if needed, mirroring the original logic.
  let audioData: string | undefined = undefined;
  if (options.useTTS && response.text) {
     try {
         const ttsReq = {
             model: "gemini-2.5-flash-preview-tts", // specific model for TTS
             userPrompt: response.text, // Just the text to speak
             // Special config for TTS would be needed in Provider...
             // For now, let's keep it simple or implement a specific TTS method in Synapse/Provider
         };
         // We might need to extend Provider to support TTS specific config or use a direct call here.
         // Let's defer TTS perfection for now or use a dedicated TTS helper.
         audioData = await generateTTS(response.text);
     } catch (e) { console.warn("TTS Skip", e); }
  }

  return { text: response.text, audioData, sources: undefined }; // Sources not easily available in unified response yet
};

// Internal TTS Helper (using Gemini directly for now as it's specific)
import { GoogleGenAI, Modality } from "@google/genai";
import { getApiKey } from "./config";

const generateTTS = async (text: string) => {
    const key = getApiKey();
    if (!key) return undefined;
    const client = new GoogleGenAI({ apiKey: key });

    const tts = await client.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: { parts: [{ text }] },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
        }
    });
    return tts.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
}
