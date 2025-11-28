
import { telemetryClient as telemetry } from './telemetry/TelemetryClient';

export class CircuitBreakerError extends Error {
  constructor(message: string = "Service Unavailable: Circuit Breaker is OPEN") {
    super(message);
    this.name = 'CircuitBreakerError';
  }
}

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
};

/**
 * Circuit Breaker simple.
 */
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private readonly threshold = 5;
  private readonly resetTimeout = 30000; // 30 segundos
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  check(): void {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'HALF_OPEN';
        console.warn('[CircuitBreaker] Transitioning to HALF_OPEN. Probing service...');
      } else {
        throw new CircuitBreakerError();
      }
    }
  }

  success(): void {
    if (this.state !== 'CLOSED') {
        console.info('[CircuitBreaker] Service recovered. Transitioning to CLOSED.');
    }
    this.failures = 0;
    this.state = 'CLOSED';
  }

  failure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      telemetry.trackError(new Error('Threshold reached, circuit opened'), { eventName: 'CircuitBreakerOpen' });
      console.error('[CircuitBreaker] Threshold reached. Transitioning to OPEN.');
    }
  }
}

export const apiCircuitBreaker = new CircuitBreaker();

/**
 * Ejecuta una función con lógica de reintento exponencial y Jitter.
 */
export async function withRetry<T>(
  operationName: string,
  fn: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  let attempt = 0;
  
  while (true) {
    try {
      // 1. Fail Fast si el circuito está abierto
      apiCircuitBreaker.check();
      
      const result = await fn();
      apiCircuitBreaker.success(); // Notificar éxito al circuit breaker
      return result;
    } catch (error: any) {
      // Si es error de circuito, propagar inmediatamente
      if (error instanceof CircuitBreakerError) {
          throw error;
      }

      attempt++;
      
      // Detectar errores no reintentables (ej. 400 Bad Request, API Key inválida)
      if (error.status === 400 || error.message?.includes('API key') || error.status === 401 || error.status === 403) {
         telemetry.trackError(error, { eventName: operationName, isRetriable: false });
         throw error;
      }

      if (attempt > config.maxRetries) {
        apiCircuitBreaker.failure(); // Contabilizar falla final para el breaker
        telemetry.trackError(error, { eventName: `${operationName}_FINAL_FAILURE`});
        throw error;
      }

      // Backoff Exponencial con Jitter
      const backoff = config.baseDelay * Math.pow(2, attempt - 1);
      const jitter = Math.random() * 500; 
      const delay = Math.min(backoff + jitter, config.maxDelay);

      telemetry.trackError(error, { eventName: `${operationName}_RETRY_${attempt}` });
      console.warn(`[Resilience] Retrying ${operationName} (Attempt ${attempt}) in ${delay.toFixed(0)}ms...`);
      
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
