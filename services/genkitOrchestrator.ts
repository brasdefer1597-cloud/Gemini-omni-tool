
// services/genkitOrchestrator.ts
import { telemetryClient } from './telemetry/TelemetryClient';
import { MetricPayload } from '../arch/models';

type FlowStep<T, R> = (input: T) => R | Promise<R>;

export interface Flow<T, R> {
    name: string;
    steps: { name: string; fn: FlowStep<any, any> }[];
    run: (input: T) => Promise<R>;
}

export interface FlowTrace {
    stepName: string;
    input: any;
    output: any;
    duration: number;
}

export function defineFlow<T, R>(
    name: string, 
    steps: { name: string; fn: FlowStep<any, any> }[]
): Flow<T, R> {
    
    const run = async (initialInput: T): Promise<R> => {
        const flowStartTime = performance.now();
        const traces: FlowTrace[] = [];
        let currentInput: any = initialInput;

        telemetryClient.trackEvent({ 
            eventName: 'Flow.Start', 
            flowName: name,
            // Omitir el input inicial si es muy grande o sensible
        });

        for (const step of steps) {
            const stepStartTime = performance.now();
            try {
                const output = await step.fn(currentInput);
                const duration = performance.now() - stepStartTime;

                traces.push({
                    stepName: step.name,
                    input: currentInput, // Considerar sanear/truncar
                    output: output,      // Considerar sanear/truncar
                    duration,
                });
                
                currentInput = output;

            } catch (error) {
                const duration = performance.now() - flowStartTime;
                const err = error instanceof Error ? error : new Error('Unknown error in flow step');
                
                telemetryClient.trackError(err, {
                    eventName: 'Flow.Step.Error',
                    flowName: name,
                    stepName: step.name,
                    duration,
                });

                throw new Error(`Flow '${name}' failed at step '${step.name}': ${err.message}`);
            }
        }

        const totalDuration = performance.now() - flowStartTime;
        telemetryClient.trackEvent({ 
            eventName: 'Flow.End',
            flowName: name,
            duration: totalDuration,
            // El resultado final y las trazas pueden ser muy grandes, se omiten por defecto
            // se pueden añadir si es necesario para el debugging de ciertos flujos.
        });

        return currentInput as R;
    };
    
    return { name, steps, run };
}
