'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, LayoutList, Calendar as CalendarIcon, Target, Loader2, Check, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { callGroqAPI } from '../utils/groq';
import { ClassGroup } from './ClassesManager';

export interface Activity {
    id: string;
    title: string;
    description: string;
    type: string;
    deadline: string;
    classId: string;
    className: string;
}

interface ActivityGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    classes: ClassGroup[];
    onSaveActivity: (activity: Activity) => void;
}

export default function ActivityGeneratorModal({ isOpen, onClose, classes, onSaveActivity }: ActivityGeneratorModalProps) {
    const [topic, setTopic] = useState('');
    const [activityType, setActivityType] = useState('Taller');
    const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
    const [deadline, setDeadline] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [generatedInstructions, setGeneratedInstructions] = useState('');

    const handleGenerate = async () => {
        if (!topic) return;
        setIsLoading(true);

        const selectedClass = classes.find(c => c.id === selectedClassId);
        const gradeContext = selectedClass ? `para estudiantes de grado ${selectedClass.grade} en la asignatura ${selectedClass.subject}` : '';

        const prompt = `
            Actúa como un docente creativo. Diseña una actividad de tipo "${activityType}" sobre el tema "${topic}" ${gradeContext}.
            
            La salida debe ser breve y estructurada, lista para copiar y pegar en un LMS o tablero:
            1. **Título Llamativo**
            2. **Objetivo** (1 frase)
            3. **Instrucciones paso a paso** (Claras y directas)
            4. **Criterios de Evaluación básicos**

            Usa Markdown.
        `;

        try {
            const result = await callGroqAPI(prompt);
            setGeneratedInstructions(result);
        } catch (error) {
            console.error(error);
            setGeneratedInstructions("Error al generar la actividad.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = () => {
        const selectedClass = classes.find(c => c.id === selectedClassId);
        if (!selectedClass || !deadline || !topic) return;

        const newActivity: Activity = {
            id: Date.now().toString(),
            title: topic, // O parsear el título del markdown si fuera necesario
            description: generatedInstructions,
            type: activityType,
            deadline: deadline,
            classId: selectedClass.id,
            className: selectedClass.grade + ' ' + selectedClass.subject
        };

        onSaveActivity(newActivity);
        
        // Reset and close
        setTopic('');
        setGeneratedInstructions('');
        setDeadline('');
        onClose();
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
                className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 dark:border-gray-700 max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <LayoutList className="text-orange-600" />
                        Crear Actividad con IA
                    </h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">
                    {/* Setup Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-1 md:col-span-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tema de la Actividad</label>
                            <input 
                                type="text" 
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="w-full mt-1 px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700" 
                                placeholder="Ej: Las Células Eucariotas"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</label>
                            <select 
                                value={activityType}
                                onChange={(e) => setActivityType(e.target.value)}
                                className="w-full mt-1 px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
                            >
                                <option value="Taller">Taller / Guía</option>
                                <option value="Examen">Examen / Quiz</option>
                                <option value="Proyecto">Proyecto</option>
                                <option value="Tarea">Tarea para Casa</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Clase Asignada</label>
                            <select 
                                value={selectedClassId}
                                onChange={(e) => setSelectedClassId(e.target.value)}
                                className="w-full mt-1 px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
                            >
                                {classes.map(cls => (
                                    <option key={cls.id} value={cls.id}>{cls.subject} - {cls.grade}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                     {/* Generate Button */}
                    {!generatedInstructions && (
                        <button 
                            onClick={handleGenerate}
                            disabled={isLoading || !topic}
                            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                            Generar Instrucciones
                        </button>
                    )}

                    {/* Result and Deadline */}
                    <AnimatePresence>
                        {generatedInstructions && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                                <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-800/30">
                                    <h4 className="font-bold text-orange-800 dark:text-orange-300 mb-2 flex items-center gap-2">
                                        <Sparkles size={16} /> Contenido Generado
                                    </h4>
                                    <div className="prose prose-sm dark:prose-invert max-h-60 overflow-y-auto">
                                        <ReactMarkdown>{generatedInstructions}</ReactMarkdown>
                                    </div>
                                    <div className="mt-2 text-xs text-center text-gray-400">
                                        Puedes editar esto manualmente luego si lo deseas.
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <CalendarIcon size={16} className="text-red-500" />
                                        Fecha Límite de Entrega
                                    </label>
                                    <input 
                                        type="date" 
                                        required
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                        className="w-full mt-1 px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 outline-none" 
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button 
                                        onClick={() => setGeneratedInstructions('')}
                                        className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Re-generar
                                    </button>
                                    <button 
                                        onClick={handleSave}
                                        disabled={!deadline}
                                        className="flex-[2] py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                                    >
                                        <Send size={20} />
                                        Asignar Actividad
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
}
