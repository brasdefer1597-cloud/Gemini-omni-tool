
// arch/contracts/IChatRepository.ts
import { ModelConfig } from "@/types";
import { GenerateContentResponse } from "@/types";

// Placeholder para los tipos de Video, ajustar según sea necesario
export interface VideoJobStatus {
    status: 'processing' | 'completed' | 'failed';
    url?: string;
    progress: number;
}

export interface IChatRepository {
    generateContent(prompt: string, config: ModelConfig): Promise<GenerateContentResponse>;
    generateVideo(prompt: string, progressCallback: (p: number) => void): Promise<VideoJobStatus>;
}
