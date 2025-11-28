
// services/repository/GeminiChatRepository.ts
import { IChatRepository, VideoJobStatus } from "../../arch/contracts/IChatRepository";
import { GenerateContentResponse, ModelConfig } from "./interfaces";
import { TelemetryClient } from "../telemetry/TelemetryClient";
import { CircuitBreaker } from "../resilience/CircuitBreaker";
import { GoogleGenerativeAI, Part } from "@google/genai";

// --- Constantes de Resiliencia ---
const MAX_RETRIES = 3;
const BACKOFF_BASE_MS = 200;
const LRO_GLOBAL_TIMEOUT_MS = 120000; // 2 minutos para la generación de video

// --- Simulación de API de Video (Mock para LRO) ---
const mockVideoAPI = { /* ... (sin cambios, ya definido) ... */ };

// --- Cliente de IA de Google ---
let genAIClient: GoogleGenerativeAI | null = null;
function getGenAIClient(): GoogleGenerativeAI { /* ... (sin cambios, ya definido) ... */ }

export class GeminiChatRepository implements IChatRepository {
    private telemetry: TelemetryClient;
    private contentCircuitBreaker: CircuitBreaker;

    constructor(telemetry: TelemetryClient) {
        this.telemetry = telemetry;
        this.contentCircuitBreaker = new CircuitBreaker({
            failureThreshold: 3,
            resetTimeout: 30000, // 30s
            telemetry: this.telemetry,
        });
    }

    private async applyBackoff(attempt: number): Promise<void> {
        const delay = (BACKOFF_BASE_MS * Math.pow(2, attempt)) + (Math.random() * 100);
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    private logLatency(name: string, duration: number, model: string, status: 'SUCCESS' | 'ERROR'): void {
        // ... (sin cambios, ya definido)
    }

    async generateContent(prompt: string, config: ModelConfig): Promise<GenerateContentResponse> {
        return this.contentCircuitBreaker.execute(async () => {
            for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
                const startTime = performance.now();
                try {
                    const genAI = getGenAIClient();
                    const model = genAI.getGenerativeModel({ model: config.model });
                    const result = await model.generateContent(prompt);
                    const text = result.response.text();

                    const duration = performance.now() - startTime;
                    this.logLatency('generateContent', duration, config.model, 'SUCCESS');
                    this.telemetry.trackEvent({ eventName: 'Api.Call.Success', modelName: config.model, duration });
                    return { type: 'text', content: text };

                } catch (error) {
                    const duration = performance.now() - startTime;
                    this.logLatency('generateContent', duration, config.model, 'ERROR');
                    if (attempt >= MAX_RETRIES - 1) {
                        throw error; // Lanzar el error en el último intento para que el CB lo capture
                    }
                    await this.applyBackoff(attempt);
                }
            }
            // Este código es teóricamente inalcanzable
            throw new Error("generateContent failed after all retries.");
        });
    }

    async generateVideo(prompt: string, progressCallback: (p: number) => void): Promise<VideoJobStatus> {
        // La lógica de LRO ya tiene su propio manejo de reintentos y timeouts, 
        // por lo que podemos optar por no envolverla en un Circuit Breaker o usar uno distinto.
        const lroStartTime = Date.now();
        const { id: jobId } = await mockVideoAPI.createVideoJob(prompt);
        // ... (resto de la lógica de generateVideo sin cambios)
        throw new Error("LRO Timeout: Video generation exceeded global time limit.");
    }
}
