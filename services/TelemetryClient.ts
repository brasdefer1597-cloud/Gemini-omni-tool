
// services/TelemetryClient.ts
import { ITelemetryClient } from '../types';

/**
 * @file Implementación de un cliente de telemetría.
 * En una aplicación real, esto se conectaría a un servicio como OpenTelemetry, 
 * Azure App Insights, o Datadog.
 */

class TelemetryClient implements ITelemetryClient {
    trackEvent(name: string, properties?: Record<string, any>): void {
        // Simula el envío de un evento a un servicio de monitorización
        console.log(`%c[Telemetry Event]:%c ${name}`, 'color: #8D6E63; font-weight: bold;', 'color: inherit;', properties || '');
    }

    trackError(error: Error, properties?: Record<string, any>): void {
        // Simula el envío de un error a un servicio de seguimiento de errores como Sentry
        console.error(`%c[Telemetry Error]:%c ${error.message}`, 'color: #C62828; font-weight: bold;', 'color: inherit;', {
            ...properties,
            stack: error.stack
        });
    }
}

// Exportamos una instancia Singleton para ser usada en toda la aplicación
export const telemetryClient = new TelemetryClient();
