
// services/genkitOrchestrator.ts
/**
 * @file Punto de entrada principal para la inicialización y configuración de Genkit.
 * Registra los plugins, flujos y herramientas necesarios para la aplicación.
 */

import { genkit } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/google-genai';

// Importa los flujos de la aplicación
import { omniChatFlow } from './flows';
import { deployFlow } from './deployFlow'; // Importa el nuevo flujo de despliegue
import { 
    textReasoningTool, 
    textFastTool, 
    visionTool, 
    imageGenerationTool, 
    imageEditingTool, 
    videoTool, 
    audioTool, 
    groundingTool 
} from './GeminiOmniTool';

// Inicializa Genkit y configura los plugins
genkit({
  plugins: [
    googleAI(),
  ],
  // Lista de flujos que se expondrán como endpoints de API
  flows: [
    omniChatFlow,
    deployFlow, // Registra el nuevo flujo
  ],
  // Lista de herramientas que pueden ser utilizadas por los flujos
  tools: [
    textReasoningTool,
    textFastTool,
    visionTool,
    imageGenerationTool,
    imageEditingTool,
    videoTool,
    audioTool,
    groundingTool
  ],
  // Configuración para la observabilidad y el almacenamiento de trazas
  logLevel: 'debug',       
  enableTracingAndMetrics: true, 
});
