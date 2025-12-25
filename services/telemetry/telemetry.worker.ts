// services/telemetry/telemetry.worker.ts

/**
 * Web Worker for handling telemetry data submission off the main thread.
 */

// Define the shape of the message expected by the worker
interface TelemetryMessage {
    type: 'LOG';
    payload: any;
}

self.onmessage = (event: MessageEvent<TelemetryMessage>) => {
    const { type, payload } = event.data;

    if (type === 'LOG') {
        // Simulate sending data to an endpoint
        sendTelemetry(payload);
    }
};

async function sendTelemetry(data: any) {
    // specific logic for sending telemetry
    // In a real scenario, this would be a fetch call:
    // await fetch('/api/log', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data)
    // });

    // For now, we simulate with a console log from the worker
    console.log(`[Worker Telemetry] Processing:`, data);
}
