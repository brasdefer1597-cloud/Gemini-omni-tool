
// services/repository/interfaces.ts
/**
 * @file Define las interfaces para los repositorios de servicios de IA.
 * Estas abstracciones permiten desacoplar la lógica de la aplicación
 * de las implementaciones concretas de un proveedor de IA (ej. Gemini, OpenAI).
 */

import { Content, GenerateContentResult, GenerationConfig, ModelConfig, Part } from "../../types"; // Asumiendo que estos tipos existen

// Definimos los tipos aquí si no existen en otro lugar
// Esto es un marcador de posición
export interface ModelConfig {
    model: string;
    temperature: number;
    maxOutputTokens: number;
    topP?: number;
    topK?: number;
}

export interface GenerateContentResponse {
    type: 'text' | 'video_result';
    content: string;
    jobId?: string;
}

/**
 * Interfaz para un repositorio que maneja la generación de contenido de chat.
 */
export interface IChatRepository {
    /**
     * Genera contenido de texto basado en un prompt.
     * @param prompt El texto de entrada.
     * @param imageParts Partes de imagen opcionales para prompts multimodales.
     * @param modelConfig Configuración específica para el modelo.
     * @returns Una promesa que se resuelve con la respuesta de texto generada.
     */
    generateText(prompt: string, imageParts: Part[] | null, modelConfig: ModelConfig): Promise<GenerateContentResponse>;
    
    /**
     * Inicia la generación de video y devuelve un ID de trabajo.
     * @param prompt El texto de entrada.
     * @param imageParts Partes de imagen para la generación.
     * @param modelConfig Configuración específica para el modelo.
     * @returns Una promesa que se resuelve con un objeto que contiene el jobId.
     */
    generateVideo(prompt: string, imageParts: Part[] | null, modelConfig: ModelConfig): Promise<GenerateContentResponse>;

    /**
     * Consulta el estado de un trabajo de generación de video.
     * @param jobId El ID del trabajo a consultar.
     * @returns Una promesa que se resuelve con la URL del video si está listo, o un estado de procesamiento.
     */
    pollVideo(jobId: string): Promise<GenerateContentResponse>;
}

// Podríamos definir otras interfaces aquí en el futuro (ej. IImageRepository, IAudioRepository)

