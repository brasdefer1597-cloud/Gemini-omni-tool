
import * as fs from 'fs/promises';
import * as path from 'path';
import { genkit, z } from 'genkit';
import express from "express";
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { HumanMessage } from "@langchain/core/messages";

// --- Configuración Centralizada ---
const PORT = process.env.PORT || 3000;
const STATIC_DIR = path.resolve(__dirname, 'static');
const IMAGES_DIR = path.resolve(STATIC_DIR, 'images');

// --- Inicialización de la IA ---
// Asegúrate de tener GOOGLE_API_KEY en tu entorno.
export const ai = genkit({
    plugins: [],
});

const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    // La API Key se toma automáticamente de la variable de entorno GOOGLE_API_KEY
});

// --- Definición del Flujo de IA (Genkit) ---
export const recipieWithContextFlow = ai.defineFlow(
    {
        name: 'recipieFlow',
        inputSchema: z.object({
            photoUrl: z.string(),
            userPrompt: z.string(),
        }),
        outputSchema: z.string()
    },
    async (inputs) => {
        // La construcción de la plantilla y la cadena es más clara dentro del flujo
        const systemMessage = SystemMessagePromptTemplate.fromTemplate("Return a recipie in markdown format");
        const userMessageAboutPrompt = HumanMessagePromptTemplate.fromTemplate("The user has asked: {userPrompt}");
        const imageMessage = new HumanMessage({
            content: [
                { type: "image_url", image_url: { url: "{photoUrl}" } },
                { type: "text", text: "Analyze the attached image." }
            ],
        });

        const prompt = ChatPromptTemplate.fromMessages([
            systemMessage,
            userMessageAboutPrompt,
            imageMessage,
        ]);

        const chain = RunnableSequence.from([
            prompt,
            model,
            new StringOutputParser(),
        ]);

        return await chain.invoke({
            userPrompt: inputs.userPrompt,
            photoUrl: inputs.photoUrl,
        });
    }
);

// --- Creación del Servidor Express ---
async function createServer() {
    const app = express();
    app.use(express.static(STATIC_DIR));
    app.use(express.json());

    app.post("/api/generate", async (req, res) => {
        console.log(`[Request] Received request for recipe generation.`);
        const { image, userPrompt } = req.body;

        // 1. Validación de Entradas
        if (!image || !userPrompt) {
            console.error("[Validation Error] Missing 'image' or 'userPrompt'.");
            return res.status(400).send("Bad Request: 'image' and 'userPrompt' are required.");
        }

        try {
            // 2. Saneamiento de Seguridad (Previene Path Traversal)
            const saneImageName = path.basename(image); // Elimina cualquier intento de navegación por directorios
            const imagePath = path.resolve(IMAGES_DIR, saneImageName);

            // Verificación extra para asegurar que el archivo está dentro del directorio esperado
            if (!imagePath.startsWith(IMAGES_DIR)) {
                console.error(`[Security] Forbidden path detected: ${imagePath}`);
                return res.status(403).send("Forbidden: Invalid image path.");
            }
            
            console.log(`[File IO] Reading image: ${imagePath}`);
            const imageBase64 = await fs.readFile(imagePath, { encoding: 'base64' });

            // 3. Ejecución del Flujo de IA
            const result = await recipieWithContextFlow({
                photoUrl: `data:image/jpeg;base64,${imageBase64}`,
                userPrompt: userPrompt
            });

            console.log(`[Success] Recipe generated successfully.`);
            return res.send(result);

        } catch (error) {
            // 4. Manejo Robusto de Errores
            console.error("[Server Error]", error);
            const errorMessage = (error as Error).code === 'ENOENT'
                ? "The specified image was not found."
                : "Failed to generate the recipe due to an internal error.";
            
            return res.status(500).send(errorMessage);
        }
    });

    app.listen(PORT, () => {
        console.log(`[Server] Started on http://localhost:${PORT}`);
    });
}

createServer();
