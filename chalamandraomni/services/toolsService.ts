
import { ExternalProvider } from "../types";
import { getProvider } from "./aiRegistry";
import { getApiKey } from "./config";

/**
 * TOOLS ORCHESTRATOR
 */

export const summarizeContent = async (text: string, providerType: ExternalProvider | 'gemini', apiKey?: string): Promise<string> => {
    // 1. Try Native if requested and available
    if (providerType === 'nano' && window.ai?.summarizer) {
        try {
            const capabilities = await window.ai.summarizer.capabilities();
             if (capabilities.available !== 'no') {
                const summarizer = await window.ai.summarizer.create();
                const result = await summarizer.summarize(text);
                return result;
             }
        } catch (e) {
            console.warn("Native summarizer failed, falling back to Nano LM", e);
        }
    }

    // 2. Fallback to standard generation via Synapse logic (Provider)
    const provider = getProvider(providerType);

    // If external/gemini, ensure key is present (Provider handles it internally but we can check early)
    if (providerType !== 'nano' && !getApiKey()) {
        throw new Error("API Key required for Cloud Summary");
    }

    const res = await provider.generate({
        systemPrompt: "You are an expert summarizer. Be concise and capture the essence.",
        userPrompt: `Summarize this text:\n\n${text}`
    });

    return res.text;
};

export const rewriteContent = async (text: string, tone: 'formal' | 'casual' | 'fluent', providerType: ExternalProvider | 'gemini', apiKey?: string): Promise<string> => {
    // 1. Try Native Rewriter
    if (providerType === 'nano' && window.ai?.rewriter) {
        try {
             const capabilities = await window.ai.rewriter.capabilities();
             if (capabilities.available !== 'no') {
                const rewriter = await window.ai.rewriter.create({ tone: tone });
                return await rewriter.rewrite(text);
             }
        } catch (e) {
            console.warn("Native rewriter failed, falling back to Nano LM", e);
        }
    }

    const provider = getProvider(providerType);
    const res = await provider.generate({
        systemPrompt: `You are a professional editor. Tone: ${tone}.`,
        userPrompt: `Rewrite the following text:\n\n${text}`
    });

    return res.text;
};

export const proofreadContent = async (text: string, providerType: ExternalProvider | 'gemini', apiKey?: string): Promise<string> => {
    // 1. Try Nano LM (Writer/Rewriter doesn't always have proofread mode explicitly)
    // There is a `writer` API appearing in Chrome, let's keep it simple with LM for now if not available.

    const provider = getProvider(providerType);
    const res = await provider.generate({
        systemPrompt: "You are a strict proofreader. Fix grammar and spelling only. Keep the original meaning perfectly.",
        userPrompt: `Proofread this text:\n\n${text}`
    });

    return res.text;
};

/**
 * Helper: Check for Gemini Nano Availability
 */
export const checkNanoAvailability = async (): Promise<boolean> => {
    if (!window.ai?.languageModel) return false;
    try {
        const cap = await window.ai.languageModel.capabilities();
        return cap.available === 'readily';
    } catch {
        return false;
    }
};
