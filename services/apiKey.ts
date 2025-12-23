
// services/apiKey.ts
/**
 * @file Securely manages the API key retrieval.
 * Prioritizes Environment Variable > Local Storage > Prompt.
 */

export const getApiKey = (): string | null => {
    // 1. Try Environment Variable (Injected via Vite/Server)
    if (typeof process !== 'undefined' && process.env.GEMINI_API_KEY) {
        return process.env.GEMINI_API_KEY;
    }

    // 2. Try Browser LocalStorage (if in browser context)
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedKey = localStorage.getItem('GEMINI_API_KEY');
        if (storedKey) return storedKey;
    }

    // In this mocked environment, we can return a placeholder if needed,
    // but returning null allows the caller to handle the missing key (e.g., prompt user).
    return null;
};
