'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { callGeminiAPI } from '../utils/gemini';

interface ContentGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ContentGeneratorModal({ isOpen, onClose }: ContentGeneratorModalProps) {
    const [subject, setSubject] = useState('Ciencias');
    const [topic, setTopic] = useState('El Ciclo del Agua');
    const [grade, setGrade] = useState('6°');
    const [generatedContent, setGeneratedContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setGeneratedContent('');

        const prompt = `Actúa como un experto pedagogo colombiano. Crea una guía de actividad detallada para una clase en Colombia.
    
- Materia: ${subject}
- Tema: ${topic}
- Grado: ${grade}

La guía debe incluir los siguientes apartados claramente definidos:

1. **Objetivos de Aprendizaje:** (Basados en los estándares del Ministerio de Educación Nacional de Colombia si es posible).

2. **Materiales Necesarios:** (Lista de materiales fáciles de conseguir en Colombia).

3. **Actividad Paso a Paso:** (Instrucciones claras y concisas para el docente y los estudiantes).

4. **Evaluación Sugerida:** (Una idea de cómo evaluar el aprendizaje de los estudiantes).

5. **Actividad para Casa (Opcional):** (Una tarea simple para reforzar el conocimiento).

Utiliza un lenguaje amigable y profesional. Formatea la respuesta usando Markdown.`;

        const response = await callGeminiAPI(prompt);
        setGeneratedContent(response);
        setIsLoading(false);
    };

    // Función para formatear el texto de markdown simple
    const formatMarkdown = (text: string) => {
        if (!text) return '';
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Negrita
            .replace(/\n/g, '<br />'); // Saltos de línea
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="text-yellow-500" />
                        Generador de Actividades Mágicas
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                    {/* Formulario */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Materia
                            </label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Tema
                            </label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Grado
                            </label>
                            <input
                                type="text"
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Loading */}
                    {isLoading && (
                        <div className="flex justify-center items-center gap-3 text-center p-8">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            >
                                <Sparkles className="text-blue-600" />
                            </motion.div>
                            <span className="text-gray-700 dark:text-gray-300">Generando ideas mágicas...</span>
                        </div>
                    )}

                    {/* Contenido Generado */}
                    {generatedContent && (
                        <div
                            className="prose prose-sm dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg"
                            dangerouslySetInnerHTML={{ __html: formatMarkdown(generatedContent) }}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t dark:border-gray-700">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        <Sparkles size={18} />
                        {isLoading ? 'Generando...' : 'Generar Actividad Mágica'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}