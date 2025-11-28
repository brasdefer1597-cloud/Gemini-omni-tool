
// hooks/useChatState.ts
/**
 * @file El cerebro de la aplicación.
 * Este hook encapsula toda la lógica de negocio para la interacción del chat,
 * incluyendo la gestión del estado, la comunicación con el backend a través del facade,
 * el manejo de errores y la degradación elegante del servicio.
 */

import { useState, useCallback } from 'react';
import { generateContent } from '../services/gemini'; // Consume el facade
import { ModelConfig, Tool } from '../types'; // Corregido

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

// Opciones para la generación de contenido
const modelConfig: ModelConfig = {
    model: 'gemini-pro-vision', // Modelo por defecto
    temperature: 0.7,
    maxOutputTokens: 2048,
};

export const useChatState = () => {
    const [state, setState] = useState<ChatState>({ messages: [], isLoading: false, error: null });

    const sendMessage = useCallback(async (prompt: string, imageBase64: string | null = null) => {
        // 1. Actualización optimista de la UI y estado de carga
        const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: 'user', content: prompt };
        setState(prevState => ({ ...prevState, isLoading: true, error: null, messages: [...prevState.messages, userMessage] }));

        try {
            // 2. Llamada a la capa de infraestructura a través del facade
            const result = await generateContent(prompt, imageBase64, modelConfig);

            let modelContent = '';
            if (result.type === 'text') {
                modelContent = result.content;
            } else if (result.type === 'tool_call') {
                // En un futuro, aquí se manejaría la visualización de llamadas a herramientas
                modelContent = `[Tool Call: ${result.toolName} with args: ${JSON.stringify(result.args)}]`;
            }

            const modelMessage: ChatMessage = { id: `model-${Date.now()}`, role: 'model', content: modelContent };
            setState(prevState => ({ ...prevState, messages: [...prevState.messages, modelMessage] }));

        } catch (error) {
            // 3. Degradación elegante y manejo de errores
            // El hook no necesita saber POR QUÉ falló (Circuit Breaker, 5xx, etc.)
            // Simplemente recibe un error y actualiza el estado para que la UI reaccione.
            const systemMessage: ChatMessage = { 
                id: `system-${Date.now()}`,
                role: 'system', 
                content: `Service temporarily unavailable. Please try again later. [Error: ${error instanceof Error ? error.message : 'Unknown'}]`
            };
            setState(prevState => ({ ...prevState, error: error as Error, messages: [...prevState.messages, systemMessage] }));

        } finally {
            // 4. Asegurar que el estado de carga siempre se resuelva
            setState(prevState => ({ ...prevState, isLoading: false }));
        }
    }, []);

    return { ...state, sendMessage };
};
