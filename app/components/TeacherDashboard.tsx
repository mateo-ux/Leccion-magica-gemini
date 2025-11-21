'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, ArrowRight, Search, Filter, Sparkles } from 'lucide-react';
import { mockData } from '../data/mockData';
import { ThemeToggleButton } from './ThemeProvider';
import ContentGeneratorModal from './ContentGeneratorModal';

interface TeacherDashboardProps {
    onBack: () => void;
}

export default function TeacherDashboard({ onBack }: TeacherDashboardProps) {
    const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Dashboard Docente
                    </h1>
                    <div className="flex items-center gap-3">
                        <ThemeToggleButton />
                        <button
                            onClick={onBack}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            ← Volver al Inicio
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        Bienvenida, Ana María
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Columna Principal */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Planificación Rápida */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                                    Planificación Rápida
                                </h3>
                                <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                    <div className="p-3 bg-white dark:bg-gray-700 rounded-full">
                                        <BrainCircuit className="w-6 h-6 text-blue-600 dark:text-sky-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            Generador de Contenidos con IA
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            Crea talleres, guías y evaluaciones en segundos.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsGeneratorOpen(true)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <Sparkles size={16} />
                                        Crear ahora
                                    </button>
                                </div>
                            </div>

                            {/* Calendario de Clases */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                                    Calendario de Clases
                                </h3>
                                <div className="space-y-3">
                                    {mockData.teacher.clases.map((clase) => (
                                        <motion.div
                                            key={clase.id}
                                            whileHover={{ scale: 1.02 }}
                                            className={`p-4 rounded-lg flex items-center justify-between ${clase.color}`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="font-bold text-gray-700 dark:text-gray-200">
                                                    {clase.time}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800 dark:text-white">
                                                        {clase.title}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {clase.subject} - Grado {clase.grade}
                                                    </p>
                                                </div>
                                            </div>
                                            <button className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
                                                <ArrowRight size={20} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Barra Lateral - Biblioteca */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                                Biblioteca de Recursos MEN
                            </h3>

                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar en biblioteca..."
                                    className="w-full bg-gray-100 dark:bg-gray-700 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white"
                                />
                            </div>

                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    Recursos Populares
                                </span>
                                <button className="flex items-center space-x-1 text-sm text-blue-600 dark:text-sky-400 hover:underline">
                                    <span>Filtrar</span>
                                    <Filter size={14} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {mockData.teacher.recursos.map((recurso, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-semibold text-sm text-gray-900 dark:text-white">
                                                {recurso.title}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {recurso.subject}
                                            </p>
                                        </div>
                                        <span className="text-xs font-medium bg-yellow-100 dark:bg-yellow-900/60 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
                                            {recurso.type}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
            {/* Modal del Generador */}
            <ContentGeneratorModal
                isOpen={isGeneratorOpen}
                onClose={() => setIsGeneratorOpen(false)}
            />
        </div>
    );
}