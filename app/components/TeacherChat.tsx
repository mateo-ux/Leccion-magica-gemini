'use client'

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, Send, Lightbulb, BookOpen, GraduationCap, Brain } from 'lucide-react';
import { callGroqAPI } from '../utils/groq';

interface TeacherChatProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Message {
    text: string;
    from: 'user' | 'bot';
    timestamp: Date;
}

export default function TeacherChat({ isOpen, onClose }: TeacherChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            text: "¡Hola! Soy tu asistente pedagógico. Puedo ayudarte con estrategias de enseñanza, planificación de clases, gestión del aula, recursos educativos y mucho más. ¿En qué puedo ayudarte hoy?",
            from: "bot",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const currentInput = input.trim();
        const userMessage: Message = {
            text: currentInput,
            from: "user",
            timestamp: new Date()
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const conversationHistory = messages
                .slice(-6)
                .map(msg => `${msg.from === 'user' ? 'Profesor' : 'Asistente'}: ${msg.text}`)
                .join('\n');

            const prompt = `Eres un asistente pedagógico experto llamado 'MagiTeach'. Tu audiencia son profesores y docentes en Colombia.

Tu especialidad incluye:
- Estrategias de enseñanza y metodologías activas
- Planificación curricular y diseño de clases
- Gestión del aula y manejo de grupos
- Evaluación y retroalimentación
- Adaptación para diferentes estilos de aprendizaje
- Recursos educativos y herramientas digitales
- Motivación estudiantil
- Inclusión y diversidad en el aula

Historial reciente:
${conversationHistory}

Pregunta actual del profesor:
"${currentInput}"

Proporciona una respuesta profesional, práctica y aplicable. Usa ejemplos concretos cuando sea relevante. Mantén un tono cercano pero profesional. Máximo 4-5 párrafos.`;

            const botResponse = await callGroqAPI(prompt);
            setMessages((prev) => [...prev, {
                text: botResponse,
                from: "bot",
                timestamp: new Date()
            }]);
        } catch (error) {
            console.error('Error en chat:', error);
            setMessages((prev) => [...prev, {
                text: "Lo siento, hubo un error al procesar tu pregunta. Por favor intenta de nuevo.",
                from: "bot",
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatText = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br />');
    };

    const quickSuggestions = [
        { icon: Lightbulb, text: "Ideas para motivar estudiantes", color: "from-yellow-500 to-orange-500" },
        { icon: BookOpen, text: "Estrategias de lectoescritura", color: "from-blue-500 to-cyan-500" },
        { icon: GraduationCap, text: "Evaluación formativa efectiva", color: "from-purple-500 to-pink-500" },
        { icon: Brain, text: "Actividades para pensamiento crítico", color: "from-green-500 to-emerald-500" }
    ];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-6 right-6 z-50"
            >
                <div className="w-[450px] h-[650px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-5">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

                        <div className="relative flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                >
                                    <Bot className="text-white" size={24} />
                                </motion.div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">Chat Pedagógico</h3>
                                    <p className="text-xs text-white/80">Tu asistente educativo IA</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X size={20} className="text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-gray-800">
                        {messages.length === 1 && (
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                {quickSuggestions.map((suggestion, i) => (
                                    <motion.button
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        onClick={() => setInput(suggestion.text)}
                                        className={`p-3 rounded-lg bg-gradient-to-br ${suggestion.color} text-white shadow-md hover:shadow-lg transition-all duration-200 text-left`}
                                    >
                                        <suggestion.icon size={16} className="mb-1" />
                                        <p className="text-xs font-semibold leading-tight">{suggestion.text}</p>
                                    </motion.button>
                                ))}
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex items-end gap-2 ${
                                    msg.from === 'user' ? 'justify-end' : 'justify-start'
                                }`}
                            >
                                {msg.from === 'bot' && (
                                    <motion.div
                                        className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center flex-shrink-0 shadow-md"
                                        animate={{ rotate: [0, 5, -5, 0] }}
                                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                    >
                                        <Bot size={16} />
                                    </motion.div>
                                )}
                                <div
                                    className={`max-w-[75%] p-3 rounded-2xl shadow-md ${
                                        msg.from === 'user'
                                            ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-br-md'
                                            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-md border border-gray-200 dark:border-gray-700'
                                    }`}
                                >
                                    <p
                                        className="text-sm leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                                    />
                                </div>
                            </motion.div>
                        ))}

                        {/* Loading Indicator */}
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-start gap-2"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                                    <Bot size={16} />
                                </div>
                                <div className="max-w-[75%] p-3 rounded-2xl bg-white dark:bg-gray-800 flex items-center gap-2 shadow-md">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                                </div>
                            </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Pregúntame sobre pedagogía..."
                                disabled={isLoading}
                                className="w-full p-3 pr-12 rounded-xl bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white disabled:opacity-50 text-sm"
                            />
                            <motion.button
                                onClick={handleSendMessage}
                                disabled={isLoading || !input.trim()}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={16} />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}