
export interface DialecticResult {
  chola: string; // Thesis
  malandra: string; // Antithesis
  fresa: {
    synthesis: string;
    confidence: number;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  attachments?: Attachment[];
  audioData?: string; // Base64 audio for TTS
}

export interface Attachment {
  mimeType: string;
  data: string; // Base64
  name?: string;
}

export enum AppMode {
  DIALECTIC = 'dialectic',
  CHAT = 'chat',
  SECURITY = 'security',
  TOOLS = 'tools',
  STUDIO = 'studio',
  LIVE = 'live'
}

export type ExternalProvider = 'deepseek' | 'openai' | 'nano';

// Augment window for AI Studio and Chrome AI
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    // Audio Context Helper
    webkitAudioContext: typeof AudioContext;
    // Chrome Built-in AI
    ai?: {
      languageModel?: {
        capabilities: () => Promise<{ available: string }>;
        create: (options?: { systemPrompt?: string }) => Promise<any>;
      };
      summarizer?: {
        capabilities: () => Promise<{ available: string }>;
        create: (options?: any) => Promise<any>;
      };
      rewriter?: {
        capabilities: () => Promise<{ available: string }>;
        create: (options?: any) => Promise<any>;
      };
      writer?: {
         create: (options?: any) => Promise<any>;
      };
    };
  }
}
