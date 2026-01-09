'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Plus, ArrowRight } from 'lucide-react';

export default function TeacherClassrooms() {
    // Mock Data
    const classrooms = [
        { id: 1, name: 'Matemáticas 9°A', students: 32, avgGrade: 4.2 },
        { id: 2, name: 'Física 11°B', students: 28, avgGrade: 3.8 },
        { id: 3, name: 'Geometría 10°C', students: 30, avgGrade: 4.5 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Aulas</h2>
                    <p className="text-gray-500 dark:text-gray-400">Administra tus grupos y estudiantes</p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md">
                    <Plus size={20} />
                    Crear Aula
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classrooms.map((room) => (
                    <motion.div
                        key={room.id}
                        whileHover={{ y: -5 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
                    >
                        <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{room.name}</h3>
                                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg text-purple-600 dark:text-purple-400">
                                    <BookOpen size={20} />
                                </div>
                            </div>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <Users size={18} />
                                    <span>{room.students} Estudiantes</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <span className="font-bold text-lg text-green-500">{room.avgGrade}</span>
                                    <span className="text-sm text-gray-500">Promedio General</span>
                                </div>
                            </div>

                            <button className="w-full py-2 bg-gray-50 dark:bg-gray-700/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 dark:text-purple-300 font-medium rounded-lg transition-colors flex justify-center items-center gap-2">
                                Entrar al Aula
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </motion.div>
                ))}

                {/* Card para añadir nueva aula (Placeholder visual) */}
                <button className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center p-6 text-gray-400 hover:text-purple-500 hover:border-purple-300 transition-colors min-h-[250px]">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <Plus size={32} />
                    </div>
                    <span className="font-medium">Nueva Aula</span>
                </button>
            </div>
        </div>
    );
}
