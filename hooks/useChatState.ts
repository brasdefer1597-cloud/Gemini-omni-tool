
// hooks/useChatState.ts
/**
 * @file El cerebro de la aplicación.
 * Este hook encapsula toda la lógica de negocio para la interacción del chat,
 * incluyendo la gestión del estado, la comunicación con el backend de Genkit,
 * el manejo de errores y la degradación elegante del servicio.
 */

import { useState, useCallback } from 'react';

// El tipo para el modo de chat, alineado con el backend
export type ChatMode = 'FAST' | 'THINKING' | 'SEARCH';

// Definición del contrato de un mensaje en el chat
export interface ChatMessage {
    id: string;
    role: 'user' | 'model' | 'system';
    content: string;
}

// Definición del estado que maneja el hook
export interface ChatState {
    messages: ChatMessage[];
    isLoading: boolean;
    error: Error | null;
}

export const useChatState = () => {
    const [state, setState] = useState<ChatState>({ messages: [], isLoading: false, error: null });

    const sendMessage = useCallback(async (prompt: string, mode: ChatMode) => {
        // 1. Actualización optimista de la UI y estado de carga
        const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: 'user', content: `[${mode}] ${prompt}` };
        setState(prevState => ({ ...prevState, isLoading: true, error: null, messages: [...prevState.messages, userMessage] }));

        try {
            // 2. Llamada al flujo de Genkit a través de su endpoint automático
            const response = await fetch('/api/flow/omniChatFlow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // El cuerpo debe coincidir con el inputSchema del flujo
                body: JSON.stringify({ input: { userPrompt: prompt, mode } }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error del servidor: ${response.status}`);
            }

            // La respuesta de un flujo de Genkit es directamente el resultado
            const modelContent = await response.json();

            const modelMessage: ChatMessage = { id: `model-${Date.now()}`, role: 'model', content: modelContent };
            setState(prevState => ({ ...prevState, messages: [...prevState.messages, modelMessage] }));

        } catch (error) {
            // 3. Degradación elegante y manejo de errores
            const systemMessage: ChatMessage = { 
                id: `system-${Date.now()}`,
                role: 'system', 
                content: `El servicio no está disponible temporalmente. Por favor, intenta más tarde. [Error: ${error instanceof Error ? error.message : 'Unknown'}]`
            };
            setState(prevState => ({ ...prevState, error: error as Error, messages: [...prevState.messages, systemMessage] }));

        } finally {
            // 4. Asegurar que el estado de carga siempre se resuelva
            setState(prevState => ({ ...prevState, isLoading: false }));
        }
    }, []);

    return { ...state, sendMessage };
};
