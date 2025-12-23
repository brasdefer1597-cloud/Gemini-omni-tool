
// services/geminiService.ts
/**
 * @file Core Intelligence Orchestrator & Unified API Gateway.
 * Centralizes intelligence requests, managing routing between Cloud (Gemini) and Local (Nano) engines.
 * Implements "Dialectic" flow and "Cognitive Logs".
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { geminiAdapter } from './GeminiAdapter'; // Re-use for low-level cloud calls if needed, or implement direct here.

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
        aistudio?: {
            getApiKey: () => Promise<string>;
        }
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
        if (window.aistudio && typeof window.aistudio.getApiKey === 'function') {
            try {
                this.apiKey = await window.aistudio.getApiKey();
            } catch (e) {
                console.warn("Could not retrieve API key from AI Studio.");
            }
        }
    }

    public switchApiKey() {
        const key = prompt("Enter new Gemini API Key:");
        if (key) {
            this.apiKey = key;
            this.genAI = new GoogleGenerativeAI(this.apiKey);
            alert("API Key updated for session.");
        }
    }

    private async getClient(): Promise<GoogleGenerativeAI> {
        if (!this.genAI) {
            if (!this.apiKey) {
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
        console.groupEnd();
    }
}

export const geminiService = new GeminiService();

/**
 * Switch API Key helper export
 */
export const switchApiKey = () => geminiService.switchApiKey();

/**
 * Generates a security vulnerability report based on user input.
 * Uses the Elite model to analyze the psychological triggers.
 */
export const generateSecurityReport = async (firewallTest: string, apiMap: { trigger: string, emotion: string, output: string }) => {
    const prompt = `
    ACT AS: Cyber-Psychology Defense System (Chalamandra Security).
    TASK: Analyze the following user vulnerability data.

    USER INPUT (Firewall Test - Reaction to Pressure): "${firewallTest}"

    EXPLOIT MAP (User defined API):
    - Trigger: "${apiMap.trigger}"
    - Internal State: "${apiMap.emotion}"
    - Output Action: "${apiMap.output}"

    OUTPUT JSON FORMAT:
    {
        "vulnerabilityLevel": "Critical" | "High" | "Moderate" | "Low",
        "detectedBias": "Name of the cognitive bias (e.g. Scarcity Heuristic, Authority Bias)",
        "diagnosis": "A short, sharp, technical explanation of why this loop is dangerous using cyber-security metaphors (e.g. 'Buffer overflow in amygdala').",
        "patch": "A concrete 'patch' or mantra to fix this specific loop."
    }

    RETURN ONLY RAW JSON.
    `;

    try {
        const response = await geminiService.routeRequest({
            prompt: prompt,
            mode: 'elite'
        });

        // Clean markdown code blocks if present
        let cleanJson = response.content.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJson);
    } catch (e) {
        console.error("Security Report Error", e);
        return {
            vulnerabilityLevel: "Unknown",
            detectedBias: "System Error",
            diagnosis: "Could not analyze data due to connection failure.",
            patch: "Retry connection."
        };
    }
};
