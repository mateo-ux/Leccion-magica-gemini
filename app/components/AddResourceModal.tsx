'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, FileText, Link as LinkIcon, Upload, Check, BookOpen, FileDigit } from 'lucide-react';

export interface Resource {
    id: string;
    title: string;
    subject: string;
    type: 'PDF' | 'Link' | 'Video' | 'Doc';
    date: string;
}

interface AddResourceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (resource: Omit<Resource, 'id' | 'date'>) => void;
}

export default function AddResourceModal({ isOpen, onClose, onAdd }: AddResourceModalProps) {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [type, setType] = useState<Resource['type']>('PDF');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            title,
            subject,
            type,
        });
        // Reset form
        setTitle('');
        setSubject('');
        setType('PDF');
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
                        <Upload className="text-pink-600" />
                        Agregar Recurso
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
                            Título del Recurso
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none"
                            placeholder="Ej: Guía de Laboratorio..."
                        />
                    </div>

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
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none"
                                placeholder="Ej: Ciencias Naturales"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tipo de Archivo
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {(['PDF', 'Link', 'Video', 'Doc'] as const).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    className={`flex items-center justify-center gap-2 py-2 rounded-lg border transition-all ${
                                        type === t
                                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400'
                                        : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                                    }`}
                                >
                                    {t === 'PDF' && <FileDigit size={18} />}
                                    {t === 'Link' && <LinkIcon size={18} />}
                                    {t === 'Doc' && <FileText size={18} />}
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                     {/* Simulación de Subida */}
                    <div className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-6 text-center text-gray-400 dark:text-gray-500 hover:border-pink-400 hover:text-pink-500 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-800/30">
                        <Upload className="mx-auto mb-2" size={24} />
                        <p className="text-sm">Haz clic para buscar en tu dispositivo</p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full mt-2 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                        <Check size={20} />
                        Guardar Recurso
                    </motion.button>
                </form>
            </motion.div>
        </motion.div>
    );
}
