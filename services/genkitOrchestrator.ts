
// services/genkitOrchestrator.ts
/**
 * @file Punto de entrada principal para la inicialización y configuración de Genkit.
 * Registra los plugins, flujos y herramientas necesarios para la aplicación.
 */

import { genkit } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/google-genai';

// Importa el flujo de chat principal que hemos migrado
import { omniChatFlow } from './flows';
import { searchTool } from './GeminiOmniTool'; // Importamos la nueva herramienta

// Inicializa Genkit y configura los plugins
genkit({
  plugins: [
    // Habilita la conexión con los modelos de Google AI (Gemini)
    // Genkit leerá automáticamente la variable de entorno GEMINI_API_KEY.
    googleAI(),
  ],
  // Lista de flujos que se expondrán como endpoints de API
  flows: [
    omniChatFlow,
  ],
  // Lista de herramientas que pueden ser utilizadas por los flujos
  tools: [
    searchTool,
  ],
  // Configuración para la observabilidad y el almacenamiento de trazas
  logLevel: 'debug',       // Muestra logs detallados en la consola
  enableTracingAndMetrics: true, // Habilita la Developer UI
});
