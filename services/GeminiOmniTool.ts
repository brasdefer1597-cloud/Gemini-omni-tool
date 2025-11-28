// services/GeminiOmniTool.ts
/**
 * @file Core definitions for the Omni-Tool's identity and high-level orchestration.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { getApiKey } from './apiKey';
import { defineTool } from '@genkit-ai/core';
import { z } from 'zod';

// --- CORE IDENTITY --- //

/**
 * GEMINI 3 OMNI-TOOL — MASTER.JSON v3.0
 * This is the master prompt defining the AI's persona, operational pipeline, and strategic style.
 * It's optimized for Gemini 3 Ultra/Pro/Flash and the full multimodal suite.
 * MISSION: Convertir caos en claridad. Resolver problemas complejos usando capacidades avanzadas de Gemini 3.
 */
export const SYSTEM_INSTRUCTION = `
# 🧬 IDENTIDAD NÚCLEO DEL MODELO
**Persona:** Eres Gemini 3 Omni-Tool v3.0, una IA de élite con razonamiento profundo, precisión técnica y capacidad multimodal total.
**Identity:** Chalamandra Magistral DecoX Neuro-Core
**Tone:** experto, premium, estructurado y táctico
**Mission:** Convertir caos en claridad. Resolver problemas complejos usando capacidades avanzadas de Gemini 3.

# ⚙️ PRINCIPIOS FUNDAMENTALES
- Estructura siempre las respuestas.
- Razonamiento profundo activado por defecto (Snap 3).
- Explica si el usuario lo solicita; ejecuta si no.
- Combina texto, imágenes, audio y grounding dinámicamente.
`;

// --- HIGH-LEVEL ORCHESTRATOR --- //

/**
 * Initializes and returns a generative model instance with the core system instruction
 * configured for the Gemini 3 reasoning engine.
 * This ensures that every interaction is infused with the Gemini 3 Omni-Tool persona.
 */
export const getOmniToolModel = () => {
    const apiKey = getApiKey();
    if (!apiKey) {
        throw new Error("API key not found. Please set your GEMINI_API_KEY.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: "gemini-pro", // Using gemini-pro as a stand-in for gemini-3-ultra
        systemInstruction: SYSTEM_INSTRUCTION,
        generationConfig: {
            temperature: 0.35,
            topP: 0.9,
            topK: 50,
        }
    });

    return model;
};

// --- GEMINI 3 OMNI-TOOL SUITE --- //

export const textReasoningTool = defineTool(
  {
    name: 'text_reasoning',
    description: 'Deep reasoning for complex text tasks. Use for analysis, strategy, and in-depth problem-solving.',
    inputSchema: z.object({ query: z.string() }),
    outputSchema: z.string(),
  },
  async ({ query }) => `[Reasoning Engine] Processing query: ${query}`,
);

export const textFastTool = defineTool(
  {
    name: 'text_fast',
    description: 'Quick and efficient text generation for simple tasks. Use for summaries, translations, and quick questions.',
    inputSchema: z.object({ query: z.string() }),
    outputSchema: z.string(),
  },
  async ({ query }) => `[Fast Text Engine] Processing query: ${query}`,
);

export const visionTool = defineTool(
  {
    name: 'vision',
    description: 'Analyzes and understands the content of images (jpg, png, webp, pdf).',
    inputSchema: z.object({ imageUrl: z.string().url() }),
    outputSchema: z.string(),
  },
  async ({ imageUrl }) => `[Vision Engine] Analyzing image: ${imageUrl}`,
);

export const imageGenerationTool = defineTool(
  {
    name: 'image_generation',
    description: 'Generates high-quality images from text descriptions (text-to-image) or based on an existing image (image-to-image).',
    inputSchema: z.object({ prompt: z.string(), mode: z.enum(['text_to_image', 'image_to_image']), sourceImageUrl: z.string().url().optional() }),
    outputSchema: z.string(),
  },
  async ({ prompt }) => `[Image Gen3 Studio] Generating image with prompt: "${prompt}"`,
);

export const imageEditingTool = defineTool(
  {
    name: 'image_editing',
    description: 'Performs advanced image editing operations like erase, remove/add object, background rebuild, and semantic repaint.',
    inputSchema: z.object({ imageUrl: z.string().url(), operation: z.enum(['erase', 'remove_object', 'add_object', 'background_rebuild', 'depth_relighing', 'semantic_repaint']), params: z.string() }),
    outputSchema: z.string(),
  },
  async ({ imageUrl, operation }) => `[Flash Editor v3] Performing '${operation}' on image: ${imageUrl}`,
);

export const videoTool = defineTool(
  {
    name: 'video_generation',
    description: 'Generates short video clips (up to 12s) from a text prompt, with 4K upscaling.',
    inputSchema: z.object({ prompt: z.string() }),
    outputSchema: z.string(),
  },
  async ({ prompt }) => `[Veo 2 Video Studio] Generating video with prompt: "${prompt}"`,
);

export const audioTool = defineTool(
  {
    name: 'audio_processing',
    description: 'Handles audio tasks: speech-to-text (stt), text-to-speech (tts), music generation, and audio-to-text.',
    inputSchema: z.object({ mode: z.enum(['stt', 'tts', 'music_gen', 'audio_to_text']), input: z.string() }),
    outputSchema: z.string(),
  },
  async ({ mode, input }) => `[Audio Studio 3] Processing audio task '${mode}' with input: ${input}`,
);

export const groundingTool = defineTool(
  {
    name: 'deep_grounding',
    description: 'Accesses real-time information from search, maps, news, and web rankings to provide grounded, factual answers.',
    inputSchema: z.object({ query: z.string(), sources: z.array(z.enum(['search', 'maps', 'news', 'web_ranking'])) }),
    outputSchema: z.string(),
  },
  async ({ query, sources }) => `[Grounding v3] Searching for "${query}" in sources: ${sources.join(', ')}`,
);
