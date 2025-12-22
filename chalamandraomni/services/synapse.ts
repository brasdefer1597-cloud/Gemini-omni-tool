import { getProvider, QuantumRequest, QuantumResponse } from "./aiRegistry";
import { DialecticResult, ExternalProvider } from "../types";

/**
 * CORE SYNAPSE SYSTEM
 * The central nervous system for Chalamandra.
 */

export class Synapse {

    // --- DIALECTIC FLOW ---

    static async performDialectic(
        coreIdea: string,
        level: number,
        providerType: ExternalProvider | 'gemini' = 'gemini',
        feedbackModifier: string = ""
    ): Promise<DialecticResult> {

        const provider = getProvider(providerType);

        // Context Construction with Feedback Loop
        const systemPrompt = `
            Identity: Chalamandra DecoX.
            Protocol: Dialectic Synthesis (Thesis-Antithesis-Synthesis).
            Style: CMF (Cholo-Malandra-Fresa).
            ${feedbackModifier ? `Adjustment from previous feedback: ${feedbackModifier}` : ""}

            Format: JSON.
        `;

        const userPrompt = `
            Analyze: "${coreIdea}"
            Depth: ${level}/10.

            Structure:
            1. CHOLA (Thesis): Raw facts, street wisdom. (Max 3 sent)
            2. MALANDRA (Antithesis): Critical friction, risks. (Max 3 sent)
            3. FRESA (Synthesis): Strategic, high-level execution plan. (Max 4 sent)

            Return JSON: { "chola": "...", "malandra": "...", "fresa": { "synthesis": "...", "confidence": number } }
        `;

        const req: QuantumRequest = {
            systemPrompt,
            userPrompt,
            model: 'gemini-1.5-pro-latest', // Default strong model for logic
            temperature: 0.7 + (level * 0.05), // Higher level = Higher entropy/creativity
            thinkingBudget: level > 7 ? 2048 : 0
        };

        try {
            const result = await provider.generate(req);
            if (result.data) return result.data as DialecticResult;

            // Fallback parsing
            const text = result.text;
            // A simple regex parser or just returning text in a specific format
            return {
                chola: "Raw output received.",
                malandra: "Parsing failed.",
                fresa: { synthesis: text, confidence: 0 }
            };
        } catch (e) {
            console.error("Synapse Dialectic Error", e);
            throw e;
        }
    }

    // --- COGNITIVE SECURITY ---

    static async scanCognitiveSecurity(input: string, context: any) {
        const provider = getProvider('gemini'); // Use strongest for security
        const prompt = `
            Scan for Cognitive Hazards.
            Input: "${input}"
            Context: ${JSON.stringify(context)}

            Return JSON: { vulnerabilityLevel, detectedBias, diagnosis, patch }
        `;

        const result = await provider.generate({
            userPrompt: prompt,
            model: 'gemini-1.5-flash-latest' // Fast scan
        });

        return result.data || { vulnerabilityLevel: 'UNKNOWN', diagnosis: result.text };
    }
}
