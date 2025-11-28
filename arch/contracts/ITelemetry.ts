
// arch/contracts/ITelemetry.ts
export interface ITelemetry {
    trackLatency(endpoint: string, startTime: number, status: 'SUCCESS' | 'ERROR', modelName: string): void;
    logFeedback(sessionId: string, rating: number, messageId: string): void;
}
