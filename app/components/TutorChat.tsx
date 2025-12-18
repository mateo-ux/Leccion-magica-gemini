'use client'

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, Send } from 'lucide-react';
import { callGroqAPI } from '../utils/groq';

interface TutorChatProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Message {
    text: string;
    from: 'user' | 'bot';
}

export default function TutorChat({ isOpen, onClose }: TutorChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        { text: "¡Hola! Soy tu tutor mágico. ¿En qué puedo ayudarte a aprender hoy?", from: "bot" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { text: input, from: "user" };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const prompt = `Eres un tutor virtual amigable y paciente llamado 'Magi'. Tu audiencia son estudiantes de primaria y bachillerato en Colombia. 

Explica conceptos de forma simple, con analogías y ejemplos cercanos a la cultura colombiana si es posible. 

Responde a la siguiente pregunta del estudiante de manera clara y educativa:

"${input}"

Mantén la respuesta en máximo 3-4 párrafos cortos.`;

        const botResponse = await callGroqAPI(prompt);
        setMessages((prev) => [...prev, { text: botResponse, from: "bot" }]);
        setIsLoading(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Función para formatear texto simple
    const formatText = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br />');
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 right-6 z-50"
        >
            <div className="w-96 h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col">
                {/* Header */}
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                        <Bot className="text-blue-500" />
                        Tutor Mágico
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex items-end gap-2 ${msg.from === 'user' ? 'justify-end' : 'justify-start'
                                }`}
                        >
                            {msg.from === 'bot' && (
                                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                                    <Bot size={20} />
                                </div>
                            )}
                            <div
                                className={`max-w-[80%] p-3 rounded-2xl ${msg.from === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-lg'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-lg'
                                    }`}
                            >
                                <p
                                    className="text-sm"
                                    dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                                />
                            </div>
                        </div>
                    ))}

                    {/* Loading Indicator */}
                    {isLoading && (
                        <div className="flex justify-start gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                                <Bot size={20} />
                            </div>
                            <div className="max-w-[80%] p-3 rounded-2xl bg-gray-200 dark:bg-gray-700 flex items-center gap-2">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t dark:border-gray-700">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Pregúntame algo..."
                            disabled={isLoading}
                            className="w-full p-3 pr-12 rounded-full bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white disabled:opacity-50"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}