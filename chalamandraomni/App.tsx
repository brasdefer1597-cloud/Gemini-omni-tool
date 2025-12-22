import React, { useState } from 'react';
import { DialecticMode } from './components/DialecticMode';
import { OmniChat } from './components/OmniChat';
import { ToolsPanel } from './components/ToolsPanel';
import { CreativeStudio } from './components/CreativeStudio';
import { CognitiveSecurity } from './components/CognitiveSecurity';
import { LiveMode } from './components/LiveMode';
import { AppMode } from './types';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<AppMode>(AppMode.DIALECTIC);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col font-sans selection:bg-fuchsia-500/30 selection:text-fuchsia-100 overflow-x-hidden">

      <Header activeMode={activeMode} setActiveMode={setActiveMode} />

      {/* MAIN CONTENT: The Void */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 relative z-10">
        <div className="animate-fade-in-up">
            {activeMode === AppMode.DIALECTIC && <DialecticMode />}
            {activeMode === AppMode.SECURITY && <CognitiveSecurity />}
            {activeMode === AppMode.CHAT && <OmniChat />}
            {activeMode === AppMode.LIVE && <LiveMode />}
            {activeMode === AppMode.STUDIO && <CreativeStudio />}
            {activeMode === AppMode.TOOLS && <ToolsPanel />}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
