
// services/chalamandraCore.ts
/**
 * @file Contiene la lógica de negocio principal de "Chalamandra".
 * Estas son funciones síncronas y puras que proporcionan información heurística.
 * Se exportan individualmente para ser compuestas por orquestadores como Genkit.
 */

export interface HeuristicInput {
    prompt: string;
}

export interface HeuristicInsight {
    insight: string;
    riskLevel: 'low' | 'medium' | 'high';
    prompt: string; // Passthrough para el siguiente paso
}

/**
 * Analiza un prompt de entrada y proporciona una visión heurística.
 * Este es un ejemplo de una función de lógica de negocio síncrona.
 * @param input La entrada que contiene el prompt.
 * @returns Una visión heurística.
 */
export function getHeuristicInsight(input: HeuristicInput): HeuristicInsight {
    console.log("Executing Chalamandra's heuristic insight core logic...");
    let riskLevel: HeuristicInsight['riskLevel'] = 'low';
    if (input.prompt.includes('urgent') || input.prompt.includes('critical')) {
        riskLevel = 'high';
    } else if (input.prompt.includes('important') || input.prompt.includes('review')) {
        riskLevel = 'medium';
    }

    return {
        insight: `The prompt seems to have a ${riskLevel} urgency based on keywords.`,
        riskLevel: riskLevel,
        prompt: input.prompt, // Se pasa el prompt para el siguiente paso del flujo
    };
}

/**
 * Otra función de ejemplo que podría ser parte del núcleo.
 * @param data Datos de entrada.
 * @returns Datos procesados.
 */
export function anotherChalamandraFunction(data: any): any {
    return { ...data, processed: true, timestamp: new Date().toISOString() };
}
