
// services/repository/ServiceFactory.ts
import { IChatRepository } from '../../arch/contracts/IChatRepository'; // Usar el contrato
import { GeminiChatRepository } from './GeminiChatRepository';
import { telemetryClient } from '../TelemetryClient'; // Importar el cliente de telemetría

export enum ServiceProvider { 
    Gemini = 'GEMINI',
    // ... otros proveedores
}

export class ServiceFactory {
    public static getChatRepository(provider: ServiceProvider = ServiceProvider.Gemini): IChatRepository {
        switch (provider) {
            case ServiceProvider.Gemini:
                // Inyectar el cliente de telemetría en el constructor
                return new GeminiChatRepository(telemetryClient);
            
            default:
                throw new Error(`Proveedor de servicio no soportado: ${provider}`);
        }
    }
}
