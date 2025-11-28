
// services/gemini.ts
/**
 * @file Facade para interactuar con los servicios de IA de Gemini.
 * Centraliza la lógica de cliente, asegurando que todos los componentes
 * usen la misma instancia configurada del adaptador y, por lo tanto,
 * la misma gestión de credenciales, estado de Circuit Breaker y telemetría.
 */

import { geminiAdapter } from './GeminiAdapter'; 
import { ModelConfig, ImageConfig, GenerationResult } from '../types'; 

/**
 * Genera contenido de texto simple.
 * @param prompt El prompt de texto para el modelo.
 * @param config La configuración del modelo a utilizar.
 * @returns Una promesa que se resuelve con el texto generado.
 */
export const generateText = async (
    prompt: string,
    config: ModelConfig
): Promise<string> => {
    const result = await geminiAdapter.generateContent(prompt, null, config);
    if (result.type === 'text') {
        return result.content;
    }
    // En este flujo simple, no se esperan llamadas a herramientas.
    return "Error: Se recibió una respuesta inesperada del modelo.";
};

/**
 * Orquesta la subida de un archivo y la generación de contenido basada en ese archivo.
 * @param prompt El prompt de texto que acompaña al archivo.
 * @param file El archivo a subir (ej: PDF, TXT).
 * @param config La configuración del modelo a utilizar.
 * @returns Una promesa que se resuelve con el texto generado.
 */
export const generateTextWithFile = async (
    prompt: string,
    file: File,
    config: ModelConfig
): Promise<string> => {
    console.log(`[gemini.ts] Iniciando flujo de generación con archivo: ${file.name}`);
    
    // 1. Subir el archivo y obtener el URI
    const fileUri = await geminiAdapter.uploadFile(file);

    // 2. Generar contenido usando el URI del archivo
    const result = await geminiAdapter.generateContent(prompt, null, config, [], fileUri);

    if (result.type === 'text') {
        return result.content;
    }
    
    return "Error: Se recibió una respuesta inesperada del modelo.";
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
