
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

// --- Model & Generation --- //
export interface ModelConfig {
    model: string;
    temperature: number;
    maxOutputTokens: number;
    systemInstruction?: string; // Ahora parte de la configuración
}

export interface ImageConfig {
  numberOfImages: number;
  outputMimeType: 'image/jpeg' | 'image/png';
  aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
}

export interface Tool {
    name: string;
    description: string;
}

export type GenerationResult = { type: 'text', content: string } | { type: 'tool_call', toolName: string; args: Record<string, any> };


// --- Adapters & Services --- //
export interface IGenAIAdapter {
  generateContent(prompt: string, imageBase64: string | null, config: ModelConfig, tools?: Tool[]): Promise<GenerationResult>;
  generateImage(prompt: string, config: ImageConfig): Promise<string>;
}
