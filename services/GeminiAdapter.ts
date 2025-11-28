
// services/GeminiAdapter.ts
/**
 * @file El centro neurálgico táctico del Omni-Tool.
 * Este adaptador no solo conecta con la API de Google, sino que infunde cada llamada
 * con la identidad CHALAMANDRA y el arsenal de herramientas (`Function Calling`).
 */

import { GoogleGenerativeAI, FunctionDeclarationSchemaType } from "@google/genai";
import { IGenAIAdapter, ModelConfig, GenerationResult, Tool, ImageConfig } from "../types";
import { SYSTEM_INSTRUCTION } from './GeminiOmniTool'; // Importa la identidad núcleo

// --- ARSENAL DE HERRAMIENTAS (FUNCTION CALLING DEFINITIONS) ---
const tools: Tool[] = [
    {
        functionDeclarations: [
            {
                name: "generate_image",
                description: "Crea una imagen a partir de una descripción detallada. Úsalo cuando el usuario pida explícitamente generar un arte, logo, visual o imagen.",
                parameters: {
                    type: FunctionDeclarationSchemaType.OBJECT,
                    properties: {
                        prompt: {
                            type: FunctionDeclarationSchemaType.STRING,
                            description: "Una descripción muy detallada y vívida de la imagen a generar."
                        },
                        style: {
                            type: FunctionDeclarationSchemaType.STRING,
                            description: "El estilo artístico deseado (ej: 'fotorealista', 'cyberpunk', 'fractal', 'minimalista')."
                        }
                    },
                    required: ["prompt", "style"]
                }
            },
            {
                name: "generate_video_concept",
                description: "Genera un concepto de video estructurado a partir de un tema. Úsalo para desarrollar ideas para contenido de video.",
                parameters: {
                    type: FunctionDeclarationSchemaType.OBJECT,
                    properties: {
                        topic: {
                            type: FunctionDeclarationSchemaType.STRING,
                            description: "El tema central del video."
                        },
                        length_minutes: {
                            type: FunctionDeclarationahDeclarationSchemaType.NUMBER,
                            description: "La duración aproximada del video en minutos."
                        }
                    },
                    required: ["topic"]
                }
            }
        ]
    }
];

// --- LÓGICA DE CONEXIÓN ROBUSTA (como antes) ---
declare global { interface Window { aistudio: { getApiKey: () => Promise<string>; } } }

async function getApiKey(): Promise<string> { 
    if (window.aistudio && typeof window.aistudio.getApiKey === 'function') {
        try { return await window.aistudio.getApiKey(); }
        catch (e) { throw new Error("Could not retrieve API key from AI Studio."); }
    } else {
        const key = prompt("Please enter your Gemini API Key:");
        if (!key) throw new Error("API Key not provided.");
        return key;
    }
}

// --- ADAPTADOR ESTRATÉGICO ---

export class GeminiAdapter implements IGenAIAdapter {
    private client: GoogleGenerativeAI | null = null;

    private async ensureClient(): Promise<GoogleGenerativeAI> {
        if (!this.client) {
            const apiKey = await getApiKey();
            this.client = new GoogleGenerativeAI(apiKey);
        }
        return this.client;
    }

    async generateContent(prompt: string, imageBase64: string | null, config: ModelConfig, fileUri?: string): Promise<GenerationResult> {
        const genAI = await this.ensureClient();
        
        // **Inyección de Identidad y Herramientas**
        const model = genAI.getGenerativeModel({
            model: config.model,
            systemInstruction: SYSTEM_INSTRUCTION, // Identidad núcleo inyectada
            tools: tools, // Arsenal de herramientas disponible
        });

        const parts: any[] = [{ text: prompt }];
        if (imageBase64) parts.push({ inlineData: { mimeType: 'image/jpeg', data: imageBase64 } });
        if (fileUri) parts.push({ fileData: { mimeType: 'application/octet-stream', fileUri: fileUri } });

        const result = await model.generateContent({ contents: [{ role: "user", parts }] });
        const response = result.response;

        // **Manejo de Respuesta Táctica**
        const functionCall = response.functionCalls()?.[0];
        if (functionCall) {
            console.log("[GeminiAdapter] Function Call Requested:", functionCall);
            return {
                type: 'tool_call',
                toolName: functionCall.name,
                args: functionCall.args,
            };
        } else {
            return {
                type: 'text',
                content: response.text(),
            };
        }
    }
    
    async uploadFile(file: File): Promise<string> { /* ... sin cambios ... */ }
    async generateImage(prompt: string, config: ImageConfig): Promise<string> { /* ... sin cambios ... */ }
}

export const geminiAdapter = new GeminiAdapter();
