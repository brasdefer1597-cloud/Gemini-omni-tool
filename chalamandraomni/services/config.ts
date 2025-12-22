export const AI_CONFIG = {
  gemini: {
    pro: 'gemini-1.5-pro-latest', // Updated to a more stable latest version
    flash: 'gemini-1.5-flash-latest',
    flashLite: 'gemini-1.5-flash-8b-latest', // Fast/Lite
    image: 'gemini-1.5-pro-latest', // Image generation capability
    video: 'veo-2.0-generate-preview-0127', // Updated Veo model if available, else fallback
  },
  external: {
    deepseek: {
      url: 'https://api.deepseek.com/chat/completions',
      model: 'deepseek-reasoner'
    },
    openai: {
      url: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-4o'
    }
  },
  defaultThinkingBudget: 2048
};

// Centralized Key Management (can be expanded to use localStorage or specialized vaults)
export const getApiKey = (): string | undefined => {
  if (typeof window === 'undefined') return process.env.API_KEY;
  return process.env.API_KEY || localStorage.getItem('CHALAMANDRA_API_KEY') || undefined;
};

export const setApiKey = (key: string) => {
  if (typeof window !== 'undefined') {
      localStorage.setItem('CHALAMANDRA_API_KEY', key);
  }
};
