
// arch/models.ts
/**
 * @file Define los modelos de datos y esquemas centrales para la arquitectura.
 */

/**
 * Describe la configuración de una herramienta, como un modelo de IA.
 */
export interface ToolConfig {
    name: string;
    version?: string;
    // Se pueden añadir otros parámetros de configuración aquí.
}

/**
 * Define el esquema para un evento de telemetría estructurado.
 * Este es el formato que se enviará a nuestro sistema de logging.
 */
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
