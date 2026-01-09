'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export default function StudentAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'assistant', content: '¡Hola! 🎓 Soy tu Tutor Mágico virtual. Estoy aquí para ayudarte a estudiar y entender tus tareas. ¿Qué quieres aprender hoy?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const newUserMessage: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('http://localhost:8000/api/assistant/student-chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: newUserMessage.content })
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Ups, mi magia está un poco lenta. Intenta de nuevo.' }]);
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'No pude conectarme. Revisa tu internet.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Botón Flotante (Color diferente al del profesor: Azul) */}
            <motion.button
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-full shadow-2xl z-50 flex items-center gap-2 border-2 border-white/20"
            >
                <Sparkles className="animate-pulse" />
                <span className="font-bold hidden md:inline">Tutor Mágico</span>
            </motion.button>

            {/* Modal de Chat (Simplificado) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        className="fixed inset-4 md:inset-auto md:bottom-24 md:right-6 md:w-[400px] md:h-[600px] z-[60] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-gray-700"
                    >
                        {/* Encabezado */}
                        <div className="p-4 bg-gradient-to-r from-blue-600 to-cyan-500 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <Sparkles size={20} />
                                <h3 className="font-bold">Tutor Mágico</h3>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Mensajes */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900 relative">
                             {/* Fondo decorativo sutil */}
                             <div className="absolute inset-0 opacity-[0.2] pointer-events-none z-0" 
                                     style={{ backgroundImage: 'radial-gradient(#3B82F6 1px, transparent 1px)', backgroundSize: '15px 15px' }}>
                            </div>

                            <div className="relative z-10 space-y-4">
                                {messages.map((msg, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div 
                                            className={`max-w-[85%] p-3 rounded-2xl shadow-sm text-sm ${
                                                msg.role === 'user' 
                                                ? 'bg-blue-600 text-white rounded-br-none' 
                                                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-none'
                                            }`}
                                        >
                                            {msg.role === 'assistant' ? (
                                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                                    <ReactMarkdown
                                                        components={{
                                                            a: ({node, ...props}) => (
                                                                <a 
                                                                    {...props} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer" 
                                                                    className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-xs font-medium text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-700 hover:bg-blue-100 hover:text-blue-700 transition-colors no-underline ml-1 max-w-[150px] truncate align-middle transform hover:scale-105"
                                                                >
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                                                                    <span className="truncate max-w-[120px]">{props.children}</span>
                                                                </a>
                                                            )
                                                        }}
                                                    >
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                </div>
                                            ) : (
                                                <p>{msg.content}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-bl-none border border-gray-100 dark:border-gray-700 flex gap-2">
                                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-100"></span>
                                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-200"></span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Pregunta sobre tu tarea..."
                                    className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                />
                                <button 
                                    onClick={handleSendMessage}
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
