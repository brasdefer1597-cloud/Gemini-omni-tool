
// services/telemetry/TelemetryClient.ts
import { MetricPayload } from '../../types';

/**
 * @file Cliente de telemetría para logging estructurado.
 */

export class TelemetryClient {
    private worker: Worker | null = null;

    constructor() {
        if (typeof Worker !== 'undefined') {
            try {
                // Initialize the Web Worker
                this.worker = new Worker(new URL('./telemetry.worker.ts', import.meta.url), { type: 'module' });
                this.worker.onerror = (error) => {
                    console.error('Telemetry Worker Error:', error);
                };
                console.log("Telemetry Client Initialized with Web Worker.");
            } catch (e) {
                console.warn('Failed to initialize Telemetry Worker, falling back to main thread.', e);
            }
        } else {
            console.log("Telemetry Client Initialized (No Worker support).");
        }
    }

    /**
     * Rastrea un evento de métrica o de negocio.
     * @param payload El objeto de datos estructurados que se va a registrar.
     */
    public async trackEvent(payload: MetricPayload): Promise<void> {
        const logEntry = {
            timestamp: new Date().toISOString(),
            ...payload,
        };

        if (this.worker) {
            this.worker.postMessage({ type: 'LOG', payload: logEntry });
        } else {
            // Fallback to main thread logging
            console.log(`[TELEMETRY_SRAP] ${JSON.stringify(logEntry)}`);
        }
    }

    /**
     * Rastrea un error.
     * @param error El objeto Error.
     * @param additionalPayload Datos adicionales para añadir al payload del error.
     */
    public async trackError(error: Error, additionalPayload: Partial<MetricPayload> = {}): Promise<void> {
        const payload: MetricPayload = {
            eventName: additionalPayload.eventName || 'System.Error',
            ...additionalPayload,
            error: {
                message: error.message,
                stack: error.stack,
            },
        };
        await this.trackEvent(payload);
    }
}

// Exportamos una instancia Singleton para ser usada en toda la aplicación
export const telemetryClient = new TelemetryClient();
