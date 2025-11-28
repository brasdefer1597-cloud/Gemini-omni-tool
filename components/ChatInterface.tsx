
// components/ChatInterface.tsx
/**
 * @file Componente presentacional ("tonto") para la interfaz de chat.
 * No contiene lógica de negocio. Su única responsabilidad es renderizar el estado
 * proporcionado por el hook `useChatState` y delegar las acciones del usuario
 * a las funciones expuestas por ese mismo hook.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useChatState, ChatMessage } from '../hooks/useChatState';

const Message: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const getRoleClass = (role: ChatMessage['role']) => {
        switch (role) {
            case 'user': return 'message-user';
            case 'model': return 'message-model';
            case 'system': return 'message-system';
            default: return '';
        }
    };

    return (
        <div className={`message ${getRoleClass(message.role)}`}>
            <p>{message.content}</p>
        </div>
    );
};

export const ChatInterface: React.FC = () => {
    const { messages, isLoading, error, sendMessage } = useChatState();
    const [prompt, setPrompt] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (prompt.trim() && !isLoading) {
            sendMessage(prompt);
            setPrompt('');
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map(msg => <Message key={msg.id} message={msg} />)}
                {isLoading && (
                    <div className="message message-system">
                        <p><i>Pensando...</i></p>
                    </div>
                )}
                {error && (
                    <div className="message message-system error">
                        <p>{error.message}</p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-area">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Escribe tu mensaje aquí..."
                    disabled={isLoading}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />
                <button onClick={handleSend} disabled={isLoading}>
                    {isLoading ? 'Enviando...' : 'Enviar'}
                </button>
            </div>
        </div>
    );
};
