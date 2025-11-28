
// hooks/useImageGeneratorState.ts
/**
 * @file Hook para gestionar el estado y la lógica del "Pro Image Gen Studio".
 * Encapsula el prompt, las opciones de configuración (resolución, aspect ratio),
 * el estado de carga y el resultado de la generación de la imagen.
 */

import { useState, useCallback } from 'react';
import { generateImage } from '../services/gemini';
import { ImageConfig } from '../types'; // Asumimos que ImageConfig está en types.ts

// Definición del estado específico para el generador de imágenes
export interface ImageGeneratorState {
    prompt: string;
    aspectRatio: ImageConfig['aspectRatio'];
    resolution: '1K' | '2K' | '4K'; // Opciones de UI
    isLoading: boolean;
    error: Error | null;
    generatedImage: string | null; // El resultado será una URL o un string base64
}

export const useImageGeneratorState = () => {
    const [state, setState] = useState<ImageGeneratorState>({
        prompt: '',
        aspectRatio: '1:1',
        resolution: '1K',
        isLoading: false,
        error: null,
        generatedImage: null,
    });

    // Función para actualizar los parámetros de la UI
    const setGeneratorOption = <K extends keyof ImageGeneratorState>(key: K, value: ImageGeneratorState[K]) => {
        setState(prevState => ({ ...prevState, [key]: value }));
    };

    // Función para invocar la generación de la imagen
    const runImageGeneration = useCallback(async () => {
        if (!state.prompt) {
            setState(prevState => ({ ...prevState, error: new Error("El prompt no puede estar vacío.") }));
            return;
        }

        setState(prevState => ({ ...prevState, isLoading: true, error: null, generatedImage: null }));

        try {
            // Construye el objeto de configuración a partir del estado
            const imageConfig: ImageConfig = {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: state.aspectRatio,
                // La resolución de UI ('1K', '2K') podría mapearse a dimensiones específicas si la API lo requiere.
                // Por ahora, lo pasamos como metadato informativo.
            };

            // Llama a la función del facade de servicios
            const imageUrl = await generateImage(state.prompt, imageConfig);

            setState(prevState => ({ ...prevState, generatedImage: imageUrl, isLoading: false }));

        } catch (error: any) {
            console.error("[useImageGeneratorState] Error generating image:", error);
            setState(prevState => ({ ...prevState, error, isLoading: false }));
        }
    }, [state.prompt, state.aspectRatio, state.resolution]);

    return { 
        ...state, 
        setGeneratorOption, 
        runImageGeneration 
    };
};
