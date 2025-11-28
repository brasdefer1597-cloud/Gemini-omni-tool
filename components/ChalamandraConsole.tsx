
// components/ChalamandraConsole.tsx
import React, { useState } from 'react';
import { heuristicAnalysisFlow } from '../services/flows'; // Importamos nuestro flujo definido
import { FlowTrace } from '../services/genkitOrchestrator';

export const ChalamandraConsole: React.FC = () => {
    const [activeTab, setActiveTab] = useState('genkit');
    const [prompt, setPrompt] = useState('The project deadline is critical, review all PRs urgently.');
    const [flowResult, setFlowResult] = useState<string | null>(null);
    const [traces, setTraces] = useState<FlowTrace[] | null>(null); // Para mostrar la traza
    const [isLoading, setIsLoading] = useState(false);

    const handleRunFlow = async () => {
        setIsLoading(true);
        setFlowResult(null);
        setTraces(null);
        
        try {
            // El evento de telemetría capturará las trazas, pero podemos obtenerlas para la UI si las devolvemos
            // Por ahora, solo ejecutamos y mostramos el resultado final.
            const result = await heuristicAnalysisFlow.run({ prompt });
            setFlowResult(result);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            setFlowResult(`Error running flow: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="console">
            <div className="console-tabs">
                <button 
                    onClick={() => setActiveTab('genkit')} 
                    className={activeTab === 'genkit' ? 'active' : ''}
                >
                    Genkit Flow
                </button>
                {/* Se podrían añadir otras pestañas para Chat, etc. */}
            </div>

            <div className="console-content">
                {activeTab === 'genkit' && (
                    <div>
                        <h3>Demonstración de Flujo Híbrido (Chalamandra + Gemini)</h3>
                        <p>Este flujo primero ejecuta una heurística local y luego usa IA para expandir y planificar.</p>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Escribe un prompt para el flujo..."
                            rows={3}
                        />
                        <button onClick={handleRunFlow} disabled={isLoading}>
                            {isLoading ? 'Ejecutando Flujo...' : 'Ejecutar Flujo de Análisis Heurístico'}
                        </button>
                        
                        {isLoading && <div className="spinner"></div>} 

                        {flowResult && (
                            <div className="results-output">
                                <h4>Resultado del Flujo:</h4>
                                <pre><code>{flowResult}</code></pre>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
