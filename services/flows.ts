
// services/flows.ts
/**
 * @file Define los flujos de Genkit que orquestan la lógica del negocio y las llamadas a la IA.
 */

import { defineFlow, defineSchema } from "@genkit-ai/core";
import { gemini } from '@genkit-ai/google-genai';

// Importa las herramientas y la configuración del módulo Omni-Tool
import { fileSystemTool, searchTool, SYSTEM_INSTRUCTION } from './GeminiOmniTool';

// Esquema de entrada para el flujo, esperando el prompt y el modo de operación
const omniChatSchema = defineSchema({
  type: 'object',
  properties: {
    userPrompt: { type: 'string' },
    mode: { type: 'string', enum: ['FAST', 'THINKING', 'SEARCH'] },
  },
  required: ['userPrompt', 'mode'],
});

/**
 * El flujo principal que gestiona todas las interacciones de chat.
 * Selecciona el modelo y las herramientas de Gemini basándose en el modo proporcionado.
 */
export const omniChatFlow = defineFlow(
  {
    name: 'omniChatFlow',
    inputSchema: omniChatSchema,
    outputSchema: { type: 'string' },
  },
  async ({ userPrompt, mode }) => {

    const availableTools = [fileSystemTool, searchTool];

    // Modo THINKING: Usa el modelo más potente y siempre tiene acceso a herramientas.
    if (mode === 'THINKING') {
      const response = await gemini.generate({
        model: 'gemini-1.5-pro',
        system: SYSTEM_INSTRUCTION,
        prompt: userPrompt,
        tools: availableTools, 
      });
      return response.text();
    }

    // Modo SEARCH: Usa un modelo rápido pero con acceso a herramientas para buscar información.
    if (mode === 'SEARCH') {
      const response = await gemini.generate({
        model: 'gemini-1.5-flash',
        system: SYSTEM_INSTRUCTION,
        prompt: userPrompt,
        tools: availableTools, // El modelo decide si usar la herramienta.
      });
      return response.text();
    }

    // Modo FAST (por defecto): Usa el modelo más rápido sin herramientas para respuestas instantáneas.
    const response = await gemini.generate({
      model: 'gemini-1.5-flash',
      system: SYSTEM_INSTRUCTION,
      prompt: userPrompt,
    });
    return response.text();
  }
);
