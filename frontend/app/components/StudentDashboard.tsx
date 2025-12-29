'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, MessageSquare } from 'lucide-react';
import { mockData } from '../data/mockData';
import { ThemeToggleButton } from './ThemeProvider';
import TutorChat from './TutorChat';

interface StudentDashboardProps {
    onBack: () => void;
}

export default function StudentDashboard({ onBack }: StudentDashboardProps) {
    const [isTutorOpen, setIsTutorOpen] = useState(false);
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Dashboard Estudiante
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
                    {/* Banner de Bienvenida */}
                    <div className="bg-gradient-to-r from-blue-600 to-sky-400 p-6 rounded-xl shadow-lg mb-6 flex items-center justify-between text-white">
                        <div>
                            <h2 className="text-2xl font-bold">¡Hola, Carlos! ¿Listo para aprender?</h2>
                            <p className="opacity-90">Tu tutor virtual está aquí para ayudarte.</p>
                        </div>
                        <div className="relative w-24 h-24">
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-red-500 rounded-full animate-pulse blur-md"></div>
                            <img
                                src="https://placehold.co/96x96/1E3A8A/FFFFFF?text=IA"
                                alt="Tutor IA Avatar"
                                className="w-24 h-24 rounded-full relative z-10 border-4 border-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Módulos de Aprendizaje */}
                        <div className="lg:col-span-2 space-y-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                Mis Módulos de Aprendizaje
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {mockData.student.modules.map((mod, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                                        className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <span className="text-3xl">{mod.icon}</span>
                                                <h4 className="font-bold mt-2 text-gray-900 dark:text-white">
                                                    {mod.title}
                                                </h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {mod.subject}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-2 text-green-500 font-bold">
                                                <CheckCircle size={18} />
                                                <span>{mod.progress}%</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-4">
                                            <div
                                                className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                                                style={{ width: `${mod.progress}%` }}
                                            ></div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Logros */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                                Logros Recientes
                            </h3>
                            <div className="space-y-4">
                                {mockData.student.achievements.map((ach, i) => (
                                    <div key={i} className="flex items-center space-x-4">
                                        <div className="text-3xl bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-full">
                                            {ach.icon}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {ach.title}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {ach.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Botón Flotante del Tutor */}
            <motion.button
                onClick={() => setIsTutorOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg z-40 flex items-center gap-2"
            >
                <MessageSquare />
                <span className="font-semibold">Tutor IA</span>
            </motion.button>

            {/* Chat del Tutor */}
            <TutorChat
                isOpen={isTutorOpen}
                onClose={() => setIsTutorOpen(false)}
            />
        </div>
    );
}