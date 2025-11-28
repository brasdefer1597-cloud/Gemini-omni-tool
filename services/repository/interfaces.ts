
// services/repository/interfaces.ts
import { GenerateContentResponse, ModelConfig, Part } from "@/types";

/**
 * Interfaz para un repositorio que maneja la generación de contenido de chat.
 */
export interface IChatRepository {
    /**
     * Genera contenido de texto basado en un prompt.
     */
    generateText(prompt: string, imageParts: Part[] | null, modelConfig: ModelConfig): Promise<GenerateContentResponse>;
    
    /**
     * Inicia la generación de video y devuelve un ID de trabajo.
     */
    generateVideo(prompt: string, imageParts: Part[] | null, modelConfig: ModelConfig): Promise<{ jobId: string }>;

    /**
     * Consulta el estado de un trabajo de generación de video.
     */
    pollVideo(jobId: string): Promise<GenerateContentResponse>;
}

/**
 * Define el contrato para la generación de imágenes (Pro Image Gen).
 */
export interface IImageRepository {
  /**
   * Genera una imagen a partir de un prompt y especificaciones de formato.
   * @param prompt El texto base para la generación.
   * @param config Configuración de formato (ej. resolución, aspect ratio).
   * @returns Un objeto con el URL o binario de la imagen generada.
   */
  generateImage(prompt: string, config: { resolution: string; aspectRatio: string }): Promise<{ url: string; metadata: any }>;
}

/**
 * Define el contrato para la generación de video (Veo Video Studio).
 */
export interface IVideoRepository {
  /**
   * Genera un video a partir de un prompt y especificaciones.
   * @param prompt El texto base, o el ID de una imagen previa para animación.
   * @param duration Duración deseada del video.
   * @returns Un objeto con el URL o ID del video generado.
   */
  generateVideo(prompt: string, config: { duration: number; style: string }): Promise<{ url: string; jobId: string }>;
}
