'use client'

import { motion } from 'framer-motion';
import { X, BookOpen, Calendar, Stars } from 'lucide-react';
import { Lesson } from './ClassesManager';

interface LessonViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    lesson: Lesson | null;
}

export default function LessonViewModal({ isOpen, onClose, lesson }: LessonViewModalProps) {
    if (!isOpen || !lesson) return null;

    // Función auxiliar para renderizar HTML seguro (similar a ContentGeneratorModal)
    // En un caso real, esto debería estar en un hook o utilidad compartida
    const formatMarkdown = (text: string) => {
        if (!text) return '';
        // Esta es una versión simplificada, asumiendo que el contenido ya viene formateado o es HTML
        // Si viene como markdown puro, necesitaríamos el parser completo aquí también
        return text; 
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-100 dark:border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 flex justify-between items-center text-white shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                {lesson.topic}
                                <Stars size={16} className="text-yellow-300" />
                            </h3>
                            <div className="flex items-center gap-2 text-purple-100 text-sm">
                                <Calendar size={14} />
                                {lesson.date}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-gray-900/50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
                         <div
                            className="text-gray-800 dark:text-gray-200 leading-relaxed"
                            style={{ fontSize: '16px', lineHeight: '1.8' }}
                            // Asumimos que el contenido guardado ya es HTML procesado del generador
                            // O si es raw markdown, idealmente reutilizaríamos el parser
                            dangerouslySetInnerHTML={{ __html: lesson.content }}
                        />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
