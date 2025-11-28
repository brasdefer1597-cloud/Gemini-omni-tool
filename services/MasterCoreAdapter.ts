
// services/MasterCoreAdapter.ts
/**
 * @file Adaptador para comunicarse con el Chalamandra Master Core (backend de Java).
 * Encapsula la lógica de red para llamar al orquestador principal, que ahora
 * contiene toda la inteligencia de agentes y la lógica de negocio.
 */

// DTOs que coinciden con el API contract del backend de Java
interface MasterRequest {
    prompt: string;
}

export interface MasterResponse {
    text: string;
    context: Record<string, any>;
}

const MASTER_CORE_ENDPOINT = 'http://localhost:8080/api/master/run';

/**
 * Ejecuta el pipeline completo del Chalamandra Master Core a través de la red.
 * @param prompt El prompt del usuario.
 * @returns La respuesta final y orquestada por el backend.
 */
export const runMasterCore = async (prompt: string): Promise<MasterResponse> => {
    console.log(`[MasterCoreAdapter] Dispatching prompt to Java Master Core: "${prompt}"`);

    try {
        const response = await fetch(MASTER_CORE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ prompt } as MasterRequest),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('[MasterCoreAdapter] Backend Error:', response.status, errorBody);
            throw new Error(`El Master Core respondió con un error ${response.status}.`);
        }

        const data: MasterResponse = await response.json();
        console.log('[MasterCoreAdapter] Response received from Master Core:', data);
        
        return data;

    } catch (error) {
        console.error('[MasterCoreAdapter] Network failure:', error);
        return {
            text: "**Error de Conexión**\n\nNo se pudo establecer comunicación con el `Chalamandra Master Core`.\n\n*Asegúrate de que el backend de Java se está ejecutando en `localhost:8080`.*",
            context: { error: true, details: (error as Error).message },
        };
    }
};
