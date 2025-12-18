'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    X,
    Sparkles,
    Wand2,
    MessageCircle,
    Lightbulb,
    Zap,
    Stars,
    GraduationCap,
    FileText,
    Maximize2,
    Minimize2
} from 'lucide-react';
import { callGroqAPI } from '../utils/groq';
import TeacherChat from './TeacherChat';

interface ContentGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ContentGeneratorModal({ isOpen, onClose }: ContentGeneratorModalProps) {
    // Estados para generación
    const [subject, setSubject] = useState('Ciencias');
    const [topic, setTopic] = useState('El Ciclo del Agua');
    const [grade, setGrade] = useState('6°');
    const [generatedContent, setGeneratedContent] = useState('');
    const [isLoadingGenerate, setIsLoadingGenerate] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const handleGenerate = async () => {
        setIsLoadingGenerate(true);
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

        const response = await callGroqAPI(prompt);
        setGeneratedContent(response);
        setIsLoadingGenerate(false);
    };

    const formatMarkdown = (text: string) => {
        if (!text) return '';

        // Procesar el texto para mejor formato
        let formatted = text
            // Convertir títulos con ###
            .replace(/###\s*(.*?)(\n|$)/g, '<h3 class="text-2xl font-bold mt-8 mb-4 text-purple-600 dark:text-purple-400">$1</h3>')
            // Convertir títulos con ##
            .replace(/##\s*(.*?)(\n|$)/g, '<h2 class="text-3xl font-bold mt-10 mb-5 text-purple-700 dark:text-purple-300">$1</h2>')
            // Convertir negrita **texto**
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-white text-xl">$1</strong>')
            // Convertir items de lista - item
            .replace(/^-\s+(.+)$/gm, '<li class="ml-8 mb-3">$1</li>')
            // Convertir números de lista 1. item
            .replace(/^\d+\.\s+(.+)$/gm, '<li class="ml-8 mb-3">$1</li>')
            // Doble salto de línea = párrafo
            .replace(/\n\n/g, '</p><p class="mb-6">')
            // Un solo salto de línea = <br>
            .replace(/\n/g, '<br />');

        // Envolver listas
        formatted = formatted.replace(/(<li.*?<\/li>)+/g, (match) => {
            return '<ul class="list-disc my-6 space-y-3 ml-6">' + match + '</ul>';
        });

        // Envolver en párrafo si no está ya envuelto
        if (!formatted.startsWith('<')) {
            formatted = '<p class="mb-6">' + formatted + '</p>';
        }

        return formatted;
    };

    if (!isOpen) return null;

    return (
        <>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-pink-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, y: -20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: -20, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden border border-white/20 dark:border-gray-700/50"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header con diseño mejorado */}
                <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

                    <div className="relative flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <motion.div
                                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl"
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            >
                                <Wand2 className="w-7 h-7 text-white" />
                            </motion.div>
                            <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    Asistente Pedagógico IA
                                </h2>
                                <p className="text-white/80 text-sm">Potencia tu enseñanza con inteligencia artificial</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 text-white"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Botón de Chat Pedagógico */}
                    <div className="mt-6">
                        <motion.button
                            onClick={() => setIsChatOpen(true)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
                        >
                            <MessageCircle size={18} />
                            Abrir Chat Pedagógico
                        </motion.button>
                    </div>
                </div>

                {/* Body con animaciones */}
                <div className="flex-1 overflow-hidden p-8 overflow-y-auto">
                                {/* Formulario con diseño mejorado */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="group"
                                    >
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            <FileText size={16} className="text-blue-500" />
                                            Materia
                                        </label>
                                        <input
                                            type="text"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-800 dark:text-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 outline-none"
                                            placeholder="Ej: Matemáticas, Ciencias..."
                                        />
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="group"
                                    >
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            <Lightbulb size={16} className="text-yellow-500" />
                                            Tema
                                        </label>
                                        <input
                                            type="text"
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-800 dark:text-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 outline-none"
                                            placeholder="Ej: El Ciclo del Agua..."
                                        />
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="group"
                                    >
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            <GraduationCap size={16} className="text-green-500" />
                                            Grado
                                        </label>
                                        <input
                                            type="text"
                                            value={grade}
                                            onChange={(e) => setGrade(e.target.value)}
                                            className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-800 dark:text-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 outline-none"
                                            placeholder="Ej: 6°, 9°..."
                                        />
                                    </motion.div>
                                </div>

                                {/* Botón de generación mejorado */}
                                <motion.button
                                    onClick={handleGenerate}
                                    disabled={isLoadingGenerate}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mb-8 relative overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <span className="relative flex items-center gap-3">
                                        {isLoadingGenerate ? (
                                            <>
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                >
                                                    <Sparkles size={20} />
                                                </motion.div>
                                                Generando clase mágica...
                                            </>
                                        ) : (
                                            <>
                                                <Zap size={20} />
                                                Generar Clase con IA
                                                <Stars size={20} />
                                            </>
                                        )}
                                    </span>
                                </motion.button>

                                {/* Loading mejorado */}
                                {isLoadingGenerate && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex flex-col items-center gap-4 p-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl"
                                    >
                                        <div className="flex gap-2">
                                            <motion.div
                                                animate={{ y: [0, -20, 0] }}
                                                transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                                                className="w-4 h-4 bg-blue-600 rounded-full"
                                            />
                                            <motion.div
                                                animate={{ y: [0, -20, 0] }}
                                                transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                                                className="w-4 h-4 bg-purple-600 rounded-full"
                                            />
                                            <motion.div
                                                animate={{ y: [0, -20, 0] }}
                                                transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                                                className="w-4 h-4 bg-pink-600 rounded-full"
                                            />
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 font-medium">Creando contenido pedagógico personalizado...</p>
                                    </motion.div>
                                )}

                                {/* Contenido generado mejorado */}
                                {generatedContent && !isLoadingGenerate && (
                                    <>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-purple-200 dark:border-purple-900/50 shadow-xl"
                                        >
                                            <div className="flex items-center justify-between p-6 border-b border-purple-200 dark:border-purple-800 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900">
                                                <div className="flex items-center gap-2">
                                                    <Stars className="text-purple-600" size={24} />
                                                    <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 m-0">Tu Clase Generada</h3>
                                                </div>
                                                <div className="flex gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => setIsFullscreen(true)}
                                                        className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                                                        title="Ver en pantalla completa"
                                                    >
                                                        <Maximize2 size={20} />
                                                    </motion.button>
                                                </div>
                                            </div>
                                            <div
                                                className="p-8 text-gray-700 dark:text-gray-300 leading-relaxed overflow-y-auto max-h-[450px]"
                                                style={{ fontSize: '18px', lineHeight: '2' }}
                                                dangerouslySetInnerHTML={{ __html: formatMarkdown(generatedContent) }}
                                            />
                                        </motion.div>

                                        {/* Modal de Pantalla Completa */}
                                        {isFullscreen && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                                                onClick={() => setIsFullscreen(false)}
                                            >
                                                <motion.div
                                                    initial={{ scale: 0.9, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    exit={{ scale: 0.9, opacity: 0 }}
                                                    className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {/* Header Fullscreen */}
                                                    <div className="flex items-center justify-between p-6 border-b border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
                                                        <div className="flex items-center gap-3">
                                                            <Stars className="text-purple-600" size={28} />
                                                            <h2 className="text-3xl font-bold text-purple-600 dark:text-purple-400">Tu Clase Generada</h2>
                                                        </div>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => setIsFullscreen(false)}
                                                            className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                                                        >
                                                            <Minimize2 size={24} />
                                                        </motion.button>
                                                    </div>

                                                    {/* Contenido Fullscreen */}
                                                    <div
                                                        className="flex-1 overflow-y-auto p-12 text-gray-700 dark:text-gray-300 leading-relaxed"
                                                        style={{ fontSize: '20px', lineHeight: '2.2' }}
                                                        dangerouslySetInnerHTML={{ __html: formatMarkdown(generatedContent) }}
                                                    />
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </>
                                )}
                            </div>
            </motion.div>
        </motion.div>

            {/* Chat Flotante */}
            <TeacherChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </>
    );
}