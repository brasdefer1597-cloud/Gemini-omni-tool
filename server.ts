
// server.ts
/**
 * @file El backend seguro (Backend-for-Frontend).
 * Expone endpoints locales que el frontend puede consumir de forma segura.
 */

import express from 'express';
import bodyParser from 'body-parser';

// Importa y arranca el orquestador de Genkit. Esto debe hacerse una sola vez.
import './services/genkitOrchestrator';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static('static')); // Servir archivos estáticos (index.html, main.js)

// NOTA: No se necesitan más endpoints manuales como /api/omni-text.
// Genkit crea automáticamente los endpoints para los flujos registrados.
// El omniChatFlow estará disponible en POST /api/flow/omniChatFlow

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
    console.log('Genkit flows están disponibles bajo la ruta /api/flow/');
});
