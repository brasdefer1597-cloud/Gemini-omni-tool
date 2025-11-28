
// services/resilience/CircuitBreaker.ts
/**
 * @file Implementa un patrón de Circuit Breaker para mejorar la resiliencia de las llamadas a servicios externos.
 */

import { TelemetryClient } from '../telemetry/TelemetryClient';

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerConfig {
    failureThreshold: number; // Número de fallos para abrir el circuito
    resetTimeout: number;     // Milisegundos a esperar en estado OPEN antes de pasar a HALF_OPEN
    telemetry: TelemetryClient;
}

export class CircuitBreaker {
    private state: CircuitState = 'CLOSED';
    private failureCount = 0;
    private lastFailureTime: number | null = null;

    private readonly config: CircuitBreakerConfig;

    constructor(config: CircuitBreakerConfig) {
        this.config = config;
    }

    private transitionTo(newState: CircuitState, reason: string): void {
        const oldState = this.state;
        this.state = newState;
        this.config.telemetry.trackEvent({
            eventName: 'CircuitBreaker.StateChange',
            attributes: { 
                previousState: oldState,
                newState: this.state,
                reason: reason,
            }
        });
    }

    private open(reason: string): void {
        this.transitionTo('OPEN', reason);
        this.lastFailureTime = Date.now();
    }

    private close(): void {
        this.transitionTo('CLOSED', 'Successful execution on HALF_OPEN state');
        this.failureCount = 0;
    }

    private halfOpen(): void {
        this.transitionTo('HALF_OPEN', 'Reset timeout elapsed');
    }

    private recordFailure(): void {
        this.failureCount++;
        if (this.state !== 'OPEN' && this.failureCount >= this.config.failureThreshold) {
            this.open(`Failure threshold (${this.config.failureThreshold}) exceeded.`);
        }
    }

    public async execute<T>(asyncFunction: () => Promise<T>): Promise<T> {
        if (this.state === 'OPEN') {
            if (this.lastFailureTime && (Date.now() - this.lastFailureTime) > this.config.resetTimeout) {
                this.halfOpen();
            } else {
                throw new Error('Circuit Breaker is OPEN. Service is temporarily unavailable.');
            }
        }

        try {
            const result = await asyncFunction();
            if (this.state === 'HALF_OPEN') {
                this.close();
            }
            return result;
        } catch (error) {
            this.recordFailure();
            throw error; // Re-lanzar el error original para que el llamador lo maneje
        }
    }
}
