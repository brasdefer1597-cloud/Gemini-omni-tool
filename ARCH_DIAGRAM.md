
# 🏗️ Chalamandra OS - Architecture Diagram (Senior View)

This document visualizes the high-level data flow and component hierarchy of the refactored system.

## 🧠 Core Intelligence Flow (The "Synapse")

```mermaid
graph TD
    User[User Input] --> App[App.tsx (Router/Shell)]
    App -->|Mode: DIALECTIC| Dialectic[DialecticMode.tsx]
    App -->|Mode: SECURITY| Security[CognitiveSecurity.tsx]
    App -->|Mode: LIVE| Live[LiveMode.tsx]

    Dialectic --> Orchestrator[GeminiService.ts (Unified Gateway)]
    Security --> Orchestrator

    subgraph "Core Orchestrator Logic"
        Orchestrator -->|Check Mode| Router{Routing Logic}
        Router -->|'nano'| LocalCheck[Is Nano Available?]
        Router -->|'elite'/'fast'| CloudAuth[Check API Key]
    end

    subgraph "Execution Engines"
        LocalCheck -->|Yes| Nano[Chrome Built-in AI (window.ai)]
        LocalCheck -->|No| CloudFallback[Fallback to Cloud]
        CloudAuth -->|Valid| Gemini[Google Generative AI SDK]
    end

    Nano -->|Result| UI[UI Update]
    Gemini -->|Result| UI
```

## 📦 Component Hierarchy & State

- **src/App.tsx**: The sovereign container. Manages global navigation (`AppMode`) and layout (Chaotic Elegance).
- **src/services/geminiService.ts**: Singleton service. Encapsulates all AI interaction. No component speaks to APIs directly; they speak to the Service.
- **src/components/**:
  - **CognitiveSecurity**: Self-contained module with visualization state (Mandala).
  - **LiveAudio**: Pure component, stateless regarding global app, controlled by parent.
  - **DialecticMode**: Manages chat history and "Dialectic" interaction loop.

## 🛡️ Security & Performance Decisions

1. **API Key Isolation**: Keys are memory-resident or local-storage, never exposed in logs.
2. **Bundle Optimization**: `OmniSuite` (Legacy) removed. `React.lazy` candidates identified for future.
3. **Resilience**: `LiveAudio` handles hardware failures gracefully without crashing the app.
4. **Type Safety**: `types.ts` enforces strict contracts between UI and Service layers.
