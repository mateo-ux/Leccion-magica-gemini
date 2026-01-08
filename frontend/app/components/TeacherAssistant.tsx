'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, BookOpen, Calculator, Edit3, Image as ImageIcon } from 'lucide-react';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export default function TeacherAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'assistant', content: '¡Hola! Soy Lección Mágica, tu asistente pedagógico. ¿En qué puedo ayudarte hoy a transformar tu clase?' }
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
            const response = await fetch('http://localhost:8000/api/assistant/chat/', {
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
                setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, tuve un problema al conectarme con mis circuitos mágicos. Por favor intenta de nuevo.' }]);
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Error de conexión. Verifica tu internet.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Botón Flotante */}
            <motion.button
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-full shadow-2xl z-50 flex items-center gap-2 border-2 border-white/20"
            >
                <Sparkles className="animate-pulse" />
                <span className="font-bold hidden md:inline">Asistente Mágico</span>
            </motion.button>

            {/* Modal Pantalla Completa (Casi) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        className="fixed inset-4 md:inset-10 z-[60] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl flex overflow-hidden border border-gray-100 dark:border-gray-700"
                    >
                        {/* Botón Cerrar */}
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 z-10 p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-500 hover:text-red-500 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        {/* Panel Izquierdo: Herramientas / Módulos */}
                        <div className="hidden md:flex w-1/3 bg-gray-50 dark:bg-gray-800/50 p-8 flex-col border-r border-gray-200 dark:border-gray-700">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                                <Sparkles className="text-purple-500" />
                                Herramientas
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                                Selecciona un modulo.
                            </p>

                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { icon: BookOpen, label: "Crear Lección", color: "bg-blue-100 text-blue-600" },
                                    { icon: Calculator, label: "Generador de contenido", color: "bg-green-100 text-green-600" },
                                    { icon: Edit3, label: "Curriculum", color: "bg-orange-100 text-orange-600" },
                                    { icon: ImageIcon, label: "Generador de actividades", color: "bg-pink-100 text-pink-600" },
                                    { icon: ImageIcon, label: "Gestion de Clases", color: "bg-pink-100 text-pink-600" },
                                ].map((item, idx) => (
                                    <button 
                                        key={idx}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 hover:shadow-md transition-shadow border border-transparent hover:border-purple-200 text-left group"
                                    >
                                        <div className={`p-3 rounded-lg ${item.color} group-hover:scale-110 transition-transform`}>
                                            <item.icon size={20} />
                                        </div>
                                        <span className="font-semibold text-gray-700 dark:text-gray-200">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                            
                            <div className="mt-auto bg-purple-100 dark:bg-purple-900/20 p-4 rounded-xl">
                                <p className="text-xs text-purple-800 dark:text-purple-200 font-medium text-center">
                                    💡 Tip: Pídele a Mágico que cree una rúbrica de evaluación.
                                </p>
                            </div>
                        </div>

                        {/* Panel Derecho: Chat */}
                        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 relative">
                            {/* encabezado de el chat */}
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Chat Pedagógico</h3>
                                <p className="text-xs text-green-500 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    En línea
                                </p>
                            </div>

                            {/* Mensajes */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50 dark:bg-gray-900/50 relative">
                                {/* Patrón de puntos sutiles para el área de chat*/}
                                <div className="absolute inset-0 opacity-[0.4] pointer-events-none z-0" 
                                     style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                                </div>
                                
                                <div className="relative z-10 space-y-4">
                                {messages.map((msg, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div 
                                            className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                                                msg.role === 'user' 
                                                ? 'bg-blue-600 text-white rounded-br-none' 
                                                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-none'
                                            }`}
                                        >
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-bl-none border border-gray-100 dark:border-gray-700 flex gap-2">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                                </div>
                            </div>

                            {/* Área de entrada */}
                            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Escribe tu consulta pedagógica aquí..."
                                        className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow shadow-inner"
                                    />
                                    <button 
                                        onClick={handleSendMessage}
                                        disabled={!input.trim() || isLoading}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/*Telón de fondo borroso cuando está abierta */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
