
// services/telemetry/TelemetryClient.ts
import { MetricPayload } from '../../arch/models';

/**
 * @file Cliente de telemetría para logging estructurado.
 */

export class TelemetryClient {
    
    constructor() {
        // En una aplicación real, aquí se podría inicializar un Web Worker
        // para descargar el envío de telemetría fuera del hilo principal.
        console.log("Telemetry Client Initialized for Structured Logging.");
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

        // Imprime en la consola con un prefijo especial para un fácil filtrado y análisis.
        // En producción, esto se sustituiría por una llamada a un endpoint de logging:
        // fetch('/api/log', { method: 'POST', body: JSON.stringify(logEntry) });
        console.log(`[TELEMETRY_SRAP] ${JSON.stringify(logEntry)}`);
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
