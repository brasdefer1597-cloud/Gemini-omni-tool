
// hooks/useChatState.ts
/**
 * @file El cerebro de la UI, ahora un cliente ligero para el Chalamandra Master Core.
 * Su única responsabilidad es enviar el prompt del usuario al backend y mostrar
 * la respuesta orquestada.
 */

import { useState, useCallback } from 'react';
import { runMasterCore, MasterResponse } from '../services/MasterCoreAdapter'; // Importa el nuevo puente
import { ChatMessage, ChatMode } from '../types'; // Mantiene tipos de UI

export interface ChatState {
    messages: ChatMessage[];
    isLoading: boolean;
    error: Error | null;
}

export const useChatState = () => {
    const [state, setState] = useState<ChatState>({ messages: [], isLoading: false, error: null });

    const dispatchMessage = useCallback(async (text: string, mode: ChatMode) => {
        const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: 'user', text, timestamp: Date.now(), mode };
        setState(prevState => ({ ...prevState, isLoading: true, error: null, messages: [...prevState.messages, userMessage] }));

        try {
            // **Llamada única al Master Core**
            // Toda la complejidad está ahora en el backend.
            const response: MasterResponse = await runMasterCore(text);

            // La respuesta del backend es la verdad final
            const modelMessage: ChatMessage = { 
                id: `model-${Date.now()}`,
                role: 'model', 
                text: response.text, // Muestra la respuesta de texto curada por el backend
                timestamp: Date.now(), 
                mode 
            };
            
            setState(prevState => ({ ...prevState, messages: [...prevState.messages, modelMessage], isLoading: false }));

        } catch (error: any) {
            console.error("[useChatState] Error dispatching message to Master Core:", error);
            const errorMessage: ChatMessage = {
                id: `error-${Date.now()}`,
                role: 'model', // Se muestra como un mensaje del sistema
                text: "Ocurrió un error al comunicarse con el Chalamandra Master Core. Revisa la consola para más detalles.",
                timestamp: Date.now(),
                mode
            };
            setState(prevState => ({ ...prevState, error, isLoading: false, messages: [...prevState.messages, errorMessage] }));
        }
    }, []);

    // Las funciones de envío ahora solo llaman al despachador unificado.
    const sendMessage = useCallback((text: string, mode: ChatMode) => {
        return dispatchMessage(text, mode);
    }, [dispatchMessage]);

    const sendMessageWithFile = useCallback((text: string, file: File, mode: ChatMode) => {
        // La lógica de subida de archivos ahora necesitaría una ruta al backend.
        // Por ahora, solo enviamos el texto.
        const textWithFile = `${text}\n\n(Archivo adjunto: ${file.name} - La lógica de carga al backend está pendiente)`;
        return dispatchMessage(textWithFile, mode);
    }, [dispatchMessage]);

    return { 
        ...state, 
        sendMessage, 
        sendMessageWithFile 
    };
};
