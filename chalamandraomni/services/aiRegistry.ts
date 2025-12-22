import { GoogleGenAI, Modality } from "@google/genai";
import { AI_CONFIG, getApiKey } from "./config";
import { Attachment, ExternalProvider } from "../types";

// --- Interfaces ---

export interface QuantumRequest {
  systemPrompt?: string;
  userPrompt?: string; // For simple one-shot
  messages?: { role: string; content: string | any[] }[]; // For chat
  attachments?: Attachment[];
  model?: string;
  temperature?: number;
  thinkingBudget?: number;
  tools?: any[]; // For function calling/search
}

export interface QuantumResponse {
  text: string;
  data?: any; // JSON parsed
  audioData?: string; // TTS result
  usage?: { input: number; output: number };
}

export interface IQuantumProvider {
  id: string;
  isAvailable(): Promise<boolean>;
  generate(req: QuantumRequest): Promise<QuantumResponse>;
  stream?(req: QuantumRequest, onChunk: (text: string) => void): Promise<void>;
}

// --- Implementations ---

// 1. Google Gemini Provider
export class GeminiProvider implements IQuantumProvider {
  id = 'gemini';
  private client: GoogleGenAI | null = null;

  constructor() {
    const key = getApiKey();
    if (key) this.client = new GoogleGenAI({ apiKey: key });
  }

  async isAvailable(): Promise<boolean> {
    return !!this.client;
  }

  async generate(req: QuantumRequest): Promise<QuantumResponse> {
    if (!this.client) throw new Error("Gemini Key Missing");

    const modelName = req.model || AI_CONFIG.gemini.pro;

    // Config construction
    const config: any = {
      systemInstruction: req.systemPrompt,
      generationConfig: {
        temperature: req.temperature,
      }
    };

    if (req.thinkingBudget) {
      config.thinkingConfig = { thinkingBudget: req.thinkingBudget };
    }

    if (req.tools) {
      config.tools = req.tools;
    }

    // Message construction
    let contents: any[] = [];
    if (req.messages) {
      // Map standard format to Gemini format if needed,
      // but @google/genai usually takes specific structures.
      // Simplify for now:
      contents = req.messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: Array.isArray(m.content) ? m.content : [{ text: m.content }]
      }));
    } else {
        const parts: any[] = [];
        if (req.attachments) {
            req.attachments.forEach(a => parts.push({ inlineData: { mimeType: a.mimeType, data: a.data } }));
        }
        if (req.userPrompt) parts.push({ text: req.userPrompt });
        contents.push({ role: 'user', parts });
    }

    // Call API
    try {
        const response = await this.client.models.generateContent({
            model: modelName,
            contents,
            config
        });

        return {
            text: response.text || "",
            // Attempt to parse JSON if it looks like JSON
            data: this.tryParse(response.text)
        };
    } catch (e: any) {
        console.error("Gemini Error:", e);
        throw new Error(`Gemini Flux Interrupted: ${e.message}`);
    }
  }

  private tryParse(text?: string) {
      if (!text) return undefined;
      try {
          // Remove Markdown blocks if present
          const clean = text.replace(/^```json\s*|```\s*$/g, '').trim();
          if (clean.startsWith('{')) return JSON.parse(clean);
      } catch { return undefined; }
      return undefined;
  }
}

// 2. Nano Provider (Chrome Built-in)
export class NanoProvider implements IQuantumProvider {
  id = 'nano';

  async isAvailable(): Promise<boolean> {
    return !!(window.ai?.languageModel && (await window.ai.languageModel.capabilities()).available === 'readily');
  }

  async generate(req: QuantumRequest): Promise<QuantumResponse> {
    if (!window.ai?.languageModel) throw new Error("Nano not found in this reality.");

    try {
        const session = await window.ai.languageModel.create({
            systemPrompt: req.systemPrompt
        });

        const prompt = req.userPrompt || (req.messages ? req.messages[req.messages.length -1].content as string : "");
        const result = await session.prompt(prompt);

        // session.destroy(); // Optional cleanup

        return { text: result };
    } catch (e: any) {
        throw new Error(`Nano Neuron Failed: ${e.message}`);
    }
  }
}

// 3. External (DeepSeek/OpenAI) - Simplified for brevity
export class ExternalRestProvider implements IQuantumProvider {
    id: string;
    private config: { url: string; model: string };

    constructor(id: 'deepseek' | 'openai') {
        this.id = id;
        this.config = AI_CONFIG.external[id];
    }

    async isAvailable(): Promise<boolean> {
        return !!getApiKey(); // Assumes same key for now, ideally separate
    }

    async generate(req: QuantumRequest): Promise<QuantumResponse> {
         const key = getApiKey();
         if (!key) throw new Error(`${this.id} Key Missing`);

         // Construct Messages
         const messages = req.messages || [];
         if (req.systemPrompt) messages.unshift({ role: 'system', content: req.systemPrompt });
         if (req.userPrompt) messages.push({ role: 'user', content: req.userPrompt });

         const res = await fetch(this.config.url, {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${key}`
             },
             body: JSON.stringify({
                 model: this.config.model,
                 messages,
                 response_format: req.model?.includes('json') ? { type: 'json_object' } : undefined
             })
         });

         if (!res.ok) throw new Error("External Signal Jammed");
         const data = await res.json();
         return {
             text: data.choices[0].message.content
         };
    }
}

// --- Registry Factory ---

export const getProvider = (type: ExternalProvider | 'gemini' = 'gemini'): IQuantumProvider => {
    switch (type) {
        case 'nano': return new NanoProvider();
        case 'deepseek': return new ExternalRestProvider('deepseek');
        case 'openai': return new ExternalRestProvider('openai');
        default: return new GeminiProvider();
    }
};
