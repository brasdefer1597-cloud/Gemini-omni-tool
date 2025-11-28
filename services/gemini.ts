
// services/gemini.ts
/**
 * @file Facade para interactuar con los servicios de IA de Gemini.
 * Centraliza la lógica de cliente, asegurando que todos los componentes
 * usen la misma instancia configurada del adaptador y, por lo tanto,
 * la misma gestión de credenciales, estado de Circuit Breaker y telemetría.
 */

import { geminiAdapter } from './GeminiAdapter'; // Corregido
import { ModelConfig, ImageConfig, GenerationResult } from '../types'; // Corregido

/**
 * Genera contenido (texto o llamadas a funciones) usando el modelo Gemini Pro.
 * @param prompt El prompt de texto para el modelo.
 * @param imageBase64 (Opcional) Una imagen en formato base64.
 * @param config La configuración del modelo a utilizar.
 * @param tools (Opcional) Las herramientas que el modelo puede llamar.
 * @returns Una promesa que se resuelve con un GenerationResult.
 */
export const generateContent = (
    prompt: string,
    imageBase64: string | null,
    config: ModelConfig,
    tools?: any[]
): Promise<GenerationResult> => {
    return geminiAdapter.generateContent(prompt, imageBase64, config, tools);
};

/**
 * Genera una imagen usando el modelo Imagen.
 * @param prompt El prompt de texto para generar la imagen.
 * @param config La configuración de la imagen a generar.
 * @returns Una promesa que se resuelve con la imagen en formato base64.
 */
export const generateImage = (prompt: string, config: ImageConfig): Promise<string> => {
    return geminiAdapter.generateImage(prompt, config);
};
