
// services/geminiService.ts
// SENIOR COMMENT: Este es el nuevo geminiService.ts, el corazón de nuestras operaciones de IA.
// Hemos pasado de llamadas directas a un sistema instrumentado, versionado y evaluable.

import { GoogleGenerativeAI } from "@google/generative-ai";
import { traceable } from "langsmith/traceable"; // CORE: La función para hacer nuestro código observable.
import { Client } from "langsmith"; // CORE: El cliente de LangSmith para interactuar con la plataforma.
import { DialecticResult, ChatMessage, Attachment } from "../types";

// NOTE: langsmith/hub is not available in the langsmith package exports.
// We must use the Client to pull prompts if the SDK supports it, or use langchain/hub if installed.
// The user code imported `* as hub from "langsmith/hub"`.
// Checking the langsmith package, it does NOT export `hub`.
// It exports `client`, `traceable`, `evaluation`, `schemas`, etc.
// The LangSmith Hub client is typically `langchain/hub` or accessed via `Client`.
// However, looking at LangSmith JS SDK docs (implied), `hub` might be a separate package or under a different import.
// But we found it is NOT in `langsmith` exports.
// We will assume the prompt pulling must be done via `Client` or stubbed for now if not easily available without `langchain`.
// Update: `langchain` was installed as dependency of `@langchain/langgraph`.
// We can try `import * as hub from "langchain/hub"`.

let hub: any;
try {
    hub = require("langchain/hub");
} catch (e) {
    console.warn("langchain/hub not found");
}

// SENIOR COMMENT: Centralizamos la configuración. Las claves de API ahora se gestionan
// a través de variables de entorno, un requisito para cualquier sistema de producción.
const client = new Client({
  apiKey: process.env.LANGCHAIN_API_KEY,
});

const getGoogleAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY no está configurada en el entorno.");
  }
  return new GoogleGenerativeAI(apiKey);
};

// --- FUNCIÓN CLAVE: DIALECTIC ACTION INSTRUMENTADA ---

// SENIOR COMMENT: @traceable es nuestro sensor. Automágicamente captura inputs, outputs, errores
// y rendimiento de esta función, creando una traza detallada en LangSmith.
export const performDialecticAction = traceable(
  async (coreIdea: string, level: number, engine: "cloud" | "local"): Promise<DialecticResult> => {

    // SENIOR COMMENT: ¡No más prompts hardcodeados!
    // Tiramos de un prompt versionado desde el LangSmith Hub.

    let promptTemplate;
    if (hub) {
        try {
            promptTemplate = await hub.pull("chalamandra-dialectic:latest");
        } catch (e) {
            console.warn("Failed to pull prompt from Hub", e);
        }
    }

    const genAI = getGoogleAIClient();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    let formattedPrompt: string;
    if (promptTemplate) {
        // Assuming promptTemplate is a Runnable or has format/invoke
        if (typeof promptTemplate.invoke === 'function') {
             const res = await promptTemplate.invoke({
                core_idea: coreIdea,
                analysis_level: level,
             });
             formattedPrompt = typeof res === 'string' ? res : JSON.stringify(res);
        } else if (typeof promptTemplate.format === 'function') {
             formattedPrompt = await promptTemplate.format({
              core_idea: coreIdea,
              analysis_level: level,
            });
        } else {
             formattedPrompt = `Analyze: ${coreIdea} (Level ${level})`;
        }
    } else {
        // Fallback
        formattedPrompt = `Analyze the core idea: ${coreIdea} at level ${level}. Return a JSON with { fresa: { confidence: number, analysis: string }, synthesis: string }.`;
    }

    const result = await model.generateContent(formattedPrompt);
    const responseText = result.response.text();

    // SENIOR COMMENT: Asumimos que la respuesta es un JSON parseable.
    let parsedResult: DialecticResult;
    try {
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/```\n([\s\S]*?)\n```/);
        const jsonStr = jsonMatch ? jsonMatch[1] : responseText;
        parsedResult = JSON.parse(jsonStr) as DialecticResult;
    } catch (e) {
        console.error("Failed to parse JSON response", e);
        // Return a dummy error result or throw
        throw new Error("Invalid JSON response from model");
    }

    return parsedResult;
  },
  // SENIOR COMMENT: Nombrar la traza es crucial para la organización.
  { name: "Perform Dialectic Action" }
);

// Ejemplo de cómo registrar el feedback del usuario
export const logUserFeedback = async (runId: string, score: number, comment?: string) => {
    // SENIOR COMMENT: `runId` se obtendría del estado de la UI después de una llamada a la IA.
    await client.createFeedback(runId, "user_score", {
        score: score, // 1 para bueno, 0 para malo
        comment: comment
    });
};
