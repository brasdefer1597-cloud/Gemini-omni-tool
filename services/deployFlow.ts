
// services/deployFlow.ts
/**
 * @file Define el flujo de Genkit para el despliegue en Firebase Hosting.
 */

import { defineFlow } from "@genkit-ai/core";
import { classicFirebaseHostingDeploy } from "genkitx-firebase/hosting";
import { z } from "zod";

export const deployFlow = defineFlow(
  {
    name: "deployFlow",
    inputSchema: z.undefined(), // No se necesita entrada para este flujo
    outputSchema: z.string(),   // Devuelve un mensaje de estado
  },
  async () => {
    console.log("[Deploy Flow]: Iniciando despliegue a Firebase Hosting...");

    try {
      // Ejecuta la herramienta de despliegue para una aplicación cliente estática.
      // Asume que la salida de construcción está en el directorio 'dist' o 'build'.
      // El sistema buscará 'dist' primero, luego 'build'.
      // NOTA: Este es un marcador de posición. La ruta real debe ser verificada.
      const result = await classicFirebaseHostingDeploy({
        path: "static", // Desplegando el contenido del directorio 'static'
        appType: "client",
      });
      
      const message = "Despliegue a Firebase Hosting completado con éxito.";
      console.log(`[Deploy Flow]: ${message}`);
      return message;

    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown deployment error');
      console.error(`[Deploy Flow]: Error en el despliegue: ${err.message}`);
      // Lanza el error para que el frontend pueda capturarlo.
      throw err;
    }
  }
);
