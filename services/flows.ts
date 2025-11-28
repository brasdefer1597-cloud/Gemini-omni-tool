
// services/flows.ts
/**
 * @file Define los flujos de Genkit-lite que orquestan la lógica del negocio y las llamadas a la IA.
 */

import { defineFlow } from "./genkitOrchestrator";
import { getHeuristicInsight, HeuristicInsight } from "./chalamandraCore";
import { ServiceFactory } from "./repository/ServiceFactory";
import { ModelConfig } from "./repository/interfaces";

// Obtenemos una instancia del repositorio de chat para usarla en nuestros flujos
const chatRepo = ServiceFactory.getChatRepository();

// --- Definiciones de Pasos de IA ---
// Estos son los pasos que interactuarán con Gemini.

interface ExpansionInput {
    insight: string;
    prompt: string;
}

async function expandWithAI(input: ExpansionInput): Promise<string> {
    const modelConfig: ModelConfig = { 
        model: 'gemini-pro', // Usamos un modelo rápido como Flash para expansión
        temperature: 0.5,
        maxOutputTokens: 250,
    };
    
    const prompt = `Based on the following insight: "${input.insight}", expand on the original prompt: "${input.prompt}". Provide a more detailed request for cái gì.`;
    
    const response = await chatRepo.generateText(prompt, null, modelConfig);
    return response.content;
}

async function generateTacticalPlan(expandedPrompt: string): Promise<string> {
    const modelConfig: ModelConfig = { 
        model: 'gemini-pro', // Usamos un modelo más potente para la planificación
        temperature: 0.7,
        maxOutputTokens: 500,
    };

    const prompt = `Given the following expanded request, create a concise, step-by-step tactical plan to address it. Format the output as a numbered list.

Request: "${expandedPrompt}"`;

    const response = await chatRepo.generateText(prompt, null, modelConfig);
    return response.content;
}


// --- Definición del Flujo ---

export const heuristicAnalysisFlow = defineFlow(
    'heuristicAnalysis',
    [
        {
            name: 'getHeuristicInsight',
            fn: (input: { prompt: string }) => getHeuristicInsight(input),
        },
        {
            name: 'expandWithAI',
            fn: (input: HeuristicInsight) => expandWithAI({ insight: input.insight, prompt: input.prompt }),
        },
        {
            name: 'generateTacticalPlan',
            fn: generateTacticalPlan,
        },
    ]
);
