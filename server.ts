
// server.ts
/**
 * @file El backend seguro (Backend-for-Frontend).
 * Expone endpoints locales que el frontend puede consumir de forma segura.
 * Es la única parte del sistema que debe comunicarse con servicios externos.
 */

import express from 'express';
import bodyParser from 'body-parser';
import { generateContent, generateImage } from './services/gemini'; // Usamos el Facade
import { AdapterError } from './services/api/GeminiAdapter';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '10mb' })); // Aumentar límite para imágenes
app.use(express.static('static')); // Servir archivos estáticos (index.html, main.js)

// El ROL CENTRAL que definiste, pero guardado de forma segura en el backend
const SYSTEM_INSTRUCTION = "ROL CENTRAL: Chalamandra Magistral DecoX - Consultor de Marca y Arquitecto de Estrategia...";

app.post('/api/generate', async (req, res) => {
    const { userPrompt, image, mode } = req.body;

    try {
        let result;
        if (mode === 'IMAGE_GENERATION') {
            // Lógica para generar imagen
            const base64Image = await generateImage(userPrompt, { numberOfImages: 1, aspectRatio: '1:1', outputMimeType: 'image/png'});
            result = { base64Image };
        } else {
            // Lógica para generar contenido (receta/thinking)
            const config = {
                model: 'gemini-pro-vision',
                temperature: 0.7,
                maxOutputTokens: 2048,
                // Inyectamos la instrucción del sistema de forma segura aquí
                systemInstruction: SYSTEM_INSTRUCTION 
            };
            
            // Las herramientas también se definen en el backend
            const tools = [{ name: 'get_recipe', description: 'Extrae una receta de cocina de la imagen y el texto' }];

            const generationResult = await generateContent(userPrompt, image, config, tools);
            result = generationResult;
        }

        res.json(result);

    } catch (error) {
        console.error('[SRAP] API Call Failed:', error);

        if (error instanceof AdapterError && error.isCircuitBreakerOpen) {
            res.status(503).json({ 
                fallbackText: 'El servicio está experimentando problemas y no está disponible temporalmente. Por favor, inténtalo más tarde.' 
            });
        } else {
            res.status(500).json({ 
                fallbackText: 'No se pudo generar una respuesta. Por favor, revisa la consola del servidor para más detalles.' 
            });
        }
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
