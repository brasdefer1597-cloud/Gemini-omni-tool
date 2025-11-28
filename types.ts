
// types.ts
/**
 * @file Archivo maestro de tipos y contratos.
 * Centraliza todas las interfaces, enums y tipos para simplificar las importaciones
 * y evitar problemas de resolución de módulos en un entorno de desarrollo plano.
 */

// --- Telemetry --- //
export interface ITelemetryClient {
    trackEvent(name: string, properties?: Record<string, any>): void;
    trackError(error: Error, properties?: Record<string, any>): void;
}

export interface ITelemetry {
    trackLatency(endpoint: string, startTime: number, status: 'SUCCESS' | 'ERROR', modelName: string): void;
    logFeedback(sessionId: string, rating: number, messageId: string): void;
}

export interface MetricPayload {
    eventName: string;       // Ej: 'Flow.Start', 'Api.Call.Success', 'User.Feedback'
    flowName?: string;       // El nombre del flujo que se está ejecutando
    stepName?: string;       // El paso específico dentro de un flujo
    duration?: number;       // Duración de la operación en milisegundos
    modelName?: string;      // El modelo de IA utilizado (ej: 'gemini-pro')
    statusCode?: number;     // Código de estado HTTP si es una llamada de red
    input?: any;             // Datos de entrada (¡cuidado con la PII!)
    output?: any;            // Datos de salida (¡cuidado con la PII!)
    error?: {                // Detalles del error si ocurrió uno
        message: string;
        stack?: string;
    };
    [key: string]: any;      // Permite propiedades adicionales y dinámicas
}

// --- Model & Generation --- //
export interface ModelConfig {
    model: string;
    temperature: number;
    maxOutputTokens: number;
    systemInstruction?: string; // Ahora parte de la configuración
    topP?: number;
    topK?: number;
}

export interface ImageConfig {
  numberOfImages: number;
  outputMimeType: 'image/jpeg' | 'image/png';
  aspectRatio: '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '16:9' | '21:9';
  resolution: '1K' | '2K' | '4K';
}

export interface Tool {
    name: string;
    description: string;
}

export type GenerationResult = { type: 'text', content: string } | { type: 'tool_call', toolName: string; args: Record<string, any> };

export interface GenerateContentResponse {
    type: 'text' | 'video_result';
    content: string;
    jobId?: string;
}

export interface VideoJobStatus {
    status: 'processing' | 'completed' | 'failed';
    url?: string;
    progress: number;
}

// --- Adapters & Services --- //
export interface IGenAIAdapter {
  generateContent(prompt: string, imageBase64: string | null, config: ModelConfig, tools?: Tool[], fileUri?: string): Promise<GenerationResult>;
  generateImage(prompt: string, config: ImageConfig): Promise<string>;
  uploadFile(file: File): Promise<string>;
}

export interface IChatRepository {
    generateContent(prompt: string, config: ModelConfig): Promise<GenerateContentResponse>;
    generateVideo(prompt: string, progressCallback: (p: number) => void): Promise<VideoJobStatus>;
    generateText(prompt: string, imageParts: any[] | null, modelConfig: ModelConfig): Promise<GenerateContentResponse>;
    pollVideo(jobId: string): Promise<GenerateContentResponse>;
}
