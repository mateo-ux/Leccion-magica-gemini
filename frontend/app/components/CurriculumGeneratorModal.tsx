'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, BookOpen, Calendar, Target, Loader2, Copy, Check, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { callGroqAPI } from '../utils/groq';

interface CurriculumGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CurriculumGeneratorModal({ isOpen, onClose }: CurriculumGeneratorModalProps) {
    const [subject, setSubject] = useState('');
    const [grade, setGrade] = useState('');
    const [duration, setDuration] = useState('Anual');
    const [goals, setGoals] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [generatedContent, setGeneratedContent] = useState('');
    const [copied, setCopied] = useState(false);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setGeneratedContent('');

        const prompt = `
            Actúa como un experto coordinador pedagógico en Colombia.
            Diseña un Plan de Estudios ${duration} detallado para la asignatura de ${subject} para el grado ${grade}.
            ${goals ? `Enfoque específico u objetivos adicionales: ${goals}` : ''}

            El plan debe incluir:
            1. **Justificación y Objetivos de Aprendizaje** (alineados con DBAs y Estándares Básicos de Competencia del MEN).
            2. **Estructura Temática por Periodos** (Periodo 1, 2, 3 y 4).
               - Para cada periodo, lista las Unidades Temáticas y los temas principales.
            3. **Estrategias Metodológicas** sugeridas.
            4. **Criterios de Evaluación**.

            Usa formato Markdown profesional. Sé claro, estructurado y realista para el contexto educativo colombiano.
        `;

        try {
            const result = await callGroqAPI(prompt);
            setGeneratedContent(result);
        } catch (error) {
            console.error(error);
            setGeneratedContent("Hubo un error al generar el currículum. Por favor intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 30 }}
                className="bg-white dark:bg-gray-800 w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 dark:border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg text-teal-600 dark:text-teal-400">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Generador de Currículum
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Planifica tu año escolar con IA experta
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    >
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                    {/* Left Sidebar - Form */}
                    <div className="w-full md:w-1/3 p-6 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-100 dark:border-gray-700 overflow-y-auto">
                        <form onSubmit={handleGenerate} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Asignatura
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                    placeholder="Ej: Biología"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Grado
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                    placeholder="Ej: 9°"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Duración / Alcance
                                </label>
                                <select 
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                >
                                    <option value="Anual">Plan Anual (4 Periodos)</option>
                                    <option value="Semestral">Plan Semestral</option>
                                    <option value="Por Periodo">Un solo Periodo</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Enfoque u Objetivos (Opcional)
                                </label>
                                <textarea
                                    value={goals}
                                    onChange={(e) => setGoals(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-teal-500 outline-none transition-all h-24 resize-none"
                                    placeholder="Ej: Enfocarse en competencias ciudadanas..."
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Planificando...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        Generar Currículum
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </div>

                    {/* Right Side - Content */}
                    <div className="flex-1 bg-white dark:bg-gray-800 p-8 overflow-y-auto relative">
                        {!generatedContent && !isLoading && (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center opacity-60">
                                <BookOpen size={64} className="mb-4 text-teal-200 dark:text-gray-600" />
                                <p className="text-lg font-medium">Configura el plan en el panel izquierdo</p>
                                <p className="text-sm">La IA generará un currículum completo alineado al MEN.</p>
                            </div>
                        )}

                        {generatedContent && (
                            <div className="prose dark:prose-invert max-w-none">
                                <ReactMarkdown>{generatedContent}</ReactMarkdown>
                                <div className="h-20" /> {/* Spacer */}
                            </div>
                        )}

                        {generatedContent && (
                             <div className="absolute bottom-6 right-8 flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleCopy}
                                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-lg shadow-sm flex items-center gap-2 transition-colors font-medium border border-gray-200 dark:border-gray-600"
                                >
                                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                    {copied ? '¡Copiado!' : 'Copiar'}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-lg shadow-teal-600/20 flex items-center gap-2 transition-colors font-medium"
                                >
                                    <Download size={18} />
                                    Descargar PDF
                                </motion.button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
