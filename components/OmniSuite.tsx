
import React, { useState } from 'react';
import { ChatInterface } from './ChatInterface';
import { DialecticMode } from './DialecticMode';
import { LiveAudio } from './LiveAudio';
import { ProImageGen } from './ProImageGen';
import { MessageSquare, Image, Zap, Film, Send, Music, Brain } from 'lucide-react';

const TOOLS = [
    { id: 'chat', name: 'Chat & Grounding', icon: <MessageSquare size={18} /> },
    { id: 'dialectic', name: 'Studio Élite (Dialectic)', icon: <Brain size={18} /> },
    { id: 'image', name: 'Gen 3 Pro Studio', icon: <Image size={18} /> },
    { id: 'flash', name: 'Magic Editor (Flash)', icon: <Zap size={18} /> },
    { id: 'video', name: 'Veo Video Studio', icon: <Film size={18} /> },
    { id: 'api', name: 'Live API', icon: <Send size={18} /> },
    { id: 'audio', name: 'Audio Studio', icon: <Music size={18} /> },
];

const Sidebar: React.FC<{ onSelect: (tool: string) => void; activeTool: string }> = ({ onSelect, activeTool }) => (
    <div className="sidebar">
        <div className="sidebar-header">
            <h2>Gemini Omni</h2>
            <p>Experimental AI Suite</p>
        </div>
        <nav className="sidebar-nav">
            <ul>
                {TOOLS.map(tool => (
                    <li key={tool.id} className={activeTool === tool.id ? 'active' : ''}>
                        <a href="#" onClick={(e) => { e.preventDefault(); onSelect(tool.id); }}>
                            <span className="tool-icon">{tool.icon}</span> {tool.name}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
        <div className="sidebar-footer">
            <p>Powered by Google Gemini</p>
        </div>
    </div>
);

const MainContent: React.FC<{ activeTool: string }> = ({ activeTool }) => {
    switch (activeTool) {
        case 'chat':
            return <ChatInterface />;
        case 'dialectic':
            return <DialecticMode />;
        case 'image':
            return <ProImageGen />;
        case 'audio':
            return <LiveAudio />;
        case 'flash':
        case 'video':
        case 'api':
        default:
            return (
                <div className="placeholder-content">
                    <div className="placeholder-icon">🤖</div>
                    <h2>Tool Not Implemented</h2>
                    <p>The UI for "{activeTool}" is under construction.</p>
                </div>
            );
    }
};

export const OmniSuite: React.FC = () => {
    const [activeTool, setActiveTool] = useState('chat');

    return (
        <div className="omni-suite-container">
            <Sidebar onSelect={setActiveTool} activeTool={activeTool} />
            <div className="main-content">
                <MainContent activeTool={activeTool} />
            </div>
        </div>
    );
};
