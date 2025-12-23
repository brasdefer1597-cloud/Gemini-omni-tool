
// services/geminiService.ts
/**
 * @file Core Intelligence Orchestrator & Unified API Gateway.
 * Centralizes intelligence requests, managing routing between Cloud (Gemini) and Local (Nano) engines.
 * Implements "Dialectic" flow and "Cognitive Logs".
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { geminiAdapter } from './GeminiAdapter'; // Re-use for low-level cloud calls if needed, or implement direct here.
// We will implement direct calls here to have full control over the "Orchestration"

// --- Types ---

export type ServiceMode = 'auto' | 'fast' | 'elite' | 'nano';

export interface OrchestratorRequest {
    prompt: string;
    mode: ServiceMode;
    context?: any; // For future recursive memory
}

export interface OrchestratorResponse {
    content: string;
    usedEngine: string;
    latency: number;
    sentimentAnalysis?: string; // Placeholder for Cognitive Logs
}

// --- Configuration ---

const MODELS = {
    ELITE: 'gemini-1.5-pro',
    FAST: 'gemini-1.5-flash',
};

// --- Local (Nano) Interface ---

declare global {
    interface Window {
        ai?: {
            canCreateTextSession: () => Promise<string>;
            createTextSession: () => Promise<any>;
        };
    }
}

// --- Service Implementation ---

class GeminiService {
    private genAI: GoogleGenerativeAI | null = null;
    private apiKey: string | null = null;

    constructor() {
        this.initializeClient();
    }

    private async initializeClient() {
        // Try to get key from environment or prompt
        // Ideally this should come from a secure config service
        // For now, we assume it's available via the Adapter logic or env
         if (window.aistudio && typeof window.aistudio.getApiKey === 'function') {
            try {
                this.apiKey = await window.aistudio.getApiKey();
            } catch (e) {
                console.warn("Could not retrieve API key from AI Studio.");
            }
        }
    }

    private async getClient(): Promise<GoogleGenerativeAI> {
        if (!this.genAI) {
            if (!this.apiKey) {
                 // Fallback prompt if not found (simulating Adapter behavior)
                 const key = prompt("Please enter your Gemini API Key for Elite Mode:");
                 if (!key) throw new Error("API Key required for Cloud modes.");
                 this.apiKey = key;
            }
            this.genAI = new GoogleGenerativeAI(this.apiKey);
        }
        return this.genAI;
    }

    /**
     * The Heart of the Orchestrator.
     * Decides which engine to use based on mode and availability.
     */
    async routeRequest(request: OrchestratorRequest): Promise<OrchestratorResponse> {
        const startTime = performance.now();
        console.log(`[Core Orchestrator] Routing request. Mode: ${request.mode}`);

        let responseContent = "";
        let engineUsed = "";

        try {
            // 1. Check for Local/Nano Preference or Fallback
            if (request.mode === 'nano') {
                if (await this.isNanoAvailable()) {
                    responseContent = await this.runNano(request.prompt);
                    engineUsed = "Chrome Built-in AI (Nano)";
                } else {
                    console.warn("Nano requested but unavailable. Falling back to Fast Cloud.");
                    // Fallback to Fast if Nano missing
                    return this.routeRequest({ ...request, mode: 'fast' });
                }
            }
            // 2. Cloud Modes
            else {
                const client = await this.getClient();
                let modelName = MODELS.FAST;
                let systemInstruction = "You are Chalamandra, a helpful AI assistant.";

                if (request.mode === 'elite') {
                    modelName = MODELS.ELITE;
                    systemInstruction = "You are Chalamandra Elite, a Master Architect. Provide deep, reasoned, and elegant solutions. Adopt the persona of a 'Guru/Experto Maestro Senior Elite'.";
                } else if (request.mode === 'fast') {
                    modelName = MODELS.FAST;
                    systemInstruction = "You are Chalamandra Fast. Be concise, direct, and efficient.";
                } else if (request.mode === 'auto') {
                    // Heuristic: Short prompts -> Fast, Long/Complex -> Elite
                    // This is a simple heuristic for the "Orchestrator" logic
                    if (request.prompt.length > 200 || request.prompt.toLowerCase().includes('plan') || request.prompt.toLowerCase().includes('architect')) {
                        modelName = MODELS.ELITE;
                        systemInstruction = "You are Chalamandra Elite (Auto-Routed). Analyze deeply.";
                    } else {
                        modelName = MODELS.FAST;
                        systemInstruction = "You are Chalamandra Fast (Auto-Routed). Respond quickly.";
                    }
                }

                const model = client.getGenerativeModel({ model: modelName, systemInstruction });
                const result = await model.generateContent(request.prompt);
                responseContent = result.response.text();
                engineUsed = `Google Cloud (${modelName})`;
            }

        } catch (error: any) {
            console.error("[Core Orchestrator] Error:", error);
            responseContent = `**System Error**: ${error.message}`;
            engineUsed = "Error Recovery";
        }

        const endTime = performance.now();

        // 3. Cognitive Logs (Simulation)
        // In a real scenario, this would log to a local vector store or DB
        this.logCognition(request, responseContent, engineUsed);

        return {
            content: responseContent,
            usedEngine: engineUsed,
            latency: endTime - startTime,
        };
    }

    // --- Nano Mechanics ---

    private async isNanoAvailable(): Promise<boolean> {
        if (!window.ai) return false;
        try {
            const status = await window.ai.canCreateTextSession();
            return status === 'readily';
        } catch (e) {
            return false;
        }
    }

    private async runNano(prompt: string): Promise<string> {
        if (!window.ai) throw new Error("Nano not found");
        const session = await window.ai.createTextSession();
        // Simple chain-of-thought simulation for Nano if needed, or direct prompt
        const result = await session.prompt(prompt);
        session.destroy();
        return result;
    }

    // --- Cognitive Logs ---

    private logCognition(request: OrchestratorRequest, response: string, engine: string) {
        console.groupCollapsed(`[Cognitive Log] ${new Date().toISOString()}`);
        console.log("Input:", request.prompt);
        console.log("Mode:", request.mode);
        console.log("Engine:", engine);
        console.log("Output Preview:", response.substring(0, 50) + "...");
        // Future: Analyze sentiment of response or next user interaction
        console.groupEnd();
    }
}

export const geminiService = new GeminiService();
