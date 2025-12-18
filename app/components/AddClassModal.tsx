'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, Users, BookOpen, Check, Palette } from 'lucide-react';
import { ClassGroup } from './ClassesManager';

interface AddClassModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (newClass: Omit<ClassGroup, 'id' | 'lessons'>) => void;
    onEdit?: (id: string, updatedClass: Partial<ClassGroup>) => void;
    initialData?: ClassGroup | null;
}

const COLORS = [
    { label: 'Esmeralda', value: 'from-emerald-400 to-green-600' },
    { label: 'Azul', value: 'from-blue-400 to-indigo-600' },
    { label: 'Ámbar', value: 'from-amber-400 to-orange-600' },
    { label: 'Violeta', value: 'from-violet-400 to-purple-600' },
    { label: 'Rosa', value: 'from-pink-400 to-rose-600' },
    { label: 'Cian', value: 'from-cyan-400 to-blue-600' },
];

export default function AddClassModal({ isOpen, onClose, onAdd, onEdit, initialData }: AddClassModalProps) {
    const [subject, setSubject] = useState('');
    const [grade, setGrade] = useState('');
    const [studentCount, setStudentCount] = useState('');
    const [selectedColor, setSelectedColor] = useState(COLORS[0].value);

    // Sync state with initialData when modal opens
    useEffect(() => {
        if (isOpen && initialData) {
            setSubject(initialData.subject);
            setGrade(initialData.grade);
            setStudentCount(initialData.studentCount.toString());
            setSelectedColor(initialData.color);
        } else if (isOpen && !initialData) {
            // Reset if adding new
            setSubject('');
            setGrade('');
            setStudentCount('');
            setSelectedColor(COLORS[0].value);
        }
    }, [isOpen, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (initialData && onEdit) {
            onEdit(initialData.id, {
                subject,
                grade,
                studentCount: parseInt(studentCount) || 0,
                color: selectedColor
            });
        } else {
            onAdd({
                subject,
                grade,
                studentCount: parseInt(studentCount) || 0,
                color: selectedColor
            });
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <GraduationCap className="text-blue-600" />
                        {initialData ? 'Editar Clase' : 'Nueva Clase'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Materia / Asignatura
                        </label>
                        <div className="relative">
                            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                required
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Ej: Matemáticas"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Grado
                            </label>
                            <input
                                type="text"
                                required
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Ej: 6°"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Estudiantes
                            </label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={studentCount}
                                    onChange={(e) => setStudentCount(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Ej: 30"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Color de la Tarjeta
                        </label>
                        <div className="grid grid-cols-6 gap-2">
                            {COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => setSelectedColor(color.value)}
                                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${color.value} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 transition-all ${
                                        selectedColor === color.value ? 'ring-blue-500 scale-110' : 'ring-transparent opacity-70 hover:opacity-100'
                                    }`}
                                    title={color.label}
                                />
                            ))}
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                        <Check size={20} />
                        {initialData ? 'Guardar Cambios' : 'Crear Clase'}
                    </motion.button>
                </form>
            </motion.div>
        </motion.div>
    );
}
