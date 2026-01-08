'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { ThemeToggleButton } from './ThemeProvider';
import { useRouter } from 'next/navigation';

interface StudentDashboardProps {
    onBack: () => void;
}

export default function StudentDashboard({ onBack }: StudentDashboardProps) {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        router.push('/login');
    };

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
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 font-medium"
                        >
                            Cerrar Sesión
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
                                {/* Placeholder para integración backend */}
                                <div className="col-span-1 md:col-span-2 text-center py-10 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                                    <p className="text-gray-500 dark:text-gray-400">Cargando módulos de aprendizaje...</p>
                                </div>
                            </div>
                        </div>

                        {/* Logros */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                                Logros Recientes
                            </h3>
                            <div className="space-y-4">
                                {/* Placeholder para integración backend */}
                                <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
                                    <p>Tus logros aparecerán aquí.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}