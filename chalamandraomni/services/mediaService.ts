
import { Attachment } from "../types";
import { getApiKey, AI_CONFIG } from "./config";
import { GoogleGenAI } from "@google/genai";

// Specific media generation service
// Keeping it separate from core Synapse for now as it uses specific models/configs

const getClient = () => {
    const key = getApiKey();
    if (!key) throw new Error("API Key Missing");
    return new GoogleGenAI({ apiKey: key });
};

/**
 * CREATIVE STUDIO (Imagen & Video)
 */
export const generateImage = async (prompt: string, aspectRatio: string) => {
  const ai = getClient();
  const res = await ai.models.generateContent({
    model: AI_CONFIG.gemini.image,
    contents: { parts: [{ text: prompt }] },
    config: { imageConfig: { aspectRatio: aspectRatio as any } }
  });
  const data = res.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
  return `data:image/png;base64,${data}`;
};

export const generateVeoVideo = async (prompt: string, ratio: '16:9' | '9:16', img?: Attachment) => {
  const ai = getClient();
  // Using the config model
  let op = await ai.models.generateVideos({
    model: AI_CONFIG.gemini.video,
    prompt: prompt || undefined,
    image: img ? { imageBytes: img.data, mimeType: img.mimeType } : undefined,
    config: { numberOfVideos: 1, resolution: '720p', aspectRatio: ratio }
  });

  // Poll for completion
  while (!op.done) {
    await new Promise(r => setTimeout(r, 5000));
    op = await ai.operations.getVideosOperation({ operation: op });
  }

  if (op.error) {
      throw new Error(`Video Generation Failed: ${op.error.message}`);
  }

  // Fetch result
  const uri = op.response?.generatedVideos?.[0]?.video?.uri;
  if (!uri) throw new Error("No video URI returned");

  const res = await fetch(`${uri}&key=${getApiKey()}`);
  return URL.createObjectURL(await res.blob());
};
